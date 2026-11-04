import { Accessor, JSX, createSignal } from 'solid-js';
import { isMeasured } from '../use-collapse/use-collapse';
import { useDidUpdate } from '../use-did-update/use-did-update';

function getAutoWidthDuration(width: number | string) {
  if (!width || typeof width === 'string') {
    return 0;
  }
  const constant = width / 36;
  return Math.round((4 + 15 * constant ** 0.25 + constant / 5) * 10);
}

export function getElementWidth(element: HTMLElement | null | undefined): number | string {
  return element ? element.scrollWidth : 'auto';
}

function resolveExpanded(expanded: boolean | Accessor<boolean>): boolean {
  return typeof expanded === 'function' ? expanded() : expanded;
}

export interface UseHorizontalCollapseInput {
  /** Expanded state — pass an Accessor for reactive updates in Solid */
  expanded: boolean | Accessor<boolean>;

  /** Transition duration in milliseconds, by default calculated based on content width */
  transitionDuration?: number;

  /** Transition timing function, `ease` by default */
  transitionTimingFunction?: string;

  /** Called when transition ends */
  onTransitionEnd?: () => void;

  /** Called when transition starts */
  onTransitionStart?: () => void;

  /** If true, collapsed content is kept in the DOM and hidden with `display: none` styles */
  keepMounted?: boolean;
}

interface GetHorizontalCollapsePropsInput {
  style?: JSX.CSSProperties;
  ref?: (element: HTMLDivElement) => void;
}

interface GetHorizontalCollapsePropsReturnValue {
  'aria-hidden': Accessor<boolean> | boolean;
  inert: Accessor<boolean | undefined> | boolean | undefined;
  ref: (element: HTMLDivElement) => void;
  onTransitionEnd: (event: TransitionEvent) => void;
  style: Accessor<JSX.CSSProperties> | JSX.CSSProperties;
}

export type UseHorizontalCollapseState = 'entering' | 'entered' | 'exiting' | 'exited';

export interface UseHorizontalCollapseReturnValue {
  /** Current transition state */
  state: Accessor<UseHorizontalCollapseState>;

  /** Props to pass down to the collapsible element */
  getCollapseProps: (
    input?: GetHorizontalCollapsePropsInput,
  ) => GetHorizontalCollapsePropsReturnValue;
}

export function useHorizontalCollapse({
  transitionDuration,
  transitionTimingFunction = 'ease',
  onTransitionEnd,
  onTransitionStart,
  expanded,
  keepMounted,
}: UseHorizontalCollapseInput): UseHorizontalCollapseReturnValue {
  const collapsedStyles: JSX.CSSProperties = {
    width: '0px',
    overflow: 'hidden',
    ...(keepMounted ? {} : { display: 'none' }),
  };

  let element: HTMLElement | null = null;
  const initiallyExpanded = resolveExpanded(expanded);
  const [styles, setStyles] = createSignal<JSX.CSSProperties>(
    initiallyExpanded ? {} : collapsedStyles,
  );
  const [state, setState] = createSignal<UseHorizontalCollapseState>(
    initiallyExpanded ? 'entered' : 'exited',
  );

  const mergeStyles = (newStyles: JSX.CSSProperties) => {
    setStyles(oldStyles => ({ ...oldStyles, ...newStyles }));
  };

  const getTransitionStyles = (width: number | string) => {
    const duration = transitionDuration ?? getAutoWidthDuration(width);
    return {
      transition: `width ${duration}ms ${transitionTimingFunction}, opacity ${duration}ms ${transitionTimingFunction}`,
    };
  };

  const px = (size: number | string) => (typeof size === 'number' ? `${size}px` : size) as any;

  // Incremented on every expanded change, so rAF callbacks of a superseded transition bail out
  let transitionId = 0;

  useDidUpdate(() => {
    transitionId += 1;
    const currentId = transitionId;
    const isCurrentTransition = () => transitionId === currentId && !!element;
    const isExpanded = resolveExpanded(expanded);
    const shouldTransition = transitionDuration !== 0;

    if (shouldTransition) {
      onTransitionStart?.();
    }

    if (isExpanded) {
      window.requestAnimationFrame(() => {
        if (!isCurrentTransition()) {
          return;
        }

        setState('entering');
        mergeStyles({ 'will-change': 'width', display: 'block', overflow: 'hidden' });
        // Force style flush onto the element so scrollWidth is correct
        element!.style.display = 'block';
        element!.style.overflow = 'hidden';
        void element!.offsetWidth; // force reflow
        window.requestAnimationFrame(() => {
          if (!isCurrentTransition()) {
            return;
          }

          const width = getElementWidth(element);

          // Nothing to animate (e.g. zero-size content) - `transitionend` would never fire
          if (!isMeasured(width)) {
            element!.style.display = '';
            element!.style.overflow = '';
            setStyles({});
            setState('entered');
            onTransitionEnd?.();
            return;
          }

          mergeStyles({ ...getTransitionStyles(width), width: px(width) });
        });
      });
    } else {
      window.requestAnimationFrame(() => {
        if (!isCurrentTransition()) {
          return;
        }

        setState('exiting');
        const width = getElementWidth(element);

        if (!isMeasured(width)) {
          setStyles(collapsedStyles);
          setState('exited');
          onTransitionEnd?.();
          return;
        }

        mergeStyles({ ...getTransitionStyles(width), 'will-change': 'width', width: px(width) });
        window.requestAnimationFrame(() => {
          if (!isCurrentTransition()) {
            return;
          }

          mergeStyles({ width: '0px', overflow: 'hidden' });
        });
      });
    }
  }, [() => resolveExpanded(expanded)]);

  const handleTransitionEnd = (event: TransitionEvent): void => {
    if (event.target !== element || event.propertyName !== 'width') {
      return;
    }

    const isExpanded = resolveExpanded(expanded);
    const currentStyles = styles();

    if (element) {
      element.style.display = '';
      element.style.overflow = '';
    }

    if (isExpanded) {
      const width = getElementWidth(element);

      if (px(width) === currentStyles.width) {
        setStyles({});
      } else {
        mergeStyles({ width: px(width) });
      }

      setState('entered');
      onTransitionEnd?.();
    } else if (currentStyles.width === '0px') {
      setStyles(collapsedStyles);
      setState('exited');
      onTransitionEnd?.();
    }
  };

  return {
    state,
    getCollapseProps: input => ({
      'aria-hidden': () => !resolveExpanded(expanded),
      inert: () => (!resolveExpanded(expanded) ? true : undefined),
      ref: (node: HTMLDivElement) => {
        element = node;
        input?.ref?.(node);
      },
      onTransitionEnd: handleTransitionEnd,
      style: () =>
        ({ 'box-sizing': 'border-box', ...input?.style, ...styles() }) as JSX.CSSProperties,
    }),
  };
}

export namespace useHorizontalCollapse {
  export type Input = UseHorizontalCollapseInput;
  export type ReturnValue = UseHorizontalCollapseReturnValue;
  export type State = UseHorizontalCollapseState;
}
