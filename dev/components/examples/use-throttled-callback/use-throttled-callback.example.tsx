import { useThrottledCallback } from 'src';
import { ExampleBase } from '../example-base';
import Code from './use-throttled-callback.code.mdx';

import { createSignal, For } from 'solid-js';
import { useMDXComponents } from 'solid-jsx';

export function UseThrottledCallbackExample() {
  const [searchResults, setSearchResults] = createSignal<
    { title: string; description: string }[]
  >([]);

  const handleSearch = useThrottledCallback(async (query: string) => {
    if (!query) {
      setSearchResults([]);
      return;
    }
    const response = await fetch(`https://dummyjson.com/products/search?q=${query}&limit=3`);
    const data = await response.json();
    setSearchResults(
      data.products.map((p: any) => ({
        title: p.title,
        description: p.description,
      })),
    );
  }, 500);

  // @ts-ignore
  const components: any = useMDXComponents();

  return (
    <ExampleBase
      title="useThrottledCallback"
      description="Creates a throttled version of a callback function."
      code={<Code components={components} />}
    >
      <div class="flex h-full w-full flex-col items-center justify-center gap-3 rounded-md border p-3 py-10 text-center text-sm">
        <input
          placeholder="Search products..."
          onInput={e => handleSearch(e.currentTarget.value)}
          class="rounded-md border p-2"
        />
        <div class="flex flex-col gap-1">
          <For each={searchResults()}>
            {result => <div class="text-xs">{result.title}</div>}
          </For>
        </div>
      </div>
    </ExampleBase>
  );
}
