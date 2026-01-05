import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import NavBar from './components/NavBar';
import HomePage from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import BikeRentalsDashboard from './pages/Dashboard';
import { useAuth } from './context/AuthContext';

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const isLoggedIn = !!user;

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <main>
        <Routes>
          <Route
            path="/"
            element={<HomePage />}
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
            element={isLoggedIn ? <BikeRentalsDashboard /> : <Navigate to="/login" />}
          />
        </Routes>
      </main>
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