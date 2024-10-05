import type { Component } from 'solid-js'
import './app.css'

// Hooks
import { useClickOutside, useOs } from '../src'

const App: Component = () => {
  // let ref = useClickOutside(() => {
  //   alert('I have clicked outside')
  // })

  const os = useOs()

  return (
    <div class="">
      {/* <p class="bg-green-500" ref={ref}>
        Hello world!
      </p> */}

      <p>OS: {os()}</p>
    </div>
  )
}

export default App
