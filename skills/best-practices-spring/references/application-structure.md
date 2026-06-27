# Application Structure

## Package Layout

- Keep the main application class in a root package above controllers, services,
  repositories, configuration, and domain code.
- Prefer conventional Spring Boot auto-configuration and component scanning over
  broad manual scans.
- Keep framework entry points thin and move business rules into services or
  domain types.
- Separate API DTOs from JPA entities when persistence shape and wire contract
  differ.

## Dependency Injection

Prefer one public constructor for required dependencies:

```java
@Service
class InvoiceService {
    private final InvoiceRepository invoices;
    private final Clock clock;

    InvoiceService(InvoiceRepository invoices, Clock clock) {
        this.invoices = invoices;
        this.clock = clock;
    }
}
```

- Avoid field injection, hidden static lookups, and mutable public bean state.
- Inject narrow dependencies instead of broad framework objects when possible.
- Use `Clock`, clients, repositories, and collaborators as explicit dependencies
  so tests can control external behavior.
- Keep request-specific data out of static state and singleton mutable fields.

## Configuration

Use typed config for application settings:

```java
@ConfigurationProperties("billing")
@Validated
record BillingProperties(@NotBlank String currency, @Min(1) int retryLimit) {}
```

- Bind secrets from the deployment environment or secret manager.
- Do not commit real credentials in `application.yml`, tests, examples, or
  Docker files.
- Use profiles for environment differences, not for branching core behavior.
- Validate configuration early so bad deployments fail clearly.
