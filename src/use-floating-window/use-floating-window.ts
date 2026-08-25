import { Accessor, createEffect, createSignal, onCleanup } from 'solid-js';

function useLatestRef<T>(value: T) {
  const ref = { current: value };
  ref.current = value;
  return ref;
}

interface FloatingWindowPositionConfig {
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
}

interface FloatingWindowPosition {
  /** Element offset from the left side of the positioning context */
  x: number;

  /** Element offset from the top side of the positioning context */
  y: number;
}

export interface UseFloatingWindowOptions {
  /** If `false`, the element can not be dragged. */
  enabled?: boolean;

  /**
   * Positioning strategy.
   * - `'fixed'` (default): left/top are viewport-relative; constrain uses the viewport
   * - `'absolute'`: left/top are relative to the offset parent; constrain uses the parent box
   */
  strategy?: 'fixed' | 'absolute';

  /**
   * If `true`, the element can only move within the current boundary.
   * For `strategy: 'fixed'` this is the viewport; for `'absolute'` this is the offset parent.
   */
  constrainToViewport?: boolean;

  /** The offset from the boundary edges when constraining the element. Requires `constrainToViewport: true`. */
  constrainOffset?: number;

  /** Selector of an element that should be used to drag floating window. If not specified, the entire root element is used as a drag target. */
  dragHandleSelector?: string;

  /** Selector of an element within `dragHandleSelector` that should be excluded from the drag event. */
  excludeDragHandleSelector?: string;

  /** If set, restricts movement to the specified axis */
  axis?: 'x' | 'y';

  /** Initial position. If not set, calculated from element styles. */
  initialPosition?: FloatingWindowPositionConfig;

  /** Called when the element position changes */
  onPositionChange?: (pos: FloatingWindowPosition) => void;

  /** Called when the drag starts */
  onDragStart?: () => void;

  /** Called when the drag stops */
  onDragEnd?: () => void;
}

export type SetFloatingWindowPosition = (position: FloatingWindowPositionConfig) => void;

export interface UseFloatingWindowReturnValue<T extends HTMLElement> {
  /** Ref to the element that should be draggable */
  ref: (element: T | null) => void;

  /** Function to set the position of the element */
  setPosition: SetFloatingWindowPosition;

  /** `true` if the element is currently being dragged */
  isDragging: Accessor<boolean>;
}

