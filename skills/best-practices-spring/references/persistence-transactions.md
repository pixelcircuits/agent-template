# Persistence and Transactions

## Repositories and JPA

- Use repositories for persistence operations, not for business rules.
- Prefer explicit repository methods, projections, and fetch plans over broad
  entity loading.
- Watch for lazy-loading surprises, N+1 queries, missing indexes, and oversized
  entity graphs.
- Keep API DTOs separate from JPA entities when serialization would expose
  persistence internals or trigger unintended loading.

## Transactions

- Put `@Transactional` on service methods that define a unit of work, not on
  every repository call by habit.
- Keep transactions short and avoid remote calls while holding database locks.
- Mark read-only service operations with `@Transactional(readOnly = true)` when
  the codebase uses that convention.
- Make retry behavior explicit for deadlocks, serialization failures, and
  optimistic-lock conflicts.

## Migrations

- Use Flyway or Liquibase for schema changes outside disposable tests.
- Keep migration files deterministic and ordered.
- Split risky production changes into expand, backfill, and contract phases.
- Verify migrations against a disposable database that matches the production
  dialect when feasible.
