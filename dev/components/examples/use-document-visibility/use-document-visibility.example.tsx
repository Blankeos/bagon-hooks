import { useDocumentVisibility } from 'src';
import { ExampleBase } from '../example-base';
import Code from './use-document-visibility.code.mdx';

import { useMDXComponents } from 'solid-jsx';

export function UseDocumentVisibilityExample() {
  const visible = useDocumentVisibility();

  // @ts-ignore
  const components: any = useMDXComponents();

  return (
    <ExampleBase
      title="useDocumentVisibility"
      description="Returns the document.visibilityState - it allows detecting if the current tab is active."
      code={<Code components={components} />}
    >
      <div class="flex h-full w-full items-center justify-center gap-x-1 rounded-md border p-3 py-10 text-center text-sm">
        <div class="flex items-center gap-x-1">
          <div class="h-2 w-2 rounded-full" />
          Tab is currently {visible()}
        </div>
      </div>
    </ExampleBase>
  );
}
