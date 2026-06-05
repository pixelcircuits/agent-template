# Review Checklist

Use this checklist for TypeScript and JavaScript reviews.

## Runtime and Modules

- Runtime assumptions are clear: browser, Node, edge, test, or SSR.
- Module syntax matches package and TypeScript configuration.
- Type-only imports are marked with `import type`.
- Public package exports are intentional.
- Import-time side effects are avoided or obvious.

## Types

- `strict` assumptions are respected.
- External data is validated before being trusted.
- `unknown` is narrowed before use.
- `any`, `as`, and non-null assertions are absent or justified.
- Discriminated unions model variants without impossible states.
- Exported functions and public APIs have clear types.

## JavaScript Behavior

- Equality is explicit.
- Object and array copies are understood to be shallow.
- `Map` and `Set` are used where repeated lookups justify them.
- Date, time zone, currency, and decimal behavior are deliberate.
- Browser-only APIs are guarded outside browser-only code.

## Async and Errors

- Promises are awaited, returned, or intentionally detached with error handling.
- Independent async work runs in parallel.
- Expected domain failures have explicit handling.
- Caught errors are treated as `unknown`.
- Cancellation, timeouts, and retries are deliberate where relevant.
- Logs do not leak secrets.

## Tooling

- Typecheck passes or known failures are reported.
- Lint passes or suppressions are narrow and explained.
- Formatter has been applied or checked.
- Tests cover changed behavior, including error paths.

## Escalation

Recommend stronger validation, clearer module boundaries, or architecture changes
when types are being used to hide runtime uncertainty or when many assertions are
needed to make code compile.
