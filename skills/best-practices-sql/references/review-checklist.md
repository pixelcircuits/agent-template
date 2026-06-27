# Review Checklist

- User-provided values are parameterized; dynamic identifiers are allow-listed.
- Queries match the repository's dialect, formatter, ORM, and migration tool.
- Data invariants live in constraints where the database can enforce them.
- Indexes have a clear query or constraint purpose and no obvious redundant
  overlap.
- Expensive queries have been checked with representative data or `EXPLAIN`.
- Transactions, locks, retries, and error handling are explicit enough for the
  write path's risk.
- Migrations are deployable with the app versions that will run before, during,
  and after the change.
- Tests cover nulls, duplicate rows, time zones, collations, empty result sets,
  and large cardinalities where those cases matter.
