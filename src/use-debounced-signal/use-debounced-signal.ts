import { createSignal, onCleanup, Setter } from 'solid-js';

export function useDebouncedSignal<T = any>(
  defaultValue: T,
  wait: number,
  options = { leading: false },
) {
  const [value, setValue] = createSignal(defaultValue);
  let timeoutRef: any = null;
  let leadingRef = true;

  // `onCleanup` also runs on the server, so avoid touching `window` here
  const clearTimer = () => clearTimeout(timeoutRef!);
  onCleanup(clearTimer);

  // @ts-ignore
  const debouncedSetValue: Setter<T> = newValue => {
    clearTimer();
    if (leadingRef && options.leading) {
      // @ts-ignore
      setValue(newValue);
      timeoutRef = setTimeout(() => {
        leadingRef = true;
      }, wait);
    } else {
      timeoutRef = setTimeout(() => {
        leadingRef = true;
        // @ts-ignore
        setValue(newValue);
      }, wait);
    }
    leadingRef = false;
  };

  return [value, debouncedSetValue] as const;
}
