import type { Component } from 'solid-js'
import './app.css'

// Hooks
import { useClickOutside } from '../src'

const App: Component = () => {
  let ref = useClickOutside(() => {
    alert('I have clicked outside')
  })

  return (
    <div class="">
      <p class="bg-green-500" ref={ref}>
        Hello world!
      </p>
    </div>
  )
}

export default App
