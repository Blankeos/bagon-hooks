import { useId } from 'src';
import { ExampleBase } from '../example-base';
import Code from './use-id.code.mdx';

import { useMDXComponents } from 'solid-jsx';

export function UseIdExample() {
  const id = useId();

  // @ts-ignore
  const components: any = useMDXComponents();

  return (
    <ExampleBase
      title="useId"
      description="Returns a random id."
      code={<Code components={components} />}
    >
      <div class="flex h-full w-full items-center justify-center gap-x-1 rounded-md border p-3 py-10 text-center text-sm">
        Random ID: <span class="rounded-md bg-neutral-300 px-1.5 py-0.5">{id()}</span>
      </div>
    </ExampleBase>
  );
}
