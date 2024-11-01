import { onMount } from 'solid-js';

export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
) {
  let debounceTimerRef: number = 0;

  onMount(() => () => window.clearTimeout(debounceTimerRef));

  return (...args: Parameters<T>) => {
    window.clearTimeout(debounceTimerRef);
    debounceTimerRef = window.setTimeout(() => callback(...args), delay);
  };
}
