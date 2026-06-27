---
name: best-practices-react
description: React and Next.js performance optimization guidelines. Use when writing, reviewing, or refactoring React components, Next.js pages, data fetching, server components, bundle size, rendering behavior, or UI performance.
---

# React Best Practices

Use this skill for React and Next.js performance work. Prefer the app's existing
architecture, framework version, data-fetching library, and lint rules before
introducing new patterns.

## References

Read selectively:

- [Sections](rules/_sections.md): category order and impact levels
- `rules/async-*.md`: waterfalls and async scheduling
- `rules/bundle-*.md`: bundle size and loading
- `rules/server-*.md`: server components, server actions, caching, serialization
- `rules/client-*.md`: client data fetching, event listeners, browser storage
- `rules/rerender-*.md`: state shape, memoization, effects, transitions
- `rules/rendering-*.md`: hydration, scripts, SVG, browser rendering
- `rules/js-*.md`: JavaScript hot-path optimizations
- `rules/advanced-*.md`: specialized patterns that need extra care

For broad reviews, start with `async`, `bundle`, and `server` rules, then inspect
lower-impact categories only where the code points to them.

## Defaults

- Start independent async work together and await as late as correctness allows.
- Avoid importing broad barrels, heavy client components, or third-party scripts
  into the initial route unless they are needed immediately.
- Keep request data out of shared module state. Authenticate server actions and
  API routes at the boundary.
- Pass the smallest serializable data needed across server/client boundaries.
- Prefer derived render-time values over effect-driven duplicate state.
- Use memoization only when it avoids meaningful work or stabilizes a real
  dependency; do not wrap cheap primitive expressions by default.
- Exercise user-facing changes in a browser when layout, hydration, interaction,
  or loading behavior is part of the task.
