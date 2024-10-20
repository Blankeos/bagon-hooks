import { IconCheck, IconCopy } from 'dev/icons';
import { codeToHtml } from 'shiki/index.mjs';
import { createEffect, createSignal, FlowProps, JSX, Show } from 'solid-js';
import { MDXProvider } from 'solid-jsx';

/**
 * Any imports of `.mdx` inside the children components of this
 * component, will be as if (except no need to pass `components={}` in):
 *
 * ```tsx
 * import MdxComponent from './path/to/file.mdx';
 *
 * <MdxComponent component={components} />
 * ```
 */
export function MarkdownContextProvider(props: FlowProps) {
  return (
    <MDXProvider
      components={{
        code(codeProps: any): JSX.Element {
          const [ref, setRef] = createSignal<HTMLPreElement | undefined>();
          const [copied, setCopied] = createSignal(false);

          const originalContent = codeProps.children;

          createEffect(async () => {
            const current = ref();
            const content = originalContent;

            if (current && content) {
              const language = codeProps.className.slice(
                codeProps.className.indexOf('language-') + 9,
              ); // 9 chars of 'langauge-'. Stripped
              console.log();
              const result = await codeToHtml(content, {
                lang: 'tsx',
                theme: 'poimandres',
              });
              current.innerHTML = result;
            }
          });

          return (
            <div class="relative bg-pink-500">
              <button
                class="absolute right-0 top-0 p-2 text-neutral-50 opacity-50 transition will-change-transform active:scale-95"
                onClick={() => {
                  navigator.clipboard.writeText(originalContent);
                  setCopied(true);
                  setTimeout(() => {
                    setCopied(false);
                  }, 800);
                }}
              >
                <Show
                  when={copied()}
                  children={<IconCheck width={23} height={23} />}
                  fallback={<IconCopy width={23} height={23} />}
                />
              </button>
              <div ref={setRef} class="text-sm">
                {/* This will be replaced with the code element, but render it at first paint with opacity 0 so it takes up space. */}
                <div class="opacity-0">{originalContent}</div>
              </div>
            </div>
          );
        },
      }}
    >
      {props.children}
    </MDXProvider>
  );
}
