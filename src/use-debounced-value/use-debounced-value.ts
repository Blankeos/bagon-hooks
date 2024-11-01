import { Accessor, createEffect, createSignal, on } from 'solid-js';

export function useDebouncedValue<T = any>(
  value: Accessor<T>,
  wait: number,
  options = { leading: false },
) {
  const [_value, setValue] = createSignal<T>(value());
  let timeoutRef: number | null = null;
  let cooldownRef = false;

  const cancel = () => window.clearTimeout(timeoutRef!);

  createEffect(
    on(value, () => {
      if (!cooldownRef && options.leading) {
        cooldownRef = true;
        setValue(_ => value());
      } else {
        cancel();
        timeoutRef = window.setTimeout(() => {
          cooldownRef = false;
          setValue(_ => value());
        }, wait);
      }
    }),
  );

  return [_value, cancel] as const;
}
