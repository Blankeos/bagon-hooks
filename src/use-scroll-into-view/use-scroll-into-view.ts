import { createEffect, createSignal, onCleanup, onMount, type Accessor } from 'solid-js';
import { useReducedMotion } from '../use-reduced-motion/use-reduced-motion';

interface UseScrollIntoViewAnimation {
  /** Target element alignment relatively to parent based on current axis */
  alignment?: 'start' | 'end' | 'center';
}

export interface UseScrollIntoViewOptions {
  /** Callback fired after scroll */
  onScrollFinish?: () => void;

  /** Callback fired when scroll animation is canceled by user interaction */
  onScrollCancel?: () => void;

  /** Duration of scroll in milliseconds */
  duration?: number;

  /** Axis of scroll */
  axis?: 'x' | 'y';

  /** Custom mathematical easing function */
  easing?: (t: number) => number;

  /** Additional distance between nearest edge and element */
  offset?: number;

  /** Indicator if animation may be interrupted by user scrolling */
  cancelable?: boolean;

  /** Prevents content jumping in scrolling lists with multiple targets */
  isList?: boolean;
}

export interface UseScrollIntoViewReturnValue<
  Target extends HTMLElement = any,
  Parent extends HTMLElement | null = null,
> {
  /** Callback ref of target container into which we can scroll */
  scrollableRef: (node: NonNullable<Parent> | HTMLElement) => void;

  /** Callback ref of target element into which we scroll */
  targetRef: (node: Target) => void;

  /** Function to trigger scroll */
  scrollIntoView: (params?: UseScrollIntoViewAnimation) => void;

  /** Function to cancel ongoing scroll */
  cancel: () => void;

  /** Indicator if currently scrolling */
  scrolling: Accessor<boolean>;
}

export function useScrollIntoView<
  Target extends HTMLElement = any,
  Parent extends HTMLElement | null = null,
>(options: UseScrollIntoViewOptions = {}): UseScrollIntoViewReturnValue<Target, Parent> {
  let frameID = 0;
  let startTime = 0;
  let shouldStop = false;
  let scrollableNode: Parent | null = null;
  let targetNode: Target | null = null;

  const [scrolling, setScrolling] = createSignal(false);
  const reducedMotion = useReducedMotion();

  let optionsCurrent = options;
  createEffect(() => {
    optionsCurrent = options;
  });

  const cancel = (): void => {
    if (frameID) {
      cancelAnimationFrame(frameID);
      frameID = 0;
      setScrolling(false);
    }
  };

  const scrollIntoView = ({ alignment = 'start' }: UseScrollIntoViewAnimation = {}) => {
    shouldStop = false;

    if (frameID) {
      cancel();
    }

    const {
      duration = 1250,
      axis = 'y',
      onScrollFinish,
      onScrollCancel,
      easing,
      offset = 0,
      isList = false,
    } = optionsCurrent;
    const _easing = easing ?? easeInOutQuad;

    const start = getScrollStart({ parent: scrollableNode, axis }) ?? 0;

    const change =
      getRelativePosition({
        parent: scrollableNode,
        target: targetNode,
        axis,
        alignment,
        offset,
        isList,
      }) - (scrollableNode ? 0 : start);

    setScrolling(true);

    function animateScroll() {
      if (startTime === 0) {
        startTime = performance.now();
      }

      const now = performance.now();
      const elapsed = now - startTime;

      // Easing timing progress
      const t = reducedMotion() || duration === 0 ? 1 : elapsed / duration;

      const distance = start + change * _easing(t);

      setScrollParam({
        parent: scrollableNode,
        axis,
        distance,
      });

      if (!shouldStop && t < 1) {
        frameID = requestAnimationFrame(animateScroll);
      } else {
        if (shouldStop) {
          typeof onScrollCancel === 'function' && onScrollCancel();
        } else {
          typeof onScrollFinish === 'function' && onScrollFinish();
        }
        startTime = 0;
        frameID = 0;
        setScrolling(false);
        cancel();
      }
    }
    animateScroll();
  };

  const handleStop = () => {
    if (optionsCurrent.cancelable !== false) {
      shouldStop = true;
    }
  };

  onMount(() => {
    window.addEventListener('wheel', handleStop, { passive: true });
    window.addEventListener('touchmove', handleStop, { passive: true });

    onCleanup(() => {
      window.removeEventListener('wheel', handleStop);
      window.removeEventListener('touchmove', handleStop);
      cancel();
    });
  });

  return {
    scrollableRef: (node: NonNullable<Parent> | HTMLElement) => {
      scrollableNode = node as Parent;
    },
    targetRef: (node: Target) => {
      targetNode = node;
    },
    scrollIntoView,
    cancel,
    scrolling,
  };
}

