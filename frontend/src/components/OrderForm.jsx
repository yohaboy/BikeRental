import React, { useState, useEffect } from 'react';
import { Calendar, Clock, DollarSign, CheckCircle, AlertCircle } from 'lucide-react';

const OrderForm = ({ bikeId }) => {
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
                    window.location.href = '/dashboard';
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
                <div className="h-10 w-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-cyan-600 font-medium">Fetching bike details...</p>
            </div>
        );
    }

    const duration = calculateDuration();
    const price = calculatePrice();

    return (
        <div className="w-full">
            <div className="bg-cyan-50 border border-cyan-100 p-4 rounded-xl mb-6 flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-bold text-cyan-900">{bike?.brand} {bike?.model}</h3>
                    <p className="text-sm text-cyan-600 capitalize">{bike?.type} Bike</p>
                </div>
                <div className="text-right">
                    <p className="text-xs text-cyan-500 uppercase font-bold tracking-wider">Rate</p>
                    <p className="text-xl font-black text-cyan-700">${bike?.price_per_hour}<span className="text-xs font-normal">/hr</span></p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2">
                            <Calendar size={16} className="text-cyan-500" />
                            Pickup Time
                        </label>
                        <input
                            type="datetime-local"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            required
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2">
                            <Clock size={16} className="text-cyan-500" />
                            Return Time
                        </label>
                        <input
                            type="datetime-local"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            required
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                        />
                    </div>
                </div>

                {duration && price !== null && (
                    <div className="bg-gray-50 border border-gray-100 p-4 rounded-xl space-y-2">
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>Duration</span>
                            <span className="font-medium text-gray-900">{duration.hours}h {duration.minutes}m</span>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                            <span className="text-base font-bold text-gray-900">Total Price</span>
                            <span className="text-2xl font-black text-cyan-600">${price.toFixed(2)}</span>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 border border-red-100 p-3 rounded-xl flex items-center gap-3 text-red-700 text-sm">
                        <AlertCircle size={18} />
                        {error}
                    </div>
                )}

                {success && (
                    <div className="bg-green-50 border border-green-100 p-3 rounded-xl flex items-center gap-3 text-green-700 text-sm">
                        <CheckCircle size={18} />
                        Rental confirmed! Redirecting...
                    </div>
                )}

                <button
                    type="submit"
                    disabled={submitting || !startTime || !endTime}
                    className={`w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg transition-all transform active:scale-[0.98] ${submitting || !startTime || !endTime
                            ? 'bg-gray-300 cursor-not-allowed shadow-none'
                            : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 hover:shadow-cyan-200'
                        }`}
                >
                    {submitting ? (
                        <div className="flex items-center justify-center gap-2">
                            <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Processing...
                        </div>
                    ) : (
                        'Confirm Reservation'
                    )}
                </button>
            </form>
        </div>
    );
};

export default OrderForm;
