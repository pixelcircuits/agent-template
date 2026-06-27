---
name: external-context-research
description: Gather read-only external context for any task, decision, investigation, implementation, plan, document, or question while isolating retrieval in sub-agents. Use when a user asks to research background or connected sources such as Gmail/email threads, Obsidian or other notes, meeting notes, Git/GitHub/GitLab issues or PRs, Jira, Linear, ticket trackers, project-management tools, documents, or other external context sources before doing downstream work.
---

# External Context Research

## Purpose

Gather concise, source-backed context from available external systems before doing downstream work. Use this when the user wants external context synthesized before making a decision, writing a document, planning work, implementing a change, answering a question, or investigating a topic.

Do not modify tickets, notes, email, documents, project records, or any external system while researching.

## Workflow

1. Identify the research topic and downstream task from the user's request.
2. Derive search terms.
3. Discover available read/search capabilities by source family.
4. Search available sources in sub-agents when sub-agent tooling is available.
5. Synthesize a compact research brief for the user or the next skill/tool in the workflow.

Complete the research brief before beginning the downstream work that depends on the external context. Treat the brief as context, not as permission to mutate any source system.

## Derive Search Terms

Build a small query set before searching:

- Include the main feature, bug, system, domain object, team, customer, and repo names mentioned by the user.
- Add likely synonyms, abbreviations, old names, ticket keys, issue numbers, PR numbers, and project names when visible in the request or repo context.
- Include exact quoted phrases for distinctive terms.
- Keep searches bounded. Start with 3-7 high-signal queries, then refine only when results show a better term.
- Record the terms used so source coverage can be reported.

Separate user-stated requirements from inferred search terms. Do not present inferred terms as facts unless a source confirms them.

## Read-Only Rules

Use only operations that read, search, list, fetch, or summarize existing information.

Forbidden actions include:

- Sending, drafting, forwarding, archiving, deleting, labeling, or marking email.
- Creating, editing, moving, deleting, tagging, or linking notes.
- Creating, editing, closing, assigning, labeling, commenting on, or transitioning issues, PRs, Jira tickets, Linear issues, or other tracker items.
- Writing meeting notes, updating calendars, changing project metadata, or mutating external systems in any way.

If a connector exposes both read and write tools, use only the read/search tools. If the available tool names or permissions are unclear, skip that source and report it as unavailable or unsafe to use.

## Capability Discovery

Discover tools by capability terms and source family, not by fixed connector names. Search the current runtime for read/search capabilities using terms such as:

- `email`, `mail`, `gmail`, `thread`, `message`
- `notes`, `obsidian`, `vault`, `meeting notes`, `document`
- `git`, `github`, `gitlab`, `issue`, `pull request`, `merge request`, `commit`
- `jira`, `linear`, `ticket`, `tracker`, `project`
- Any other source family implied by the user's request

Group discovered read/search tools into source families. Include a source family in the research plan only when at least one safe read/search operation is available.

## Sub-Agent Research

When sub-agent tooling is available, do all external source research inside sub-agents, even if only one source family is available. This isolates large source payloads, such as long email threads, issue histories, documents, or meeting transcripts, from the main thread.

Spawn one sub-agent per source family. If only one source family can be searched, spawn one sub-agent for that family. Each sub-agent task must include:

- The research topic and downstream task.
- The derived search terms relevant to that source.
- The explicit read-only constraints.
- Small result limits and instructions to read only high-signal hits, while allowing the sub-agent to inspect longer source material when needed to extract relevant facts.
- The required output shape: concise findings, source identifiers, conflicts, open questions, and searched terms.

Keep each sub-agent focused on one source family. Run source-family searches in parallel when multiple source families are available and the tools support it, then synthesize after all results return.

The parent agent should not pull raw transcripts, long threads, broad note dumps, or large ticket histories into the main context when sub-agent tooling is available. Ask sub-agents to return only relevant excerpts, facts, citations, conflicts, and coverage notes needed for synthesis.

If sub-agent tooling is unavailable, do not perform external source research in the parent context. Report that context-isolated research cannot proceed without sub-agent tooling. If an individual source connector is unavailable, report that coverage gap and continue with available sources that can be researched through sub-agents.

## Source-Family Tasks

Email:

- Search relevant threads and messages using topic terms, names, and ticket or project identifiers.
- Read only high-signal threads.
- Return decisions, requirements, timelines, stakeholders, unresolved questions, and message/thread identifiers.

Notes and meeting notes:

- Search notes, meeting records, docs, and vaults for the topic and related identifiers.
- Read only high-signal notes.
- Return decisions, requirements, action items, risks, and vault-relative paths or document identifiers.

Git, issues, PRs, and merge requests:

- Search issues, PRs, commits, discussions, and project boards for related work.
- Return prior implementation decisions, open defects, linked changes, status, owners, and issue/PR URLs or IDs.

Ticket trackers such as Jira and Linear:

- Search tickets by topic terms, labels, project names, and identifiers.
- Return scope, acceptance criteria, status, dependencies, blockers, and ticket IDs or URLs.

Other discovered context sources:

- Search only when a read/search capability is clearly available.
- State what the source is, why it was searched, what terms were used, and what source identifiers support the findings.

## Research Brief

Produce concise synthesis instead of raw source dumps. Include these sections:

1. `User-Stated Requirements`: Facts and constraints directly from the user's request.
2. `Relevant External Context`: Source-backed facts that affect the downstream task.
3. `Discovered Requirements`: Requirements or acceptance criteria found in external sources.
4. `Prior Decisions`: Decisions, rejected approaches, ownership, or historical context.
5. `Risks and Dependencies`: Implementation risks, sequencing concerns, blockers, privacy concerns, or operational constraints.
6. `Conflicts or Ambiguity`: Conflicting scope, status, decisions, or unclear facts, with sources on each side. When timestamped sources conflict, treat the newest timestamped signal as superseding older signals unless there is evidence that the newer source is stale, erroneous, or about a different scope.
7. `Open Questions`: Questions that should be resolved before or during the downstream work.
8. `Source Trails`: Compact citations using available source identifiers, such as thread IDs, message dates, note paths, issue URLs, PR numbers, ticket IDs, or document names.
9. `Source Coverage`: Sources searched, search terms used, sources unavailable, and any sub-agent or connector limitations.

When no relevant context is found, say that no relevant external context was found and list the sources searched. When sources disagree, preserve the conflict instead of choosing one side silently; if newer timestamped evidence supersedes older evidence, state that ordering and cite both.
