import { useMDXComponents } from 'solid-jsx';
import { useSplitter } from 'src/use-splitter';
import { ExampleBase } from '../example-base';
import Code from './use-splitter.code.mdx';

export function UseSplitterExample() {
  const splitter = useSplitter({
    orientation: 'horizontal',
    panels: [
      { defaultSize: 40, min: 20 },
      { defaultSize: 60, min: 20 },
    ],
  });

  // @ts-ignore
  const components: any = useMDXComponents();

  const formatSize = (size: number | string) =>
    typeof size === 'number' ? `${Math.round(size)}%` : String(size);

  return (
    <ExampleBase
      title="useSplitter"
      description="Accessible split views with keyboard and pointer resizing."
      code={<Code components={components} />}
    >
      <div class="flex h-full w-full items-center justify-center rounded-md border p-3 py-10">
        <div ref={splitter.ref} class="flex h-48 w-full overflow-hidden rounded-md border">
          <div
            class="flex items-center justify-center overflow-hidden bg-sky-50 text-sm"
            style={{ width: formatSize(splitter.sizes()[0]!) }}
          >
            Primary ({formatSize(splitter.sizes()[0]!)})
          </div>
          <div
            class="w-1 shrink-0 cursor-col-resize bg-neutral-300 transition hover:bg-blue-400"
            {...splitter.getHandleProps({ index: 0 })}
          />
          <div class="flex flex-1 items-center justify-center overflow-hidden bg-pink-50 text-sm">
            Secondary
          </div>
        </div>
      </div>
    </ExampleBase>
  );
}
