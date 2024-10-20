import { useOs } from 'src';
import { ExampleBase } from '../example-base';
import Code from './use-os.code.mdx';

import { useMDXComponents } from 'solid-jsx';

export function UseOsExample() {
  const os = useOs();

  // @ts-ignore
  const components: any = useMDXComponents();

  return (
    <ExampleBase
      title="useOs"
      description="Returns the current OS"
      code={<Code components={components} />}
    >
      <div class="flex h-full w-full items-center justify-center rounded-md border p-3 py-10 text-center">
        Current OS: {os()}
      </div>
    </ExampleBase>
  );
}
