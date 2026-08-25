import packageJSON from 'src/../package.json';
import { For, Show, createMemo, createSignal, onMount } from 'solid-js';
import { createStore } from 'solid-js/store';
import { usePageContext } from 'vike-solid/usePageContext';
import { getHotkeyHandler, useHotkeys, useKeyboard, useLocalStorage } from 'src';
import { Kbd } from 'dev/components/kbd';
import { HOOKS_COUNT } from 'dev/constants/hooks-count';
import { IconCheck, IconCopy, IconGithub, IconLogo } from 'dev/icons';

// Hooks
import { UseClickOutsideExample } from 'dev/components/examples/use-click-outside/use-click-outside.example';
import { UseClipboardExample } from 'dev/components/examples/use-clipboard/use-clipboard.example';
import { UseCollapseExample } from 'dev/components/examples/use-collapse/use-collapse.example';
import { UseColorSchemeExample } from 'dev/components/examples/use-color-scheme/use-color-scheme.example';
import { UseCounterExample } from 'dev/components/examples/use-counter/use-counter.example';
import { UseDebouncedCallbackExample } from 'dev/components/examples/use-debounced-callback/use-debounced-callback.example';
import { UseDebouncedSignalExample } from 'dev/components/examples/use-debounced-signal/use-debounced-signal.example';
import { UseDebouncedValueExample } from 'dev/components/examples/use-debounced-value/use-debounced-value.example';
import { UseDidUpdateExample } from 'dev/components/examples/use-did-update/use-did-update.example';
import { UseDisclosureExample } from 'dev/components/examples/use-disclosure/use-disclosure.example';
import { UseDisclosureDataExample } from 'dev/components/examples/use-disclosure-data/use-disclosure-data.example';
import { UseDocumentTitleExample } from 'dev/components/examples/use-document-title/use-document-title.example';
import { UseDocumentVisibilityExample } from 'dev/components/examples/use-document-visibility/use-document-visibility.example';
import { UseDragExample } from 'dev/components/examples/use-drag/use-drag.example';
import { UseElementSizeExample } from 'dev/components/examples/use-element-size/use-element-size.example';
import { UseEventListenerExample } from 'dev/components/examples/use-event-listener/use-event-listener.example';
import { UseEyeDropperExample } from 'dev/components/examples/use-eye-dropper/use-eye-dropper.example';
import { UseFaviconExample } from 'dev/components/examples/use-favicon/use-favicon.example';
import { UseFetchExample } from 'dev/components/examples/use-fetch/use-fetch.example';
import { UseFileDialogExample } from 'dev/components/examples/use-file-dialog/use-file-dialog.example';
import { UseFloatingWindowExample } from 'dev/components/examples/use-floating-window/use-floating-window.example';
import { UseFocusReturnExample } from 'dev/components/examples/use-focus-return/use-focus-return.example';
import { UseFocusTrapExample } from 'dev/components/examples/use-focus-trap/use-focus-trap.example';
import { UseFocusWithinExample } from 'dev/components/examples/use-focus-within/use-focus-within.example';
import { UseFullScreenExample } from 'dev/components/examples/use-fullscreen/use-fullscreen.example';
import { UseHashExample } from 'dev/components/examples/use-hash/use-hash.example';
import { UseHeadroomExample } from 'dev/components/examples/use-headroom/use-headroom.example';
import { UseHorizontalCollapseExample } from 'dev/components/examples/use-horizontal-collapse/use-horizontal-collapse.example';
import { UseHotkeysExample } from 'dev/components/examples/use-hotkeys/use-hotkeys.example';
import { UseHoverExample } from 'dev/components/examples/use-hover/use-hover.example';
import { UseIdExample } from 'dev/components/examples/use-id/use-id.example';
import { UseIdleExample } from 'dev/components/examples/use-idle/use-idle.example';
import { UseInViewportExample } from 'dev/components/examples/use-in-viewport/use-in-viewport.example';
import { UseInputStateExample } from 'dev/components/examples/use-input-state/use-input-state.example';
import { UseIntersectionExample } from 'dev/components/examples/use-intersection/use-intersection.example';
import { UseIntervalExample } from 'dev/components/examples/use-interval/use-interval.example';
import { UseKeyboardExample } from 'dev/components/examples/use-keyboard/use-keyboard.example';
import { UseListStateExample } from 'dev/components/examples/use-list-state/use-list-state.example';
import { UseLocalStorageExample } from 'dev/components/examples/use-local-storage/use-local-storage.example';
import { UseLocalStorageStoreExample } from 'dev/components/examples/use-local-storage-store/use-local-storage-store.example';
import { UseLongPressExample } from 'dev/components/examples/use-long-press/use-long-press.example';
import { UseMapExample } from 'dev/components/examples/use-map/use-map.example';
import { UseMaskExample } from 'dev/components/examples/use-mask/use-mask.example';
import { UseMediaQueryExample } from 'dev/components/examples/use-media-query/use-media-query.example';
import { UseMountedExample } from 'dev/components/examples/use-mounted/use-mounted.example';
import { UseMouseExample } from 'dev/components/examples/use-mouse/use-mouse.example';
import { UseMoveExample } from 'dev/components/examples/use-move/use-move.example';
import { UseMutationObserverExample } from 'dev/components/examples/use-mutation-observer/use-mutation-observer.example';
import { UseNetworkExample } from 'dev/components/examples/use-network/use-network.example';
import { UseOrientationExample } from 'dev/components/examples/use-orientation/use-orientation.example';
import { UseOsExample } from 'dev/components/examples/use-os/use-os.example';
import { UsePageLeaveExample } from 'dev/components/examples/use-page-leave/use-page-leave.example';
import { UsePaginationExample } from 'dev/components/examples/use-pagination/use-pagination.example';
import { UsePreviousExample } from 'dev/components/examples/use-previous/use-previous.example';
import { UseQueueExample } from 'dev/components/examples/use-queue/use-queue.example';
import { UseRadialMoveExample } from 'dev/components/examples/use-radial-move/use-radial-move.example';
import { UseReducedMotionExample } from 'dev/components/examples/use-reduced-motion/use-reduced-motion.example';
import { UseResizeObserverExample } from 'dev/components/examples/use-resize-observer/use-resize-observer.example';
import { UseRovingIndexExample } from 'dev/components/examples/use-roving-index/use-roving-index.example';
import { UseScrollDirectionExample } from 'dev/components/examples/use-scroll-direction/use-scroll-direction.example';
import { UseScrollIntoViewExample } from 'dev/components/examples/use-scroll-into-view/use-scroll-into-view.example';
import { UseScrollSpyExample } from 'dev/components/examples/use-scroll-spy/use-scroll-spy.example';
import { UseScrollerExample } from 'dev/components/examples/use-scroller/use-scroller.example';
import { UseSelectionExample } from 'dev/components/examples/use-selection/use-selection.example';
import { UseSessionStorageExample } from 'dev/components/examples/use-session-storage/use-session-storage.example';
import { UseSetExample } from 'dev/components/examples/use-set/use-set.example';
import { UseSplitterExample } from 'dev/components/examples/use-splitter/use-splitter.example';
import { UseStateHistoryExample } from 'dev/components/examples/use-state-history/use-state-history.example';
import { UseTextSelectionExample } from 'dev/components/examples/use-text-selection/use-text-selection.example';
import { UseThrottledCallbackExample } from 'dev/components/examples/use-throttled-callback/use-throttled-callback.example';
import { UseThrottledStateExample } from 'dev/components/examples/use-throttled-state/use-throttled-state.example';
import { UseThrottledValueExample } from 'dev/components/examples/use-throttled-value/use-throttled-value.example';
import { UseTimeoutExample } from 'dev/components/examples/use-timeout/use-timeout.example';
import { UseToggleExample } from 'dev/components/examples/use-toggle/use-toggle.example';
import { UseUncontrolledExample } from 'dev/components/examples/use-uncontrolled/use-uncontrolled.example';
import { UseValidatedStateExample } from 'dev/components/examples/use-validated-state/use-validated-state.example';
import { UseViewportSizeExample } from 'dev/components/examples/use-viewport-size/use-viewport-size.example';
import { UseWindowScrollExample } from 'dev/components/examples/use-window-scroll/use-window-scroll.example';

