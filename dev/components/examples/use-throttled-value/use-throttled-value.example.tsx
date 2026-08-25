import { useThrottledValue } from 'src';
import { ExampleBase } from '../example-base';
import Code from './use-throttled-value.code.mdx';

import { createSignal } from 'solid-js';
import { useMDXComponents } from 'solid-jsx';

export function UseThrottledValueExample() {
  const [value, setValue] = createSignal('');
  const throttled = useThrottledValue(value, 500);

  // @ts-ignore
  const components: any = useMDXComponents();

  return (
    <ExampleBase
      title="useThrottledValue"
      description="Returns a throttled version of a reactive value."
      code={<Code components={components} />}
    >
      <div class="flex h-full w-full flex-col items-center justify-center gap-3 rounded-md border p-3 py-10 text-center text-sm">
        <input
          value={value()}
          onInput={e => setValue(e.currentTarget.value)}
          class="rounded-md border p-2"
        />
        <span>Value: {JSON.stringify(value())}</span>
        <span>Throttled: {JSON.stringify(throttled())}</span>
      </div>
    </ExampleBase>
  );
}
