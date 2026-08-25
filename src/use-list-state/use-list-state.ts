import { type Accessor, createSignal } from 'solid-js';

export interface UseListStateHandlers<T> {
  setState: (state: T[] | ((prev: T[]) => T[])) => void;
  append: (...items: T[]) => void;
  prepend: (...items: T[]) => void;
  insert: (index: number, ...items: T[]) => void;
  pop: () => void;
  shift: () => void;
  apply: (fn: (item: T, index?: number) => T) => void;
  applyWhere: (
    condition: (item: T, index: number) => boolean,
    fn: (item: T, index?: number) => T,
  ) => void;
  remove: (...indices: number[]) => void;
  reorder: ({ from, to }: { from: number; to: number }) => void;
  swap: ({ from, to }: { from: number; to: number }) => void;
  setItem: (index: number, item: T) => void;
  setItemProp: <K extends keyof T, U extends T[K]>(index: number, prop: K, value: U) => void;
  filter: (fn: (item: T, i: number) => boolean) => void;
}

export type UseListState<T> = [Accessor<T[]>, UseListStateHandlers<T>];

/**
 * Manages an array with a rich set of immutable update helpers.
 *
 * @param initialValue - Initial list contents.
 * @returns A tuple `[list, handlers]` where `list` is a Solid accessor.
 */
export function useListState<T>(initialValue: T[] = []): UseListState<T> {
  const [state, setState] = createSignal(initialValue);

  const append = (...items: T[]) => setState((current) => [...current, ...items]);
  const prepend = (...items: T[]) => setState((current) => [...items, ...current]);

  const insert = (index: number, ...items: T[]) =>
    setState((current) => [...current.slice(0, index), ...items, ...current.slice(index)]);

  const apply = (fn: (item: T, index?: number) => T) =>
    setState((current) => current.map((item, index) => fn(item, index)));

  const remove = (...indices: number[]) =>
    setState((current) => current.filter((_, index) => !indices.includes(index)));

  const pop = () =>
    remove(state().length - 1);

  const shift = () => remove(0);

  const reorder = ({ from, to }: { from: number; to: number }) =>
    setState((current) => {
      const cloned = [...current];
      const item = current[from];

      if (item === undefined) {
        return current;
      }

      cloned.splice(from, 1);
      cloned.splice(to, 0, item);

      return cloned;
    });

  const swap = ({ from, to }: { from: number; to: number }) =>
    setState((current) => {
      const cloned = [...current];
      const fromItem = cloned[from];
      const toItem = cloned[to];

      if (fromItem === undefined || toItem === undefined) {
        return current;
      }

      cloned[to] = fromItem;
      cloned[from] = toItem;

      return cloned;
    });

  const setItem = (index: number, item: T) =>
    setState((current) => {
      const cloned = [...current];
      cloned[index] = item;
      return cloned;
    });

  const setItemProp = <K extends keyof T, U extends T[K]>(index: number, prop: K, value: U) =>
    setState((current) => {
      const cloned = [...current];
      const currentItem = cloned[index];

      if (currentItem === undefined) {
        return current;
      }

      cloned[index] = { ...currentItem, [prop]: value };
      return cloned;
    });

  const applyWhere = (
    condition: (item: T, index: number) => boolean,
    fn: (item: T, index?: number) => T,
  ) =>
    setState((current) =>
      current.map((item, index) => (condition(item, index) ? fn(item, index) : item)),
    );

  const filter = (fn: (item: T, i: number) => boolean) => {
    setState((current) => current.filter(fn));
  };

  return [
    state,
    {
      setState,
      append,
      prepend,
      insert,
      pop,
      shift,
      apply,
      applyWhere,
      remove,
      reorder,
      swap,
      setItem,
      setItemProp,
      filter,
    },
  ];
}
