import { useClickOutside, useHover } from 'src';
import { ExampleBase } from '../example-base';
import Code from './use-hover.code.mdx';

import { useMDXComponents } from 'solid-jsx';
import { createSignal, Show } from 'solid-js';

export function UseHoverExample() {
  const { ref, hovered } = useHover();

  // @ts-ignore
  const components: any = useMDXComponents();

  return (
    <ExampleBase
      title="useHover"
      description="Detects hovers on a ref"
      code={<Code components={components} />}
    >
      <div class="flex h-full w-full flex-1 items-center justify-center rounded-md border p-3 py-10">
        <div
          class={`cursor-pointer select-none rounded-full border bg-neutral-50 p-2 text-xs transition ${hovered() ? 'scale-95' : ''}`}
          ref={ref}
        >
          <Show when={hovered()} fallback={'No detections'}>
            You hovered me!
          </Show>
        </div>
      </div>
    </ExampleBase>
  );
}
