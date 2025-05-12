import { useInterval } from 'src';
import { ExampleBase } from '../example-base';
import Code from './use-interval.code.mdx';

import { createSignal } from 'solid-js';
import { useMDXComponents } from 'solid-jsx';

export function UseIntervalExample() {
  const [seconds, setSeconds] = createSignal(0);

  const interval = useInterval(
    () => {
      setSeconds(s => s + 1);
    },
    1000,
    { autoInvoke: true },
  );

  // @ts-ignore
  const components: any = useMDXComponents();

  return (
    <ExampleBase
      title="useInterval"
      description="Calls function with a given interval"
      code={<Code components={components} />}
    >
      <div class="flex h-full w-full flex-col items-center justify-center gap-x-3 gap-y-3 rounded-md border p-3 py-10 text-center">
        <p class="text-xl font-medium">Page loaded {seconds()} seconds ago.</p>
        <button
          class={`rounded-md ${
            !interval.active() ? 'bg-primary' : 'bg-red-500'
          } px-3 py-1.5 text-white transition active:scale-95`}
          onClick={interval.toggle}
        >
          {interval.active() ? 'Stop' : 'Start'} counting
        </button>
      </div>
    </ExampleBase>
  );
}
