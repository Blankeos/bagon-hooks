import { FlowProps } from 'solid-js';

export function Kbd(props: FlowProps<{ activated: boolean }>) {
  return (
    <div class="relative text-xs">
      <div class="absolute inset-0 rounded-md bg-neutral-200 transition"></div>
      <div
        class="relative transform rounded-md border bg-neutral-50 px-2 py-1.5 transition-transform"
        style={{
          transform: props.activated ? 'translateY(0px)' : 'translateY(-5px)',
        }}
      >
        {props.children}
      </div>
    </div>
  );
}
