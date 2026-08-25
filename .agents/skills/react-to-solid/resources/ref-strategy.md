# Ref strategy

Choosing wrong = listeners never bind or effects never re-run.

## Signal-as-ref

**When:** a `createEffect` must react to the element appearing / changing.

```ts
const [ref, setRef] = createSignal<HTMLElement>();
createEffect(() => {
  const el = ref();
  if (!el) return;
  // bind to el…
  onCleanup(() => { /* unbind */ });
});
return setRef; // <div ref={setRef} />
```

Why not `let`? Assigning `el = node` does not notify Solid; the effect won't re-run.

Docs: https://docs.solidjs.com/concepts/refs#signals-as-refs

## Callback ref

**When:** setup/teardown is naturally "on element assign", and you don't need the node tracked inside other effects.

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

Typical for IntersectionObserver / one-shot attach APIs.

## Bare `let`

**When:** mutable slot that should **not** trigger reactivity.

- timer / rAF ids
- flags (`mounted`, `isSliding`)
- observer instance handles (alongside callback ref)

## Store for measured / nested objects

**When:** frequent updates to a struct (e.g. DOMRect).

Keep the node in a signal ref; keep the data in `createStore` + `reconcile`. A nested key (`{ rect }`) often makes store paths cleaner.

## Merging refs (TODO — harden with real ports)

```ts
const handleRef = (el: T) => {
  setInternal(el);
  const p = props.ref;
  if (typeof p === 'function') p(el);
  // else if signal-setter / object-ref — compose as needed
};
```

Capture concrete patterns here as ports need `props.ref` forwarding.
