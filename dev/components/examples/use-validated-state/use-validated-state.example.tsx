import { useValidatedState } from 'src/use-validated-state';
import { ExampleBase } from '../example-base';
import Code from './use-validated-state.code.mdx';

export function UseValidatedStateExample() {
  const [{ value, lastValidValue, valid }, setEmail] = useValidatedState(
    '',
    val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
  );

  return (
    <ExampleBase
      title="useValidatedState"
      description="Tracks a value alongside validation state and the last valid value."
      code={<Code />}
    >
      <div class="flex h-full w-full flex-col items-center justify-center gap-3 rounded-md border p-3 py-10 text-center text-sm">
        <input
          class="w-full max-w-xs rounded-md border px-3 py-2 text-sm outline-none focus:border-blue-500"
          type="email"
          placeholder="email@example.com"
          value={value()}
          onInput={event => setEmail(event.currentTarget.value)}
        />

        <div class="space-y-1 text-center text-sm">
          <div>
            valid:{' '}
            <span class={valid() ? 'text-green-600' : 'text-red-600'}>{String(valid())}</span>
          </div>
          <div class="text-neutral-500">last valid: {lastValidValue() ?? '—'}</div>
          <div class="text-xs text-neutral-400">Try `carlo@.` (invalid) vs `carlo@a.com` (valid).</div>
        </div>
      </div>
    </ExampleBase>
  );
}
