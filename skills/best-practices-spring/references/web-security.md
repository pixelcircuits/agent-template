# Web and Security

## Web APIs

- Keep controllers focused on HTTP concerns: request parsing, validation,
  status codes, headers, and response DTOs.
- Use Bean Validation on request objects and method parameters.
- Return stable error shapes with `@ControllerAdvice` or `ProblemDetail`.
- Avoid leaking JPA entities directly from public REST APIs unless the entity is
  deliberately the API contract.
- Make pagination, sorting, filtering, and idempotency contracts explicit.

## Security

- Define authorization with an explicit `SecurityFilterChain`.
- Keep CSRF enabled for browser/session apps; disable it only for true stateless
  APIs after checking the authentication mechanism.
- Validate method-level authorization on service operations when controller
  routes are not the only entry point.
- Treat scheduled jobs, listeners, async handlers, and messaging consumers as
  separate entry points that may need authorization or tenant checks.
- Do not log tokens, passwords, session IDs, or personally sensitive data.

## Avoid by Default

- Blanket `permitAll`
- Disabled CSRF without a stated reason
- Authentication checks only in UI code
- Business logic in controllers, filters, or listeners
- Mapping every exception to HTTP 500
