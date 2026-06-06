#!/usr/bin/env bash
set -Eeuo pipefail

repo_root="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
home_dir="${HOME:?HOME is not set}"

targets=(
  "$home_dir/.codex/skills"
  "$home_dir/.claude/skills"
  "$home_dir/.agents/skills"
)

# Temp dirs created during installs, removed on exit by cleanup().
tmp_dests=()

usage() {
  printf 'Usage: %s [source-skills-dir]\n' "$(basename "$0")"
}

die() {
  printf 'error: %s\n' "$*" >&2
  exit 1
}

# Idempotent: removes any temp dirs left by an interrupted or failed install.
cleanup() {
  local status=$?
  if ((${#tmp_dests[@]} > 0)); then
    rm -rf -- "${tmp_dests[@]}"
  fi
  exit "$status"
}
trap cleanup EXIT HUP INT TERM

ensure_writable_parent() {
  local target_dir="$1"
  local parent

  parent="$(dirname -- "$target_dir")"
  mkdir -p -- "$parent"

  # Installer intentionally grants itself write access to the parent so the
  # target skills dir can be created; permission is not restored afterward.
  if [[ ! -w "$parent" ]]; then
    chmod u+w -- "$parent" || die "cannot make $parent writable"
  fi
}

copy_skill() {
  local skill_dir="$1"
  local target_root="$2"
  local skill_name
  local dest
  local tmp_dest

  skill_name="$(basename -- "$skill_dir")"
  dest="$target_root/$skill_name"
  # Temp dir kept alongside dest (not in /tmp) so the final mv is an atomic,
  # same-filesystem rename. Tracked for cleanup on failure/interrupt.
  tmp_dest="$target_root/.${skill_name}.tmp.$$"
  tmp_dests+=("$tmp_dest")

  rm -rf -- "$tmp_dest"
  cp -a -- "$skill_dir" "$tmp_dest"
  rm -rf -- "$dest"
  mv -- "$tmp_dest" "$dest"
}

if [[ "${1:-}" == "-h" || "${1:-}" == "--help" ]]; then
  usage
  exit 0
fi

source_dir="${1:-"$repo_root/skills"}"

[[ -d "$source_dir" ]] || die "source skills directory not found: $source_dir"

shopt -s nullglob
skill_dirs=()
for skill_dir in "$source_dir"/*; do
  [[ -d "$skill_dir" ]] || continue

  if [[ -f "$skill_dir/SKILL.md" || -f "$skill_dir/skill.md" ]]; then
    skill_dirs+=("$skill_dir")
  else
    printf 'Skipping %s: no SKILL.md or skill.md found\n' "$skill_dir" >&2
  fi
done

((${#skill_dirs[@]} > 0)) || die "no skill directories found in $source_dir"

for target in "${targets[@]}"; do
  ensure_writable_parent "$target"
  mkdir -p -- "$target"

  for skill_dir in "${skill_dirs[@]}"; do
    copy_skill "$skill_dir" "$target"
    printf 'Installed %s -> %s\n' "$(basename -- "$skill_dir")" "$target"
  done
done
