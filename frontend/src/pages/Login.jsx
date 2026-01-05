import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AlertCircle, LogIn, Bike } from 'lucide-react';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('http://127.0.0.1:8000/api/login/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                const data = await response.json();
                login(data.access, data.refresh);
                navigate('/');
            } else {
                const errorData = await response.json();
                setError(errorData.detail || 'Invalid credentials');
            }
        } catch (err) {
            setError('Connection error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary text-primary-foreground mb-4">
                        <Bike size={24} />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">Welcome back</h1>
                    <p className="text-muted-foreground mt-2">Enter your credentials to access your account</p>
                </div>

                <div className="bg-card rounded-xl border border-border/50 shadow-sm p-8">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1.5">
                                Username
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="input-shadow"
                                placeholder="Enter your username"
                                required
                            />
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="block text-sm font-medium text-foreground">
                                    Password
                                </label>
                                <a href="#" className="text-sm font-medium text-primary hover:text-primary/80">
                                    Forgot password?
                                </a>
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input-shadow"
                                placeholder="Enter your password"
                                required
                            />
                        </div>

                        {error && (
                            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 flex items-start gap-3">
                                <AlertCircle size={18} className="text-destructive flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-destructive font-medium">{error}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full py-2.5"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="h-4 w-4 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
                                    Logging in...
                                </span>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-border/50 text-center">
                        <p className="text-sm text-muted-foreground">
                            Don't have an account?{' '}
                            <Link to="/register" className="font-semibold text-primary hover:text-primary/80 transition-colors">
                                Create Account
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
