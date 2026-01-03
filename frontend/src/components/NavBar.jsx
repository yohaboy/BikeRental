import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, Bike } from 'lucide-react';

function NavBar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
        setMobileMenuOpen(false);
    };

    return (
        <nav className="border-b-2 border-border bg-background sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex justify-between items-center h-16">
                    {/* Logo - Minimal */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="w-8 h-8 border-2 border-foreground flex items-center justify-center group-hover:bg-foreground transition-all">
                            <Bike className="text-foreground group-hover:text-background transition-all" size={18} strokeWidth={2} />
                        </div>
                        <span className="font-bold text-lg uppercase tracking-wider">BikeHub</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link
                            to="/"
                            className="text-sm font-medium uppercase tracking-wider hover:text-muted-foreground transition-all"
                        >
                            Home
                        </Link>
                        <Link
                            to="/"
                            className="text-sm font-medium uppercase tracking-wider hover:text-muted-foreground transition-all"
                        >
                            About
                        </Link>
                        <Link
                            to="/"
                            className="text-sm font-medium uppercase tracking-wider hover:text-muted-foreground transition-all"
                        >
                            Contact
                        </Link>

                        <div className="h-6 w-px bg-border"></div>

                        {user ? (
                            <>
                                <Link
                                    to="/dashboard"
                                    className="text-sm font-medium uppercase tracking-wider hover:text-muted-foreground transition-all"
                                >
                                    Dashboard
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="text-sm font-medium uppercase tracking-wider hover:text-muted-foreground transition-all"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="text-sm font-medium uppercase tracking-wider hover:text-muted-foreground transition-all"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="px-4 py-2 border-2 border-foreground font-bold text-sm uppercase tracking-wider hover:bg-foreground hover:text-background transition-all"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 border-2 border-foreground hover:bg-foreground hover:text-background transition-all"
                    >
                        {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t-2 border-border bg-background">
                    <div className="px-6 py-4 space-y-4">
                        <Link
                            to="/"
                            onClick={() => setMobileMenuOpen(false)}
                            className="block text-sm font-medium uppercase tracking-wider hover:text-muted-foreground transition-all"
                        >
                            Home
                        </Link>
                        <Link
                            to="/"
                            onClick={() => setMobileMenuOpen(false)}
                            className="block text-sm font-medium uppercase tracking-wider hover:text-muted-foreground transition-all"
                        >
                            About
                        </Link>
                        <Link
                            to="/"
                            onClick={() => setMobileMenuOpen(false)}
                            className="block text-sm font-medium uppercase tracking-wider hover:text-muted-foreground transition-all"
                        >
                            Contact
                        </Link>

                        <div className="h-px bg-border"></div>

                        {user ? (
                            <>
                                <Link
                                    to="/dashboard"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block text-sm font-medium uppercase tracking-wider hover:text-muted-foreground transition-all"
                                >
                                    Dashboard
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="block w-full text-left text-sm font-medium uppercase tracking-wider hover:text-muted-foreground transition-all"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block text-sm font-medium uppercase tracking-wider hover:text-muted-foreground transition-all"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block px-4 py-2 border-2 border-foreground font-bold text-sm uppercase tracking-wider text-center hover:bg-foreground hover:text-background transition-all"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}

export default NavBar;