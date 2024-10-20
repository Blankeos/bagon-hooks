import { Accessor, createEffect, createSignal } from 'solid-js';

const MIME_TYPES: Record<string, string> = {
  ico: 'image/x-icon',
  png: 'image/png',
  svg: 'image/svg+xml',
  gif: 'image/gif',
};

/**
 * A hook that sets the favicon of the page based on the url (accessor) passed.
 */
export function useFavicon(url: Accessor<string>) {
  const [linkRef, setLinkRef] = createSignal<HTMLLinkElement>();

  createEffect(() => {
    if (!url()) {
      return;
    }

    if (!linkRef()) {
      const existingElements = document.querySelectorAll<HTMLLinkElement>('link[rel*="icon"]');
      existingElements.forEach(element => document.head.removeChild(element));

      const element = document.createElement('link');
      element.rel = 'shortcut icon';
      setLinkRef(element);
      document.querySelector('head')!.appendChild(element);
    }

    const splittedUrl = url().split('.');
    linkRef()?.setAttribute(
      'type',
      MIME_TYPES[splittedUrl?.[splittedUrl.length - 1]?.toLowerCase()!]!,
    );
    linkRef()?.setAttribute('href', url());
  });
}
