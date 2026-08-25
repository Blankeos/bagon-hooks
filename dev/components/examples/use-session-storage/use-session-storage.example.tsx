import { useSessionStorage } from 'src';
import { ExampleBase } from '../example-base';
import Code from './use-session-storage.code.mdx';

import { useMDXComponents } from 'solid-jsx';

export function UseSessionStorageExample() {
  const [value, setValue, removeValue] = useSessionStorage('bagon-session-demo', {
    defaultValue: 'hello session',
  });

  // @ts-ignore
  const components: any = useMDXComponents();

  return (
    <ExampleBase
      title="useSessionStorage"
      description="Persist a signal value in sessionStorage (cleared when the tab closes)."
      code={<Code components={components} />}
    >
      <div class="flex h-full w-full flex-col items-center justify-center gap-3 rounded-md border p-3 py-10 text-center text-sm">
        <input
          value={value()}
          onInput={e => setValue(e.currentTarget.value)}
          class="rounded-md border p-2"
        />
        <span class="text-xs text-neutral-500">Stored: {value()}</span>
        <button
          class="rounded-md bg-gray-400 px-3 py-1.5 text-white transition active:scale-95"
          onClick={() => removeValue()}
        >
          Remove
        </button>
      </div>
    </ExampleBase>
  );
}
