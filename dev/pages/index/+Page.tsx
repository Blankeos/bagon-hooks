// import { createMemo, type Component } from 'solid-js';

// Hooks
import { UseClickOutsideExample } from 'dev/components/examples/use-click-outside/use-click-outside.example';
import { UseElementSizeExample } from 'dev/components/examples/use-element-size/use-element-size.example';
import { UseFaviconExample } from 'dev/components/examples/use-favicon/use-favicon.example';
import { UseHotkeysExample } from 'dev/components/examples/use-hotkeys/use-hotkeys.example';
import { UseHoverExample } from 'dev/components/examples/use-hover/use-hover.example';
import { UseIdleExample } from 'dev/components/examples/use-idle/use-idle.example';
import { UseLocalStorageExample } from 'dev/components/examples/use-local-storage/use-local-storage.example';
import { UseMountedExample } from 'dev/components/examples/use-mounted/use-mounted.example';
import { UseNetworkExample } from 'dev/components/examples/use-network/use-network.example';
import { UseOsExample } from 'dev/components/examples/use-os/use-os.example';
import { UseResizeObserverExample } from 'dev/components/examples/use-resize-observer/use-resize-observer.example';
import { UseToggleExample } from 'dev/components/examples/use-toggle/use-toggle.example';
import { IconCheck, IconCopy, IconGithub, IconLogo } from 'dev/icons';
import { createMemo, createSignal, For, Show } from 'solid-js';
import { useOs, useToggle } from 'src';

export default function HomePage() {
  // // let ref = useClickOutside(() =>
  // //   alert('I have clicked outside')
  // // })

  const os = useOs();

  // const { hovered, ref } = useHover();

  // const idle = useIdle(() => 1000, {
  //   events: ['mousemove', 'touchmove'],
  //   initialState: false,
  // });

  // const networkStatus = useNetwork();

  // const [currentOption, toggle] = useToggle(['light', 'dark', 'system']);

  // const { ref: elementSizeRef, width, height } = useElementSize();

  const [searchInput, setSearchInput] = createSignal('');

  const LIST = [
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
  ];

  const filteredList = createMemo(() => {
    return LIST.filter(item => item.title.toLowerCase().includes(searchInput().toLowerCase()));
  });

  const [copied, setCopied] = createSignal(false);
  const [pkgManager, togglePkgManager] = useToggle(['npm', 'bun', 'pnpm', 'yarn'] as const);
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

        <h1 class="text-center text-5xl font-medium text-white">Bagon Hooks</h1>
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
