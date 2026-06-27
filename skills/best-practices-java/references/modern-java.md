# Modern Java

Use newer Java features when the repo's configured Java version supports them and
they make code simpler. Do not upgrade language level just to use a feature.

## Records

Use records for shallowly immutable data carriers where the primary purpose is to
name a fixed set of components.

```java
public record Money(BigDecimal amount, Currency currency) {
  public Money {
    Objects.requireNonNull(amount, "amount");
    Objects.requireNonNull(currency, "currency");
  }
}
```

Avoid records when identity, lazy mutation, framework proxying, or rich lifecycle
behavior is central to the type.

## Sealed Types

Use sealed interfaces or classes when all valid implementations are known and the
compiler should enforce exhaustiveness.

```java
public sealed interface PaymentResult permits Approved, Declined {}
public record Approved(String authorizationCode) implements PaymentResult {}
public record Declined(String reason) implements PaymentResult {}
```

Prefer ordinary interfaces when third parties should implement the type.

## Pattern Matching and Switch

Use pattern matching and switch expressions to remove casts and make branching
exhaustive when the language level supports it. Keep complex business logic out
of switch arms by delegating to named methods.

## `var`

Use `var` for local variables when the initializer makes the type obvious.
Avoid it when the type carries useful domain information or the initializer is a
factory with a broad return type.

## Streams

Use streams for simple map/filter/reduce pipelines. Prefer loops when there is
stateful control flow, checked-exception handling, early exits, or important
debuggability concerns.

## Text Blocks

Use text blocks for multi-line SQL, JSON, XML, and test fixtures. Keep indentation
intentional and avoid building executable queries through unsafe string
concatenation.
