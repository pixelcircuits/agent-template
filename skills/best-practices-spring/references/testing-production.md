# Testing and Production

## Testing

- Use `@WebMvcTest`, `@DataJpaTest`, or other slices for focused framework tests.
- Use `@SpringBootTest` when the full context, configuration, or integration
  behavior is the subject under test.
- Use Testcontainers for integration paths that depend on a real database,
  broker, object store, or external service behavior.
- Keep test data builders close to tests and make clock/time dependencies
  injectable.
- Avoid sleeps, test ordering assumptions, and shared mutable fixtures.

## Production Readiness

- Expose only needed Actuator endpoints and secure management access.
- Configure health, readiness, and liveness probes for the deployment model.
- Prefer structured logs with request correlation IDs.
- Emit useful metrics and traces around external calls, queues, schedulers, and
  business-critical flows.
- Build images with the repo-standard buildpack, Dockerfile, or Jib setup.
- Keep JVM memory settings aligned with container limits.
- Check graceful shutdown and timeout behavior for web, queue, and scheduled
  workloads.
