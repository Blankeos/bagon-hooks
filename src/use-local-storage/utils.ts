export type StorageType = 'localStorage' | 'sessionStorage';

export interface StorageProperties<T> {
  /** Storage key */
  key: string;

  /** Default value that will be set if value is not found in storage */
  defaultValue?: T;

  /** If set to true, value will be updated in createEffect after mount. Default value is true. */
  getInitialValueInEffect?: boolean;

  /** Function to serialize value into string to be save in storage */
  serialize?: (value: T) => string;

  /** Function to deserialize string value from storage to value */
  deserialize?: (value: string | undefined) => T;
}

export function _serializeJSON<T>(value: T, hookName: string = 'use-local-storage') {
  try {
    return JSON.stringify(value);
  } catch (error) {
    throw new Error(`bagon-hooks ${hookName}: Failed to serialize the value`);
  }
}

export function _deserializeJSON(value: string | undefined) {
  try {
    return value && JSON.parse(value);
  } catch {
    return value;
  }
}

export function _createStorageHandler(type: StorageType) {
  const getItem = (key: string) => {
    try {
      return window[type].getItem(key);
    } catch (error) {
      console.warn('use-local-storage: Failed to get value from storage, localStorage is blocked');
      return null;
    }
  };

  const setItem = (key: string, value: string) => {
    try {
      window[type].setItem(key, value);
    } catch (error) {
      console.warn('use-local-storage: Failed to set value to storage, localStorage is blocked');
    }
  };

  const removeItem = (key: string) => {
    try {
      window[type].removeItem(key);
    } catch (error) {
      console.warn(
        'use-local-storage: Failed to remove value from storage, localStorage is blocked',
      );
    }
  };

  return { getItem, setItem, removeItem };
}

export function readValue(type: StorageType) {
  const { getItem } = _createStorageHandler(type);

  return function read<T>({
    key,
    defaultValue,
    deserialize = _deserializeJSON,
  }: StorageProperties<T>) {
    let storageBlockedOrSkipped;

    try {
      storageBlockedOrSkipped =
        typeof window === 'undefined' || !(type in window) || window[type] === null;
    } catch (_e) {
      storageBlockedOrSkipped = true;
    }

    if (storageBlockedOrSkipped) {
      return defaultValue as T;
    }

    const storageValue = getItem(key);
    return storageValue !== null ? deserialize(storageValue) : (defaultValue as T);
  };
}

export const readLocalStorageValue = readValue('localStorage');