function setQueryParam(value: string) {
  if (typeof window === 'undefined') return;
  const url = new URL(window.location.href);
  if (value) url.searchParams.set('query', value);
  else url.searchParams.delete('query');
  window.history.replaceState(null, '', url);
}

export default function HomePage() {
  const pageContext = usePageContext();
  const [searchInput, setSearchInput] = createSignal('');

  onMount(() => {
    const query = pageContext.urlParsed.search.query ?? '';
    if (!query) return;
    setSearchInput(query);
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
  });

  const [kbdActiveStore, setKbdActiveStore] = createStore({ cmd: false, K: false });
  const LIST = [
    {
      title: 'useClickOutside',
      example: <UseClickOutsideExample />,
    },
    {
      title: 'useClipboard',
      example: <UseClipboardExample />,
    },
    {
      title: 'useCollapse',
      example: <UseCollapseExample />,
    },
    {
      title: 'useColorScheme',
      example: <UseColorSchemeExample />,
    },
    {
      title: 'useCounter',
      example: <UseCounterExample />,
    },
    {
      title: 'useDebouncedCallback',
      example: <UseDebouncedCallbackExample />,
    },
    {
      title: 'useDebouncedSignal',
      example: <UseDebouncedSignalExample />,
    },
    {
      title: 'useDebouncedValue',
      example: <UseDebouncedValueExample />,
    },
    {
      title: 'useDidUpdate',
      example: <UseDidUpdateExample />,
    },
    {
      title: 'useDisclosure',
      example: <UseDisclosureExample />,
    },
    {
      title: 'useDisclosureData',
      example: <UseDisclosureDataExample />,
    },
    {
      title: 'useDocumentTitle',
      example: <UseDocumentTitleExample />,
    },
    {
      title: 'useDocumentVisibility',
      example: <UseDocumentVisibilityExample />,
    },
    {
      title: 'useDrag',
      example: <UseDragExample />,
    },
    {
      title: 'useElementSize',
      example: <UseElementSizeExample />,
    },
    {
      title: 'useEventListener',
      example: <UseEventListenerExample />,
    },
    {
      title: 'useEyeDropper',
      example: <UseEyeDropperExample />,
    },
    {
      title: 'useFavicon',
      example: <UseFaviconExample />,
    },
    {
      title: 'useFetch',
      example: <UseFetchExample />,
    },
    {
      title: 'useFileDialog',
      example: <UseFileDialogExample />,
    },
    {
      title: 'useFloatingWindow',
      example: <UseFloatingWindowExample />,
    },
    {
      title: 'useFocusReturn',
      example: <UseFocusReturnExample />,
    },
    {
      title: 'useFocusTrap',
      example: <UseFocusTrapExample />,
    },
    {
      title: 'useFocusWithin',
      example: <UseFocusWithinExample />,
    },
    {
      title: 'useFullscreen',
      example: <UseFullScreenExample />,
    },
    {
      title: 'useHash',
      example: <UseHashExample />,
    },
    {
      title: 'useHeadroom',
      example: <UseHeadroomExample />,
    },
    {
      title: 'useHorizontalCollapse',
      example: <UseHorizontalCollapseExample />,
    },
    {
      title: 'useHotkeys',
      example: <UseHotkeysExample />,
    },
    {
      title: 'useHover',
      example: <UseHoverExample />,
    },
    {
      title: 'useId',
      example: <UseIdExample />,
    },
    {
      title: 'useIdle',
      example: <UseIdleExample />,
    },
    {
      title: 'useInViewport',
      example: <UseInViewportExample />,
    },
    {
      title: 'useInputState',
      example: <UseInputStateExample />,
    },
    {
      title: 'useIntersection',
      example: <UseIntersectionExample />,
    },
    {
      title: 'useInterval',
      example: <UseIntervalExample />,
    },
    {
      title: 'useKeyboard',
      example: <UseKeyboardExample />,
    },
    {
      title: 'useListState',
      example: <UseListStateExample />,
    },
    {
      title: 'useLocalStorage',
      example: <UseLocalStorageExample />,
    },
    {
      title: 'useLocalStorageStore',
      example: <UseLocalStorageStoreExample />,
    },
    {
      title: 'useLongPress',
      example: <UseLongPressExample />,
    },
    {
      title: 'useMap',
      example: <UseMapExample />,
    },
    {
      title: 'useMask',
      example: <UseMaskExample />,
    },
    {
      title: 'useMediaQuery',
      example: <UseMediaQueryExample />,
    },
    {
      title: 'useMounted',
      example: <UseMountedExample />,
    },
    {
      title: 'useMouse',
      example: <UseMouseExample />,
    },
    {
      title: 'useMove',
      example: <UseMoveExample />,
    },
    {
      title: 'useMutationObserver',
      example: <UseMutationObserverExample />,
    },
    {
      title: 'useNetwork',
      example: <UseNetworkExample />,
    },
    {
      title: 'useOrientation',
      example: <UseOrientationExample />,
    },
    {
      title: 'useOS',
      example: <UseOsExample />,
    },
    {
      title: 'usePageLeave',
      example: <UsePageLeaveExample />,
    },
    {
      title: 'usePagination',
      example: <UsePaginationExample />,
    },
    {
      title: 'usePrevious',
      example: <UsePreviousExample />,
    },
    {
      title: 'useQueue',
      example: <UseQueueExample />,
    },
    {
      title: 'useRadialMove',
      example: <UseRadialMoveExample />,
    },
    {
      title: 'useReducedMotion',
      example: <UseReducedMotionExample />,
    },
    {
      title: 'useResizeObserver',
      example: <UseResizeObserverExample />,
    },
    {
      title: 'useRovingIndex',
      example: <UseRovingIndexExample />,
    },
    {
      title: 'useScrollDirection',
      example: <UseScrollDirectionExample />,
    },
    {
      title: 'useScrollIntoView',
      example: <UseScrollIntoViewExample />,
    },
    {
      title: 'useScrollSpy',
      example: <UseScrollSpyExample />,
    },
    {
      title: 'useScroller',
      example: <UseScrollerExample />,
    },
    {
      title: 'useSelection',
      example: <UseSelectionExample />,
    },
    {
      title: 'useSessionStorage',
      example: <UseSessionStorageExample />,
    },
    {
      title: 'useSet',
      example: <UseSetExample />,
    },
    {
      title: 'useSplitter',
      example: <UseSplitterExample />,
    },
    {
      title: 'useStateHistory',
      example: <UseStateHistoryExample />,
    },
    {
      title: 'useTextSelection',
      example: <UseTextSelectionExample />,
    },
    {
      title: 'useThrottledCallback',
      example: <UseThrottledCallbackExample />,
    },
    {
      title: 'useThrottledState',
      example: <UseThrottledStateExample />,
    },
    {
      title: 'useThrottledValue',
      example: <UseThrottledValueExample />,
    },
    {
      title: 'useTimeout',
      example: <UseTimeoutExample />,
    },
    {
      title: 'useToggle',
      example: <UseToggleExample />,
    },
    {
      title: 'useUncontrolled',
      example: <UseUncontrolledExample />,
    },
    {
      title: 'useValidatedState',
      example: <UseValidatedStateExample />,
    },
    {
      title: 'useViewportSize',
      example: <UseViewportSizeExample />,
    },
    {
      title: 'useWindowScroll',
      example: <UseWindowScrollExample />,
    }
  ];

  const filteredList = createMemo(() => {
    return LIST.filter(item => item.title.toLowerCase().includes(searchInput().toLowerCase()));
  });

  const [copied, setCopied] = createSignal(false);
  const [pkgManager, setPackageManager] = useLocalStorage({
    key: 'preferred-pkg-manager',
    defaultValue: 'npm',
  });
  function togglePkgManager() {
    setPackageManager(current => {
      if (current === 'npm') return 'bun';
      if (current === 'bun') return 'pnpm';
      if (current === 'pnpm') return 'deno';
      if (current === 'deno') return 'yarn';
      if (current === 'yarn') return 'npm';
      return 'npm';
    });
  }
  const pkgManagerColor = createMemo(() => {
    if (pkgManager() === 'npm') return '#E5312F';
    if (pkgManager() === 'bun') return '#FBF0DF';
    if (pkgManager() === 'pnpm') return '#F9AD00';
    if (pkgManager() === 'yarn') return '#2C8EBB';
    return undefined;
  });

  let searchInputRef!: HTMLInputElement;

  useHotkeys([
    [
      'mod+k',
      () => {
        searchInputRef.focus();
      },
    ],
  ]);

  useKeyboard({
    onKeyDown: event => {
      if (event.key === 'k') {
        setKbdActiveStore('K', true);
      }
      if (event.metaKey) {
        setKbdActiveStore('cmd', true);
      }
    },
    onKeyUp(event) {
      if (event.key === 'k') {
        setKbdActiveStore('K', false);
      }
      if (event.key === 'Meta') {
        setKbdActiveStore('cmd', false);

        if (kbdActiveStore.K) {
          setKbdActiveStore('K', false);
        }
      }
    },
  });

  return (
    <div class="relative flex flex-col items-start gap-y-5">
      <a
        href="https://github.com/Blankeos/bagon-hooks"
        target="_blank"
        class="absolute right-0 top-0 m-5 p-1 transition active:scale-95"
      >
        <IconGithub class="h-6 w-6 text-white" />
      </a>
      <div class="mx-auto flex w-full max-w-4xl flex-col gap-y-5 px-4 py-20">
        <IconLogo width={80} height={80} variant="inverted" class="self-center" />

        <div class="relative mx-auto flex w-max justify-center gap-x-2">
          <h1 class="text-center text-5xl font-medium text-white">Bagon Hooks</h1>
          <span class="absolute bottom-0 left-full mx-2 text-base text-muted">
            v{packageJSON.version}
          </span>
        </div>

        <p class="mx-auto max-w-lg text-center text-neutral-50">
          A collection of <span class="font-semibold">{HOOKS_COUNT}+</span> zero-dependency hooks
          for SolidJS forked directly from Mantine Hooks, with some improvements.
        </p>

        <div class="class mx-auto flex items-center gap-x-4 rounded-md border border-neutral-950 bg-neutral-800 p-4 text-muted">
          <span>
            <span class="text-green-500">{'>'}</span>{' '}
            <button
              class="rounded-md border bg-opacity-50 px-1.5 font-semibold"
              style={{ 'border-color': pkgManagerColor() }}
              onClick={togglePkgManager}
            >
              {pkgManager()}
            </button>{' '}
            install {pkgManager() === 'deno' ? 'npm:' : ''}bagon-hooks
          </span>
          <button
            class="transition active:scale-90"
            onClick={() => {
              navigator.clipboard.writeText(`${pkgManager()} install bagon-hooks`);
              setCopied(true);
              setTimeout(() => {
                setCopied(false);
              }, 800);
            }}
          >
            <Show
              when={copied()}
              fallback={<IconCopy width={23} height={23} />}
              children={<IconCheck width={23} height={23} />}
            />
          </button>
        </div>

        <div class="relative mx-auto flex h-max w-full max-w-md items-center">
          <input
            ref={searchInputRef}
            value={searchInput()}
            class="pjx-4 relative w-full rounded-md p-2.5"
            onInput={e => {
              const value = e.currentTarget.value;
              setSearchInput(value);
              setQueryParam(value);
            }}
            placeholder="Quicksearch..."
            onKeyDown={getHotkeyHandler([
              [
                'Escape',
                () => {
                  searchInputRef.blur();
                },
              ],
            ])}
          />
          <div class="absolute right-0 top-2.5 flex items-center gap-x-1 px-2 opacity-80">
            <Kbd activated={kbdActiveStore.cmd}>Cmd</Kbd>
            <Kbd activated={kbdActiveStore.K}>K</Kbd>
          </div>
        </div>
      </div>

      <div
        class={`${'max-w-8xl mx-auto flex w-full flex-col gap-3 px-3'} grid-cols-1 md:grid md:grid-cols-2 xl:grid-cols-3`}
      >
        <For each={filteredList()}>{_li => _li.example}</For>
      </div>

      <div class="h-20" />
    </div>
  );
}
