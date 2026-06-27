---
name: best-practices-typescript
description: >
  Guide for writing, reviewing, and refactoring modern TypeScript and JavaScript.
  Use when working with .ts, .tsx, .js, .jsx, .mjs, .cjs, package exports,
  tsconfig.json, ESLint, typescript-eslint, async code, module boundaries,
  API types, generics, narrowing, discriminated unions, unknown/any, promises,
  runtime validation, or JavaScript-to-TypeScript migration.
---

# TypeScript and JavaScript Best Practices

Prefer the repo's runtime, module system, tsconfig, linter, formatter, and package
manager before introducing new conventions.

## References

Read only what the task needs:

- [Type Design](references/type-design.md): `unknown`, narrowing, unions, generics, assertions
- [TSConfig](references/tsconfig.md): strict options, modules, project structure
- [JavaScript Runtime](references/javascript-runtime.md): equality, objects, arrays, DOM/runtime constraints
- [Async and Errors](references/async-errors.md): promises, cancellation, errors, result patterns
- [Modules and Packages](references/modules-packages.md): ESM/CJS, exports, type-only imports, side effects
- [Linting and Formatting](references/lint-format.md): typecheck, ESLint, Prettier, Biome
- [Review Checklist](references/review-checklist.md): JS/TS review checklist

## Defaults

- Use `unknown` at trust boundaries and narrow before use. Avoid `any` unless it
  is isolated and converted immediately.
- Model variants with discriminated unions instead of optional fields that allow
  impossible states.
- Validate JSON, env vars, URL params, storage, and third-party responses at
  runtime.
- Start independent async work together; await, return, or explicitly detach
  every promise.
- Use `import type` for type-only imports, especially with
  `verbatimModuleSyntax`.
- Avoid broad `as`, non-null assertions, mutable exports, hidden module state,
  blanket `@ts-ignore`, and broad lint disables.

## Common Checks

Use repo scripts first. Fallbacks:

```sh
npm run typecheck
npm run lint
npm test
npx tsc --noEmit
npx eslint .
```
