import { useFavicon } from 'src';
import { ExampleBase } from '../example-base';
import Code from './use-favicon.code.mdx';

import { createSignal } from 'solid-js';
import { useMDXComponents } from 'solid-jsx';

export function UseFaviconExample() {
  const [favicon, setFavicon] = createSignal('https://docs.solidjs.com/favicon.svg');
  const setXFavicon = () => setFavicon('https://x.com/favicon.ico');
  const setSolidFavicon = () => setFavicon('https://docs.solidjs.com/favicon.svg');

  useFavicon(favicon);

  // @ts-ignore
  const components: any = useMDXComponents();

  return (
    <ExampleBase
      title="useFavicon"
      description="Appends <link /> element to head component with given favicon url. The hook is not called during server side rendering."
      code={<Code components={components} />}
    >
      <div class="flex h-full w-full flex-col items-center justify-center gap-3 rounded-md border p-3 py-10 text-center text-sm">
        <button
          onClick={() => setXFavicon()}
          class="rounded-md border px-2 py-1.5 transition active:scale-95"
        >
          X favicon
        </button>

        <button
          onClick={() => setSolidFavicon()}
          class="rounded-md border px-2 py-1.5 transition active:scale-95"
        >
          Solid favicon
        </button>
      </div>
    </ExampleBase>
  );
}
