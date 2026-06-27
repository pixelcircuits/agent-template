# external-context-research Specification

## Purpose
TBD - Defines the behavior for gathering read-only external context through source-specific research agents before downstream work.

## Requirements

### Requirement: Skill triggers for external context research
The system SHALL provide an `external-context-research` skill that is appropriate for gathering external context for any user task, decision, investigation, implementation, plan, document, or question.

#### Scenario: User asks for external background research
- **WHEN** a user asks to research external context before doing work
- **THEN** the skill is applicable before the downstream work begins

#### Scenario: User names specific external sources
- **WHEN** a user asks to research emails, chat or collaboration platforms, notes, workspace knowledge bases, tickets, issues, documents, or meeting notes for any topic
- **THEN** the skill is applicable for gathering and synthesizing that context

### Requirement: Research is read-only
The skill SHALL instruct agents to use only read and search operations against external sources.

#### Scenario: External source exposes write actions
- **WHEN** a connector exposes actions that send email, modify notes, update issues, label messages, comment on tickets, or otherwise mutate data
- **THEN** the skill forbids using those actions during research

### Requirement: Source discovery is capability-based
The skill SHALL discover available external context sources by searching for source capabilities rather than relying on fixed MCP server names.

#### Scenario: Gmail and Obsidian are available
- **WHEN** email and note search tools are discoverable
- **THEN** the skill includes email and note source families in the research plan

#### Scenario: Slack and Notion are available
- **WHEN** chat or workspace knowledge-base search tools are discoverable
- **THEN** the skill includes chat/collaboration and workspace knowledge-base source families in the research plan

#### Scenario: Jira is unavailable
- **WHEN** no Jira or ticket-tracking search tool is discoverable
- **THEN** the skill reports that ticket-tracking search was unavailable instead of failing the research process

### Requirement: Searches run through sub-agents for context isolation
The skill SHALL delegate source-family searches to sub-agents when sub-agent tooling is available, even when only one source family can be searched. When the sub-agent tool supports reasoning effort configuration, the skill SHALL spawn research sub-agents with medium reasoning effort.

#### Scenario: One source family is available
- **WHEN** one source family can be searched and sub-agent tooling is available
- **THEN** the parent agent spawns a sub-agent for that source family before synthesizing results

#### Scenario: Multiple source families are available
- **WHEN** at least two independent source families can be searched and sub-agent tooling is available
- **THEN** the parent agent spawns separate sub-agents for those source families and runs them in parallel when supported before synthesizing results

#### Scenario: Sub-agent reasoning effort is configurable
- **WHEN** the parent agent spawns a research sub-agent and the sub-agent tool supports reasoning effort configuration
- **THEN** the parent agent sets the research sub-agent reasoning effort to medium

#### Scenario: Large source material is relevant
- **WHEN** source searches may require inspecting long transcripts, threads, notes, documents, or ticket histories
- **THEN** the sub-agent extracts only relevant facts, excerpts, citations, conflicts, and coverage notes back into the parent context

#### Scenario: Sub-agent tooling is unavailable
- **WHEN** source search tools are available but sub-agent tooling is not available
- **THEN** the skill reports that context-isolated research cannot proceed and does not perform external source research in the parent context

### Requirement: Sub-agents receive bounded retrieval tasks
The skill SHALL give each sub-agent a source-specific task that includes the research topic, derived search terms, read-only constraints, and expected output shape.

#### Scenario: Gmail sub-agent is spawned
- **WHEN** the parent agent delegates email research
- **THEN** the sub-agent receives instructions to search relevant email threads, read only high-signal messages, and return concise findings with source identifiers

#### Scenario: Obsidian sub-agent is spawned
- **WHEN** the parent agent delegates notes research
- **THEN** the sub-agent receives instructions to search relevant notes and meeting notes, read only high-signal notes, and return concise findings with vault-relative paths

#### Scenario: Slack sub-agent is spawned
- **WHEN** the parent agent delegates chat or collaboration-platform research
- **THEN** the sub-agent receives instructions to search relevant channels, threads, conversations, and messages, read only high-signal conversations, and return concise findings with channel, thread, or message identifiers

#### Scenario: Notion sub-agent is spawned
- **WHEN** the parent agent delegates workspace knowledge-base research
- **THEN** the sub-agent receives instructions to search relevant pages, databases, docs, and team spaces, read only high-signal pages or records, and return concise findings with page, database, or document identifiers

### Requirement: Research brief is concise and source-backed
The skill SHALL synthesize findings into a compact research brief suitable for use by the user's downstream task.

#### Scenario: Relevant context is found
- **WHEN** one or more source searches return relevant findings
- **THEN** the brief includes relevant context, discovered requirements, prior decisions, risks, open questions, and source trails

#### Scenario: No relevant context is found
- **WHEN** all available source searches complete without relevant findings
- **THEN** the brief states that no relevant external context was found and lists the sources searched

### Requirement: Conflicts remain visible
The skill SHALL preserve conflicting or ambiguous findings in the research brief.

#### Scenario: Sources disagree
- **WHEN** different sources provide conflicting scope, requirements, status, or decisions
- **THEN** the brief identifies the conflict and cites the involved sources

#### Scenario: Timestamped sources disagree
- **WHEN** timestamped sources conflict about the same scope
- **THEN** the brief treats newer timestamped signals as superseding older signals unless evidence shows the newer source is stale, erroneous, or about a different scope
