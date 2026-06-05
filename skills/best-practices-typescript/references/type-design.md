# Type Design

## Type Safety Priorities

Prefer types that make invalid states unrepresentable and force callers to handle
important cases.

- Use `unknown` for untrusted input.
- Avoid `any`; if needed, isolate it at a boundary and convert to a safer type.
- Prefer discriminated unions for variants.
- Prefer explicit return types on exported functions.
- Prefer literal unions over enums for simple closed sets.
- Prefer `readonly` for values that should not be mutated.

## `unknown` vs `any`

`unknown` requires narrowing before use:

```ts
function getMessage(value: unknown): string {
  if (value instanceof Error) return value.message;
  if (typeof value === "string") return value;
  return "Unknown error";
}
```

`any` opts out of checking. Use it only for localized interop with untyped
libraries, and convert it to typed values immediately.

## Narrowing

Use standard narrowing:

```ts
if (typeof value === "string") {
  return value.toUpperCase();
}

if (Array.isArray(value)) {
  return value.length;
}
```

Use user-defined type guards when the logic is reused:

```ts
function isUser(value: unknown): value is User {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    "email" in value
  );
}
```

For complex external data, prefer schema validation with the project's existing
library.

## Discriminated Unions

Use a stable discriminant field:

```ts
type Payment =
  | { kind: "card"; last4: string }
  | { kind: "ach"; accountId: string }
  | { kind: "wire"; reference: string };
```

Check exhaustiveness so adding a new variant becomes a compile error:

```ts
function assertNever(value: never): never {
  throw new Error(`Unhandled case: ${String(value)}`);
}

function describe(payment: Payment): string {
  switch (payment.kind) {
    case "card":
      return `card ****${payment.last4}`;
    case "ach":
      return `ach ${payment.accountId}`;
    case "wire":
      return `wire ${payment.reference}`;
    default:
      return assertNever(payment);
  }
}
```

## Optional Fields

Avoid optional fields that create ambiguous state:

```ts
type Bad = {
  loading?: boolean;
  data?: User;
  error?: Error;
};
```

Prefer a union:

```ts
type Good =
  | { status: "loading" }
  | { status: "success"; data: User }
  | { status: "error"; error: Error };
```

## Generics

Use generics when relationships between inputs and outputs matter:

```ts
function first<T>(items: readonly T[]): T | undefined {
  return items[0];
}
```

Avoid generic parameters that are used only once; they often hide simpler concrete
types.

## Assertions

Use `satisfies` to check shape without widening:

```ts
const routes = {
  home: "/",
  settings: "/settings",
} as const satisfies Record<string, `/${string}`>;
```

Avoid broad assertions:

```ts
const user = value as User;
```

If an assertion is necessary, keep it close to a runtime check or explain why it
is sound.

## Interfaces vs Type Aliases

Use either consistently with the repo. Practical defaults:

- `interface` for public object shapes designed for extension or declaration merging
- `type` for unions, mapped types, conditional types, tuples, and aliases

Do not churn existing code just to switch between them.
