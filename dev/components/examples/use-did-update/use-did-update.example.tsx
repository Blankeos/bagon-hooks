import { useDidUpdate } from 'src';
import { ExampleBase } from '../example-base';
import Code from './use-did-update.code.mdx';

import { createSignal } from 'solid-js';
import { useMDXComponents } from 'solid-jsx';

export function UseDidUpdateExample() {
  const [signal, setSignal] = createSignal(0);

  useDidUpdate(() => {
    console.log('Did Update', signal());
  }, signal);

  // @ts-ignore
  const components: any = useMDXComponents();

  return (
    <ExampleBase
      title="useDidUpdate"
      description={
        <>
          This hook works the same way as createEffect but it is not called when component is
          mounted.
          <br />
          <br />
          Unlike createEffect, this always has a dependency of signals (like React's useEffect) for
          the reason that the only way to do this in Solid is using the on() + defer property under
          the hood.
        </>
      }
      code={<Code components={components} />}
    >
      <div class="flex h-full w-full flex-col items-center justify-center gap-x-1 gap-y-2 rounded-md border p-3 py-10 text-center text-sm">
        <p class="max-w-xs text-center text-xs">
          This logs "Did Update {signal() === 0 ? 'X' : signal()}" to the console. Notice that it
          doesn't log "Did Update 0" since it happens on mount.
        </p>
        <button
          class="rounded-md bg-primary p-2 text-white transition active:scale-95"
          onClick={() => {
            setSignal(signal() + 1);
          }}
        >
          Simulate an Update {signal()}
        </button>
      </div>
    </ExampleBase>
  );
}
