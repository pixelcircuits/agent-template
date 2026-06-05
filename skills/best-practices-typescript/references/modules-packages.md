# Modules and Packages

## Prefer ES Modules for New Code

Use `import` and `export` for new TypeScript and modern JavaScript unless the
runtime or package constraints require CommonJS.

```ts
export function createUser(input: CreateUserInput): User {
  return { id: input.id, email: input.email };
}
```

## ESM and CommonJS

Do not mix module systems casually. Check:

- `package.json` `"type"`
- TypeScript `module` and `moduleResolution`
- file extensions: `.ts`, `.mts`, `.cts`, `.js`, `.mjs`, `.cjs`
- runtime: Node, browser, bundler, test runner

If Node executes emitted files directly, emitted module syntax must match Node's
expectations.

## Type-Only Imports

Use type-only imports for values only used as types:

```ts
import type { User } from "./types";
```

This avoids accidental runtime imports and works well with
`verbatimModuleSyntax`.

## Package Exports

For libraries, prefer explicit package exports:

```json
{
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    }
  }
}
```

Keep public entrypoints small and intentional. Avoid exposing deep internal paths
unless they are part of the supported API.

## Barrel Files

Barrels can improve ergonomics, but they can also hide dependencies, create
cycles, and hurt tree-shaking in some builds. Use them at stable package or
feature boundaries, not as automatic files in every folder.

## Side Effects

Avoid import-time side effects. Prefer exported initialization functions:

```ts
export function configureTelemetry(options: TelemetryOptions): void {
  // ...
}
```

When side-effect imports are required, make them obvious:

```ts
import "./register-globals";
```

## Circular Dependencies

Circular imports often indicate mixed responsibilities. Break cycles by extracting
shared types, constants, or pure helpers into a lower-level module.

Avoid using cycles that only work because of bundler-specific evaluation order.
