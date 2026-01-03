import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';

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
                setError(errorData.detail || 'Invalid username or password');
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                    <div className="p-10">
                        <div className="text-center mb-10">
                            <div className="w-16 h-16 bg-cyan-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <LogIn className="text-cyan-600" size={32} />
                            </div>
                            <h1 className="text-3xl font-black text-gray-900">Welcome Back</h1>
                            <p className="text-gray-500 mt-2">Log in to manage your rides</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                    <Mail size={16} className="text-cyan-500" />
                                    Username
                                </label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all font-medium"
                                    placeholder="Enter your username"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                    <Lock size={16} className="text-cyan-500" />
                                    Password
                                </label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all font-medium"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>

                            {error && (
                                <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-3 text-red-700 text-sm font-medium animate-in fade-in slide-in-from-top-2">
                                    <AlertCircle size={20} />
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gray-900 hover:bg-cyan-600 text-white py-4 rounded-2xl font-black text-lg shadow-lg transition-all flex items-center justify-center gap-2 group transform active:scale-[0.98]"
                            >
                                {loading ? (
                                    <div className="h-6 w-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        Log In
                                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    <div className="px-10 py-6 bg-gray-50 border-t border-gray-100 text-center">
                        <p className="text-gray-500 font-medium">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-cyan-600 font-bold hover:underline">
                                Sign Up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
