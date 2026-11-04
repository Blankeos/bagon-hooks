import { Accessor, createEffect, createSignal } from 'solid-js';

type MaybeAccessor<T> = T | Accessor<T>;

function access<T>(value: MaybeAccessor<T>): T {
  return typeof value === 'function' ? (value as Accessor<T>)() : value;
}

export interface UseRovingIndexInput {
  /** Total number of items in the group (number or accessor) */
  total: MaybeAccessor<number>;

  /** Which arrow keys navigate, `'horizontal'` by default */
  orientation?: 'horizontal' | 'vertical' | 'both';

  /** Whether navigation wraps at boundaries, `true` by default */
  loop?: boolean;

  /** Text direction, `'ltr'` by default */
  dir?: 'rtl' | 'ltr';

  /** Whether to click element when it receives focus via keyboard, `false` by default */
  activateOnFocus?: boolean;

  /** Number of columns for grid (2D) navigation. When set, enables grid mode */
  columns?: number;

  /** Controlled focused index (number or accessor) */
  focusedIndex?: MaybeAccessor<number | undefined>;

  /** Initial focused index for uncontrolled mode, first non-disabled item by default */
  initialIndex?: number;

  /** Called when focused index changes */
  onFocusChange?: (index: number) => void;

  /** Function to check if item at given index is disabled, `() => false` by default */
  isItemDisabled?: (index: number) => boolean;
}

export interface UseRovingIndexGetItemPropsInput {
  /** Index of the item in the group */
  index: number;

  /** Called when item is clicked */
  onClick?: (event: MouseEvent) => void;

  /** Called when keydown event fires on item */
  onKeyDown?: (event: KeyboardEvent) => void;
}

export interface UseRovingIndexReturnValue {
  /**
   * Get props to spread on each navigable item.
   * `tabIndex` is a getter so Solid JSX spreads stay reactive.
   */
  getItemProps: (options: UseRovingIndexGetItemPropsInput) => {
    readonly tabIndex: 0 | -1;
    onKeyDown: (event: KeyboardEvent) => void;
    onClick: (event: MouseEvent) => void;
    ref: (node: HTMLElement | null) => void;
  };

  /** Currently focused index */
  focusedIndex: Accessor<number>;

  /** Programmatically set focused index */
  setFocusedIndex: (index: number) => void;
}

function findNextEnabled(
  current: number,
  total: number,
  isItemDisabled: (index: number) => boolean,
  loop: boolean,
): number {
  for (let i = current + 1; i < total; i += 1) {
    if (!isItemDisabled(i)) {
      return i;
    }
  }

  if (loop) {
    for (let i = 0; i < current; i += 1) {
      if (!isItemDisabled(i)) {
        return i;
      }
    }
  }

  return current;
}

function findPreviousEnabled(
  current: number,
  total: number,
  isItemDisabled: (index: number) => boolean,
  loop: boolean,
): number {
  for (let i = current - 1; i >= 0; i -= 1) {
    if (!isItemDisabled(i)) {
      return i;
    }
  }

  if (loop) {
    for (let i = total - 1; i > current; i -= 1) {
      if (!isItemDisabled(i)) {
        return i;
      }
    }
  }

  return current;
}

function findFirstEnabled(total: number, isItemDisabled: (index: number) => boolean): number {
  for (let i = 0; i < total; i += 1) {
    if (!isItemDisabled(i)) {
      return i;
    }
  }

  return 0;
}

function findLastEnabled(total: number, isItemDisabled: (index: number) => boolean): number {
  for (let i = total - 1; i >= 0; i -= 1) {
    if (!isItemDisabled(i)) {
      return i;
    }
  }

  return 0;
}

function findEnabledInRow(
  row: number,
  startCol: number,
  step: number,
  columns: number,
  total: number,
  isItemDisabled: (index: number) => boolean,
): number | null {
  for (let col = startCol; col >= 0 && col < columns; col += step) {
    const candidate = row * columns + col;
    if (candidate < total && !isItemDisabled(candidate)) {
      return candidate;
    }
  }

  return null;
}

const defaultIsItemDisabled = () => false;

/**
 * Implements the [roving tabindex](https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/#kbd_roving_tabindex)
 * pattern for accessible keyboard navigation of lists and grids.
 *
 * Options are read lazily from `input`, so pass getters (`get loop() { ... }`) for reactive values.
 *
 * @example
 * ```tsx
 * const roving = useRovingIndex({ total: 3 });
 *
 * <For each={[0, 1, 2]}>
 *   {(i) => <button {...roving.getItemProps({ index: i })}>Item {i}</button>}
 * </For>
 * ```
 */
