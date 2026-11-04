import { createSignal, onCleanup, onMount } from 'solid-js';

export interface UseOrientationOptions {
  /** Default angle value, used until the real can be retrieved
   * (during server side rendering and before js executes on the page)
   * If not provided, the default value is `0`
   * */
  defaultAngle?: number;

  /** Default type value, used until the real can be retrieved
   * (during server side rendering and before js executes on the page)
   * If not provided, the default value is `'landscape-primary'`
   * */
  defaultType?: OrientationType;

  /** If true, the initial value will be resolved after mount (ssr safe)
   *  If false, the initial value will be resolved synchronously (ssr unsafe)
   *  True by default.
   */
  getInitialValueInEffect?: boolean;
}

export interface UseOrientationReturnType {
  angle: number;
  type: OrientationType;
}

function getInitialValue(
  initialValue: UseOrientationReturnType,
  getInitialValueInEffect: boolean,
): UseOrientationReturnType {
  if (getInitialValueInEffect) {
    return initialValue;
  }

  if (typeof window !== 'undefined' && 'screen' in window) {
    return {
      angle: window.screen.orientation?.angle ?? initialValue.angle,
      type: window.screen.orientation?.type ?? initialValue.type,
    };
  }

  return initialValue;
}

/**
 * Returns the current orientation of the device.
 */
export function useOrientation({
  defaultAngle = 0,
  defaultType = 'landscape-primary',
  getInitialValueInEffect = true,
}: UseOrientationOptions = {}) {
  const [orientation, setOrientation] = createSignal<UseOrientationReturnType>(
    getInitialValue({ angle: defaultAngle, type: defaultType }, getInitialValueInEffect),
  );

  const handleOrientationChange = (event: Event) => {
    const target = event.currentTarget as ScreenOrientation;
    setOrientation({ angle: target?.angle || 0, type: target?.type || 'landscape-primary' });
  };

  onMount(() => {
    const screenOrientation = window.screen.orientation;

    if (screenOrientation) {
      setOrientation({ angle: screenOrientation.angle, type: screenOrientation.type });
      screenOrientation.addEventListener('change', handleOrientationChange);
      onCleanup(() => screenOrientation.removeEventListener('change', handleOrientationChange));
    }
  });

  return orientation;
}

export namespace useOrientation {
  export type Options = UseOrientationOptions;
  export type ReturnType = UseOrientationReturnType;
}
