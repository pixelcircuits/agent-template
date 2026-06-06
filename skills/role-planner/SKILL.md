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

Creating the plan is the finish line for this skill. After `plan.md` is written,
stop and report that the plan file was created. Do not implement any plan phase,
invoke the executor workflow, run task validation, or mark plan items complete
unless the user explicitly asks for execution in a later request.

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

5. **Split into fully validated phases.** Break the plan into phases when
   expected work exceeds about 1000 changed lines or 15 changed files. The
   threshold can be exceeded when splitting would leave the app broken or prevent
   a phase from ending with the best validation available for its scope.

6. **Make state checkable.** Every phase must have a state marker in brackets.
   New phases start blank as `[ ]`. The only valid states are `[ ]`,
   `[executing]`, `[awaiting-review]`, `[reviewing]`, and `[done]`. Every phase
   must end with its implementation fully validated as well as it can be at that
   point: relevant tests, lint/type/format checks, build checks, smoke checks,
   manual verification, or a documented reason a stronger check is not available
   yet. Never add a separate "final checks", "QA", "testing", or "validation"
   phase. Put full build, lint, test, smoke, regression, and manual checks on the
   behavior-delivering phase they validate, with broad final checks on the last
   behavior-delivering phase.

7. **Include validation expectations.** Name the kinds of unit tests,
   regression checks, linters, formatters, and sanity checks expected, but leave
   exact test implementation details to the executor unless a specific test case
   is a hard requirement.

8. **Leave the plan unstaged.** After writing `plan.md`, do not stage it. The
   root `plan.md` is an ignored local handoff artifact, so attempts to add it to
   the index should fail unless a user intentionally changes the repo ignore
   rules.

9. **Stop after the handoff.** Once `plan.md` exists and is ready for an
   executor, finish the turn with a concise summary of the plan file. Do not
   start Phase 1 or continue into implementation.

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

Phase state markers are part of the workflow handoff:

- `[ ]`: ready for execution.
- `[executing]`: currently owned by an executor.
- `[awaiting-review]`: implementation and executor validation are complete; the
  phase is waiting for a reviewer. Executors do not close these, so several may
  accumulate here at once.
- `[reviewing]`: a reviewer has claimed the phase and is inspecting/staging the
  implementation changes.
- `[done]`: a reviewer has reviewed and staged the phase's changes.

## Phase Guidance

- Prefer phases that map to user-visible or testable behavior.
- Avoid phases that only rearrange code unless refactoring is necessary for a
  later behavior change.
- Never create a standalone validation-only phase. Validation belongs in each
  phase's `Validation` line, and the final implementation phase must include the
  broad checks needed before handoff.
- If a phase is expected to exceed the 1000-line or 15-file threshold, state why
  in that phase.
- If UI validation or another strong check is not yet possible for an early
  phase, say why in that phase's `Validation` line and name the strongest
  useful checks that are possible.
- If a phase may not compile independently, state why and prefer a different
  split unless there is no practical runnable boundary.

## Quality Bar

- `plan.md`, or the `<proposed_plan>` draft when Plan Mode blocks file edits,
  should be decision-complete enough for a new executor.
- Planning is complete when the local root `plan.md` has been created or
  updated; executing the plan is separate work.
- `plan.md` is a local workflow artifact and should not be staged.
- Do not over-specify private implementation details when the codebase should
  guide them during execution.
- Do not modify `spec.md` files during planning unless the user specifically
  asks for spec updates.
- Requirements are hard constraints; expectations and notes are guidance.
- In Plan Mode, the proposed plan should mirror the `plan.md` artifact structure
  and clearly state that it is ready to write to `plan.md`, not ready to execute.
- The plan should make review straightforward by tying each phase to validation
  and by never deferring validation into a later phase.

## Skill Maintenance

An agent may update this skill when the user asks for skill changes. To find the
source repository, read the single path in this skill directory's `source.txt`,
then edit the matching source files under that repo's `skills/role-planner/`.
After updating the source, run the repo root `install-skills.sh` script so the
installed skill copies are refreshed.
