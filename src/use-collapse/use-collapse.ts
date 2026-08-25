import { Accessor, JSX, batch, createSignal } from 'solid-js';
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

  useDidUpdate(() => {
    const isExpanded = resolveExpanded(expanded);
    const shouldTransition = transitionDuration !== 0;

    if (shouldTransition) {
      onTransitionStart?.();
    }

    if (isExpanded) {
      window.requestAnimationFrame(() => {
        setState('entering');
        mergeStyles({ 'will-change': 'height', display: 'block', overflow: 'hidden' });
        // Force style flush onto the element so scrollHeight is correct
        if (element) {
          element.style.display = 'block';
          element.style.overflow = 'hidden';
          void element.offsetHeight; // force reflow
        }
        window.requestAnimationFrame(() => {
          const height = getElementHeight(element);
          mergeStyles({ ...getTransitionStyles(height), height: typeof height === "number" ? (`${height}px` as any) : (height as any) });
        });
      });
    } else {
      window.requestAnimationFrame(() => {
        batch(() => {
          setState('exiting');
          const height = getElementHeight(element);
          mergeStyles({ ...getTransitionStyles(height), 'will-change': 'height', height: typeof height === "number" ? (`${height}px` as any) : (height as any) });
        });
        window.requestAnimationFrame(() => mergeStyles({ height: '0px', overflow: 'hidden' }));
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

      if (height === currentStyles.height) {
        setStyles({});
      } else {
        mergeStyles({ height: typeof height === "number" ? (`${height}px` as any) : (height as any) });
      }

      setState('entered');
      onTransitionEnd?.();
    } else if (currentStyles.height === 0) {
      setStyles(collapsedStyles);
      setState('exited');
      onTransitionEnd?.();
    }
  };

  return {
    state,
    getCollapseProps: (input) => ({
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
