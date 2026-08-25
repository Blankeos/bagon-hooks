import { createEffect, createMemo, createSignal, type Accessor } from 'solid-js';
import { useScrollDirection } from '../use-scroll-direction/use-scroll-direction';
import { useWindowScroll } from '../use-window-scroll/use-window-scroll';

export const isFixed = (current: number, fixedAt: number) => current <= fixedAt;

export interface UseHeadroomInput {
  /** Number in px at which element should be fixed */
  fixedAt?: number;

  /** Number of px to scroll to fully reveal or hide the element, `100` by default */
  scrollDistance?: number;

  /** Called when element is pinned */
  onPin?: () => void;

  /** Called when element is at fixed position */
  onFix?: () => void;

  /** Called when element is unpinned */
  onRelease?: () => void;
}

export interface UseHeadroomReturnValue {
  /** True when the element is at least partially visible */
  pinned: Accessor<boolean>;

  /** Reveal progress: `0` = fully hidden, `1` = fully visible */
  scrollProgress: Accessor<number>;
}

export function useHeadroom(input: UseHeadroomInput = {}): UseHeadroomReturnValue {
  const scrollDirection = useScrollDirection();
  const [scroll] = useWindowScroll();

  let options = input;
  createEffect(() => {
    options = input;
  });

  let isCurrentlyPinned = false;
  let wasFixed = false;
  let prevIsFixed = isFixed(typeof window !== 'undefined' ? window.scrollY : 0, options.fixedAt ?? 0);
  let directionChangeScrollY = typeof window !== 'undefined' ? window.scrollY : 0;
  let progressAtDirectionChange = prevIsFixed ? 1 : 0;
  let prevIsScrollingUp = false;

  const [scrollProgress, setScrollProgress] = createSignal(prevIsFixed ? 1 : 0);

  createEffect(() => {
    const scrollPosition = scroll().y;
    const isScrollingUp = scrollDirection() === 'up';
    const fixedAt = options.fixedAt ?? 0;
    const inFixedPosition = isFixed(scrollPosition, fixedAt);

    if (inFixedPosition && !isCurrentlyPinned) {
      isCurrentlyPinned = true;
      options.onPin?.();
    } else if (!inFixedPosition && isScrollingUp && !isCurrentlyPinned) {
      isCurrentlyPinned = true;
      options.onPin?.();
    } else if (!inFixedPosition && !isScrollingUp && isCurrentlyPinned) {
      isCurrentlyPinned = false;
      options.onRelease?.();
    }
  });

  createEffect(() => {
    const currentlyInFixedZone = isFixed(scroll().y, options.fixedAt ?? 0);
    if (currentlyInFixedZone && !wasFixed) {
      options.onFix?.();
    }
    wasFixed = currentlyInFixedZone;
  });

  createEffect(() => {
    const scrollPosition = scroll().y;
    const isScrollingUp = scrollDirection() === 'up';
    const fixedAt = options.fixedAt ?? 0;
    const scrollDistance = options.scrollDistance ?? 100;
    const currentlyFixed = isFixed(scrollPosition, fixedAt);

    // Detect fixed-zone transitions first. When leaving the fixed zone the baseline
    // is anchored at fixedAt (not the current scroll position) so the delta is measured
    // from where the element was last fully visible, regardless of how scroll position
    // was initialised on the first render.
    if (prevIsFixed !== currentlyFixed) {
      prevIsFixed = currentlyFixed;

      if (!currentlyFixed) {
        directionChangeScrollY = fixedAt;
        progressAtDirectionChange = 1;
      } else {
        directionChangeScrollY = scrollPosition;
        progressAtDirectionChange = 1;
      }

      prevIsScrollingUp = isScrollingUp;
    }

    // When scroll direction changes outside the fixed zone, save the current progress
    // so the next direction accumulates from that point (handles partial reveals).
    if (!currentlyFixed && prevIsScrollingUp !== isScrollingUp) {
      const transitionDelta = Math.abs(scrollPosition - directionChangeScrollY);
      const transitionProgress = prevIsScrollingUp
        ? Math.min(progressAtDirectionChange + transitionDelta / scrollDistance, 1)
        : Math.max(progressAtDirectionChange - transitionDelta / scrollDistance, 0);

      prevIsScrollingUp = isScrollingUp;
      directionChangeScrollY = scrollPosition;
      progressAtDirectionChange = transitionProgress;
    }

    if (currentlyFixed) {
      setScrollProgress(1);
      return;
    }

    const scrollDelta = Math.abs(scrollPosition - directionChangeScrollY);

    if (isScrollingUp) {
      setScrollProgress(Math.min(progressAtDirectionChange + scrollDelta / scrollDistance, 1));
      return;
    }

    setScrollProgress(Math.max(progressAtDirectionChange - scrollDelta / scrollDistance, 0));
  });

  const pinned = createMemo(() => scrollProgress() > 0);

  return { pinned, scrollProgress };
}

export namespace useHeadroom {
  export type Input = UseHeadroomInput;
  export type ReturnValue = UseHeadroomReturnValue;
}
