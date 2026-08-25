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
   - `dev/components/examples/use-<name>/use-<name>.example.tsx` (match shell of existing examples — see below)
   - run `bun run gen:docs` (generates `.code.mdx` + hooks count)
   - register example in `dev/pages/index/+Page.tsx`
4. **Verify the example against the real hook API** (read the return type / JSDoc — do not invent props like `getInputProps` / `refs.window` / `radialMoveProps`).
5. Mark README `[x]` (add ✨ note if enhanced).
6. Update `resources/comparisons.md` with a one-line delta.
7. If you learned a generic translation rule → update `react-to-solid`.
8. Smoke-check before claiming done:
   - `bun run lint:types`
   - `bun run build` (library)
   - `bun run build:site` (SSR — catches example/API mismatches that types miss)
   - Prefer a quick CDP/`bun run dev` pass on the new example card

## Example conventions

Match pre-existing cards (`use-timeout`, `use-counter`, `use-hover`, `use-move`):

- Shell: `flex h-full w-full flex-col items-center justify-center gap-3 rounded-md border p-3 py-10 text-center`
- Buttons: `rounded-md bg-primary …` / `bg-gray-400 …` / `rounded-md border px-2 py-1 text-sm …`
- No dark `neutral-800/900` panels; no `position: fixed` demos that escape the card (use `absolute` + `overflow-hidden` playground instead)
- Spread carefully: if a helper returns Accessors (`style`, `aria-hidden`), unwrap explicitly — don't assume JSX auto-unwraps spreads
- Put action buttons **above** growing lists; give lists `max-h-* overflow-y-auto` so triggers don't jump
- JSON/`<pre>` readouts inside centered cards need `text-left` or braces look centered
- Demo focus rings: use `focus:` (not only `focus-visible:`) when showing programmatic focus return
- Prefer putting reusable demo helpers on the **hook** (`spy.scrollTo(index)`) instead of duplicating offset math in every example
- Nested scroll demos: `element.scrollIntoView()` also scrolls ancestor containers (including the page). Scroll the host with `host.scrollTo(...)` / `spy.scrollTo(index)` instead
- After example edits, re-run `bun run gen:docs` — stale `.code.mdx` is what the code pane shows

## Demo smoke (CDP)

Dev server is often IPv6-only (`http://[::1]:3000/`). Chrome CDP on `9222` via `agent-browser`.

When asserting a live example, target the **result pane**, not the hidden code pane:

```js
const card = h2.parentElement.parentElement; // ExampleBase root
const pane = [...card.children].find(d =>
  d.classList?.contains('flex-1') && !d.className.includes('bg-[#1c1e28]')
) || card.children[2];
```

Hard-reload before trusting `agent-browser errors` — HMR can leave stale exceptions from earlier API mismatches.

## "Implemented" checklist

A hook is done only when **all** apply:

- [ ] `src/use-<name>/use-<name>.ts` exists and works
- [ ] Exported from `src/index.ts`
- [ ] Example at `dev/components/examples/use-<name>/use-<name>.example.tsx`
- [ ] Example calls the **actual** hook API (cross-check return type / options — not an imagined Mantine React shape)
- [ ] Example registered on docs index (`dev/pages/index/+Page.tsx`)
- [ ] `bun run gen:docs` run (`.code.mdx` + count)
- [ ] README checklist entry checked `[x]` (✨ note if enhanced)
- [ ] Types clean (`bun run lint:types`)
- [ ] `bun run build:site` succeeds (SSR must not throw on the example)

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
| `use-scroll-spy` | `scrollHost` scoping + `scrollTo(index)` (no ancestor scroll) |
| `use-floating-window` | `strategy: 'fixed' \| 'absolute'` for in-card demos |

## Enhancing / omitting

- **Enhance** when Solid APIs make a clearer surface. Document in README `(✨ …)` + comparisons table.
- **Omit** with reason in README — don't leave silent gaps.

## Don't

- Don't invent a second checklist outside README.
- Don't rename hooks away from Mantine except `state` → `signal`.
- Don't put Mantine-specific deltas into `react-to-solid` — that skill stays generic.
- Don't add React-only deps or patterns (`useCallback`, dep arrays, `useRef.current`).
