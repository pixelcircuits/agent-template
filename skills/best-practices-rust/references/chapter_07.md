# Chapter 7 - Type State Pattern

Use the type-state pattern when compile-time states prevent meaningful runtime
mistakes.

## Good Fits

- Builders that must set required fields before `build`.
- Protocols, connections, files, transactions, or workflows with a small number
  of valid ordered states.
- APIs where invalid operations are costly, security-sensitive, or common.

## Avoid When

- States are numerous, dynamic, user-defined, or mostly data-driven.
- Runtime validation is simpler and clear enough.
- The pattern makes public types noisy without eliminating real bugs.

## Minimal Shape

```rust
struct Connection<State> {
    id: String,
    _state: std::marker::PhantomData<State>,
}

struct Disconnected;
struct Connected;

impl Connection<Disconnected> {
    fn connect(self) -> Connection<Connected> {
        Connection { id: self.id, _state: std::marker::PhantomData }
    }
}

impl Connection<Connected> {
    fn send(&self, data: &[u8]) {
        let _ = data;
    }
}
```

Keep state transitions explicit and avoid leaking internal marker types unless
they are part of the intended API.
