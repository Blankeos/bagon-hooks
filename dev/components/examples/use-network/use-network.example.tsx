import { useIdle, useNetwork, useOs } from 'src';
import { ExampleBase } from '../example-base';
import Code from './use-network.code.mdx';

import { useMDXComponents } from 'solid-jsx';

export function UseNetworkExample() {
  const networkStatus = useNetwork();

  // @ts-ignore
  const components: any = useMDXComponents();

  return (
    <ExampleBase
      title="useNetwork"
      description="Returns information about current user's network connection. Try going offline on DevTools."
      code={<Code components={components} />}
    >
      <div class="flex h-full w-full items-center justify-center gap-x-1 rounded-md border p-3 py-10 text-start">
        <pre
          class={`rounded-md border p-3 px-5 ${networkStatus().online ? 'bg-neutral-100' : 'border-red-500 bg-red-200'}`}
        >
          {JSON.stringify(networkStatus(), null, 2)}
        </pre>
      </div>
    </ExampleBase>
  );
}
