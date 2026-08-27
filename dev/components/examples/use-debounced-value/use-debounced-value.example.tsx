import { useDebouncedValue } from 'src';
import { ExampleBase } from '../example-base';
import Code from './use-debounced-value.code.mdx';

import { createSignal } from 'solid-js';
import { useMDXComponents } from 'solid-jsx';

export function UseDebouncedValueExample() {
  const [signal, setSignal] = createSignal('');
  const [value, cancel, { flush }] = useDebouncedValue(signal, 500, { leading: true });

  // @ts-ignore
  const components: any = useMDXComponents();

  return (
    <ExampleBase
      title="useDebouncedValue"
      description="Debounced value from an existing signal (leading + flush)."
      code={<Code components={components} />}
    >
      <div
        data-testid="use-debounced-value"
        class="flex h-full w-full flex-col items-center justify-center gap-x-1 gap-y-2 rounded-md border p-3 py-10 text-center text-sm"
      >
        <input
          data-testid="debounced-input"
          value={signal()}
          onInput={e => setSignal(e.currentTarget.value)}
          class="rounded-md border p-2"
        />
        <div class="flex items-center gap-x-2">
          <span data-testid="debounced-state">State: {JSON.stringify(signal())}</span>
          <span>|</span>
          <span data-testid="debounced-value">Value: {JSON.stringify(value())}</span>
        </div>
        <div class="flex gap-2">
          <button
            data-testid="debounced-cancel"
            type="button"
            class="rounded-md border px-2 py-1"
            onClick={cancel}
          >
            Cancel
          </button>
          <button
            data-testid="debounced-flush"
            type="button"
            class="rounded-md border px-2 py-1"
            onClick={flush}
          >
            Flush
          </button>
        </div>
      </div>
    </ExampleBase>
  );
}
