import { useDisclosure } from 'src';

import { Show } from 'solid-js';
import { useMDXComponents } from 'solid-jsx';
import { ExampleBase } from '../example-base';
import Code from './use-disclosure.code.mdx';

export function UseDisclosureExample() {
  const [opened, handlers] = useDisclosure(false);

  // @ts-ignore
  const components: any = useMDXComponents();
  return (
    <ExampleBase
      title="useDisclosure"
      description="A simple hook to manage state for dialogs, modals, accordions, etc. Anything that needs to open/close/toggle."
      code={<Code components={components} />}
    >
      <div class="flex h-full w-full items-center justify-center gap-x-1 rounded-md border p-3 py-10 text-center text-sm">
        <button onClick={handlers.open} class="rounded bg-blue-500 px-4 py-2 text-white">
          Open Dialog
        </button>

        <Show when={opened()}>
          <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div class="rounded-lg bg-white p-6 shadow-lg">
              <h2 class="mb-4 text-lg font-bold">Dialog Title</h2>
              <p class="mb-4">This is an example dialog using useDisclosure</p>
              <button onClick={handlers.close} class="rounded bg-gray-500 px-4 py-2 text-white">
                Close
              </button>
            </div>
          </div>
        </Show>
      </div>
    </ExampleBase>
  );
}
