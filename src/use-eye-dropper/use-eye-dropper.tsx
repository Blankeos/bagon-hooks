import { createSignal, onMount } from 'solid-js';

interface EyeDropperOpenOptions {
  signal?: AbortSignal;
}

export interface EyeDropperOpenReturnType {
  sRGBHex: string;
}

function isOpera() {
  return navigator.userAgent.includes('OPR');
}

/**
 * A hook that opens the browser's EyeDropper API.
 *
 * This has an improvement over Mantine's API. Mantine's is more low-level. Bagon
 * prepares states for you by default.
 */
export function useEyeDropper() {
  const [color, setColor] = createSignal<string>();
  const [error, setError] = createSignal<Error | null>(null);
  const [supported, setSupported] = createSignal<boolean>();

  onMount(() => {
    setSupported(typeof window !== 'undefined' && !isOpera() && 'EyeDropper' in window);
  });

  const open = (
    options: EyeDropperOpenOptions = {},
  ): Promise<EyeDropperOpenReturnType | undefined> => {
    if (supported()) {
      const eyeDropper = new (window as any).EyeDropper();
      return eyeDropper.open(options);
    }

    return Promise.resolve(undefined);
  };

  const pickColor = async () => {
    try {
      const { sRGBHex } = (await open())!;
      setColor(sRGBHex);
    } catch (e) {
      setError(e as Error);
    }
  };

  return {
    /**
     * Improved in bagon.
     * - true - supported.
     * - false - not supported.
     * - undefined - support is not checked yet (initial state so you can check this if you don't want a flicker before support is determined).
     */
    supported,
    open,
    /** Added in bagon. */
    error,
    /** Added in bagon. */
    color,
    /** Added in bagon. */
    pickColor,
  };
}
