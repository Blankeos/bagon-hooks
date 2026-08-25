import { type Accessor, createSignal } from 'solid-js';

export function readonlySetLikeToSet<T>(input: ReadonlySetLike<T>): Set<T> {
  if (input instanceof Set) {
    return input;
  }

  const result = new Set<T>();
  const iterator = input.keys();
  let next = iterator.next();

  while (!next.done) {
    result.add(next.value);
    next = iterator.next();
  }

  return result;
}

export type UseSetReturn<T> = Accessor<Set<T>> & {
  add: (value: T) => Set<T>;
  delete: (value: T) => boolean;
  clear: () => void;
  has: (value: T) => boolean;
  union: <U>(other: ReadonlySetLike<U>) => Set<T | U>;
  intersection: <U>(other: ReadonlySetLike<U>) => Set<T & U>;
  difference: <U>(other: ReadonlySetLike<U>) => Set<T>;
  symmetricDifference: <U>(other: ReadonlySetLike<U>) => Set<T | U>;
};

/**
 * Reactive `Set` wrapper. Call the returned accessor to read/track the set;
 * mutating methods (`add`, `delete`, `clear`) update the underlying signal.
 *
 * @param values - Optional initial values.
 */
export function useSet<T>(values?: Iterable<T>): UseSetReturn<T> {
  const [set, setSet] = createSignal(new Set<T>(values), { equals: false });

  const add = (value: T) => {
    const next = new Set(set());
    next.add(value);
    setSet(next);
    return next;
  };

  const _delete = (value: T) => {
    const next = new Set(set());
    const result = next.delete(value);
    setSet(next);
    return result;
  };

  const clear = () => {
    setSet(new Set<T>());
  };

  const has = (value: T) => set().has(value);

  const union = <U>(other: ReadonlySetLike<U>): Set<T | U> => {
    const result = new Set<T | U>(set() as Set<T>);
    readonlySetLikeToSet(other).forEach((item) => result.add(item));
    return result;
  };

  const intersection = <U>(other: ReadonlySetLike<U>): Set<T & U> => {
    const result = new Set<T & U>();
    const otherSet = readonlySetLikeToSet(other);

    set().forEach((item) => {
      if (otherSet.has(item as never)) {
        result.add(item as T & U);
      }
    });

    return result;
  };

  const difference = <U>(other: ReadonlySetLike<U>): Set<T> => {
    const result = new Set<T>();
    const otherSet = readonlySetLikeToSet(other);

    set().forEach((item) => {
      if (!otherSet.has(item as never)) {
        result.add(item);
      }
    });

    return result;
  };

  const symmetricDifference = <U>(other: ReadonlySetLike<U>): Set<T | U> => {
    const result = new Set<T | U>();
    const otherSet = readonlySetLikeToSet(other);

    set().forEach((item) => {
      if (!otherSet.has(item as never)) {
        result.add(item);
      }
    });

    otherSet.forEach((item) => {
      if (!set().has(item as never)) {
        result.add(item);
      }
    });

    return result;
  };

  return Object.assign(set, {
    add,
    delete: _delete,
    clear,
    has,
    union,
    intersection,
    difference,
    symmetricDifference,
  });
}
