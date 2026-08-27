import { IconCode, IconGithub } from 'dev/icons';
import { Tippy } from 'dev/lib/solid-tippy';
import { createSignal, FlowProps, JSX, Show } from 'solid-js';

const GITHUB_BLOB_BASE = 'https://github.com/Blankeos/bagon-hooks/blob/main';

/** Titles whose source file is not `src/{kebab}/{kebab}.ts`. */
const SOURCE_PATH_OVERRIDES: Record<string, string> = {
  useDisclosureData: 'src/use-disclosure/use-disclosure.ts',
  useElementSize: 'src/use-resize-observer/use-resize-observer.ts',
  useLocalStorageStore: 'src/use-local-storage/use-local-storage-store.ts',
};

function toKebabCase(value: string) {
  return value.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

function resolveSourcePath(title: string, sourcePath?: string) {
  if (sourcePath) return sourcePath;
  if (SOURCE_PATH_OVERRIDES[title]) return SOURCE_PATH_OVERRIDES[title];
  const kebab = toKebabCase(title);
  return `src/${kebab}/${kebab}.ts`;
}

type ExampleBaseProps = {
  title: string;
  description: JSX.Element;
  class?: string;
  code?: JSX.Element;
  /**
   * Optional override for the hook source path on GitHub
   * (relative to repo root), e.g. `src/use-disclosure/use-disclosure.ts`.
   */
  sourcePath?: string;
};

export function ExampleBase(props: FlowProps<ExampleBaseProps>) {
  const [viewing, setViewing] = createSignal<'code' | 'result'>('result');
  const sourceHref = () =>
    `${GITHUB_BLOB_BASE}/${resolveSourcePath(props.title, props.sourcePath)}`;

  return (
    <div class="flex h-full max-h-[500px] w-full flex-col items-start gap-y-3 overflow-hidden rounded-lg bg-white p-5">
      <div class="flex w-full items-center justify-between">
        <h2 class="text-xl font-bold">{props.title}</h2>
        <div class="flex items-center gap-x-1">
          <Tippy content="View example code" props={{ delay: [200, 0], placement: 'top' }}>
            <button
              class={`flex size-6 items-center justify-center rounded-md border transition active:scale-95 ${viewing() === 'code' ? 'bg-background text-white' : ''}`}
              onClick={() => {
                setViewing(viewing() === 'code' ? 'result' : 'code');
              }}
              aria-label="View example code"
            >
              <IconCode class="size-3.5" />
            </button>
          </Tippy>

          <Tippy content="View source on GitHub" props={{ delay: [200, 0], placement: 'top' }}>
            <a
              class="flex size-6 items-center justify-center rounded-md border transition active:scale-95"
              href={sourceHref()}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View source on GitHub"
            >
              <IconGithub class="size-3.5" />
            </a>
          </Tippy>
        </div>
      </div>

      <div class="text-sm text-opacity-70">{props.description}</div>

      <Show when={viewing() === 'result'}>
        <div class="min-h-0 w-full flex-1 overflow-auto rounded-md">{props.children}</div>
      </Show>

      <div
        style={{ display: viewing() === 'code' ? 'block' : 'none' }}
        class="w-full flex-1 overflow-auto rounded-md border bg-[#1c1e28] p-3 text-white"
      >
        {props.code}
      </div>
    </div>
  );
}
