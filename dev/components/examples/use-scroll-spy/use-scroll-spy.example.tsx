import { createSignal, For } from 'solid-js';
import { useMDXComponents } from 'solid-jsx';
import { useScrollSpy } from 'src';
import { ExampleBase } from '../example-base';
import Code from './use-scroll-spy.code.mdx';

export function UseScrollSpyExample() {
  // @ts-ignore
  const components: any = useMDXComponents();
  const [scrollRef, setScrollRef] = createSignal<HTMLDivElement | null>(null);

  const spy = useScrollSpy({
    selector: '.spy-demo h2',
    scrollHost: () => scrollRef(),
    offset: 8,
  });

  return (
    <ExampleBase
      title="useScrollSpy"
      description="Highlights the active heading inside a local scroll container (last heading with top <= offset)."
      code={<Code components={components} />}
    >
      <div class="flex h-64 w-full overflow-hidden rounded-md border text-left text-sm">
        <nav class="w-36 shrink-0 space-y-1 overflow-y-auto border-r bg-neutral-50 p-2">
          <For each={spy.data()}>
            {(heading, index) => (
              <button
                type="button"
                class="block w-full rounded px-2 py-1 text-left text-xs transition"
                classList={{
                  'bg-primary text-white': spy.active() === index(),
                  'hover:bg-neutral-200': spy.active() !== index(),
                }}
                onClick={() => spy.scrollTo(index())}
              >
                {heading.value}
              </button>
            )}
          </For>
        </nav>

        <div ref={setScrollRef} class="spy-demo h-full flex-1 space-y-6 overflow-y-auto p-4">
          <section>
            <h2 id="spy-intro" class="mb-2 text-base font-semibold">
              Introduction
            </h2>
            <p class="text-neutral-600">
              Scroll this pane. The nav on the left tracks the last heading whose top is at or above
              the offset inside this container — not the whole page.
            </p>
          </section>
          <section>
            <h2 id="spy-setup" class="mb-2 text-base font-semibold">
              Setup
            </h2>
            <p class="text-neutral-600">
              Pass a local `scrollHost` and scope the selector to headings inside `.spy-demo`.
              Nav clicks use `spy.scrollTo(index)` so only the host scrolls.
            </p>
          </section>
          <section>
            <h2 id="spy-usage" class="mb-2 text-base font-semibold">
              Usage
            </h2>
            <p class="text-neutral-600">
              Active detection uses relative tops against the host bounding rect, so nested scroll
              containers work the same as window scrollspies.
            </p>
          </section>
          <section>
            <h2 id="spy-notes" class="mb-2 text-base font-semibold">
              Notes
            </h2>
            <p class="text-neutral-600">
              Keep enough content height so each section can reach the top of the scroll host. The
              offset here is 8px.
            </p>
            <p class="mt-4 text-neutral-600">
              Extra space below helps the last heading become active when scrolled into place.
            </p>
            <div class="h-40" />
          </section>
        </div>
      </div>
    </ExampleBase>
  );
}
