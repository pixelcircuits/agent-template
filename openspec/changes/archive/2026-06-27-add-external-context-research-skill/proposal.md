## Why

User work often depends on context that may live outside the repository, such as email threads, notes, meeting records, and ticket discussions. A reusable research skill will let users gather and synthesize external context before doing any downstream task, without baking source-specific retrieval logic into other skills.

## What Changes

- Add a repository skill under `skills/` for general external context research.
- Define a read-only research workflow that discovers available connectors and delegates source searches to sub-agents for context isolation.
- Support explicit user-driven composition, so research can run before any downstream work that benefits from external context.
- Require the skill to degrade gracefully when Gmail, Obsidian, Git issue tools, Jira, Linear, meeting-note sources, or other relevant connectors are unavailable.
- Require the skill to produce a compact research brief with findings, source trails, coverage, conflicts, and open questions.

## Capabilities

### New Capabilities
- `external-context-research`: Defines read-only retrieval and synthesis behavior for gathering external context from available connected sources.

### Modified Capabilities

## Impact

- Adds a new skill directory under `skills/` intended for later installation into the model skill set.
- Uses sub-agent delegation for source research when the runtime exposes sub-agent tools, including single-source research.
- May use available read/search connectors for Gmail, Obsidian, GitHub/GitLab, Jira/Linear, ticket trackers, meeting notes, or similar sources.
- Does not change application code or existing workflow skills.
