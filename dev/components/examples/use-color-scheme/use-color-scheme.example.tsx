import { useColorScheme } from 'src';
import { ExampleBase } from '../example-base';
import Code from './use-color-scheme.code.mdx';

import { useMDXComponents } from 'solid-jsx';

export function UseColorSchemeExample() {
  const colorScheme = useColorScheme();

  // @ts-ignore
  const components: any = useMDXComponents();

  return (
    <ExampleBase
      title="useColorScheme"
      description="A hook that returns system color scheme value i.e. either `dark` or `light`."
      code={<Code components={components} />}
    >
      <div class="flex h-full w-full items-center justify-center gap-x-1 rounded-md border p-3 py-10 text-center text-sm">
        <div
          class="rounded-md border px-4 py-2 text-sm"
          style={{
            background: colorScheme() === 'dark' ? '#000' : '#fff',
            color: colorScheme() ? '#fff' : '#000',
          }}
        >
          Your system color scheme is: {colorScheme()}
        </div>
      </div>
    </ExampleBase>
  );
}
