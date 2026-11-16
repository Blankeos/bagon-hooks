import { describe, expect, it } from 'vitest';
import { getHotkeyMatcher } from '../src';

describe('Mantine 9.8.1 drift', () => {
  it('use-hotkeys: physical key codes are normalized case-insensitively, only stripping the Key prefix', () => {
    const matcher = getHotkeyMatcher('a', true);
    const ev = (code: string) =>
      ({ altKey: false, ctrlKey: false, metaKey: false, shiftKey: false, key: 'a', code }) as KeyboardEvent;
    expect(matcher(ev('KeyA'))).toBe(true);
    expect(matcher(ev('keyA'))).toBe(true);
    // 'Key' must not be stripped from the middle of a name
    expect(getHotkeyMatcher('monkey', true)(ev('Monkey'))).toBe(true);
    expect(getHotkeyMatcher('mon', true)(ev('Monkey'))).toBe(false);
  });
});
