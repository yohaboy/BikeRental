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
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                        <Tag size={16} className="text-cyan-500" />
                        Brand
                    </label>
                    <input
                        type="text"
                        name="brand"
                        value={formData.brand}
                        onChange={handleChange}
                        placeholder="e.g. Trek, Giant"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                        <Info size={16} className="text-cyan-500" />
                        Model
                    </label>
                    <input
                        type="text"
                        name="model"
                        value={formData.model}
                        onChange={handleChange}
                        placeholder="e.g. Domane, Escape"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                        required
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                        <BikeIcon size={16} className="text-cyan-500" />
                        Type
                    </label>
                    <select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all appearance-none"
                        required
                    >
                        <option value="city">City</option>
                        <option value="mountain">Mountain</option>
                        <option value="road">Road</option>
                        <option value="electric">Electric</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                        <DollarSign size={16} className="text-cyan-500" />
                        Price per Hour
                    </label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                        <input
                            type="number"
                            step="0.01"
                            name="price_per_hour"
                            value={formData.price_per_hour}
                            onChange={handleChange}
                            placeholder="0.00"
                            className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                            required
                        />
                    </div>
                </div>
            </div>

            {success && (
                <div className="bg-green-50 border border-green-100 p-4 rounded-xl flex items-center gap-3 text-green-700 font-bold text-sm animate-in fade-in slide-in-from-top-2">
                    <CheckCircle size={20} />
                    Bike listed successfully!
                </div>
            )}

            <button
                type="submit"
                disabled={submitting || success}
                className={`w-full py-4 rounded-xl text-white font-black text-lg shadow-lg transition-all transform active:scale-[0.98] ${submitting || success
                        ? 'bg-gray-300 cursor-not-allowed shadow-none'
                        : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 hover:shadow-cyan-200'
                    }`}
            >
                {submitting ? 'Listing...' : success ? 'Done!' : 'List My Bike'}
            </button>
        </form>
    );
};

export default BikeForm;
