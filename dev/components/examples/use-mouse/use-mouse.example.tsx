import { useMouse } from 'src';
import { ExampleBase } from '../example-base';
import Code from './use-mouse.code.mdx';

import { useMDXComponents } from 'solid-jsx';

export function UseMouseExample() {
  const { ref, position } = useMouse();

  // @ts-ignore
  const components: any = useMDXComponents();

  return (
    <ExampleBase
      title="useMouse"
      description="Returns the current mouse position and an optional ref to the element that is being tracked."
      code={<Code components={components} />}
    >
      <div class="flex h-full w-full flex-col items-center justify-center gap-4 gap-x-1 rounded-md border p-3 py-10 text-center text-sm">
        <div
          ref={ref}
          class="flex h-40 w-40 items-center justify-center rounded border bg-neutral-100 text-sm"
        >
          Track Here
        </div>
        Mouse coordinates{' '}
        <code class="rounded-md bg-neutral-300 px-1.5 py-0.5">{JSON.stringify(position())}</code>
      </div>
    </ExampleBase>
  );
}
