import { createMemo, createSignal } from 'solid-js';

/**
 * A hook that toggles between two or multiple values (by implementing a common state pattern).
 */
export function useToggle<T = boolean>(options: readonly T[] = [false, true] as any) {
  const [_options, _setOptions] = createSignal<typeof options>(options);

  function toggle() {
    const value = _options()[0]!;
    const index = Math.abs(_options()!.indexOf(value));

    _setOptions(
      _options()!
        .slice(index + 1)
        .concat(value),
    );
  }

  const currentOption = createMemo(() => _options()[0]);

  return [currentOption, toggle] as const;
}
