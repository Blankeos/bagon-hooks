// ./create-storage.ts

import { createEffect, onCleanup, onMount } from 'solid-js';
import { createStore, reconcile, SetStoreFunction, unwrap } from 'solid-js/store';
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

export function createStorageStore<T extends Object>(type: StorageType, hookName: string) {
  const eventName =
    type === 'localStorage' ? 'bagon-local-storage-store' : 'bagon-session-storage-store';
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

    const [value, setValue] = createStore<T>(readStorageValue(getInitialValueInEffect));

    const setStorageValue: SetStoreFunction<T> = (...args: any[]) => {
      setValue(...(args as [any]));

      const val = unwrap(value);
      setItem(key, serialize(val));
      window.dispatchEvent(new CustomEvent(eventName, { detail: { key, value: val } }));
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
          setValue(reconcile(deserialize(event.newValue ?? undefined) as any));
        }
      };
      window.addEventListener('storage', storageListener);

      // 2. Custom Event (So the stored value is reactive)
      const customEventListener = (event: any) => {
        if (event.detail.key === key) {
          setValue(reconcile(event.detail.value));
        }
      };
      window.addEventListener(eventName as any, storageListener);

      onCleanup(() => {
        window.removeEventListener('storage', storageListener);
        window.removeEventListener(eventName, customEventListener);
      });
    });

    createEffect(() => {
      if (defaultValue !== undefined && value === undefined) {
        setStorageValue(reconcile(defaultValue));
      }
    });

    onMount(() => {
      const val = readStorageValue();
      val !== undefined && setStorageValue(val);
    });

    return [value === undefined ? defaultValue : value, setStorageValue, removeStorageValue] as [
      T,
      typeof setStorageValue,
      typeof removeStorageValue,
    ];
  };
}

// ./use-local-storage.ts

/**
 * An improved hook similar to `useLocalStorage` that allows using value from the localStorage as a signal.
 * The hook works the same way as createStore, but also writes the value to the localStorage.
 *
 * It's also reactive across different pages.
 */
export function useLocalStorageStore<T extends Object>(props: StorageProperties<T>) {
  return createStorageStore<T>('localStorage', 'use-local-storage')(props);
}
