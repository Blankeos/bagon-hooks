import { afterEach, describe, expect, it, vi } from 'vitest';
import { scopeTab } from '../src/use-focus-trap/scope-tab';

function setup(html: string) {
  document.body.innerHTML = `<div id="trap" tabindex="-1">${html}</div><button id="outside">outside</button>`;
  const node = document.getElementById('trap')!;
  const el = (id: string) => document.getElementById(id) as HTMLElement;
  const tab = (shiftKey = false) => {
    const event = new KeyboardEvent('keydown', { key: 'Tab', shiftKey, cancelable: true });
    scopeTab(node, event);
    return event;
  };
  return { node, el, tab };
}

const FORM = `
  <button id="close">close</button>
  <input id="first" />
  <input id="second" />
  <input id="checkbox" type="checkbox" />
  <button id="submit">submit</button>
`;

describe('use-focus-trap/scope-tab', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('moves focus to the next tabbable element on Tab', () => {
    const { el, tab } = setup(FORM);
    el('second').focus();
    const event = tab();
    expect(event.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(el('checkbox'));
  });

  it('moves focus to the previous tabbable element on Shift+Tab', () => {
    const { el, tab } = setup(FORM);
    el('second').focus();
    const event = tab(true);
    expect(event.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(el('first'));
  });

  it('wraps focus from the last element to the first and back', () => {
    const { el, tab } = setup(FORM);
    el('submit').focus();
    tab();
    expect(document.activeElement).toBe(el('close'));
    tab(true);
    expect(document.activeElement).toBe(el('submit'));
  });

  it('does nothing when focus is outside of the node', () => {
    const { el, tab } = setup(FORM);
    el('outside').focus();
    const event = tab();
    expect(event.defaultPrevented).toBe(false);
    expect(document.activeElement).toBe(el('outside'));
  });

  it('moves focus to the first/last tabbable element when the node itself is focused', () => {
    const { node, el, tab } = setup(FORM);
    node.focus();
    tab();
    expect(document.activeElement).toBe(el('close'));
    node.focus();
    tab(true);
    expect(document.activeElement).toBe(el('submit'));
  });

  it('continues from the DOM position of a focused non-tabbable element', () => {
    const { el, tab } = setup(`
      <button id="close">close</button>
      <div id="cell" tabindex="-1">cell</div>
      <button id="submit">submit</button>
    `);
    el('cell').focus();
    tab();
    expect(document.activeElement).toBe(el('submit'));
    el('cell').focus();
    tab(true);
    expect(document.activeElement).toBe(el('close'));
  });

  it('skips disabled and tabindex=-1 elements', () => {
    const { el, tab } = setup(`
      <button id="close">close</button>
      <button id="disabled" disabled>disabled</button>
      <button id="hidden" tabindex="-1">hidden</button>
      <button id="submit">submit</button>
    `);
    el('close').focus();
    tab();
    expect(document.activeElement).toBe(el('submit'));
  });

  it('skips elements that refuse focus', () => {
    const { el, tab } = setup(FORM);
    Object.defineProperty(el('checkbox'), 'focus', { value: () => {} });
    el('second').focus();
    tab();
    expect(document.activeElement).toBe(el('submit'));
  });

  it('treats a radio group as a single tab stop', () => {
    const { el, tab } = setup(`
      <input id="before" />
      <input id="r1" type="radio" name="group" />
      <input id="r2" type="radio" name="group" checked />
      <input id="r3" type="radio" name="group" />
      <input id="after" />
    `);
    el('before').focus();
    tab();
    expect(document.activeElement).toBe(el('r2'));
    tab();
    expect(document.activeElement).toBe(el('after'));
    tab(true);
    expect(document.activeElement).toBe(el('r2'));
    tab(true);
    expect(document.activeElement).toBe(el('before'));
  });

  it('enters an unchecked radio group at the first radio forwards and the last radio backwards', () => {
    const { el, tab } = setup(`
      <input id="before" />
      <input id="r1" type="radio" name="group" />
      <input id="r2" type="radio" name="group" />
      <input id="after" />
    `);
    el('before').focus();
    tab();
    expect(document.activeElement).toBe(el('r1'));
    tab();
    expect(document.activeElement).toBe(el('after'));
    tab(true);
    expect(document.activeElement).toBe(el('r2'));
    tab(true);
    expect(document.activeElement).toBe(el('before'));
  });

  it('includes contenteditable elements and summary in the sequence', () => {
    const { el, tab } = setup(`
      <button id="close">close</button>
      <div id="editor" contenteditable="true">editor</div>
      <div id="not-editor" contenteditable="false">text</div>
      <details><summary id="summary">summary</summary>details</details>
      <button id="submit">submit</button>
    `);
    el('close').focus();
    tab();
    expect(document.activeElement).toBe(el('editor'));
    tab();
    expect(document.activeElement).toBe(el('summary'));
    tab();
    expect(document.activeElement).toBe(el('submit'));
  });

  it('visits elements with positive tabindex first in ascending order', () => {
    const { el, tab } = setup(`
      <button id="second" tabindex="2">second</button>
      <button id="first" tabindex="1">first</button>
      <button id="third">third</button>
      <button id="fourth" tabindex="0">fourth</button>
    `);
    el('first').focus();
    tab();
    expect(document.activeElement).toBe(el('second'));
    tab();
    expect(document.activeElement).toBe(el('third'));
    tab();
    expect(document.activeElement).toBe(el('fourth'));
    tab();
    expect(document.activeElement).toBe(el('first'));
  });

  it('lets the browser handle Tab inside elements with native tab stops', () => {
    const { el, tab } = setup(`
      <input id="before" />
      <input id="time" type="time" />
      <button id="submit">submit</button>
    `);
    vi.useFakeTimers();
    el('time').focus();
    const event = tab();
    expect(event.defaultPrevented).toBe(false);
    expect(document.activeElement).toBe(el('time'));
    vi.runAllTimers();
    expect(document.activeElement).toBe(el('time'));
    vi.useRealTimers();
  });

  it('returns focus to the next element when a native tab stops element lets focus escape', () => {
    const { el, tab } = setup(`
      <input id="before" />
      <input id="time" type="time" />
      <button id="submit">submit</button>
    `);
    vi.useFakeTimers();
    el('time').focus();
    tab();
    el('outside').focus();
    vi.runAllTimers();
    expect(document.activeElement).toBe(el('submit'));

    el('time').focus();
    tab(true);
    el('outside').focus();
    vi.runAllTimers();
    expect(document.activeElement).toBe(el('before'));
    vi.useRealTimers();
  });

  it('corrects native Tab from a native tab stops element that skipped elements inside the trap', () => {
    const { el, tab } = setup(`
      <input id="before" />
      <input id="time" type="time" />
      <button id="submit">submit</button>
    `);
    vi.useFakeTimers();
    el('time').focus();
    tab();
    el('before').focus();
    vi.runAllTimers();
    expect(document.activeElement).toBe(el('submit'));
    vi.useRealTimers();
  });

  it('keeps focus in place and prevents default when there are no tabbable elements', () => {
    const { node, tab } = setup('<p>text</p>');
    node.focus();
    const event = tab();
    expect(event.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(node);
  });
});
