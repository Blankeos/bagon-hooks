import { useOrientation } from 'src';
import { ExampleBase } from '../example-base';
import Code from './use-orientation.code.mdx';

import { useMDXComponents } from 'solid-jsx';

export function UseOrientationExample() {
  const orientation = useOrientation();

  // @ts-ignore
  const components: any = useMDXComponents();

  return (
    <ExampleBase
      title="useOrientation"
      description="Returns the current orientation of the device. Try tilting the device (if on your phone)."
      code={<Code components={components} />}
    >
      <div class="flex h-full w-full items-center justify-center gap-x-1 rounded-md border p-3 py-10 text-center text-sm">
        <pre class={`rounded-md border bg-neutral-100 p-3 px-5 text-start text-xs`}>
          {JSON.stringify(orientation(), null, 2)}
        </pre>
      </div>
    </ExampleBase>
  );
}
