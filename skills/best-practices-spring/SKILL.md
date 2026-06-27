---
name: best-practices-spring
description: >
  Guide for writing, reviewing, and refactoring Spring Framework and Spring Boot
  Java applications. Use when working with Spring MVC, REST controllers,
  dependency injection, configuration properties, Spring Security, Spring Data
  JPA, transactions, validation, Actuator, observability, Docker images,
  Testcontainers, integration tests, or production-ready Spring services.
---

# Spring Best Practices

Prefer local Spring conventions first. Use these notes to catch common Spring
structure, persistence, security, testing, and production-readiness issues.

## References

Read only what the task needs:

- [Application Structure](references/application-structure.md): package layout, DI, configuration, boundaries
- [Web and Security](references/web-security.md): controllers, validation, errors, Spring Security
- [Persistence and Transactions](references/persistence-transactions.md): JPA, repositories, migrations, transactions
- [Testing and Production](references/testing-production.md): slices, Testcontainers, Actuator, observability, containers
- [Review Checklist](references/review-checklist.md): Spring review checklist

## Workflow

1. Identify Spring Boot, Spring Framework, Java, servlet/reactive, persistence,
   security, build tool, and test versions before recommending APIs.
2. Keep the main application class in a root package above components so scanning
   and auto-configuration stay predictable.
3. Use constructor injection and typed, validated configuration. Keep secrets
   externalized.
4. Keep controllers focused on HTTP. Put business rules in services or domain
   code. Keep repositories focused on persistence.
5. Put `@Transactional` on service methods that define a unit of work.
6. Use narrow test slices where possible and full `@SpringBootTest` only when
   wiring or integration behavior matters.
7. Check security defaults, management endpoints, health probes, logging,
   metrics/tracing, migrations, graceful shutdown, and container settings.

## Common Checks

Use repo scripts first. Fallbacks:

```sh
./mvnw test
./mvnw verify
./gradlew test
./gradlew check
```