export function useFloatingWindow<T extends HTMLElement = HTMLDivElement>(
  options: UseFloatingWindowOptions = {},
): UseFloatingWindowReturnValue<T> {
  const [element, setElement] = createSignal<T | null>(null);
  const [isDragging, setIsDragging] = createSignal(false);

  const ref = { current: null as T | null };
  const offset = { current: { x: 0, y: 0 } };
  const pos = { current: { x: 0, y: 0 } };
  const isDraggingRef = { current: false };
  const initialized = { current: false };

  const enabledRef = useLatestRef(options.enabled);
  const onPositionChangeRef = useLatestRef(options.onPositionChange);
  const onDragStartRef = useLatestRef(options.onDragStart);
  const onDragEndRef = useLatestRef(options.onDragEnd);

  // Keep latest options in refs for event handlers
  enabledRef.current = options.enabled;
  onPositionChangeRef.current = options.onPositionChange;
  onDragStartRef.current = options.onDragStart;
  onDragEndRef.current = options.onDragEnd;
  const optionsRef = useLatestRef(options);
  optionsRef.current = options;

  const setDragging = (value: boolean) => {
    setIsDragging(value);
    isDraggingRef.current = value;
  };

  const assignRef = (node: T | null) => {
    if (node) {
      ref.current = node;
      setElement(() => node);
    } else {
      ref.current = null;
      setElement(null);
    }
  };

  createEffect(() => {
    const el = element();
    void options.constrainOffset;
    void options.initialPosition?.top;
    void options.initialPosition?.left;
    void options.initialPosition?.right;
    void options.initialPosition?.bottom;
    void options.constrainToViewport;
    void options.strategy;

    if (!initialized.current && el) {
      initialized.current = true;
      const strategy = optionsRef.current.strategy ?? 'fixed';
      el.style.position = strategy;
      pos.current = calculateInitialPosition(el, optionsRef.current);
      el.style.left = `${pos.current.x}px`;
      el.style.top = `${pos.current.y}px`;
      el.style.right = 'unset';
      el.style.bottom = 'unset';
    }
  });

  createEffect(() => {
    const el = element();
    optionsRef.current = options;
    // Track option deps
    void options.constrainToViewport;
    void options.constrainOffset;
    void options.dragHandleSelector;
    void options.excludeDragHandleSelector;
    void options.axis;
    void options.strategy;
    void options.initialPosition?.top;
    void options.initialPosition?.left;
    void options.initialPosition?.right;
    void options.initialPosition?.bottom;

    if (!el) {
      return;
    }

    const controller = new AbortController();
    const signal = controller.signal;

    const onStart = (e: MouseEvent | TouchEvent) => {
      if (enabledRef.current === false) {
        return;
      }

      const point = 'touches' in e ? e.touches[0] : e;
      if (!point) {
        return;
      }

      if ('button' in e && e.button !== 0) {
        return;
      }

      if (!getHandle(el, e.target, optionsRef.current)) {
        return;
      }

      setDragging(true);
      document.body.style.userSelect = 'none';
      (document.body.style as any).webkitUserSelect = 'none';

      const origin = getOriginPoint(el);
      offset.current = {
        x: point.clientX - origin.x,
        y: point.clientY - origin.y,
      };

      onDragStartRef.current?.();

      document.addEventListener('mousemove', onMove, { signal });
      document.addEventListener('mouseup', onEnd, { signal });
      document.addEventListener('touchmove', onMove, { signal, passive: false });
      document.addEventListener('touchend', onEnd, { signal });
      document.addEventListener('touchcancel', onEnd, { signal });
    };

    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!isDraggingRef.current) {
        return;
      }

      const point = 'touches' in e ? e.touches[0] : e;
      if (!point) {
        return;
      }
      e.preventDefault();

      let x = point.clientX - offset.current.x;
      let y = point.clientY - offset.current.y;

      // Convert viewport pointer position into positioning-context coordinates.
      const parentOrigin = getParentOrigin(el, optionsRef.current);
      x -= parentOrigin.x;
      y -= parentOrigin.y;

      const constrained = getConstrainedPosition(el, { x, y }, optionsRef.current);
      if (optionsRef.current.axis === 'x') {
        x = constrained.x;
        y = pos.current.y;
      } else if (optionsRef.current.axis === 'y') {
        x = pos.current.x;
        y = constrained.y;
      } else {
        x = constrained.x;
        y = constrained.y;
      }

      pos.current = { x, y };

      if (ref.current) {
        ref.current.style.left = `${x}px`;
        ref.current.style.top = `${y}px`;
      }

      onPositionChangeRef.current?.({ x, y });
    };

    const onEnd = () => {
      if (isDraggingRef.current) {
        setDragging(false);
        document.body.style.userSelect = '';
        (document.body.style as any).webkitUserSelect = '';
        onDragEndRef.current?.();
      }
    };

    el.addEventListener('mousedown', onStart, { signal });
    el.addEventListener('touchstart', onStart, { signal, passive: false });

    onCleanup(() => {
      controller.abort();
    });
  });

  createEffect(() => {
    const el = element();
    void options.constrainToViewport;
    void options.constrainOffset;
    void options.strategy;

    if (!el) {
      return;
    }

    const observer = new ResizeObserver(() => {
      const constrained = getConstrainedPosition(el, pos.current, optionsRef.current);
      pos.current = constrained;
      el.style.left = `${constrained.x}px`;
      el.style.top = `${constrained.y}px`;
    });

    observer.observe(el);

    onCleanup(() => {
      observer.disconnect();
    });
  });

  const setPosition = (position: FloatingWindowPositionConfig) => {
    const el = ref.current;
    if (!el) {
      return;
    }

    const current = optionsRef.current;
    const offsetValue = current.constrainOffset ?? 0;
    const bounds = getBoundarySize(el, current);

    let x: number | undefined;
    let y: number | undefined;

    if (position.left != null) {
      x = position.left;
    } else if (position.right != null) {
      x = bounds.width - el.offsetWidth - position.right;
    }

    if (position.top != null) {
      y = position.top;
    } else if (position.bottom != null) {
      y = bounds.height - el.offsetHeight - position.bottom;
    }

    x = x ?? pos.current.x;
    y = y ?? pos.current.y;

    if (current.constrainToViewport) {
      const clamped = clampToBounds(x, y, el, offsetValue, bounds);
      x = clamped.x;
      y = clamped.y;
    }

    pos.current = { x, y };
    el.style.position = current.strategy ?? 'fixed';
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    onPositionChangeRef.current?.({ x, y });
  };

  return {
    ref: assignRef,
    setPosition,
    isDragging,
  };
}

