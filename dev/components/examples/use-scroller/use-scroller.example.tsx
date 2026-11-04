import { useMDXComponents } from 'solid-jsx';
import { useScroller } from 'src/use-scroller';
import { ExampleBase } from '../example-base';
import Code from './use-scroller.code.mdx';

export function UseScrollerExample() {
  const { ref, canScrollStart, canScrollEnd, scrollStart, scrollEnd, isDragging, dragHandlers } =
    useScroller({ scrollAmount: 160 });

  // @ts-ignore
  const components: any = useMDXComponents();

  return (
    <ExampleBase
      title="useScroller"
      description="Horizontal scroller state, start/end scrolling and drag-to-scroll."
      code={<Code components={components} />}
    >
      <div class="flex h-full w-full flex-col items-center justify-center gap-3 rounded-md border p-3 py-10 text-center">
        <div class="flex flex-wrap justify-center gap-2">
          <button
            class="rounded-md bg-primary px-3 py-1.5 text-white transition active:scale-95 disabled:opacity-40"
            type="button"
            disabled={!canScrollStart()}
            onClick={scrollStart}
          >
            ← Start
          </button>
          <button
            class="rounded-md bg-primary px-3 py-1.5 text-white transition active:scale-95 disabled:opacity-40"
            type="button"
            disabled={!canScrollEnd()}
            onClick={scrollEnd}
          >
            End →
          </button>
        </div>

        <div
          ref={ref}
          {...dragHandlers}
          class="flex w-full cursor-grab gap-2 overflow-x-auto rounded-md border p-3 text-sm"
        >
          {Array.from({ length: 20 }, (_, index) => (
            <div class="w-24 shrink-0 rounded-md border px-3 py-6">Card {index + 1}</div>
          ))}
        </div>

        <p class="text-xs text-neutral-500">
          canScrollStart: {String(canScrollStart())} · canScrollEnd: {String(canScrollEnd())} ·
          dragging: {String(isDragging())} (drag the cards with the mouse)
        </p>
      </div>
    </ExampleBase>
  );
}
