# Chapter 3 - Performance Mindset

## Measure First

- Benchmark release builds, not debug builds.
- Use existing benchmarks, profilers, tracing, or flamegraphs before broad
  rewrites.
- Optimize hot paths and allocation-heavy paths before cold setup code.

## Allocation and Cloning

- Avoid redundant clones, especially in loops and request paths.
- Borrow in APIs when possible; use `Cow<'_, T>` when callers may provide either
  borrowed or owned data.
- Avoid intermediate collections in iterator chains unless needed for reuse,
  sorting, grouping, ownership, or API compatibility.

## Stack vs Heap

- Keep stack values reasonably small. Box large enum variants or large recursive
  structures when size hurts moves or stack use.
- Use `Vec`, `Box`, `Arc`, or other heap-backed types when data is large,
  dynamically sized, recursive, or shared.
- Do not add heap allocation just to avoid thinking about ownership.

## Zero-Cost Abstractions

- Prefer iterators, generics, and small helper functions when they make intent
  clear; Rust usually optimizes them well.
- Confirm performance-sensitive changes with measurements when the tradeoff is
  not obvious.
