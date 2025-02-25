import { useIntersection } from 'src';
import { ExampleBase } from '../example-base';
import Code from './use-intersection.code.mdx';

import { Show } from 'solid-js';
import { useMDXComponents } from 'solid-jsx';

export function UseIntersectionExample() {
  const { ref, entry } = useIntersection({
    threshold: 0.75, // At least 75% of the element must "intersect" with the viewport
  });

  // @ts-ignore
  const components: any = useMDXComponents();

  return (
    <ExampleBase
      title="useIntersection"
      description="Returns intersection observer info about the element ref."
      code={<Code components={components} />}
    >
      <div class="relative flex h-full min-h-32 w-full items-center justify-center gap-x-1 overflow-y-scroll rounded-md border p-3 text-center text-sm">
        <div class="relative top-[calc(60%)] pb-5">
          <div
            ref={ref}
            class={`rounded-md p-5 text-white ${entry()?.isIntersecting ? 'bg-green-500' : 'bg-red-500'}`}
          >
            <Show
              when={entry()?.isIntersecting}
              children={<>Fully Intersecting</>}
              fallback={<>Obscured</>}
            />
          </div>
        </div>
      </div>
    </ExampleBase>
  );
}
