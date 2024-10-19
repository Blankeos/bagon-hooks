import { createEffect, type Component } from 'solid-js';
import './app.css';

// Hooks
import {
  useClickOutside,
  useElementSize,
  useHotkeys,
  useHover,
  useIdle,
  useNetwork,
  useOs,
  useResizeObserver,
  useToggle,
} from '../src';
import { unwrap } from 'solid-js/store';

const App: Component = () => {
  // let ref = useClickOutside(() => {
  //   alert('I have clicked outside')
  // })

  const os = useOs();

  const { hovered, ref } = useHover();

  const idle = useIdle(() => 1000, {
    events: ['mousemove', 'touchmove'],
    initialState: false,
  });

  const networkStatus = useNetwork();

  const [currentOption, toggle] = useToggle(['light', 'dark', 'system']);

  const { ref: elementSizeRef, width, height } = useElementSize();

  return (
    <div class="flex flex-col gap-y-5 items-start">
      {/* <p class="bg-green-500" ref={ref}>
        Hello world!
      </p> */}

      <p>OS: {os()}</p>

      <p ref={ref}>hovered: {JSON.stringify(hovered())}</p>

      <p>idle: {JSON.stringify(idle())}</p>

      <p>networkStatus: {JSON.stringify(networkStatus())}</p>

      <button onClick={() => toggle()}>Current Toggled: {JSON.stringify(currentOption())}</button>

      <textarea ref={elementSizeRef} class="resize">
        {width()} | {height()}
      </textarea>
    </div>
  );
};

export default App;
