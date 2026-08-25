import { useMDXComponents } from 'solid-jsx';
import { useScrollIntoView } from 'src/use-scroll-into-view';
import { ExampleBase } from '../example-base';
import Code from './use-scroll-into-view.code.mdx';

export function UseScrollIntoViewExample() {
  const { scrollIntoView, targetRef, scrollableRef, scrolling } = useScrollIntoView({
    offset: 12,
  });

  // @ts-ignore
  const components: any = useMDXComponents();

  return (
    <ExampleBase
      title="useScrollIntoView"
      description="Smoothly scroll a target element into view within a scroll parent."
      code={<Code components={components} />}
    >
      <div class="flex h-full w-full flex-col items-center justify-center gap-3 rounded-md border p-3 py-10 text-center text-sm">
        <div class="flex items-center justify-center gap-2">
          <button
            class="rounded-md bg-primary px-3 py-1.5 text-white transition active:scale-95"
            onClick={() => scrollIntoView({ alignment: 'center' })}
          >
            Scroll to target
          </button>
          <span class="text-xs text-neutral-500">scrolling: {String(scrolling())}</span>
        </div>

        <div
          ref={scrollableRef}
          class="max-h-56 w-full overflow-y-auto rounded-md border p-3 text-left"
        >
          {Array.from({ length: 8 }, (_, i) => (
            <p class="mb-3 rounded-md border bg-neutral-50 p-3 text-sm text-neutral-600">
              Spacer block {i + 1}
            </p>
          ))}

          <div
            ref={targetRef}
            class="rounded-md border border-emerald-500 bg-emerald-50 p-4 text-sm text-emerald-800"
          >
            Target element
          </div>

          {Array.from({ length: 8 }, (_, i) => (
            <p class="mt-3 rounded-md border bg-neutral-50 p-3 text-sm text-neutral-600">
              Trailing block {i + 1}
            </p>
          ))}
        </div>
      </div>
    </ExampleBase>
  );
}
