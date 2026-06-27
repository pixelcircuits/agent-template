# Reliability

## Null Handling

- Make nullness explicit at module boundaries. Use the repo's annotation package
  if one exists.
- Validate constructor and public method inputs with `Objects.requireNonNull`
  when null is not allowed.
- Return empty collections or `Optional<T>` for expected absence. Do not return
  `null` for collections.
- Avoid storing `Optional` in fields or accepting it as a parameter unless the
  local codebase has a clear convention for doing so.

## Exceptions

- Throw exceptions with messages that include the failing field, operation, or
  identifier, but not secrets.
- Preserve causes when translating exceptions.
- Use try-with-resources for `AutoCloseable` resources.
- Catch narrow exception types. Do not catch `Exception` unless adding boundary
  context, cleanup, or framework-required handling.
- When catching `InterruptedException`, either propagate it or call
  `Thread.currentThread().interrupt()` before returning.

## Immutability and Collections

- Prefer immutable value objects and final fields.
- Copy mutable inputs when the object owns them:

```java
public Order(List<LineItem> items) {
  this.items = List.copyOf(items);
}
```

- Return unmodifiable data from public APIs unless mutation is the purpose.
- Be explicit about ordering and duplicates: `List`, `Set`, `SortedSet`,
  `LinkedHashMap`, and `TreeMap` communicate different contracts.

## Equality

- Implement `equals` and `hashCode` together, or let records generate them.
- Do not base equality on mutable fields used in hash collections.
- Use `BigDecimal.compareTo` when numeric equality should ignore scale; use
  `equals` when scale matters.

## Concurrency

- Prefer immutable data, thread confinement, and message passing.
- Use `ExecutorService`, `CompletableFuture`, framework schedulers, or virtual
  threads only when they match the Java version and runtime model.
- Avoid blocking inside shared pools unless the pool is designed for blocking
  work.
- Protect shared mutable state with clear ownership and synchronization.
- Do not use `Thread.sleep` for coordination in production or tests.
