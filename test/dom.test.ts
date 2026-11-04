import { createRoot, createSignal } from 'solid-js';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  getHotkeyHandler,
  useClickOutside,
  useCollapse,
  useFocusTrap,
  useFocusWithin,
  useHorizontalCollapse,
  useHotkeys,
  useIntersection,
  useLongPress,
  useMask,
  useMove,
  useOrientation,
  useRovingIndex,
  useScrollIntoView,
  useScrollSpy,
  useScroller,
} from '../src';

function run<T>(fn: () => T): { result: T; dispose: () => void } {
  let dispose!: () => void;
  const result = createRoot(d => {
    dispose = d;
    return fn();
  });
  return { result, dispose };
}

afterEach(() => {
  document.body.innerHTML = '';
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('useLongPress', () => {
  it('ignores a second start while already pressed', () => {
    vi.useFakeTimers();
    const onStart = vi.fn();
    const onLongPress = vi.fn();
    const { result, dispose } = run(() => useLongPress(onLongPress, { onStart, threshold: 100 }));
    result.onMouseDown!(new MouseEvent('mousedown'));
    result.onMouseDown!(new MouseEvent('mousedown'));
    expect(onStart).toHaveBeenCalledTimes(1);
    vi.advanceTimersByTime(100);
    expect(onLongPress).toHaveBeenCalledTimes(1);
    dispose();
  });
});

describe('useFocusWithin', () => {
  it('treats non-HTMLElement related targets (text/SVG nodes) as nodes', () => {
    document.body.innerHTML = '<div id="c"><input id="i" /><svg id="s" tabindex="0"></svg></div>';
    const onBlur = vi.fn();
    const { result, dispose } = run(() => useFocusWithin({ onBlur }));
    const container = document.getElementById('c')!;
    result.ref(container);
    container.dispatchEvent(new FocusEvent('focusin'));
    expect(result.focused()).toBe(true);
    // related target is an SVG element (a Node, but not an HTMLElement) inside the container
    container.dispatchEvent(
      new FocusEvent('focusout', { relatedTarget: document.getElementById('s') as any }),
    );
    expect(result.focused()).toBe(true);
    expect(onBlur).not.toHaveBeenCalled();
    dispose();
  });
});

describe('useMove', () => {
  it('stops scrubbing on touchcancel', () => {
    vi.useFakeTimers();
    const onScrubEnd = vi.fn();
    const el = document.createElement('div');
    document.body.appendChild(el);
    const { result, dispose } = run(() => useMove(() => {}, { onScrubEnd }));
    result.ref(el);
    return Promise.resolve().then(() => {
      el.dispatchEvent(new MouseEvent('mousedown', { cancelable: true }));
      expect(result.active()).toBe(true);
      document.dispatchEvent(new Event('touchcancel'));
      expect(result.active()).toBe(false);
      dispose();
    });
  });
});

describe('useIntersection', () => {
  it('uses the last entry of a batch', () => {
    let cb!: (entries: any[]) => void;
    vi.stubGlobal(
      'IntersectionObserver',
      class {
        constructor(c: any) {
          cb = c;
        }
        observe() {}
        disconnect() {}
      },
    );
    const { result, dispose } = run(() => useIntersection());
    result.ref(document.createElement('div'));
    cb([
      { isIntersecting: false, id: 1 },
      { isIntersecting: true, id: 2 },
    ]);
    expect((result.entry() as any).id).toBe(2);
    dispose();
  });
});

describe('useOrientation', () => {
  it('reads screen.orientation (and supports defaults) and cleans up the listener', () => {
    const listeners = new Set<any>();
    const orientation = {
      angle: 90,
      type: 'portrait-primary',
      addEventListener: (_: string, l: any) => listeners.add(l),
      removeEventListener: (_: string, l: any) => listeners.delete(l),
    };
    Object.defineProperty(window.screen, 'orientation', { value: orientation, configurable: true });
    const { result, dispose } = run(() =>
      useOrientation({ defaultAngle: 180, getInitialValueInEffect: false }),
    );
    expect(result()).toEqual({ angle: 90, type: 'portrait-primary' });
    expect(listeners.size).toBe(1);
    dispose();
    expect(listeners.size).toBe(0);
    delete (window.screen as any).orientation;
  });
});

describe('useHotkeys', () => {
  const press = (init: KeyboardEventInit) =>
    document.documentElement.dispatchEvent(
      new KeyboardEvent('keydown', { cancelable: true, bubbles: true, ...init }),
    );

  it('matches physical keys only when usePhysicalKeys is set', () => {
    const physical = vi.fn();
    const logical = vi.fn();
    const { dispose } = run(() => {
      useHotkeys([
        ['Digit1', physical, { usePhysicalKeys: true }],
        ['1', logical],
      ]);
    });
    return Promise.resolve().then(() => {
      press({ code: 'Digit1', key: '&' });
      expect(physical).toHaveBeenCalledTimes(1);
      expect(logical).not.toHaveBeenCalled();
      press({ code: 'Digit1', key: '1' });
      expect(logical).toHaveBeenCalledTimes(1);
      dispose();
    });
  });

  it('does not match a logical key against a different physical key', () => {
    const handler = vi.fn();
    const { dispose } = run(() => {
      useHotkeys([['1', handler, { usePhysicalKeys: true }]], [], true);
    });
    return Promise.resolve().then(() => {
      press({ code: 'Numpad1', key: '1' });
      expect(handler).not.toHaveBeenCalled();
      dispose();
    });
  });

  it('defaults preventDefault per option when only usePhysicalKeys is passed', () => {
    const { dispose } = run(() => {
      useHotkeys([['Digit1', () => {}, { usePhysicalKeys: true }]]);
    });
    return Promise.resolve().then(() => {
      const event = new KeyboardEvent('keydown', { code: 'Digit1', cancelable: true });
      document.documentElement.dispatchEvent(event);
      expect(event.defaultPrevented).toBe(true);
      dispose();
    });
  });

  it('handles the [plus] key in getHotkeyHandler', () => {
    const handler = vi.fn();
    const handle = getHotkeyHandler([['shift+[plus]', handler]]);
    handle(new KeyboardEvent('keydown', { shiftKey: true, key: '+', cancelable: true }));
    expect(handler).toHaveBeenCalled();
  });
});

describe('useClickOutside', () => {
  it('supports enabled and capture', async () => {
    const outside = document.createElement('button');
    const inside = document.createElement('div');
    document.body.append(outside, inside);
    const [enabled, setEnabled] = createSignal(false);
    const handler = vi.fn();
    const { result: ref, dispose } = run(() =>
      useClickOutside(handler, ['mousedown'], undefined, enabled, true),
    );
    ref(inside);
    await Promise.resolve();
    outside.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    expect(handler).not.toHaveBeenCalled();
    setEnabled(true);
    await Promise.resolve();
    // capture phase: fires even when propagation is stopped on the target
    outside.addEventListener('mousedown', e => e.stopPropagation());
    outside.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    expect(handler).toHaveBeenCalledTimes(1);
    dispose();
  });
});

describe('useCollapse', () => {
  const frames: FrameRequestCallback[] = [];
  beforeEach(() => {
    frames.length = 0;
    vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => frames.push(cb));
  });
  const flush = () => {
    while (frames.length) frames.shift()!(0);
  };

  for (const [name, hook] of [
    ['useCollapse', useCollapse],
    ['useHorizontalCollapse', useHorizontalCollapse],
  ] as const) {
    it(`${name}: skips stale frames of a superseded transition`, () => {
      const [expanded, setExpanded] = createSignal(false);
      const onTransitionEnd = vi.fn();
      const el = document.createElement('div');
      document.body.appendChild(el);
      const { result, dispose } = run(() =>
        (hook as typeof useCollapse)({ expanded, onTransitionEnd }),
      );
      result.getCollapseProps().ref(el);
      // toggle back before the first frame fires
      setExpanded(true);
      setExpanded(false);
      flush();
      // the expand frames are stale and must not run (no 'entering'/'exiting' leftovers)
      expect(result.state()).toBe('exited');
      expect(onTransitionEnd).toHaveBeenCalledTimes(1);
      dispose();
    });

    it(`${name}: falls back when the content has zero size`, () => {
      const [expanded, setExpanded] = createSignal(false);
      const onTransitionEnd = vi.fn();
      const el = document.createElement('div');
      document.body.appendChild(el);
      const { result, dispose } = run(() =>
        (hook as typeof useCollapse)({ expanded, onTransitionEnd }),
      );
      result.getCollapseProps().ref(el);
      setExpanded(true);
      flush(); // jsdom has no layout: scrollHeight/scrollWidth === 0
      // transitionend would never fire for a 0 -> 0 transition
      expect(result.state()).toBe('entered');
      expect(onTransitionEnd).toHaveBeenCalledTimes(1);
      setExpanded(false);
      flush();
      expect(result.state()).toBe('exited');
      expect(onTransitionEnd).toHaveBeenCalledTimes(2);
      dispose();
    });
  }
});

describe('useScrollIntoView', () => {
  it('clamps progress and resets startTime on cancel', () => {
    const frames: FrameRequestCallback[] = [];
    vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => frames.push(cb));
    vi.stubGlobal('cancelAnimationFrame', () => {});
    let now = 1000;
    vi.spyOn(performance, 'now').mockImplementation(() => now);
    Object.defineProperty(window, 'matchMedia', {
      value: () => ({ matches: false, addEventListener() {}, removeEventListener() {} }),
      configurable: true,
    });
    const parent = document.createElement('div');
    const target = document.createElement('div');
    parent.appendChild(target);
    document.body.appendChild(parent);
    target.getBoundingClientRect = () => ({ top: 500, height: 10, left: 0, width: 10 }) as DOMRect;
    parent.getBoundingClientRect = () => ({ top: 0, height: 100, left: 0, width: 100 }) as DOMRect;
    const easing = vi.fn((t: number) => t);
    const { result, dispose } = run(() => useScrollIntoView({ duration: 100, easing }));
    result.scrollableRef(parent);
    result.targetRef(target);
    result.scrollIntoView();
    now = 5000; // way past the duration
    frames.shift()!(0);
    // t must never exceed 1 even if a frame is very late
    expect(Math.max(...easing.mock.calls.map(c => c[0]))).toBeLessThanOrEqual(1);
    expect(parent.scrollTop).toBe(500);

    // startTime resets on cancel: a fresh scroll starts from t ~ 0
    now = 6000;
    result.scrollIntoView();
    result.cancel();
    now = 9000;
    easing.mockClear();
    result.scrollIntoView();
    expect(easing.mock.calls[0]![0]).toBe(0);
    dispose();
  });
});

