import { createSignal, For } from 'solid-js';
import { useMDXComponents } from 'solid-jsx';
import { useMutationObserver } from 'src';
import { ExampleBase } from '../example-base';
import Code from './use-mutation-observer.code.mdx';

export function UseMutationObserverExample() {
  const [items, setItems] = createSignal(['Item 1', 'Item 2']);
  const [mutations, setMutations] = createSignal(0);

  const { ref } = useMutationObserver(
    () => setMutations(c => c + 1),
    { childList: true, subtree: true },
  );

  // @ts-ignore
  const components: any = useMDXComponents();

  return (
    <ExampleBase
      title="useMutationObserver"
      description="Observe DOM mutations on an element via MutationObserver."
      code={<Code components={components} />}
    >
      <div class="flex h-full w-full flex-col items-center justify-center gap-3 rounded-md border p-3 py-10 text-center text-sm">
        <div ref={ref} class="min-w-40 rounded-md border bg-neutral-50 p-3">
          <ul class="space-y-1 text-left text-xs">
            <For each={items()}>{item => <li class="rounded bg-white px-2 py-1 shadow-sm">{item}</li>}</For>
          </ul>
        </div>
        <button
          class="rounded-md bg-primary px-3 py-1.5 text-white transition active:scale-95"
          onClick={() => setItems(prev => [...prev, `Item ${prev.length + 1}`])}
        >
          Append child
        </button>
        <span class="text-xs text-neutral-500">Mutations observed: {mutations()}</span>
      </div>
    </ExampleBase>
  );
}
