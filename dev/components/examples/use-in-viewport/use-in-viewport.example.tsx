import { useInViewport } from 'src';
import { ExampleBase } from '../example-base';
import Code from './use-in-viewport.code.mdx';

import { Show } from 'solid-js';
import { useMDXComponents } from 'solid-jsx';

export function UseInViewportExample() {
  const { ref, inViewport } = useInViewport();

  // @ts-ignore
  const components: any = useMDXComponents();

  return (
    <ExampleBase
      title="useInViewport"
      description="Simpler alternative to useIntersection that only returns a bool."
      code={<Code components={components} />}
    >
      <div class="relative flex h-full min-h-32 w-full flex-col items-center justify-center gap-x-1 overflow-y-scroll rounded-md border p-3 text-center text-sm">
        <div class="sticky left-0 right-0 top-0 text-center">
          <Show
            when={inViewport()}
            fallback={<>Scroll to See Box</>}
            children={<>Box is visible</>}
          />
        </div>

        <div class="relative top-[calc(60%)] pb-5 pt-20">
          <div
            ref={ref}
            class={`rounded-md p-5 text-white ${inViewport() ? 'bg-green-500' : 'bg-red-500'}`}
          >
            <Show when={inViewport()} children={<>Fully Intersecting</>} fallback={<>Obscured</>} />
          </div>
        </div>
      </div>
    </ExampleBase>
  );
}
