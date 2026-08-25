import { Accessor, createEffect, createSignal, on } from 'solid-js';
import { useThrottledCallback } from '../use-throttled-callback/use-throttled-callback';

/**
 * Returns a throttled version of a reactive value.
 *
 * @param value Accessor to throttle
 * @param wait Throttle wait time in ms
 */
export function useThrottledValue<T = any>(value: Accessor<T>, wait: number): Accessor<T> {
  const [throttled, setThrottled] = createSignal(value());

  const throttledSetValue = useThrottledCallback((next: T) => {
    setThrottled(_ => next);
  }, wait);

  createEffect(
    on(value, () => {
      throttledSetValue(value());
    }),
  );

  return throttled;
}
