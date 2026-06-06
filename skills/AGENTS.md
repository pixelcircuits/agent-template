## Specs

### Purpose and Placement

`spec.md` files are source-adjacent specification documents for agents and
humans. They describe the intended current behavior of the project, the
requirements that must be preserved, and the local patterns future work should
follow. Treat them as durable project guidance, similar in importance to
`AGENTS.md` or `CLAUDE.md`, but scoped to product behavior, architecture,
constraints, and implementation expectations. A spec is current-state guidance,
not a changelog or scratchpad.

Every project must have a root `spec.md`. Nested `spec.md` files are optional:
add one when a meaningful area (a package, app, service, feature area, or major
module) has distinct requirements or patterns. Do not create one per folder by
default; create one when local guidance would save a future agent from reading
the entire codebase.

Each `spec.md` should reference its direct child specs only. A child spec is
responsible for referencing its own children, which keeps the tree navigable
without making any one spec the map of the whole project.

### Contents

A spec describes the current intended system, not just the next change. Useful
contents include:

- Scope, goals, and success or acceptance criteria.
- Product behavior, user-visible requirements, and expected workflows.
- Hard constraints, forbidden changes, invariants, and edge cases.
- Architecture boundaries and ownership rules, such as where authentication,
  authorization, persistence, routing, or external API access must occur.
- Project-specific patterns for naming, state management, testing, error
  handling, performance, accessibility, security, and observability.
- Public interfaces, data shapes, integration contracts, and compatibility
  expectations.
- Direct child specs for nested areas immediately below this spec's scope.
- Reasons behind important decisions when the reason would prevent future drift.

Prefer clear, checkable language. Avoid vague requirements such as "make it
fast" or "handle errors gracefully" unless the spec states what that means for
this project. Keep specs concise enough to load but complete enough to guide
implementation and review without rediscovering the same context.

The root spec is the project-wide version of the same thing: a concise baseline
contract covering what the project is and who it serves, the workflows and
constraints that must be preserved, architecture boundaries all nested areas
respect, and expected testing standards. Create it early, keep it small while
the project is young, and do not invent requirements just to fill sections.

### Lookup

Before modifying code, tests, configuration, or docs, walk upward from the file
being edited to the repository root and read every `spec.md` you find. In
practice this is the root spec plus the closest nested spec, if one exists. When
a change spans multiple areas, repeat this for each area.

If the root spec and a nested spec conflict, the closest spec governs local
behavior unless it violates a root-level hard constraint. If two nested specs
conflict across a multi-area change, preserve both local contracts and call out
the unresolved conflict before editing.

For the current change, explicit user instructions, `issue.md`, and `plan.md`
are fresher than `spec.md`. Use specs as baseline constraints and pattern
guidance, but when the current work intentionally supersedes stale spec content,
follow the current work and report the needed spec maintenance instead of
editing the spec.

### Workflow Responsibilities

- Issue builders may read applicable specs when converting user context into
  `issue.md`, especially when requirements or constraints are unclear.
- Planners must read applicable specs before writing `plan.md` and copy any
  relevant still-applicable constraints, acceptance criteria, or local patterns
  into the plan. Plan phases must use one of these state markers: `[ ]`,
  `[executing]`, `[awaiting-review]`, `[reviewing]`, or `[done]`. New phases
  start as `[ ]`. If the current issue intentionally supersedes stale spec
  content, plan from the issue and note the needed spec maintenance.
- Executors must read applicable specs before editing and keep changes
  consistent with still-applicable constraints. Executors leave phases marked
  `[awaiting-review]`, `[reviewing]`, or `[done]` for the reviewer and never
  close reviewed work themselves. Executors move the selected `[ ]` plan phase
  to `[executing]` before implementation, then to `[awaiting-review]` after
  implementation and validation, then move on to the next `[ ]` phase. Because
  executors do not close reviewed work, several phases may sit in
  `[awaiting-review]` at once. If `plan.md` intentionally supersedes stale spec
  content, execute the plan and report the needed spec maintenance.
- Reviewers must treat `issue.md` and `plan.md` as the freshest authority for
  the current change. Specs provide baseline context and may be stale, since
  spec updates happen after review. Reviewers always review every phase marked
  `[awaiting-review]`, first move all of those phases to `[reviewing]`, and
  review current unstaged implementation changes rather than requiring work to
  be staged first. Reviews must check code best practices for the applicable
  language, framework, and project patterns. Because executors do not close
  their own work, a single review pass may cover several `[reviewing]` phases at
  once. As each file, hunk, or coherent change is reviewed, reviewers stage it
  whether it is good or has findings; staging means inspected, not approved.
  After a phase's changes have been reviewed and staged, the reviewer moves that
  phase from `[reviewing]` to `[done]`. Reviewers end with reviewed
  implementation changes staged so human follow-up fixes can be made before the
  eventual commit and push. Call out unexpected drift, violated still-applicable
  constraints, missing tests, best-practice issues, and spec updates that the
  later maintenance pass should make.
- Planners, executors, and reviewers must not create, edit, or delete `spec.md`
  files unless the user specifically asks for spec maintenance. When specs look
  stale or incomplete, call that out instead of changing them.
- Spec maintenance is a separate, explicitly requested pass that updates, adds,
  or removes affected `spec.md` files so they describe current intended
  behavior. During spec maintenance, read the current `issue.md`, `plan.md`,
  reviewed implementation changes, and applicable existing specs before editing
  specs. Use `issue.md` and `plan.md` to understand the intended change and any
  accepted requirements, but write specs as durable current-state guidance, not
  as issue history, plan history, or a changelog. Remove outdated requirements
  rather than preserving stale history.
