import { Accessor, createEffect, createSignal, onCleanup } from 'solid-js';

const DEFAULT_EVENTS = ['mousedown', 'touchstart'];

/**
 * A hook that listens to click events outside of a specified element or elements.
 */
export function useClickOutside<T extends HTMLElement = any>(
  handler: (event: MouseEvent | TouchEvent) => void,
  events?: string[] | null,
  nodes?: (HTMLElement | null)[],
  /** Set to `false` to detach the listeners, `true` by default. Can be an accessor. */
  enabled: boolean | Accessor<boolean> = true,
  /** Listen in the capture phase, `false` by default */
  capture: boolean = false,
) {
  /**
   * When inside hooks, what I found is that it's better to use a signal for a ref
   * instead of a `let` variable. Because it's possible that the element may not
   * exist yet when the hook first runs/component first runs.
   *
   * Reference: https://docs.solidjs.com/concepts/refs#signals-as-refs
   */
  const [ref, setRef] = createSignal<T>();

  createEffect(() => {
    if (!(typeof enabled === 'function' ? enabled() : enabled)) {
      return;
    }

    const listener = (event: any) => {
      const { target } = event ?? {};
      if (Array.isArray(nodes)) {
        const shouldIgnore =
          target?.hasAttribute('data-ignore-outside-clicks') ||
          (!document.body.contains(target) && target.tagName !== 'HTML');
        const shouldTrigger = nodes.every(node => !!node && !event.composedPath().includes(node));
        shouldTrigger && !shouldIgnore && handler(event);
      } else if (ref() && !ref()!.contains(target)) {
        handler(event);
      }
    };

    (events || DEFAULT_EVENTS).forEach(fn => document.addEventListener(fn, listener, capture));

    onCleanup(() => {
      (events || DEFAULT_EVENTS).forEach(fn => document.removeEventListener(fn, listener, capture));
    });
  });

  return setRef;
}
