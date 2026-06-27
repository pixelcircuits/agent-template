# Chapter 4 - Error Handling

## Results and Panics

- Return `Result<T, E>` for expected failures.
- Reserve `panic!`, `unwrap`, and `expect` for tests, examples, impossible
  invariants, or process-fatal conditions that are explicitly acceptable.
- Include useful context without leaking secrets.

## Error Types

- Use `thiserror` for libraries and crates with meaningful domain errors.
- Use `anyhow` at application or binary edges where callers only need context and
  a final report.
- Preserve source errors with `#[source]`, `#[from]`, or explicit wrapping.
- Keep error enums focused; split very broad hierarchies by subsystem when it
  improves caller handling.

## Propagation

- Prefer `?` over nested `match` chains for simple propagation.
- Use `map_err` or context helpers to add boundary information.
- Handle async cancellation, timeouts, and retry semantics explicitly where the
  runtime or protocol makes them relevant.

## Testing

- Test expected error paths, not only successful behavior.
- Assert on stable error variants or user-facing messages, not fragile debug
  formatting.
