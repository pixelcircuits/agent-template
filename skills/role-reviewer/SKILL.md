---
name: role-reviewer
description: >
  Step 4 review skill. Use when reviewing staged implementation changes against
  plan.md, issue requirements, tests, code quality, and regression risk.
license: MIT
metadata:
  version: "1.0.0"
allowed-tools: Read Glob Grep Bash(git:*) Bash(npm:*) Bash(pnpm:*) Bash(yarn:*) Bash(bun:*) Bash(cargo:*) Bash(go:*) Bash(python:*) Bash(python3:*)
---

# Role Reviewer

Use this skill during Step 4 to review staged changes before a PR or human final
review.

Take a code-review stance: findings first, ordered by severity, with concrete
file and line references whenever possible. Focus on defects, unmet
requirements, regression risk, and missing tests.

## Core Workflow

1. **Review staged changes only.** Check git status before reviewing. If there
   are unstaged changes, stop and ask the user to stage the intended review set
   before continuing.

2. **Read the plan, issue, and specs.** Review root `plan.md`, `issue.md`, and
   applicable `spec.md` files when present. Treat `issue.md` and `plan.md` as
   the freshest authority for the current change. Use specs as baseline context
   and older constraints, recognizing they may be stale because spec updates
   happen after review.

3. **Inspect the staged diff.** Use `git diff --cached` and targeted file reads
   to understand behavior, not just patch shape.

4. **Load relevant best practices.** Use the repo's applicable language or
   framework best-practices skills to inform the quality review.

5. **Apply size scrutiny.** If the staged diff exceeds about 400 changed lines or
   7 changed files, explicitly ask whether the solution is larger than needed.
   Accept the size when `plan.md` already justified it or the change is
   inherently broad.

6. **Check code quality.** Look for unnecessary bloat, unclear naming, missed
   existing utilities, inconsistent patterns, fragile abstractions, unsafe error
   handling, and avoidable complexity.

7. **Check tests and edge cases.** Verify that tests cover requirements,
   important edge cases, and likely regressions. Call out missing tests as
   findings when they create real risk.

8. **Run regression checks.** Run the repo's relevant full regression suite when
   available, plus linters and format checks. Report commands run and any checks
   that could not be run.

9. **Do not update specs by default.** If staged changes intentionally supersede
   stale `spec.md` content, report the needed spec follow-up rather than treating
   that staleness as a defect in the implementation. Do not create, edit, or
   delete `spec.md` files unless the user specifically asks for spec updates.

## Review Output

Lead with findings. Use this shape:

```md
## Findings

- <Severity> <file:line> - <Issue and impact.>

## Open Questions

- <Question or "None".>

## Checks

- <Command>: <result>

## Summary

<Brief secondary context only.>
```

If there are no findings, say so directly and still mention residual test gaps or
checks not run.

## Review Checklist

- Requirements from `issue.md` and `plan.md` are met.
- Applicable `spec.md` requirements and constraints are preserved unless
  superseded by the current `issue.md` or `plan.md`.
- The completed plan phase matches the staged changes.
- Naming is clear, consistent, and domain-appropriate.
- Existing utilities, components, helpers, and patterns are reused where they
  fit.
- Tests cover success paths, failure paths, boundaries, and regressions that the
  change could plausibly affect.
- The solution is not larger or more abstract than the issue needs.
- The code follows the applicable language and framework best practices.
- Lint, formatting, and regression checks pass or failures are explained.

## Boundaries

- Do not review unrelated unstaged work.
- Do not rewrite code during review unless the user explicitly asks for fixes.
- Do not modify `spec.md` files unless the user specifically asks for spec
  maintenance.
- Do not approve broad diffs just because tests pass.
- Do not block on style preferences unless they affect maintainability,
  consistency, or correctness.
