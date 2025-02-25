import { createSignal } from 'solid-js';

export function useDisclosure(
  initialState = false,
  callbacks?: { onOpen?: () => void; onClose?: () => void },
) {
  const { onOpen, onClose } = callbacks || {};
  const [opened, setOpened] = createSignal(initialState);

  const open = () => {
    setOpened(isOpened => {
      if (!isOpened) {
        onOpen?.();
        return true;
      }
      return isOpened;
    });
  };

  const close = () => {
    setOpened(isOpened => {
      if (isOpened) {
        onClose?.();
        return false;
      }
      return isOpened;
    });
  };

  const toggle = () => {
    opened() ? close() : open();
  };

  return [opened, { open, close, toggle }] as const;
}
