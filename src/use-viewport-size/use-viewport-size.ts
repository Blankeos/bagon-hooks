import { Accessor, createSignal, onCleanup, onMount } from 'solid-js';

export interface UseViewportSizeReturnValue {
  width: Accessor<number>;
  height: Accessor<number>;
}

/**
 * Returns reactive viewport width and height.
 * Listens to `resize` and `orientationchange` on `window`.
 */
export function useViewportSize(): UseViewportSizeReturnValue {
  const [width, setWidth] = createSignal(
    typeof window !== 'undefined' ? window.innerWidth : 0,
  );
  const [height, setHeight] = createSignal(
    typeof window !== 'undefined' ? window.innerHeight : 0,
  );

  const update = () => {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
  };

  onMount(() => {
    update();
    window.addEventListener('resize', update);
    window.addEventListener('orientationchange', update);

    onCleanup(() => {
      window.removeEventListener('resize', update);
      window.removeEventListener('orientationchange', update);
    });
  });

  return { width, height };
}
