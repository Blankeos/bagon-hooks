import { useClipboard } from 'src';
import { ExampleBase } from '../example-base';
import Code from './use-clipboard.code.mdx';

import { IconCheck, IconCopy } from 'dev/icons';
import { Show } from 'solid-js';
import { useMDXComponents } from 'solid-jsx';

export function UseClipboardExample() {
  const { copied, copy, reset } = useClipboard();

  // @ts-ignore
  const components: any = useMDXComponents();

  return (
    <ExampleBase
      title="useClipboard"
      description="A hook that wraps copy-to-clipboard logic with a signal."
      code={<Code components={components} />}
    >
      <div class="flex h-full w-full flex-col items-center justify-center gap-3 rounded-md border p-3 py-10 text-center text-sm">
        <span class="text-center">Bagon is awesome!</span>
        <button class="transition active:scale-90" onClick={() => copy('Bagon is awesome!')}>
          <Show
            when={copied()}
            fallback={
              <div class="flex items-center gap-x-1">
                <IconCopy class="h-8 w-8" />
                Copy
              </div>
            }
            children={
              <div class="flex items-center gap-x-1 text-green-500">
                <IconCheck class="h-8 w-8" /> Copied!
              </div>
            }
          />
        </button>
      </div>
    </ExampleBase>
  );
}
