# Pattern cookbook (generic React → Solid)

Keep snippets library-agnostic. Port-specific deltas live in each repo's maintain skill.

## State tuple

```ts
// React
const [opened, setOpened] = useState(false);
return [opened, { open, close, toggle }];

// Solid — return accessor
const [opened, setOpened] = createSignal(false);
return [opened, { open, close, toggle }]; // callers: opened()
```

## Controlled / uncontrolled

```ts
const [_value, setValue] = createSignal(props.defaultValue);
const value = () => props.value ?? _value();
return [value, setValue] as const;
```

Never return a naked snapshot from the hook.

## Effect + cleanup

```ts
// React
useEffect(() => {
  document.addEventListener('keydown', handler);
  return () => document.removeEventListener('keydown', handler);
}, [deps]);

// Solid — auto-track; no dep array
createEffect(() => {
  document.addEventListener('keydown', handler);
  onCleanup(() => document.removeEventListener('keydown', handler));
});
```

`useEffectEvent` → delete; use a normal function.

### Explicit / limited tracking

When you need React-like “only these deps”, or to **stop** other reads from becoming deps:

```ts
import { on, createEffect } from 'solid-js';

// `on()` — LIMIT deps; effect body does not auto-track further reads
createEffect(on(count, (c) => { /* … */ }));
createEffect(on(() => [a(), b()], ([a, b]) => { /* … */ }));
createEffect(on(source, fn, { defer: true })); // skip first run

// Manual `_track` — FORCE certain reads to count; further reads still auto-track
createEffect(() => {
  const _track = [state1(), state2()];
  // …
});
```

Prefer `on()` to limit deps. Prefer `_track` to ensure deps while keeping auto-track.

## Skip first run

```ts
let mounted = false;
onMount(() => { mounted = true; });
createEffect(() => {
  trackSomething();
  if (mounted) fn();
});
```

## Debounced callback

```ts
let t = 0;
onCleanup(() => clearTimeout(t));
return (...args: Parameters<T>) => {
  clearTimeout(t);
  t = window.setTimeout(() => callback(...args), delay);
};
```

## Debounced value

Track source in `createEffect`, write to a second signal after timeout; clear timer on cleanup / before reschedule.

## External store / matchMedia

```ts
createEffect(() => {
  const m = window.matchMedia(query);
  const fn = () => setMatches(m.matches);
  fn();
  m.addEventListener('change', fn);
  onCleanup(() => m.removeEventListener('change', fn));
});
```

## Storage

- Primitive-ish values: signal + serialize.
- Objects: `createStore` + `reconcile` (+ custom event if same-tab sync needed).
- Always guard SSR / missing `window`.

## ResizeObserver-style measure

Signal ref for element + store for rect + optional `requestAnimationFrame` throttle + `reconcile`.

## IntersectionObserver-style

Callback ref; disconnect on every ref change.

## Props & `children`

```ts
// ❌ destructure once — frozen
function Child(props) {
  const { count } = props;
  return <div>{count}</div>;
}

// ✅ read through props
function Child(props) {
  return <div>{props.count}</div>;
}

// Inspect / map / conditionally render — children() then Show
import { children, Show } from 'solid-js';

const resolved = children(() => props.children);
return <Show when={resolved()}>{resolved()}</Show>;

// optional named slot
const trailing = children(() => props.trailing);
return <Show when={trailing()}>{trailing()}</Show>;
```

**Gotcha:** `<Show when={props.children}>` or `typeof props.x === 'function'` is unreliable — children/accessors are often functions. Resolve with `children()` first. Skipping it commonly causes **hydration mismatches**.

Hook args that change over time: accept `Accessor<T> | T` and call through a getter inside effects.
