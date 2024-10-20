import { Accessor, createEffect, createSignal } from 'solid-js';

const MIME_TYPES: Record<string, string> = {
  ico: 'image/x-icon',
  png: 'image/png',
  svg: 'image/svg+xml',
  gif: 'image/gif',
};

/**
 * A hook that sets the favicon of the page based on the url (accessor) passed.
 *
 * This has an improvement over Mantine's API. Mantine's requires you to rely
 * on effects. This one has two ways to use:
 * 1. Use the setter returned by the hook (don't pass an url).
 * 2. Pass an accessor (it will use the effect based on the accessor).
 */
export function useFavicon(url?: Accessor<string>) {
  const [currentFaviconUrl, setCurrentFaviconUrl] = createSignal<string | undefined>(url?.());
  const [linkRef, setLinkRef] = createSignal<HTMLLinkElement>();

  function setFaviconInHTML(faviconUrl: string) {
    if (!faviconUrl) return;

    if (!linkRef()) {
      const existingElements = document.querySelectorAll<HTMLLinkElement>('link[rel*="icon"]');
      existingElements.forEach(element => document.head.removeChild(element));

      const element = document.createElement('link');
      element.rel = 'shortcut icon';
      setLinkRef(element);
      document.querySelector('head')!.appendChild(element);
    }

    const splittedUrl = faviconUrl.split('.');
    linkRef()?.setAttribute(
      'type',
      MIME_TYPES[splittedUrl?.[splittedUrl.length - 1]?.toLowerCase()!]!,
    );
    linkRef()?.setAttribute('href', faviconUrl);
    setCurrentFaviconUrl(faviconUrl);
  }

  createEffect(() => {
    if (!url) return;
    setFaviconInHTML(url());
  });

  return [currentFaviconUrl, setFaviconInHTML] as const;
}
