import { useDebouncedCallback } from 'src';
import { ExampleBase } from '../example-base';
import Code from './use-debounced-callback.code.mdx';

import { createSignal, For, JSX, Show } from 'solid-js';
import { useMDXComponents } from 'solid-jsx';

function getSearchResults(query: string): Promise<{ id: number; title: string }[]> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(
        query.trim() === ''
          ? []
          : Array(5)
              .fill(0)
              .map((_, index) => ({ id: index, title: `${query} ${index + 1}` })),
      );
    }, 1000);
  });
}

export function UseDebouncedCallbackExample() {
  const [search, setSearch] = createSignal('');
  const [searchResults, setSearchResults] = createSignal<{ id: number; title: string }[]>([]);
  const [loading, setLoading] = createSignal(false);

  const debouncedSearch = useDebouncedCallback(async (query: string) => {
    setLoading(true);
    setSearchResults(await getSearchResults(query));
    setLoading(false);
  }, 500);

  const handleInput: JSX.EventHandler<HTMLInputElement, InputEvent> = event => {
    setSearch(event.currentTarget.value);
    debouncedSearch(event.currentTarget.value);
  };

  // @ts-ignore
  const components: any = useMDXComponents();

  return (
    <ExampleBase
      title="useDebouncedCallback"
      description="Creates a debounced version of a callback function, delaying its execution until a specified time has elapsed since the last invocation."
      code={<Code components={components} />}
    >
      <div class="flex h-full w-full flex-col items-center justify-center gap-x-1 gap-y-2 rounded-md border p-3 py-10 text-center text-sm">
        <input
          value={search()}
          onInput={handleInput}
          class="rounded-md border p-2"
          placeholder="Search..."
        />

        <Show
          when={loading()}
          children={<>Loading...</>}
          fallback={
            <For each={searchResults()}>{result => <div class="text-xs">{result.title}</div>}</For>
          }
        />
      </div>
    </ExampleBase>
  );
}
