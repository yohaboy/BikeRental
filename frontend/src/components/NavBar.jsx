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
        <nav className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="w-8 h-8 bg-primary flex items-center justify-center text-primary-foreground transition-transform group-hover:scale-105">
                            <Bike size={18} strokeWidth={2.5} />
                        </div>
                        <span className="font-bold text-lg tracking-widest text-foreground uppercase">
                            AddisBike
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link
                            to="/"
                            className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
                        >
                            Home
                        </Link>
                        <Link
                            to="/about"
                            className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
                        >
                            About
                        </Link>
                        <Link
                            to="/contact"
                            className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
                        >
                            Contact
                        </Link>

                        <div className="h-4 w-px bg-border"></div>

                        {user ? (
                            <>
                                <Link
                                    to="/dashboard"
                                    className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
                                >
                                    Dashboard
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-destructive transition-colors"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="btn-primary px-4 py-2 text-xs"
                                >
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 text-muted-foreground hover:bg-muted transition-colors border border-transparent hover:border-border"
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div className="md:hidden absolute top-16 left-0 right-0 bg-background border-b border-border shadow-xl animate-in slide-in-from-top-2 duration-200">
                    <div className="p-4 space-y-2">
                        <Link
                            to="/"
                            onClick={() => setMobileMenuOpen(false)}
                            className="block px-4 py-3 border border-transparent hover:border-border hover:bg-muted/50 text-sm font-bold uppercase tracking-wider text-foreground transition-colors"
                        >
                            Home
                        </Link>
                        <Link
                            to="/about"
                            onClick={() => setMobileMenuOpen(false)}
                            className="block px-4 py-3 border border-transparent hover:border-border hover:bg-muted/50 text-sm font-bold uppercase tracking-wider text-foreground transition-colors"
                        >
                            About
                        </Link>
                        <Link
                            to="/contact"
                            onClick={() => setMobileMenuOpen(false)}
                            className="block px-4 py-3 border border-transparent hover:border-border hover:bg-muted/50 text-sm font-bold uppercase tracking-wider text-foreground transition-colors"
                        >
                            Contact
                        </Link>

                        <div className="my-2 border-t border-border"></div>

                        {user ? (
                            <>
                                <Link
                                    to="/dashboard"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block px-4 py-3 border border-transparent hover:border-border hover:bg-muted/50 text-sm font-bold uppercase tracking-wider text-foreground transition-colors"
                                >
                                    Dashboard
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="block w-full text-left px-4 py-3 border border-transparent hover:border-destructive/20 hover:bg-destructive/5 text-sm font-bold uppercase tracking-wider text-destructive transition-colors"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block px-4 py-3 border border-transparent hover:border-border hover:bg-muted/50 text-sm font-bold uppercase tracking-wider text-foreground transition-colors"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block px-4 py-3 mt-2 text-center text-sm font-bold uppercase tracking-wider bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
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