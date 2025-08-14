import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import NavBar from './components/NavBar'
import HomePage from './pages/Home'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className='bg-gray-900 text-white min-h-screen'>
        <NavBar />
        <div className='px-75'>
          <HomePage />
        </div>
      </div>
    </>
  )
}

export default App
