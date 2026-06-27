# Schema and Migrations

## Schema

- Choose domain-appropriate types: exact numerics for money, timezone-aware
  timestamps where supported for instants, bounded text when the bound is real,
  and native JSON only when relational constraints are not needed.
- Add constraints with names that make violations understandable in logs and
  application errors.
- Use `NOT NULL`, `UNIQUE`, `CHECK`, foreign keys, explicit defaults, and
  generated columns when the database can enforce the invariant.
- Design indexes from access patterns: filters, joins, ordering, uniqueness, and
  foreign key maintenance.
- Avoid redundant indexes whose leading columns overlap without a clear planner
  or constraint purpose.

## Migrations

- Split high-risk migrations into expand, backfill, and contract phases when
  changing large tables or deployed application contracts.
- Backfill in batches for large tables.
- Avoid long exclusive locks in production paths; use the dialect's
  online/concurrent DDL features when available.
- Do not silently change semantics with broad defaults, lossy casts, timezone
  conversion, collation changes, or case-insensitive comparisons.
- Include rollback, retry, and partial-failure considerations for risky changes.
