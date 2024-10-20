import { useIdle, useNetwork, useOs, useResizeObserver } from 'src';
import { ExampleBase } from '../example-base';
import Code from './use-resize-observer.code.mdx';

import { useMDXComponents } from 'solid-jsx';

export function UseResizeObserverExample() {
  const [ref, rectStore] = useResizeObserver();

  // @ts-ignore
  const components: any = useMDXComponents();

  return (
    <ExampleBase
      title="useResizeObserver"
      description="Returns information about a resizable element. This is more low-level but gives you more than just width and height."
      code={<Code components={components} />}
    >
      <div class="flex h-full w-full items-center justify-center gap-x-3 rounded-md border p-3 py-10 text-start">
        <pre class={`rounded-md border bg-neutral-100 p-3 px-5 text-xs`}>
          {JSON.stringify(rectStore, null, 2)}
        </pre>

        <div class="relative grid place-items-center overflow-hidden">
          <textarea ref={ref} class="h-20 w-20 resize rounded-md border"></textarea>
          <div class="pointer-events-none absolute inset-0 grid place-items-center truncate text-xs text-neutral-400">
            Resize Me
          </div>
        </div>
      </div>
    </ExampleBase>
  );
}
