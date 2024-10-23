import { useKeyboard } from 'src';
import { ExampleBase } from '../example-base';
import Code from './use-keyboard.code.mdx';

import { Kbd } from 'dev/components/kbd';
import { createStore } from 'solid-js/store';
import { useMDXComponents } from 'solid-jsx';

export function UseKeyboardExample() {
  const [store, setStore] = createStore({ a: false, b: false, c: false, d: false });

  useKeyboard({
    onKeyDown(event) {
      // Refactor this into if statements.
      if (event.key === 'a') {
        setStore('a', true);
      } else if (event.key === 'b') {
        setStore('b', true);
      } else if (event.key === 'c') {
        setStore('c', true);
      } else if (event.key === 'd') {
        setStore('d', true);
      }
    },
    onKeyUp(event) {
      // Refactor this into if statements.
      if (event.key === 'a') {
        setStore('a', false);
      } else if (event.key === 'b') {
        setStore('b', false);
      } else if (event.key === 'c') {
        setStore('c', false);
      } else if (event.key === 'd') {
        setStore('d', false);
      }
    },
  });

  // @ts-ignore
  const components: any = useMDXComponents();

  return (
    <ExampleBase
      title="useKeyboard"
      description="Use this for more general keyboard events, as opposed to useHotkeys."
      code={<Code components={components} />}
    >
      <div class="flex h-full w-full items-center justify-center gap-x-1 rounded-md border p-3 py-10 text-center">
        <Kbd activated={store.a}>a</Kbd>
        <Kbd activated={store.b}>b</Kbd>
        <Kbd activated={store.c}>c</Kbd>
        <Kbd activated={store.d}>d</Kbd>
      </div>
    </ExampleBase>
  );
}
