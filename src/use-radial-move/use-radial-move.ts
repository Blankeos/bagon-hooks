import { createEffect, createSignal, onCleanup, type Accessor } from 'solid-js';
import { clamp } from '../utils/clamp';

function radiansToDegrees(radians: number) {
  return radians * (180 / Math.PI);
}

function getElementCenter(element: HTMLElement) {
  const rect = element.getBoundingClientRect();
  return [rect.left + rect.width / 2, rect.top + rect.height / 2] as const;
}

function getAngle(coordinates: [number, number], element: HTMLElement) {
  const center = getElementCenter(element);
  const x = coordinates[0] - center[0];
  const y = coordinates[1] - center[1];
  const deg = radiansToDegrees(Math.atan2(x, y)) + 180;
  return 360 - deg;
}

function toFixed(value: number, digits: number) {
  return parseFloat(value.toFixed(digits));
}

function getDigitsAfterDot(value: number) {
  return value.toString().split('.')[1]?.length || 0;
}

export function normalizeRadialValue(degree: number, step: number) {
  const clamped = clamp(degree, 0, 360);
  const high = Math.ceil(clamped / step);
  const low = Math.round(clamped / step);
  return toFixed(
    high >= clamped / step ? (high * step === 360 ? 0 : high * step) : low * step,
    getDigitsAfterDot(step),
  );
}

export interface UseRadialMoveOptions {
  /** Number by which value is incremented/decremented when mouse is moved, `0.01` by default */
  step?: number;

  /** Called after mouse up with the last value */
  onChangeEnd?: (value: number) => void;

  /** Called when radial move starts */
  onScrubStart?: () => void;

  /** Called when radial move ends */
  onScrubEnd?: () => void;
}

export interface UseRadialMoveReturnValue<
  T extends HTMLElement = any,
> {
  /** Ref callback to attach to the radial move target */
  ref: (node: T | null) => (() => void) | void;

  /** Indicates whether radial move is currently active */
  active: Accessor<boolean>;
}

export function useRadialMove<
  T extends HTMLElement = any,
>(
  onChange: (value: number) => void,
  options: UseRadialMoveOptions = {},
): UseRadialMoveReturnValue<T> {
  const [active, setActive] = createSignal(false);
  let cleanupDocument: (() => void) | null = null;

  let onChangeCurrent = onChange;
  let stepCurrent = options.step ?? 0.01;
  let onChangeEndCurrent = options.onChangeEnd;
  let onScrubStartCurrent = options.onScrubStart;
  let onScrubEndCurrent = options.onScrubEnd;

  createEffect(() => {
    onChangeCurrent = onChange;
    stepCurrent = options.step ?? 0.01;
    onChangeEndCurrent = options.onChangeEnd;
    onScrubStartCurrent = options.onScrubStart;
    onScrubEndCurrent = options.onScrubEnd;
  });

  onCleanup(() => {
    cleanupDocument?.();
  });

  const refCallback = (node: T | null) => {
    if (!node) {
      return undefined;
    }

    const update = (event: { clientX: number; clientY: number }, done = false) => {
      node.style.userSelect = 'none';
      const deg = getAngle([event.clientX, event.clientY], node);
      const newValue = normalizeRadialValue(deg, stepCurrent || 1);

      onChangeCurrent(newValue);
      done && onChangeEndCurrent?.(newValue);
    };

    const beginTracking = () => {
      onScrubStartCurrent?.();
      setActive(true);
      document.addEventListener('mousemove', handleMouseMove, false);
      document.addEventListener('mouseup', handleMouseUp, false);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd, false);
    };

    const endTracking = () => {
      onScrubEndCurrent?.();
      setActive(false);
      document.removeEventListener('mousemove', handleMouseMove, false);
      document.removeEventListener('mouseup', handleMouseUp, false);
      document.removeEventListener('touchmove', handleTouchMove, false);
      document.removeEventListener('touchend', handleTouchEnd, false);
    };

    const onMouseDown = (event: MouseEvent) => {
      beginTracking();
      update(event);
    };

    const handleMouseMove = (event: MouseEvent) => {
      update(event);
    };

    const handleMouseUp = (event: MouseEvent) => {
      update(event, true);
      endTracking();
    };

    const handleTouchMove = (event: TouchEvent) => {
      event.preventDefault();
      const touch = event.touches[0];
      if (touch) {
        update(touch);
      }
    };

    const handleTouchEnd = (event: TouchEvent) => {
      const touch = event.changedTouches[0];
      if (touch) {
        update(touch, true);
      }
      endTracking();
    };

    const handleTouchStart = (event: TouchEvent) => {
      event.preventDefault();
      beginTracking();
      const touch = event.touches[0];
      if (touch) {
        update(touch);
      }
    };

    node.addEventListener('mousedown', onMouseDown);
    node.addEventListener('touchstart', handleTouchStart, { passive: false });

    cleanupDocument = () => {
      document.removeEventListener('mousemove', handleMouseMove, false);
      document.removeEventListener('mouseup', handleMouseUp, false);
      document.removeEventListener('touchmove', handleTouchMove, false);
      document.removeEventListener('touchend', handleTouchEnd, false);
    };

    return () => {
      node.removeEventListener('mousedown', onMouseDown);
      node.removeEventListener('touchstart', handleTouchStart);
      cleanupDocument?.();
      cleanupDocument = null;
    };
  };

  return { ref: refCallback, active };
}

export namespace useRadialMove {
  export type Options = UseRadialMoveOptions;
  export type ReturnValue<T extends HTMLElement = any> = UseRadialMoveReturnValue<T>;
}
