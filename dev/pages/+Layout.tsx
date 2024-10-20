import { FlowProps } from 'solid-js';

import { Head } from 'vike-solid/Head';

import '../styles/app.css';
import { MarkdownContextProvider } from 'dev/components/markdown/markdown.context';

export default function Layout(props: FlowProps) {
  return (
    <>
      <Head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
      </Head>

      <MarkdownContextProvider>
        <div class="flex min-h-screen flex-col">
          {props.children}
          {/* <div class="flex-1 bg-pink-200">{props.children}</div>
        <footer>asd</footer> */}
        </div>
      </MarkdownContextProvider>
    </>
  );
}
