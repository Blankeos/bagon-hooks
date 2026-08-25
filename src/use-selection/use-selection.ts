import { Accessor, createSignal, onCleanup, onMount } from 'solid-js';

export interface SelectionRange {
  /** Start offset of the selection range */
  start: number;

  /** End offset of the selection range */
  end: number;
}

export interface SelectionRect {
  /** X coordinate of the selection bounding rect */
  x: number;

  /** Y coordinate of the selection bounding rect */
  y: number;

  /** Width of the selection bounding rect */
  width: number;

  /** Height of the selection bounding rect */
  height: number;
}

export interface UseSelectionReturnValue {
  /** Currently selected text */
  text: Accessor<string>;

  /** Bounding client rect of the selection, `null` when collapsed */
  rect: Accessor<SelectionRect | null>;

  /** Selection ranges */
  ranges: Accessor<SelectionRange[]>;

  /** `true` when selection is collapsed (caret only, no text selected) */
  isCollapsed: Accessor<boolean>;

  /** Force-read the current document selection into state */
  getSelection: () => void;

  /** Programmatically set the selection range */
  setSelection: (range: SelectionRange, element?: HTMLElement | null) => void;

  /** Clear the current selection */
  clearSelection: (element?: HTMLElement | null) => void;
}

function getRangeText(range: Range): string {
  return range.toString();
}

function getElementText(element: HTMLElement): string {
  if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
    return element.value;
  }

  return element.textContent || '';
}

function resolveSelection(selection: Selection | null) {
  if (!selection || selection.rangeCount === 0) {
    return {
      text: '',
      rect: null as SelectionRect | null,
      ranges: [] as SelectionRange[],
      isCollapsed: true,
    };
  }

  const ranges: SelectionRange[] = [];
  let text = '';
  let rect: SelectionRect | null = null;

  for (let index = 0; index < selection.rangeCount; index += 1) {
    const range = selection.getRangeAt(index);
    const clientRect = range.getBoundingClientRect();

    ranges.push({
      start: range.startOffset,
      end: range.endOffset,
    });

    text += getRangeText(range);

    if (!range.collapsed) {
      rect = {
        x: clientRect.x,
        y: clientRect.y,
        width: clientRect.width,
        height: clientRect.height,
      };
    }
  }

  return {
    text,
    rect,
    ranges,
    isCollapsed: selection.isCollapsed,
  };
}

function isEditableElement(
  element: HTMLElement | null | undefined,
): element is HTMLInputElement | HTMLTextAreaElement {
  return !!element && (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement);
}

function getEditableSelection(element: HTMLInputElement | HTMLTextAreaElement) {
  const start = element.selectionStart ?? 0;
  const end = element.selectionEnd ?? 0;
  const text = element.value.slice(start, end);
  const isCollapsed = start === end;

  let rect: SelectionRect | null = null;

  if (!isCollapsed && typeof element.getBoundingClientRect === 'function') {
    const clientRect = element.getBoundingClientRect();
    rect = {
      x: clientRect.x,
      y: clientRect.y,
      width: clientRect.width,
      height: clientRect.height,
    };
  }

  return {
    text,
    rect,
    ranges: [{ start, end }],
    isCollapsed,
  };
}

function setEditableSelection(
  element: HTMLInputElement | HTMLTextAreaElement,
  range: SelectionRange,
) {
  const textLength = getElementText(element).length;
  const start = Math.max(0, Math.min(range.start, textLength));
  const end = Math.max(start, Math.min(range.end, textLength));

  element.focus();
  element.setSelectionRange(start, end);
}

function clearEditableSelection(element: HTMLInputElement | HTMLTextAreaElement) {
  const caret = element.selectionEnd ?? element.selectionStart ?? 0;
  element.setSelectionRange(caret, caret);
}

export function useSelection(): UseSelectionReturnValue {
  const [text, setText] = createSignal('');
  const [rect, setRect] = createSignal<SelectionRect | null>(null);
  const [ranges, setRanges] = createSignal<SelectionRange[]>([]);
  const [isCollapsed, setIsCollapsed] = createSignal(true);

  const syncSelection = () => {
    if (typeof document === 'undefined') {
      return;
    }

    const next = resolveSelection(document.getSelection());
    setText(next.text);
    setRect(next.rect);
    setRanges(next.ranges);
    setIsCollapsed(next.isCollapsed);
  };

  const setSelection = (range: SelectionRange, element?: HTMLElement | null) => {
    if (typeof document === 'undefined') {
      return;
    }

    if (isEditableElement(element)) {
      setEditableSelection(element, range);
      const next = getEditableSelection(element);
      setText(next.text);
      setRect(next.rect);
      setRanges(next.ranges);
      setIsCollapsed(next.isCollapsed);
      return;
    }

    const selection = document.getSelection();
    if (!selection) {
      return;
    }

    const target = element ?? document.body;
    const textNode = target.firstChild;

    if (!textNode || textNode.nodeType !== Node.TEXT_NODE) {
      return;
    }

    const contentLength = textNode.textContent?.length ?? 0;
    const start = Math.max(0, Math.min(range.start, contentLength));
    const end = Math.max(start, Math.min(range.end, contentLength));
    const domRange = document.createRange();

    domRange.setStart(textNode, start);
    domRange.setEnd(textNode, end);
    selection.removeAllRanges();
    selection.addRange(domRange);
    syncSelection();
  };

  const clearSelection = (element?: HTMLElement | null) => {
    if (typeof document === 'undefined') {
      return;
    }

    if (isEditableElement(element)) {
      clearEditableSelection(element);
      const next = getEditableSelection(element);
      setText(next.text);
      setRect(next.rect);
      setRanges(next.ranges);
      setIsCollapsed(next.isCollapsed);
      return;
    }

    document.getSelection()?.removeAllRanges();
    syncSelection();
  };

  onMount(() => {
    if (typeof document === 'undefined') {
      return;
    }

    syncSelection();

    document.addEventListener('selectionchange', syncSelection);
    document.addEventListener('pointerup', syncSelection);

    onCleanup(() => {
      document.removeEventListener('selectionchange', syncSelection);
      document.removeEventListener('pointerup', syncSelection);
    });
  });

  return {
    text,
    rect,
    ranges,
    isCollapsed,
    getSelection: syncSelection,
    setSelection,
    clearSelection,
  };
}

export namespace useSelection {
  export type ReturnValue = UseSelectionReturnValue;
  export type Range = SelectionRange;
  export type Rect = SelectionRect;
}
