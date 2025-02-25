import { useMediaQuery } from 'src';
import { ExampleBase } from '../example-base';
import Code from './use-media-query.code.mdx';

import { Match, Switch } from 'solid-js';
import { useMDXComponents } from 'solid-jsx';

export function UseMediaQueryExample() {
  const sm = useMediaQuery(() => '(min-width: 640px)');
  const md = useMediaQuery(() => '(min-width: 768px)');
  const lg = useMediaQuery(() => '(min-width: 1024px)');
  const xl = useMediaQuery(() => '(min-width: 1280px)');
  const xxl = useMediaQuery(() => '(min-width: 1536px)');

  // @ts-ignore
  const components: any = useMDXComponents();

  return (
    <ExampleBase
      title="useMediaQuery"
      description="Returns a signal that tracks the current state of a media query. Try resizing the window."
      code={<Code components={components} />}
    >
      <div class="flex h-full w-full flex-col items-center justify-center gap-x-1 rounded-md border p-3 py-10 text-center text-sm">
        <Switch fallback="No match">
          <Match when={xxl()}>2xl: (min-width: 1536px)</Match>
          <Match when={xl()}>xl: (min-width: 1280px)</Match>
          <Match when={lg()}>lg: (min-width: 1024px)</Match>
          <Match when={md()}>md: (min-width: 768px)</Match>
          <Match when={sm()}>sm: (min-width: 640px)</Match>
        </Switch>
      </div>
    </ExampleBase>
  );
}
