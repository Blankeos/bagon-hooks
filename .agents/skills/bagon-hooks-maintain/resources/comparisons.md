# Mantine ↔ bagon comparisons

Living evidence for **this repo only**. Generic translation rules belong in skill `react-to-solid`.

Upstream: `mantinedev/mantine` → `packages/@mantine/hooks/src/<hook>/`.

Legend: **≈** near-literal · **Δ** translation delta · **✨** intentional enhancement · **★** bagon-only

## DOM / ref hooks

| Hook | React shape | Solid shape | Notes |
| --- | --- | --- | --- |
| `use-click-outside` | `useRef` + `useEffect` + deps | signal ref + `createEffect` + `onCleanup` | Δ return `setRef`; `enabled` (4th, ✨ may be an accessor) + `capture` (5th) match Mantine 9.7.5; still keeps bagon's `data-ignore-outside-clicks` check |
| `use-hover` | state + ref + effect | signal + signal ref + effect | ≈ |
| `use-mouse` | ref + listeners | signal ref + pos signals | ≈ |
| `use-move` | refs + rAF + flags | signal ref + `let` rAF/flags | Δ |
| `use-fullscreen` | ref + vendor events | signal ref + same helpers | ≈ |
| `use-intersection` | callback/ref + observer | **callback ref** + signal entry | ✨ optional `callback` |
| `use-in-viewport` | wraps intersection | same | ≈ |
| `use-resize-observer` | ref + state rect | signal ref + **store + reconcile** (`{ rect }`) | Δ |
| `use-hotkeys` | `useEffectEvent` + effect | `createEffect` + `onCleanup` | Δ drop EffectEvent; per-item option defaults (`preventDefault: true`, `usePhysicalKeys: false`), key-name normalisation and `[plus]` ported from 9.7.5 |
| `use-idle` | timers + events | `let` timers + effect | ≈ |
| `use-long-press` | handlers + `useEffectEvent` + timeout | handlers + `let` timeout/flags; DOM events | Δ drop EffectEvent / React event types; `start` ignores re-press (9.7.5) |
| `use-scroll-direction` | state + scroll/resize listeners | signal + `onMount` listeners | ≈ |
| `use-page-leave` | `useEffectEvent` + mouseleave | `onMount` + `onCleanup` | Δ drop EffectEvent |
| `use-scroll-spy` | window scroll + `getActiveElement` | same + optional `scrollHost`; ✨ `scrollTo(index)` uses host `scrollTo` (not `scrollIntoView`); `getNode()` re-resolves detached headings (9.7.5) | ✨ nested hosts |
| `use-floating-window` | `position: fixed` viewport | ✨ `strategy: 'fixed' \| 'absolute'` + parent clamp | ✨ in-card demos |
| `use-collapse` / `use-horizontal-collapse` | React `flushSync` before measure | imperative style write + `offsetHeight` reflow (Solid batches styles); 9.7.5 stale-frame guard (`let` transition id) + `isMeasured` zero-size fallback ported | Δ |
| `use-text-selection` | `useState(Selection)` | signal + `{ equals: false }` / version bump — Selection mutates in place | Δ |
| `use-mutation-observer` | ref + observer | callback/signal ref + options; demos need `subtree: true` for nested adds | ≈ |
| `use-focus-trap` | `useRef` + `Set` of active refs | `createEffect` + module `Set` of `{ node }` tokens | Δ 9.7.5 sequence-based `scope-tab` / `tabbable` copied verbatim (no React); nested traps + `defaultPrevented` Tab guard; dropped Mantine's `NODE_ENV === 'test'` visibility bypass |
| `use-roving-index` | `useUncontrolled` + `useCallback` | own controlled/uncontrolled signal; `getItemProps` returns a getter `tabIndex`; `focusedIndex` is an accessor | Δ **breaking** vs bagon ≤0.0.8 (`getElementProps`/`getElementRef`/`onKeyDown` removed) — Mantine API shape; `total`/`focusedIndex` accept accessors, other options are read lazily from the input object |
| `use-scroller` | `useState` + ref-callback cleanup | signal ref + `createEffect`/`onCleanup`; `canScrollStart`/`canScrollEnd`/`isDragging` are accessors | Δ **breaking** — Mantine API shape; ✨ keeps old `scrollTo`/`scrollToTop`/`scrollToBottom` + `behavior` |
| `use-mask` | refs + callbacks | `{ current }` boxes + signals | ≈ 9.7.5: non-string `e.key` guard, `transform` on initial value, own-value re-apply from raw, `#` token `[+\-0-9]` |
| `use-active-element` | state + effect with deps | signal + `createEffect`/`onCleanup`; options read inside the effect | ≈ 9.8.0, returns accessor |
| `use-browser-language` | state + `languagechange` effect | shared signal helper + effect; also `usePreferredLanguages` | ≈ 9.8.0, returns accessors |

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
| `use-timeout` / `use-interval` | `let` handle + start/clear; `use-timeout` nulls the handle before invoking and spreads `start(...args)` (9.7.5) |
| `use-debounced-value` | effect → delayed signal |
| `use-debounced-callback` | Δ full Mantine 9.7.5 port (`number \| { delay, flushOnUnmount, leading, maxWait }`, `.flush` / `.cancel` / `.isPending`); options are read once (not reactive) — breaking vs bagon ≤0.0.8 only in that the returned fn gained methods |
| `use-debounced-signal` | ★ rename (`state`→`signal`); leading re-arms after `wait` (9.7.5); cleanup via `onCleanup` |

## Subscriptions / browser

| Hook | Notes |
| --- | --- |
| `use-media-query` | matchMedia + effect (`onCleanup`, try/catch like 9.7.5); `getInitialValueInEffect` |
| `use-color-scheme` | builds on media query |
| `use-reduced-motion` | wraps media query |
| `use-network` / visibility | window events + signals |
| `use-orientation` | `getInitialValueInEffect` / `defaultAngle` / `defaultType` ported (9.7.5); listener removed via `onCleanup` |
| `use-hash` / title / favicon | sync signal ↔ browser API |
| `use-os` / eye-dropper / clipboard | feature-detect + SSR guards |

## Storage

| Hook | Notes |
| --- | --- |
| `use-local-storage` | signal path ≈; ✨ `key` may be an accessor — on change re-reads storage, or resets to `defaultValue`/`undefined` (9.7.5). Not ported: `sync` option |
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
