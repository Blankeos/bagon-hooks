import {
  createStorageStore,
  StorageProperties,
} from '../use-local-storage/use-local-storage-store';

export type { StorageProperties };

/**
 * Works the same way as `useLocalStorageStore`, but uses `sessionStorage` instead.
 */
export function useSessionStorageStore<T extends Object>(props: StorageProperties<T>) {
  return createStorageStore<T>('sessionStorage', 'use-session-storage-store')(props);
}
