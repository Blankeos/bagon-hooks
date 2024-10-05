import type { Component } from 'solid-js';
import './app.css';

// Hooks
import {
  useClickOutside,
  useHotkeys,
  useHover,
  useIdle,
  useNetwork,
  useOs,
  useToggle,
} from '../src';

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

  return (
    <div class="">
      {/* <p class="bg-green-500" ref={ref}>
        Hello world!
      </p> */}

      <p>OS: {os()}</p>

      <p ref={ref}>hovered: {JSON.stringify(hovered())}</p>

      <p>idle: {JSON.stringify(idle())}</p>

      <p>networkStatus: {JSON.stringify(networkStatus())}</p>

      <button onClick={() => toggle()}>Current Toggled: {JSON.stringify(currentOption())}</button>
    </div>
  );
};

export default App;
