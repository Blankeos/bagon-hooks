import { Accessor, createEffect, createSignal, onCleanup } from 'solid-js';

export interface UseFetchOptions extends RequestInit {
  /** Automatically invoke fetch on mount / when url changes. Default: `true` */
  autoInvoke?: boolean;
}

export interface UseFetchReturnValue<T> {
  data: Accessor<T | null>;
  loading: Accessor<boolean>;
  error: Accessor<Error | null>;
  refetch: () => Promise<T | Error>;
  abort: () => void;
}

/**
 * Fetches JSON from `url` with loading / error / data signals.
 * Aborts in-flight requests on cleanup or when `abort()` is called.
 *
 * @param url URL string or accessor returning a URL
 * @param options Fetch options + `autoInvoke`
 */
export function useFetch<T>(
  url: string | Accessor<string>,
  { autoInvoke = true, ...options }: UseFetchOptions = {},
): UseFetchReturnValue<T> {
  const [data, setData] = createSignal<T | null>(null);
  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal<Error | null>(null);

  let controller: AbortController | null = null;

  const resolveUrl = () => (typeof url === 'function' ? (url as Accessor<string>)() : url);

  const abort = () => {
    controller?.abort('');
    controller = null;
  };

  const refetch = (): Promise<T | Error> => {
    const currentUrl = resolveUrl();

    abort();
    controller = new AbortController();
    setLoading(true);
    setError(null);

    return fetch(currentUrl, { ...options, signal: controller.signal })
      .then(res => {
        if (!res.ok) {
          throw new Error(`Request failed with status ${res.status}`);
        }
        return res.json();
      })
      .then((res: T) => {
        setData(() => res);
        setLoading(false);
        return res;
      })
      .catch((err: Error) => {
        setLoading(false);
        if (err?.name !== 'AbortError') {
          setError(err);
        }
        return err;
      });
  };

  createEffect(() => {
    // Track url when it's an accessor
    resolveUrl();

    if (autoInvoke) {
      refetch();
    }

    onCleanup(abort);
  });

  return { data, loading, error, refetch, abort };
}

export namespace useFetch {
  export type Options = UseFetchOptions;
  export type ReturnValue<T> = UseFetchReturnValue<T>;
}
