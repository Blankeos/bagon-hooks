import { useMDXComponents } from 'solid-jsx';
import { useMask } from 'src';
import { ExampleBase } from '../example-base';
import Code from './use-mask.code.mdx';

export function UseMaskExample() {
  const mask = useMask({
    mask: '(999) 999-9999',
    slotChar: '_',
  });

  // @ts-ignore
  const components: any = useMDXComponents();

  return (
    <ExampleBase
      title="useMask"
      description="Format input values with a mask while tracking the raw unmasked value."
      code={<Code components={components} />}
    >
      <div class="flex h-full w-full flex-col items-center justify-center gap-3 rounded-md border p-3 py-10 text-center text-sm">
        <input
          ref={mask.ref}
          value={mask.value()}
          class="w-full max-w-xs rounded-md border px-3 py-2 text-left"
          placeholder="(999) 999-9999"
        />
        <div class="text-xs text-neutral-500">Raw: {mask.rawValue() || '(empty)'}</div>
        <div class="text-xs text-neutral-500">Complete: {mask.isComplete() ? 'yes' : 'no'}</div>
        <button
          class="rounded-md bg-gray-400 px-3 py-1.5 text-white transition active:scale-95"
          type="button"
          onClick={() => mask.reset()}
        >
          Reset
        </button>
      </div>
    </ExampleBase>
  );
}
