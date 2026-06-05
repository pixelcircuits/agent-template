# Portability and Shell Selection

## Decide the Target First

Do not mix POSIX sh assumptions with Bash-only syntax. Before editing, identify the intended interpreter from the shebang, file extension, project docs, CI, or call site.

Use POSIX `sh` when:

- the script runs in minimal containers, initramfs, package maintainer hooks, or broad Unix environments
- the script is short and mostly invokes other commands
- the repo already standardizes on `sh`

Use Bash when:

- arrays or associative arrays avoid fragile delimiter parsing
- `[[ ... ]]`, `pipefail`, `mapfile`, process substitution, or richer parameter expansion materially improve correctness
- the environment can guarantee Bash

## Shebangs

- `#!/bin/sh` — POSIX scripts.
- `#!/usr/bin/env bash` — portable Bash lookup across systems.
- Absolute Bash path — only when the deployment environment requires it.

## POSIX sh Constraints

Avoid these in POSIX sh:

- arrays: `arr=(a b)`, `"${arr[@]}"`
- `[[ ... ]]`
- `function name { ... }`
- process substitution: `<(cmd)`
- here strings: `cmd <<< "$input"`
- `source`; use `. ./file`
- `local`; common but not POSIX
- `set -o pipefail`
- brace expansion: `{1..10}`

## macOS and Older Bash

macOS may provide Bash 3.2 as `/bin/bash`. Avoid Bash 4+ features unless the project controls the Bash version:

- associative arrays: `declare -A`
- `mapfile` / `readarray`
- `${var,,}` case conversion
- namerefs: `declare -n`

## External Commands

Portable shell also depends on portable utilities. BSD and GNU flags often differ.

- Prefer POSIX flags when scripts target multiple Unix families.
- Be careful with `sed -i`, `date`, `readlink`, `stat`, `xargs`, and `find`.
- Feature-detect commands when behavior differs across environments.
- Document hard requirements near the top of the script.

## Line Endings and Locale

Use LF endings. Set locale only when output parsing depends on bytewise ordering:

```sh
LC_ALL=C sort
```

Avoid globally changing locale unless the whole script depends on it.
