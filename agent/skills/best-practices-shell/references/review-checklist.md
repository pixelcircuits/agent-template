# Review Checklist

Use this checklist for shell script reviews.

## Interpreter and Portability

- Shebang matches the syntax used.
- POSIX scripts do not use Bash-only features.
- Bash scripts document any Bash version requirement.
- External command flags are portable for the target Unix environment.

## Safety

- Expansions are quoted unless splitting/globbing is intentional.
- Paths from variables use `--` with commands that support it.
- Temp files and directories use `mktemp`.
- Cleanup uses `trap` and is idempotent.
- Destructive operations validate inputs first.
- No unnecessary `eval`.

## Error Handling

- Failure behavior is explicit.
- `set -eu` or Bash `set -Eeuo pipefail` is used where appropriate.
- Expected command failures are handled with `if`, `case`, or explicit checks.
- Pipelines are safe for the chosen shell.
- Missing commands, files, and required environment variables fail clearly.

## Maintainability

- Script has a clear structure and small functions.
- Output to stdout vs stderr is intentional.
- `printf` is used instead of `echo` when output needs to be predictable.
- Argument parsing is simple and tested.
- Comments explain rationale, not mechanics.

## Testing and Tooling

- `shellcheck` passes or suppressions are justified.
- `shfmt` is applied or formatting matches repo conventions.
- Syntax check runs under the intended shell.
- Tests cover spaces in paths, empty inputs, expected failures, and cleanup-sensitive behavior.

## Escalation

Recommend rewriting in a stronger language when shell code accumulates complex parsing, nested data structures, broad platform support, or business logic that needs extensive unit tests.
