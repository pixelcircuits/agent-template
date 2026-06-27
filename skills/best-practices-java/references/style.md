# Style

Prefer the project's existing style. If there is no local standard, Google Java
Style is a good conservative default.

## Formatting

- Use the configured formatter when present (`google-java-format`, Spotless,
  Checkstyle, IDE formatter config).
- Keep braces on the same line for classes, methods, and control blocks.
- Use spaces, not tabs, unless the repo already uses tabs.
- Keep lines readable; do not fight generated formatter output.
- Avoid wildcard imports. Use static imports sparingly for test assertions and
  well-known constants.

## Naming

- Packages: lowercase, no underscores.
- Types: `UpperCamelCase`.
- Methods, fields, parameters, and local variables: `lowerCamelCase`.
- Constants: `UPPER_SNAKE_CASE` for `static final` constants whose values are
  deeply immutable.
- Type parameters: one capital letter for common generics (`T`, `E`, `K`, `V`) or
  a clear name ending in `T` for complex APIs.

## Structure

- Keep one public top-level type per file.
- Order code for readers: constants, fields, constructors, public methods,
  package-private/private helpers, nested types. Follow local convention if it
  differs.
- Prefer package-private visibility for implementation details.
- Keep methods small enough to name clearly; extract helpers when they isolate a
  policy, validation step, or reusable transformation.

## Comments and Documentation

- Use comments to explain why code is unusual, not what obvious code does.
- Add Javadoc for public APIs, non-obvious contracts, units, thread-safety, null
  behavior, and exceptions callers should handle.
- Keep TODOs actionable and linked to an issue when the repo uses issue tracking.
