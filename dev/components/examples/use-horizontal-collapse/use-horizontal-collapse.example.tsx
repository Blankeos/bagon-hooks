import { createSignal } from 'solid-js';
import { useMDXComponents } from 'solid-jsx';
import { useHorizontalCollapse } from 'src';
import { ExampleBase } from '../example-base';
import Code from './use-horizontal-collapse.code.mdx';

export function UseHorizontalCollapseExample() {
  const [expanded, setExpanded] = createSignal(true);
  const { getCollapseProps, state } = useHorizontalCollapse({ expanded });
  const props = getCollapseProps();

  // @ts-ignore
  const components: any = useMDXComponents();

  return (
    <ExampleBase
      title="useHorizontalCollapse"
      description="Animate width for side panels and drawers."
      code={<Code components={components} />}
    >
      <div class="flex h-full w-full flex-col items-center justify-center gap-3 rounded-md border p-3 py-10 text-center">
        <button
          class="rounded-md bg-primary px-3 py-1.5 text-white transition active:scale-95"
          type="button"
          onClick={() => setExpanded(value => !value)}
        >
          {expanded() ? 'Collapse' : 'Expand'}
        </button>

        <div class="flex h-32 w-full max-w-md overflow-hidden rounded-md border">
          <div
            ref={props.ref}
            style={props.style()}
            aria-hidden={props['aria-hidden']()}
            onTransitionEnd={props.onTransitionEnd}
            class="overflow-hidden bg-sky-50"
          >
            <div class="w-40 p-3 text-left text-sm text-neutral-600">
              <p>Side panel</p>
              <p>State: {state()}</p>
            </div>
          </div>
          <div class="flex flex-1 items-center justify-center bg-neutral-50 text-sm">Main content</div>
        </div>
      </div>
    </ExampleBase>
  );
}
