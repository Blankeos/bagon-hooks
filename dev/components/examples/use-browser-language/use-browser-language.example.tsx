import { useBrowserLanguage } from 'src';
import { ExampleBase } from '../example-base';
import Code from './use-browser-language.code.mdx';

import { useMDXComponents } from 'solid-jsx';

export function UseBrowserLanguageExample() {
  const language = useBrowserLanguage();

  // @ts-ignore
  const components: any = useMDXComponents();

  return (
    <ExampleBase
      title="useBrowserLanguage"
      description="Returns the browser language and updates when the user changes it."
      code={<Code components={components} />}
    >
      <div class="flex h-full w-full items-center justify-center gap-x-1 rounded-md border p-3 py-10 text-center text-sm">
        Your browser language: <code class="rounded-md border px-1">{language() ?? 'unknown'}</code>
      </div>
    </ExampleBase>
  );
}
