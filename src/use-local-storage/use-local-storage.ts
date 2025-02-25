// ./create-storage.ts

import { Accessor, createEffect, createSignal, onCleanup, onMount } from 'solid-js';
import {
  _createStorageHandler,
  _deserializeJSON,
  _serializeJSON,
  readLocalStorageValue,
  readValue,
  StorageProperties,
  StorageType,
} from './utils';

export { readLocalStorageValue, readValue };
export type { StorageProperties, StorageType };

export function createStorage<T>(type: StorageType, hookName: string) {
  const eventName = type === 'localStorage' ? 'bagon-local-storage' : 'bagon-session-storage';
  const { getItem, setItem, removeItem } = _createStorageHandler(type);

  return function useStorage({
    key,
    defaultValue,
    getInitialValueInEffect = true,
    deserialize = _deserializeJSON,
    serialize = (value: T) => _serializeJSON(value, hookName),
  }: StorageProperties<T>) {
    const readStorageValue = (skipStorage?: boolean): T => {
      let storageBlockedOrSkipped;

      try {
        storageBlockedOrSkipped =
          typeof window === 'undefined' ||
          !(type in window) ||
          window[type] === null ||
          !!skipStorage;
      } catch (_e) {
        storageBlockedOrSkipped = true;
      }

      if (storageBlockedOrSkipped) {
        return defaultValue as T;
      }

      const storageValue = getItem(key);
      return storageValue !== null ? deserialize(storageValue) : (defaultValue as T);
    };

    const [value, setValue] = createSignal<T>(readStorageValue(getInitialValueInEffect));

    const setStorageValue = (val: T | ((prevState: T) => T)) => {
      if (val instanceof Function) {
        setValue(current => {
          const result = val(current);
          setItem(key, serialize(result));
          window.dispatchEvent(
            new CustomEvent(eventName, { detail: { key, value: val(current) } }),
          );
          return result;
        });
      } else {
        setItem(key, serialize(val));
        window.dispatchEvent(new CustomEvent(eventName, { detail: { key, value: val } }));
        setValue(val as any);
      }
    };

    const removeStorageValue = () => {
      removeItem(key);
      window.dispatchEvent(new CustomEvent(eventName, { detail: { key, value: defaultValue } }));
    };

    // (Replaced useWindowEvent with this)
    onMount(() => {
      // 1. Storage Event
      const storageListener = (event: StorageEvent) => {
        if (event.storageArea === window[type] && event.key === key) {
          setValue(deserialize(event.newValue ?? undefined) as any);
        }
      };
      window.addEventListener('storage', storageListener);

      // 2. Custom Event (So the stored value is reactive)
      const customEventListener = (event: any) => {
        if (event.detail.key === key) {
          setValue(event.detail.value);
        }
      };
      window.addEventListener(eventName as any, storageListener);

      onCleanup(() => {
        window.removeEventListener('storage', storageListener);
        window.removeEventListener(eventName, customEventListener);
      });
    });

    createEffect(() => {
      if (defaultValue !== undefined && value() === undefined) {
        setStorageValue(defaultValue);
      }
    });

    onMount(() => {
      const val = readStorageValue();
      val !== undefined && setStorageValue(val);
    });

    return [
      value() === undefined ? () => defaultValue : value,
      setStorageValue,
      removeStorageValue,
    ] as [Accessor<T>, (val: T | ((prevState: T) => T)) => void, () => void];
  };
}

// ./use-local-storage.ts

/**
 * A hook that allows using value from the localStorage as a signal.
 * The hook works the same way as createSignal, but also writes the value to the localStorage.
 *
 * It's also reactive across different pages.
 */
export function useLocalStorage<T>(props: StorageProperties<T>) {
  return createStorage<T>('localStorage', 'use-local-storage')(props);
}
