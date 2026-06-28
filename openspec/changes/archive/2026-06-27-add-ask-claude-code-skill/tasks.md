## 1. Skill Scaffold

- [x] 1.1 Create `skills/ask-claude-code/` with `SKILL.md`, `scripts/`, and `agents/`.
- [x] 1.2 Add `agents/openai.yaml` with display name, short description, and default prompt aligned to the skill trigger.
- [x] 1.3 Ensure no extra README, installation guide, or nonessential documentation files are added to the skill.

## 2. Claude Invocation Helpers

- [x] 2.1 Implement `skills/ask-claude-code/scripts/ask-claude-code.sh` as a strict Bash entrypoint that resolves its script directory and `exec`s the adjacent Node.js helper.
- [x] 2.2 Implement `skills/ask-claude-code/scripts/ask-claude-code.mjs` as the Node.js helper with a concise usage message.
- [x] 2.3 Support caller-provided `--model` and `--effort` options, plus documented defaults when omitted.
- [x] 2.4 Accept the consultation prompt from command arguments or standard input without requiring temporary prompt files.
- [x] 2.5 Run `claude -p --verbose --no-session-persistence --output-format stream-json --include-partial-messages --model "$model" --effort "$effort"` from the caller's current workspace.
- [x] 2.6 Preserve Claude's normal skills, slash commands, plugins, and workspace context by avoiding `--safe-mode`, `--disable-slash-commands`, and context-only behavior.
- [x] 2.7 Pass `--tools "Read,Glob,Grep,LS,Bash"` and scoped `--allowedTools` entries for read/review shell commands, web retrieval/search, HTTP clients, selected GitHub CLI commands, and `gh api`.
- [x] 2.8 Prefix or wrap the user request with an advisory instruction that Claude should provide advice only and not edit files unless implementation was explicitly requested.
- [x] 2.9 Stream Claude text deltas to stdout while writing progress, heartbeat, tool-use, completion, stderr, and diagnostic messages to stderr.
- [x] 2.10 Report missing `claude`, invalid arguments, empty prompts, non-zero Claude exits, signal terminations, and missing final result events with clear stderr messages and appropriate exit codes.

## 3. Skill Instructions

- [x] 3.1 Write `SKILL.md` frontmatter so the skill triggers only for explicit Claude consultation requests and not for ordinary review or verification requests.
- [x] 3.2 Document the workflow for selecting model, selecting effort, running the shell entrypoint, and incorporating Claude's advisory feedback.
- [x] 3.3 Instruct the parent agent not to ask for extra confirmation once the user explicitly requested Claude feedback.
- [x] 3.4 Instruct the parent agent to identify Claude's contribution and keep any parent-agent commentary separate.
- [x] 3.5 Document Claude-to-Claude use as supported while discouraging further recursive consultation unless explicitly requested.

## 4. Validation

- [x] 4.1 Run `bash -n` on the shell entrypoint.
- [x] 4.2 Run `node --check` on the Node.js helper.
- [x] 4.3 Exercise the helper's help, missing prompt, and invalid option paths without invoking the network.
- [x] 4.4 Validate the skill folder with the skill-creator `quick_validate.py` script.
- [x] 4.5 Confirm the skill instructions and helper satisfy every scenario in `specs/ask-claude-code/spec.md`.
- [x] 4.6 If Claude CLI authentication and network access are available, run one real advisory smoke test and verify stdout is plain text and progress is emitted to stderr; otherwise record that the live smoke test was not run.
  - Live smoke test not run: external Claude CLI network/auth execution was not explicitly authorized in this environment.
