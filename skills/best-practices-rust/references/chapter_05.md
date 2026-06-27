# Chapter 5 - Automated Testing

## Test Shape

- Name tests as behavior: `returns_error_when_input_is_empty`.
- Keep one main behavior per test; multiple assertions are fine when they
  describe one outcome.
- Use small fixtures and builders that remove real duplication.
- Put unit tests near code and integration tests under `tests/` when testing
  crate boundaries or public behavior.

## Doc Tests

- Add doc examples for public APIs when examples clarify usage or contracts.
- Keep doc tests deterministic and small.
- Use `//!` for crate/module docs and `///` for item docs.

## Assertions

- Prefer direct `assert_eq!` or pattern matching over broad boolean assertions.
- For errors, assert stable variants, fields, or predicates.
- Avoid sleeps, wall-clock assumptions, test order coupling, and shared mutable
  global state.

## Snapshot Tests

- Snapshot output that is structured, verbose, and intentionally reviewed.
- Avoid snapshots for unstable ordering, timestamps, random data, or behavior
  where focused assertions are clearer.
- Review snapshot diffs as product or API changes, not as blind updates.
