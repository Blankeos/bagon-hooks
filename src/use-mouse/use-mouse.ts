import { createEffect, createSignal, JSX, onCleanup } from 'solid-js';

/**
 * Returns the current mouse position and an optional ref to the element that is being tracked.
 */
export function useMouse<T extends HTMLElement = any>(
  options: { resetOnExit?: boolean } = { resetOnExit: false },
) {
  const [position, setPosition] = createSignal({ x: 0, y: 0 });

  const [ref, setRef] = createSignal<T>();

  const setMousePosition: JSX.EventHandler<HTMLElement, MouseEvent> = event => {
    if (ref()!) {
      const rect = event.currentTarget.getBoundingClientRect();

      const x = Math.max(
        0,
        Math.round(event.pageX - rect.left - (window.pageXOffset || window.scrollX)),
      );

      const y = Math.max(
        0,
        Math.round(event.pageY - rect.top - (window.pageYOffset || window.scrollY)),
      );

      setPosition({ x, y });
    } else {
      setPosition({ x: event.clientX, y: event.clientY });
    }
  };

  const resetMousePosition = () => setPosition({ x: 0, y: 0 });

  createEffect(() => {
    const element = ref() ? ref() : document;

    element?.addEventListener('mousemove', setMousePosition as any);
    if (options.resetOnExit) {
      element?.addEventListener('mouseleave', resetMousePosition as any);
    }

    onCleanup(() => {
      element?.removeEventListener('mousemove', setMousePosition as any);
      if (options.resetOnExit) {
        element?.removeEventListener('mouseleave', resetMousePosition as any);
      }
    });
  });

  return { ref: setRef, position };
}
