import { createRenderEffect, createSignal } from 'solid-js';

export default function TestPage() {
  const [signal, setSignal] = createSignal(0);
  createRenderEffect(() => {
    console.log('test');
    setSignal(_ => _ + 1);
    setSignal(_ => _ + 1);
    setSignal(_ => _ + 1);
    setSignal(_ => _ + 1);
  });
  return <div>Test {signal()}</div>;
}
