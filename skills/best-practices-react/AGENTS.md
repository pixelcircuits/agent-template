# React Best Practices

This directory stores concise React and Next.js performance rules for agent use.
Do not load every rule by default.

Use `SKILL.md` as the entrypoint, `rules/_sections.md` for priority order, and
then read only the rule files that match the task:

- `async-*`: waterfalls and async scheduling
- `bundle-*`: bundle size and loading
- `server-*`: server components, actions, caching, serialization
- `client-*`: client data fetching, event listeners, browser storage
- `rerender-*`: state shape, memoization, effects, transitions
- `rendering-*`: hydration, scripts, SVG, browser rendering
- `js-*`: hot-path JavaScript optimizations
- `advanced-*`: specialized patterns

For broad performance reviews, start with `async`, `bundle`, and `server`, then
open lower-priority categories only when the changed code makes them relevant.
