# Style and Maintainability

## Structure

Recommended order:

1. shebang
2. strict mode and shell options
3. constants and defaults
4. helper functions
5. argument parsing
6. main function
7. `main "$@"`

For Bash:

```bash
main() {
  parse_args "$@"
  run
}

main "$@"
```

For POSIX sh, the same structure is fine, but avoid Bash-only function syntax.

## Names

- Use lowercase variable names for script-local variables.
- Reserve uppercase for environment variables and exported constants.
- Use descriptive names: `src_dir`, `tmp_dir`, `output_file`.
- Avoid single-letter names outside small loops.

## Constants and Defaults

Use parameter expansion for defaults:

```sh
log_level="${LOG_LEVEL:-info}"
```

For required environment variables:

```sh
: "${API_TOKEN:?API_TOKEN is required}"
```

## Functions

Use functions to isolate behavior:

```sh
usage() {
  printf '%s\n' "usage: ${0##*/} [-f file]" >&2
}
```

Prefer passing arguments over reading globals. Use globals for configuration that is genuinely script-wide.

## Output

- Normal machine-readable output goes to stdout.
- Logs, diagnostics, progress, and errors go to stderr.
- Use `printf`, not `echo`, for predictable output.

```sh
log() {
  printf '%s\n' "$*" >&2
}
```

## Argument Parsing

Use `getopts` for POSIX options:

```sh
while getopts ':f:h' opt; do
  case "$opt" in
    f) file=$OPTARG ;;
    h) usage; exit 0 ;;
    :) usage; exit 2 ;;
    \?) usage; exit 2 ;;
  esac
done
shift "$((OPTIND - 1))"
```

Use a `case` loop for long options only when the parser remains simple. For complex CLIs, use a project-standard language with a real argument parser.

## Comments

Comments should explain why something is done, not repeat the command.

Good comments:

- document non-obvious portability constraints
- justify ShellCheck suppressions
- explain destructive operations or security assumptions
- identify external command version requirements

Every ShellCheck suppression should be narrow and justified:

```sh
# shellcheck disable=SC2086 # intentional splitting of user-provided compiler flags
```

## Data Formats

Do not parse structured data with brittle text pipelines when proper tools are available.

- JSON: prefer `jq`
- YAML: prefer `yq` or a real language
- CSV: prefer a CSV-aware tool or language
- paths: avoid delimiter-separated strings; use arrays in Bash or newline-safe designs where possible
