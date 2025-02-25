import { useDocumentTitle, useToggle } from 'src';
import { ExampleBase } from '../example-base';
import Code from './use-document-title.code.mdx';

import { Kbd } from 'dev/components/kbd';
import { useMDXComponents } from 'solid-jsx';

export function UseDocumentTitleExample() {
  const [title, setTitle] = useDocumentTitle();
  const [_, cycle] = useToggle(['Home', 'About', 'Awesome']);

  // @ts-ignore
  const components: any = useMDXComponents();

  function _cycle() {
    cycle();
    setTitle(_() as any);
  }
  return (
    <ExampleBase
      title="useDocumentTitle"
      description="Sets the `document.title`. Hook is not called during server-side rendering. Only use this for client-only applications."
      code={<Code components={components} />}
    >
      <div class="flex h-full w-full flex-col items-center justify-center gap-x-1 rounded-md border p-3 py-10 text-center text-sm">
        <div class="flex flex-col items-center gap-y-7">
          <div class="flex items-center gap-x-2">
            <Kbd activated={title() === 'Home'}>Home</Kbd>
            <Kbd activated={title() === 'About'}>About</Kbd>
            <Kbd activated={title() === 'Awesome'}>Awesome</Kbd>
          </div>
          <button onClick={_cycle}>Toggle</button>
        </div>
      </div>
    </ExampleBase>
  );
}
