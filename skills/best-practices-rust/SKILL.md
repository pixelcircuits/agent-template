---
name: best-practices-rust
description: >
  Guide for writing idiomatic Rust code. Use this skill when writing, reviewing,
  or refactoring Rust code, ownership and borrowing, Result-based error
  handling, tests, docs, Cargo, clippy, rustfmt, performance, or API design.
---

# Rust Best Practices

Prefer local crate conventions first. Keep ownership explicit, errors typed, and
unsafe code absent unless the task clearly requires it.

## References

Read only what the task needs:

- [Chapter 1](references/chapter_01.md): ownership, `Copy`, `Option`/`Result`, iterators, imports
- [Chapter 2](references/chapter_02.md): clippy and workspace lints
- [Chapter 3](references/chapter_03.md): profiling, allocation, clones, stack vs heap
- [Chapter 4](references/chapter_04.md): `Result`, panic boundaries, `thiserror`, `anyhow`
- [Chapter 5](references/chapter_05.md): unit, integration, doc, and snapshot tests
- [Chapter 6](references/chapter_06.md): generics, `impl Trait`, `dyn Trait`
- [Chapter 7](references/chapter_07.md): type-state pattern
- [Chapter 8](references/chapter_08.md): comments and rustdoc
- [Chapter 9](references/chapter_09.md): pointers, `Send`/`Sync`, shared ownership

## Defaults

- Borrow with `&T`, `&str`, and `&[T]` unless ownership transfer is required.
- Avoid `clone` in loops and APIs that should accept borrowed data.
- Return `Result<T, E>` for fallible operations. Avoid `unwrap` and `expect`
  outside tests and prototypes.
- Use `thiserror` for library errors and `anyhow` for binary/application edges.
- Prefer iterators for simple transformations and loops for early exit, stateful
  control flow, or clearer error handling.
- Use static dispatch (`impl Trait` or generics) by default; use `dyn Trait` for
  heterogeneous collections or plugin-style boundaries.
- Keep public APIs documented. Comments should explain rationale, invariants, or
  surprising constraints.

## Common Checks

Use repo scripts first. Fallbacks:

```sh
cargo fmt --check
cargo clippy --all-targets --all-features -- -D warnings
cargo test --all-targets --all-features
```
