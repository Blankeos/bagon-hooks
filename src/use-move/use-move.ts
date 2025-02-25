import { createEffect, createSignal, onCleanup, onMount } from 'solid-js';
import { clamp } from '../utils/clamp';

export interface UseMovePosition {
  x: number;
  y: number;
}

export function clampUseMovePosition(position: UseMovePosition) {
  return {
    x: clamp(position.x, 0, 1),
    y: clamp(position.y, 0, 1),
  };
}

interface useMoveHandlers {
  onScrubStart?: () => void;
  onScrubEnd?: () => void;
}

export function useMove<T extends HTMLElement = HTMLDivElement>(
  onChange: (value: UseMovePosition) => void,
  handlers?: useMoveHandlers,
  dir: 'ltr' | 'rtl' = 'ltr',
) {
  const [ref, setRef] = createSignal<T>();
  let mounted = false;
  let isSliding = false;
  let frame = 0;
  const [active, setActive] = createSignal(false);

  onMount(() => {
    mounted = true;
  });

  createEffect(() => {
    const onScrub = ({ x, y }: UseMovePosition) => {
      cancelAnimationFrame(frame);

      frame = requestAnimationFrame(() => {
        if (mounted && ref()) {
          ref()!.style.userSelect = 'none';
          const rect = ref()!.getBoundingClientRect();

          if (rect.width && rect.height) {
            const _x = clamp((x - rect.left) / rect.width, 0, 1);

            onChange({
              x: dir === 'ltr' ? _x : 1 - _x,
              y: clamp((y - rect.top) / rect.height, 0, 1),
            });
          }
        }
      });
    };

    const bindEvents = () => {
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', stopScrubbing);
      document.addEventListener('touchmove', onTouchMove);
      document.addEventListener('touchend', stopScrubbing);
    };

    const unbindEvents = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', stopScrubbing);
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('touchend', stopScrubbing);
    };

    const startScrubbing = () => {
      if (!isSliding && mounted) {
        isSliding = true;
        typeof handlers?.onScrubStart === 'function' && handlers.onScrubStart();
        setActive(true);
        bindEvents();
      }
    };

    const stopScrubbing = () => {
      if (isSliding && mounted) {
        isSliding = false;
        setActive(false);
        unbindEvents();
        setTimeout(() => {
          typeof handlers?.onScrubEnd === 'function' && handlers.onScrubEnd();
        }, 0);
      }
    };

    const onMouseDown = (event: MouseEvent) => {
      startScrubbing();
      event.preventDefault();
      onMouseMove(event);
    };

    const onMouseMove = (event: MouseEvent) => onScrub({ x: event.clientX, y: event.clientY });

    const onTouchStart = (event: TouchEvent) => {
      if (event.cancelable) {
        event.preventDefault();
      }

      startScrubbing();
      onTouchMove(event);
    };

    const onTouchMove = (event: TouchEvent) => {
      if (event.cancelable) {
        event.preventDefault();
      }

      onScrub({
        x: event?.changedTouches?.[0]?.clientX ?? 0,
        y: event?.changedTouches?.[0]?.clientY ?? 0,
      });
    };

    ref()?.addEventListener('mousedown', onMouseDown);
    ref()?.addEventListener('touchstart', onTouchStart, { passive: false });

    onCleanup(() => {
      if (ref()) {
        ref()!.removeEventListener('mousedown', onMouseDown);
        ref()!.removeEventListener('touchstart', onTouchStart);
      }
    });
  });

  return { ref: setRef, active };
}
