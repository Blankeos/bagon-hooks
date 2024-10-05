import { createEffect, createSignal, onCleanup } from 'solid-js';

/**
 * A hook that returns true if the mouse is currently hovering over an element;
 * false otherwise.
 */
export function useHover<T extends HTMLElement = HTMLDivElement>() {
  const [hovered, setHovered] = createSignal(false);
  const [ref, setRef] = createSignal<T>();

  function onMouseEnter() {
    setHovered(true);
  }

  function onMouseLeave() {
    setHovered(false);
  }

  createEffect(() => {
    if (ref()) {
      ref()!.addEventListener('mouseenter', onMouseEnter);
      ref()!.addEventListener('mouseleave', onMouseLeave);

      onCleanup(() => {
        ref()?.removeEventListener('mouseenter', onMouseEnter);
        ref()?.removeEventListener('mouseleave', onMouseLeave);
      });
    }
  });

  return { ref: setRef, hovered };
}
