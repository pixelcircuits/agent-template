# Linting and Formatting

## Use Existing Tooling First

Before changing conventions, inspect:

- `package.json` scripts
- `tsconfig.json`
- `eslint.config.*` or `.eslintrc.*`
- `biome.json`
- `.prettierrc*`
- editor or CI config

Run the repo's scripts before fallback commands.

## TypeScript Checks

Prefer a dedicated typecheck command:

```sh
npm run typecheck
```

Fallback:

```sh
npx tsc --noEmit
```

For monorepos, use the workspace command or project references instead of checking
only one package by accident.

## typescript-eslint

For TypeScript projects, prefer type-aware linting when performance is acceptable:

- `recommendedTypeChecked`
- `strictTypeChecked`
- project-specific rules for unsafe `any`, floating promises, and unnecessary assertions

Important rule families:

- no unsafe `any` usage
- no floating promises
- consistent type imports
- no unnecessary assertions
- exhaustive switch checks when configured

## Formatting

Do not fight the formatter. Use Prettier, Biome, or the repo-standard formatter.

Common commands:

```sh
npm run format
npm run lint
npx eslint .
```

Avoid mixing multiple formatters over the same files unless the repo already has a
stable division of responsibility.

## Suppressions

Avoid broad suppressions:

```ts
// @ts-ignore
```

Prefer narrow suppressions with explanations:

```ts
// @ts-expect-error: third-party type omits the documented runtime field
const id = response.requestId;
```

Use `@ts-expect-error` instead of `@ts-ignore` because it fails when the error no
longer exists.

## Dependency Hygiene

Do not add a new dependency when the platform or existing dependencies already
solve the problem well. When adding one, check package manager, lockfile, bundle
impact, runtime support, maintenance, and license expectations.
