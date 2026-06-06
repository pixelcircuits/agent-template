---
name: best-practices-shell
description: >
  Guide for writing, reviewing, and refactoring Unix shell scripts (POSIX sh,
  Bash, dash, zsh). Use when creating or editing scripts, choosing between POSIX
  sh and Bash, improving quoting/error handling/pipelines/traps/cleanup/argument
  parsing/portability, adding ShellCheck, shfmt, shell tests, or CI validation,
  or reviewing for safety, maintainability, and Unix compatibility.
license: MIT
compatibility: POSIX sh, Bash 3.2+, Bash 4+, dash, zsh, Unix-like systems
metadata:
  version: "1.0.0"
allowed-tools: Bash(shellcheck:*) Bash(shfmt:*) Bash(bash:*) Bash(sh:*) Bash(dash:*) Bash(zsh:*) Read Write Edit Glob Grep
---

# Shell Best Practices

## References

Read only what the task needs:

- [Portability](references/portability.md): POSIX sh vs Bash, shebangs, arrays, process substitution, macOS
- [Safety](references/safety.md): strict mode, quoting, traps, cleanup, pipelines, temp files
- [Style](references/style.md): structure, naming, functions, argument parsing, logging
- [Tooling & Testing](references/tooling-testing.md): ShellCheck, shfmt, bats-core, shellspec, CI
- [Review Checklist](references/review-checklist.md): checklist for shell code reviews

## Core Workflow

1. **Pick the shell.** Use POSIX `sh` for portability; use Bash when arrays, `[[ ]]`,
   process substitution, or `pipefail` materially simplify the script.

2. **Keep it boring.** Quote expansions (`"$var"`, `"$(cmd)"`). Prefer `printf` over
   `echo`. Don't parse `ls`. Avoid `eval`.

3. **Make failure intentional.** Bash: `set -Eeuo pipefail`. POSIX sh: `set -eu`.
   Handle expected failures with `if command; then ...`. Clean up via an idempotent
   `trap`.

4. **Validate.** Run `shellcheck` and `shfmt`, then run the script or its tests under
   the intended shell (use `dash` for POSIX scripts).

## When Shell Is the Wrong Tool

Reach for Python, Go, Rust, or a project-standard language when you need complex data
structures, JSON/YAML mutation, real concurrency, cross-platform robustness, or many
unit tests around internal logic.

## Skill Maintenance

An agent may update this skill when the user asks for skill changes. To find the
source repository, read the single path in this skill directory's `source.txt`,
then edit the matching source files under that repo's
`skills/best-practices-shell/`. After updating the source, run the repo root
`install-skills.sh` script so the installed skill copies are refreshed.
