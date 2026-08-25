import { createSignal } from 'solid-js';
import { usePageLeave } from 'src';
import { ExampleBase } from '../example-base';
import Code from './use-page-leave.code.mdx';

import { useMDXComponents } from 'solid-jsx';

export function UsePageLeaveExample() {
  const [left, setLeft] = createSignal(0);

  usePageLeave(() => setLeft(n => n + 1));

  // @ts-ignore
  const components: any = useMDXComponents();

  return (
    <ExampleBase
      title="usePageLeave"
      description="Calls a callback when the mouse leaves the document."
      code={<Code components={components} />}
    >
      <div class="flex h-full w-full flex-col items-center justify-center gap-2 rounded-md border p-3 py-10 text-center text-sm">
        <span>Move your mouse out of the page</span>
        <strong>Left count: {left()}</strong>
      </div>
    </ExampleBase>
  );
}
