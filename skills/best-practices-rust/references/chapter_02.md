# Chapter 2 - Clippy and Linting

## Defaults

- Run `cargo fmt` and `cargo clippy` before handoff when Rust code changed.
- Prefer the repo's existing workspace lint policy over inventing a new one.
- Fix warnings instead of silencing them unless the lint is a documented false
  positive or conflicts with a deliberate design choice.

## Useful Commands

```sh
cargo fmt --check
cargo clippy --all-targets --all-features -- -D warnings
cargo test --all-targets --all-features
```

Use narrower package or feature commands when the repo is large and the change is
localized.

## Lint Hygiene

- Use `#[expect(clippy::lint_name, reason = "...")]` when supported; otherwise
  keep `#[allow(...)]` narrow and explain why.
- Prefer workspace-level lints for shared policy and crate-level lints for local
  exceptions.
- Watch especially for redundant clones, needless collects, large enum variants,
  needless pass-by-value, missing error implementations, and unsafe code without
  clear invariants.
