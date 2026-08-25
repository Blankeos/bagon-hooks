import { useViewportSize } from 'src';
import { ExampleBase } from '../example-base';
import Code from './use-viewport-size.code.mdx';

import { useMDXComponents } from 'solid-jsx';

export function UseViewportSizeExample() {
  const { width, height } = useViewportSize();

  // @ts-ignore
  const components: any = useMDXComponents();

  return (
    <ExampleBase
      title="useViewportSize"
      description="Tracks the browser viewport width and height, updating on resize."
      code={<Code components={components} />}
    >
      <div class="flex h-full w-full flex-col items-center justify-center gap-3 rounded-md border p-3 py-10 text-center text-sm">
        <pre class="rounded-md border bg-neutral-100 p-3 px-5 text-left text-xs">
          {JSON.stringify({ width: width(), height: height() }, null, 2)}
        </pre>
        <span class="text-xs text-neutral-500">Resize the window to update</span>
      </div>
    </ExampleBase>
  );
}
