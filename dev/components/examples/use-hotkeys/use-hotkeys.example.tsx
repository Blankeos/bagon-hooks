import { useHotkeys, useOs } from 'src';
import { ExampleBase } from '../example-base';
import Code from './use-hotkeys.code.mdx';

import { useMDXComponents } from 'solid-jsx';
import { createSignal, FlowProps, VoidProps } from 'solid-js';

export function UseHotkeysExample() {
  const [activatedHotkey, setActivatedHotkey] = createSignal<-1 | 0 | 1 | 2>(-1);

  let timeout: ReturnType<typeof window.setTimeout>;

  function handleKeyPress(index: ReturnType<typeof activatedHotkey>) {
    if (timeout) clearTimeout(timeout);

    setActivatedHotkey(index);

    timeout = setTimeout(() => {
      setActivatedHotkey(-1);
    }, 400);
  }

  useHotkeys([
    ['mod+a', () => handleKeyPress(0)],
    ['mod+Enter', () => handleKeyPress(1)],
    ['shift+g', () => handleKeyPress(2)],
  ]);

  const os = useOs();

  // @ts-ignore
  const components: any = useMDXComponents();

  return (
    <ExampleBase
      title="useHotkeys"
      description="Handle hotkeys easily"
      code={<Code components={components} />}
    >
      <div class="flex h-full w-full flex-wrap items-center justify-center gap-3 rounded-md border p-3 py-10 text-center">
        <Key activated={activatedHotkey() === 0}>{os() === 'macos' ? 'cmd' : 'ctrl'} + a</Key>
        <Key activated={activatedHotkey() === 1}>{os() === 'macos' ? 'cmd' : 'ctrl'} + Enter</Key>
        <Key activated={activatedHotkey() === 2}>shift + g</Key>
      </div>
    </ExampleBase>
  );
}

function Key(props: FlowProps<{ activated: boolean }>) {
  return (
    <div class="relative text-xs">
      <div class="absolute inset-0 rounded-md bg-neutral-200 transition"></div>
      <div
        class="relative rounded-md border bg-neutral-50 px-2 py-1.5"
        style={{
          translate: props.activated ? '0px 0px' : '0px -5px',
        }}
      >
        {props.children}
      </div>
    </div>
  );
}
