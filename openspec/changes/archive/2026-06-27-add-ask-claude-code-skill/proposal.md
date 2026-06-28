## Why

Agents sometimes need a second opinion from Claude Code using a different model or thinking effort while staying grounded in the same workspace. This change adds a dedicated skill for explicitly asking Claude Code for advice, review, verification, or critique without turning that request into an implementation handoff.

## What Changes

- Add an `ask-claude-code` skill that only triggers when the user explicitly asks to get feedback from Claude, Claude Code, Anthropic, or another Claude model.
- Add a shell entrypoint and Node.js helper script that run `claude -p` from the current workspace, stream Claude's plain text response to stdout, and emit progress diagnostics to stderr.
- Support caller-provided Claude model and effort settings, with sensible defaults when the user does not specify them.
- Keep Claude Code skills and normal workspace context enabled so Claude can run workflows such as OpenSpec verification or artifact review.
- Grant Claude scoped read, review, and network/API tools without enabling edit tools or blanket permission bypass.
- Instruct Claude to provide advice only and not edit files unless the user explicitly requests implementation in the prompt.
- Require the parent agent to attribute Claude's contribution when presenting or incorporating Claude's feedback.

## Capabilities

### New Capabilities
- `ask-claude-code`: Explicitly delegate advisory feedback requests to Claude Code in the current workspace with configurable model and effort.

### Modified Capabilities

None.

## Impact

- Adds a new portable skill under `skills/ask-claude-code/`.
- Adds a Bash script resource for invoking the local `claude` CLI.
- Adds OpenAI-facing skill metadata under `skills/ask-claude-code/agents/openai.yaml`.
- Adds a new OpenSpec capability spec for `ask-claude-code`.
- Depends on a locally installed and authenticated Claude Code CLI for runtime use.
