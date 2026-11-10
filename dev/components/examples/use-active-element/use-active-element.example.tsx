import { useActiveElement } from 'src';
import { ExampleBase } from '../example-base';
import Code from './use-active-element.code.mdx';

import { useMDXComponents } from 'solid-jsx';

function describe(element: Element | null) {
  if (!element) return 'null';
  return element.id ? `${element.tagName.toLowerCase()}#${element.id}` : element.tagName.toLowerCase();
}

export function UseActiveElementExample() {
  const activeElement = useActiveElement();

  // @ts-ignore
  const components: any = useMDXComponents();

  return (
    <ExampleBase
      title="useActiveElement"
      description="Tracks the element that currently has focus."
      code={<Code components={components} />}
    >
      <div class="flex h-full w-full flex-col items-center justify-center gap-3 rounded-md border p-3 py-10 text-center text-sm">
        <div>
          Focused element: <code class="rounded-md border px-1">{describe(activeElement())}</code>
        </div>
        <div class="flex gap-2">
          <input id="first-name" class="rounded-md border px-2 py-1" placeholder="First name" />
          <input id="last-name" class="rounded-md border px-2 py-1" placeholder="Last name" />
        </div>
      </div>
    </ExampleBase>
  );
}
