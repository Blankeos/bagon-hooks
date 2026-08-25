import { type Accessor, createMemo, createSignal } from 'solid-js';

export interface UseQueueOptions<T> {
  initialValues?: T[];
  limit: number;
}

export interface UseQueueReturnValue<T> {
  state: Accessor<T[]>;
  queue: Accessor<T[]>;
  add: (...items: T[]) => void;
  update: (fn: (state: T[]) => T[]) => void;
  cleanQueue: () => void;
}

/**
 * Maintains a limited active list and a backlog queue for overflow items.
 *
 * @param options.initialValues - Initial items.
 * @param options.limit - Max number of items kept in `state`.
 */
export function useQueue<T>({
  initialValues = [],
  limit,
}: UseQueueOptions<T>): UseQueueReturnValue<T> {
  const [state, setState] = createSignal({
    state: initialValues.slice(0, limit),
    queue: initialValues.slice(limit),
  });

  const add = (...items: T[]) =>
    setState((current) => {
      const results = [...current.state, ...current.queue, ...items];

      return {
        state: results.slice(0, limit),
        queue: results.slice(limit),
      };
    });

  const update = (fn: (state: T[]) => T[]) =>
    setState((current) => {
      const results = fn([...current.state, ...current.queue]);

      return {
        state: results.slice(0, limit),
        queue: results.slice(limit),
      };
    });

  const cleanQueue = () => setState((current) => ({ state: current.state, queue: [] }));

  return {
    state: createMemo(() => state().state),
    queue: createMemo(() => state().queue),
    add,
    update,
    cleanQueue,
  };
}
