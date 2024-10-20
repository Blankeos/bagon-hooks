import { useIdle, useMounted, useOs } from 'src';
import { ExampleBase } from '../example-base';
import Code from './use-mounted.code.mdx';

import { useMDXComponents } from 'solid-jsx';
import { Show } from 'solid-js';

export function UseMountedExample() {
  const mounted = useMounted();

  // @ts-ignore
  const components: any = useMDXComponents();

  return (
    <ExampleBase
      title="useMounted"
      description="Returns true if component is mounted. Useful for rendering only on client-side."
      code={<Code components={components} />}
    >
      <div class="flex h-full w-full items-center justify-center gap-x-1 rounded-md border p-3 py-10 text-center">
        <Show when={mounted()}>This only shows on the client.</Show>
      </div>
    </ExampleBase>
  );
}
