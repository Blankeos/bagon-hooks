import { Accessor, createMemo, createSignal, onCleanup, onMount } from 'solid-js';

/**
 * Tracks the current text selection (`window.getSelection()`).
 * Returns an accessor that updates on `selectionchange`.
 *
 * Note: `document.getSelection()` returns the same object reference, so a version
 * signal is used to force Solid to notify subscribers when the selection changes.
 */
export function useTextSelection(): Accessor<Selection | null> {
  const [selection, setSelection] = createSignal<Selection | null>(
    typeof window !== 'undefined' ? window.getSelection() : null,
  );
  const [version, setVersion] = createSignal(0);

  const handleSelectionChange = () => {
    setSelection(window.getSelection());
    setVersion(v => v + 1);
  };

  onMount(() => {
    setSelection(window.getSelection());
    setVersion(v => v + 1);
    document.addEventListener('selectionchange', handleSelectionChange);
    onCleanup(() => {
      document.removeEventListener('selectionchange', handleSelectionChange);
    });
  });

  // `equals: false` is required because `document.getSelection()` returns the
  // same object reference across selectionchange events.
  return createMemo(
    () => {
      version();
      return selection();
    },
    undefined,
    { equals: false },
  );
}
