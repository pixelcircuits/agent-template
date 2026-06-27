# Chapter 8 - Comments and Documentation

## Comments

- Comment rationale, invariants, safety, tradeoffs, and surprising constraints.
- Do not comment obvious mechanics.
- Delete commented-out code unless the repo intentionally preserves examples.
- Keep TODOs actionable and linked to an issue when possible.

## Prefer Clear Code

Before adding a long explanatory comment, consider:

- clearer names
- smaller functions
- explicit types
- extracting a policy or validation helper

## Rustdoc

- Use `///` for public items and `//!` for crate or module docs.
- Document purpose, important contracts, errors, panics, examples, and safety
  requirements.
- For libraries, consider `#![deny(missing_docs)]` only when the crate can absorb
  the maintenance cost.
- Keep examples small and deterministic so doc tests remain useful.

## Safety Docs

Unsafe functions and unsafe blocks need nearby comments or docs explaining the
invariants the caller or block must uphold.
