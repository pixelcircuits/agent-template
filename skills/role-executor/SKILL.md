---
name: role-executor
description: >
  Step 2 execution skill. Use when implementing the next unchecked phase or task
  from root plan.md, validating the work, and marking completed plan items done.
license: MIT
metadata:
  version: "1.0.0"
allowed-tools: Read Write Edit Glob Grep Bash(git:*) Bash(npm:*) Bash(pnpm:*) Bash(yarn:*) Bash(bun:*) Bash(cargo:*) Bash(go:*) Bash(python:*) Bash(python3:*)
---

# Role Executor

Use this skill during Step 2 to implement exactly the next unchecked unit of work
from root `plan.md`.

Execution should be narrow, validated, and easy for a later reviewer to compare
against the plan. Keep unrelated refactors and cleanup out of the change unless
they are required to complete the selected phase.

## Core Workflow

1. **Require `plan.md`.** If root `plan.md` is missing, stop early and tell the
   user that planning must happen first.

2. **Select the next unchecked item.** Read `plan.md` and find the first
   unchecked phase or task. Implement only that item unless the plan or user
   explicitly says to do more.

3. **Load relevant best practices.** Use the repo's applicable language or
   framework best-practices skills when they apply.

4. **Inspect before editing.** Read the relevant code, tests, configs, and
   existing utilities. Prefer local patterns and helper APIs over new
   abstractions.

5. **Implement the phase.** Keep changes scoped to the selected plan item. Add
   or update tests and temporary execution sanity checks when they improve
   confidence.

6. **Evaluate from the user's perspective.** When applicable, verify the changed
   API, UI, CLI, or workflow as a user would. Use Playwright or a browser sanity
   check for UI work when the plan expects it.

7. **Run final checks.** Run the repo's formatter check or formatter, linter,
   relevant tests, and broader regression checks available for the changed area.
   If a check cannot run, record why.

8. **Mark done last.** Only after implementation and validation are complete,
   update `plan.md` by changing the completed item's checkbox from `[ ]` to
   `[x]`. This is the only normal execution edit to `plan.md`.

## Plan Updates After Feedback

During normal execution, do not revise `plan.md` except to mark the selected item
done.

If the user later asks to update the plan after checking the work:

- Move any affected completed checkbox back to `[ ]`.
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
- Do not mark a plan item done when important validation is missing without
  clearly reporting the gap.
- Keep the final response focused on what changed, what was validated, and any
  remaining risk.
- Stay available for small user-requested follow-up revisions after the phase is
  complete.