function px(v: string) {
  return v.endsWith('px') ? parseFloat(v) : 0;
}

function getParentOrigin(el: HTMLElement, options: UseFloatingWindowOptions) {
  if ((options.strategy ?? 'fixed') === 'fixed') {
    return { x: 0, y: 0 };
  }

  const parent = (el.offsetParent as HTMLElement | null) ?? el.parentElement;
  if (!parent) {
    return { x: 0, y: 0 };
  }

  const rect = parent.getBoundingClientRect();
  return { x: rect.left, y: rect.top };
}

function getOriginPoint(el: HTMLElement) {
  const rect = el.getBoundingClientRect();
  return { x: rect.left, y: rect.top };
}

function getBoundarySize(el: HTMLElement, options: UseFloatingWindowOptions) {
  if ((options.strategy ?? 'fixed') === 'fixed') {
    return { width: window.innerWidth, height: window.innerHeight };
  }

  const parent = (el.offsetParent as HTMLElement | null) ?? el.parentElement;
  if (!parent) {
    return { width: window.innerWidth, height: window.innerHeight };
  }

  return { width: parent.clientWidth, height: parent.clientHeight };
}

function calculateInitialPosition(
  el: HTMLElement,
  options: UseFloatingWindowOptions,
): { x: number; y: number } {
  const offset = options.constrainOffset ?? 0;
  const bounds = getBoundarySize(el, options);
  const style = window.getComputedStyle(el);
  const top = options.initialPosition?.top;
  const left = options.initialPosition?.left;
  const right = options.initialPosition?.right;
  const bottom = options.initialPosition?.bottom;
  const width = el.offsetWidth;
  const height = el.offsetHeight;

  let x = offset;
  let y = offset;

  if (left != null) {
    x = left;
  } else if (right != null) {
    x = bounds.width - width - right;
  } else {
    x = px(style.left) || bounds.width - width - px(style.right) || offset;
  }

  if (top != null) {
    y = top;
  } else if (bottom != null) {
    y = bounds.height - height - bottom;
  } else {
    y = px(style.top) || bounds.height - height - px(style.bottom) || offset;
  }

  return options.constrainToViewport ? clampToBounds(x, y, el, options.constrainOffset, bounds) : { x, y };
}

function getConstrainedPosition(
  el: HTMLElement,
  pos: FloatingWindowPosition,
  options: UseFloatingWindowOptions,
) {
  if (!options.constrainToViewport || !el) {
    return pos;
  }

  const offset = options.constrainOffset ?? 0;
  const bounds = getBoundarySize(el, options);
  return clampToBounds(pos.x, pos.y, el, offset, bounds);
}

function matchesExcludeSelector(target: Node, excludeSelector?: string): boolean {
  if (!excludeSelector) {
    return false;
  }
  if (!(target instanceof Element)) {
    return false;
  }

  return Boolean(target.closest(excludeSelector));
}

function getHandle(
  el: HTMLElement,
  target: EventTarget | null,
  options: UseFloatingWindowOptions,
): boolean {
  if (!(target instanceof Node)) {
    return false;
  }

  if (!options.dragHandleSelector) {
    return !matchesExcludeSelector(target, options.excludeDragHandleSelector);
  }

  const handles = Array.from(el.querySelectorAll(options.dragHandleSelector));
  return handles.some(
    handle =>
      handle.contains(target) && !matchesExcludeSelector(target, options.excludeDragHandleSelector),
  );
}

function clampToBounds(
  x: number,
  y: number,
  el: HTMLElement,
  offset: number = 0,
  bounds: { width: number; height: number },
): { x: number; y: number } {
  const maxX = bounds.width - el.offsetWidth - offset;
  const maxY = bounds.height - el.offsetHeight - offset;

  return {
    x: Math.min(Math.max(offset, x), Math.max(offset, maxX)),
    y: Math.min(Math.max(offset, y), Math.max(offset, maxY)),
  };
}

export namespace useFloatingWindow {
  export type Options = UseFloatingWindowOptions;
  export type Position = FloatingWindowPosition;
  export type SetPosition = SetFloatingWindowPosition;
  export type ReturnValue<T extends HTMLElement> = UseFloatingWindowReturnValue<T>;
}
