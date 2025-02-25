import { Accessor, createEffect, createSignal } from 'solid-js';

/** Improvement: document.title is an optional signal. Now returns a setter if you want to set it manually. */
export function useDocumentTitle(title?: Accessor<string>) {
  const [_title, _setTitle] = createSignal(title?.());

  function setTitle(newTitle: string) {
    if (typeof newTitle === 'string' && newTitle.trim().length > 0) {
      document.title = newTitle.trim();
      _setTitle(newTitle);
    }
  }

  createEffect(() => {
    if (title) setTitle(title());
  });

  return [_title, setTitle] as const;
}
