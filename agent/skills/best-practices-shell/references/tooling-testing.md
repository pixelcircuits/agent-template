# Tooling and Testing

## ShellCheck

Run ShellCheck on changed scripts:

```sh
shellcheck path/to/script.sh
```

For POSIX scripts, make sure the shebang is `#!/bin/sh` or pass the shell explicitly:

```sh
shellcheck -s sh path/to/script.sh
```

For Bash:

```sh
shellcheck -s bash path/to/script.bash
```

Treat warnings as useful by default. Suppress only narrowly with a reason.

## shfmt

Check formatting:

```sh
shfmt -d path/to/script.sh
```

Format in place:

```sh
shfmt -w path/to/script.sh
```

Respect the repo's existing formatting flags. Common choices:

```sh
shfmt -i 2 -ci -sr -w path/to/script.sh
```

## Syntax Checks

Run the intended shell in no-exec mode:

```sh
sh -n path/to/script.sh
bash -n path/to/script.bash
```

For POSIX scripts, test with `dash` when available:

```sh
dash -n path/to/script.sh
```

## Tests

Use the repo's existing test framework first.

Good shell test options:

- `bats-core` for Bash-oriented integration tests
- `shellspec` for shell behavior tests
- plain fixture-driven scripts for small projects

Test behavior through the command-line interface:

- arguments and usage errors
- missing files and missing commands
- paths with spaces
- empty input
- command failures
- cleanup after interruption or failure where practical

## CI Baseline

A useful CI baseline:

```sh
find . -name '*.sh' -print0 | xargs -0 shellcheck
find . -name '*.sh' -print0 | xargs -0 shfmt -d
```

Adjust file discovery to include extensionless executable scripts when the repo has them.

## Tool Availability

If `shellcheck` or `shfmt` is unavailable, say so in the final response and still perform manual review. Do not silently skip validation.
