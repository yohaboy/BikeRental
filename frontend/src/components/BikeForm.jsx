import React, { useState } from 'react';
import { Bike as BikeIcon, DollarSign, Tag, Info, CheckCircle } from 'lucide-react';

const BikeForm = ({ onSuccess }) => {
    const [formData, setFormData] = useState({
        brand: '',
        model: '',
        type: 'city',
        price_per_hour: '',
    });
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const apiCall = async (url, options = {}) => {
        const makeRequest = async (token) => {
            const response = await fetch(url, {
                ...options,
                headers: {
                    ...options.headers,
                    Authorization: `Bearer ${token}`,
                },
            });
            return response;
        };

        let accessToken = localStorage.getItem('access_token');
        let response = await makeRequest(accessToken);

        if (response.status === 401) {
            const refreshToken = localStorage.getItem('refresh_token');
            if (refreshToken) {
                try {
                    const refreshResponse = await fetch('http://127.0.0.1:8000/api/token/refresh/', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ refresh: refreshToken }),
                    });

                    if (refreshResponse.ok) {
                        const data = await refreshResponse.json();
                        localStorage.setItem('access_token', data.access);
                        response = await makeRequest(data.access);
                    } else {
                        localStorage.removeItem('access_token');
                        localStorage.removeItem('refresh_token');
                        window.location.href = '/login';
                        return null;
                    }
                } catch (error) {
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                    window.location.href = '/login';
                    return null;
                }
            } else {
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                window.location.href = '/login';
                return null;
            }
        }
        return response;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const response = await apiCall('http://127.0.0.1:8000/api/my_bikes/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response && response.ok) {
                setSuccess(true);
                setTimeout(() => {
                    setSuccess(false);
                    if (onSuccess) onSuccess();
                }, 1500);
            }
        } catch (error) {
            console.error('Error adding bike:', error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                        Brand
                    </label>
                    <div className="relative">
                        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                        <input
                            type="text"
                            name="brand"
                            value={formData.brand}
                            onChange={handleChange}
                            placeholder="e.g. Trek"
                            className="input-shadow pl-10"
                            required
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                        Model
                    </label>
                    <div className="relative">
                        <Info className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                        <input
                            type="text"
                            name="model"
                            value={formData.model}
                            onChange={handleChange}
                            placeholder="e.g. Domane"
                            className="input-shadow pl-10"
                            required
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                        Type
                    </label>
                    <div className="relative">
                        <BikeIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                        <select
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            className="input-shadow pl-10 appearance-none"
                            required
                        >
                            <option value="city">City</option>
                            <option value="mountain">Mountain</option>
                            <option value="road">Road</option>
                            <option value="electric">Electric</option>
                        </select>
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                        Price per Hour
                    </label>
                    <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                        <input
                            type="number"
                            step="0.01"
                            name="price_per_hour"
                            value={formData.price_per_hour}
                            onChange={handleChange}
                            placeholder="0.00"
                            className="input-shadow pl-10"
                            required
                        />
                    </div>
                </div>
            </div>

            {success && (
                <div className="bg-emerald-50 text-emerald-600 border border-emerald-200 p-4 rounded-lg flex items-center gap-3 font-medium text-sm">
                    <CheckCircle size={20} />
                    Bike listed successfully!
                </div>
            )}

            <button
                type="submit"
                disabled={submitting || success}
                className="btn-primary w-full py-2.5"
            >
                {submitting ? (
                    <span className="flex items-center justify-center gap-2">
                        <div className="h-4 w-4 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
                        Listing...
                    </span>
                ) : success ? (
                    <span className="flex items-center justify-center gap-2">
                        <CheckCircle size={18} />
                        Done
                    </span>
                ) : (
                    'List Bike'
                )}
            </button>
        </form>
    );
};

export default BikeForm;
