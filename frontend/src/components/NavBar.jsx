import { Bike, Menu, X, LogOut, User } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function NavBar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <>
            {/* Desktop Navbar */}
            <nav className="hidden md:flex justify-between items-center bg-gradient-to-r from-cyan-600 to-blue-600 p-4 px-8 lg:px-12 sticky top-0 z-50 shadow-md">
                <div className="flex items-center gap-6 lg:gap-8 text-white">
                    <Link to="/" className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                            <Bike className="w-5 h-5 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-white">
                            BikeHub
                        </h1>
                    </Link>
                    <Link to="/" className="hover:text-blue-100 transition-colors">Home</Link>
                    <Link to="/dashboard" className="hover:text-blue-100 transition-colors">Dashboard</Link>
                </div>
                <div className="flex items-center gap-4 lg:gap-6">
                    {user ? (
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 text-white bg-white/10 px-3 py-1.5 rounded-full">
                                <User size={18} />
                                <span className="text-sm font-medium">Account</span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-white backdrop-blur-sm transition-all duration-200 border border-white/10 shadow-sm"
                            >
                                <LogOut size={18} />
                                <span>Logout</span>
                            </button>
                        </div>
                    ) : (
                        <>
                            <Link to='/register'>
                                <button className="px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all duration-200 border border-white/30 shadow-sm text-white">
                                    Sign Up
                                </button>
                            </Link>
                            <Link to='/login'>
                                <button className="px-4 py-2 rounded-lg bg-white text-cyan-700 hover:bg-cyan-50 transition-all duration-200 shadow-sm font-medium">
                                    Log In
                                </button>
                            </Link>
                        </>
                    )}
                </div>
            </nav>

            {/* Mobile Navbar */}
            <nav className="md:hidden flex justify-between items-center bg-gradient-to-r from-cyan-600 to-blue-600 p-4 sticky top-0 z-50 shadow-md">
                <Link to="/" className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                        <Bike className="w-5 h-5 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-white">
                        BikeHub
                    </h1>
                </Link>

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
                        <Link to="/" className="py-3 border-b border-cyan-600" onClick={() => setMobileMenuOpen(false)}>Home</Link>
                        <Link to="/dashboard" className="py-3 border-b border-cyan-600" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
                    </div>

                    <div className="mt-8 flex flex-col gap-4">
                        {user ? (
                            <button
                                className="w-full py-3 rounded-lg bg-red-500 text-white transition-all duration-200 font-medium flex items-center justify-center gap-2"
                                onClick={() => {
                                    handleLogout();
                                    setMobileMenuOpen(false);
                                }}
                            >
                                <LogOut size={20} />
                                Logout
                            </button>
                        ) : (
                            <>
                                <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                                    <button className="w-full py-3 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all duration-200 border border-white/30 text-white">
                                        Sign Up
                                    </button>
                                </Link>
                                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                                    <button className="w-full py-3 rounded-lg bg-white text-cyan-700 hover:bg-cyan-50 transition-all duration-200 font-medium">
                                        Log In
                                    </button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}

export default NavBar;