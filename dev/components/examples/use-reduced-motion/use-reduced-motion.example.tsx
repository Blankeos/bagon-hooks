import { useReducedMotion } from 'src';
import { ExampleBase } from '../example-base';
import Code from './use-reduced-motion.code.mdx';

import { useMDXComponents } from 'solid-jsx';

export function UseReducedMotionExample() {
  const reducedMotion = useReducedMotion();

  // @ts-ignore
  const components: any = useMDXComponents();

  return (
    <ExampleBase
      title="useReducedMotion"
      description="Returns true if the user prefers reduced motion."
      code={<Code components={components} />}
    >
      <div class="flex h-full w-full items-center justify-center gap-x-1 rounded-md border p-3 py-10 text-center text-sm">
        <div class="rounded-md border px-4 py-2 text-sm">
          Prefers reduced motion: <strong>{String(reducedMotion())}</strong>
        </div>
      </div>
    </ExampleBase>
  );
}
