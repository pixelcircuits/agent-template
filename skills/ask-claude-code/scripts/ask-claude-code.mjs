#!/usr/bin/env node
import { spawn } from "node:child_process";
import { once } from "node:events";
import { createInterface } from "node:readline";

const defaultModel = "opus";
const defaultEffort = "high";
const heartbeatMs = 30_000;

const allowedTools = [
  "Read",
  "Glob",
  "Grep",
  "LS",
  "WebFetch",
  "WebSearch",
  "Bash(curl *)",
  "Bash(wget *)",
  "Bash(http *)",
  "Bash(https *)",
  "Bash(git status)",
  "Bash(git diff *)",
  "Bash(git log *)",
  "Bash(git show *)",
  "Bash(git blame *)",
  "Bash(rg *)",
  "Bash(find *)",
  "Bash(sed *)",
  "Bash(wc *)",
  "Bash(nl *)",
  "Bash(head *)",
  "Bash(gh pr view *)",
  "Bash(gh pr diff *)",
  "Bash(gh pr checks *)",
  "Bash(gh run view *)",
  "Bash(gh api *)",
];

function usage(stream = process.stdout) {
  stream.write(
    [
      `Usage: ${process.argv[1]?.split("/").pop() ?? "ask-claude-code.mjs"} [--model MODEL] [--effort low|medium|high|xhigh|max] [--] [PROMPT...]`,
      "",
      "Ask Claude Code for advisory feedback from the current workspace.",
      "",
      "Options:",
      "  --model MODEL    Any value accepted by 'claude --model', such as",
      "                   opus, sonnet, or a full Claude model name.",
      "                   The Claude CLI validates model names.",
      "  --effort EFFORT  One of: low, medium, high, xhigh, max.",
      "",
      "Defaults:",
      `  --model ${defaultModel}`,
      `  --effort ${defaultEffort}`,
      "",
      "If PROMPT is omitted, the prompt is read from standard input.",
      "",
    ].join("\n"),
  );
}

function error(message) {
  process.stderr.write(`ask-claude-code: ${message}\n`);
}

function usageError(message) {
  error(message);
  process.stderr.write("\n");
  usage(process.stderr);
  process.exit(2);
}

function isBlank(value) {
  return value.trim().length === 0;
}

function validateEffort(value) {
  if (!["low", "medium", "high", "xhigh", "max"].includes(value)) {
    usageError(
      `invalid effort '${value}' (expected low, medium, high, xhigh, or max)`,
    );
  }
}

function parseArgs(argv) {
  const promptArgs = [];
  let model = defaultModel;
  let effort = defaultEffort;
  let parsingOptions = true;

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];

    if (!parsingOptions) {
      promptArgs.push(arg);
      continue;
    }

    if (arg === "-h" || arg === "--help") {
      usage();
      process.exit(0);
    }

    if (arg === "--") {
      parsingOptions = false;
      continue;
    }

    if (arg === "--model") {
      const next = argv[i + 1];
      if (next === undefined || next === "") {
        usageError("--model requires a value");
      }
      model = next;
      i += 1;
      continue;
    }

    if (arg.startsWith("--model=")) {
      model = arg.slice("--model=".length);
      if (model === "") {
        usageError("--model requires a value");
      }
      continue;
    }

    if (arg === "--effort") {
      const next = argv[i + 1];
      if (next === undefined || next === "") {
        usageError("--effort requires a value");
      }
      effort = next;
      i += 1;
      continue;
    }

    if (arg.startsWith("--effort=")) {
      effort = arg.slice("--effort=".length);
      if (effort === "") {
        usageError("--effort requires a value");
      }
      continue;
    }

    if (arg.startsWith("-")) {
      usageError(`unknown option: ${arg}`);
    }

    parsingOptions = false;
    promptArgs.push(arg);
  }

  if (model === "") {
    usageError("--model requires a value");
  }
  validateEffort(effort);

  return { model, effort, promptArgs };
}

async function readStdin() {
  process.stdin.setEncoding("utf8");
  let input = "";
  for await (const chunk of process.stdin) {
    input += chunk;
  }
  return input;
}

async function readPrompt(promptArgs) {
  if (promptArgs.length > 0) {
    return `${promptArgs.join(" ")}\n`;
  }

  if (process.stdin.isTTY) {
    return "";
  }

  return readStdin();
}

function buildConsultationPrompt(userPrompt) {
  return [
    "You are Claude Code being consulted by another AI agent from the same workspace.",
    "",
    "Provide advisory feedback only. Do not edit files, run destructive commands, or take over implementation unless the user request below explicitly asks Claude Code to implement changes. Use the normal project context, skills, slash commands, plugins, workspace discovery, and network/API access when they are relevant to the request.",
    "",
    "User request:",
    userPrompt,
  ].join("\n");
}

function formatElapsed(ms) {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  if (minutes === 0) {
    return `${seconds}s`;
  }
  return `${minutes}m ${remainder}s`;
}

function writeProgress(message) {
  process.stderr.write(`ask-claude-code: ${message}\n`);
}

function writeAnswer(text, state) {
  process.stdout.write(text);
  state.streamedText = true;
  state.stdoutEndedWithNewline = text.endsWith("\n");
}

function extractToolName(contentBlock) {
  if (!contentBlock || typeof contentBlock !== "object") {
    return "";
  }
  if (typeof contentBlock.name === "string") {
    return contentBlock.name;
  }
  if (typeof contentBlock.tool_name === "string") {
    return contentBlock.tool_name;
  }
  return "";
}

