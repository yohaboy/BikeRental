import { useState } from 'react'
import './App.css'
import NavBar from './components/NavBar'
import HomePage from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import BikeRentalsDashboard from './pages/Dashboard'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className='bg-gray-900 min-h-screen'>
        <NavBar />
        <div className='pt-16 px-75'>
          <HomePage />
        </div>
        <Login />
        <Register />
        <BikeRentalsDashboard />
      </div>
    </>
  )
}

export default App