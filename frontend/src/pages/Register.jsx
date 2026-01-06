import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bike, ArrowRight, User, Key } from 'lucide-react';

function Register() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'renter' // Default role
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('http://127.0.0.1:8000/api/register/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                navigate('/login');
            } else {
                const data = await response.json();
                setError(JSON.stringify(data));
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
                        New User Registration
                    </h2>
                    <p className="mt-2 text-body uppercase tracking-wider">
                        Join AddisBike Network
                    </p>
                </div>

                <div className="tech-card bg-card/80 backdrop-blur-sm shadow-2xl">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 text-xs font-bold uppercase tracking-wider break-words">
                                {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label htmlFor="username" className="block text-xs font-bold text-foreground uppercase tracking-wider mb-1">
                                    Username
                                </label>
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    required
                                    className="input-shadow"
                                    placeholder="CHOOSE USERNAME"
                                    value={formData.username}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-xs font-bold text-foreground uppercase tracking-wider mb-1">
                                    Email Address
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    className="input-shadow"
                                    placeholder="ENTER EMAIL"
                                    value={formData.email}
                                    onChange={handleChange}
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
                                    required
                                    className="input-shadow"
                                    placeholder="CREATE PASSWORD"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-2">
                                    Account Type
                                </label>
                                <div className="grid grid-cols-2 gap-4">
                                    <label className={`cursor-pointer border p-4 flex flex-col items-center justify-center transition-all ${formData.role === 'renter'
                                            ? 'border-primary bg-primary/5 text-primary'
                                            : 'border-border hover:border-primary/50 text-muted-foreground'
                                        }`}>
                                        <input
                                            type="radio"
                                            name="role"
                                            value="renter"
                                            checked={formData.role === 'renter'}
                                            onChange={handleChange}
                                            className="sr-only"
                                        />
                                        <User size={24} className="mb-2" />
                                        <span className="text-xs font-bold uppercase tracking-wider">Renter</span>
                                    </label>

                                    <label className={`cursor-pointer border p-4 flex flex-col items-center justify-center transition-all ${formData.role === 'owner'
                                            ? 'border-primary bg-primary/5 text-primary'
                                            : 'border-border hover:border-primary/50 text-muted-foreground'
                                        }`}>
                                        <input
                                            type="radio"
                                            name="role"
                                            value="owner"
                                            checked={formData.role === 'owner'}
                                            onChange={handleChange}
                                            className="sr-only"
                                        />
                                        <Key size={24} className="mb-2" />
                                        <span className="text-xs font-bold uppercase tracking-wider">Owner</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="btn-primary w-full flex justify-between group"
                            >
                                Create Account
                                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">
                            Already registered?{' '}
                            <Link to="/login" className="font-bold text-primary hover:text-primary/80 transition-colors">
                                Access Terminal
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;
