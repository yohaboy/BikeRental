import React, { useState, useEffect } from 'react';
import { Calendar, Clock, DollarSign, CheckCircle, AlertCircle, Bike } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';

const OrderForm = ({ bikeId, onSuccess }) => {
    const [bike, setBike] = useState(null);
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

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
                    console.error('Token refresh failed:', error);
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

    useEffect(() => {
        const fetchBike = async () => {
            try {
                const response = await apiCall(`http://127.0.0.1:8000/api/bikes/${bikeId}/`);
                if (response.ok) {
                    const data = await response.json();
                    setBike(data);
                } else {
                    setError('Failed to load bike information');
                }
            } catch (error) {
                setError('Error loading bike details');
            } finally {
                setLoading(false);
            }
        };

        if (bikeId) fetchBike();
    }, [bikeId]);

    const calculateDuration = () => {
        if (!startTime || !endTime) return null;
        const start = new Date(startTime);
        const end = new Date(endTime);
        const diffMs = end - start;
        if (diffMs < 0) return null;
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        return { hours, minutes };
    };

    const calculatePrice = () => {
        if (!bike || !startTime || !endTime) return null;
        const duration = calculateDuration();
        if (!duration) return null;
        const effectiveHours = Math.max(1, duration.hours + (duration.minutes > 0 ? 1 : 0));
        return effectiveHours * parseFloat(bike.price_per_hour);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        if (new Date(startTime) >= new Date(endTime)) {
            setError('End time must be after start time');
            setSubmitting(false);
            return;
        }

        const totalPrice = calculatePrice();
        const rentalData = {
            start_time: startTime,
            end_time: endTime,
            bike: bikeId,
            total_cost: totalPrice,
        };

        try {
            const response = await apiCall('http://127.0.0.1:8000/api/rentals/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(rentalData),
            });

            if (response.ok) {
                setSuccess(true);
                setStartTime('');
                setEndTime('');
                setTimeout(() => {
                    setSuccess(false);
                    if (onSuccess) onSuccess();
                    else window.location.href = '/dashboard';
                }, 2000);
            } else {
                const errorData = await response.json();
                setError(errorData.error || 'Failed to create rental');
            }
        } catch (error) {
            setError('Network error. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-8">
                <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-primary font-bold animate-pulse">Fetching bike details...</p>
            </div>
        );
    }

    const duration = calculateDuration();
    const price = calculatePrice();

    return (
        <div className="w-full">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-primary/5 border border-primary/10 p-6 rounded-2xl mb-8 flex items-center justify-between"
            >
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                        <Bike className="text-primary" size={24} />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-gray-900 dark:text-white">{bike?.brand} {bike?.model}</h3>
                        <p className="text-sm text-primary font-bold uppercase tracking-wider">{bike?.type} Bike</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Rate</p>
                    <p className="text-2xl font-black text-gray-900 dark:text-white">${bike?.price_per_hour}<span className="text-sm font-medium text-gray-400">/hr</span></p>
                </div>
            </motion.div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                            Pickup Time
                        </label>
                        <div className="relative">
                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="datetime-local"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                required
                                className="w-full pl-12 pr-4 py-4 bg-gray-50/50 dark:bg-slate-800/50 border border-gray-200/50 dark:border-slate-700/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-bold text-gray-900 dark:text-white"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                            Return Time
                        </label>
                        <div className="relative">
                            <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="datetime-local"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                required
                                className="w-full pl-12 pr-4 py-4 bg-gray-50/50 dark:bg-slate-800/50 border border-gray-200/50 dark:border-slate-700/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-bold text-gray-900 dark:text-white"
                            />
                        </div>
                    </div>
                </div>

                <AnimatePresence>
                    {duration && price !== null && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-gray-50/50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700 p-6 rounded-2xl space-y-4"
                        >
                            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 font-medium">
                                <span>Duration</span>
                                <span className="font-bold text-gray-900 dark:text-white">{duration.hours}h {duration.minutes}m</span>
                            </div>
                            <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-slate-700">
                                <span className="text-lg font-black text-gray-900 dark:text-white">Total Price</span>
                                <span className="text-3xl font-black text-primary">${price.toFixed(2)}</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-center gap-3 text-red-500 text-sm font-bold"
                        >
                            <AlertCircle size={20} />
                            {error}
                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {success && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-green-500/10 border border-green-500/20 p-4 rounded-2xl flex items-center gap-3 text-green-600 text-sm font-bold"
                        >
                            <CheckCircle size={20} />
                            Rental confirmed! Redirecting...
                        </motion.div>
                    )}
                </AnimatePresence>

                <button
                    type="submit"
                    disabled={submitting || !startTime || !endTime}
                    className={cn(
                        "w-full py-4 rounded-2xl text-white font-black text-lg shadow-lg transition-all transform active:scale-[0.98] flex items-center justify-center gap-3",
                        submitting || !startTime || !endTime
                            ? "bg-gray-300 dark:bg-slate-700 cursor-not-allowed shadow-none text-gray-500 dark:text-gray-500"
                            : "btn-primary"
                    )}
                >
                    {submitting ? (
                        <>
                            <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Processing...
                        </>
                    ) : (
                        'Confirm Reservation'
                    )}
                </button>
            </form>
        </div>
    );
};

export default OrderForm;

