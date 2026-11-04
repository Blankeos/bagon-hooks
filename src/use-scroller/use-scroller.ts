import { Accessor, createEffect, createSignal, onCleanup } from 'solid-js';

export interface UseScrollerOptions {
  /** Amount of pixels to scroll when calling `scrollStart` / `scrollEnd`, `200` by default */
  scrollAmount?: number;

  /** Determines whether content can be scrolled by dragging with mouse, `true` by default */
  draggable?: boolean;

  /** Called when scroll state changes (canScrollStart or canScrollEnd) */
  onScrollStateChange?: (state: UseScrollerScrollState) => void;

  /** ✨ Scroll behavior for all scroll operations, `'smooth'` by default */
  behavior?: ScrollBehavior;
}

export interface UseScrollerScrollState {
  /** Whether content can be scrolled towards the start (left in LTR, right in RTL) */
  canScrollStart: boolean;

  /** Whether content can be scrolled towards the end (right in LTR, left in RTL) */
  canScrollEnd: boolean;
}

export interface UseScrollerReturnValue<T extends HTMLElement = HTMLDivElement> {
  /** Ref callback to attach to the scrollable container element */
  ref: (element: T | null | undefined) => void;

  /** Whether content can be scrolled towards the start */
  canScrollStart: Accessor<boolean>;

  /** Whether content can be scrolled towards the end */
  canScrollEnd: Accessor<boolean>;

  /** Scrolls towards the start direction */
  scrollStart: () => void;

  /** Scrolls towards the end direction */
  scrollEnd: () => void;

  /** `true` if the user is currently dragging the content */
  isDragging: Accessor<boolean>;

  /** Props to spread on the scrollable container for drag functionality */
  dragHandlers: {
    onMouseDown: (e: MouseEvent) => void;
    onMouseMove: (e: MouseEvent) => void;
    onMouseUp: () => void;
    onMouseLeave: () => void;
  };

  /** ✨ Scrolls to a specific position */
  scrollTo: (options: { x?: number; y?: number }) => void;

  /** ✨ Scrolls to the top of the element */
  scrollToTop: () => void;

  /** ✨ Scrolls to the bottom of the element */
  scrollToBottom: () => void;
}

/**
 * Horizontal scroll helper: tracks whether content can scroll in either direction,
 * provides `scrollStart` / `scrollEnd` and optional mouse-drag scrolling.
 */
export function useScroller<T extends HTMLElement = HTMLDivElement>(
  options: UseScrollerOptions = {},
): UseScrollerReturnValue<T> {
  const [container, setContainer] = createSignal<T | null>(null);

  const [canScrollStart, setCanScrollStart] = createSignal(false);
  const [canScrollEnd, setCanScrollEnd] = createSignal(false);
  const [isDragging, setIsDragging] = createSignal(false);

  let isDraggingFlag = false;
  let hasDragged = false;
  let startX = 0;
  let scrollLeftStart = 0;
  let removeClickSuppressor: (() => void) | null = null;

  const scrollAmount = () => options.scrollAmount ?? 200;
  const behavior = () => options.behavior ?? 'smooth';

  const updateScrollState = () => {
    const node = container();
    if (!node) {
      return;
    }

    const { scrollLeft, scrollWidth, clientWidth } = node;
    const isRtl = getComputedStyle(node).direction === 'rtl';

    let newCanScrollStart: boolean;
    let newCanScrollEnd: boolean;

    if (isRtl) {
      newCanScrollStart = scrollLeft < -1;
      newCanScrollEnd = scrollLeft > -(scrollWidth - clientWidth) + 1;
    } else {
      newCanScrollStart = scrollLeft > 1;
      newCanScrollEnd = scrollLeft < scrollWidth - clientWidth - 1;
    }

    setCanScrollStart(newCanScrollStart);
    setCanScrollEnd(newCanScrollEnd);

    options.onScrollStateChange?.({
      canScrollStart: newCanScrollStart,
      canScrollEnd: newCanScrollEnd,
    });
  };

  createEffect(() => {
    const node = container();
    if (!node) {
      return;
    }

    updateScrollState();
    node.addEventListener('scroll', updateScrollState);
    const resizeObserver =
      typeof ResizeObserver !== 'undefined' ? new ResizeObserver(updateScrollState) : null;
    resizeObserver?.observe(node);

    onCleanup(() => {
      node.removeEventListener('scroll', updateScrollState);
      resizeObserver?.disconnect();
      removeClickSuppressor?.();
    });
  });

  const scroll = (direction: 'start' | 'end') => {
    const node = container();
    if (node) {
      const isRtl = getComputedStyle(node).direction === 'rtl';
      const scrollBy = direction === 'end' ? scrollAmount() : -scrollAmount();

      node.scrollBy({ left: isRtl ? -scrollBy : scrollBy, behavior: behavior() });
    }
  };

  const handleMouseDown = (event: MouseEvent) => {
    removeClickSuppressor?.();
    if (options.draggable === false) {
      return;
    }

    const node = container();
    if (node) {
      isDraggingFlag = true;
      hasDragged = false;
      setIsDragging(true);
      startX = event.pageX - node.offsetLeft;
      scrollLeftStart = node.scrollLeft;
      node.style.cursor = 'grabbing';
      node.style.userSelect = 'none';
    }
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (!isDraggingFlag) {
      return;
    }

    event.preventDefault();
    const node = container();
    if (node) {
      const walk = event.pageX - node.offsetLeft - startX;
      if (Math.abs(walk) > 5) {
        hasDragged = true;
      }
      node.scrollLeft = scrollLeftStart - walk;
    }
  };

  const handleMouseUp = () => {
    const wasDragged = hasDragged;
    isDraggingFlag = false;
    hasDragged = false;
    setIsDragging(false);

    const node = container();
    if (node) {
      node.style.cursor = '';
      node.style.userSelect = '';

      if (wasDragged) {
        removeClickSuppressor?.();
        const removeSuppressor = () => {
          node.removeEventListener('click', suppressClick, true);
          removeClickSuppressor = null;
        };
        const suppressClick = (event: MouseEvent) => {
          event.stopPropagation();
          event.preventDefault();
          removeSuppressor();
        };
        node.addEventListener('click', suppressClick, true);
        removeClickSuppressor = removeSuppressor;
      }
    }
  };

  const handleMouseLeave = () => {
    if (isDraggingFlag) {
      handleMouseUp();
    }
  };

  return {
    ref: node => setContainer(() => (node ?? null) as T | null),
    canScrollStart,
    canScrollEnd,
    scrollStart: () => scroll('start'),
    scrollEnd: () => scroll('end'),
    isDragging,
    dragHandlers: {
      onMouseDown: handleMouseDown,
      onMouseMove: handleMouseMove,
      onMouseUp: handleMouseUp,
      onMouseLeave: handleMouseLeave,
    },
    scrollTo: ({ x, y }) => container()?.scrollTo({ left: x, top: y, behavior: behavior() }),
    scrollToTop: () => container()?.scrollTo({ top: 0, behavior: behavior() }),
    scrollToBottom: () => {
      const node = container();
      node?.scrollTo({ top: node.scrollHeight, behavior: behavior() });
    },
  };
}

export namespace useScroller {
  export type Options = UseScrollerOptions;
  export type ReturnValue<T extends HTMLElement = HTMLDivElement> = UseScrollerReturnValue<T>;
  export type ScrollState = UseScrollerScrollState;
}
