# Transactions and Performance

## Transactions

- Keep transactions short and choose isolation levels deliberately.
- Lock rows in a stable order when possible.
- Make retry behavior explicit for serialization failures, deadlocks, and lock
  timeouts.
- Avoid user interaction, network calls, or long computation while holding
  database locks.
- Preserve idempotency for retried write paths.

## Performance

- Use the database's `EXPLAIN` tooling for non-trivial queries.
- Check row estimates, scan types, join strategies, sort/hash steps, predicate
  pushdown, and whether predicates are sargable.
- Validate performance with representative data shape, cardinality, and
  distribution, not only empty local databases.
- Review query count and access pattern for N+1 behavior in ORM paths.
- Consider write cost, storage cost, and maintenance overhead before adding
  indexes.
- Prefer measuring the specific query plan over assuming a generic SQL pattern
  is faster in every dialect.
