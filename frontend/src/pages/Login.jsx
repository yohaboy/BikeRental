import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bike, ArrowRight } from 'lucide-react';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('http://127.0.0.1:8000/api/token/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                await login(data.access, data.refresh);
                navigate('/dashboard');
            } else {
                setError('Invalid credentials');
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Grid Effect */}
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none"
                style={{
                    backgroundImage: `linear-gradient(to right, var(--color-primary) 1px, transparent 1px), linear-gradient(to bottom, var(--color-primary) 1px, transparent 1px)`,
                    backgroundSize: '40px 40px'
                }}
            ></div>

            <div className="max-w-md w-full space-y-8 relative z-10">
                <div className="text-center">
                    <div className="mx-auto h-16 w-16 bg-primary flex items-center justify-center text-primary-foreground mb-6">
                        <Bike size={32} strokeWidth={2} />
                    </div>
                    <h2 className="text-heading">
                        Access Terminal
                    </h2>
                    <p className="mt-2 text-body uppercase tracking-wider">
                        Enter credentials to proceed
                    </p>
                </div>

                <div className="tech-card bg-card/80 backdrop-blur-sm shadow-2xl">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 text-xs font-bold uppercase tracking-wider">
                                {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label htmlFor="email-address" className="block text-xs font-bold text-foreground uppercase tracking-wider mb-1">
                                    Username
                                </label>
                                <input
                                    id="email-address"
                                    name="email"
                                    type="text"
                                    autoComplete="username"
                                    required
                                    className="input-shadow"
                                    placeholder="ENTER USERNAME"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-xs font-bold text-foreground uppercase tracking-wider mb-1">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="input-shadow"
                                    placeholder="ENTER PASSWORD"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="btn-primary w-full flex justify-between group"
                            >
                                Authenticate
                                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">
                            No access credentials?{' '}
                            <Link to="/register" className="font-bold text-primary hover:text-primary/80 transition-colors">
                                Initialize Registration
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
