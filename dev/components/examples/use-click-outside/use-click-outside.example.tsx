import { useClickOutside } from 'src';
import { ExampleBase } from '../example-base';
import Code from './use-click-outside.code.mdx';

import { useMDXComponents } from 'solid-jsx';
import { createSignal, Show } from 'solid-js';

export function UseClickOutsideExample() {
  const ref = useClickOutside(() => {
    setClicked(true);

    setTimeout(() => {
      setClicked(false);
    }, 500);
  });
  const [clicked, setClicked] = createSignal(false);

  // @ts-ignore
  const components: any = useMDXComponents();

  return (
    <ExampleBase
      title="useClickOutside"
      description="Detects clicks outside a ref"
      code={<Code components={components} />}
    >
      <div class="flex h-full w-full flex-1 items-center justify-center rounded-md border p-3 py-10">
        <div
          class={`select-none rounded-full border bg-neutral-50 p-2 text-xs transition ${clicked() ? 'scale-95' : ''}`}
          ref={ref}
        >
          <Show when={clicked()} fallback={'No detections'}>
            You clicked outside!
          </Show>
        </div>
      </div>
    </ExampleBase>
  );
}
