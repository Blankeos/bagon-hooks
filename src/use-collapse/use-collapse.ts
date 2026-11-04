import { Accessor, JSX, createSignal } from 'solid-js';
import { useDidUpdate } from '../use-did-update/use-did-update';

function getAutoHeightDuration(height: number | string) {
  if (!height || typeof height === 'string') {
    return 0;
  }
  const constant = height / 36;
  return Math.round((4 + 15 * constant ** 0.25 + constant / 5) * 10);
}

export function getElementHeight(element: HTMLElement | null | undefined): number | string {
  return element ? element.scrollHeight : 'auto';
}

export function isMeasured(size: number | string): size is number {
  return typeof size === 'number' && size > 0;
}

function resolveExpanded(expanded: boolean | Accessor<boolean>): boolean {
  return typeof expanded === 'function' ? expanded() : expanded;
}

export interface UseCollapseInput {
  /** Expanded state — pass an Accessor for reactive updates in Solid */
  expanded: boolean | Accessor<boolean>;

  /** Transition duration in milliseconds, by default calculated based on content height */
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

interface GetCollapsePropsInput {
  style?: JSX.CSSProperties;
  ref?: (element: HTMLDivElement) => void;
}

interface GetCollapsePropsReturnValue {
  'aria-hidden': Accessor<boolean> | boolean;
  inert: Accessor<boolean | undefined> | boolean | undefined;
  ref: (element: HTMLDivElement) => void;
  onTransitionEnd: (event: TransitionEvent) => void;
  style: Accessor<JSX.CSSProperties> | JSX.CSSProperties;
}

export type UseCollapseState = 'entering' | 'entered' | 'exiting' | 'exited';

export interface UseCollapseReturnValue {
  /** Current transition state */
  state: Accessor<UseCollapseState>;

  /** Props to pass down to the collapsible element */
  getCollapseProps: (input?: GetCollapsePropsInput) => GetCollapsePropsReturnValue;
}

export function useCollapse({
  transitionDuration,
  transitionTimingFunction = 'ease',
  onTransitionEnd,
  onTransitionStart,
  expanded,
  keepMounted,
}: UseCollapseInput): UseCollapseReturnValue {
  const collapsedStyles: JSX.CSSProperties = {
    height: '0px',
    overflow: 'hidden',
    ...(keepMounted ? {} : { display: 'none' }),
  };

  let element: HTMLElement | null = null;
  const initiallyExpanded = resolveExpanded(expanded);
  const [styles, setStyles] = createSignal<JSX.CSSProperties>(
    initiallyExpanded ? {} : collapsedStyles,
  );
  const [state, setState] = createSignal<UseCollapseState>(
    initiallyExpanded ? 'entered' : 'exited',
  );

  const mergeStyles = (newStyles: JSX.CSSProperties) => {
    setStyles(oldStyles => ({ ...oldStyles, ...newStyles }));
  };

  const getTransitionStyles = (height: number | string) => {
    const duration = transitionDuration ?? getAutoHeightDuration(height);
    return {
      transition: `height ${duration}ms ${transitionTimingFunction}, opacity ${duration}ms ${transitionTimingFunction}`,
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
        mergeStyles({ 'will-change': 'height', display: 'block', overflow: 'hidden' });
        // Force style flush onto the element so scrollHeight is correct
        element!.style.display = 'block';
        element!.style.overflow = 'hidden';
        void element!.offsetHeight; // force reflow
        window.requestAnimationFrame(() => {
          if (!isCurrentTransition()) {
            return;
          }

          const height = getElementHeight(element);

          // Nothing to animate (e.g. zero-size content) - `transitionend` would never fire
          if (!isMeasured(height)) {
            element!.style.display = '';
            element!.style.overflow = '';
            setStyles({});
            setState('entered');
            onTransitionEnd?.();
            return;
          }

          mergeStyles({ ...getTransitionStyles(height), height: px(height) });
        });
      });
    } else {
      window.requestAnimationFrame(() => {
        if (!isCurrentTransition()) {
          return;
        }

        setState('exiting');
        const height = getElementHeight(element);

        if (!isMeasured(height)) {
          setStyles(collapsedStyles);
          setState('exited');
          onTransitionEnd?.();
          return;
        }

        mergeStyles({
          ...getTransitionStyles(height),
          'will-change': 'height',
          height: px(height),
        });
        window.requestAnimationFrame(() => {
          if (!isCurrentTransition()) {
            return;
          }

          mergeStyles({ height: '0px', overflow: 'hidden' });
        });
      });
    }
  }, [() => resolveExpanded(expanded)]);

  const handleTransitionEnd = (event: TransitionEvent): void => {
    if (event.target !== element || event.propertyName !== 'height') {
      return;
    }

    const isExpanded = resolveExpanded(expanded);
    const currentStyles = styles();

    if (element) {
      element.style.display = '';
      element.style.overflow = '';
    }

    if (isExpanded) {
      const height = getElementHeight(element);

      if (px(height) === currentStyles.height) {
        setStyles({});
      } else {
        mergeStyles({ height: px(height) });
      }

      setState('entered');
      onTransitionEnd?.();
    } else if (currentStyles.height === '0px') {
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

export namespace useCollapse {
  export type Input = UseCollapseInput;
  export type ReturnValue = UseCollapseReturnValue;
  export type State = UseCollapseState;
}
