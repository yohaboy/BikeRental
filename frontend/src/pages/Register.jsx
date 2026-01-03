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
        <div className="min-h-screen flex items-center justify-center p-6">
            <div className="w-full max-w-md">
                <div className="card-shadow border-4 border-secondary">
                    {/* Header */}
                    <div className="bg-secondary p-8 border-b-4 border-secondary">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 bg-white/20 flex items-center justify-center">
                                <UserPlus className="text-white" size={24} />
                            </div>
                            <h1 className="text-3xl font-bold uppercase tracking-wider text-white">Register</h1>
                        </div>
                        <p className="text-sm text-white/90 font-medium">Join BikeHub today</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-6 bg-card">
                        {/* Role Selection */}
                        <div>
                            <label className="block text-xs font-bold mb-3 uppercase tracking-wider text-muted-foreground">
                                I want to
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, role: 'renter' })}
                                    className={`p-4 border-2 transition-all ${formData.role === 'renter'
                                            ? 'border-primary bg-primary/10'
                                            : 'border-border hover:border-primary/50'
                                        }`}
                                >
                                    <User className={`mx-auto mb-2 ${formData.role === 'renter' ? 'text-primary' : 'text-muted-foreground'}`} size={24} />
                                    <p className={`text-sm font-bold ${formData.role === 'renter' ? 'text-primary' : 'text-foreground'}`}>
                                        Rent Bikes
                                    </p>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, role: 'owner' })}
                                    className={`p-4 border-2 transition-all ${formData.role === 'owner'
                                            ? 'border-primary bg-primary/10'
                                            : 'border-border hover:border-primary/50'
                                        }`}
                                >
                                    <Bike className={`mx-auto mb-2 ${formData.role === 'owner' ? 'text-primary' : 'text-muted-foreground'}`} size={24} />
                                    <p className={`text-sm font-bold ${formData.role === 'owner' ? 'text-primary' : 'text-foreground'}`}>
                                        List Bikes
                                    </p>
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold mb-2 uppercase tracking-wider text-muted-foreground">
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
                            <label className="block text-xs font-bold mb-2 uppercase tracking-wider text-muted-foreground">
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

                        <div>
                            <label className="block text-xs font-bold mb-2 uppercase tracking-wider text-muted-foreground">
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="input-shadow"
                                placeholder="Create a strong password"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold mb-2 uppercase tracking-wider text-muted-foreground">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                name="password2"
                                value={formData.password2}
                                onChange={handleChange}
                                className="input-shadow"
                                placeholder="Confirm your password"
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
                            className="btn-secondary w-full py-4 text-base disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="h-5 w-5 border-2 border-white border-t-transparent animate-spin"></div>
                                    Creating account...
                                </span>
                            ) : (
                                'Create Account'
                            )}
                        </button>
                    </form>

                    <div className="border-t-2 border-border p-8 text-center bg-muted/30">
                        <p className="text-sm text-muted-foreground">
                            Already have an account?{' '}
                            <Link to="/login" className="font-bold text-secondary hover:text-secondary/80 transition-all">
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
