import { Accessor, createEffect, createSignal, onCleanup } from 'solid-js';

export interface UseScrollSpyHeadingData {
  /** Heading depth, 1-6 */
  depth: number;

  /** Heading text content value or value of `data-heading` attribute if `getDepth` and `getValue` are not set */
  value: string;

  /** Unique heading id generated based on value */
  id: string;

  /** Get corresponding heading node */
  getNode: () => HTMLHeadingElement;
}

export interface UseScrollSpyOptions {
  /** Selector to get all headings, `'h1, h2, h3, h4, h5, h6'` by default */
  selector?: string;

  /** A function to retrieve depth of heading, by default depth is calculated based on tag name */
  getDepth?: (element: HTMLHeadingElement) => number;

  /** A function to retrieve heading value, by default `element.getAttribute('data-heading') || element.textContent || ''` is used */
  getValue?: (element: HTMLHeadingElement) => string;

  /** Host element to attach scroll event listener, if not set, `window` is used */
  scrollHost?: HTMLElement | string | null | (() => HTMLElement | string | null | undefined);

  /** Offset from the top of the viewport or scroll host to use when determining the active heading, `0` by default */
  offset?: number;
}

export interface UseScrollSpyScrollToOptions {
  /** Scroll behavior, `'smooth'` by default */
  behavior?: ScrollBehavior;
}

export interface UseScrollSpyReturnType {
  /** Index of the active heading in the `data` array */
  active: Accessor<number>;

  /** Headings data */
  data: Accessor<UseScrollSpyHeadingData[]>;

  /** True if headings were found in the given `selector` */
  initialized: Accessor<boolean>;

  /** Function to update headings based on the current selector value */
  reinitialize: () => void;

  /**
   * Scroll the configured `scrollHost` (or window) to a heading by index.
   * Prefer this over `heading.getNode().scrollIntoView()` — that also scrolls
   * ancestor containers (including the page).
   */
  scrollTo: (index: number, scrollToOptions?: UseScrollSpyScrollToOptions) => void;
}

function getDefaultDepth(element: HTMLHeadingElement) {
  return Number(element.tagName[1]);
}

function getDefaultValue(element: HTMLHeadingElement) {
  return element.getAttribute('data-heading') || element.textContent || '';
}

function getHeadingsData(
  headings: HTMLHeadingElement[],
  getDepth: (element: HTMLHeadingElement) => number,
  getValue: (element: HTMLHeadingElement) => string,
): UseScrollSpyHeadingData[] {
  const data: UseScrollSpyHeadingData[] = [];

  for (let i = 0; i < headings.length; i += 1) {
    const heading = headings[i]!;
    data.push({
      depth: getDepth(heading),
      value: getValue(heading),
      getNode: () => heading,
      id: heading.id,
    });
  }

  return data;
}

function resolveScrollHost(
  scrollHost: UseScrollSpyOptions['scrollHost'],
): HTMLElement | Window {
  const value = typeof scrollHost === 'function' ? scrollHost() : scrollHost;
  if (!value) {
    return window;
  }
  if (typeof value === 'string') {
    return document.querySelector<HTMLElement>(value) || window;
  }
  return value;
}

function getHeadingTop(heading: HTMLHeadingElement, host: HTMLElement | Window) {
  const headingRect = heading.getBoundingClientRect();
  if (host === window || host === document.documentElement || host === document.body) {
    return headingRect.top;
  }

  const hostRect = (host as HTMLElement).getBoundingClientRect();
  return headingRect.top - hostRect.top;
}

/** Standard scrollspy: last heading whose top is at or above the offset. Defaults to 0. */
function getActiveElement(headings: HTMLHeadingElement[], offset: number, host: HTMLElement | Window) {
  if (headings.length === 0) {
    return -1;
  }

  let active = 0;
  for (let i = 0; i < headings.length; i += 1) {
    const heading = headings[i];
    if (!heading) continue;
    const top = getHeadingTop(heading, host);
    if (top <= offset) {
      active = i;
    }
  }

  return active;
}

export function useScrollSpy(options: UseScrollSpyOptions = {}): UseScrollSpyReturnType {
  const [active, setActive] = createSignal(-1);
  const [headingsData, setHeadingsData] = createSignal<UseScrollSpyHeadingData[]>([]);
  const [initialized, setInitialized] = createSignal(false);
  const headingsRef: { current: HTMLHeadingElement[] } = { current: [] };
  const getDepth = options.getDepth || getDefaultDepth;
  const getValue = options.getValue || getDefaultValue;

  const initialize = () => {
    const host = resolveScrollHost(options.scrollHost);
    const selector = options.selector || 'h1, h2, h3, h4, h5, h6';
    // Query from document so selectors like `.spy-demo h2` still work when the
    // host element itself matches the ancestor part of the selector, then scope.
    let headings = Array.from(document.querySelectorAll(selector)) as HTMLHeadingElement[];
    if (host !== window) {
      headings = headings.filter(heading => (host as HTMLElement).contains(heading));
    }
    headingsRef.current = headings;
    setInitialized(headings.length > 0);
    setHeadingsData(getHeadingsData(headings, getDepth, getValue));
    setActive(getActiveElement(headings, options.offset || 0, host));
  };

  createEffect(() => {
    void options.selector;
    void options.offset;
    // Track resolved host so late-bound refs/signals reinitialize the spy.
    const host = resolveScrollHost(options.scrollHost);
    initialize();
    const handleScroll = () => {
      setActive(getActiveElement(headingsRef.current, options.offset || 0, host));
    };

    const scrollTarget: HTMLElement | Window = host === window ? window : (host as HTMLElement);
    scrollTarget.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    // Initialize immediately and after layout settles.
    handleScroll();
    requestAnimationFrame(handleScroll);

    onCleanup(() => {
      scrollTarget.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    });
  });

  const scrollTo = (index: number, scrollToOptions: UseScrollSpyScrollToOptions = {}) => {
    const heading = headingsRef.current[index];
    if (!heading) return;

    const host = resolveScrollHost(options.scrollHost);
    const offset = options.offset || 0;
    const behavior = scrollToOptions.behavior ?? 'smooth';

    // Scroll the host directly — Element.scrollIntoView also moves ancestors.
    if (host === window || host === document.documentElement || host === document.body) {
      const top = heading.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior });
      return;
    }

    const hostEl = host as HTMLElement;
    const top =
      heading.getBoundingClientRect().top - hostEl.getBoundingClientRect().top + hostEl.scrollTop - offset;
    hostEl.scrollTo({ top, behavior });
  };

  return {
    active,
    data: headingsData,
    reinitialize: initialize,
    initialized,
    scrollTo,
  };
}
