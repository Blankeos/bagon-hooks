import { Accessor, createEffect, createSignal, on, onCleanup, onMount } from 'solid-js';

export interface UseDebouncedValueOptions {
  leading?: boolean;
}

export interface UseDebouncedValueHandlers {
  cancel: () => void;
  flush: () => void;
}

export type UseDebouncedValueReturnValue<T> = [
  Accessor<T>,
  () => void,
  UseDebouncedValueHandlers,
];

export function useDebouncedValue<T = any>(
  source: Accessor<T>,
  wait: number,
  options: UseDebouncedValueOptions = { leading: false },
): UseDebouncedValueReturnValue<T> {
  const [value, setValue] = createSignal(source());
  let mounted = false;
  let timeout: number | null = null;
  let cooldown = false;
  let latestValue = source();

  const clearTimer = () => {
    if (timeout != null) {
      window.clearTimeout(timeout);
      timeout = null;
    }
  };

  const cancel = () => {
    clearTimer();
    cooldown = false;
  };

  const flush = () => {
    if (timeout) {
      cancel();
      cooldown = false;
      setValue(() => latestValue as any);
    }
  };

  createEffect(
    on(
      () => [source(), options.leading, wait] as const,
      ([current]) => {
        latestValue = current;

        if (mounted) {
          clearTimer();

          if (!cooldown && options.leading) {
            cooldown = true;
            setValue(() => current as any);
            timeout = window.setTimeout(() => {
              cooldown = false;
            }, wait);
          } else {
            timeout = window.setTimeout(() => {
              cooldown = false;
              setValue(() => current as any);
            }, wait);
          }
        }
      },
    ),
  );

  onMount(() => {
    mounted = true;
  });

  onCleanup(cancel);

  return [value, cancel, { cancel, flush }];
}

export namespace useDebouncedValue {
  export type Handlers = UseDebouncedValueHandlers;
  export type Options = UseDebouncedValueOptions;
  export type ReturnValue<T> = UseDebouncedValueReturnValue<T>;
}
