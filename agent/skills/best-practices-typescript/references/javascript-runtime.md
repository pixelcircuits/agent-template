# JavaScript Runtime

## Types Are Erased

TypeScript types do not exist at runtime. Validate data crossing process, network,
storage, and user-input boundaries.

Trust boundaries include:

- JSON responses
- request bodies
- URL params
- environment variables
- localStorage/sessionStorage
- postMessage payloads
- untyped third-party libraries

## Equality

Prefer strict equality:

```ts
if (status === "ready") {
  start();
}
```

Use loose equality only for a deliberate `null` or `undefined` check and only when
the repo allows it:

```ts
if (value == null) {
  return;
}
```

## Objects

Prefer `Map` when insertion order is part of your contract, when keys are not a
fixed object shape, or when keys are added and looked up frequently. Plain object
key order is spec-defined (integer-like keys ascending, then string keys in
insertion order), but encoding semantics into that order is fragile.

Use object spread for shallow copies:

```ts
const next = { ...current, enabled: true };
```

Remember this is shallow; nested objects remain shared.

## Arrays and Iteration

Use readable array methods for ordinary transformations:

```ts
const activeNames = users.filter((user) => user.active).map((user) => user.name);
```

Use a loop for hot paths, early exit, or when combining many passes improves
clarity and performance.

Use `Set` for repeated membership tests:

```ts
const allowed = new Set(ids);
const visible = rows.filter((row) => allowed.has(row.id));
```

## Mutation

Local mutation is fine when it is contained and clearer. Avoid mutating function
arguments unless the function name and docs make that contract explicit.

Prefer immutable updates for shared state, React state, Redux-style stores, and
cache keys.

## Dates and Numbers

Dates, time zones, currency, and decimal math are common bug sources.

- Store timestamps in a clear format, usually ISO strings or epoch milliseconds.
- Avoid floating-point math for currency.
- Use project-standard date/decimal libraries for non-trivial behavior.

## DOM and Browser APIs

Check for runtime availability before using browser-only globals in SSR, tests,
Node, or edge runtimes:

```ts
if (typeof window !== "undefined") {
  window.localStorage.setItem(key, value);
}
```

Do not use direct DOM manipulation inside framework-managed UI unless the escape
hatch is intentional.
