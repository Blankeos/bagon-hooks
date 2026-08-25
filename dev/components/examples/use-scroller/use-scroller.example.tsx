import { useMDXComponents } from 'solid-jsx';
import { useScroller } from 'src/use-scroller';
import { ExampleBase } from '../example-base';
import Code from './use-scroller.code.mdx';

export function UseScrollerExample() {
  const { ref, scrollToTop, scrollToBottom, scrollTo } = useScroller({ behavior: 'smooth' });

  // @ts-ignore
  const components: any = useMDXComponents();

  return (
    <ExampleBase
      title="useScroller"
      description="Helpers for scrolling an element to top, bottom, or an arbitrary offset."
      code={<Code components={components} />}
    >
      <div class="flex h-full w-full flex-col items-center justify-center gap-3 rounded-md border p-3 py-10 text-center">
        <div class="flex flex-wrap justify-center gap-2">
          <button
            class="rounded-md bg-primary px-3 py-1.5 text-white transition active:scale-95"
            type="button"
            onClick={scrollToTop}
          >
            Top
          </button>
          <button
            class="rounded-md border px-2 py-1 text-sm transition active:scale-90"
            type="button"
            onClick={() => scrollTo({ y: 120 })}
          >
            Mid
          </button>
          <button
            class="rounded-md bg-primary px-3 py-1.5 text-white transition active:scale-95"
            type="button"
            onClick={scrollToBottom}
          >
            Bottom
          </button>
        </div>

        <div ref={ref} class="h-40 w-full overflow-auto rounded-md border p-3 text-left text-sm">
          {Array.from({ length: 30 }, (_, index) => (
            <p class="mb-2">Line {index + 1}</p>
          ))}
        </div>
      </div>
    </ExampleBase>
  );
}
