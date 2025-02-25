import { ExampleBase } from '../example-base';
import Code from './use-disclosure.code.mdx';

import { useMDXComponents } from 'solid-jsx';

export function UseDisclosureExample() {
  // @ts-ignore
  const components: any = useMDXComponents();

  return (
    <ExampleBase
      title="useDisclosure"
      description="A hook to manage state for dialogs, modals, etc."
      code={<Code components={components} />}
    >
            <div class="flex h-full w-full items-center justify-center gap-x-1 rounded-md border p-3 py-10 text-center text-sm"></div>
    </ExampleBase>
  );
}
