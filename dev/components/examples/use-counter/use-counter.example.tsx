import { useCounter } from 'src';
import { ExampleBase } from '../example-base';
import Code from './use-counter.code.mdx';

import { useMDXComponents } from 'solid-jsx';

export function UseCounterExample() {
  const [count, { decrement, increment, reset, set }] = useCounter(5, { min: 1, max: 10 });

  // @ts-ignore
  const components: any = useMDXComponents();

  return (
    <ExampleBase
      title="useCounter"
      description="A hook that returns a signal with a counter value and functions to increment, decrement, set and reset the counter."
      code={<Code components={components} />}
    >
      <div class="flex h-full w-full flex-col items-center justify-center gap-5 gap-x-1 rounded-md border p-3 py-10 text-center">
        <span>{count()}</span>

        <div class="flex gap-x-2 text-sm">
          <button
            class="rounded-md border p-1 px-1.5 transition active:scale-90"
            onClick={decrement}
          >
            -
          </button>
          <button
            class="rounded-md border p-1 px-1.5 transition active:scale-90"
            onClick={increment}
          >
            +
          </button>
          <button class="rounded-md border p-1 px-1.5 transition active:scale-90" onClick={reset}>
            Reset
          </button>
          <button
            class="rounded-md border p-1 px-1.5 transition active:scale-90"
            onClick={() => set(Math.floor(Math.random() * 10))}
          >
            Set (To Random)
          </button>
        </div>
      </div>
    </ExampleBase>
  );
}
