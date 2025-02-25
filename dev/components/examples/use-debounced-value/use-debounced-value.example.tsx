import { useDebouncedValue } from 'src';
import { ExampleBase } from '../example-base';
import Code from './use-debounced-value.code.mdx';

import { createSignal } from 'solid-js';
import { useMDXComponents } from 'solid-jsx';

export function UseDebouncedValueExample() {
  const [signal, setSignal] = createSignal('');
  const [value, cancel] = useDebouncedValue(signal, 500);

  // @ts-ignore
  const components: any = useMDXComponents();

  return (
    <ExampleBase
      title="useDebouncedValue"
      description="Debounced value from an existing signal."
      code={<Code components={components} />}
    >
      <div class="flex h-full w-full flex-col items-center justify-center gap-x-1 gap-y-2 rounded-md border p-3 py-10 text-center text-sm">
        <input
          value={signal()}
          onInput={e => setSignal(e.currentTarget.value)}
          class="rounded-md border p-2"
        />
        <div class="flex items-center gap-x-2">
          <span>State: {JSON.stringify(signal())}</span>
          <span>|</span>
          <span>Value: {JSON.stringify(value())}</span>
        </div>
      </div>
    </ExampleBase>
  );
}
