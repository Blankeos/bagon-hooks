import { useStateHistory } from 'src/use-state-history';
import { ExampleBase } from '../example-base';
import Code from './use-state-history.code.mdx';

export function UseStateHistoryExample() {
  const [value, handlers, history] = useStateHistory(0);

  return (
    <ExampleBase
      title="useStateHistory"
      description="Track state changes with undo / redo history."
      code={<Code />}
    >
      <div class="flex h-full w-full flex-col items-center justify-center gap-3 rounded-md border p-3 py-10 text-center text-sm">
        <div class="text-4xl font-bold">{value()}</div>

        <div class="text-xs text-neutral-500">
          history: {JSON.stringify(history())}
        </div>

        <div class="flex flex-wrap justify-center gap-2">
          <button
            class="rounded-md bg-primary px-3 py-1.5 text-white transition active:scale-95"
            onClick={() => handlers.set(value() + 1)}
          >
            Increment
          </button>
          <button
            class="rounded-md border px-2 py-1 text-sm transition active:scale-90"
            onClick={() => handlers.back()}
          >
            Back
          </button>
          <button
            class="rounded-md border px-2 py-1 text-sm transition active:scale-90"
            onClick={() => handlers.forward()}
          >
            Forward
          </button>
          <button
            class="rounded-md bg-gray-400 px-3 py-1.5 text-white transition active:scale-95"
            onClick={() => handlers.reset()}
          >
            Reset
          </button>
        </div>
      </div>
    </ExampleBase>
  );
}
