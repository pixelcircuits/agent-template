## Context

The repository already contains skills that guide specialized workflows. The proposed research behavior is different from workflow execution: it gathers context from optional external systems and then hands a compact brief to whatever downstream work the user wants to do.

The skill should live under `skills/` so it can later be installed into the model skill set. It should work as an explicit companion to any task or skill that benefits from external context. The skill must not require any specific connector to exist; it should discover what is available and search only sources exposed by the current runtime.

## Goals / Non-Goals

**Goals:**
- Add a reusable skill for read-only external context research before downstream work.
- Make the skill source-agnostic across Gmail, Obsidian, Git issue systems, Jira, Linear, ticket trackers, meeting notes, and similar sources.
- Require sub-agent searches for every available source family when sub-agent tooling is available, including single-source research, so large source material stays isolated from the main context.
- Produce a concise research brief suitable for use as context by the user or another skill/tool.
- Preserve user control by making research explicit instead of automatically searching external systems from unrelated workflows.

**Non-Goals:**
- Do not modify existing workflow skills as part of this change.
- Do not create a first-class research artifact or storage format yet.
- Do not implement source-specific scripts or hardcoded connector namespaces.
- Do not allow the skill to mutate external systems.

## Decisions

1. **Create a standalone skill under `skills/external-context-research`.**

   This keeps retrieval behavior separate from downstream workflow execution and makes the skill installable with the repo's skill set. The alternative was editing individual workflow skills, but that would make external research automatic and would couple unrelated work to connector availability.

2. **Use explicit composition with downstream work.**

   The intended user flow is to invoke the research skill when the user wants external context before another task. This makes research opt-in and discoverable while avoiding hidden mailbox, notes, or ticket searches when the user wants a quick answer or simple edit.

3. **Delegate source searches to sub-agents.**

   The parent agent should derive the topic and search terms, discover available tool families, spawn one read-only sub-agent per source family, and synthesize the returned findings. This keeps large source payloads, such as hours-long meeting transcripts, long email threads, or ticket histories, out of the parent context. When multiple source families are available, the sub-agents should run in parallel when supported.

4. **Use source families rather than fixed tools.**

   The skill should search for available capabilities by intent, such as email, notes, issue tracking, ticket tracking, and meeting notes. This avoids brittle dependency on exact MCP server names and lets the same skill work with Gmail, Obsidian, GitHub, Jira, Linear, or future alternatives.

5. **Return a brief, not raw dumps.**

   The output should separate discovered facts from user-stated requirements, include source identifiers, call out conflicts, and list coverage. The skill should read high-signal hits only and avoid broad mailbox or vault extraction.

## Risks / Trade-offs

- **Unexpected private-data access** -> Keep the flow explicit, read-only, and source-limited; require source trails and coverage reporting.
- **Sub-agent tools unavailable** -> Report that context-isolated research cannot proceed; do not pull external source data into the parent context.
- **Connector naming varies** -> Discover tools by capability terms instead of fixed namespaces.
- **Research slows downstream work** -> Use small result caps, independent source agents, and concise synthesis.
- **Findings conflict across sources** -> Preserve conflicts in the brief instead of silently choosing one source; when timestamped sources conflict about the same scope, newer signals supersede older ones unless there is evidence the newer source is stale, erroneous, or scoped differently.
