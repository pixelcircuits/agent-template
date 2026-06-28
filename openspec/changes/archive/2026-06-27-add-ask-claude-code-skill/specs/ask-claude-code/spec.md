## ADDED Requirements

### Requirement: Skill triggers only for explicit Claude consultation
The system SHALL provide an `ask-claude-code` skill that is applicable only when the user explicitly asks an agent to ask Claude, Claude Code, Anthropic, or another Claude model for feedback, review, critique, validation, verification, or a second opinion.

#### Scenario: User explicitly asks for Claude feedback
- **WHEN** the user asks to get feedback from Claude Code on a proposal, code change, spec, design, task list, or implementation
- **THEN** the `ask-claude-code` skill is applicable

#### Scenario: User asks for ordinary review without naming Claude
- **WHEN** the user asks the current agent to review code, review a proposal, verify a change, or critique a design without explicitly asking to consult Claude
- **THEN** the `ask-claude-code` skill is not applicable

### Requirement: Claude runs in the current workspace
The skill SHALL invoke Claude Code from the parent agent's current workspace so Claude can inspect the same repository files, git state, project instructions, installed skills, plugins, and OpenSpec artifacts.

#### Scenario: Claude is asked to review OpenSpec artifacts
- **WHEN** the user asks Claude to review `proposal.md`, `design.md`, `spec.md`, or `tasks.md` for a change
- **THEN** Claude is launched from the workspace containing those artifacts

#### Scenario: Claude needs project skills
- **WHEN** the requested feedback depends on Claude skills or project-level instructions
- **THEN** the invocation preserves Claude's normal skill and project context discovery

### Requirement: Claude skills remain enabled
The skill SHALL NOT disable Claude skills, slash commands, plugins, or normal workspace context as part of the default invocation.

#### Scenario: User asks Claude to run an OpenSpec workflow
- **WHEN** the user asks Claude to run a workflow such as `opsx:verify`
- **THEN** the invocation allows Claude to access its normal skills and slash-command environment

### Requirement: Claude has scoped read, review, and network API tools
The skill SHALL launch Claude Code with scoped built-in tools and allowed tool patterns for workspace inspection, shell-based review commands, web retrieval, search, common HTTP client commands, selected GitHub CLI commands, and `gh api` calls without enabling edit tools or a blanket permission bypass.

#### Scenario: Claude inspects workspace context
- **WHEN** Claude is launched for advisory feedback
- **THEN** the invocation makes `Read`, `Glob`, `Grep`, `LS`, and `Bash` available through `--tools`

#### Scenario: Claude receives explicit allowed tool patterns
- **WHEN** Claude is launched for advisory feedback
- **THEN** the invocation passes `--allowedTools` entries for `Read`, `Glob`, `Grep`, `LS`, `WebFetch`, `WebSearch`, permitted Bash review commands, permitted Bash HTTP client commands, selected GitHub PR/check/run commands, and `gh api`

#### Scenario: Claude runs read-only review commands
- **WHEN** the consultation requires local repository inspection
- **THEN** the invocation allows shell commands for `git status`, `git diff`, `git log`, `git show`, `git blame`, `rg`, `find`, `sed`, `wc`, `nl`, and `head`

#### Scenario: Claude needs external context
- **WHEN** the consultation request requires current external context, API data, or repository-hosted GitHub data
- **THEN** the invocation allows `WebFetch`, `WebSearch`, common HTTP client Bash commands, selected GitHub PR/check/run commands, and `gh api` Bash commands

#### Scenario: Scoped access avoids edit and bypass permissions
- **WHEN** the helper grants read, review, and network/API access
- **THEN** it does not make edit tools available and does not use `--dangerously-skip-permissions` or `--permission-mode bypassPermissions`

### Requirement: Consultation is advice-only by default
The skill SHALL instruct Claude to provide advice only and not edit files unless the user explicitly asks Claude to implement changes.

#### Scenario: User asks Claude to review code
- **WHEN** the user asks Claude to review code or artifacts
- **THEN** the prompt sent to Claude includes an instruction to provide feedback only and not edit files

#### Scenario: User explicitly asks Claude to implement
- **WHEN** the user explicitly asks Claude to implement changes through the consultation skill
- **THEN** the prompt may reflect that implementation request instead of advice-only review

### Requirement: Model and effort are configurable
The skill SHALL support user-specified Claude model and effort values and SHALL provide documented defaults when either value is omitted. The skill SHALL document that model values are values accepted by the Claude CLI, including aliases such as `opus`, `sonnet`, and `fable`, or full Claude model names.

#### Scenario: User specifies model and effort
- **WHEN** the user asks to consult Claude with a specific model and effort level
- **THEN** the invocation passes those values to `claude --model` and `claude --effort`

