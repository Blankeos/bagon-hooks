import { createEffect, onCleanup } from 'solid-js';

export function useTimeout(
  callback: (...callbackParams: any[]) => void,
  delay: number,
  options: { autoInvoke: boolean } = { autoInvoke: false },
) {
  let timeoutRef: number | null = null;

  const start = (...callbackParams: any[]) => {
    if (!timeoutRef) {
      timeoutRef = window.setTimeout(() => {
        callback(callbackParams);
        timeoutRef = null;
      }, delay);
    }
  };

  const clear = () => {
    if (timeoutRef) {
      window.clearTimeout(timeoutRef);
      timeoutRef = null;
    }
  };

  createEffect(() => {
    if (options.autoInvoke) {
      start();
    }

    onCleanup(() => {
      clear();
    });
  });

  return { start, clear };
}
