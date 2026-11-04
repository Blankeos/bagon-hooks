---
'bagon-hooks': minor
---

Port upstream Mantine 9.7.5 hook drift.

**Breaking (minor bump while on 0.0.x)**

- `useRovingIndex` now follows Mantine's API: `useRovingIndex({ total, orientation, loop, dir, columns, activateOnFocus, focusedIndex, initialIndex, onFocusChange, isItemDisabled })` returning `{ getItemProps({ index }), focusedIndex (accessor), setFocusedIndex }`. The old `(index, setIndex, options)` signature, `getElementProps`, `getElementRef` and `onKeyDown` are removed.
- `useScroller` now follows Mantine's API: `canScrollStart` / `canScrollEnd` / `isDragging` accessors, `scrollStart` / `scrollEnd`, `dragHandlers`, `scrollAmount` / `draggable` / `onScrollStateChange`. `scrollTo` / `scrollToTop` / `scrollToBottom` and `behavior` are kept.
- `useTimeout` now spreads `start(...args)` into the callback (it previously passed a single array).
- `useDebouncedCallback` accepts `number | { delay, flushOnUnmount, leading, maxWait }` and the returned function has `.flush()`, `.cancel()` and `.isPending()`.

**Fixes / additions**

- `useMask`: guard non-string `e.key`, apply `transform` to the initial value, re-apply own value from raw, `#` token regex.
- `useFocusTrap`: sequence-based Tab scoping, nested traps, ignores default-prevented Tab.
- `useHotkeys`: per-item option defaults, `usePhysicalKeys`, key-name normalization and `[plus]`.
- `useClickOutside`: `enabled` and `capture` args, handler receives the event.
- `useOrientation`: `defaultAngle`, `defaultType`, `getInitialValueInEffect`; listener cleanup fixed.
- `useValidatedState`: `initialValidationState` arg.
- `useLocalStorage` / `useSessionStorage` / `useLocalStorageStore`: `key` may be an accessor and resets to default when nothing is stored.
- `useCollapse` / `useHorizontalCollapse`: stale-frame guard, zero-size fallback, fixed collapsed-state detection.
- `useScrollSpy`: `getNode()` re-resolves detached headings.
- `useFetch`, `useTimeout`, `useHash`, `useLongPress`, `useMove` (`touchcancel`), `useFocusWithin`, `useClipboard`, `useScrollIntoView`, `useThrottledCallback`, `useDebouncedSignal`, `useIntersection`, `useMediaQuery`: small upstream bug fixes.
