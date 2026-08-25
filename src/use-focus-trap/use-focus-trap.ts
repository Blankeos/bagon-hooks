import { Accessor, createEffect, createSignal, onCleanup } from 'solid-js';
import { scopeTab } from './scope-tab';
import { FOCUS_SELECTOR, focusable, tabbable } from './tabbable';

type MaybeAccessor<T> = T | Accessor<T>;

function access<T>(value: MaybeAccessor<T>): T {
  return typeof value === 'function' ? (value as Accessor<T>)() : value;
}

function isDev() {
  return (import.meta as ImportMeta & { env?: { DEV?: boolean } }).env?.DEV === true;
}

function focusNode(node: HTMLElement) {
  let focusElement: HTMLElement | null = node.querySelector('[data-autofocus]');

  if (!focusElement) {
    const children = Array.from<HTMLElement>(node.querySelectorAll(FOCUS_SELECTOR));
    focusElement = children.find(tabbable) || children.find(focusable) || null;
    if (!focusElement && focusable(node)) {
      focusElement = node;
    }
  }

  if (focusElement) {
    focusElement.focus({ preventScroll: true });
  } else if (isDev()) {
    console.warn(
      '[bagon-hooks/use-focus-trap] Failed to find focusable element within provided node',
      node,
    );
  }
}

/**
 * Traps keyboard focus within the referenced element while active.
 * Returns a Solid callback ref — assign it to the container that should trap focus.
 *
 * @param active - Whether the trap is enabled (default: `true`). Accepts a boolean or accessor.
 *
 * @example
 * ```tsx
 * const trapRef = useFocusTrap(true);
 * <div ref={trapRef}><input /><button>OK</button></div>
 * ```
 */
export function useFocusTrap(
  active: MaybeAccessor<boolean> = true,
): (node: HTMLElement | null | undefined) => void {
  const [node, setNode] = createSignal<HTMLElement | null>(null);

  createEffect(() => {
    const isActive = access(active);
    const el = node();

    if (!isActive || !el || typeof document === 'undefined') {
      return;
    }

    // Capture current node for the timeout so we don't read signals outside a tracked scope
    const focusTarget = el;
    const focusTimeout = window.setTimeout(() => {
      if (focusTarget.isConnected) {
        focusNode(focusTarget);
      } else if (isDev()) {
        console.warn('[bagon-hooks/use-focus-trap] Ref node is not part of the dom', focusTarget);
      }
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab' && focusTarget.isConnected) {
        scopeTab(focusTarget, event);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    onCleanup(() => {
      clearTimeout(focusTimeout);
      document.removeEventListener('keydown', handleKeyDown);
    });
  });

  // Solid calls this during the element's reactive setup, so onCleanup clears the
  // node when that element is disposed (e.g. <Show> removes the trap container).
  return (el: HTMLElement | null | undefined) => {
    if (!el) {
      setNode(null);
      return;
    }
    setNode(el);
    onCleanup(() => {
      setNode((current) => (current === el ? null : current));
    });
  };
}
