import { createSignal, JSX } from 'solid-js';

export function getInputOnChange<T>(
  setValue: (value: null | undefined | T | ((current: T) => T)) => void,
) {
  return (
    val: null | undefined | T | Parameters<JSX.EventHandler<any, Event>>[0] | ((current: T) => T),
  ) => {
    if (!val) {
      setValue(val as T);
    } else if (typeof val === 'function') {
      setValue(val);
    } else if (typeof val === 'object' && 'currentTarget' in val) {
      const { currentTarget } = val;

      if (currentTarget.type === 'checkbox') {
        setValue((currentTarget as any).checked as any);
      } else {
        setValue(currentTarget.value as any);
      }
    } else {
      setValue(val);
    }
  };
}

export function useInputState<T>(initialState: T) {
  const [value, setValue] = createSignal<T>(initialState);

  const handleInputChange = getInputOnChange<T>(setValue as any);

  return [value, handleInputChange] as const;
}
