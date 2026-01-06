import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AlertCircle, UserPlus, User, Bike } from 'lucide-react';

function Register() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        password2: '',
        role: 'renter',
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
                body: JSON.stringify({
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                    role: formData.role,
                }),
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
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">Create an account</h1>
                    <p className="text-muted-foreground mt-2">Join AddisBike to start your journey</p>
                </div>

                <div className="bg-card rounded-xl border border-border/50 shadow-sm p-8">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Role Selection */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-3">
                                I want to
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, role: 'renter' })}
                                    className={`p-4 rounded-xl border transition-all flex flex-col items-center gap-2 ${formData.role === 'renter'
                                        ? 'border-primary bg-primary/5 text-primary ring-1 ring-primary'
                                        : 'border-border hover:border-primary/50 text-muted-foreground hover:bg-muted/50'
                                        }`}
                                >
                                    <User size={24} />
                                    <span className="text-sm font-semibold">Rent Bikes</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, role: 'owner' })}
                                    className={`p-4 rounded-xl border transition-all flex flex-col items-center gap-2 ${formData.role === 'owner'
                                        ? 'border-primary bg-primary/5 text-primary ring-1 ring-primary'
                                        : 'border-border hover:border-primary/50 text-muted-foreground hover:bg-muted/50'
                                        }`}
                                >
                                    <Bike size={24} />
                                    <span className="text-sm font-semibold">List Bikes</span>
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1.5">
                                Username
                            </label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className="input-shadow"
                                placeholder="Choose a username"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1.5">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="input-shadow"
                                placeholder="your@email.com"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1.5">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="input-shadow"
                                    placeholder="Create password"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1.5">
                                    Confirm
                                </label>
                                <input
                                    type="password"
                                    name="password2"
                                    value={formData.password2}
                                    onChange={handleChange}
                                    className="input-shadow"
                                    placeholder="Confirm password"
                                    required
                                />
                            </div>
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
                                    Creating account...
                                </span>
                            ) : (
                                'Create Account'
                            )}
                        </button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-border/50 text-center">
                        <p className="text-sm text-muted-foreground">
                            Already have an account?{' '}
                            <Link to="/login" className="font-semibold text-primary hover:text-primary/80 transition-colors">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;
