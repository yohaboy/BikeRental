import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AlertCircle, CheckCircle } from 'lucide-react';

function Register() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        password2: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.password2) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('http://127.0.0.1:8000/api/register/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                navigate('/login');
            } else {
                const errorData = await response.json();
                setError(errorData.error || 'Registration failed');
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
                        <h1 className="text-2xl font-bold uppercase tracking-wider mb-2">Register</h1>
                        <p className="text-sm text-muted-foreground">Create a new account</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-6">
                        <div>
                            <label className="block text-xs font-bold mb-2 uppercase tracking-wider">
                                Username
                            </label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-background border-2 border-border focus:outline-none focus:border-foreground transition-all"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold mb-2 uppercase tracking-wider">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
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
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-background border-2 border-border focus:outline-none focus:border-foreground transition-all"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold mb-2 uppercase tracking-wider">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                name="password2"
                                value={formData.password2}
                                onChange={handleChange}
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
                            {loading ? 'Creating account...' : 'Register'}
                        </button>
                    </form>

                    <div className="border-t-2 border-border p-8 text-center">
                        <p className="text-sm text-muted-foreground">
                            Already have an account?{' '}
                            <Link to="/login" className="font-bold text-foreground hover:text-primary transition-all">
                                Login
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;
