# Review Checklist

- Spring Boot, Spring Framework, Java, build tool, servlet/reactive stack, and
  persistence/security versions are understood before recommending APIs.
- Application package layout keeps component scanning predictable.
- Required dependencies use constructor injection; no unnecessary field
  injection or hidden static lookups were added.
- Configuration is externalized, typed, validated, and free of committed
  secrets.
- Controllers handle HTTP concerns; business rules live in services or domain
  code.
- Public API DTOs do not accidentally expose JPA entity internals.
- Security checks cover non-HTTP entry points when relevant.
- Transaction boundaries define real units of work and avoid remote calls while
  holding locks.
- Migrations are versioned and deployable with the app versions that run before,
  during, and after the change.
- Tests use the narrowest useful Spring test scope and real dependencies when
  behavior depends on database, broker, or container semantics.
- Actuator, health checks, logging, metrics, tracing, shutdown, and image
  settings are production-appropriate for the service.
