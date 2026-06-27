---
name: best-practices-java
description: >
  Guide for writing, reviewing, and refactoring modern Java code. Use when
  working with .java files, Java APIs, Maven or Gradle projects, JUnit tests,
  Java concurrency, exceptions, null handling, collections, streams, records,
  sealed classes, static analysis, formatting, or Java code reviews.
---

# Java Best Practices

Prefer local project conventions first. Use newer Java features only when the
configured Java version supports them and they make the code clearer.

## References

Read only what the task needs:

- [Style](references/style.md): formatting, naming, imports, packages, API shape
- [Modern Java](references/modern-java.md): records, sealed types, pattern matching, streams, `var`, text blocks
- [Reliability](references/reliability.md): nulls, exceptions, resources, immutability, collections, concurrency
- [Testing and Tooling](references/testing-tooling.md): JUnit, Mockito, Maven, Gradle, static analysis
- [Review Checklist](references/review-checklist.md): Java review checklist

## Workflow

1. Identify the Java version, build tool, formatter, framework, and test stack.
2. Match existing package layout, visibility, naming, annotations, and nullness
   conventions.
3. Keep APIs small and explicit. Prefer package-private until callers need more.
4. Make absence and failure clear: avoid hidden `null` contracts, preserve
   exception causes, return empty collections instead of `null`, and use
   try-with-resources.
5. Prefer immutable values, defensive copies at ownership boundaries, and boring
   concurrency: thread confinement, executors, futures, or framework-managed
   work.
6. Test behavior, edge cases, and failure paths with focused JUnit tests.

## Common Checks

Use repo scripts first. Fallbacks:

```sh
./mvnw test
./mvnw verify
./gradlew test
./gradlew check
```
