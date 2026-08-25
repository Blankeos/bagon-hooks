import { type Accessor, createSignal } from 'solid-js';

export type UseMapReturn<K, V> = Accessor<Map<K, V>> & {
  set: (key: K, value: V) => Map<K, V>;
  get: (key: K) => V | undefined;
  delete: (key: K) => boolean;
  clear: () => void;
  has: (key: K) => boolean;
};

/**
 * Reactive `Map` wrapper. Call the returned accessor to read/track the map;
 * mutating methods (`set`, `delete`, `clear`) update the underlying signal.
 *
 * @param initialState - Optional initial entries.
 */
export function useMap<K, V>(initialState?: Iterable<[K, V]>): UseMapReturn<K, V> {
  const [map, setMap] = createSignal(new Map<K, V>(initialState), { equals: false });

  const set = (key: K, value: V) => {
    const next = new Map(map());
    next.set(key, value);
    setMap(next);
    return next;
  };

  const get = (key: K) => map().get(key);

  const _delete = (key: K) => {
    const next = new Map(map());
    const result = next.delete(key);
    setMap(next);
    return result;
  };

  const clear = () => {
    setMap(new Map<K, V>());
  };

  const has = (key: K) => map().has(key);

  return Object.assign(map, {
    set,
    get,
    delete: _delete,
    clear,
    has,
  });
}
