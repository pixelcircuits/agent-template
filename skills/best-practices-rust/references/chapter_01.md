# Chapter 1 - Coding Styles and Idioms

## Ownership and Borrowing

- Accept borrowed data in APIs when ownership is not required: `&str`, `&[T]`,
  `&Path`, and `&T`.
- Take ownership when the function stores, mutates independently, sends across
  threads, or must satisfy an owned downstream API.
- Clone intentionally: snapshots, `Arc`/`Rc` handle sharing, cache returns, or
  small owned values at boundaries.
- Avoid cloning large collections or cloning inside loops to satisfy a weak API.
  Improve the API or borrow instead.

## `Copy`

- Pass small `Copy` values by value: integers, booleans, floats, small IDs, and
  small plain-data structs.
- Derive `Copy` only when every field is `Copy`, the type has no resource
  ownership, and implicit duplication is unsurprising.
- Watch enum size; payload enums are as large as their largest variant.

## `Option` and `Result`

- Use `?` for normal error propagation.
- Use `let Some(x) = value else { ... };` or `let Ok(x) = value else { ... };`
  for simple early returns, `continue`, or `break`.
- Use `match` when multiple variants need distinct behavior or guards.
- Prefer `.ok()`, `.ok_or(...)`, and `.ok_or_else(...)` for simple conversions.
- Avoid `unwrap` and `expect` outside tests unless a panic is the explicit API.

## Iteration

- Use iterators for straightforward map/filter/reduce pipelines.
- Use `for` loops for early exit, stateful control flow, fallible steps, or
  clearer debugging.
- Avoid intermediate `collect()` unless the collection is reused or required by
  an API.
- Prefer `.copied()` and `.cloned()` when collecting borrowed iterator items into
  owned values intentionally.

## Comments and Imports

- Comments should explain rationale, invariants, safety, or non-obvious tradeoffs.
- Replace comments that narrate obvious code with clearer names or smaller
  functions.
- Keep `TODO` comments actionable and linked to an issue when the repo uses one.
- Prefer specific imports. Avoid broad wildcard imports except established
  prelude-style modules or tests that already use them.
