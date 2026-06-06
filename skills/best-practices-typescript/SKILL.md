---
name: best-practices-typescript
description: >
  Guide for writing, reviewing, and refactoring modern TypeScript and JavaScript.
  Use when working with .ts, .tsx, .js, .jsx, .mjs, .cjs, package exports,
  tsconfig.json, ESLint, typescript-eslint, async code, module boundaries,
  API types, generics, narrowing, discriminated unions, unknown/any, promises,
  runtime validation, or JavaScript-to-TypeScript migration.
license: MIT
compatibility: TypeScript 5+, JavaScript ES2022+, Node.js, browser runtimes, ESLint, typescript-eslint
metadata:
  version: "1.0.0"
allowed-tools: Bash(npm:*) Bash(pnpm:*) Bash(yarn:*) Bash(bun:*) Bash(npx:*) Read Write Edit Glob Grep
---

# TypeScript and JavaScript Best Practices

Apply these guidelines when writing or reviewing TypeScript and modern JavaScript.

## References

Read only what the task needs:

- [Type Design](references/type-design.md): `unknown` vs `any`, narrowing, unions, generics, utility types, assertions
- [TSConfig](references/tsconfig.md): strict compiler options, module settings, project structure
- [JavaScript Runtime](references/javascript-runtime.md): values, equality, objects, arrays, iteration, DOM/runtime constraints
- [Async and Errors](references/async-errors.md): promises, `async`/`await`, cancellation, error boundaries, result patterns
- [Modules and Packages](references/modules-packages.md): ESM/CJS, package exports, type-only imports, side effects
- [Linting and Formatting](references/lint-format.md): TypeScript checks, ESLint, typescript-eslint, Prettier/Biome
- [Review Checklist](references/review-checklist.md): concise checklist for JS/TS reviews

## Core Workflow

1. **Identify the runtime and module system.** Browser, Node, edge, test runner,
   bundler, ESM, and CommonJS choices affect valid syntax and emitted code.

2. **Let tools define the baseline.** Prefer existing `tsconfig`, ESLint,
   typescript-eslint, Prettier, or Biome rules. Strengthen them only when the
   repo can absorb the stricter checks.

3. **Maximize useful static safety.** Prefer `strict` TypeScript, explicit API
   boundaries, `unknown` for untrusted input, discriminated unions for variants,
   and `satisfies` when checking shape without widening.

4. **Keep runtime behavior explicit.** Validate external data at boundaries.
   Do not pretend TypeScript types prove JSON, environment variables, URL params,
   localStorage, or third-party responses are valid.

5. **Validate changes.** Run the repo's typecheck, linter, formatter check, and
   relevant tests. If a tool is unavailable, say so and still review manually.

## Quick Reference

### Prefer `unknown` at Boundaries

```ts
function parseUser(input: unknown): User {
  if (!isUser(input)) {
    throw new Error("Invalid user");
  }
  return input;
}
```

Use `unknown` until code proves the shape. Avoid `any` unless it is isolated and
documented.

### Model Variants with Discriminated Unions

```ts
type LoadState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: Error };
```

Prefer unions over optional fields that allow impossible states.

### Validate External Data

```ts
const raw: unknown = await response.json();
const payload = parsePayload(raw);
```

Types describe code, not remote data. Parse or validate at trust boundaries.

### Async Work

```ts
const [user, settings] = await Promise.all([
  fetchUser(userId),
  fetchSettings(userId),
]);
```

Start independent async work together. Handle expected failures deliberately.

### Imports

```ts
import type { User } from "./types";
import { createUser } from "./users";
```

Use type-only imports when imports are only used as types, especially with
`verbatimModuleSyntax`.

### Avoid These by Default

- `any`, broad `as` assertions, and non-null assertions (`!`)
- `enum` for new code when literal unions or `as const` objects work better
- mutable exports and hidden module-level state
- unhandled promises
- blanket `// @ts-ignore` or broad lint disables
- defaulting to classes when functions and plain data are enough

## Tool Commands

Use the repo's scripts first. Common fallbacks:

```sh
npm run typecheck
npm run lint
npm test
npx tsc --noEmit
npx eslint .
```

Use the equivalent `pnpm`, `yarn`, or `bun` commands when the repo standardizes on
one package manager.

## Skill Maintenance

An agent may update this skill when the user asks for skill changes. To find the
source repository, read the single path in this skill directory's `source.txt`,
then edit the matching source files under that repo's
`skills/best-practices-typescript/`. After updating the source, run the repo root
`install-skills.sh` script so the installed skill copies are refreshed.
