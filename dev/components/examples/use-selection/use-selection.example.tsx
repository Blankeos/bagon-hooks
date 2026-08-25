import { createSignal } from 'solid-js';
import { useMDXComponents } from 'solid-jsx';
import { useSelection } from 'src/use-selection';
import { ExampleBase } from '../example-base';
import Code from './use-selection.code.mdx';

export function UseSelectionExample() {
  const [paragraph, setParagraph] = createSignal<HTMLElement | null>(null);
  const selection = useSelection();

  // @ts-ignore
  const components: any = useMDXComponents();

  return (
    <ExampleBase
      title="useSelection"
      description="Enhanced selection helper with text/rect/ranges plus set/clear — unlike `useTextSelection`, which only tracks `window.getSelection()`."
      code={<Code components={components} />}
    >
      <div class="flex h-full w-full flex-col items-center justify-center gap-3 rounded-md border p-3 py-10 text-center text-sm">
        <p
          ref={setParagraph}
          class="max-w-md select-text rounded-md border bg-neutral-50 p-3 text-left text-sm text-neutral-700"
        >
          Select some of this text with the mouse, or use the buttons below to set a range
          programmatically.
        </p>
        <div class="flex flex-wrap justify-center gap-2">
          <button
            class="rounded-md bg-primary px-3 py-1.5 text-white transition active:scale-95"
            type="button"
            onClick={() => selection.setSelection({ start: 0, end: 6 }, paragraph())}
          >
            Select first word
          </button>
          <button
            class="rounded-md bg-gray-400 px-3 py-1.5 text-white transition active:scale-95"
            type="button"
            onClick={() => selection.clearSelection()}
          >
            Clear
          </button>
        </div>
        <div class="text-sm">Selected: {selection.text() || '(none)'}</div>
        <div class="text-sm">Collapsed: {selection.isCollapsed() ? 'yes' : 'no'}</div>
      </div>
    </ExampleBase>
  );
}
