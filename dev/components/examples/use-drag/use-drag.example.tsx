import { createSignal } from 'solid-js';
import { useMDXComponents } from 'solid-jsx';
import { useDrag } from 'src';
import { ExampleBase } from '../example-base';
import Code from './use-drag.code.mdx';

export function UseDragExample() {
  // @ts-ignore
  const components: any = useMDXComponents();
  const [pos, setPos] = createSignal({ x: 16, y: 16 });
  const [origin, setOrigin] = createSignal({ x: 16, y: 16 });
  let el!: HTMLDivElement;

  const clamp = (n: number, min: number, max: number) => Math.min(Math.max(n, min), max);

  const drag = useDrag(state => {
    let from = origin();
    if (state.first) {
      from = pos();
      setOrigin(from);
    }
    const parent = el.parentElement!.getBoundingClientRect();
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    const nextX = clamp(from.x + state.movement[0], 0, parent.width - w);
    const nextY = clamp(from.y + state.movement[1], 0, parent.height - h);
    setPos({ x: nextX, y: nextY });
  });

  return (
    <ExampleBase
      title="useDrag"
      description="Pointer drag handler with movement deltas. Bounds are clamped in the demo."
      code={<Code components={components} />}
    >
      <div class="relative h-56 w-full overflow-hidden rounded-md border bg-neutral-50">
        <div
          ref={node => {
            el = node as HTMLDivElement;
            drag.ref(node as HTMLDivElement);
          }}
          class="absolute flex h-16 w-16 cursor-grab items-center justify-center rounded-md bg-primary text-xs font-medium text-white active:cursor-grabbing"
          style={{
            left: `${pos().x}px`,
            top: `${pos().y}px`,
          }}
        >
          Drag
        </div>
      </div>
    </ExampleBase>
  );
}
