import { createSignal } from 'solid-js';
import { useMDXComponents } from 'solid-jsx';
import { useRadialMove } from 'src';
import { ExampleBase } from '../example-base';
import Code from './use-radial-move.code.mdx';

export function UseRadialMoveExample() {
  const [value, setValue] = createSignal(45);
  const radial = useRadialMove(setValue, { step: 1 });

  // @ts-ignore
  const components: any = useMDXComponents();

  return (
    <ExampleBase
      title="useRadialMove"
      description="Track pointer angle around an element's center — useful for knobs and dials."
      code={<Code components={components} />}
    >
      <div class="flex h-full w-full flex-col items-center justify-center gap-3 rounded-md border p-3 py-10 text-center">
        <div
          ref={radial.ref}
          class="relative flex h-40 w-40 items-center justify-center rounded-full border bg-neutral-50"
          style={{ cursor: radial.active() ? 'grabbing' : 'grab' }}
        >
          <div
            class="absolute h-2 w-16 origin-left rounded-full bg-primary"
            style={{
              left: '50%',
              top: '50%',
              transform: `rotate(${value() - 90}deg) translateY(-50%)`,
            }}
          />
          <span class="relative z-10 rounded bg-white px-2 py-1 text-sm shadow-sm">{Math.round(value())}°</span>
        </div>
        <p class="text-xs text-neutral-500">{radial.active() ? 'Dragging…' : 'Drag around the circle'}</p>
      </div>
    </ExampleBase>
  );
}
