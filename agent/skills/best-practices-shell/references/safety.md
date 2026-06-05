# Safety and Error Handling

## Strict Mode

For Bash, this is often a good starting point:

```bash
set -Eeuo pipefail
```

For POSIX sh:

```sh
set -eu
```

Strict mode is not a substitute for explicit control flow. Commands in conditionals, pipelines, command substitutions, subshells, and cleanup handlers need deliberate handling.

## Expected Failures

Use conditionals for commands that may fail normally:

```sh
if grep -q -- "$needle" "$file"; then
  found=1
else
  found=0
fi
```

Avoid hiding failures broadly:

```sh
command || true
```

If this pattern is needed, add a short comment explaining why failure is acceptable.

## Quoting and Word Splitting

Quote expansions unless intentional splitting or globbing is required:

```sh
rm -f -- "$path"
printf '%s\n' "$value"
```

Use `"${array[@]}"` for Bash arrays.

Do not store command fragments in strings. Use functions or arrays in Bash:

```bash
cmd=(curl -fsS --retry 3 "$url")
"${cmd[@]}"
```

## Globs

Handle unmatched globs:

```sh
for file in "$dir"/*.log; do
  [ -e "$file" ] || continue
  process_log "$file"
done
```

In Bash, consider `shopt -s nullglob` when that behavior is desired and local to the script.

## Pipelines

In Bash, use `pipefail` when any stage failing should fail the pipeline.

When reading pipeline output, remember that variables set inside a pipeline loop may be lost because the loop can run in a subshell:

```sh
count=0
while IFS= read -r line; do
  count=$((count + 1))
done < "$file"
```

Prefer redirecting into loops over piping into loops when state must persist.

## Command Substitution

Quote command substitutions:

```sh
value="$(get_value)"
```

Remember that command substitution strips trailing newlines. Do not use it for arbitrary binary data.

## Temporary Files and Cleanup

Use `mktemp`:

```sh
tmp_dir="$(mktemp -d)" || exit 1
cleanup() {
  rm -rf -- "$tmp_dir"
}
trap cleanup EXIT HUP INT TERM
```

Do not use predictable names in `/tmp`. Make cleanup idempotent.

## Traps

Keep traps simple. If preserving exit status matters:

```sh
cleanup() {
  status=$?
  rm -rf -- "$tmp_dir"
  exit "$status"
}
trap cleanup EXIT
```

Avoid trapping `ERR` unless the script is Bash and you understand how `set -E`, subshells, and conditionals interact.

## Privilege and Destructive Operations

- Check required variables before destructive commands.
- Use `--` before user-controlled path operands when supported.
- Prefer dry-run flags for scripts that delete, overwrite, or mutate remote state.
- Avoid running whole scripts as root; elevate only the commands that require it.
