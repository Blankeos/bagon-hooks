import { createSignal, onMount } from 'solid-js';

/**
 * A hook that returns true if the component is mounted; false otherwise.
 */
export function useMounted() {
  const [mounted, setMounted] = createSignal(false);
  onMount(() => setMounted(true));
  return mounted;
}