describe('useScrollSpy', () => {
  it('getNode falls back to a live node when the heading was detached', () => {
    document.body.innerHTML = '<h2 id="a">A</h2><h2 id="b">B</h2>';
    const { result, dispose } = run(() => useScrollSpy({ selector: 'h2' }));
    const first = result.data()[0]!.getNode();
    expect(first.isConnected).toBe(true);
    // simulate a re-render that replaced the node
    const replacement = document.createElement('h2');
    replacement.id = 'a';
    first.replaceWith(replacement);
    expect(first.isConnected).toBe(false);
    expect(result.data()[0]!.getNode()).toBe(replacement);
    dispose();
  });
});

describe('useFocusTrap', () => {
  const tab = (target: Element, init: KeyboardEventInit = {}) => {
    const event = new KeyboardEvent('keydown', {
      key: 'Tab',
      cancelable: true,
      bubbles: true,
      ...init,
    });
    target.dispatchEvent(event);
    return event;
  };

  it('lets only the innermost active trap handle Tab', async () => {
    document.body.innerHTML = `
      <div id="outer"><button id="o1">o1</button>
        <div id="inner"><button id="i1">i1</button><button id="i2">i2</button></div></div>`;
    const { dispose } = run(() => {
      useFocusTrap()(document.getElementById('outer')!);
      useFocusTrap()(document.getElementById('inner')!);
    });
    await Promise.resolve();
    const i2 = document.getElementById('i2')!;
    i2.focus();
    // i2 is the last tabbable of BOTH traps; the inner one must win (wrap to i1, not o1)
    const event = tab(i2);
    expect(event.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(document.getElementById('i1'));
    dispose();
  });

  it('ignores Tab events that were already default-prevented', async () => {
    document.body.innerHTML =
      '<div id="t"><button id="a">a</button><button id="b">b</button></div>';
    const { dispose } = run(() => {
      useFocusTrap()(document.getElementById('t')!);
    });
    await Promise.resolve();
    const b = document.getElementById('b')!;
    b.focus();
    const prevent = (e: Event) => e.preventDefault();
    window.addEventListener('keydown', prevent, { capture: true });
    tab(b);
    window.removeEventListener('keydown', prevent, { capture: true });
    expect(document.activeElement).toBe(b);
    dispose();
  });
});

describe('useMask', () => {
  function mount(options: Parameters<typeof useMask>[0], value = '') {
    const input = document.createElement('input');
    input.value = value;
    document.body.appendChild(input);
    const { result, dispose } = run(() => useMask(options));
    result.ref(input);
    return { input, mask: result, dispose };
  }

  it('does not throw on keydown events without a string key (autofill)', () => {
    const { input, dispose } = mount({ mask: '999' });
    const event = new KeyboardEvent('keydown', { cancelable: true });
    Object.defineProperty(event, 'key', { value: undefined });
    const errors: unknown[] = [];
    const onError = (e: ErrorEvent) => {
      errors.push(e.error);
      e.preventDefault();
    };
    window.addEventListener('error', onError);
    input.dispatchEvent(event);
    window.removeEventListener('error', onError);
    expect(errors).toEqual([]);
    dispose();
  });

  it('accepts + and - in the # token', () => {
    const { input, mask, dispose } = mount({ mask: '#99' }, '-12');
    expect(input.value).toBe('-12');
    expect(mask.value()).toBe('-12');
    dispose();
  });

  it('applies transform to the initial value', () => {
    const { input, dispose } = mount({ mask: 'AAA', transform: c => c.toUpperCase() }, 'abc');
    expect(input.value).toBe('ABC');
    dispose();
  });
});

describe('useRovingIndex', () => {
  it('assigns tabIndex 0 to the first non-disabled item and navigates', () => {
    const onFocusChange = vi.fn();
    const { result, dispose } = run(() =>
      useRovingIndex({ total: 4, isItemDisabled: i => i === 0, onFocusChange }),
    );
    const tabs = () => [0, 1, 2, 3].map(i => result.getItemProps({ index: i }).tabIndex);
    expect(tabs()).toEqual([-1, 0, -1, -1]);
    result
      .getItemProps({ index: 1 })
      .onKeyDown(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    expect(result.focusedIndex()).toBe(2);
    // wraps and skips the disabled item
    result
      .getItemProps({ index: 3 })
      .onKeyDown(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    expect(result.focusedIndex()).toBe(1);
    expect(onFocusChange).toHaveBeenCalledWith(1);
    dispose();
  });

  it('supports controlled focusedIndex, grid mode, and orientation', () => {
    const [index, setIndex] = createSignal<number | undefined>(0);
    const { result, dispose } = run(() =>
      useRovingIndex({ total: 6, columns: 3, focusedIndex: index, onFocusChange: setIndex }),
    );
    result
      .getItemProps({ index: 0 })
      .onKeyDown(new KeyboardEvent('keydown', { key: 'ArrowDown', cancelable: true }));
    expect(index()).toBe(3);
    expect(result.focusedIndex()).toBe(3);
    dispose();

    const list = run(() => useRovingIndex({ total: 3, orientation: 'vertical' }));
    list.result
      .getItemProps({ index: 0 })
      .onKeyDown(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    expect(list.result.focusedIndex()).toBe(0);
    list.dispose();
  });
});

describe('useScroller', () => {
  it('tracks scroll state, scrolls by scrollAmount and exposes drag handlers', async () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    Object.defineProperty(el, 'scrollWidth', { value: 1000, configurable: true });
    Object.defineProperty(el, 'clientWidth', { value: 100, configurable: true });
    el.scrollBy = vi.fn() as any;
    vi.stubGlobal(
      'ResizeObserver',
      class {
        observe() {}
        disconnect() {}
      },
    );
    const onScrollStateChange = vi.fn();
    const { result, dispose } = run(() => useScroller({ scrollAmount: 50, onScrollStateChange }));
    result.ref(el);
    await Promise.resolve();
    expect(result.canScrollStart()).toBe(false);
    expect(result.canScrollEnd()).toBe(true);
    expect(onScrollStateChange).toHaveBeenCalledWith({ canScrollStart: false, canScrollEnd: true });
    result.scrollEnd();
    expect(el.scrollBy).toHaveBeenCalledWith({ left: 50, behavior: 'smooth' });
    result.scrollStart();
    expect(el.scrollBy).toHaveBeenCalledWith({ left: -50, behavior: 'smooth' });
    result.dragHandlers.onMouseDown(new MouseEvent('mousedown'));
    expect(result.isDragging()).toBe(true);
    result.dragHandlers.onMouseUp();
    expect(result.isDragging()).toBe(false);
    dispose();
  });
});
