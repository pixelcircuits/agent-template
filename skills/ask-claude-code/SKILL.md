---
name: ask-claude-code
description: Ask Claude Code for advisory feedback from the current workspace. Use only when the user explicitly asks to consult Claude, Claude Code, Anthropic, or another Claude model for feedback, review, critique, validation, verification, or a second opinion. Do not use for ordinary review, verification, or critique requests that do not explicitly ask to involve Claude.
---

# Ask Claude Code

Consult Claude Code from the current workspace and use Claude's answer as advisory input for the parent agent's response. Use the bundled Bash helper so model defaults, effort defaults, prompt wrapping, and CLI error handling stay consistent.

## Workflow

1. Confirm the user explicitly requested Claude feedback. The explicit request is sufficient confirmation; do not ask for another approval before invoking Claude.
2. Select the Claude model:
   - Use the user-provided model when specified.
   - Otherwise use the helper default: `opus`.
   - Valid model values are any values accepted by `claude --model`, including current aliases such as `opus`, and `sonnet`, or a full Claude model name. Do not hard-code a closed model list in the parent workflow; let the Claude CLI validate the selected model.
3. Select the effort:
   - Use the user-provided effort when specified.
   - Otherwise use the helper default: `high`.
   - Valid effort values are `low`, `medium`, `high`, `xhigh`, and `max`.
4. Resolve the helper path relative to this `SKILL.md` file, then run that script while keeping the parent agent's current workspace as the process working directory. Do not assume the workspace contains `skills/ask-claude-code/`.
5. Send the consultation request as command arguments or standard input. Do not create temporary prompt files.
6. Use Claude's response according to the user's original task. Present raw Claude feedback only when the user asked for it; otherwise summarize or incorporate Claude's agreement, disagreement, additions, or cautions into the final response with clear attribution.

## Helper Usage

Use the bundled Bash helper:

```bash
<skill-dir>/scripts/ask-claude-code.sh [--model MODEL] [--effort EFFORT] [--] [PROMPT...]
```

`<skill-dir>` is the directory containing this `SKILL.md`, not necessarily a path inside the current repository.

Parameters:

- `--model MODEL`: Pass `MODEL` to `claude --model`. Defaults to `opus`. Accepted values are whatever the installed Claude CLI accepts, including aliases such as `opus`, and `sonnet`, or full Claude model names.
- `--effort EFFORT`: Pass `EFFORT` to `claude --effort`. Defaults to `high`. Valid values are `low`, `medium`, `high`, `xhigh`, and `max`.
- `PROMPT...`: Consultation request. If omitted, the helper reads the request from standard input.

Examples:

```bash
/path/to/ask-claude-code/scripts/ask-claude-code.sh --model opus --effort high -- "Review openspec/changes/example/proposal.md and design.md."
```

```bash
printf '%s\n' "Run opsx:verify for change example and report any concerns." \
  | /path/to/ask-claude-code/scripts/ask-claude-code.sh --effort high
```

The helper invokes:

```bash
claude -p --no-session-persistence --output-format text --model "$model" --effort "$effort"
```

It also always passes:

```bash
--allowedTools WebFetch WebSearch "Bash(curl *)" "Bash(wget *)" "Bash(http *)" "Bash(https *)" "Bash(gh api *)"
```

This gives Claude normal network/API access for web retrieval, search, HTTP clients, and `gh api` calls. It intentionally does not pass `--safe-mode`, `--disable-slash-commands`, empty `--tools`, `--dangerously-skip-permissions`, `--permission-mode bypassPermissions`, or context-only prompt content. Claude should retain normal workspace discovery, skills, slash commands, plugins, and project context while avoiding a blanket permission bypass.

## Consultation Prompt

The helper wraps the user request with an advisory instruction:

- Provide advisory feedback only.
- Do not edit files, run destructive commands, or take over implementation unless the user request explicitly asks Claude Code to implement changes.
- Use normal project context, skills, slash commands, plugins, workspace discovery, and network/API access when relevant.

When the user explicitly asks Claude to implement changes, pass that request through; otherwise treat the consultation as advice-only.

## Using Claude's Response

Claude's stdout is plain text that may contain Markdown formatting. It is not an `.md` file and does not need to be shown verbatim unless the user asked for Claude's raw feedback.

Use the response as advisory evidence:

- If the user asked specifically for Claude's review or second opinion, present Claude's feedback under a clear label.
- If Claude was a follow-up check during a broader task, integrate the result briefly in the final answer, such as "Claude agreed with the approach", "Claude flagged one additional risk", or "Claude disagreed on X". A short note or footnote is enough when the raw response would distract from the user's requested output.
- If you add your own judgment, keep it distinguishable from Claude's contribution.

Do not imply Claude's feedback is authoritative. Treat it as a consulted opinion for the parent agent to weigh.

If the helper reports that `claude` is missing, authentication failed, permissions failed, or Claude exited non-zero, tell the user that Claude feedback could not be obtained and include the relevant stderr summary.

## Claude-to-Claude Use

It is valid for Claude Code to use this skill to ask another Claude Code run for a second opinion. In that case, ask for one direct advisory answer and discourage further recursive consultation unless the user explicitly requested a chain of Claude consultations.
