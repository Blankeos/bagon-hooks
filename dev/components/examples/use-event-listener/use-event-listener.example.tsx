import { useMDXComponents } from 'solid-jsx';
import { useEventListener } from 'src';
import { ExampleBase } from '../example-base';
import Code from './use-event-listener.code.mdx';

import { createSignal } from 'solid-js';

export function UseEventListenerExample() {
  const [count, setCount] = createSignal(0);
  const ref = useEventListener('click', () => setCount(c => c + 1));

  // @ts-ignore
  const components: any = useMDXComponents();

  return (
    <ExampleBase
      title="useEventListener"
      description="Attaches an event listener to a target (element ref, Window, Document, or MediaQueryList)."
      code={<Code components={components} />}
    >
      <div class="flex h-full w-full flex-col items-center justify-center gap-3 rounded-md border p-3 py-10 text-center text-sm">
        <button ref={ref} class="rounded-md bg-primary px-3 py-1.5 text-white transition active:scale-95">
          Click me
        </button>
        <span>Clicks: {count()}</span>
      </div>
    </ExampleBase>
  );
}
