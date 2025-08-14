import { useState } from 'react'
import './App.css'
import NavBar from './components/NavBar'
import HomePage from './pages/Home'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className='bg-gray-900 text-white min-h-screen'>
        <NavBar />
        <div className='pt-16 px-75'>
          <HomePage />
        </div>
      </div>
    </>
  )
}

export default App