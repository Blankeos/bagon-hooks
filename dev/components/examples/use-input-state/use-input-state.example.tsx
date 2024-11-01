import { useInputState } from 'src';
import { ExampleBase } from '../example-base';
import Code from './use-input-state.code.mdx';

import { useMDXComponents } from 'solid-jsx';

export function UseInputStateExample() {
  const [input, handleInput] = useInputState('');
  const [checkbox, handleCheckbox] = useInputState(false);

  // @ts-ignore
  const components: any = useMDXComponents();

  return (
    <ExampleBase
      title="useInputState"
      description={
        <>
          Handles state of native inputs with the onChange or onInput handlers. Syntax sugar over
          writing your own handler functions and types for the events.
          <br /> <br />
          You can treat this as the SolidJS way of Svelte's ease of use with `bind:value` and
          `bind:checked`
        </>
      }
      code={<Code components={components} />}
    >
      <div class="flex h-full w-full flex-col items-center justify-center gap-x-1 gap-y-2 rounded-md border p-3 py-10 text-center text-sm">
        <pre class="rounded bg-neutral-200 p-1 text-xs">
          {JSON.stringify({
            input: input(),
            checkbox: checkbox(),
          })}
        </pre>
        <input value={input()} onInput={handleInput} class="rounded-md border p-2" />
        <input
          type="checkbox"
          checked={checkbox()}
          onChange={handleCheckbox}
          class="rounded-md border p-2"
        />
      </div>
    </ExampleBase>
  );
}
