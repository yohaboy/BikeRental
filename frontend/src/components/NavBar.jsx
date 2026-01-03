import React, { useState } from 'react';
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
        <nav className="border-b-2 border-border bg-card sticky top-0 z-50 shadow-warm">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 bg-primary flex items-center justify-center group-hover:bg-primary/90 transition-all shadow-warm">
                            <Bike className="text-white" size={20} strokeWidth={2.5} />
                        </div>
                        <span className="font-bold text-xl uppercase tracking-wider text-foreground">
                            BikeHub
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link
                            to="/"
                            className="text-sm font-bold uppercase tracking-wider text-foreground hover:text-primary transition-all"
                        >
                            Home
                        </Link>
                        <Link
                            to="/"
                            className="text-sm font-bold uppercase tracking-wider text-foreground hover:text-primary transition-all"
                        >
                            About
                        </Link>
                        <Link
                            to="/"
                            className="text-sm font-bold uppercase tracking-wider text-foreground hover:text-primary transition-all"
                        >
                            Contact
                        </Link>

                        <div className="h-6 w-px bg-border"></div>

                        {user ? (
                            <>
                                <Link
                                    to="/dashboard"
                                    className="text-sm font-bold uppercase tracking-wider text-foreground hover:text-primary transition-all"
                                >
                                    Dashboard
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="text-sm font-bold uppercase tracking-wider text-foreground hover:text-destructive transition-all"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="text-sm font-bold uppercase tracking-wider text-foreground hover:text-primary transition-all"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="btn-primary px-5 py-2 text-sm"
                                >
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all"
                    >
                        {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t-2 border-border bg-card">
                    <div className="px-6 py-4 space-y-4">
                        <Link
                            to="/"
                            onClick={() => setMobileMenuOpen(false)}
                            className="block text-sm font-bold uppercase tracking-wider text-foreground hover:text-primary transition-all"
                        >
                            Home
                        </Link>
                        <Link
                            to="/"
                            onClick={() => setMobileMenuOpen(false)}
                            className="block text-sm font-bold uppercase tracking-wider text-foreground hover:text-primary transition-all"
                        >
                            About
                        </Link>
                        <Link
                            to="/"
                            onClick={() => setMobileMenuOpen(false)}
                            className="block text-sm font-bold uppercase tracking-wider text-foreground hover:text-primary transition-all"
                        >
                            Contact
                        </Link>

                        <div className="h-px bg-border"></div>

                        {user ? (
                            <>
                                <Link
                                    to="/dashboard"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block text-sm font-bold uppercase tracking-wider text-foreground hover:text-primary transition-all"
                                >
                                    Dashboard
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="block w-full text-left text-sm font-bold uppercase tracking-wider text-foreground hover:text-destructive transition-all"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block text-sm font-bold uppercase tracking-wider text-foreground hover:text-primary transition-all"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block btn-primary px-5 py-3 text-sm text-center"
                                >
                                    Sign Up
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