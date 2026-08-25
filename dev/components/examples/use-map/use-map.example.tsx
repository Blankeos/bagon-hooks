import { For } from 'solid-js';
import { useMap } from 'src/use-map';
import { ExampleBase } from '../example-base';
import Code from './use-map.code.mdx';

export function UseMapExample() {
  const map = useMap<string, number>([
    ['apples', 2],
    ['oranges', 5],
  ]);

  return (
    <ExampleBase
      title="useMap"
      description="Reactive Map helpers for set, delete, clear, and bulk updates."
      code={<Code />}
    >
      <div class="flex h-full w-full flex-col items-center justify-center gap-3 rounded-md border p-3 py-10 text-center text-sm">
        <div class="flex flex-wrap justify-center gap-2">
          <button
            class="rounded-md bg-primary px-3 py-1.5 text-white transition active:scale-95"
            onClick={() => map.set(`item-${map().size + 1}`, Math.floor(Math.random() * 10))}
          >
            Add
          </button>
          <button
            class="rounded-md bg-gray-400 px-3 py-1.5 text-white transition active:scale-95"
            onClick={() => map.clear()}
          >
            Clear
          </button>
        </div>

        <ul class="max-h-40 w-full max-w-sm space-y-1 overflow-y-auto text-sm">
          <For each={[...map()]}>
            {([key, value]) => (
              <li class="flex items-center justify-between gap-2 rounded-md border px-2 py-1">
                <span>
                  {key}: {value}
                </span>
                <button
                  class="rounded-md bg-gray-400 px-2 py-1 text-xs text-white transition active:scale-90"
                  onClick={() => map.delete(key)}
                >
                  delete
                </button>
              </li>
            )}
          </For>
        </ul>

        <div class="text-xs text-neutral-500">size: {map().size}</div>
      </div>
    </ExampleBase>
  );
}