#### Scenario: User omits model or effort
- **WHEN** the user asks to consult Claude without specifying a model or effort
- **THEN** the skill uses its documented default model and effort values

### Requirement: Invocation uses a shell entrypoint backed by a Node.js helper
The skill SHALL provide a shell entrypoint for stable invocation and a Node.js helper script for argument parsing, Claude process management, streaming output handling, progress reporting, and error handling. The skill SHALL NOT require a Python script for normal operation.

#### Scenario: Parent agent needs to ask Claude
- **WHEN** the skill is used to consult Claude
- **THEN** the parent agent invokes the bundled shell entrypoint rather than retyping the full Claude command

#### Scenario: Skill is installed outside the current repository
- **WHEN** the parent agent invokes the shell entrypoint
- **THEN** it resolves the helper path relative to the installed skill directory rather than assuming the current workspace contains `skills/ask-claude-code/`

#### Scenario: Shell entrypoint delegates to Node.js helper
- **WHEN** the shell entrypoint starts
- **THEN** it locates `ask-claude-code.mjs` in the same script directory and `exec`s it with the original arguments

### Requirement: Claude invocation uses streaming JSON internally
The helper SHALL invoke Claude in non-interactive print mode with verbose streaming JSON and partial messages so it can stream advisory text while reporting progress.

#### Scenario: Claude is invoked
- **WHEN** the helper starts Claude
- **THEN** it passes `-p`, `--verbose`, `--no-session-persistence`, `--output-format stream-json`, `--include-partial-messages`, `--model`, `--effort`, `--tools`, and `--allowedTools`

#### Scenario: Claude emits text deltas
- **WHEN** Claude emits streaming text delta events
- **THEN** the helper writes only the advisory text to stdout

#### Scenario: Claude emits a final non-streamed result
- **WHEN** Claude completes with a text result but no text deltas were streamed
- **THEN** the helper writes the result text to stdout

#### Scenario: Claude emits progress events
- **WHEN** Claude emits initialization, status, response start, tool-use start, result, stderr, or non-JSON output
- **THEN** the helper writes progress and diagnostic output to stderr

### Requirement: Claude response is advisory text
The skill SHALL make Claude's response available to the parent agent as plain text on stdout without requiring JSON schema output.

#### Scenario: Claude returns feedback
- **WHEN** Claude completes the advisory request successfully
- **THEN** the parent agent receives a plain text response that may include Markdown formatting

#### Scenario: Streaming text lacks a trailing newline
- **WHEN** Claude's streamed advisory response does not end with a newline
- **THEN** the helper appends a final newline after Claude exits

#### Scenario: Parent agent presents feedback
- **WHEN** the parent agent shares the response with the user
- **THEN** the parent agent identifies Claude's contribution and keeps any parent-agent commentary separate

#### Scenario: Claude is a secondary check during a broader task
- **WHEN** the user asks the parent agent to complete a broader task and also consult Claude
- **THEN** the parent agent may summarize Claude's agreement, disagreement, additions, or cautions instead of presenting Claude's full response verbatim

### Requirement: Runtime progress is reported consistently
The helper SHALL emit liveness and progress messages to stderr while preserving stdout for Claude's advisory response.

#### Scenario: Claude starts
- **WHEN** the helper launches Claude
- **THEN** it reports the selected model and effort to stderr

#### Scenario: Claude is still running
- **WHEN** Claude remains active without recent visible progress
- **THEN** the helper emits periodic stderr heartbeat messages that include elapsed time since last progress and last event

#### Scenario: Claude completes
- **WHEN** Claude emits a successful final result event
- **THEN** the helper reports completion and duration to stderr when duration is available

### Requirement: Explicit request is sufficient confirmation
The skill SHALL NOT ask for additional user confirmation before invoking Claude when the user has explicitly requested Claude feedback.

#### Scenario: User asks to ask Claude
- **WHEN** the user explicitly asks the parent agent to ask Claude for feedback
- **THEN** the parent agent may invoke Claude without an extra confirmation prompt

### Requirement: Runtime failures are reported clearly
The skill SHALL report Claude invocation failures clearly, including missing CLI, authentication failures, permission failures, or non-zero exit status.

#### Scenario: Claude CLI is unavailable
- **WHEN** the helper cannot find the `claude` command
- **THEN** it reports that the Claude Code CLI is unavailable

#### Scenario: Claude invocation fails
- **WHEN** the Claude CLI exits unsuccessfully
- **THEN** the parent agent reports that Claude feedback could not be obtained and includes the relevant error summary

#### Scenario: Claude invocation is terminated by signal
- **WHEN** the Claude CLI process is terminated by a signal
- **THEN** the helper reports the signal and exits unsuccessfully

#### Scenario: Claude exits without a final result event
- **WHEN** the Claude CLI process exits successfully but no final result event was observed
- **THEN** the helper reports that condition to stderr
