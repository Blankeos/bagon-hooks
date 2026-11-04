import { createRoot, createSignal } from 'solid-js';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  useClipboard,
  useDebouncedCallback,
  useDebouncedSignal,
  useFetch,
  useHash,
  useLocalStorage,
  useLocalStorageStore,
  useMediaQuery,
  useThrottledCallback,
  useTimeout,
  useValidatedState,
} from '../src';

function run<T>(fn: () => T): { result: T; dispose: () => void } {
  let dispose!: () => void;
  const result = createRoot(d => {
    dispose = d;
    return fn();
  });
  return { result, dispose };
}

beforeEach(() => {
  vi.useFakeTimers();
  localStorage.clear();
});
afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe('useTimeout', () => {
  it('spreads start() args into the callback and clears the ref before invoking', () => {
    const calls: any[][] = [];
    const { result, dispose } = run(() => {
      const t: ReturnType<typeof useTimeout> = useTimeout((...args: any[]) => {
        calls.push(args);
        // ref must be cleared already, so start() inside the callback re-arms
        if (calls.length === 1) t.start('again');
      }, 10);
      return t;
    });
    result.start('a', 'b');
    vi.advanceTimersByTime(10);
    expect(calls[0]).toEqual(['a', 'b']);
    vi.advanceTimersByTime(10);
    expect(calls[1]).toEqual(['again']);
    dispose();
  });
});

describe('useHash', () => {
  it('sets the hash signal from window.location.hash', () => {
    const { result, dispose } = run(() => useHash({ getInitialValueInEffect: false }));
    result[1]('foo bar');
    // browsers percent-encode the space; the signal must mirror location.hash
    expect(result[0]()).toBe(window.location.hash);
    expect(result[0]()).toBe('#foo%20bar');
    dispose();
  });
});

describe('useClipboard', () => {
  it('resets copied and sets error when writeText rejects', async () => {
    vi.useRealTimers();
    const writeText = vi
      .fn()
      .mockResolvedValueOnce(undefined)
      .mockRejectedValueOnce(new Error('denied'));
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
    const { result, dispose } = run(() => useClipboard());
    result.copy('x');
    await new Promise(r => setTimeout(r, 0));
    expect(result.copied()).toBe(true);
    result.copy('y');
    await new Promise(r => setTimeout(r, 0));
    expect(result.copied()).toBe(false);
    expect(result.error()?.message).toBe('denied');
    dispose();
  });
});

describe('useThrottledCallback', () => {
  it('restores active state when the callback throws', () => {
    let shouldThrow = true;
    const spy = vi.fn(() => {
      if (shouldThrow) throw new Error('boom');
    });
    const { result: throttled, dispose } = run(() => useThrottledCallback(spy, 100));
    expect(() => throttled()).toThrow('boom');
    shouldThrow = false;
    // would be swallowed by the throttle window if `active` stayed false
    vi.advanceTimersByTime(0);
    throttled();
    vi.advanceTimersByTime(100);
    expect(spy.mock.calls.length).toBeGreaterThanOrEqual(2);
    dispose();
  });
});

describe('useDebouncedSignal', () => {
  it('re-arms leading after the wait elapses', () => {
    const { result, dispose } = run(() => useDebouncedSignal(0, 100, { leading: true }));
    const [value, setValue] = result;
    setValue(1);
    expect(value()).toBe(1); // leading
    vi.advanceTimersByTime(100);
    setValue(2);
    expect(value()).toBe(2); // leading again, not delayed
    dispose();
  });
});

describe('useMediaQuery', () => {
  it('does not throw when matchMedia throws for the initial value', () => {
    const original = window.matchMedia;
    window.matchMedia = (() => {
      throw new Error('nope');
    }) as any;
    expect(() => {
      const { result, dispose } = run(() =>
        useMediaQuery(() => '(min-width: 1px)', undefined, { getInitialValueInEffect: false }),
      );
      expect(result()).toBe(false);
      dispose();
    }).not.toThrow();
    window.matchMedia = original;
  });
});

