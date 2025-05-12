import { createEffect, createSignal, onCleanup } from 'solid-js';

interface UseIntervalOptions {
  /** If set, the interval will start automatically when the component is mounted, `false` by default */
  autoInvoke?: boolean;
}

export function useInterval(
  fn: () => void,
  interval: number,
  { autoInvoke = false }: UseIntervalOptions = {},
) {
  const [active, setActive] = createSignal(false);
  let intervalRef: number | null = null;

  const start = () => {
    if (!intervalRef) {
      intervalRef = window.setInterval(() => {
        fn();
      }, interval);
      setActive(true);
    }
  };

  const stop = () => {
    setActive(false);
    if (intervalRef) {
      window.clearInterval(intervalRef);
      intervalRef = null;
    }
  };

  const toggle = () => {
    active() ? stop() : start();
  };

  createEffect(() => {
    if (autoInvoke) {
      start();
    }

    onCleanup(() => {
      stop();
    });
  });

  return { start, stop, toggle, active };
}
