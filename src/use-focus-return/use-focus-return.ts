import { Accessor, createEffect, on, onCleanup } from 'solid-js';

type MaybeAccessor<T> = T | Accessor<T>;

function access<T>(value: MaybeAccessor<T>): T {
  return typeof value === 'function' ? (value as Accessor<T>)() : value;
}

export interface UseFocusReturnOptions {
  /** Whether the focus-trapped region is open/active */
  opened: MaybeAccessor<boolean>;
  /** Automatically restore focus when `opened` becomes false (default: `true`) */
  shouldReturnFocus?: MaybeAccessor<boolean>;
}

export type UseFocusReturnReturnValue = () => void;

/**
 * Saves `document.activeElement` when `opened` becomes true and restores focus
 * to that element when `opened` becomes false (or when you call the returned function).
 *
 * Mirrors Mantine's `useFocusReturn`: skips the initial run (`on` with `defer: true`),
 * then reacts to `opened` / `shouldReturnFocus` changes. Focus restore is deferred
 * slightly and cancelled if the user Tabs away in the meantime.
 *
 * @example
 * ```tsx
 * const [opened, setOpened] = createSignal(false);
 * useFocusReturn({ opened });
 * ```
 */
export function useFocusReturn({
  opened,
  shouldReturnFocus = true,
}: UseFocusReturnOptions): UseFocusReturnReturnValue {
  let lastActiveElement: HTMLElement | null = null;

  const returnFocus: UseFocusReturnReturnValue = () => {
    if (
      lastActiveElement &&
      typeof lastActiveElement === 'object' &&
      typeof lastActiveElement.focus === 'function'
    ) {
      lastActiveElement.focus({ preventScroll: true });
    }
  };

  // `{ defer: true }` skips the initial run — same semantics as Mantine useDidUpdate / useUpdateEffect
  createEffect(
    on(
      [() => access(opened), () => access(shouldReturnFocus)],
      () => {
        if (typeof document === 'undefined') {
          return;
        }

        let timeout: ReturnType<typeof setTimeout> | undefined;

        const clearFocusTimeout = (event: KeyboardEvent) => {
          if (event.key === 'Tab' && timeout != null) {
            clearTimeout(timeout);
          }
        };

        document.addEventListener('keydown', clearFocusTimeout);

        if (access(opened)) {
          lastActiveElement = document.activeElement as HTMLElement;
        } else if (access(shouldReturnFocus)) {
          const activeElementAtClose = document.activeElement;
          timeout = setTimeout(() => {
            const currentActiveElement = document.activeElement;
            if (
              currentActiveElement === null ||
              currentActiveElement === document.body ||
              currentActiveElement === activeElementAtClose
            ) {
              returnFocus();
            }
          }, 10);
        }

        onCleanup(() => {
          if (timeout != null) clearTimeout(timeout);
          document.removeEventListener('keydown', clearFocusTimeout);
        });
      },
      { defer: true },
    ),
  );

  return returnFocus;
}