function handleEvent(event, state) {
  state.lastEventAt = Date.now();

  if (event.type === "system" && event.subtype === "init") {
    const model = typeof event.model === "string" ? event.model : "unknown model";
    const sessionId =
      typeof event.session_id === "string" ? `, session ${event.session_id}` : "";
    writeProgress(`Claude initialized (${model}${sessionId})`);
    return;
  }

  if (event.type === "system" && event.subtype === "status") {
    if (typeof event.status === "string") {
      writeProgress(`Claude status: ${event.status}`);
    }
    return;
  }

  if (event.type === "stream_event") {
    const streamEvent = event.event;
    if (!streamEvent || typeof streamEvent !== "object") {
      return;
    }

    if (streamEvent.type === "message_start") {
      const model =
        typeof streamEvent.message?.model === "string"
          ? streamEvent.message.model
          : "unknown model";
      writeProgress(`assistant response started (${model})`);
      state.lastProgressAt = Date.now();
      return;
    }

    if (streamEvent.type === "content_block_start") {
      const block = streamEvent.content_block;
      if (block?.type === "tool_use") {
        const toolName = extractToolName(block);
        writeProgress(`Claude started tool${toolName ? `: ${toolName}` : ""}`);
        state.lastProgressAt = Date.now();
      }
      return;
    }

    if (
      streamEvent.type === "content_block_delta" &&
      streamEvent.delta?.type === "text_delta" &&
      typeof streamEvent.delta.text === "string"
    ) {
      writeAnswer(streamEvent.delta.text, state);
      state.lastProgressAt = Date.now();
      return;
    }

    if (streamEvent.type === "message_stop") {
      state.lastProgressAt = Date.now();
    }
    return;
  }

  if (event.type === "result") {
    state.seenResult = true;

    if (
      !state.streamedText &&
      typeof event.result === "string" &&
      event.result.length > 0
    ) {
      writeAnswer(event.result, state);
    }

    if (state.streamedText && !state.stdoutEndedWithNewline) {
      process.stdout.write("\n");
      state.stdoutEndedWithNewline = true;
    }

    if (event.is_error) {
      const detail =
        typeof event.result === "string" && event.result.length > 0
          ? `: ${event.result}`
          : "";
      writeProgress(`Claude returned an error result${detail}`);
    } else if (event.subtype === "success") {
      const duration =
        typeof event.duration_ms === "number"
          ? ` in ${formatElapsed(event.duration_ms)}`
          : "";
      writeProgress(`Claude completed${duration}`);
    }
  }
}

async function main() {
  const { model, effort, promptArgs } = parseArgs(process.argv.slice(2));
  const prompt = await readPrompt(promptArgs);

  if (isBlank(prompt)) {
    usageError("prompt is required via arguments or standard input");
  }

  const consultationPrompt = buildConsultationPrompt(prompt);
  const claudeArgs = [
    "-p",
    "--verbose",
    "--no-session-persistence",
    "--output-format",
    "stream-json",
    "--include-partial-messages",
    "--model",
    model,
    "--effort",
    effort,
    "--tools",
    "Read,Glob,Grep,LS,Bash",
    "--allowedTools",
    ...allowedTools,
  ];

  writeProgress(`starting Claude (${model}, effort ${effort})`);

  const child = spawn("claude", claudeArgs, {
    stdio: ["pipe", "pipe", "pipe"],
  });

  const state = {
    lastEventAt: Date.now(),
    lastProgressAt: Date.now(),
    seenResult: false,
    streamedText: false,
    stdoutEndedWithNewline: false,
  };

  child.on("error", (spawnError) => {
    if (spawnError.code === "ENOENT") {
      error("Claude Code CLI is unavailable: could not find 'claude' on PATH");
      process.exitCode = 127;
      return;
    }

    error(`failed to start Claude Code CLI: ${spawnError.message}`);
    process.exitCode = 1;
  });

  const heartbeat = setInterval(() => {
    const now = Date.now();
    const elapsed = formatElapsed(now - state.lastProgressAt);
    const eventIdle = formatElapsed(now - state.lastEventAt);
    writeProgress(
      `still waiting for Claude; last progress ${elapsed} ago, last event ${eventIdle} ago`,
    );
  }, heartbeatMs);
  heartbeat.unref();

  const stdoutReader = createInterface({
    input: child.stdout,
    crlfDelay: Infinity,
  });

  const stdoutTask = (async () => {
    for await (const line of stdoutReader) {
      if (line.trim() === "") {
        continue;
      }

      let event;
      try {
        event = JSON.parse(line);
      } catch {
        process.stderr.write(`${line}\n`);
        continue;
      }

      handleEvent(event, state);
    }
  })();

  child.stderr.setEncoding("utf8");
  child.stderr.on("data", (chunk) => {
    state.lastEventAt = Date.now();
    process.stderr.write(chunk);
  });

  child.stdin.end(consultationPrompt);

  const [status, signal] = await once(child, "close");
  await stdoutTask;
  clearInterval(heartbeat);

  if (state.streamedText && !state.stdoutEndedWithNewline) {
    process.stdout.write("\n");
  }

  if (signal) {
    error(`Claude Code invocation terminated by signal ${signal}`);
    process.exitCode = 1;
    return;
  }

  if (status !== 0) {
    error(
      `Claude Code invocation failed with exit status ${status}; check CLI output above for authentication, permission, or runtime details`,
    );
    process.exitCode = status ?? 1;
    return;
  }

  if (!state.seenResult) {
    writeProgress("Claude process exited without a final result event");
  }
}

main().catch((err) => {
  const message = err instanceof Error ? err.message : String(err);
  error(message);
  process.exitCode = 1;
});
