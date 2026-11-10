import { createRoot } from 'solid-js';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useActiveElement, useBrowserLanguage, usePreferredLanguages } from '../src';

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
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('useBrowserLanguage', () => {
  it('returns navigator.language and updates on languagechange', () => {
    vi.spyOn(window.navigator, 'language', 'get').mockReturnValue('en-US');
    const { result, dispose } = run(() => useBrowserLanguage());
    expect(result()).toBe('en-US');
    vi.spyOn(window.navigator, 'language', 'get').mockReturnValue('fr-FR');
    window.dispatchEvent(new Event('languagechange'));
    expect(result()).toBe('fr-FR');
    dispose();
    vi.spyOn(window.navigator, 'language', 'get').mockReturnValue('de-DE');
    window.dispatchEvent(new Event('languagechange'));
    expect(result()).toBe('fr-FR');
  });
});

describe('usePreferredLanguages', () => {
  it('returns navigator.languages and updates on languagechange', () => {
    vi.spyOn(window.navigator, 'languages', 'get').mockReturnValue(['en-US', 'en']);
    const { result, dispose } = run(() => usePreferredLanguages());
    expect(result()).toEqual(['en-US', 'en']);
    vi.spyOn(window.navigator, 'languages', 'get').mockReturnValue(['ja']);
    window.dispatchEvent(new Event('languagechange'));
    expect(result()).toEqual(['ja']);
    dispose();
  });
});

describe('useActiveElement', () => {
  it('tracks the focused element', () => {
    document.body.innerHTML = '<input id="a" /><input id="b" />';
    const { result, dispose } = run(() => useActiveElement());
    const a = document.getElementById('a') as HTMLInputElement;
    const b = document.getElementById('b') as HTMLInputElement;
    a.focus();
    expect(result()).toBe(a);
    b.focus();
    expect(result()).toBe(b);
    dispose();
  });

  it('updates when the focused element is removed (triggerOnRemoval)', async () => {
    document.body.innerHTML = '<input id="a" />';
    const { result, dispose } = run(() => useActiveElement());
    const a = document.getElementById('a') as HTMLInputElement;
    a.focus();
    expect(result()).toBe(a);
    a.remove();
    await new Promise(r => setTimeout(r, 0));
    expect(result()).toBe(document.body);
    dispose();
  });

  it('does not update on removal when triggerOnRemoval is false', async () => {
    document.body.innerHTML = '<input id="a" />';
    const { result, dispose } = run(() => useActiveElement({ triggerOnRemoval: false }));
    const a = document.getElementById('a') as HTMLInputElement;
    a.focus();
    a.remove();
    await new Promise(r => setTimeout(r, 0));
    expect(result()).toBe(a);
    dispose();
  });

  it('pierces shadow roots by default and not with deep: false', () => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    const root = host.attachShadow({ mode: 'open' });
    root.innerHTML = '<input id="inner" />';
    const inner = root.getElementById('inner') as HTMLInputElement;
    const deep = run(() => useActiveElement());
    const shallow = run(() => useActiveElement({ deep: false }));
    inner.focus();
    expect(deep.result()).toBe(inner);
    expect(shallow.result()).toBe(host);
    deep.dispose();
    shallow.dispose();
  });

  it('removes listeners on dispose', () => {
    document.body.innerHTML = '<input id="a" /><input id="b" />';
    const { result, dispose } = run(() => useActiveElement());
    const a = document.getElementById('a') as HTMLInputElement;
    a.focus();
    dispose();
    (document.getElementById('b') as HTMLInputElement).focus();
    expect(result()).toBe(a);
  });
});
