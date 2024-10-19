import { createEffect, createSignal, onCleanup } from 'solid-js';

const DEFAULT_EVENTS = ['mousedown', 'touchstart'];

/**
 * A hook that listens to click events outside of a specified element or elements.
 */
export function useClickOutside<T extends HTMLElement = any>(
  handler: () => void,
  events?: string[] | null,
  nodes?: (HTMLElement | null)[],
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
    const listener = (event: any) => {
      const { target } = event ?? {};
      if (Array.isArray(nodes)) {
        const shouldIgnore =
          target?.hasAttribute('data-ignore-outside-clicks') ||
          (!document.body.contains(target) && target.tagName !== 'HTML');
        const shouldTrigger = nodes.every(node => !!node && !event.composedPath().includes(node));
        shouldTrigger && !shouldIgnore && handler();
      } else if (ref() && !ref()!.contains(target)) {
        handler();
      }
    };

    (events || DEFAULT_EVENTS).forEach(fn => document.addEventListener(fn, listener));

    onCleanup(() => {
      (events || DEFAULT_EVENTS).forEach(fn => document.removeEventListener(fn, listener));
    });
  });

  return setRef;
}
