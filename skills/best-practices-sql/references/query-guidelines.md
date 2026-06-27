# Query Guidelines

- Prefer explicit column lists in application queries and migrations that copy
  data. Use `SELECT *` only for ad hoc exploration or deliberately schema-shaped
  internal queries.
- Keep predicates sargable: compare raw indexed columns to values instead of
  wrapping indexed columns in functions when the dialect cannot use the index.
- Use `EXISTS` for existence checks. Avoid `COUNT(*) > 0` when the database
  would otherwise need to count more rows than necessary.
- Avoid accidental inner joins: predicates on the nullable side of a `LEFT JOIN`
  usually belong in the `ON` clause, not the `WHERE` clause.
- Treat `NULL` deliberately. Use `IS NULL`, `IS NOT NULL`, and dialect-aware
  null-safe equality rather than assuming `=` handles unknown values.
- Add deterministic `ORDER BY` clauses when using `LIMIT`, pagination, window
  functions, or tests that assert row order.
- Prefer keyset pagination for large, frequently accessed pages. Offset
  pagination is acceptable for small or administrative result sets.
- Watch for fanout from one-to-many joins before aggregating. Aggregate at the
  right grain or pre-aggregate in a CTE/subquery.
- Give CTEs and aliases intent-revealing names.
- Keep ORM-generated SQL visible enough to review query count, join shape, and
  selected columns.
