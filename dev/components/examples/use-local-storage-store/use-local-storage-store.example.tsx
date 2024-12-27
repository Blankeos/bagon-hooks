import { useLocalStorageStore } from 'src';
import { ExampleBase } from '../example-base';
import Code from './use-local-storage-store.code.mdx';

import { IconClose } from 'dev/icons';
import { For } from 'solid-js';
import { produce } from 'solid-js/store';
import { useMDXComponents } from 'solid-jsx';

export function UseLocalStorageStoreExample() {
  const [value, setValue] = useLocalStorageStore<{ id: string; name: string }[]>({
    key: 'todos-store',
    defaultValue: [],
  });

  // @ts-ignore
  const components: any = useMDXComponents();

  return (
    <ExampleBase
      title="useLocalStorageStore"
      description={
        <>
          (Improvement) A hook that allows using value from the localStorage as a store. The hook
          works exactly the same way as createStore, but also writes the value to the localStorage.
          It even works between tabs!
          <br />
          <br />
          To test, try changing the value with two tabs open.
        </>
      }
      code={<Code components={components} />}
    >
      <div class="flex h-full w-full flex-col items-center justify-center gap-3 rounded-md border p-3 py-10 text-center transition-colors">
        <For each={value}>
          {(todo, index) => (
            <div class="flex flex-wrap items-center gap-1 text-sm">
              <input
                class="rounded-md border p-1"
                value={todo.name}
                onInput={event => {
                  setValue(
                    produce(_value => {
                      if (!_value[index()]) return;
                      _value[index()]!.name = event.target.value ?? '';
                    }),
                  );
                }}
              />
              <button
                onClick={() => {
                  setValue(
                    produce(_value => {
                      _value.splice(index(), 1);
                    }),
                  );
                }}
              >
                <IconClose width={18} height={18} />
              </button>
            </div>
          )}
        </For>

        <button
          class={`rounded-md bg-primary px-3 py-1.5 text-white transition active:scale-95`}
          onClick={() => {
            setValue(
              produce(_value => {
                _value.push({ id: Math.random().toString(), name: 'New Todo' });
              }),
            );
          }}
        >
          New Todo
        </button>
      </div>
    </ExampleBase>
  );
}
