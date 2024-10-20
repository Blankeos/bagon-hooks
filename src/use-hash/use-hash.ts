import { createSignal, onCleanup, onMount } from 'solid-js';

interface UseHashOptions {
  getInitialValueInEffect?: boolean;
}

/**
 * A hook that allows you to get and set the hash value of the current URL like a signal.
 */
export function useHash({ getInitialValueInEffect = true }: UseHashOptions = {}) {
  const [hash, setHash] = createSignal<string>(
    getInitialValueInEffect ? '' : window.location.hash || '',
  );

  const setHashHandler = (value: string) => {
    const valueWithHash = value.startsWith('#') ? value : `#${value}`;
    window.location.hash = valueWithHash;
    setHash(valueWithHash);
  };

  // (Replaced useWindowEvent with this)
  onMount(() => {
    const hashchangeListener = () => {
      const newHash = window.location.hash;
      if (hash() !== newHash) {
        setHash(newHash);
      }
    };
    window.addEventListener('hashchange', hashchangeListener);

    onCleanup(() => {
      window.removeEventListener('hashchange', hashchangeListener);
    });
  });

  onMount(() => {
    if (getInitialValueInEffect) {
      setHash(window.location.hash);
    }
  });

  return [hash, setHashHandler] as const;
}
