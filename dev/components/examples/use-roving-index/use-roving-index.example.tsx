import { createSignal, For } from 'solid-js';
import { useMDXComponents } from 'solid-jsx';
import { useRovingIndex } from 'src';
import { ExampleBase } from '../example-base';
import Code from './use-roving-index.code.mdx';

const ITEMS = ['Home', 'Search', 'Library', 'Settings'] as const;

export function UseRovingIndexExample() {
  const [index, setIndex] = createSignal(0);
  const { getElementProps, getElementRef, onKeyDown } = useRovingIndex(index, setIndex, {
    total: ITEMS.length,
    loop: true,
  });

  // @ts-ignore
  const components: any = useMDXComponents();

  return (
    <ExampleBase
      title="useRovingIndex"
      description="Manage keyboard-navigable roving tabindex for toolbars, menus, and grids."
      code={<Code components={components} />}
    >
      <div class="flex h-full w-full flex-col items-center justify-center gap-3 rounded-md border p-3 py-10 text-center">
        <p class="text-xs text-neutral-500">Focus the toolbar, then use Arrow keys / Home / End.</p>

        <div
          role="toolbar"
          aria-label="Demo toolbar"
          class="flex flex-wrap justify-center gap-2"
          onKeyDown={onKeyDown}
        >
          <For each={[...ITEMS]}>
            {(label, i) => (
              <button
                type="button"
                ref={getElementRef(i())}
                {...getElementProps(i())}
                class="rounded-md border px-2 py-1 text-sm transition active:scale-90 outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                classList={{
                  'bg-primary text-white border-transparent': index() === i(),
                }}
                onClick={() => setIndex(i())}
              >
                {label}
              </button>
            )}
          </For>
        </div>

        <p class="text-sm">Active index: {index()}</p>
      </div>
    </ExampleBase>
  );
}
