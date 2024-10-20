import { createEffect, createSignal } from 'solid-js';

/**
 * Returns the current orientation of the device.
 */
export function useOrientation() {
  const [orientation, setOrientation] = createSignal({ angle: 0, type: 'landscape-primary' });

  const handleOrientationChange = (event: Event) => {
    const target = event.currentTarget as ScreenOrientation;
    setOrientation({ angle: target?.angle || 0, type: target?.type || 'landscape-primary' });
  };

  createEffect(() => {
    window.screen.orientation?.addEventListener('change', handleOrientationChange);
    return () => window.screen.orientation?.removeEventListener('change', handleOrientationChange);
  });

  return orientation;
}
