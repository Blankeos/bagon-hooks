import { Accessor, createSignal, onCleanup, onMount } from 'solid-js';

export type ScrollDirection = 'up' | 'down' | 'unknown';

/**
 * Returns the current window scroll direction (`up` | `down` | `unknown`).
 */
export function useScrollDirection(): Accessor<ScrollDirection> {
  const [scrollDirection, setScrollDirection] = createSignal<ScrollDirection>('unknown');
  let lastScrollTop = 0;
  let isResizing = false;
  let resizeTimer: number | undefined;

  onMount(() => {
    const handleScroll = () => {
      if (isResizing) {
        return;
      }

      const currentScrollTop = window.scrollY || document.documentElement.scrollTop;
      setScrollDirection(currentScrollTop < lastScrollTop ? 'up' : 'down');
      lastScrollTop = currentScrollTop;
    };

    const handleResize = () => {
      isResizing = true;
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        isResizing = false;
      }, 300);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);

    onCleanup(() => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      window.clearTimeout(resizeTimer);
    });
  });

  return scrollDirection;
}
