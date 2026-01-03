import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AlertCircle } from 'lucide-react';

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
        <div className="min-h-screen bg-background flex items-center justify-center p-6">
            <div className="w-full max-w-md">
                <div className="border-2 border-foreground bg-background">
                    <div className="border-b-2 border-foreground p-8">
                        <h1 className="text-2xl font-bold uppercase tracking-wider mb-2">Login</h1>
                        <p className="text-sm text-muted-foreground">Access your account</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-6">
                        <div>
                            <label className="block text-xs font-bold mb-2 uppercase tracking-wider">
                                Username
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-4 py-3 bg-background border-2 border-border focus:outline-none focus:border-foreground transition-all"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold mb-2 uppercase tracking-wider">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-background border-2 border-border focus:outline-none focus:border-foreground transition-all"
                                required
                            />
                        </div>

                        {error && (
                            <div className="border-2 border-destructive bg-destructive/10 p-4 flex items-start gap-3">
                                <AlertCircle size={20} className="text-destructive flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-destructive">{error}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-primary text-primary-foreground font-bold text-sm uppercase tracking-wider hover:bg-transparent hover:text-primary border-2 border-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>

                    <div className="border-t-2 border-border p-8 text-center">
                        <p className="text-sm text-muted-foreground">
                            Don't have an account?{' '}
                            <Link to="/register" className="font-bold text-foreground hover:text-primary transition-all">
                                Register
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