export function useRovingIndex(input: UseRovingIndexInput): UseRovingIndexReturnValue {
  const total = () => access(input.total);
  const orientation = () => input.orientation ?? 'horizontal';
  const loop = () => input.loop ?? true;
  const dir = () => input.dir ?? 'ltr';
  const columns = () => input.columns;
  const isItemDisabled = (index: number) => (input.isItemDisabled ?? defaultIsItemDisabled)(index);

  const itemRefs = new Map<number, HTMLElement>();
  const isGrid = () => typeof columns() === 'number' && columns()! > 0;

  const controlledIndex = () =>
    input.focusedIndex === undefined ? undefined : access(input.focusedIndex);

  const [uncontrolledIndex, setUncontrolledIndex] = createSignal(
    input.initialIndex !== undefined
      ? input.initialIndex
      : findFirstEnabled(total(), isItemDisabled),
  );

  const activeIndex = () => controlledIndex() ?? uncontrolledIndex();

  const setActiveIndex = (index: number) => {
    if (controlledIndex() === undefined) {
      setUncontrolledIndex(index);
    }
    input.onFocusChange?.(index);
  };

  createEffect(() => {
    const size = total();
    if (size === 0) {
      return;
    }

    const current = activeIndex();
    if (current >= size) {
      setActiveIndex(findLastEnabled(size, isItemDisabled));
    } else if (isItemDisabled(current)) {
      setActiveIndex(findFirstEnabled(size, isItemDisabled));
    }
  });

  const focusItem = (index: number) => {
    setActiveIndex(index);
    const element = itemRefs.get(index);
    if (element) {
      element.focus();
      if (input.activateOnFocus) {
        element.click();
      }
    }
  };

  const handleGridKeyDown = (event: KeyboardEvent, currentIndex: number) => {
    const row = Math.floor(currentIndex / columns()!);
    const col = currentIndex % columns()!;
    const totalRows = Math.ceil(total() / columns()!);
    let nextIndex: number | null = null;

    const isRtl = dir() === 'rtl';

    switch (event.key) {
      case 'ArrowRight': {
        const step = isRtl ? -1 : 1;
        nextIndex = findEnabledInRow(row, col + step, step, columns()!, total(), isItemDisabled);
        break;
      }

      case 'ArrowLeft': {
        const step = isRtl ? 1 : -1;
        nextIndex = findEnabledInRow(row, col + step, step, columns()!, total(), isItemDisabled);
        break;
      }

      case 'ArrowDown': {
        for (let r = row + 1; r < totalRows; r += 1) {
          const candidate = r * columns()! + col;
          if (candidate < total() && !isItemDisabled(candidate)) {
            nextIndex = candidate;
            break;
          }
        }
        break;
      }

      case 'ArrowUp': {
        for (let r = row - 1; r >= 0; r -= 1) {
          const candidate = r * columns()! + col;
          if (candidate < total() && !isItemDisabled(candidate)) {
            nextIndex = candidate;
            break;
          }
        }
        break;
      }

      case 'Home': {
        if (event.ctrlKey) {
          nextIndex = findFirstEnabled(total(), isItemDisabled);
        } else {
          const rowStart = row * columns()!;
          for (let i = rowStart; i < rowStart + columns()! && i < total(); i += 1) {
            if (!isItemDisabled(i)) {
              nextIndex = i;
              break;
            }
          }
        }
        break;
      }

      case 'End': {
        if (event.ctrlKey) {
          nextIndex = findLastEnabled(total(), isItemDisabled);
        } else {
          const rowStart = row * columns()!;
          const rowEnd = Math.min(rowStart + columns()!, total()) - 1;
          for (let i = rowEnd; i >= rowStart; i -= 1) {
            if (!isItemDisabled(i)) {
              nextIndex = i;
              break;
            }
          }
        }
        break;
      }
    }

    if (nextIndex !== null && nextIndex !== currentIndex) {
      event.preventDefault();
      event.stopPropagation();
      focusItem(nextIndex);
    }
  };

  const handleListKeyDown = (event: KeyboardEvent, currentIndex: number) => {
    const isRtl = dir() === 'rtl';
    let nextIndex: number | null = null;

    switch (event.key) {
      case 'ArrowRight': {
        if (orientation() === 'horizontal' || orientation() === 'both') {
          nextIndex = isRtl
            ? findPreviousEnabled(currentIndex, total(), isItemDisabled, loop())
            : findNextEnabled(currentIndex, total(), isItemDisabled, loop());
        }
        break;
      }

      case 'ArrowLeft': {
        if (orientation() === 'horizontal' || orientation() === 'both') {
          nextIndex = isRtl
            ? findNextEnabled(currentIndex, total(), isItemDisabled, loop())
            : findPreviousEnabled(currentIndex, total(), isItemDisabled, loop());
        }
        break;
      }

      case 'ArrowDown': {
        if (orientation() === 'vertical' || orientation() === 'both') {
          nextIndex = findNextEnabled(currentIndex, total(), isItemDisabled, loop());
        }
        break;
      }

      case 'ArrowUp': {
        if (orientation() === 'vertical' || orientation() === 'both') {
          nextIndex = findPreviousEnabled(currentIndex, total(), isItemDisabled, loop());
        }
        break;
      }

      case 'Home': {
        nextIndex = findFirstEnabled(total(), isItemDisabled);
        break;
      }

      case 'End': {
        nextIndex = findLastEnabled(total(), isItemDisabled);
        break;
      }
    }

    if (nextIndex !== null && nextIndex !== currentIndex) {
      event.preventDefault();
      event.stopPropagation();
      focusItem(nextIndex);
    }
  };

  const getItemProps = (options: UseRovingIndexGetItemPropsInput) => {
    const { index, onClick, onKeyDown } = options;

    return {
      get tabIndex() {
        return (index === activeIndex() ? 0 : -1) as 0 | -1;
      },

      ref: (node: HTMLElement | null) => {
        if (node) {
          itemRefs.set(index, node);
        } else {
          itemRefs.delete(index);
        }
      },

      onKeyDown: (event: KeyboardEvent) => {
        onKeyDown?.(event);

        if (event.defaultPrevented) {
          return;
        }

        if (isGrid()) {
          handleGridKeyDown(event, index);
        } else {
          handleListKeyDown(event, index);
        }
      },

      onClick: (event: MouseEvent) => {
        onClick?.(event);
        setActiveIndex(index);
      },
    };
  };

  return {
    getItemProps,
    focusedIndex: activeIndex,
    setFocusedIndex: setActiveIndex,
  };
}

export namespace useRovingIndex {
  export type Input = UseRovingIndexInput;
  export type GetItemPropsInput = UseRovingIndexGetItemPropsInput;
  export type ReturnValue = UseRovingIndexReturnValue;
}
