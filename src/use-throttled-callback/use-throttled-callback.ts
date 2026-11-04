import { onCleanup } from 'solid-js';

/**
 * Keeps a stable function identity that always invokes the latest callback.
 */
function createCallbackRef<T extends (...args: any[]) => any>(callback: T) {
  const callbackRef = { current: callback };
  const stable = ((...args: Parameters<T>) => callbackRef.current(...args)) as T;
  return { stable, callbackRef };
}

export function useThrottledCallbackWithClearTimeout<T extends (...args: any[]) => any>(
  callback: T,
  wait: number,
) {
  const { stable: handleCallback, callbackRef } = createCallbackRef(callback);
  callbackRef.current = callback;

  let latestInArgsRef: Parameters<T> | null = null;
  let latestOutArgsRef: Parameters<T> | null = null;
  let active = true;
  let waitRef = wait;
  let timeoutRef = -1;

  const clearTimeoutFn = () => {
    clearTimeout(timeoutRef);
    timeoutRef = -1;
    active = true;
    latestInArgsRef = null;
    latestOutArgsRef = null;
  };

  const callThrottledCallback = (...args: Parameters<T>) => {
    latestInArgsRef = args;
    latestOutArgsRef = args;
    active = false;
    try {
      handleCallback(...args);
    } catch (error) {
      active = true;
      throw error;
    }
  };

  const timerCallback = () => {
    if (latestInArgsRef && latestInArgsRef !== latestOutArgsRef) {
      callThrottledCallback(...latestInArgsRef);
      timeoutRef = setTimeout(timerCallback, waitRef) as unknown as number;
    } else {
      active = true;
    }
  };

  const throttled: T = ((...args: Parameters<T>) => {
    waitRef = wait;
    callbackRef.current = callback;

    if (active) {
      callThrottledCallback(...args);
      timeoutRef = setTimeout(timerCallback, waitRef) as unknown as number;
    } else {
      latestInArgsRef = args;
    }
  }) as T;

  onCleanup(clearTimeoutFn);

  return [throttled, clearTimeoutFn] as const;
}

export function useThrottledCallback<T extends (...args: any[]) => any>(callback: T, wait: number) {
  return useThrottledCallbackWithClearTimeout(callback, wait)[0];
}
