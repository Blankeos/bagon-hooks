import { useFocusWithin } from 'src';
import { ExampleBase } from '../example-base';
import Code from './use-focus-within.code.mdx';

import { useMDXComponents } from 'solid-jsx';

export function UseFocusWithinExample() {
  const { ref, focused } = useFocusWithin();

  // @ts-ignore
  const components: any = useMDXComponents();

  return (
    <ExampleBase
      title="useFocusWithin"
      description="Detects whether focus is within an element or any of its descendants."
      code={<Code components={components} />}
    >
      <div class="flex h-full w-full items-center justify-center rounded-md border p-3 py-10 text-center text-sm">
        <div
          ref={ref}
          class={`flex flex-col gap-2 rounded-md border p-4 ${focused() ? 'border-blue-500 bg-blue-50' : 'bg-neutral-50'}`}
        >
          <span class="text-xs">Focused: {String(focused())}</span>
          <input class="rounded-md border p-2" placeholder="Focus me" />
          <button class="rounded-md border px-2 py-1 text-sm transition active:scale-90">Or me</button>
        </div>
      </div>
    </ExampleBase>
  );
}
