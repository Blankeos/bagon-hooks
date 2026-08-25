import { onCleanup, onMount } from 'solid-js';

export type UseLongPressEvent = 'mouse' | 'touch';

export interface UseLongPressOptions {
  /** Time in milliseconds to trigger the long press, default is 400ms */
  threshold?: number;

  /** Input types that can trigger the long press, `['mouse', 'touch']` by default */
  events?: UseLongPressEvent[];

  /** If set, the long press is canceled when the pointer moves further than the given distance in px from the start position. `true` uses a 10px threshold, a number sets a custom threshold. `false` by default */
  cancelOnMove?: boolean | number;

  /** Callback triggered when the long press starts */
  onStart?: (event: MouseEvent | TouchEvent) => void;

  /** Callback triggered when the long press finishes */
  onFinish?: (event: MouseEvent | TouchEvent) => void;

  /** Callback triggered when the long press is canceled */
  onCancel?: (event: MouseEvent | TouchEvent) => void;
}

export interface UseLongPressReturnValue {
  onMouseDown?: (event: MouseEvent) => void;
  onMouseUp?: (event: MouseEvent) => void;
  onMouseLeave?: (event: MouseEvent) => void;
  onMouseMove?: (event: MouseEvent) => void;
  onTouchStart?: (event: TouchEvent) => void;
  onTouchEnd?: (event: TouchEvent) => void;
  onTouchCancel?: (event: TouchEvent) => void;
  onTouchMove?: (event: TouchEvent) => void;
}

const DEFAULT_EVENTS: UseLongPressEvent[] = ['mouse', 'touch'];
const DEFAULT_MOVE_THRESHOLD = 10;

/**
 * Detects long-press gestures and returns mouse/touch handlers to spread onto an element.
 */
export function useLongPress(
  onLongPress: (event: MouseEvent | TouchEvent) => void,
  options: UseLongPressOptions = {},
): UseLongPressReturnValue {
  const threshold = options.threshold ?? 400;
  const events = options.events ?? DEFAULT_EVENTS;
  const cancelOnMove = options.cancelOnMove ?? false;
  const { onStart, onFinish, onCancel } = options;

  let isLongPressActive = false;
  let isPressed = false;
  let timeout = -1;
  let startPosition: { x: number; y: number } | null = null;

  onMount(() => {
    onCleanup(() => window.clearTimeout(timeout));
  });

  if (typeof onLongPress !== 'function') {
    return {} as UseLongPressReturnValue;
  }

  const moveEnabled = cancelOnMove !== false;
  const moveThreshold =
    cancelOnMove === true
      ? DEFAULT_MOVE_THRESHOLD
      : cancelOnMove === false
        ? 0
        : cancelOnMove;

  const start = (event: MouseEvent | TouchEvent) => {
    if (!isMouseEvent(event) && !isTouchEvent(event)) {
      return;
    }

    onStart?.(event);

    startPosition = getEventPosition(event);
    isPressed = true;
    timeout = window.setTimeout(() => {
      onLongPress(event);
      isLongPressActive = true;
    }, threshold);
  };

  const cancel = (event: MouseEvent | TouchEvent) => {
    if (!isMouseEvent(event) && !isTouchEvent(event)) {
      return;
    }

    if (isLongPressActive) {
      onFinish?.(event);
    } else if (isPressed) {
      onCancel?.(event);
    }

    isLongPressActive = false;
    isPressed = false;
    startPosition = null;

    if (timeout !== -1) {
      window.clearTimeout(timeout);
      timeout = -1;
    }
  };

  const move = (event: MouseEvent | TouchEvent) => {
    if (!moveEnabled || !isPressed || isLongPressActive) {
      return;
    }

    const position = getEventPosition(event);
    if (!position || !startPosition) {
      return;
    }

    const dx = position.x - startPosition.x;
    const dy = position.y - startPosition.y;

    if (Math.sqrt(dx * dx + dy * dy) > moveThreshold) {
      cancel(event);
    }
  };

  const handlers: UseLongPressReturnValue = {};

  if (events.includes('mouse')) {
    handlers.onMouseDown = start;
    handlers.onMouseUp = cancel;
    handlers.onMouseLeave = cancel;
    if (moveEnabled) {
      handlers.onMouseMove = move;
    }
  }

  if (events.includes('touch')) {
    handlers.onTouchStart = start;
    handlers.onTouchEnd = cancel;
    handlers.onTouchCancel = cancel;
    if (moveEnabled) {
      handlers.onTouchMove = move;
    }
  }

  return handlers;
}

function getEventPosition(event: MouseEvent | TouchEvent): { x: number; y: number } | null {
  if (isTouchEvent(event)) {
    const touch = event.touches[0] ?? event.changedTouches[0];
    return touch ? { x: touch.clientX, y: touch.clientY } : null;
  }

  return { x: event.clientX, y: event.clientY };
}

function isTouchEvent(event: MouseEvent | TouchEvent): event is TouchEvent {
  return typeof TouchEvent !== 'undefined' && event instanceof TouchEvent;
}

function isMouseEvent(event: MouseEvent | TouchEvent): event is MouseEvent {
  return event instanceof MouseEvent;
}

export namespace useLongPress {
  export type Options = UseLongPressOptions;
  export type ReturnValue = UseLongPressReturnValue;
}
