import { randomId, useHash } from 'src';
import { ExampleBase } from '../example-base';
import Code from './use-hash.code.mdx';

import { useMDXComponents } from 'solid-jsx';

export function UseHashExample() {
  const [hash, setHash] = useHash();

  // @ts-ignore
  const components: any = useMDXComponents();

  return (
    <ExampleBase
      title="useHash"
      description="A hook that allows you to get and set the hash value of the current URL like a signal."
      code={<Code components={components} />}
    >
      <div class="flex h-full w-full flex-col items-center justify-center gap-3 rounded-md border p-3 py-10 text-center">
        <button
          class="rounded-md border px-3 py-1.5 text-sm text-typography transition active:scale-95"
          onClick={() => setHash(randomId())}
        >
          Set hash
        </button>
        <span class="flex gap-x-1 text-sm">
          Current hash: <code class="rounded-md bg-neutral-300 px-1.5 py-0.5">{hash()}</code>
        </span>
      </div>
    </ExampleBase>
  );
}
