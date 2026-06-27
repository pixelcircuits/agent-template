# Chapter 9 - Pointers and Shared Ownership

## Common Choices

- `&T`: shared borrow for read-only access without ownership transfer.
- `&mut T`: exclusive borrow for mutation without ownership transfer.
- `Box<T>`: heap allocation, recursive types, large values, or owned trait
  objects.
- `Rc<T>`: shared ownership on one thread.
- `Arc<T>`: shared ownership across threads.
- `RefCell<T>`: single-thread interior mutability checked at runtime.
- `Cell<T>`: single-thread interior mutability for `Copy` values.
- `Mutex<T>`: thread-safe exclusive mutation.
- `RwLock<T>`: thread-safe many-readers or one-writer access.
- Raw pointers: FFI or low-level code only; require explicit unsafe invariants.

## Thread Safety

- `Send` means a value can move to another thread.
- `Sync` means references to a value can be shared across threads.
- Prefer `Arc<Mutex<T>>` or message passing for shared mutable cross-thread
  state; prefer immutable sharing when possible.
- Avoid holding locks across `.await` unless using an async-aware lock and the
  design requires it.

## One-Time Initialization

- Use `OnceLock` or `LazyLock` for thread-safe global initialization.
- Use `OnceCell` or `LazyCell` for single-thread initialization.
- Keep global mutable state rare, small, and justified.
