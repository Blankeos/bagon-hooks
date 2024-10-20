import { useFavicon } from 'src';
import { ExampleBase } from '../example-base';
import Code from './use-favicon.code.mdx';

import { IconSolidJS, IconX } from 'dev/icons';
import { createSignal } from 'solid-js';
import { useMDXComponents } from 'solid-jsx';

export function UseFaviconExample() {
  const [currentIcon, setCurrentIcon] = createSignal<'solid' | 'x' | undefined>(); // Not relevant, just for visuals

  // OLD Implementation:
  // const [favicon, setFavicon] = createSignal('https://docs.solidjs.com/favicon.svg');

  // IMPROVED Implementation:
  const [_favicon, setFavicon] = useFavicon();

  const setXFavicon = () => {
    setCurrentIcon('x');
    setFavicon('https://x.com/favicon.ico');
  };
  const setSolidFavicon = () => {
    setCurrentIcon('solid');
    setFavicon('https://docs.solidjs.com/favicon.svg');
  };

  // @ts-ignore
  const components: any = useMDXComponents();

  return (
    <ExampleBase
      title="useFavicon"
      description="Appends <link /> element to head component with given favicon url. The hook is not called during server side rendering."
      code={<Code components={components} />}
    >
      <div class="relative flex h-full w-full flex-col items-center justify-center gap-3 overflow-hidden rounded-md border p-3 py-10 text-center text-sm">
        <IconSolidJS
          class="absolute -bottom-10 -right-10 h-48 w-48 rotate-45 transition"
          style={{ opacity: currentIcon() === 'solid' ? 1 : 0 }}
        />
        <IconX
          class="absolute -bottom-10 -right-10 h-48 w-48 rotate-45 transition"
          style={{ opacity: currentIcon() === 'x' ? 1 : 0 }}
        />

        <button
          onClick={() => {
            setXFavicon();
          }}
          class="relative rounded-md border bg-white px-2 py-1.5 transition active:scale-95"
        >
          X favicon
        </button>

        <button
          onClick={() => {
            setSolidFavicon();
          }}
          class="relative rounded-md border bg-white px-2 py-1.5 transition active:scale-95"
        >
          Solid favicon
        </button>
      </div>
    </ExampleBase>
  );
}
