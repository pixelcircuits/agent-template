# Testing and Tooling

## Unit Tests

- Use JUnit Jupiter and the JUnit Platform when available. Follow the existing
  test naming style.
- Test observable behavior, edge cases, and failure paths.
- Prefer one reason for failure per test.
- Use parameterized tests for the same behavior across multiple inputs.
- Keep fixtures small and close to the test unless shared builders remove real
  duplication.

## Mocks

- Mock slow, remote, random, or time-dependent boundaries.
- Do not mock records, simple data classes, collections, or code that is cheaper
  to construct directly.
- Prefer fakes or test doubles when behavior matters more than call counting.

## Build Commands

Use wrappers when present:

```sh
./mvnw test
./mvnw verify
./gradlew test
./gradlew check
```

For focused Maven checks:

```sh
./mvnw -pl module-name test
./mvnw -Dtest=ClassNameTest test
```

For focused Gradle checks:

```sh
./gradlew :module:test
./gradlew test --tests 'com.example.ClassNameTest'
```

## Static Analysis

- Checkstyle: formatting and style rules.
- SpotBugs: bytecode-level bug patterns.
- PMD: source-level bug patterns and maintainability rules.
- Error Prone: compile-time bug checks.
- google-java-format or Spotless: deterministic formatting.

Prefer tools already configured in the repo. When adding a tool, start with a
small ruleset that catches real bugs before enforcing subjective style.
