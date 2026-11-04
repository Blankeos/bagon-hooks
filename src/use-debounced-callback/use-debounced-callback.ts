import { onCleanup } from 'solid-js';

export interface UseDebouncedCallbackOptions {
  /** Debounce delay in milliseconds */
  delay: number;

  /** Call the pending callback (instead of dropping it) when the owner is disposed, `false` by default */
  flushOnUnmount?: boolean;

  /** Call the callback immediately on the first call of a burst, `false` by default */
  leading?: boolean;

  /** Maximum time in milliseconds the callback can be delayed, unlimited by default */
  maxWait?: number;
}

export type UseDebouncedCallbackReturnValue<T extends (...args: any[]) => any> = ((
  ...args: Parameters<T>
) => void) & {
  /** Invokes the pending callback immediately (no-op if nothing is pending) */
  flush: () => void;
  /** Drops the pending callback */
  cancel: () => void;
  /** `true` while a call is waiting to be invoked */
  isPending: () => boolean;
};

/**
 * Debounces `callback`. The returned function exposes `flush`, `cancel` and `isPending`.
 *
 * @param callback Function to debounce
 * @param options Delay in ms, or `{ delay, flushOnUnmount, leading, maxWait }`
 */
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  options: number | UseDebouncedCallbackOptions,
): UseDebouncedCallbackReturnValue<T> {
  const { delay, flushOnUnmount, leading, maxWait } =
    typeof options === 'number'
      ? {
          delay: options,
          flushOnUnmount: false,
          leading: false,
          maxWait: undefined as number | undefined,
        }
      : options;

  let debounceTimer: any = 0;
  let maxWaitTimer: any = 0;
  let latestArgs: Parameters<T> | null = null;

  const currentCallback = Object.assign(
    (...args: Parameters<T>) => {
      clearTimeout(debounceTimer);
      latestArgs = args;

      const isFirstCall = currentCallback._isFirstCall;
      currentCallback._isFirstCall = false;

      function clearTimeoutAndLeadingRef() {
        clearTimeout(debounceTimer);
        clearTimeout(maxWaitTimer);
        debounceTimer = 0;
        maxWaitTimer = 0;
        currentCallback._isFirstCall = true;
        currentCallback._hasPendingCallback = false;
      }

      function startMaxWaitTimer() {
        if (maxWait !== undefined && maxWaitTimer === 0) {
          maxWaitTimer = setTimeout(() => {
            maxWaitTimer = 0;
            if (debounceTimer !== 0 && currentCallback._hasPendingCallback) {
              const pendingArgs = latestArgs!;
              clearTimeoutAndLeadingRef();
              callback(...pendingArgs);
            }
          }, maxWait);
        }
      }

      const cancel = () => {
        clearTimeoutAndLeadingRef();
      };

      if (leading && isFirstCall) {
        callback(...args);

        currentCallback.flush = () => {
          if (debounceTimer !== 0) {
            clearTimeoutAndLeadingRef();
          }
        };
        currentCallback.cancel = cancel;
        debounceTimer = setTimeout(clearTimeoutAndLeadingRef, delay);
        startMaxWaitTimer();
        return;
      }

      currentCallback._hasPendingCallback = true;

      const flush = () => {
        if (debounceTimer !== 0) {
          clearTimeoutAndLeadingRef();
          callback(...args);
        }
      };

      currentCallback.flush = flush;
      currentCallback.cancel = cancel;

      // With `leading`, trailing calls only reset the cooldown (dropping the call) — matches Mantine.
      debounceTimer = setTimeout(leading ? clearTimeoutAndLeadingRef : flush, delay);
      startMaxWaitTimer();
    },
    {
      flush: () => {},
      cancel: () => {},
      isPending: () => currentCallback._hasPendingCallback,
      _isFirstCall: true,
      _hasPendingCallback: false,
    },
  );

  onCleanup(() => {
    if (flushOnUnmount) {
      currentCallback.flush();
    } else {
      currentCallback.cancel();
    }
  });

  return currentCallback;
}

export namespace useDebouncedCallback {
  export type Options = UseDebouncedCallbackOptions;
  export type ReturnValue<T extends (...args: any[]) => any> = UseDebouncedCallbackReturnValue<T>;
}