describe('useFetch', () => {
  it('ignores responses of superseded requests', async () => {
    vi.useRealTimers();
    const resolvers: Array<(v: any) => void> = [];
    vi.stubGlobal(
      'fetch',
      vi.fn(
        () =>
          new Promise(resolve => {
            resolvers.push(resolve);
          }),
      ),
    );
    const mk = (body: any) => ({ ok: true, json: async () => body });
    const { result, dispose } = run(() => useFetch<string>('/x', { autoInvoke: false }));
    const first = result.refetch();
    const second = result.refetch();
    // the first request resolves AFTER the second one was issued, with stale data
    resolvers[1]!(mk('fresh'));
    await second;
    resolvers[0]!(mk('stale'));
    await first;
    expect(result.data()).toBe('fresh');
    expect(result.loading()).toBe(false);
    dispose();
    vi.unstubAllGlobals();
  });
});

describe('useLocalStorage key reset', () => {
  it('resets to default when the key changes to one with nothing stored (signal)', () => {
    localStorage.setItem('a', JSON.stringify('stored-a'));
    const [key, setKey] = createSignal('a');
    const { result, dispose } = run(() =>
      useLocalStorage<string>({ key, defaultValue: 'def', getInitialValueInEffect: false }),
    );
    expect(result[0]()).toBe('stored-a');
    setKey('b');
    expect(result[0]()).toBe('def');
    dispose();
  });

  it('resets to undefined when no default and nothing stored (signal)', () => {
    localStorage.setItem('a', JSON.stringify('stored-a'));
    const [key, setKey] = createSignal('a');
    const { result, dispose } = run(() =>
      useLocalStorage<string>({ key, getInitialValueInEffect: false }),
    );
    expect(result[0]()).toBe('stored-a');
    setKey('b');
    expect(result[0]()).toBeUndefined();
    dispose();
  });

  it('resets when the key changes (store)', () => {
    localStorage.setItem('a', JSON.stringify({ n: 1 }));
    const [key, setKey] = createSignal('a');
    const { result, dispose } = run(() =>
      useLocalStorageStore<{ n: number }>({
        key,
        defaultValue: { n: 0 },
        getInitialValueInEffect: false,
      }),
    );
    expect(result[0].n).toBe(1);
    setKey('b');
    expect(result[0].n).toBe(0);
    dispose();
  });
});

describe('useValidatedState', () => {
  it('honors initialValidationState', () => {
    const { result, dispose } = run(() => useValidatedState('', v => v.length > 0, true));
    expect(result[0].valid()).toBe(true);
    dispose();
  });
});

describe('useDebouncedCallback', () => {
  it('accepts a number and exposes flush/cancel/isPending', () => {
    const spy = vi.fn();
    const { result: fn, dispose } = run(() => useDebouncedCallback(spy, 100));
    fn('a');
    expect(fn.isPending()).toBe(true);
    fn.flush();
    expect(spy).toHaveBeenCalledWith('a');
    expect(fn.isPending()).toBe(false);
    fn('b');
    fn.cancel();
    vi.advanceTimersByTime(200);
    expect(spy).toHaveBeenCalledTimes(1);
    dispose();
  });

  it('supports leading and maxWait', () => {
    const spy = vi.fn();
    const { result: fn, dispose } = run(() =>
      useDebouncedCallback(spy, { delay: 100, leading: true }),
    );
    fn(1);
    expect(spy).toHaveBeenCalledTimes(1);
    fn(2);
    vi.advanceTimersByTime(100);
    expect(spy).toHaveBeenCalledTimes(1);
    dispose();

    const spy2 = vi.fn();
    const { result: fn2, dispose: dispose2 } = run(() =>
      useDebouncedCallback(spy2, { delay: 100, maxWait: 250 }),
    );
    for (let i = 0; i < 5; i += 1) {
      fn2(i);
      vi.advanceTimersByTime(80);
    }
    // never idle for 100ms, but maxWait forces a call
    expect(spy2).toHaveBeenCalled();
    dispose2();
  });

  it('flushes on dispose with flushOnUnmount', () => {
    const spy = vi.fn();
    const { result: fn, dispose } = run(() =>
      useDebouncedCallback(spy, { delay: 100, flushOnUnmount: true }),
    );
    fn('x');
    dispose();
    expect(spy).toHaveBeenCalledWith('x');
  });
});
