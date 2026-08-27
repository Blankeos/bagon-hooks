import { useUncontrolled } from 'src';
import { ExampleBase } from '../example-base';
import Code from './use-uncontrolled.code.mdx';

import { createSignal, Show } from 'solid-js';
import { useMDXComponents } from 'solid-jsx';

export function UseUncontrolledExample() {
  const [isControlled, setIsControlled] = createSignal<boolean>(false);

  // @ts-ignore
  const components: any = useMDXComponents();

  return (
    <ExampleBase
      title="useUncontrolled"
      description={
        <>
          Manages state of both controlled and uncontrolled components. Useful for component
          libraries that need to support both controlled and uncontrolled usage patterns.
          <br /> <br />
          Note that both are still "controlled" in the browser-sense. They just differ in terms of
          parent-controlled or internally-controlled.
          <br /> <br />
          Try toggling between controlled and uncontrolled modes using the checkbox below.
        </>
      }
      code={<Code components={components} />}
    >
      <div class="flex w-full flex-col items-stretch gap-3 rounded-md border p-3 text-left">
        <label class="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={isControlled()}
            onChange={e => {
              setIsControlled(e.currentTarget.checked);
            }}
          />
          Show Controlled
        </label>

        <Show
          when={isControlled()}
          fallback={<UncontrolledUsage />}
          children={<ControlledUsage />}
        />
      </div>
    </ExampleBase>
  );
}

function ControlledUsage() {
  const [value, setValue] = createSignal<string>('controlled text');

  return (
    <div class="flex min-w-0 flex-col gap-2">
      <h3 class="text-sm font-semibold">Controlled Mode</h3>
      <pre class="overflow-x-auto rounded bg-neutral-200 p-1 text-xs">
        {JSON.stringify({ parent_value: value() }, null, 2)}
      </pre>

      <div class="flex min-w-0 flex-col gap-2 sm:flex-row">
        <CustomInput
          value={value()}
          onChange={setValue}
          class="w-full min-w-0 rounded-md border p-2"
          placeholder="Type something..."
        />
        <input
          class="h-[42px] w-full min-w-0 shrink rounded-md border p-2 sm:w-1/2"
          value={value()}
          onInput={e => setValue(e.currentTarget.value)}
        />
      </div>
    </div>
  );
}

function UncontrolledUsage() {
  return (
    <div class="flex min-w-0 flex-col gap-2">
      <h3 class="text-sm font-semibold">Uncontrolled Mode</h3>
      <CustomInput class="w-full min-w-0 rounded-md border p-2" placeholder="Type something..." />
    </div>
  );
}

function CustomInput(props: {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  class?: string;
  placeholder?: string;
}) {
  const [value, handleChange, isControlled] = useUncontrolled<string>({
    value: () => props.value,
    defaultValue: props.defaultValue,
    finalValue: '',
    onChange: props.onChange,
  });

  return (
    <div class="flex min-w-0 flex-1 flex-col gap-2">
      <input
        type="text"
        value={value() ?? ''}
        onInput={event => handleChange(event.currentTarget.value)}
        class={props.class}
        placeholder={props.placeholder}
      />

      <pre class="overflow-x-auto rounded bg-neutral-200 p-1 text-xs">
        {JSON.stringify({ value: value(), isControlled: isControlled }, null, 2)}
      </pre>
    </div>
  );
}
