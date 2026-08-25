# Mantine ↔ bagon comparisons

Living evidence for **this repo only**. Generic translation rules belong in skill `react-to-solid`.

Upstream: `mantinedev/mantine` → `packages/@mantine/hooks/src/<hook>/`.

Legend: **≈** near-literal · **Δ** translation delta · **✨** intentional enhancement · **★** bagon-only

## DOM / ref hooks

| Hook | React shape | Solid shape | Notes |
| --- | --- | --- | --- |
| `use-click-outside` | `useRef` + `useEffect` + deps | signal ref + `createEffect` + `onCleanup` | Δ return `setRef` |
| `use-hover` | state + ref + effect | signal + signal ref + effect | ≈ |
| `use-mouse` | ref + listeners | signal ref + pos signals | ≈ |
| `use-move` | refs + rAF + flags | signal ref + `let` rAF/flags | Δ |
| `use-fullscreen` | ref + vendor events | signal ref + same helpers | ≈ |
| `use-intersection` | callback/ref + observer | **callback ref** + signal entry | ✨ optional `callback` |
| `use-in-viewport` | wraps intersection | same | ≈ |
| `use-resize-observer` | ref + state rect | signal ref + **store + reconcile** (`{ rect }`) | Δ |
| `use-hotkeys` | `useEffectEvent` + effect | `createEffect` + `onCleanup` | Δ drop EffectEvent |
| `use-idle` | timers + events | `let` timers + effect | ≈ |
| `use-long-press` | handlers + `useEffectEvent` + timeout | handlers + `let` timeout/flags; DOM events | Δ drop EffectEvent / React event types |
| `use-scroll-direction` | state + scroll/resize listeners | signal + `onMount` listeners | ≈ |
| `use-page-leave` | `useEffectEvent` + mouseleave | `onMount` + `onCleanup` | Δ drop EffectEvent |

## State helpers

| Hook | Notes |
| --- | --- |
| `use-disclosure` | ✨ adds `set(value)` |
| `use-toggle` / `use-counter` | ≈ signals |
| `use-uncontrolled` | Δ return accessors |
| `use-input-state` | ≈ |
| `use-did-update` | Δ `let mounted` + `onMount` + effect |
| `use-mounted` | signal + `onMount` |
| `use-previous` | Δ `let` + signal + `on(value)`; return accessor |

## Timing

| Hook | Notes |
| --- | --- |
| `use-timeout` / `use-interval` | `let` handle + start/clear |
| `use-debounced-value` | effect → delayed signal |
| `use-debounced-callback` | `let` timer |
| `use-debounced-signal` | ★ rename (`state`→`signal`) |

## Subscriptions / browser

| Hook | Notes |
| --- | --- |
| `use-media-query` | matchMedia + effect; `getInitialValueInEffect` |
| `use-color-scheme` | builds on media query |
| `use-reduced-motion` | wraps media query |
| `use-network` / visibility / orientation | window events + signals |
| `use-hash` / title / favicon | sync signal ↔ browser API |
| `use-os` / eye-dropper / clipboard | feature-detect + SSR guards |

## Storage

| Hook | Notes |
| --- | --- |
| `use-local-storage` | signal path ≈ |
| store variant | ✨ `createStore` + `reconcile` + custom event |

## New in bagon

| Hook | Notes |
| --- | --- |
| `use-keyboard` | ★ general keydown/keyup; distinct from hotkeys |

## Omitted

See README strikethroughs (`use-isomorphic-effect`, `use-force-update`, merged/callback/state refs, window-event shims, etc.).

## Extending

1. `gh_grep` / raw fetch upstream.
2. Diff vs `src/use-<name>/`.
3. Add one row (≈/Δ/✨).
4. If a **generic** rule appears → patch skill `react-to-solid`, not only this table.
