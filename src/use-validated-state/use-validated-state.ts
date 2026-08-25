import { type Accessor, createSignal } from 'solid-js';

export interface UseValidatedStateValue<T> {
  value: Accessor<T>;
  lastValidValue: Accessor<T | undefined>;
  valid: Accessor<boolean>;
}

export type UseValidatedStateReturnValue<T> = [
  UseValidatedStateValue<T>,
  (val: T) => void,
];

/**
 * Tracks a value alongside validation state and the last valid value.
 *
 * @param initialValue - Starting value.
 * @param validate - Predicate that determines whether a value is valid.
 */
export function useValidatedState<T>(
  initialValue: T,
  validate: (value: T) => boolean,
): UseValidatedStateReturnValue<T> {
  const [value, setValue] = createSignal(initialValue);
  const [lastValidValue, setLastValidValue] = createSignal(
    validate(initialValue) ? initialValue : undefined,
  );
  const [valid, setValid] = createSignal(validate(initialValue));

  const onChange = (val: T) => {
    if (validate(val)) {
      setLastValidValue(() => val);
      setValid(true);
    } else {
      setValid(false);
    }

    setValue(() => val);
  };

  return [{ value, lastValidValue, valid }, onChange];
}
