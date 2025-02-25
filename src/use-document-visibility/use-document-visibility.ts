import { Accessor, createSignal, onCleanup, onMount } from 'solid-js';

export function useDocumentVisibility(params?: {
  callback?: (visibilityState: DocumentVisibilityState) => void;
}): Accessor<DocumentVisibilityState> {
  const [documentVisibility, setDocumentVisibility] =
    createSignal<DocumentVisibilityState>('visible');

  onMount(() => {
    const listener = () => {
      setDocumentVisibility(document.visibilityState);
      if (params) params.callback?.(document.visibilityState);
    };
    document.addEventListener('visibilitychange', listener);

    onCleanup(() => document.removeEventListener('visibilitychange', listener));
  });

  return documentVisibility;
}
