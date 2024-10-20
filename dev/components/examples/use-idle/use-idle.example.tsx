import { useIdle, useOs } from 'src';
import { ExampleBase } from '../example-base';
import Code from './use-idle.code.mdx';

import { useMDXComponents } from 'solid-jsx';
import { Show } from 'solid-js';

export function UseIdleExample() {
  const idle = useIdle(1000);

  // @ts-ignore
  const components: any = useMDXComponents();

  return (
    <ExampleBase
      title="useIdle"
      description="Returns if user has been idle after some milliseconds"
      code={<Code components={components} />}
    >
      <div class="flex h-full w-full items-center justify-center gap-x-1 rounded-md border p-3 py-10 text-center">
        <span>Is Idle (1s):</span>
        <Show
          when={idle()}
          fallback={
            <span>
              <span class="text-green-500">false</span>
            </span>
          }
        >
          <span class="text-red-500">true</span>
        </Show>
      </div>
    </ExampleBase>
  );
}
