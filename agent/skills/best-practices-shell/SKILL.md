---
name: best-practices-shell
description: >
  Guide for writing, reviewing, and refactoring Unix shell scripts. Use this skill when:
  (1) creating or editing shell, Bash, POSIX sh, zsh, or dash scripts,
  (2) deciding whether a script should target POSIX sh or Bash,
  (3) improving quoting, error handling, pipelines, traps, cleanup, argument parsing, or portability,
  (4) adding shell script tests, ShellCheck, shfmt, or CI validation,
  (5) reviewing shell scripts for safety, maintainability, or Unix compatibility.
license: MIT
compatibility: POSIX sh, Bash 3.2+, Bash 4+, dash, zsh, Unix-like systems
metadata:
  version: "1.0.0"
allowed-tools: Bash(shellcheck:*) Bash(shfmt:*) Bash(bash:*) Bash(sh:*) Bash(dash:*) Bash(zsh:*) Read Write Edit Glob Grep
---

# Shell Best Practices

Apply these guidelines when writing or reviewing shell scripts for Unix-like environments.

## Best Practices Reference

Read only the reference files relevant to the task:

- [Portability and Shell Selection](references/portability.md): POSIX sh vs Bash, shebangs, arrays, process substitution, macOS compatibility
- [Safety and Error Handling](references/safety.md): strict mode, quoting, traps, cleanup, pipelines, command substitution, temp files
- [Style and Maintainability](references/style.md): structure, naming, functions, argument parsing, logging, comments
- [Tooling and Testing](references/tooling-testing.md): ShellCheck, shfmt, bats-core, shellspec, CI commands
- [Review Checklist](references/review-checklist.md): concise checklist for shell code reviews

## Core Workflow

1. Identify the target shell before editing.
   - Use POSIX `sh` only when portability is required.
   - Use Bash when arrays, `[[ ]]`, associative maps, process substitution, `pipefail`, or richer parameter expansion materially simplify the script.

2. Prefer boring, explicit shell.
   - Quote expansions by default: `"$var"`, `"${array[@]}"`, `"$(cmd)"`.
   - Use `printf` instead of `echo` for generated output.
   - Avoid parsing `ls`; use globs, `find`, or structured command output.
   - Avoid `eval`; if unavoidable, isolate and justify it.

3. Make failure behavior intentional.
   - For Bash scripts, usually start with `set -Eeuo pipefail` after understanding its edge cases.
   - For POSIX sh, use `set -eu`; `pipefail` is not portable.
   - Check expected failures explicitly with `if command; then ... else ... fi`.
   - Do cleanup with `trap`, and make cleanup idempotent.

4. Validate changes.
   - Run `shellcheck` on modified scripts when available.
   - Run `shfmt -w` or `shfmt -d` when available and consistent with the repo.
   - Execute the script or targeted tests under the intended shell.
   - For POSIX scripts, test with `dash` when available.

## Quick Reference

### Shell Selection

```sh
#!/bin/sh
```

Use for small portable scripts that need only POSIX features.

```bash
#!/usr/bin/env bash
```

Use for Bash scripts, especially when portability across install paths matters.

### Quoting

```sh
cp -- "$src" "$dest"
for file in "$dir"/*.txt; do
  [ -e "$file" ] || continue
  process_file "$file"
done
```

Quote variables. Use `--` before path operands when commands support it.

### Functions

```sh
die() {
  printf '%s\n' "error: $*" >&2
  exit 1
}
```

Use functions for repeated behavior; keep functions small and pass data through arguments.

### Temp Files

```sh
tmp_dir=$(mktemp -d) || exit 1
cleanup() { rm -rf -- "$tmp_dir"; }
trap cleanup EXIT HUP INT TERM
```

Use `mktemp`; never hand-roll names in `/tmp`.

### Argument Parsing

Use `getopts` for POSIX-compatible option parsing. For complex CLIs, consider a real language.

### When Shell Is the Wrong Tool

Prefer Python, Ruby, Go, Rust, or another project-standard language when the script needs:

- complex data structures
- JSON/YAML/XML mutation beyond simple extraction
- non-trivial concurrency
- robust cross-platform behavior
- long-lived business logic
- many unit tests around internal behavior
