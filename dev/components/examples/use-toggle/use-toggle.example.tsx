import { useToggle } from 'src';
import { ExampleBase } from '../example-base';
import Code from './use-toggle.code.mdx';

import { createMemo, FlowProps } from 'solid-js';
import { useMDXComponents } from 'solid-jsx';

export function UseToggleExample() {
  const [value, toggle] = useToggle(['apple', 'orange', 'grape', 'kiwi'] as const);

  // @ts-ignore
  const components: any = useMDXComponents();

  const color = createMemo(() => {
    if (value() === 'apple') return '#e5312f';
    if (value() === 'orange') return '#fc8627';
    if (value() === 'grape') return '#bc3d73';
    if (value() === 'kiwi') return '#acc144';

    return undefined;
  });

  return (
    <ExampleBase
      title="useToggle"
      description="A hook that toggles between two or multiple values (by implementing a common state pattern). Dev Note: Personally this can be called `useCycle` instead since it cycles through the options."
      code={<Code components={components} />}
    >
      <div
        class="flex h-full w-full flex-col items-center justify-center gap-3 rounded-md border p-3 py-10 text-center transition-colors"
        style={{
          'background-color': color(),
        }}
      >
        <div class="flex flex-wrap gap-3">
          <Key activated={value() === 'apple'}>🍎 apple</Key>
          <Key activated={value() === 'orange'}>🍊 orange</Key>
          <Key activated={value() === 'grape'}>🍇 grape</Key>
          <Key activated={value() === 'kiwi'}>🥝 kiwi </Key>
        </div>

        <button onClick={() => toggle()} class="text-white transition active:scale-95">
          Click me to Toggle
        </button>
      </div>
    </ExampleBase>
  );
}

function Key(props: FlowProps<{ activated: boolean }>) {
  return (
    <div class="relative text-xs">
      <div class="absolute inset-0 rounded-md bg-neutral-200 transition"></div>
      <div
        class="relative transform rounded-md border bg-neutral-50 px-2 py-1.5 transition-transform"
        style={{
          transform: props.activated ? 'translateY(0px)' : 'translateY(-5px)',
        }}
      >
        {props.children}
      </div>
    </div>
  );
}
