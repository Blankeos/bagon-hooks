---
name: bagon-hooks-maintain
description: Maintain bagon-hooks — Mantine hooks ported to SolidJS. Use when adding/updating/omitting hooks, checking upstream parity, wiring examples, or editing the README checklist.
---

# bagon-hooks maintain

Port [@mantine/hooks](https://mantine.dev/hooks/package/) → SolidJS. Keep it familiar to Mantine, Solid-idiomatic where it matters.

## References

1. **Docs**: https://mantine.dev/hooks/package/ (+ per-hook pages)
2. **Source** via `gh_grep` on `mantinedev/mantine`, path `packages/@mantine/hooks/src/<hook>/`
   - Example: https://github.com/mantinedev/mantine/blob/master/packages/@mantine/hooks/src/use-click-outside/use-click-outside.ts
3. **React → Solid**: load skill `react-to-solid` (generic guidebook). Cross-compare Mantine source with existing ports in `src/`.
4. **Local evidence**: [resources/comparisons.md](resources/comparisons.md) — Mantine ↔ bagon deltas.

After a non-trivial port:
- reusable **translation** lesson → update `react-to-solid`
- Mantine/bagon-specific delta → update `resources/comparisons.md` here

## Conventions

- Always prefix with `use` (no Solid `create*` naming) — familiarity with Mantine.
- Rename only: `state` → `signal` (e.g. `use-debounced-signal`).
- Zero deps besides `solid-js`.
- Prefer signal-as-ref when the effect must react to mount: `const [ref, setRef] = createSignal(); return setRef;`
- Cleanup with `onCleanup` inside `createEffect`.

## Hook categories (README is source of truth)

| Status | README mark | Meaning |
| --- | --- | --- |
| Omitted | `[x] ~~name~~ (reason)` | Skip — Solid already covers it, or Mantine-internal |
| Included | `[x] name` | Straight port |
| Enhanced | `[x] name (✨ …)` | Port + opinionated Solid improvements |
| New | under `### New in Bagon Hooks` | Not in Mantine |
| Pending | `[ ] name` | Not done yet |

Checklist in `README.md` must stay **alphabetically ordered**. No separate parity list.

## Upstream monitoring

Periodically compare Mantine's hook list vs README:

1. List upstream: `packages/@mantine/hooks/src/` (or docs package page).
2. For each new hook → decide: **add** (unchecked in README) or **omit** (checked + strikethrough + short reason).
3. Insert alphabetically into the README checklist.
4. Only check `[x]` when fully implemented (see below).

Omit when Solid already has a good API (e.g. `use-isomorphic-effect` → `createEffect`, `use-force-update` unnecessary).

## Adding a hook (workflow)

1. Read Mantine docs + `gh_grep` the source.
2. Port with `react-to-solid`; peek at a similar hook in `src/` + `resources/comparisons.md`.
3. Files:
   - `src/use-<name>/use-<name>.ts`
   - export from `src/index.ts`
   - `dev/components/examples/use-<name>/use-<name>.example.tsx`
   - run `bun run gen:docs` (generates `.code.mdx` + hooks count)
   - register example in `dev/pages/index/+Page.tsx`
4. Mark README `[x]` (add ✨ note if enhanced).
5. Update `resources/comparisons.md` with a one-line delta.
6. If you learned a generic translation rule → update `react-to-solid`.
7. Smoke-check: `bun run lint` / open `bun run dev`.

## "Implemented" checklist

A hook is done only when **all** apply:

- [ ] `src/use-<name>/use-<name>.ts` exists and works
- [ ] Exported from `src/index.ts`
- [ ] Example at `dev/components/examples/use-<name>/use-<name>.example.tsx`
- [ ] Example registered on docs index (`dev/pages/index/+Page.tsx`)
- [ ] `bun run gen:docs` run (`.code.mdx` + count)
- [ ] README checklist entry checked `[x]` (✨ note if enhanced)
- [ ] Types clean (`bun run lint:types`)

Optional (not required today): unit tests.

## Known enhancements (✨)

| Hook | Enhancement |
| --- | --- |
| `use-disclosure` | extra `set(value)` |
| `use-local-storage` | store variant (`createStore` + `reconcile`) |
| `use-intersection` | optional `callback` |
| `use-hotkeys` | drop React `useEffectEvent` (unneeded in Solid) |
| `use-debounced-signal` | rename of Mantine debounced-state |
| `use-keyboard` | new — not in Mantine |

## Enhancing / omitting

- **Enhance** when Solid APIs make a clearer surface. Document in README `(✨ …)` + comparisons table.
- **Omit** with reason in README — don't leave silent gaps.

## Don't

- Don't invent a second checklist outside README.
- Don't rename hooks away from Mantine except `state` → `signal`.
- Don't put Mantine-specific deltas into `react-to-solid` — that skill stays generic.
- Don't add React-only deps or patterns (`useCallback`, dep arrays, `useRef.current`).
