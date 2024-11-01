import { createSignal, onMount, Setter } from 'solid-js';

export function useDebouncedSignal<T = any>(
  defaultValue: T,
  wait: number,
  options = { leading: false },
) {
  const [value, setValue] = createSignal(defaultValue);
  let timeoutRef: number | null = null;
  let leadingRef = true;

  const clearTimeout = () => window.clearTimeout(timeoutRef!);
  onMount(() => clearTimeout);

  // @ts-ignore
  const debouncedSetValue: Setter<T> = newValue => {
    clearTimeout();
    if (leadingRef && options.leading) {
      // @ts-ignore
      setValue(newValue);
    } else {
      timeoutRef = window.setTimeout(() => {
        leadingRef = true;
        // @ts-ignore
        setValue(newValue);
      }, wait);
    }
    leadingRef = false;
  };

  return [value, debouncedSetValue] as const;
}
