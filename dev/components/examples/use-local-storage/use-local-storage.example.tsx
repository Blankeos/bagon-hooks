import { useLocalStorage } from 'src';
import { ExampleBase } from '../example-base';
import Code from './use-local-storage.code.mdx';

import { FlowProps } from 'solid-js';
import { useMDXComponents } from 'solid-jsx';

export function UseLocalStorageExample() {
  const [value, setValue] = useLocalStorage({
    key: 'favorite-fruit',
    defaultValue: 'apple',
  });

  // @ts-ignore
  const components: any = useMDXComponents();

  return (
    <ExampleBase
      title="useLocalStorage"
      description="A hook that allows using value from the localStorage as a signal The hook works the same way as createSignal, but also writes the value to the localStorage."
      code={<Code components={components} />}
    >
      <div class="flex h-full w-full flex-col items-center justify-center gap-3 rounded-md border p-3 py-10 text-center transition-colors">
        <div class="flex flex-wrap gap-3">
          <Key activated={value() === 'apple'} onClick={() => setValue('apple')}>
            🍎 apple
          </Key>
          <Key activated={value() === 'orange'} onClick={() => setValue('orange')}>
            🍊 orange
          </Key>
          <Key activated={value() === 'grape'} onClick={() => setValue('grape')}>
            🍇 grape
          </Key>
          <Key activated={value() === 'kiwi'} onClick={() => setValue('kiwi')}>
            🥝 kiwi{' '}
          </Key>
        </div>

        <span class="text-neutral-500">Favorite Fruit: {value()}</span>
      </div>
    </ExampleBase>
  );
}

function Key(props: FlowProps<{ activated: boolean; onClick: () => void }>) {
  return (
    <button onClick={props.onClick} class="relative text-xs">
      <div class="absolute inset-0 rounded-md bg-neutral-200 transition"></div>
      <div
        class="relative transform rounded-md border bg-neutral-50 px-2 py-1.5 transition-transform"
        style={{
          transform: props.activated ? 'translateY(0px)' : 'translateY(-5px)',
        }}
      >
        {props.children}
      </div>
    </button>
  );
}
