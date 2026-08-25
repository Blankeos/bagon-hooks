import { useMDXComponents } from 'solid-jsx';
import { useHeadroom } from 'src/use-headroom';
import { ExampleBase } from '../example-base';
import Code from './use-headroom.code.mdx';

export function UseHeadroomExample() {
  const { pinned, scrollProgress } = useHeadroom({
    fixedAt: 40,
    scrollDistance: 80,
  });

  // @ts-ignore
  const components: any = useMDXComponents();

  return (
    <ExampleBase
      title="useHeadroom"
      description="Create sticky headers that hide on scroll down and reappear on scroll up. Uses window scroll — scroll the page to see it update."
      code={<Code components={components} />}
    >
      <div class="flex h-full w-full flex-col items-center justify-center gap-3 rounded-md border p-3 py-10 text-center text-sm">
        <div class="w-full overflow-hidden rounded-md border">
          <div
            class="flex h-12 items-center justify-between bg-neutral-50 px-3 transition-transform duration-200"
            style={{ transform: `translateY(${(scrollProgress() - 1) * 100}%)` }}
          >
            <span class="font-medium">Header</span>
            <span class="text-neutral-500">
              pinned={String(pinned())} · {Math.round(scrollProgress() * 100)}%
            </span>
          </div>
          <div class="space-y-2 p-3 text-left text-xs text-neutral-600">
            <p>Scroll the <strong>page</strong> (not this panel) to pin / unpin the header.</p>
            <p>pinned: {String(pinned())}</p>
            <p>scrollProgress: {Math.round(scrollProgress() * 100)}%</p>
          </div>
        </div>
      </div>
    </ExampleBase>
  );
}
