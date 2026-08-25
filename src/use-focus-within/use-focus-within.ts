import { Accessor, createSignal, onCleanup } from 'solid-js';

function containsRelatedTarget(event: FocusEvent) {
  if (event.currentTarget instanceof HTMLElement && event.relatedTarget instanceof HTMLElement) {
    return event.currentTarget.contains(event.relatedTarget);
  }

  return false;
}

export interface UseFocusWithinOptions {
  onFocus?: (event: FocusEvent) => void;
  onBlur?: (event: FocusEvent) => void;
}

export interface UseFocusWithinReturnValue<T extends HTMLElement = any> {
  /** Solid ref callback — pass to `ref={ref}` */
  ref: (el: T | null) => void;
  /** Whether focus is currently within the element */
  focused: Accessor<boolean>;
}

/**
 * Detects if any element within the bound container has focus.
 * Returns a Solid ref callback and a `focused` accessor.
 */
export function useFocusWithin<T extends HTMLElement = any>(
  options: UseFocusWithinOptions = {},
): UseFocusWithinReturnValue<T> {
  const [focused, setFocused] = createSignal(false);
  let focusedFlag = false;
  let previousNode: T | null = null;

  const handleFocusIn = (event: FocusEvent) => {
    if (!focusedFlag) {
      setFocused(true);
      focusedFlag = true;
      options.onFocus?.(event);
    }
  };

  const handleFocusOut = (event: FocusEvent) => {
    if (focusedFlag && !containsRelatedTarget(event)) {
      setFocused(false);
      focusedFlag = false;
      options.onBlur?.(event);
    }
  };

  const detach = () => {
    if (previousNode) {
      previousNode.removeEventListener('focusin', handleFocusIn);
      previousNode.removeEventListener('focusout', handleFocusOut);
      previousNode = null;
    }
  };

  onCleanup(detach);

  const ref = (node: T | null) => {
    if (!node) {
      detach();
      return;
    }

    detach();
    node.addEventListener('focusin', handleFocusIn);
    node.addEventListener('focusout', handleFocusOut);
    previousNode = node;
  };

  return { ref, focused };
}

export namespace useFocusWithin {
  export type Options = UseFocusWithinOptions;
  export type ReturnValue<T extends HTMLElement = any> = UseFocusWithinReturnValue<T>;
}
