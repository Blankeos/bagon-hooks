import { useThrottledState } from 'src';
import { ExampleBase } from '../example-base';
import Code from './use-throttled-state.code.mdx';

import { useMDXComponents } from 'solid-jsx';

export function UseThrottledStateExample() {
  const [value, setValue] = useThrottledState('', 500);

  // @ts-ignore
  const components: any = useMDXComponents();

  return (
    <ExampleBase
      title="useThrottledState"
      description="Like createSignal but the setter is throttled."
      code={<Code components={components} />}
    >
      <div class="flex h-full w-full flex-col items-center justify-center gap-3 rounded-md border p-3 py-10 text-center text-sm">
        <input
          onInput={e => setValue(e.currentTarget.value)}
          class="rounded-md border p-2"
          placeholder="Type quickly..."
        />
        <span>Throttled value: {JSON.stringify(value())}</span>
      </div>
    </ExampleBase>
  );
}
