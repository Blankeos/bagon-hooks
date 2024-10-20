import packageJSON from 'src/../package.json';

// Hooks
import { UseClickOutsideExample } from 'dev/components/examples/use-click-outside/use-click-outside.example';
import { UseClipboardExample } from 'dev/components/examples/use-clipboard/use-clipboard.example';
import { UseCounterExample } from 'dev/components/examples/use-counter/use-counter.example';
import { UseElementSizeExample } from 'dev/components/examples/use-element-size/use-element-size.example';
import { UseEyeDropperExample } from 'dev/components/examples/use-eye-dropper/use-eye-dropper.example';
import { UseFaviconExample } from 'dev/components/examples/use-favicon/use-favicon.example';
import { UseFullScreenExample } from 'dev/components/examples/use-fullscreen/use-fullscreen.example';
import { UseHashExample } from 'dev/components/examples/use-hash/use-hash.example';
import { UseHotkeysExample } from 'dev/components/examples/use-hotkeys/use-hotkeys.example';
import { UseHoverExample } from 'dev/components/examples/use-hover/use-hover.example';
import { UseIdExample } from 'dev/components/examples/use-id/use-id.example';
import { UseIdleExample } from 'dev/components/examples/use-idle/use-idle.example';
import { UseLocalStorageExample } from 'dev/components/examples/use-local-storage/use-local-storage.example';
import { UseMediaQueryExample } from 'dev/components/examples/use-media-query/use-media-query.example';
import { UseMountedExample } from 'dev/components/examples/use-mounted/use-mounted.example';
import { UseNetworkExample } from 'dev/components/examples/use-network/use-network.example';
import { UseOrientationExample } from 'dev/components/examples/use-orientation/use-orientation.example';
import { UseOsExample } from 'dev/components/examples/use-os/use-os.example';
import { UseResizeObserverExample } from 'dev/components/examples/use-resize-observer/use-resize-observer.example';
import { UseToggleExample } from 'dev/components/examples/use-toggle/use-toggle.example';
import { IconCheck, IconCopy, IconGithub, IconLogo } from 'dev/icons';
import { createMemo, createSignal, For, Show } from 'solid-js';
import { useLocalStorage } from 'src';

export default function HomePage() {
  const [searchInput, setSearchInput] = createSignal('');

  const LIST = [
    {
      title: 'useCounter',
      example: <UseCounterExample />,
    },
    {
      title: 'useOS',
      example: <UseOsExample />,
    },
    {
      title: 'useClickOutside',
      example: <UseClickOutsideExample />,
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
      title: 'useIdle',
      example: <UseIdleExample />,
    },
    {
      title: 'useId',
      example: <UseIdExample />,
    },
    {
      title: 'useMounted',
      example: <UseMountedExample />,
    },
    {
      title: 'useNetwork',
      example: <UseNetworkExample />,
    },
    {
      title: 'useResizeObserver',
      example: <UseResizeObserverExample />,
    },
    {
      title: 'useElementSize', // Make sure this is under useResizeObserver
      example: <UseElementSizeExample />,
    },
    {
      title: 'useToggle',
      example: <UseToggleExample />,
    },
    {
      title: 'useFavicon',
      example: <UseFaviconExample />,
    },
    {
      title: 'useLocalStorage',
      example: <UseLocalStorageExample />,
    },
    {
      title: 'useEyeDropper',
      example: <UseEyeDropperExample />,
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
      title: 'useClipboard',
      example: <UseClipboardExample />,
    },
    {
      title: 'useOrientation',
      example: <UseOrientationExample />,
    },
    {
      title: 'useMediaQuery',
      example: <UseMediaQueryExample />,
    },
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
      if (current === 'pnpm') return 'yarn';
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

        <p class="text-center text-neutral-50">
          A collection of zero-dependency hooks for SolidJS forked directly from Mantine Hooks, with
          some improvements.
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
            install bagon-hooks
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

        <input
          class="mx-auto w-full max-w-md rounded-md p-2.5 px-4"
          onInput={e => {
            setSearchInput(e.currentTarget.value);
          }}
          placeholder="useClickOutside"
        />
      </div>

      <div class="max-w-8xl mx-auto grid w-full grid-cols-1 gap-3 px-5 md:grid-cols-2 xl:grid-cols-3">
        <For each={filteredList()}>{_li => _li.example}</For>
      </div>

      <div class="h-20" />
      {/* <p ref={ref}>hovered: {JSON.stringify(hovered())}</p>

      <p>idle: {JSON.stringify(idle())}</p>

      <p>networkStatus: {JSON.stringify(networkStatus())}</p>

      <button onClick={() => toggle()}>Current Toggled: {JSON.stringify(currentOption())}</button> */}

      {/* <textarea ref={elementSizeRef} class="resize text-green-500">
      </textarea>
        {width()} */}
    </div>
  );
}
