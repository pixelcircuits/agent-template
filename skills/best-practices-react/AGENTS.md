# React Best Practices

This directory stores concise React and Next.js performance rules for agent use.
Do not load every rule by default.

Use `SKILL.md` as the entrypoint, `rules/_sections.md` for priority order, and
then read only the category files that match the task:

- `rules/async.md`: waterfalls and async scheduling
- `rules/bundle.md`: bundle size and loading
- `rules/server.md`: server components, actions, caching, serialization
- `rules/client.md`: client data fetching, event listeners, browser storage
- `rules/rerender.md`: state shape, memoization, effects, transitions
- `rules/rendering.md`: hydration, scripts, SVG, browser rendering
- `rules/js.md`: hot-path JavaScript optimizations
- `rules/advanced.md`: specialized patterns

For broad performance reviews, start with `async`, `bundle`, and `server`, then
open lower-priority categories only when the changed code makes them relevant.
