# Review Checklist

Use this checklist for Java code reviews.

- Java version and framework constraints are respected.
- Public APIs are intentionally visible and documented when needed.
- Inputs are validated at boundaries.
- Null behavior is explicit; methods do not return null collections.
- Exceptions preserve causes and are not swallowed.
- Resources use try-with-resources or equivalent lifecycle management.
- Collections communicate mutability, ordering, and duplicate semantics.
- Records, sealed types, streams, and `var` improve clarity rather than novelty.
- Concurrency avoids accidental shared mutable state.
- Tests cover normal behavior, edge cases, and expected failures.
- Mocks are limited to real boundaries.
- Build, tests, formatting, and static analysis pass or skipped checks are
  clearly explained.
