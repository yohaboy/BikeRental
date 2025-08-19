import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import './App.css';
import NavBar from './components/NavBar';
import HomePage from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import BikeRentalsDashboard from './pages/Dashboard';

function AppContent() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return !!localStorage.getItem('access_token');
  });
  
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className='bg-white min-h-screen'>
      <NavBar />
      <div className={
        isHomePage 
          ? 'pt-4 sm:pt-6 md:pt-8 lg:pt-6 xl:pt-6 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20' 
          : 'pt-4 sm:pt-6 md:pt-8 px-4 sm:px-6 md:px-8'
      }>
        <Routes>
          <Route
            path="/"
            element={isLoggedIn ? <HomePage /> : <Navigate to="/login" />}
          />
          <Route
            path="/login"
            element={isLoggedIn ? <Navigate to="/" /> : <Login />}
          />
          <Route
            path="/register"
            element={isLoggedIn ? <Navigate to="/" /> : <Register />}
          />
          <Route
            path="/dashboard"
            element={isLoggedIn ? <BikeRentalsDashboard /> : <Navigate to="/" />}
          />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;