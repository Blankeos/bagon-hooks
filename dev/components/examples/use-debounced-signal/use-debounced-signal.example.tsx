import { useDebouncedSignal } from 'src';
import { ExampleBase } from '../example-base';
import Code from './use-debounced-signal.code.mdx';

import { useMDXComponents } from 'solid-jsx';

export function UseDebouncedSignalExample() {
  const [signal, setSignal] = useDebouncedSignal('', 500);

  // @ts-ignore
  const components: any = useMDXComponents();

  return (
    <ExampleBase
      title="useDebouncedSignal"
      description="Creates a signal that is debounced with a given wait time."
      code={<Code components={components} />}
    >
      <div class="flex h-full w-full flex-col items-center justify-center gap-x-1 gap-y-2 rounded-md border p-3 py-10 text-center text-sm">
        <input
          value={signal()}
          onInput={e => setSignal(e.currentTarget.value)}
          class="rounded-md border p-2"
        />
        <span>State: {JSON.stringify(signal())}</span>
      </div>
    </ExampleBase>
  );
}
