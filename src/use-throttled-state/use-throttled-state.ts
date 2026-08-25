import { Accessor, createSignal, Setter } from 'solid-js';
import { useThrottledCallback } from '../use-throttled-callback/use-throttled-callback';

/**
 * Creates a signal whose setter is throttled.
 *
 * @param initialValue Initial signal value
 * @param wait Throttle wait time in ms
 */
export function useThrottledState<T>(
  initialValue: T,
  wait: number,
): [Accessor<T>, Setter<T>] {
  const [value, setValue] = createSignal(initialValue);

  const throttledSetValue = useThrottledCallback(((next: any) => {
    setValue(next);
  }) as Setter<T>, wait);

  return [value, throttledSetValue as Setter<T>];
}
