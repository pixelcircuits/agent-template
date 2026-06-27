# Chapter 6 - Generics and Dispatch

## Static Dispatch

Use generics or `impl Trait` when the concrete type can be known at compile time:

```rust
fn render(item: impl Display) -> String {
    item.to_string()
}
```

Prefer static dispatch for hot paths, small reusable helpers, and APIs where type
parameters improve caller ergonomics.

## Dynamic Dispatch

Use `dyn Trait` when values of different concrete types must share one collection,
field, or runtime boundary:

```rust
let handlers: Vec<Box<dyn Handler>> = vec![Box::new(a), Box::new(b)];
```

Dynamic dispatch is useful for plugin points and object-safe abstraction
boundaries, but it adds indirection and object-safety constraints.

## API Guidance

- Use `impl Trait` in arguments for simple generic inputs.
- Use named type parameters when multiple arguments or return types must share
  the same concrete type.
- Return `impl Trait` for opaque concrete return types.
- Return boxed trait objects only when runtime heterogeneity or abstraction
  boundaries require it.
- Keep trait bounds close to the functions that need them.
