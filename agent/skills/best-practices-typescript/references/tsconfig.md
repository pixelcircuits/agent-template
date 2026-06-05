# TSConfig

## Start from the Repo

Use the existing `tsconfig.json` as the source of truth. Avoid large compiler
option changes unless the task is specifically about configuration or the change
is needed for correctness.

## Strictness Baseline

Prefer:

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitOverride": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

Adopt stricter options incrementally in existing projects if they create many
errors.

## Module and Emit Settings

For app code built by a modern bundler, common settings include:

```json
{
  "compilerOptions": {
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "target": "ES2022",
    "verbatimModuleSyntax": true,
    "noEmit": true
  }
}
```

For Node libraries or CLIs, match `module`, `moduleResolution`, file extensions,
and `package.json` `"type"` to the runtime. Do not assume bundler settings are
valid for direct Node execution.

## Include and Exclude

Make included files explicit enough to avoid accidentally typechecking generated
output or dependency folders:

```json
{
  "include": ["src", "test"],
  "exclude": ["dist", "build", "coverage"]
}
```

## Type Roots and Globals

Avoid broad ambient globals. Keep environment-specific globals scoped:

- browser app: DOM libs are expected
- Node app: include Node types intentionally
- tests: include test runner types in test tsconfig or scoped config

## Path Aliases

Use path aliases sparingly. Make sure runtime, bundler, test runner, and editor
resolution all agree.

If aliases are only cosmetic, prefer relative imports within a small feature
folder.

## Migration Strategy

For JavaScript-to-TypeScript migration:

1. enable `allowJs` only as a temporary bridge
2. convert leaf modules first
3. type public boundaries before internals
4. replace `any` with `unknown` plus narrowing
5. tighten compiler options after the error count is manageable
