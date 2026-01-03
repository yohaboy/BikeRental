import React, { useState } from 'react';
import { Bike as BikeIcon, DollarSign, Tag, Info, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';

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
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                        Brand
                    </label>
                    <div className="relative">
                        <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            name="brand"
                            value={formData.brand}
                            onChange={handleChange}
                            placeholder="e.g. Trek, Giant"
                            className="w-full pl-12 pr-4 py-4 bg-gray-50/50 dark:bg-slate-800/50 border border-gray-200/50 dark:border-slate-700/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-bold text-gray-900 dark:text-white"
                            required
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                        Model
                    </label>
                    <div className="relative">
                        <Info className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            name="model"
                            value={formData.model}
                            onChange={handleChange}
                            placeholder="e.g. Domane, Escape"
                            className="w-full pl-12 pr-4 py-4 bg-gray-50/50 dark:bg-slate-800/50 border border-gray-200/50 dark:border-slate-700/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-bold text-gray-900 dark:text-white"
                            required
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                        Type
                    </label>
                    <div className="relative">
                        <BikeIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <select
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            className="w-full pl-12 pr-4 py-4 bg-gray-50/50 dark:bg-slate-800/50 border border-gray-200/50 dark:border-slate-700/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-bold text-gray-900 dark:text-white appearance-none"
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
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                        Price per Hour
                    </label>
                    <div className="relative">
                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="number"
                            step="0.01"
                            name="price_per_hour"
                            value={formData.price_per_hour}
                            onChange={handleChange}
                            placeholder="0.00"
                            className="w-full pl-12 pr-4 py-4 bg-gray-50/50 dark:bg-slate-800/50 border border-gray-200/50 dark:border-slate-700/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-bold text-gray-900 dark:text-white"
                            required
                        />
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {success && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="bg-green-500/10 border border-green-500/20 p-4 rounded-2xl flex items-center gap-3 text-green-600 font-bold text-sm"
                    >
                        <CheckCircle size={20} />
                        Bike listed successfully!
                    </motion.div>
                )}
            </AnimatePresence>

            <button
                type="submit"
                disabled={submitting || success}
                className={cn(
                    "w-full py-4 rounded-2xl text-white font-black text-lg shadow-lg transition-all transform active:scale-[0.98] flex items-center justify-center gap-3",
                    submitting || success
                        ? "bg-gray-300 dark:bg-slate-700 cursor-not-allowed shadow-none text-gray-500 dark:text-gray-500"
                        : "btn-primary"
                )}
            >
                {submitting ? (
                    <>
                        <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Listing...
                    </>
                ) : success ? (
                    <>
                        <CheckCircle size={20} />
                        Done!
                    </>
                ) : (
                    'List My Bike'
                )}
            </button>
        </form>
    );
};

export default BikeForm;

