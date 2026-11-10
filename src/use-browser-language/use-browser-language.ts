import { createEffect, createSignal, onCleanup, type Accessor } from 'solid-js';

function useNavigatorValue<T>(read: () => T, initial: T): Accessor<T> {
  const [value, setValue] = createSignal<T>(initial);

  createEffect(() => {
    const update = () => setValue(() => read());

    update();
    window.addEventListener('languagechange', update);
    onCleanup(() => window.removeEventListener('languagechange', update));
  });

  return value;
}

/**
 * Returns `navigator.language` and updates when the user changes it.
 */
export function useBrowserLanguage(): Accessor<string | undefined> {
  return useNavigatorValue<string | undefined>(() => window.navigator.language, undefined);
}

/**
 * Returns `navigator.languages` and updates when the user changes it.
 */
export function usePreferredLanguages(): Accessor<readonly string[]> {
  return useNavigatorValue<readonly string[]>(() => window.navigator.languages, []);
}
