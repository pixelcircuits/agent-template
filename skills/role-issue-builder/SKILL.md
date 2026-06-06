---
name: role-issue-builder
description: >
  Step 0 issue definition skill. Use when defining work, drafting issues,
  creating lightweight stub issues, gathering issue context from sources, or
  creating/updating issue.md for the agent workflow.
license: MIT
metadata:
  version: "1.0.0"
allowed-tools: Read Write Edit Glob Grep
---

# Role Issue Builder

Use this skill during Step 0 to turn a user request or gathered source material
into an `issue.md` file that planning and execution agents can rely on.

Always write `issue.md` to the repository root so later steps can find it at a
known path.

## Core Workflow

1. **Classify the issue depth.** Treat requests with tickets, logs, emails,
   meeting notes, reproduction details, or repo context as detailed issues.
   Treat narrow requests like formatting updates or simple cleanup as stub
   issues.

2. **Gather available context first.** For detailed issues, inspect any provided
   sources, tickets, notes, logs, attachments, or relevant repo files before
   asking follow-up questions.

3. **Ask only useful questions.** For stub issues, ask only for lightweight
   details that materially change the work. Do not block the workflow waiting for
   exhaustive detail when the request is intentionally simple.

4. **Preserve uncertainty.** Do not invent facts. Record missing information as
   unknowns, assumptions, open questions, or notes.

5. **Write a worker-focused artifact.** Keep `issue.md` concise, structured, and
   useful for Step 1 planning.

## `issue.md` Format

Use this structure for every `issue.md`:

```md
# <Title>

<Summary of the issue.>

## Sources

- <Source used, such as user prompt, GH issue, JIRA ticket, email, meeting note,
  log, PR, repo inspection, or attachment.>

## Replication

- <Replication steps, observed behavior, or "Not applicable / not provided".>

## Requirements

- <Hard requirements that have been established.>

## Expectations

- <Expected end result after the work is complete.>

## Assumptions

- <Assumptions made because details are incomplete or intentionally lightweight.>

## Notes

- <Other relevant context for planning or execution.>
```

Add these sections only when they are useful:

- `## Out of Scope`: known non-goals or boundaries.
- `## Open Questions`: unresolved questions that should be answered before or
  during planning.
- `## Definition of Done`: concrete validation criteria for considering the issue
  resolved.

## Sources Guidance

Always state what sources were used. If there are no external sources, say so
directly in `## Sources`, for example:

```md
## Sources

- User prompt only. No external ticket, log, note, or repo source was provided.
```

When sources conflict, call out the conflict in `## Notes` or `## Open Questions`
instead of silently choosing one.

## Stub Issues

Stub issues are acceptable when the user wants a simple issue created quickly.
They still need a clear title, summary, sources, requirements, expectations, and
assumptions, but each section can be short.

For a request like "create an issue for a simple formatting update across the
repo", the issue should state that replication is not applicable, the source is
the user prompt, and assumptions may include the expected formatter or scope if
the user did not specify them.

## Quality Bar

- Requirements are hard constraints, not preferences.
- Expectations describe the desired completed state.
- Assumptions explain what is being treated as true without full confirmation.
- Notes contain useful context that does not belong in another section.
- Open questions should not prevent a stub issue unless they materially change
  whether the work should proceed.

## Skill Maintenance

An agent may update this skill when the user asks for skill changes. To find the
source repository, read the single path in this skill directory's `source.txt`,
then edit the matching source files under that repo's
`skills/role-issue-builder/`. After updating the source, run the repo root
`install-skills.sh` script so the installed skill copies are refreshed.
