import { Accessor, createEffect, createSignal, onCleanup } from 'solid-js';

export type UseMutationObserverOptions = MutationObserverInit;

/**
 * Observe DOM mutations on an element bound via a Solid ref callback.
 *
 * @example
 * ```tsx
 * const { ref } = useMutationObserver(() => console.log('mutated'), { childList: true });
 * <div ref={ref} />
 * ```
 */
export function useMutationObserver<T extends HTMLElement = any>(
  callback: MutationCallback,
  options?: UseMutationObserverOptions,
) {
  const [target, setTarget] = createSignal<T | null>(null);

  const ref = (node: T | null) => {
    setTarget(() => node);
  };

  createEffect(() => {
    const el = target();
    if (!el) {
      return;
    }

    const observer = new MutationObserver(callback);
    observer.observe(el, options);
    onCleanup(() => observer.disconnect());
  });

  return { ref, target };
}

/**
 * Observe DOM mutations on an externally provided target (element or accessor).
 */
export function useMutationObserverTarget(
  callback: MutationCallback,
  options: UseMutationObserverOptions | undefined,
  target?: HTMLElement | Accessor<HTMLElement | null | undefined> | null,
): void {
  createEffect(() => {
    const targetElement = typeof target === 'function' ? target() : target;
    if (!targetElement) {
      return;
    }

    const observer = new MutationObserver(callback);
    observer.observe(targetElement, options);
    onCleanup(() => observer.disconnect());
  });
}

export namespace useMutationObserver {
  export type Options = UseMutationObserverOptions;
  export type ReturnValue<T extends HTMLElement = any> = ReturnType<typeof useMutationObserver<T>>;
}
