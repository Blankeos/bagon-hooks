import { useEyeDropper } from 'src';
import { ExampleBase } from '../example-base';
import Code from './use-eye-dropper.code.mdx';

import { IconEyeDropper } from 'dev/icons';
import { Show } from 'solid-js';
import { useMDXComponents } from 'solid-jsx';

export function UseEyeDropperExample() {
  const { color, supported, pickColor } = useEyeDropper();

  // @ts-ignore
  const components: any = useMDXComponents();

  return (
    <ExampleBase
      title="useEyeDropper"
      description="A hook that gives you the ability to open the browser's EyeDropper API and save it to a signal."
      code={<Code components={components} />}
    >
      <div class="flex h-full w-full flex-col items-center justify-center gap-5 rounded-md border p-3 py-10 text-center">
        <div class="flex items-center gap-x-2">
          <button class="transition active:scale-95" onClick={pickColor} disabled={!supported()}>
            <IconEyeDropper />
          </button>

          <div class="flex items-center gap-x-2 text-sm">
            Picked Color: {color()}
            <div class="h-8 w-8 rounded-full border" style={{ 'background-color': color() }} />
          </div>
        </div>

        <Show when={supported() !== undefined && !supported()}>
          <span class="text-xs text-red-500">Your browser does not support EyeDropper.</span>
        </Show>
      </div>
    </ExampleBase>
  );
}
