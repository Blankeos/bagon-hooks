import type { Component } from 'solid-js';
import './app.css';

// Hooks
import { useClickOutside, useHotkeys, useHover, useIdle, useOs } from '../src';

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
  return (
    <div class="">
      {/* <p class="bg-green-500" ref={ref}>
        Hello world!
      </p> */}

      <p>OS: {os()}</p>

      <p ref={ref}>hovered: {JSON.stringify(hovered())}</p>

      <p>idle: {JSON.stringify(idle())}</p>
    </div>
  );
};

export default App;
