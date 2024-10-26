import { IconCode } from 'dev/icons';
import { createSignal, FlowProps, JSX, Show } from 'solid-js';

type ExampleBaseProps = {
  title: JSX.Element;
  description: JSX.Element;
  class?: string;
  code?: JSX.Element;
};

export function ExampleBase(props: FlowProps<ExampleBaseProps>) {
  const [viewing, setViewing] = createSignal<'code' | 'result'>('result');

  return (
    <div class="flex h-full max-h-[500px] w-full flex-col items-start gap-y-3 overflow-hidden rounded-xl border bg-white p-5">
      <div class="flex w-full items-center justify-between">
        <h2 class="text-xl font-bold">{props.title}</h2>
        <button
          class={`flex h-8 w-8 items-center justify-center rounded-md border transition active:scale-95 ${viewing() === 'code' ? 'bg-background text-white' : ''}`}
          onClick={() => {
            setViewing(viewing() === 'code' ? 'result' : 'code');
          }}
        >
          <IconCode class="h-4 w-4" />
        </button>
      </div>

      <p class="text-sm text-opacity-70">{props.description}</p>

      <Show when={viewing() === 'result'}>
        <div class="w-full flex-1 rounded-md">{props.children}</div>
      </Show>

      <div
        style={{ display: viewing() === 'code' ? 'block' : 'none' }}
        class="w-full flex-1 overflow-auto rounded-md border bg-[#1c1e28] p-3 text-white"
      >
        {props.code}
      </div>
    </div>
  );
}
