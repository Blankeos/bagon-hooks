import { onCleanup, onMount } from 'solid-js';

/**
 * Use this for more general keyboard events, as opposed to `useHotkeys`.
 */
export function useKeyboard(props: {
  isDisabled?: boolean;
  onKeyDown?: (event: KeyboardEvent) => void;
  onKeyUp?: (event: KeyboardEvent) => void;
}) {
  onMount(() => {
    const onKeyDownListener = (event: KeyboardEvent) => {
      if (props.isDisabled) return;
      props.onKeyDown?.(event);
    };

    const onKeyUpListener = (event: KeyboardEvent) => {
      if (props.isDisabled) return;
      props.onKeyUp?.(event);
    };

    window.addEventListener('keydown', onKeyDownListener);
    window.addEventListener('keyup', onKeyUpListener);
    onCleanup(() => {
      window.removeEventListener('keydown', onKeyDownListener);
      window.removeEventListener('keyup', onKeyUpListener);
    });
  });
}
