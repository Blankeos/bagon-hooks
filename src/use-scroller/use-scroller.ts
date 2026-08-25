export interface UseScrollerOptions {
  /** Scroll behavior for all scroll operations, `'smooth'` by default */
  behavior?: ScrollBehavior;
}

export interface UseScrollerReturnValue<T extends HTMLElement = any> {
  /** Ref function to attach to the scrollable element */
  ref: (element: T) => void;

  /** Scrolls to a specific position */
  scrollTo: (options: { x?: number; y?: number }) => void;

  /** Scrolls to the top of the element */
  scrollToTop: () => void;

  /** Scrolls to the bottom of the element */
  scrollToBottom: () => void;
}

export function useScroller<
  T extends HTMLElement = any,
>({
  behavior = 'smooth',
}: UseScrollerOptions = {}): UseScrollerReturnValue<T> {
  let element: T | undefined;

  const setRef = (node: T) => {
    element = node;
  };

  const scrollTo = ({ x, y }: { x?: number; y?: number }) => {
    element?.scrollTo({ left: x, top: y, behavior });
  };

  const scrollToTop = () => {
    element?.scrollTo({ top: 0, behavior });
  };

  const scrollToBottom = () => {
    element?.scrollTo({ top: element.scrollHeight, behavior });
  };

  return { ref: setRef, scrollTo, scrollToTop, scrollToBottom };
}

export namespace useScroller {
  export type Options = UseScrollerOptions;
  export type ReturnValue<T extends HTMLElement = any> = UseScrollerReturnValue<T>;
}
