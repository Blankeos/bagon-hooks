import { useMove } from 'src';
import { ExampleBase } from '../example-base';
import Code from './use-move.code.mdx';

import { createSignal } from 'solid-js';
import { useMDXComponents } from 'solid-jsx';

export function UseMoveExample() {
  const [value, setValue] = createSignal({ x: 0.5, y: 0.5 });
  const { ref, active } = useMove(({ x, y }) => {
    setValue({ x, y });
  }, {});

  // @ts-ignore
  const components: any = useMDXComponents();

  return (
    <ExampleBase
      title="useMove"
      description={
        <>
          Handles move behavior over any element inside the constraints of a ref.
          <br />
          <br />
          Can be used to make custom sliders, color pickers, and draggable elements within a
          container.
        </>
      }
      code={<Code components={components} />}
    >
      <div class="flex h-full w-full flex-col items-center justify-center gap-x-1 gap-y-3 rounded-md border p-3 py-10 text-center">
        <div
          ref={ref}
          class="h-40 w-full rounded bg-blue-400/50"
          style={{
            position: 'relative',
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: `calc(${value().x * 100}% - ${8}px)`,
              top: `calc(${value().y * 100}% - ${8}px)`,
              width: '16px',
              height: '16px',
              'background-color': active() ? '#22c55e' : '#3b82f6',
            }}
          />
        </div>

        <div class="flex justify-center">
          Values:{' '}
          <code class="rounded-md bg-neutral-300 px-1.5 py-0.5">
            {JSON.stringify({
              x: value().x.toFixed(2),
              y: value().y.toFixed(2),
            })}
          </code>
        </div>
      </div>
    </ExampleBase>
  );
}
