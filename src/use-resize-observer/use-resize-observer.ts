import { createEffect, createMemo, createSignal, onCleanup } from 'solid-js';
import { createStore, reconcile } from 'solid-js/store';

type ObserverRect = Omit<DOMRectReadOnly, 'toJSON'>;

const defaultState: ObserverRect = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
};

/**
 * A hook that returns a resize observer.
 *
 * @example
 * ```ts
 * const [ref, rectStore] = useResizeObserver();
 *
 * return (<div ref={ref}>{rectStore.width}</div>);
 */
export function useResizeObserver<T extends HTMLElement = any>(options?: ResizeObserverOptions) {
  let frameID = 0;
  const [ref, setRef] = createSignal<T | null>(null);

  /**
   * SolidJS stores always need a deeper object for the 'setter' and 'reconcile' to work,
   * hence why I wrapped it in { rect: ObserverRect }. When originally, it sohuld just be `ObserverRect`.
   */
  const [rectStore, setRectStore] = createStore<{ rect: ObserverRect }>({ rect: defaultState });

  const observer = createMemo(() => {
    if (typeof window === 'undefined') {
      return null;
    }

    return new ResizeObserver((entries: any) => {
      const entry = entries[0];

      if (entry) {
        cancelAnimationFrame(frameID);

        frameID = requestAnimationFrame(() => {
          if (ref()) {
            setRectStore('rect', reconcile(entry.contentRect));
          }
        });
      }
    });
  });

  createEffect(() => {
    if (ref()) {
      observer()?.observe(ref()!, options);
    }

    onCleanup(() => {
      observer()?.disconnect();

      if (frameID) {
        cancelAnimationFrame(frameID);
      }
    });
  });

  return [setRef, rectStore] as const;
}

/**
 * A hook that returns the current size of an element.
 *
 * Plus points on SolidJS for this: `width()` and `height()` only emit a change when it actually changed its value.
 * This is thanks to useResizeObserver using a `store` with `reconcile` under the hood.
 *
 * @example
 * ```ts
 * const { ref, width, height } = useElementSize();
 *
 * return (<div ref={ref}>{width()} | {height()}</div>);
 */
export function useElementSize<T extends HTMLElement = any>(options?: ResizeObserverOptions) {
  const [ref, rectStore] = useResizeObserver<T>(options);

  return {
    ref,
    width: createMemo(() => rectStore?.rect?.width),
    height: createMemo(() => rectStore?.rect?.height),
  };
}
