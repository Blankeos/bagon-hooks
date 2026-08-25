import { Accessor, createSignal, onCleanup, onMount } from 'solid-js';

export interface UseWindowScrollPosition {
  x: number;
  y: number;
}

export type UseWindowScrollTo = (position: Partial<UseWindowScrollPosition>) => void;
export type UseWindowScrollReturnValue = [Accessor<UseWindowScrollPosition>, UseWindowScrollTo];

function getScrollPosition(): UseWindowScrollPosition {
  return typeof window !== 'undefined'
    ? { x: window.scrollX, y: window.scrollY }
    : { x: 0, y: 0 };
}

function scrollTo({ x, y }: Partial<UseWindowScrollPosition>) {
  if (typeof window === 'undefined') return;

  const scrollOptions: ScrollToOptions = { behavior: 'smooth' };

  if (typeof x === 'number') {
    scrollOptions.left = x;
  }

  if (typeof y === 'number') {
    scrollOptions.top = y;
  }

  window.scrollTo(scrollOptions);
}

/**
 * Returns reactive window scroll position and a `scrollTo` helper.
 * Listens to `scroll` and `resize` on `window`.
 */
export function useWindowScroll(): UseWindowScrollReturnValue {
  const [position, setPosition] = createSignal<UseWindowScrollPosition>(getScrollPosition());

  const update = () => setPosition(getScrollPosition());

  onMount(() => {
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });

    onCleanup(() => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    });
  });

  return [position, scrollTo];
}

export namespace useWindowScroll {
  export type Position = UseWindowScrollPosition;
  export type ScrollTo = UseWindowScrollTo;
  export type ReturnValue = UseWindowScrollReturnValue;
}
