import { createSignal } from 'solid-js';

/** Improved: callback. */
export function useIntersection<T extends HTMLElement = any>(
  options?: ConstructorParameters<typeof IntersectionObserver>[1] & {
    callback?: (entry?: IntersectionObserverEntry) => void;
  },
) {
  const [entry, setEntry] = createSignal<IntersectionObserverEntry | null>(null);

  let observer: IntersectionObserver | null = null;

  const ref = (element: T | null) => {
    if (observer) {
      observer.disconnect();
      observer = null;
    }

    if (element === null) {
      setEntry(null);
      return;
    }

    observer = new IntersectionObserver(([_entry]) => {
      if (_entry) setEntry(_ => _entry);
      if (options?.callback) options.callback(_entry);
    }, options);

    observer.observe(element);
  };

  return { ref, entry };
}
