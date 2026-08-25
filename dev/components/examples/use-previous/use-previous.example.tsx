import { createSignal } from 'solid-js';
import { usePrevious } from 'src';
import { ExampleBase } from '../example-base';
import Code from './use-previous.code.mdx';

import { useMDXComponents } from 'solid-jsx';

export function UsePreviousExample() {
  const [count, setCount] = createSignal(0);
  const previous = usePrevious(count);

  // @ts-ignore
  const components: any = useMDXComponents();

  return (
    <ExampleBase
      title="usePrevious"
      description="Returns the previous value of a signal/accessor."
      code={<Code components={components} />}
    >
      <div class="flex h-full w-full flex-col items-center justify-center gap-3 rounded-md border p-3 py-10 text-center text-sm">
        <div>
          Current: <strong>{count()}</strong>
        </div>
        <div>
          Previous: <strong>{previous() ?? 'undefined'}</strong>
        </div>
        <button
          class="rounded-md border px-3 py-1.5 transition active:scale-95"
          onClick={() => setCount(c => c + 1)}
        >
          Increment
        </button>
      </div>
    </ExampleBase>
  );
}
