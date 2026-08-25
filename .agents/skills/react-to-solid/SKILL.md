---
name: react-to-solid
description: Evolving React→Solid translation playbook for porting libraries (hooks, components, utils). Load for any React→Solid port. After every non-trivial port, update this skill with new reusable patterns. Shared foundation for agent-maintained Solid ports.
---

# React → Solid

**Generic, evolving guidebook** for translating React code to SolidJS. Not tied to any one library — repo maintain skills own library-specific conventions, checklists, and upstream parity.

Every non-trivial port across any React→Solid project should leave this skill better.

## Evolution protocol

After a non-trivial port, if you learned a **reusable** translation rule:

1. **Capture it here** — short rule + tiny generic snippet.
2. Put it in the right section (map / rules / patterns / pitfalls / resources).
3. If it conflicts with an old rule, **replace** — don't accumulate contradictions.
4. **Library-specific** naming, checklists, upstream URLs, per-API deltas → the *repo maintain* skill, not here.
5. Long lessons → focused file under `resources/` rather than bloating this SKILL.

Deeper external reference (don't duplicate wholesale): https://github.com/blankeos/react-to-solid-llms

---

## Quick map

| React | Solid |
| --- | --- |
| `useState(0)` → `count` | `createSignal(0)` → `count()` |
| `useRef(null)` DOM, effect depends on mount | `createSignal()` + return **setter** as `ref` |
| `useRef(0)` timers/ids/flags (non-reactive) | plain `let` |
| `useEffect(fn, deps)` + returned cleanup | `createEffect(() => { …; onCleanup(…) })` — or `on(deps, fn)` / manual `_track` for explicit deps |
| `props.children` inspect / map | `children(() => props.children)` then `resolved()` |
| `useLayoutEffect` | usually `createEffect`; `createRenderEffect` if pre-paint |
| `useCallback` / `useMemo` | usually **delete** (body runs once) |
| `useEffectEvent` (stable handler) | plain function — closures already stable |
| `useReducer` / nested object state | `createStore` (+ `reconcile` for replace) |
| `.map` + `key` | `<For each={…}>` |
| `ref.current` | `ref` (`let`) or `ref()` (signal) |
| return `[state, setState]` (values) | return `[accessor, setter]` — callers use `value()` |
| `useId()` | `createUniqueId()` |
| `useSyncExternalStore` | signal + subscribe in `createEffect` / `onMount` |
| Context `useX()` | `useContext(X)` — same idea, providers differ |

## Critical rules

1. **Components/hooks run once.** Don't cargo-cult `useCallback`/`useMemo`.
2. **Don't destructure reactive props** if updates matter — read `props.x` inside tracking scopes.
3. **Call signals:** `count()`. Forgetting `()` is the #1 port bug.
4. **Cleanup** with `onCleanup` inside the effect/mount that registered the listener/timer/observer.
5. **Pick the right ref strategy** — wrong choice = silent "never fires" bugs. See [resources/ref-strategy.md](resources/ref-strategy.md).
6. **Return accessors, not raw values** from hooks that expose state.
7. Prefer **Solid-idiomatic clarity** over 1:1 React shape when behavior stays equivalent. Document library-specific enhancements in the maintain skill.

## Ref strategy (decision tree)

| Need | Use |
| --- | --- |
| Effect must re-run when DOM node attaches | `const [ref, setRef] = createSignal(); return setRef` |
| Bind/unbind observer at attach time only | **callback ref** `(el) => { disconnect; if (el) observe }` |
| Non-reactive box (timer id, rAF id, flag) | `let` |
| Measure a struct that updates often | signal/store for data + signal ref for node |

> Solid docs: [signals as refs](https://docs.solidjs.com/concepts/refs#signals-as-refs). Bare `let el` will **not** retrigger `createEffect` when the node mounts.

## Core patterns

See [resources/patterns.md](resources/patterns.md) for fuller snippets.

### Effect + cleanup (auto-track)

```ts
createEffect(() => {
  const listener = (e: Event) => { /* … */ };
  document.addEventListener(type, listener);
  onCleanup(() => document.removeEventListener(type, listener));
});
```

No dep array — reads inside the effect body are tracked. Bind-once: `onMount` + `onCleanup`.

### Explicit / limited tracking

Auto-track isn't always what you want. To **only** re-run when specific signals change:

```ts
import { on, createEffect } from 'solid-js';

// Option A — `on()` (deps explicit; body does NOT auto-track further reads)
createEffect(on(count, (c) => {
  console.log(c, other()); // `other` is NOT a dependency
}));

// multiple deps
createEffect(on(() => [a(), b()], ([a, b]) => { /* … */ }));

// Option B — manual track reads up front (further reads STILL auto-track)
createEffect(() => {
  const _track = [state1(), state2()]; // ensure these are deps
  // …
});
```

Prefer `on()` when you need to **limit** deps. Use `_track` when you need to **force** certain reads to count (and auto-track the rest is fine).  
`on(..., { defer: true })` skips the initial run (React skip-first patterns).

### Signal-as-ref + element listener

```ts
const [ref, setRef] = createSignal<HTMLElement>();
createEffect(() => {
  const el = ref();
  if (!el) return;
  const onEnter = () => { /* … */ };
  el.addEventListener('mouseenter', onEnter);
  onCleanup(() => el.removeEventListener('mouseenter', onEnter));
});
return setRef;
```

### Callback ref + observer

```ts
let observer: IntersectionObserver | null = null;
const ref = (element: Element | null) => {
  observer?.disconnect();
  observer = null;
  if (!element) return;
  observer = new IntersectionObserver(/* … */);
  observer.observe(element);
};
```

### External subscription (MediaQuery / network / store)

```ts
const [value, setValue] = createSignal(initial);
createEffect(() => {
  const unsub = subscribe(source, setValue);
  onCleanup(unsub);
});
return value;
```

SSR: guard `typeof window === 'undefined'` / `isServer`.

### Timing / debounce

Timer ids are `let`, never signals. Clear before reschedule + on `onCleanup`.

### Skip-first-run effect

```ts
let mounted = false;
onMount(() => { mounted = true; });
createEffect(() => {
  // track…
  if (mounted) fn();
});
```

### Controlled / uncontrolled

```ts
const [_value, setValue] = createSignal(props.defaultValue);
const value = () => props.value ?? _value();
return [value, setValue] as const;
```

### Nested reactive objects

`createStore` + `reconcile`. Nested wrapper (`{ rect }`) often needed so store paths work.

### Props & `children`

- Don't destructure reactive props — read `props.x` inside tracking scopes / JSX.
- If a prop may change over time, hooks often take `Accessor<T> | T` (`MaybeAccessor`) and normalize with a getter.
- `props.children` can be a value **or** a function. To inspect/transform/conditionally render safely, use Solid's `children()` helper:

```ts
import { children, Show } from 'solid-js';

const resolved = children(() => props.children);

// ✅ resolve first, then gate with Show
return <Show when={resolved()}>{resolved()}</Show>;

// optional slot / named child prop — same idea
const trailing = children(() => props.trailing);
return <Show when={trailing()}>{trailing()}</Show>;
```

**Why:** raw `props.children` may be a function; `<Show when={props.children}>` / `typeof props.x === 'function'` is unreliable (accessors and child fns are both functions). `children()` resolves/memoizes so truthiness checks and maps behave. Skipping it is a common cause of **hydration mismatches** (SSR ≠ client).

Passing reactive data to children: prefer render fns / accessors — not snapshots.

Early-return / branching in components (body runs once): use `<Show>` / `<Switch>`/`<Match>` — see also functional-recursion patterns in react-to-solid-llms.

## Port workflow (any library)

1. Read upstream docs + source (`gh_grep` / raw).
2. Find a sibling Solid port with the same *shape* (listener / storage / observer / async).
3. Translate with the map — **no React dep arrays**.
4. Choose ref strategy deliberately.
5. Prefer idiomatic Solid when equivalent.
6. Library checklist / naming / parity → maintain skill.
7. **Reusable translation insight → update this skill.**

## Pitfalls log

- Passing `count` instead of `count()` → stale / non-reactive.
- Bare `let ref` when `createEffect` must see mount → effect never attaches.
- Copying `useMemo`/`useCallback` "for perf" → noise.
- Returning `[value(), set]` from a hook → frozen snapshot for callers.
- Forgetting `onCleanup` for listeners / observers / timers.
- Closing over destructured reactive props and expecting updates.
- `reconcile` on a bare store root without a nested path → awkward updates; wrap as `{ data }`.
- Expecting `_track = [a(), b()]` to *exclude* other reads — it doesn't; use `on()` to limit.
- `<Show when={props.children}>` / `typeof prop === 'function'` for optional slots — resolve with `children()` first (hydration bugs).
- Measuring layout (`scrollHeight`/`getBoundingClientRect`) immediately after setting `style.display` / other styles — Solid batches DOM writes; force a reflow (`el.style.display = 'block'; void el.offsetHeight`) or double `rAF` before measuring. Do not reach for React `flushSync`.
- Tracking a browser object that **mutates in place** (e.g. `document.getSelection()`) with `createSignal` — Solid’s default `equals` sees the same reference and won’t notify. Use `{ equals: false }`, bump a version signal, or store an immutable snapshot.

## Backlog (capture as we learn)

- SSR / `isServer` matrix per browser API
- Ref merging (`props.ref` + internal setter)
- Test porting (RTL → solid-testing-library)
- Provider / context / headless UI patterns
- Async / transitions / optimistic updates

## Resources

| File | What's in it |
| --- | --- |
| [resources/ref-strategy.md](resources/ref-strategy.md) | signal-ref vs callback-ref vs `let` |
| [resources/patterns.md](resources/patterns.md) | Generic before/after snippets |

---

*Correct Solid semantics > literal React shape. Then write the lesson down.*
