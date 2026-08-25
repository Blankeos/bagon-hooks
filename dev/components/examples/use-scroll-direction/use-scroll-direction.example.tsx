import { useScrollDirection } from 'src';
import { ExampleBase } from '../example-base';
import Code from './use-scroll-direction.code.mdx';

import { useMDXComponents } from 'solid-jsx';

export function UseScrollDirectionExample() {
  const direction = useScrollDirection();

  // @ts-ignore
  const components: any = useMDXComponents();

  return (
    <ExampleBase
      title="useScrollDirection"
      description="Returns the current window scroll direction."
      code={<Code components={components} />}
    >
      <div class="flex h-full w-full flex-col items-center justify-center gap-2 rounded-md border p-3 py-10 text-center text-sm">
        <span>Scroll the page up or down</span>
        <strong>Direction: {direction()}</strong>
      </div>
    </ExampleBase>
  );
}
