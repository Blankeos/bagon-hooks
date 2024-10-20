import { useElementSize, useIdle, useNetwork, useOs, useResizeObserver } from 'src';
import { ExampleBase } from '../example-base';
import Code from './use-element-size.code.mdx';

import { useMDXComponents } from 'solid-jsx';

export function UseElementSizeExample() {
  const { ref, height, width } = useElementSize();

  // @ts-ignore
  const components: any = useMDXComponents();

  return (
    <ExampleBase
      title="useElementSize"
      description="Returns width and height of a resizable element. An abstraction over useResizeObserver."
      code={<Code components={components} />}
    >
      <div class="flex h-full w-full flex-col items-center justify-center gap-3 rounded-md border p-3 py-10 text-start">
        <div class="flex flex-col items-center">
          <span>Width: {width().toFixed(2)}</span>
          <span>Height: {height().toFixed(2)}</span>
        </div>

        <div class="relative grid flex-1 place-items-center overflow-hidden">
          <textarea ref={ref} class="h-20 w-20 resize rounded-md border"></textarea>
          <div class="pointer-events-none absolute inset-0 grid place-items-center truncate text-center text-xs text-neutral-400">
            Resize Me
          </div>
        </div>
      </div>
    </ExampleBase>
  );
}
