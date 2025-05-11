import { createSignal } from 'solid-js';

/**
 * For simple usecases where we only need to open/close a disclosure. I.e. accordions, modals, confirm yes or no alerts, etc.
 *
 * Example:
 * ```
 * const [isOpen, actions] = useDisclosure(false);
 *
 * return (
 *   <div>
 *     <button onClick={actions.open}>Open</button>
 *     <button onClick={actions.close}>Close</button>
 *     <Modal onOpenChange={(open) => {
 *       if (open) actions.open();
 *       else actions.close();
 *     }} />
 *   </div>
 * )
 * ```
 */
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

  const set = (value: boolean) => {
    setOpened(value);
  };

  return [opened, { open, close, toggle, set }] as const;
}

/**
 * For complex usecases where we only need to pass data to the disclosure. I.e. Edit Modals, Confirm Alerts with details about the item clicked, etc.
 *
 * Example:
 * ```
 * const [editModalData, editModalIsOpen, editModalActions] = useDisclosureData<{ id: string, title: string }>(false);
 *
 * return (
 *   <div>
 *     <button onClick={() => actions.open({ id: "1", title: "Item 1" })}>Open</button>
 *     <button onClick={actions.close}>Close</button>
 *     <Modal
 *       onOpenChange={(open) => {
 *         if (open) actions.open();
 *         else actions.close();
 *       }}
 *     >
 *       Do you really want to delete {editModalData?.title}?
 *       <button
 *         onClick={() => {
 *           // delete(editModalData?.id);
 *           editModalActions.close();
 *         }}
 *       >
 *         Yes
 *       </button>
 *     </Modal>
 *   </div>
 * )
 * ```
 */
export function useDisclosureData<T>(
  initialData: T | null = null,
  initialIsOpen: boolean = false,
  options?: {
    onOpen?: () => void;
    onClose?: () => void;
    dataDisappearDelay?: number;
  },
) {
  const [disclosureData, setDisclosureData] = createSignal<T | null>(initialData);
  const [isOpen, setIsOpen] = createSignal<boolean>(initialIsOpen);

  const open = (data: T | null) => {
    setIsOpen(true);
    setDisclosureData(() => data);
    options?.onOpen?.();
  };

  const close = () => {
    setIsOpen(false);

    setTimeout(() => {
      setDisclosureData(null);
    }, options?.dataDisappearDelay ?? 250); // Only remove data after 250ms (usually when a modal has closed after animation)

    options?.onClose?.();
  };

  return [disclosureData, isOpen, { open, close }] as const;
}
