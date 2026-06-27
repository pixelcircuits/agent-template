---
name: best-practices-sql
description: >
  Guide for writing, reviewing, and refactoring SQL, database migrations, schema
  definitions, stored procedures, reports, analytics queries, ORM-generated SQL,
  and data access code. Use when working with .sql files, migrations, indexes,
  constraints, transactions, query plans, SQL injection risks, N+1 queries,
  data modeling, or database performance and portability across PostgreSQL,
  MySQL, SQLite, SQL Server, Oracle, BigQuery, Snowflake, or similar SQL systems.
---

# SQL Best Practices

Prefer the repo's dialect, ORM, formatter, migration tool, and operational
constraints before generic SQL advice.

## References

Read only what the task needs:

- [Query Guidelines](references/query-guidelines.md): readable, safe, sargable SQL
- [Schema and Migrations](references/schema-migrations.md): constraints, types, indexes, deployable migrations
- [Transactions and Performance](references/transactions-performance.md): isolation, locking, plans, representative data
- [Review Checklist](references/review-checklist.md): SQL review checklist

## Workflow

1. Identify the dialect and execution path; syntax, locking, indexing, and query
   plans differ across databases and ORMs.
2. Parameterize runtime values. Validate dynamic identifiers against an
   allow-list when they are unavoidable.
3. Put invariants in the schema with `NOT NULL`, `UNIQUE`, `CHECK`, foreign
   keys, defaults, and appropriate types.
4. Keep queries readable: explicit joins, intentional aliases, clear CTEs, and
   no `SELECT *` in application paths unless the contract requires it.
5. Design indexes from access patterns and check write/storage cost.
6. Validate non-trivial performance with `EXPLAIN` and representative data.
7. Keep transactions short, isolation deliberate, locking order stable, and retry
   behavior explicit.
8. Prove migrations against a disposable database when feasible.

## Common Checks

Use repo scripts first. Fallbacks:

```sh
sqlfluff lint .
sqlfluff fix path/to/query.sql
psql "$DATABASE_URL" -f path/to/migration.sql
psql "$DATABASE_URL" -c "EXPLAIN (ANALYZE, BUFFERS) ..."
```
