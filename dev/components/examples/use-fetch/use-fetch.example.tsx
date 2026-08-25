import { useFetch } from 'src';
import { ExampleBase } from '../example-base';
import Code from './use-fetch.code.mdx';

import { Show } from 'solid-js';
import { useMDXComponents } from 'solid-jsx';

export function UseFetchExample() {
  const { data, error, loading, refetch } = useFetch<{ userId: number; id: number; title: string; completed: boolean }>(
    'https://jsonplaceholder.typicode.com/todos/1',
  );

  // @ts-ignore
  const components: any = useMDXComponents();

  return (
    <ExampleBase
      title="useFetch"
      description="Fetches data with AbortController support. Returns data, error, loading, abort, and refetch."
      code={<Code components={components} />}
    >
      <div class="flex h-full w-full flex-col items-center justify-center gap-3 rounded-md border p-3 py-10 text-center text-sm">
        <Show when={loading()}>
          <span class="text-xs">Loading...</span>
        </Show>
        <Show when={error()}>
          <span class="text-xs text-red-500">{error()!.message}</span>
        </Show>
        <Show when={data() && !loading()}>
          <pre class="max-w-full overflow-auto rounded-md border bg-neutral-100 p-3 px-5 text-left text-xs">
            {JSON.stringify(data(), null, 2)}
          </pre>
        </Show>
        <button class="rounded-md border px-2 py-1 text-sm transition active:scale-90" onClick={() => refetch()}>
          Refetch
        </button>
      </div>
    </ExampleBase>
  );
}