function easeInOutQuad(t: number) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

function getRelativePosition({
  axis,
  target,
  parent,
  alignment,
  offset,
  isList,
}: {
  axis: 'x' | 'y';
  target: HTMLElement | null;
  parent: HTMLElement | null;
  alignment: 'start' | 'end' | 'center';
  offset: number;
  isList: boolean;
}): number {
  if (!target || (!parent && typeof document === 'undefined')) {
    return 0;
  }
  const isCustomParent = !!parent;
  const parentElement = parent || document.body;
  const parentPosition = parentElement.getBoundingClientRect();
  const targetPosition = target.getBoundingClientRect();

  const getDiff = (property: 'top' | 'left'): number =>
    targetPosition[property] - parentPosition[property];

  if (axis === 'y') {
    const diff = getDiff('top');

    if (diff === 0) {
      return 0;
    }

    if (alignment === 'start') {
      const distance = diff - offset;
      const shouldScroll = distance <= targetPosition.height * (isList ? 0 : 1) || !isList;

      return shouldScroll ? distance : 0;
    }

    const parentHeight = isCustomParent ? parentPosition.height : window.innerHeight;

    if (alignment === 'end') {
      const distance = diff + offset - parentHeight + targetPosition.height;
      const shouldScroll = distance >= -targetPosition.height * (isList ? 0 : 1) || !isList;

      return shouldScroll ? distance : 0;
    }

    if (alignment === 'center') {
      return diff - parentHeight / 2 + targetPosition.height / 2;
    }

    return 0;
  }

  if (axis === 'x') {
    const diff = getDiff('left');

    if (diff === 0) {
      return 0;
    }

    if (alignment === 'start') {
      const distance = diff - offset;
      const shouldScroll = distance <= targetPosition.width || !isList;

      return shouldScroll ? distance : 0;
    }

    const parentWidth = isCustomParent ? parentPosition.width : window.innerWidth;

    if (alignment === 'end') {
      const distance = diff + offset - parentWidth + targetPosition.width;
      const shouldScroll = distance >= -targetPosition.width || !isList;

      return shouldScroll ? distance : 0;
    }

    if (alignment === 'center') {
      return diff - parentWidth / 2 + targetPosition.width / 2;
    }

    return 0;
  }

  return 0;
}

function getScrollStart({ axis, parent }: { axis: 'x' | 'y'; parent: HTMLElement | null }) {
  if (!parent && typeof document === 'undefined') {
    return 0;
  }

  const method = axis === 'y' ? 'scrollTop' : 'scrollLeft';

  if (parent) {
    return parent[method];
  }

  const { body, documentElement } = document;

  // While one of it has a value the second is equal 0
  return body[method] + documentElement[method];
}

function setScrollParam({
  axis,
  parent,
  distance,
}: {
  axis: 'x' | 'y';
  parent: HTMLElement | null;
  distance: number;
}) {
  if (!parent && typeof document === 'undefined') {
    return;
  }

  const method = axis === 'y' ? 'scrollTop' : 'scrollLeft';

  if (parent) {
    parent[method] = distance;
  } else {
    const { body, documentElement } = document;
    body[method] = distance;
    documentElement[method] = distance;
  }
}

export namespace useScrollIntoView {
  export type Options = UseScrollIntoViewOptions;
  export type ReturnValue<
    Target extends HTMLElement,
    Parent extends HTMLElement | null,
  > = UseScrollIntoViewReturnValue<Target, Parent>;
}
