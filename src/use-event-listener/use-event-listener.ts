import { onCleanup } from 'solid-js';

/**
 * Returns a Solid ref callback that attaches an event listener to the bound element.
 * Compatible with `ref={...}`.
 *
 * @example
 * ```tsx
 * const ref = useEventListener('click', () => console.log('clicked'));
 * <button ref={ref}>Click</button>
 * ```
 */
export function useEventListener<
  K extends keyof HTMLElementEventMap,
  T extends HTMLElement = any,
>(
  type: K,
  listener: (this: T, ev: HTMLElementEventMap[K]) => any,
  options?: boolean | AddEventListenerOptions,
): (el: T | null) => void;
export function useEventListener<
  K extends keyof SVGElementEventMap,
  T extends SVGElement = any,
>(
  type: K,
  listener: (this: T, ev: SVGElementEventMap[K]) => any,
  options?: boolean | AddEventListenerOptions,
): (el: T | null) => void;
export function useEventListener(
  type: string,
  listener: EventListenerOrEventListenerObject,
  options?: boolean | AddEventListenerOptions,
): (el: Element | null) => void {
  let previousNode: Element | null = null;
  let previousListener: EventListenerOrEventListenerObject | null = null;

  const cleanup = () => {
    if (previousNode && previousListener) {
      previousNode.removeEventListener(type, previousListener, options);
    }
    previousNode = null;
    previousListener = null;
  };

  onCleanup(cleanup);

  return (node: Element | null) => {
    if (!node) {
      cleanup();
      return;
    }

    cleanup();
    node.addEventListener(type, listener, options);
    previousNode = node;
    previousListener = listener;
  };
}
