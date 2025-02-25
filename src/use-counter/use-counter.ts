import { clamp } from '../utils/clamp';

// ./use-counter.ts
import { createSignal } from 'solid-js';

const DEFAULT_OPTIONS = {
  min: -Infinity,
  max: Infinity,
};

/**
 * A hook that returns a signal with a counter value and functions to increment, decrement, set and reset the counter.
 */
export function useCounter(
  initialValue = 0,
  options: Partial<{ min: number; max: number }> = DEFAULT_OPTIONS,
) {
  const [count, setCount] = createSignal<number>(clamp(initialValue, options?.min, options?.max));

  const increment = () => setCount(current => clamp(current + 1, options?.min, options?.max));
  const decrement = () => setCount(current => clamp(current - 1, options?.min, options?.max));
  const set = (value: number) => setCount(clamp(value, options?.min, options?.max));
  const reset = () => setCount(clamp(initialValue, options?.min, options?.max));

  return [count, { increment, decrement, set, reset }] as const;
}
