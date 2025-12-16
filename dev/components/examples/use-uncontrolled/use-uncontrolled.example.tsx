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
      <div class="flex w-full flex-col items-center justify-center gap-5 gap-x-1 rounded-md border p-3 text-center">
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
    <div class="flex flex-col gap-3">
      <h3 class="text-lg font-semibold">Controlled Mode</h3>
      <pre class="rounded bg-neutral-200 p-1 text-start text-xs">
        {JSON.stringify({ parent_value: value() }, null, 2)}
      </pre>

      <div class="flex gap-1">
        <CustomInput
          value={value()}
          onChange={setValue}
          class="rounded-md border p-2"
          placeholder="Type something..."
        />
        <input
          class="h-[42px] rounded-md border p-2"
          value={value()}
          onInput={e => setValue(e.currentTarget.value)}
        />
      </div>
    </div>
  );
}

function UncontrolledUsage() {
  return (
    <div class="flex flex-col gap-3">
      <h3 class="text-lg font-semibold">Uncontrolled Mode</h3>
      <CustomInput class="rounded-md border p-2" placeholder="Type something..." />
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
    <div class="flex flex-col gap-2">
      <input
        type="text"
        value={value() ?? ''}
        onInput={event => handleChange(event.currentTarget.value)}
        class={props.class}
        placeholder={props.placeholder}
      />

      <pre class="rounded bg-neutral-200 p-1 text-start text-xs">
        {JSON.stringify({ value: value(), isControlled: isControlled }, null, 2)}
      </pre>
    </div>
  );
}
