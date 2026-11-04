// ===========================================================================
// Internals
// ===========================================================================

export type KeyboardModifiers = {
  alt: boolean;
  ctrl: boolean;
  meta: boolean;
  mod: boolean;
  shift: boolean;
};

export type Hotkey = KeyboardModifiers & {
  key?: string;
};

type CheckHotkeyMatch = (event: KeyboardEvent) => boolean;

export function parseHotkey(hotkey: string): Hotkey {
  const keys = hotkey
    .toLowerCase()
    .split('+')
    .map(part => part.trim());

  const modifiers: KeyboardModifiers = {
    alt: keys.includes('alt'),
    ctrl: keys.includes('ctrl'),
    meta: keys.includes('meta'),
    mod: keys.includes('mod'),
    shift: keys.includes('shift'),
  };

  const reservedKeys = ['alt', 'ctrl', 'meta', 'shift', 'mod'];

  const freeKey = keys.find(key => !reservedKeys.includes(key));

  return {
    ...modifiers,
    key: freeKey === '[plus]' ? '+' : freeKey,
  };
}

const keyNameMap: Record<string, string> = {
  ' ': 'space',
  ArrowLeft: 'arrowleft',
  ArrowRight: 'arrowright',
  ArrowUp: 'arrowup',
  ArrowDown: 'arrowdown',
  Escape: 'escape',
  Esc: 'escape',
  esc: 'escape',
  Enter: 'enter',
  Tab: 'tab',
  Backspace: 'backspace',
  Delete: 'delete',
  Insert: 'insert',
  Home: 'home',
  End: 'end',
  PageUp: 'pageup',
  PageDown: 'pagedown',
  '+': 'plus',
  '-': 'minus',
  '*': 'asterisk',
  '/': 'slash',
};

function normalizeKey(key: string): string {
  const lowerKey = key.replace('Key', '').toLowerCase();
  return keyNameMap[key] || lowerKey;
}

function isExactHotkey(hotkey: Hotkey, event: KeyboardEvent, usePhysicalKeys?: boolean): boolean {
  const { alt, ctrl, meta, mod, shift, key } = hotkey;
  const { altKey, ctrlKey, metaKey, shiftKey, key: pressedKey, code: pressedCode } = event;

  if (alt !== altKey) {
    return false;
  }

  if (mod) {
    if (!ctrlKey && !metaKey) {
      return false;
    }
  } else {
    if (ctrl !== ctrlKey) {
      return false;
    }
    if (meta !== metaKey) {
      return false;
    }
  }
  if (shift !== shiftKey) {
    return false;
  }

  if (
    key &&
    (usePhysicalKeys
      ? normalizeKey(pressedCode) === normalizeKey(key)
      : normalizeKey(pressedKey ?? pressedCode) === normalizeKey(key))
  ) {
    return true;
  }

  return false;
}

export function getHotkeyMatcher(hotkey: string, usePhysicalKeys?: boolean): CheckHotkeyMatch {
  return event => isExactHotkey(parseHotkey(hotkey), event, usePhysicalKeys);
}

export interface HotkeyItemOptions {
  /** Call `event.preventDefault()` when the hotkey matches, `true` by default */
  preventDefault?: boolean;
  /** Match against the physical key (`event.code`, e.g. `Digit1`) instead of the produced character, `false` by default */
  usePhysicalKeys?: boolean;
}

export function getHotkeyHandler(hotkeys: HotkeyItem[]) {
  //  TODO fix the any
  return (event: any) => {
    const _event = 'nativeEvent' in event ? event.nativeEvent : event;
    hotkeys.forEach(([hotkey, handler, options]) => {
      const { preventDefault = true, usePhysicalKeys = false } = options || {};

      if (getHotkeyMatcher(hotkey, usePhysicalKeys)(_event)) {
        if (preventDefault) {
          event.preventDefault();
        }

        handler(_event);
      }
    });
  };
}

// ===========================================================================
// The hook
// ===========================================================================
import { createEffect, onCleanup } from 'solid-js';

export type HotkeyItem = [string, (event: KeyboardEvent) => void, HotkeyItemOptions?];

function shouldFireEvent(
  event: KeyboardEvent,
  tagsToIgnore: string[],
  triggerOnContentEditable = false,
) {
  if (event.target instanceof HTMLElement) {
    if (triggerOnContentEditable) {
      return !tagsToIgnore.includes(event.target.tagName);
    }

    return !event.target.isContentEditable && !tagsToIgnore.includes(event.target.tagName);
  }

  return true;
}

/**
 * A hook that listens to keyboard events and triggers a callback when a hotkey is pressed.
 *
 * @param hotkeys - An array of hotkey combinations and callbacks.
 * @param tagsToIgnore - An array of HTML tag names to ignore when listening for hotkeys.
 * @param triggerOnContentEditable - Whether to trigger the callback when the hotkey is pressed on a contenteditable element.
 */
export function useHotkeys(
  hotkeys: HotkeyItem[],
  tagsToIgnore: string[] = ['INPUT', 'TEXTAREA', 'SELECT'],
  triggerOnContentEditable = false,
) {
  createEffect(() => {
    const keydownListener = (event: KeyboardEvent) => {
      hotkeys.forEach(([hotkey, handler, options]) => {
        const { preventDefault = true, usePhysicalKeys = false } = options || {};

        if (
          getHotkeyMatcher(hotkey, usePhysicalKeys)(event) &&
          shouldFireEvent(event, tagsToIgnore, triggerOnContentEditable)
        ) {
          if (preventDefault) {
            event.preventDefault();
          }

          handler(event);
        }
      });
    };

    document.documentElement.addEventListener('keydown', keydownListener);

    onCleanup(() => document.documentElement.removeEventListener('keydown', keydownListener));
  });
}
