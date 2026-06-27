## 1. Skill Structure

- [x] 1.1 Create `skills/external-context-research/` with a required `SKILL.md`.
- [x] 1.2 Add recommended `agents/openai.yaml` metadata for the skill, if the repo's skill tooling supports generation.

## 2. Skill Instructions

- [x] 2.1 Write frontmatter with a trigger description covering general external context research, Gmail, Obsidian, Git/GitHub/GitLab, Jira/Linear, ticket trackers, meeting notes, and external context gathering.
- [x] 2.2 Document the explicit composition flow where users invoke this research skill before downstream work that benefits from external context.
- [x] 2.3 Document read-only constraints that forbid sending email, labeling messages, writing notes, editing tickets, commenting on issues, or mutating external systems.
- [x] 2.4 Document capability-based tool discovery using source-family searches instead of fixed connector names.

## 3. Parallel Research Workflow

- [x] 3.1 Specify how the parent agent derives search terms from the research topic and downstream task.
- [x] 3.2 Specify how the parent agent spawns sub-agents by source family when multi-agent tooling is available, including single-source research for context isolation.
- [x] 3.3 Specify source-family tasks for email, notes and meeting notes, Git/issues, ticket trackers, and other discovered context sources.
- [x] 3.4 Specify fallback behavior when sub-agent tooling or individual source connectors are unavailable.

## 4. Research Brief Output

- [x] 4.1 Define the required brief sections for relevant context, discovered requirements, prior decisions, risks, conflicts, open questions, source trails, and source coverage.
- [x] 4.2 Require the brief to distinguish user-stated requirements from externally discovered facts.
- [x] 4.3 Require concise synthesis instead of raw source dumps.

## 5. Validation

- [x] 5.1 Validate the skill frontmatter and folder structure with the repo's skill validation tooling if available.
- [x] 5.2 Review the skill against the `external-context-research` spec scenarios.
- [x] 5.3 Confirm no application code or existing workflow skill behavior was changed.
