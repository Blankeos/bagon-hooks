import { Accessor, createEffect, on, onMount } from 'solid-js';

export function useDidUpdate<Next>(
  fn: (previous: Next) => Next,
  dependencies: Accessor<any> | Array<Accessor<any>>,
) {
  let mounted = false;

  createEffect(
    on(
      // @ts-ignore
      dependencies,
      previous => {
        if (mounted) {
          fn(previous);
        }
        mounted = true;
      },
      { defer: true },
    ),
  );

  onMount(() => {
    mounted = true;
  });
}
