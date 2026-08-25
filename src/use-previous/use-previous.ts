import { Accessor, createEffect, createSignal, on } from 'solid-js';

/**
 * Returns the previous value of an accessor.
 */
export function usePrevious<T>(value: Accessor<T>): Accessor<T | undefined> {
  let previous: T | undefined = undefined;
  const [prev, setPrev] = createSignal<T | undefined>(undefined);

  createEffect(
    on(value, current => {
      setPrev(() => previous);
      previous = current;
    }),
  );

  return prev;
}
