import { useFullscreen } from 'src';
import { ExampleBase } from '../example-base';
import Code from './use-fullscreen.code.mdx';

import { Show } from 'solid-js';
import { useMDXComponents } from 'solid-jsx';

export function UseFullScreenExample() {
  const { fullscreen, toggle } = useFullscreen();

  // @ts-ignore
  const components: any = useMDXComponents();

  return (
    <ExampleBase
      title="useFullscreen"
      description="A hook that allows you to enter and exit fullscreen mode. Can also optionally pass a ref of the element to be fullscreened."
      code={<Code components={components} />}
    >
      <div class="flex h-full w-full items-center justify-center gap-x-1 rounded-md border p-3 py-10 text-center">
        <button
          class={`rounded-md px-3 py-1.5 text-white transition active:scale-95 ${fullscreen() ? 'bg-red-500' : 'bg-primary'}`}
          onClick={toggle}
        >
          <Show when={fullscreen()} children={'Exit Fullscreen'} fallback={'Enter Fullscreen'} />
        </button>
      </div>
    </ExampleBase>
  );
}
