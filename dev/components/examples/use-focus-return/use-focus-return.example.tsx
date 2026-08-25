import { createSignal, Show } from 'solid-js';
import { useMDXComponents } from 'solid-jsx';
import { useFocusReturn } from 'src';
import { ExampleBase } from '../example-base';
import Code from './use-focus-return.code.mdx';

export function UseFocusReturnExample() {
  const [opened, setOpened] = createSignal(false);

  // Return focus to the trigger when the dialog closes.
  useFocusReturn({
    opened: () => opened(),
    shouldReturnFocus: true,
  });

  // @ts-ignore
  const components: any = useMDXComponents();

  return (
    <ExampleBase
      title="useFocusReturn"
      description="Captures the currently focused element and restores focus when a layer closes."
      code={<Code components={components} />}
    >
      <div class="flex h-full w-full flex-col items-center justify-center gap-3 rounded-md border p-3 py-10 text-center">
        <button
          type="button"
          class="rounded-md bg-primary px-3 py-1.5 text-white transition active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-900"
          onClick={() => setOpened(true)}
        >
          Open dialog
        </button>

        <p class="max-w-sm text-center text-xs text-neutral-500">
          Focus the button, open the dialog, type in dialog content, then close it — focus returns to the trigger.
        </p>

        <Show when={opened()}>
          <div
            role="dialog"
            aria-modal="true"
            class="flex w-full max-w-sm flex-col gap-3 rounded-md border bg-white p-4 shadow-sm"
          >
            <p class="text-sm">Dialog content</p>
            <input
              autofocus
              class="rounded-md border px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
              placeholder="Type here…"
            />
            <button
              type="button"
              class="rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-neutral-800 transition active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-900"
              onClick={() => setOpened(false)}
            >
              Close (returns focus)
            </button>
          </div>
        </Show>
      </div>
    </ExampleBase>
  );
}
