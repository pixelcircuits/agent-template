## Context

This repository contains portable skills that can be installed into both Codex and Claude skill directories. The new `ask-claude-code` skill should let a parent agent explicitly ask Claude Code for advisory feedback from the same workspace, using Claude's normal project context, skills, plugins, and OpenSpec workflows.

The skill is intended for second-opinion tasks such as "ask Claude to review this code", "have Claude run opsx:verify", or "ask Claude Opus at high effort to review proposal.md, design.md, and tasks.md". It is not a generic review trigger and should not activate unless the user explicitly asks to consult Claude.

## Goals / Non-Goals

**Goals:**

- Provide a portable `ask-claude-code` skill with a concise `SKILL.md`, `agents/openai.yaml`, a shell entrypoint, and a Node.js helper script.
- Run Claude Code from the current workspace so it can inspect the same files, git state, project instructions, skills, plugins, and OpenSpec artifacts as the parent agent.
- Support caller-selected Claude model and effort values while providing defaults.
- Make Claude's plain text response available to the parent agent as advisory input.
- Keep Claude's normal skills available by default.
- Provide scoped read, review, and network/API tools so Claude can inspect the workspace and fetch external context without edit tools or blanket permission bypass.
- Add an advisory instruction that Claude must not edit files and should return feedback only.

**Non-Goals:**

- Do not implement a context-only mode that embeds selected files into a prompt instead of letting Claude inspect the workspace.
- Do not sandbox Claude by disabling skills, slash commands, project context, or normal workspace discovery.
- Do not ask for user confirmation before invoking Claude after the user has explicitly requested Claude feedback.
- Do not make Claude's response authoritative; the parent agent may summarize or separately evaluate it.
- Do not support structured JSON output in the initial version.

## Decisions

### Use a shell entrypoint around a Node.js `claude -p` wrapper

Use the bundled `scripts/ask-claude-code.sh` as the deterministic invocation surface. The shell script should resolve its own directory and `exec` the adjacent `ask-claude-code.mjs` helper with the original arguments. The parent agent should resolve the shell entrypoint relative to the installed skill directory, not assume a `skills/ask-claude-code/` path in the current workspace. The Node.js helper should parse model, effort, and prompt arguments, spawn `claude`, run from the caller's current working directory, stream Claude's advisory text to stdout, and write progress and diagnostics to stderr.

Alternatives considered:

- Invoke `claude` directly from `SKILL.md`: simpler but repeats quoting, validation, and defaults across agents.
- Keep all process handling in Bash: rejected because parsing stream-json events, preserving stdout, and emitting progress are clearer in Node.js.
- Use Python: rejected because normal operation should not require Python.

### Run Claude in the same workspace with normal customizations enabled

The script should not pass `--safe-mode`, `--disable-slash-commands`, or context-only prompt content. Claude should see the same workspace and be able to use available skills such as OpenSpec verification. The helper should pass a non-empty `--tools` list of `Read,Glob,Grep,LS,Bash` and use `--allowedTools` to permit `Read`, `Glob`, `Grep`, `LS`, read/review shell commands, web retrieval/search, HTTP clients, selected GitHub CLI commands, and `gh api`.

Alternatives considered:

- Disable skills for safety: rejected because the target use case is asking Claude to use its own workflows, including `opsx:verify`.
- Pass only selected context: rejected because the intended value is Claude inspecting the live workspace.

### Keep the invocation advisory by prompt and scoped tools

The parent prompt sent to Claude should include a standard instruction: "Provide advice only. Do not edit files." This preserves Claude's ability to inspect and verify while keeping the expected output as feedback.

Alternatives considered:

- Enable edit tools or run with blanket permission bypass: rejected because advisory consultation should inspect and fetch context without making direct edits.
- Allow implementation by default: rejected because the skill is for advice, review, critique, and verification feedback.

### Support model and effort passthrough

The skill should accept explicit model and effort values from the user's request and pass them through to `claude --model` and `claude --effort`. Defaults should be documented in the skill and centralized in the Bash script. Effort has a stable known set (`low`, `medium`, `high`, `xhigh`, `max`) and should be validated by the helper. Model values are CLI-defined and may be aliases such as `opus`, `sonnet`, or `fable`, or full Claude model names, so the helper should document examples but let the Claude CLI validate the selected model.

Alternatives considered:

- Hard-code a single model and effort: rejected because the user specifically wants different models and thinking levels.
- Ask the user when omitted: rejected because omission can be handled by defaults.

### Preserve advisory text output while reporting progress

The script should request `stream-json` output with partial messages, parse Claude's JSON events, and write only Claude's advisory text to stdout. Progress, status, tool-use notices, heartbeat messages, Claude stderr, non-JSON diagnostics, completion details, and runtime errors should go to stderr. The parent agent should treat stdout as advisory input: present it directly when the user asked for Claude's raw feedback, or summarize Claude's agreement, disagreement, additions, and cautions when Claude was only a secondary check during a broader task.

Alternatives considered:

- Request `--output-format text`: rejected because it does not provide enough structured runtime progress for long-running consultations.
- JSON schema output: rejected because the desired handoff is plain text advice.

## Risks / Trade-offs

- Claude may use skills or tools that attempt edits despite the advisory prompt -> Mitigate by putting "advice only, do not edit files" in the generated prompt and skill instructions, and by testing advisory examples.
- Non-interactive Claude runs can fail because the CLI is missing, unauthenticated, requires permissions, exits non-zero, terminates by signal, or exits without a final result event -> Mitigate with spawn error handling, clear stderr messages, and non-zero exit codes where appropriate.
- Long-running Claude consultations can look stalled -> Mitigate with stderr progress messages derived from stream-json events and periodic heartbeat messages.
- Same-workspace execution may consume more tokens or time than context-only mode -> Accept because live workspace inspection is the intended value.
- The skill may trigger too broadly for ordinary review requests -> Mitigate with strict frontmatter language requiring explicit Claude consultation wording.
- Claude-to-Claude recursion is possible -> Accept as supported behavior, but instruct the child Claude to return a single advisory answer rather than starting another consultation unless the user explicitly requested chaining.

## Migration Plan

1. Add the new skill directory, shell entrypoint, and Node.js helper script.
2. Add OpenAI-facing metadata for the skill.
3. Validate the skill folder structure.
4. Run non-network script validation paths such as missing-argument/help handling, shell syntax checking, and Node syntax checking.
5. Optionally smoke-test a real Claude invocation when Claude CLI auth and network access are available.

Rollback is to remove `skills/ask-claude-code/` and the associated OpenSpec capability before archiving.

## Open Questions

- Should the helper include a timeout, or leave long Claude reviews to the parent process/tool timeout?
