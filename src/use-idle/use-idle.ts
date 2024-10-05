import { Accessor, createEffect, createSignal, mergeProps, onCleanup } from 'solid-js';

const DEFAULT_EVENTS: (keyof DocumentEventMap)[] = [
  'keypress',
  'mousemove',
  'touchmove',
  'click',
  'scroll',
];
const DEFAULT_OPTIONS = {
  events: DEFAULT_EVENTS,
  initialState: true,
};

/**
 * A hook that returns true if the user has been idle for the specified amount of time;
 * false otherwise.
 *
 * @param timeout - The amount of time to wait before setting the idle state to true.
 * @param options - An options object to configure the hook.
 */
export function useIdle(
  timeout: Accessor<number>,
  options?: Partial<{ events: (keyof DocumentEventMap)[]; initialState: boolean }>,
) {
  const _options = mergeProps(DEFAULT_OPTIONS, options);

  const [idle, setIdle] = createSignal<boolean>(_options.initialState);
  let timer!: number;

  createEffect(() => {
    const handleEvents = () => {
      setIdle(false);

      if (timer) {
        window.clearTimeout(timer);
      }

      timer = window.setTimeout(() => {
        setIdle(true);
      }, timeout());
    };

    _options.events.forEach(event => document.addEventListener(event, handleEvents));

    // Start the timer immediately instead of waiting for the first event to happen
    timer = window.setTimeout(() => {
      setIdle(true);
    }, timeout());

    onCleanup(() => {
      _options.events.forEach(event => document.removeEventListener(event, handleEvents));
    });
  });

  return idle;
}
