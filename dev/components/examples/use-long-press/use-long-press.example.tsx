import { createSignal } from 'solid-js';
import { useLongPress } from 'src';
import { ExampleBase } from '../example-base';
import Code from './use-long-press.code.mdx';

import { useMDXComponents } from 'solid-jsx';

export function UseLongPressExample() {
  const [count, setCount] = createSignal(0);
  const handlers = useLongPress(() => setCount(c => c + 1), { threshold: 500 });

  // @ts-ignore
  const components: any = useMDXComponents();

  return (
    <ExampleBase
      title="useLongPress"
      description="Detects long-press gestures; spread handlers onto an element."
      code={<Code components={components} />}
    >
      <div class="flex h-full w-full flex-col items-center justify-center gap-3 rounded-md border p-3 py-10 text-center text-sm">
        <button
          class="select-none rounded-md border px-4 py-2 transition active:scale-95"
          {...handlers}
        >
          Press and hold
        </button>
        <strong>Triggered: {count()}</strong>
      </div>
    </ExampleBase>
  );
}
