import { createSignal } from 'solid-js';

/**
 * A hook that wraps copy-to-clipboard logic with a signal.
 */
export function useClipboard(params: { timeout: number } = { timeout: 2000 }) {
  const [error, setError] = createSignal<Error | null>(null);
  const [copied, setCopied] = createSignal(false);

  let copyTimeout: number | null = null;

  const handleCopyResult = (value: boolean) => {
    window.clearTimeout(copyTimeout!);
    copyTimeout = window.setTimeout(() => setCopied(false), params.timeout);
    setCopied(value);
  };

  const copy = (valueToCopy: any) => {
    if ('clipboard' in navigator) {
      navigator.clipboard
        .writeText(valueToCopy)
        .then(() => handleCopyResult(true))
        .catch(err => setError(err));
    } else {
      setError(new Error('useClipboard: navigator.clipboard is not supported'));
    }
  };

  const reset = () => {
    setCopied(false);
    setError(null);
    window.clearTimeout(copyTimeout!);
  };

  return { copy, reset, error, copied };
}
