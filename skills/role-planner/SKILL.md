---
name: role-planner
description: >
  Step 1 planning skill. Use when turning issue.md, tickets, user requests, or
  repo context into a durable root plan.md for phased agent execution.
license: MIT
metadata:
  version: "1.0.0"
allowed-tools: Read Write Edit Glob Grep Bash(git:*)
---

# Role Planner

Use this skill during Step 1 to create a root `plan.md` that an execution agent
can follow from a fresh context.

The plan is a handoff artifact, not a private scratchpad. It should preserve the
requirements, decisions, phase boundaries, and validation expectations needed to
complete the issue without rediscovering the same context.

## Core Workflow

1. **Find or create the issue artifact.** Read root `issue.md` first. If it does
   not exist, use the `role-issue-builder` rules to create a stub `issue.md` when
   the user prompt already gives enough context. If the work is still unclear,
   ask what the issue is about before planning.

2. **Gather implementation context.** Inspect only the repo files needed to
   understand likely scope, existing patterns, test commands, applicable
   `spec.md` guidance, and risk. Prefer existing architecture and conventions
   over new abstractions.

3. **Read applicable specs.** Read the root `spec.md` and the closest applicable
   nested `spec.md` for likely change areas when they exist. Treat explicit user
   instructions and `issue.md` as fresher than specs for the current change.
   Copy relevant still-applicable constraints into `plan.md`; if the issue
   intentionally supersedes stale spec content, plan from the issue and note the
   needed spec maintenance. Do not create, edit, or delete `spec.md` files unless
   the user specifically asks for spec updates.

4. **Copy hard requirements forward.** Put established requirements near the top
   of `plan.md`, including hard requirements copied from `issue.md`. Preserve
   unresolved uncertainty as assumptions or open questions instead of inventing
   facts.

5. **Split into runnable phases.** Break the plan into phases when expected work
   exceeds about 400 changed lines or 7 changed files. The threshold can be
   exceeded when splitting would leave the app broken or make validation
   impossible.

6. **Make completion checkable.** Every phase must have an unchecked checkbox.
   Each phase should end with the app runnable and relevant tests passable when
   feasible.

7. **Include validation expectations.** Name the kinds of unit tests,
   regression checks, linters, formatters, and sanity checks expected, but leave
   exact test implementation details to the executor unless a specific test case
   is a hard requirement.

8. **Stage the plan.** After writing `plan.md`, stage it with `git add plan.md`.
   Do not stage unrelated files unless the user explicitly asks.

## `plan.md` Format

Use this structure by default:

```md
# <Issue Title> Plan

## Requirements

- <Hard requirement copied from issue.md or established by the user.>

## Assumptions

- <Assumption or "None".>

## Open Questions

- <Question or "None".>

## Phases

- [ ] Phase 1: <Short title>
  - Goal: <Outcome this phase delivers.>
  - Scope: <Main areas of code or behavior expected to change.>
  - Validation: <Tests/checks/sanity checks expected before marking done.>

- [ ] Phase 2: <Short title>
  - Goal: <Outcome this phase delivers.>
  - Scope: <Main areas of code or behavior expected to change.>
  - Validation: <Tests/checks/sanity checks expected before marking done.>

## Notes

- <Context useful to future executors or reviewers.>
```

Omit `Open Questions` only when there are none. Keep `Notes` short and useful.

## Phase Guidance

- Prefer phases that map to user-visible or testable behavior.
- Avoid phases that only rearrange code unless refactoring is necessary for a
  later behavior change.
- If a phase is expected to exceed the 400-line or 7-file threshold, state why in
  that phase.
- If UI validation is premature for an early phase, say so in the phase
  validation line.
- If a phase may not compile independently, state why and prefer a different
  split unless there is no practical runnable boundary.

## Quality Bar

- `plan.md` should be decision-complete enough for a new executor.
- Do not over-specify private implementation details when the codebase should
  guide them during execution.
- Do not modify `spec.md` files during planning unless the user specifically
  asks for spec updates.
- Requirements are hard constraints; expectations and notes are guidance.
- The plan should make review straightforward by tying each phase to validation.
