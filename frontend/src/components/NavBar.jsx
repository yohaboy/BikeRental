import { Bike, Menu, X } from 'lucide-react';
import { useState } from 'react';

function NavBar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="hidden md:flex justify-between items-center bg-gradient-to-r from-cyan-600 to-blue-600 p-4 px-8 lg:px-12 sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-6 lg:gap-8 text-white">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
              <Bike className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">
              BikeHub
            </h1>
          </div>
          <a href="/" className="hover:text-blue-900">Home</a>
          <a href="/dashboard" className="hover:text-blue-900">Dashboard</a>
          <a href="#" className="hover:text-blue-900">About</a>
          <a href="#" className="hover:text-blue-900">Contact</a>
        </div>
        <div className="flex items-center gap-4 lg:gap-6">
          <a href='/register'>
            <button className="px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all duration-200 border border-white/30 shadow-sm">
                Sign Up
            </button>
          </a>
          <a href='/login'>
            <button className="px-4 py-2 rounded-lg bg-white text-cyan-700 hover:bg-cyan-50 transition-all duration-200 shadow-sm font-medium">
                Log In
            </button>
          </a>
        </div>
      </nav>

      {/* Mobile Navbar */}
      <nav className="md:hidden flex justify-between items-center bg-gradient-to-r from-cyan-600 to-blue-600 p-4 sticky top-0 z-50 shadow-md">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
            <Bike className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">
            BikeHub
          </h1>
        </div>
        
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-white"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-cyan-700/95 backdrop-blur-sm pt-20 px-6 flex flex-col">
          <div className="flex flex-col gap-6 text-white text-lg">
            <a href="/" className="py-3 border-b border-cyan-600" onClick={() => setMobileMenuOpen(false)}>Home</a>
            <a href="/dashboard" className="py-3 border-b border-cyan-600" onClick={() => setMobileMenuOpen(false)}>Dashboard</a>
            <a href="#" className="py-3 border-b border-cyan-600" onClick={() => setMobileMenuOpen(false)}>About</a>
            <a href="#" className="py-3 border-b border-cyan-600" onClick={() => setMobileMenuOpen(false)}>Contact</a>
          </div>
          
          <div className="mt-8 flex flex-col gap-4">
            <button 
              className="w-full py-3 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all duration-200 border border-white/30"
              onClick={() => setMobileMenuOpen(false)}
            >
              Sign Up
            </button>
            <button 
              className="w-full py-3 rounded-lg bg-white text-cyan-700 hover:bg-cyan-50 transition-all duration-200 font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Log In
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default NavBar;