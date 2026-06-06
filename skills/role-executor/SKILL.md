---
name: role-executor
description: >
  Step 2 execution skill. Use when implementing the next blank phase or task
  from root plan.md, validating the work, and marking completed plan items
  awaiting review.
license: MIT
metadata:
  version: "1.0.0"
allowed-tools: Read Write Edit Glob Grep Bash(git:*) Bash(npm:*) Bash(pnpm:*) Bash(yarn:*) Bash(bun:*) Bash(cargo:*) Bash(go:*) Bash(python:*) Bash(python3:*)
---

# Role Executor

Use this skill during Step 2 to implement exactly the next blank unit of work
from root `plan.md`.

Execution should be narrow, validated, and easy for a later reviewer to compare
against the plan. Keep unrelated refactors and cleanup out of the change unless
they are required to complete the selected phase.

Do not use this skill merely because a planner just created or updated
`plan.md`. Execution starts only when the user explicitly asks to execute the
plan, continue with the next phase, or otherwise implement planned work.

## Core Workflow

1. **Require `plan.md`.** If root `plan.md` is missing, stop early and tell the
   user that planning must happen first.

   If the user's current request was only to create or update a plan, do not
   execute anything.

2. **Leave reviewed work for the reviewer.** Read `plan.md`. Do not change any
   phase already marked `[awaiting-review]`, `[reviewing]`, or `[done]`;
   closing reviewed work is the reviewer's job, not the executor's. Several
   phases may sit in `[awaiting-review]` at once waiting for a single review
   pass, and that is expected. Leave `plan.md` unstaged because it is an ignored
   local handoff artifact.

3. **Select the next blank item.** Find the first phase or
   task marked `[ ]`. Implement only that item unless the plan or user explicitly
   says to do more. Do not execute items marked `[executing]`,
   `[awaiting-review]`, `[reviewing]`, or `[done]`.

   Before editing implementation files, update the selected item's state from
   `[ ]` to `[executing]`. Leave `plan.md` unstaged because it is an ignored
   local handoff artifact.

4. **Read applicable specs.** Read the root `spec.md` and the closest applicable
   nested `spec.md` for the selected work area when they exist. Treat explicit
   user instructions and `plan.md` as fresher than specs for the current change.
   Follow still-applicable spec constraints during implementation; if the plan
   intentionally supersedes stale spec content, execute the plan and report the
   needed spec maintenance. Do not create, edit, or delete `spec.md` files unless
   the user specifically asks for spec updates.

5. **Load relevant best practices.** Use the repo's applicable language or
   framework best-practices skills when they apply.

6. **Inspect before editing.** Read the relevant code, tests, configs, and
   existing utilities. Prefer local patterns and helper APIs over new
   abstractions.

7. **Implement the phase.** Keep changes scoped to the selected plan item. Add
   or update tests and temporary execution sanity checks when they improve
   confidence.

8. **Evaluate from the user's perspective.** When applicable, verify the changed
   API, UI, CLI, or workflow as a user would. Use Playwright or a browser sanity
   check for UI work when the plan expects it.

9. **Run final checks.** Run the repo's formatter check or formatter, linter,
   relevant tests, and broader regression checks available for the changed area.
   If a check cannot run, record why.

10. **Request review last.** Only after implementation and validation are
   complete, update `plan.md` by changing the selected item's state from
   `[executing]` to `[awaiting-review]`. This is the executor's final state for
   newly completed work; the reviewer moves pending phases to `[reviewing]` and
   then reviewed and staged phases to `[done]`. The executor never closes phases
   itself.

## Plan Updates After Feedback

During normal execution, do not revise `plan.md` except to move the selected
item from `[ ]` to `[executing]` and then to `[awaiting-review]`. Do not move
phases to `[reviewing]` or `[done]`; the reviewer owns those transitions.

Do not update `spec.md` files during execution unless the user specifically asks
for spec updates. If implementation reveals stale or missing spec guidance,
report that in the final response or plan notes instead.

If the user later asks to update the plan after checking the work:

- Move any affected phase state back to `[ ]` when it needs fresh execution.
- Add concise execution notes under `Notes` or the affected phase.
- Include hiccups, failed assumptions, commands that failed, and why the prior
  attempt was not adequate.
- Write notes for a fresh executor who may not have this conversation.

## Validation Guidance

- Follow validation instructions in the selected phase first.
- Run focused tests for the changed behavior before broad regression checks.
- Run linting and formatting checks expected by the repo.
- For UI work, inspect the rendered result when feasible and check that text,
  layout, and interactions match the intended user workflow.
- If the plan states that UI checks, compilation, or full tests are premature for
  the selected phase, honor that note and run the next best available checks.

## Quality Bar

- The app should be runnable and relevant tests should pass at the end of each
  phase whenever feasible.
- `plan.md` may be updated locally to mark execution state, but it should not be
  staged.
- Do not mark a plan item `[awaiting-review]` when important validation is
  missing without clearly reporting the gap.
- Do not modify `spec.md` files unless the user specifically asks for spec
  maintenance.
- Keep the final response focused on what changed, what was validated, and any
  remaining risk.
- Stay available for small user-requested follow-up revisions after the phase is
  complete.

## Skill Maintenance

An agent may update this skill when the user asks for skill changes. To find the
source repository, read the single path in this skill directory's `source.txt`,
then edit the matching source files under that repo's `skills/role-executor/`.
After updating the source, run the repo root `install-skills.sh` script so the
installed skill copies are refreshed.
