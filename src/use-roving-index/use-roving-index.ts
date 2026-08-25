import { Accessor, createEffect, onCleanup } from 'solid-js';

type MaybeAccessor<T> = T | Accessor<T>;

function access<T>(value: MaybeAccessor<T>): T {
  return typeof value === 'function' ? (value as Accessor<T>)() : value;
}

export type UseRovingIndexOptions = {
  /** Whether the roving index is active (default: `true`) */
  active?: MaybeAccessor<boolean>;
  /** Whether next/previous should wrap around (default: `true`) */
  loop?: MaybeAccessor<boolean>;
};

/**
 * Implements the [roving tabindex](https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/#kbd_roving_tabindex)
 * pattern for accessible keyboard navigation of a list of elements.
 *
 * @example
 * ```tsx
 * const [index, setIndex] = createSignal(0);
 * const { getElementProps, getElementRef } = useRovingIndex(index, setIndex, { total: 3 });
 *
 * <For each={[0, 1, 2]}>
 *   {(i) => <button ref={getElementRef(i)} {...getElementProps(i)}>Item {i}</button>}
 * </For>
 * ```
 */
export function useRovingIndex<T extends HTMLElement = HTMLElement>(
  /** Current active index (number or accessor) */
  getIndex: MaybeAccessor<number>,
  /** Setter invoked when navigation changes the index */
  setIndex: (index: number) => void,
  options: {
    /** Total number of items in the list */
    total: MaybeAccessor<number>;
  } & UseRovingIndexOptions,
) {
  // Plain array (mirrors React useRef) — mutating it must NOT trigger focus effects
  const elements: (T | null)[] = [];

  const current = () => access(getIndex);
  const total = () => access(options.total);
  const isActive = () => access(options.active ?? true);
  const shouldLoop = () => access(options.loop ?? true);

  // Focus the active element when index/active changes (not when refs attach)
  createEffect(() => {
    const idx = current();
    const active = isActive();
    // Touch total() so size changes are observed if needed later
    total();

    if (active && elements[idx] && document.activeElement !== elements[idx]) {
      elements[idx]?.focus();
    }
  });

  const next = () => {
    const idx = current();
    const size = total();
    if (shouldLoop()) {
      setIndex(idx === size - 1 ? 0 : idx + 1);
    } else {
      setIndex(Math.min(idx + 1, size - 1));
    }
  };

  const previous = () => {
    const idx = current();
    const size = total();
    if (shouldLoop()) {
      setIndex(idx === 0 ? size - 1 : idx - 1);
    } else {
      setIndex(Math.max(idx - 1, 0));
    }
  };

  const first = () => setIndex(0);
  const last = () => setIndex(total() - 1);

  /**
   * Props for the item at `index`. Uses getters so Solid JSX spreads stay reactive.
   */
  const getElementProps = (index: number) => ({
    get tabIndex() {
      return isActive() ? (current() === index ? 0 : -1) : undefined;
    },
    get 'data-active'() {
      return isActive() ? (current() === index ? true : undefined) : undefined;
    },
  });

  const getElementRef = (index: number) => (node: T | null | undefined) => {
    if (!node) {
      elements[index] = null;
      return;
    }
    elements[index] = node;
    // Clear slot when the element is disposed (Solid does not call refs with null)
    onCleanup(() => {
      if (elements[index] === node) {
        elements[index] = null;
      }
    });
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (!isActive()) {
      return;
    }

    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault();
      next();
    }

    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault();
      previous();
    }

    if (event.key === 'Home') {
      event.preventDefault();
      first();
    }

    if (event.key === 'End') {
      event.preventDefault();
      last();
    }
  };

  return {
    next,
    previous,
    first,
    last,
    getElementProps,
    getElementRef,
    onKeyDown,
  };
}
