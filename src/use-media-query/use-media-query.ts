import { Accessor, createEffect, createSignal } from 'solid-js';

export interface UseMediaQueryOptions {
  getInitialValueInEffect: boolean;
}

type MediaQueryCallback = (event: { matches: boolean; media: string }) => void;

/**
 * Older versions of Safari (shipped withCatalina and before) do not support addEventListener on matchMedia
 * https://stackoverflow.com/questions/56466261/matchmedia-addlistener-marked-as-deprecated-addeventlistener-equivalent
 * */
function attachMediaListener(query: MediaQueryList, callback: MediaQueryCallback) {
  try {
    query.addEventListener('change', callback);
    return () => query.removeEventListener('change', callback);
  } catch (e) {
    query.addListener(callback);
    return () => query.removeListener(callback);
  }
}

function getInitialValue(query: string, initialValue?: boolean) {
  if (typeof initialValue === 'boolean') {
    return initialValue;
  }

  if (typeof window !== 'undefined' && 'matchMedia' in window) {
    return window.matchMedia(query).matches;
  }

  return false;
}

/**
 * Returns a signal that tracks the current state of a media query.
 */
export function useMediaQuery(
  query: Accessor<string>,
  initialValue?: boolean,
  { getInitialValueInEffect }: UseMediaQueryOptions = {
    getInitialValueInEffect: true,
  },
) {
  const [matches, setMatches] = createSignal(
    getInitialValueInEffect ? initialValue : getInitialValue(query()),
  );

  let queryRef: MediaQueryList;

  createEffect(() => {
    if ('matchMedia' in window) {
      queryRef = window.matchMedia(query());
      setMatches(queryRef.matches);
      return attachMediaListener(queryRef, event => setMatches(event.matches));
    }

    return undefined;
  });

  return matches;
}
