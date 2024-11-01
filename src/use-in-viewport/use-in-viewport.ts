import { createSignal } from 'solid-js';

export function useInViewport<T extends HTMLElement>() {
  let observer: IntersectionObserver | null = null;
  const [inViewport, setInViewport] = createSignal(false);

  const ref = (node: T | null) => {
    if (typeof IntersectionObserver !== 'undefined') {
      if (node && !observer) {
        observer = new IntersectionObserver(([entry]) => {
          if (entry) setInViewport(entry.isIntersecting);
        });
      } else {
        observer?.disconnect();
      }

      if (node) {
        observer?.observe(node);
      } else {
        setInViewport(false);
      }
    }
  };

  return { ref, inViewport };
}
