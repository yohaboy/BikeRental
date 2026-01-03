import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AlertCircle, LogIn } from 'lucide-react';

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
        <div className="min-h-screen flex items-center justify-center p-6">
            <div className="w-full max-w-md">
                <div className="card-shadow border-4 border-primary">
                    {/* Header */}
                    <div className="bg-primary p-8 border-b-4 border-primary">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 bg-white/20 flex items-center justify-center">
                                <LogIn className="text-white" size={24} />
                            </div>
                            <h1 className="text-3xl font-bold uppercase tracking-wider text-white">Login</h1>
                        </div>
                        <p className="text-sm text-white/90 font-medium">Welcome back to BikeHub</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-6 bg-card">
                        <div>
                            <label className="block text-xs font-bold mb-2 uppercase tracking-wider text-muted-foreground">
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
                            <label className="block text-xs font-bold mb-2 uppercase tracking-wider text-muted-foreground">
                                Password
                            </label>
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
                            <div className="border-2 border-destructive bg-destructive/10 p-4 flex items-start gap-3 shadow-warm">
                                <AlertCircle size={20} className="text-destructive flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-destructive font-medium">{error}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full py-4 text-base disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="h-5 w-5 border-2 border-white border-t-transparent animate-spin"></div>
                                    Logging in...
                                </span>
                            ) : (
                                'Login'
                            )}
                        </button>
                    </form>

                    <div className="border-t-2 border-border p-8 text-center bg-muted/30">
                        <p className="text-sm text-muted-foreground">
                            Don't have an account?{' '}
                            <Link to="/register" className="font-bold text-primary hover:text-primary/80 transition-all">
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
