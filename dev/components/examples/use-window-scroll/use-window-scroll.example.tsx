import { useWindowScroll } from 'src';
import { ExampleBase } from '../example-base';
import Code from './use-window-scroll.code.mdx';

import { useMDXComponents } from 'solid-jsx';

export function UseWindowScrollExample() {
  const [position, scrollTo] = useWindowScroll();

  // @ts-ignore
  const components: any = useMDXComponents();

  return (
    <ExampleBase
      title="useWindowScroll"
      description="Reactive window scroll position with a smooth scrollTo helper."
      code={<Code components={components} />}
    >
      <div class="flex h-full w-full flex-col items-center justify-center gap-3 rounded-md border p-3 py-10 text-center text-sm">
        <pre class="rounded-md border bg-neutral-100 p-3 px-5 text-left text-xs">
          {JSON.stringify(position(), null, 2)}
        </pre>
        <div class="flex gap-2">
          <button
            class="rounded-md border px-2 py-1 text-sm transition active:scale-90"
            onClick={() => scrollTo({ y: 0 })}
          >
            Top
          </button>
          <button
            class="rounded-md border px-2 py-1 text-sm transition active:scale-90"
            onClick={() => scrollTo({ y: 500 })}
          >
            y: 500
          </button>
        </div>
      </div>
    </ExampleBase>
  );
}
