// ===========================================================================
// Internals
// ===========================================================================

export type KeyboardModifiers = {
  alt: boolean
  ctrl: boolean
  meta: boolean
  mod: boolean
  shift: boolean
}

export type Hotkey = KeyboardModifiers & {
  key?: string
}

type CheckHotkeyMatch = (event: KeyboardEvent) => boolean

export function parseHotkey(hotkey: string): Hotkey {
  const keys = hotkey
    .toLowerCase()
    .split('+')
    .map(part => part.trim())

  const modifiers: KeyboardModifiers = {
    alt: keys.includes('alt'),
    ctrl: keys.includes('ctrl'),
    meta: keys.includes('meta'),
    mod: keys.includes('mod'),
    shift: keys.includes('shift'),
  }

  const reservedKeys = ['alt', 'ctrl', 'meta', 'shift', 'mod']

  const freeKey = keys.find(key => !reservedKeys.includes(key))

  return {
    ...modifiers,
    key: freeKey,
  }
}

function isExactHotkey(hotkey: Hotkey, event: KeyboardEvent): boolean {
  const { alt, ctrl, meta, mod, shift, key } = hotkey
  const { altKey, ctrlKey, metaKey, shiftKey, key: pressedKey } = event

  if (alt !== altKey) {
    return false
  }

  if (mod) {
    if (!ctrlKey && !metaKey) {
      return false
    }
  } else {
    if (ctrl !== ctrlKey) {
      return false
    }
    if (meta !== metaKey) {
      return false
    }
  }
  if (shift !== shiftKey) {
    return false
  }

  if (
    key &&
    (pressedKey.toLowerCase() === key.toLowerCase() ||
      event.code.replace('Key', '').toLowerCase() === key.toLowerCase())
  ) {
    return true
  }

  return false
}

export function getHotkeyMatcher(hotkey: string): CheckHotkeyMatch {
  return event => isExactHotkey(parseHotkey(hotkey), event)
}

export interface HotkeyItemOptions {
  preventDefault?: boolean
}

export function getHotkeyHandler(hotkeys: HotkeyItem[]) {
  //  TODO fix the any
  return (event: any) => {
    const _event = 'nativeEvent' in event ? event.nativeEvent : event
    hotkeys.forEach(([hotkey, handler, options = { preventDefault: true }]) => {
      if (getHotkeyMatcher(hotkey)(_event)) {
        if (options.preventDefault) {
          event.preventDefault()
        }

        handler(_event)
      }
    })
  }
}

// ===========================================================================
// The hook
// ===========================================================================
import { createEffect, onCleanup } from 'solid-js'

export type HotkeyItem = [string, (event: KeyboardEvent) => void, HotkeyItemOptions?]

function shouldFireEvent(
  event: KeyboardEvent,
  tagsToIgnore: string[],
  triggerOnContentEditable = false,
) {
  if (event.target instanceof HTMLElement) {
    if (triggerOnContentEditable) {
      return !tagsToIgnore.includes(event.target.tagName)
    }

    return !event.target.isContentEditable && !tagsToIgnore.includes(event.target.tagName)
  }

  return true
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
      hotkeys.forEach(([hotkey, handler, options = { preventDefault: true }]) => {
        if (
          getHotkeyMatcher(hotkey)(event) &&
          shouldFireEvent(event, tagsToIgnore, triggerOnContentEditable)
        ) {
          if (options.preventDefault) {
            event.preventDefault()
          }

          handler(event)
        }
      })
    }

    document.documentElement.addEventListener('keydown', keydownListener)

    onCleanup(() => document.documentElement.removeEventListener('keydown', keydownListener))
  })
}
