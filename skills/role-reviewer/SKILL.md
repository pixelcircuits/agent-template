---
name: role-reviewer
description: >
  Step 4 review skill. Use when reviewing current unstaged implementation
  changes against plan.md, issue requirements, tests, code quality, and
  regression risk.
license: MIT
metadata:
  version: "1.0.0"
allowed-tools: Read Glob Grep Bash(git:*) Bash(npm:*) Bash(npx:*) Bash(node:*) Bash(pnpm:*) Bash(yarn:*) Bash(bun:*) Bash(cargo:*) Bash(go:*) Bash(python:*) Bash(python3:*)
---

# Role Reviewer

Use this skill during Step 4 to review current unstaged changes before another
reviewer, PR, or human final review.

Take a code-review stance: findings first, ordered by severity, with concrete
file and line references whenever possible. Focus on defects, unmet
requirements, regression risk, missing tests, and violations of applicable code
best practices.

## Core Workflow

1. **Review current unstaged changes.** Check git status before reviewing.
   Review the current unstaged tracked changes and untracked implementation
   files. If changes are already staged, treat them as a previously reviewed
   baseline and do not unstage them; focus this review pass on what is still
   unstaged. Never ask the user to stage the intended review set first.

2. **Read the plan, issue, and specs.** Review root `plan.md`, `issue.md`, and
   applicable `spec.md` files when present. Treat `issue.md` and `plan.md` as
   the freshest authority for the current change. Use specs as baseline context
   and older constraints, recognizing they may be stale because spec updates
   happen after review. When `plan.md` contains phases, review every phase
   marked `[awaiting-review]`; before inspecting implementation changes, move
   all of those phases to `[reviewing]`. Because executors do not close their own
   work, several phases may be waiting at once and a single pass should cover
   them all. Review against those phases' goals, scopes, validation,
   requirements, and applicable best practices only; do not treat future blank
   phases as missing implementation. After a phase's changes are reviewed and
   staged, move it to `[done]` (see step 11).

3. **Inspect the current diff.** Use `git diff`, `git diff --stat`, untracked
   file reads, and targeted file reads to understand behavior, not just patch
   shape.

4. **Load and apply relevant best practices.** Use the repo's applicable
   language, framework, and project best-practices skills to inform the quality
   review. Treat best-practice violations as findings when they create
   correctness, maintainability, security, performance, accessibility, or
   consistency risk.

5. **Apply size scrutiny.** If the current unstaged review set exceeds about
   1000 changed lines or 15 changed files, explicitly ask whether the solution
   is larger than needed. Accept the size when `plan.md` already justified it or
   the change is inherently broad.

6. **Check code quality.** Look for unnecessary bloat, unclear naming, missed
   existing utilities, inconsistent patterns, fragile abstractions, unsafe error
   handling, avoidable complexity, and violations of applicable best practices.

7. **Check tests and edge cases.** Verify that tests cover requirements,
   important edge cases, and likely regressions. Call out missing tests as
   findings when they create real risk.

8. **Run regression checks.** Run the repo's relevant full regression suite when
   available, plus linters and format checks. Report commands run and any checks
   that could not be run.

8a. **Exercise user-facing changes the way a user would.** When the change has a
    user-facing surface (web UI, pages, components, rendered output, CLI flows),
    do not rely on static checks alone — run the app and observe real behavior.
    For web/UI work, use a browser-automation tool such as Playwright to load the
    built or dev server, then verify the rendered result against the plan and
    issue: expected content is present, nothing is missing or duplicated, key
    flows work, and layout holds at desktop and mobile widths. Capture
    screenshots where useful and report what was exercised. If such a check is
    expected (for example a plan phase calls for a local smoke test) but cannot
    be run, record it as a gap rather than silently skipping it.

9. **Stage reviewed changes as you go.** After a file, hunk, or coherent change
   has been inspected, stage it with `git add` whether it is good or has review
   findings. Staging means the reviewer has looked at that change; it does not
   mean the change is approved. Use path-based staging for whole reviewed files
   and patch staging when only part of a file has been reviewed.

10. **Do not update specs by default.** If reviewed changes intentionally
    supersede stale `spec.md` content, report the needed spec follow-up rather
    than treating that staleness as a defect in the implementation. Do not
    create, edit, or delete `spec.md` files unless the user specifically asks
    for spec updates.

11. **Move reviewed phases to `[done]`.** Once a phase's changes have been
    reviewed and staged, change that phase's state from `[reviewing]` to
    `[done]`, even when the review recorded findings; `[done]` means the
    reviewer inspected and staged the work, not that it is defect-free. Recording
    findings still moves the phase to `[done]`; human follow-up fixes happen
    before the eventual commit and push. Do not move phases back to `[ ]`,
    `[executing]`, or `[awaiting-review]`. Leave `plan.md` unstaged because it
    is an ignored local handoff artifact.

12. **End with reviewed changes staged.** Before finishing, check git status and
    make sure all reviewed implementation changes are staged so follow-up fixes
    made by a human can appear as new unstaged changes before commit and push.
    Report any intentionally unstaged files and why they were not part of the
    review.

## Review Output

Lead with findings. Use this shape:

```md
## Findings

- <Severity> <file:line> - <Issue and impact.>

## Open Questions

- <Question or "None".>

## Checks

- <Command>: <result>

## Staging

- <Reviewed changes staged, or intentionally unstaged paths with reasons.>

## Summary

<Brief secondary context only.>
```

If there are no findings, say so directly and still mention residual test gaps or
checks not run.

## Review Checklist

- Requirements from `issue.md` and `plan.md` are met.
- Applicable `spec.md` requirements and constraints are preserved unless
  superseded by the current `issue.md` or `plan.md`.
- Every phase marked `[awaiting-review]` at review start was moved to
  `[reviewing]`, reviewed, staged, and then moved to `[done]`.
- Naming is clear, consistent, and domain-appropriate.
- Existing utilities, components, helpers, and patterns are reused where they
  fit.
- Tests cover success paths, failure paths, boundaries, and regressions that the
  change could plausibly affect.
- The solution is not larger or more abstract than the issue needs.
- The code follows the applicable language and framework best practices.
- Project-specific best practices and established local patterns are preserved.
- Lint, formatting, and regression checks pass or failures are explained.
- User-facing changes were exercised in the running app (for example Playwright
  for web UI: rendered content, key interactions, and responsive widths), not
  validated by static checks alone.

## Boundaries

- Do not review unrelated current work.
- Do not require ignored workflow artifacts such as `plan.md` to be staged.
- Do not rewrite code during review unless the user explicitly asks for fixes.
- If you are asked to fix findings in the same session, treat fixing as a
  separate pass from review: keep the reviewed baseline staged and leave your
  fix edits unstaged so they remain reviewable as a distinct layer. Do not run
  `git add` (and never `git add -A`) on your own fixes unless the user
  explicitly asks.
- Do not treat staging as approval; staging only means the reviewer inspected
  the change.
- Do not modify `spec.md` files unless the user specifically asks for spec
  maintenance.
- Do not approve broad diffs just because tests pass.
- Do not block on style preferences unless they affect maintainability,
  consistency, or correctness.

## Skill Maintenance

An agent may update this skill when the user asks for skill changes. To find the
source repository, read the single path in this skill directory's `source.txt`,
then edit the matching source files under that repo's `skills/role-reviewer/`.
After updating the source, run the repo root `install-skills.sh` script so the
installed skill copies are refreshed.
