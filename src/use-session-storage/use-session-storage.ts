import {
  createStorage,
  readValue,
  StorageProperties,
} from '../use-local-storage/use-local-storage';

export type { StorageProperties };

/**
 * Works the same way as `useLocalStorage`, but uses `sessionStorage` instead.
 */
export function useSessionStorage<T>(props: StorageProperties<T>) {
  return createStorage<T>('sessionStorage', 'use-session-storage')(props);
}

interface ReadStorageValue {
  <T>(options: StorageProperties<T> & { defaultValue: T }): T;
  <T>(options: StorageProperties<T>): T | undefined;
}

export const readSessionStorageValue: ReadStorageValue = readValue('sessionStorage');
