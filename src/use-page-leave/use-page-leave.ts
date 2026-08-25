import { onCleanup, onMount } from 'solid-js';

/**
 * Calls `onPageLeave` when the mouse leaves the document.
 */
export function usePageLeave(onPageLeave: () => void) {
  onMount(() => {
    const handler = () => onPageLeave();
    document.documentElement.addEventListener('mouseleave', handler);
    onCleanup(() => document.documentElement.removeEventListener('mouseleave', handler));
  });
}
