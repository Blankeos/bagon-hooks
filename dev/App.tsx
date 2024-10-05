import type { Component } from 'solid-js';
import './app.css';

// Hooks
import { useClickOutside, useHotkeys, useHover, useOs } from '../src';

const App: Component = () => {
  // let ref = useClickOutside(() => {
  //   alert('I have clicked outside')
  // })

  const os = useOs();

  const { hovered, ref } = useHover();

  return (
    <div class="">
      {/* <p class="bg-green-500" ref={ref}>
        Hello world!
      </p> */}

      <p>OS: {os()}</p>

      <p ref={ref}>hovered: {JSON.stringify(hovered())}</p>
    </div>
  );
};

export default App;
