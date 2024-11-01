import { createMemo } from 'solid-js';
import { useMediaQuery, UseMediaQueryOptions } from '../use-media-query/use-media-query';

export function useColorScheme(initialValue?: 'dark' | 'light', options?: UseMediaQueryOptions) {
  const isDark = useMediaQuery(
    () => '(prefers-color-scheme: dark)',
    initialValue === 'dark',
    options,
  );

  return createMemo(() => (isDark() ? 'dark' : 'light'));
}
