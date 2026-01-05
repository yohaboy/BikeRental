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
        <nav className="bg-card border-b border-border/40 sticky top-0 z-50 backdrop-blur-sm bg-card/80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground transition-transform group-hover:scale-110">
                            <Bike size={20} strokeWidth={2.5} />
                        </div>
                        <span className="font-bold text-xl tracking-tight text-foreground">
                            BikeHub
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-6">
                        <Link
                            to="/"
                            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                        >
                            Home
                        </Link>
                        <Link
                            to="/"
                            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                        >
                            About
                        </Link>
                        <Link
                            to="/"
                            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                        >
                            Contact
                        </Link>

                        <div className="h-4 w-px bg-border"></div>

                        {user ? (
                            <>
                                <Link
                                    to="/dashboard"
                                    className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                                >
                                    Dashboard
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="text-sm font-medium text-muted-foreground hover:text-destructive transition-colors"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="btn-primary"
                                >
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 rounded-md text-muted-foreground hover:bg-muted transition-colors"
                    >
                        {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t border-border bg-card">
                    <div className="px-4 py-3 space-y-1">
                        <Link
                            to="/"
                            onClick={() => setMobileMenuOpen(false)}
                            className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-muted transition-colors"
                        >
                            Home
                        </Link>
                        <Link
                            to="/"
                            onClick={() => setMobileMenuOpen(false)}
                            className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-muted transition-colors"
                        >
                            About
                        </Link>
                        <Link
                            to="/"
                            onClick={() => setMobileMenuOpen(false)}
                            className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-muted transition-colors"
                        >
                            Contact
                        </Link>

                        <div className="my-2 border-t border-border"></div>

                        {user ? (
                            <>
                                <Link
                                    to="/dashboard"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-muted transition-colors"
                                >
                                    Dashboard
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-destructive hover:bg-destructive/10 transition-colors"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-muted transition-colors"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block px-3 py-2 mt-2 text-center rounded-md text-base font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
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