import { useTimeout } from 'src';
import { ExampleBase } from '../example-base';
import Code from './use-timeout.code.mdx';

import { createSignal } from 'solid-js';
import { useMDXComponents } from 'solid-jsx';

export function UseTimeoutExample() {
  const [awesomeState, setAwesomeState] = createSignal('not awesome');
  const { start, clear } = useTimeout(() => {
    setAwesomeState('awesome');
  }, 1000);

  // @ts-ignore
  const components: any = useMDXComponents();

  return (
    <ExampleBase
      title="useTimeout"
      description="Calls function in given timeout"
      code={<Code components={components} />}
    >
      <div class="flex h-full w-full flex-col items-center justify-center gap-x-3 gap-y-3 rounded-md border p-3 py-10 text-center">
        <p class="text-xl font-medium">You: {awesomeState()}</p>
        <p class="max-w-xs text-sm">
          You will become <b>Awesome</b> in 1 second after pressing 'Start'. You can also cancel.
        </p>
        <div class="flex gap-4">
          <button
            class={`w-20 rounded-md bg-primary px-3 py-1.5 text-white transition active:scale-95`}
            onClick={() => {
              start(1000);
            }}
          >
            Start
          </button>
          <button
            class="w-20 rounded-md bg-gray-400 px-3 py-1.5 text-white transition active:scale-95"
            onClick={() => {
              clear();
              setAwesomeState('not awesome');
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </ExampleBase>
  );
}
