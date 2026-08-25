import { For } from 'solid-js';
import { useQueue } from 'src/use-queue';
import { ExampleBase } from '../example-base';
import Code from './use-queue.code.mdx';

export function UseQueueExample() {
  let nextId = 4;
  const { state, queue, add, update, cleanQueue } = useQueue<number>({
    initialValues: [1, 2, 3],
    limit: 2,
  });

  return (
    <ExampleBase
      title="useQueue"
      description="Limit visible state while keeping overflow items in a queue."
      code={<Code />}
    >
      <div class="flex h-full w-full flex-col items-center justify-center gap-3 rounded-md border p-3 py-10 text-center text-sm">
        <p class="max-w-sm text-xs text-neutral-500">
          Only `limit` items stay in state; overflow goes to queue.
        </p>

        <div class="flex flex-wrap justify-center gap-2">
          <button
            class="rounded-md bg-primary px-3 py-1.5 text-white transition active:scale-95"
            onClick={() => add(nextId++)}
          >
            Add
          </button>
          <button
            class="rounded-md border px-2 py-1 text-sm transition active:scale-90"
            onClick={() => update(current => current.map(value => value + 1))}
          >
            Update all (+1)
          </button>
          <button
            class="rounded-md bg-gray-400 px-3 py-1.5 text-white transition active:scale-95"
            onClick={cleanQueue}
          >
            Clean queue
          </button>
        </div>

        <div class="grid w-full max-w-sm grid-cols-2 gap-3 text-left text-sm">
          <div class="rounded-md border p-2">
            <div class="mb-1 font-medium">State (active, limit {2})</div>
            <ul class="space-y-1 font-mono text-xs">
              <For each={state()} fallback={<li class="text-neutral-400">(empty)</li>}>
                {item => <li class="rounded bg-neutral-50 px-2 py-1">{item}</li>}
              </For>
            </ul>
          </div>
          <div class="rounded-md border p-2">
            <div class="mb-1 font-medium">Queue (backlog)</div>
            <ul class="space-y-1 font-mono text-xs">
              <For each={queue()} fallback={<li class="text-neutral-400">(empty)</li>}>
                {item => <li class="rounded bg-neutral-50 px-2 py-1">{item}</li>}
              </For>
            </ul>
          </div>
        </div>

        <p class="max-w-sm text-xs text-neutral-400">
          “Update all (+1)” maps every item in state and queue.
        </p>
      </div>
    </ExampleBase>
  );
}
