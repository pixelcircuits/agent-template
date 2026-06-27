---
name: best-practices-shell
description: >
  Guide for writing, reviewing, and refactoring Unix shell scripts (POSIX sh,
  Bash, dash, zsh). Use when creating or editing scripts, choosing between POSIX
  sh and Bash, improving quoting, error handling, pipelines, traps, cleanup,
  argument parsing, portability, ShellCheck, shfmt, tests, or CI validation.
---

# Shell Best Practices

Prefer the repo's existing shell, style, and tooling. Use shell for small glue
around commands; switch to a project language for complex data, JSON/YAML
mutation, concurrency, or heavily tested logic.

## References

Read only what the task needs:

- [Portability](references/portability.md): POSIX sh vs Bash, shebangs, macOS, utility flags
- [Safety](references/safety.md): strict mode, quoting, traps, temp files, pipelines
- [Style](references/style.md): structure, naming, functions, argument parsing, output
- [Tooling and Testing](references/tooling-testing.md): ShellCheck, shfmt, syntax checks, shell tests
- [Review Checklist](references/review-checklist.md): shell review checklist

## Defaults

- Pick the interpreter first, then use syntax valid for that interpreter.
- Quote expansions unless splitting or globbing is intentional.
- Prefer `printf` over `echo`; avoid parsing `ls`; avoid `eval`.
- Bash: consider `set -Eeuo pipefail`. POSIX sh: use `set -eu` where it fits.
- Handle expected failures with explicit `if`, `case`, or status checks.
- Use idempotent `trap` cleanup for temp files and directories.

## Common Checks

Use repo scripts first. Fallbacks:

```sh
shellcheck path/to/script.sh
shfmt -d path/to/script.sh
sh -n path/to/script.sh
bash -n path/to/script.bash
```
