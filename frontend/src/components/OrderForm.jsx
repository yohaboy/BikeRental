import React, { useState, useEffect } from 'react';
import { Calendar, Clock, DollarSign, CheckCircle, AlertCircle, Bike } from 'lucide-react';

const OrderForm = ({ bikeId, onSuccess }) => {
    const [bike, setBike] = useState(null);
    const [startDate, setStartDate] = useState('');
    const [startTime, setStartTime] = useState('09:00');
    const [endDate, setEndDate] = useState('');
    const [endTime, setEndTime] = useState('17:00');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    // Array of available bike images
    const bikeImages = [
        '/assets/bike1.jpg',
        '/assets/bike2.jpg',
        '/assets/bike3.jpg',
        '/assets/bike4.jpg'
    ];

    // Helper to get a deterministic image based on ID
    const getBikeImage = (id) => {
        if (!id) return bikeImages[0];
        const index = id % bikeImages.length;
        return bikeImages[index];
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

                    // Set default dates
                    const today = new Date();
                    const tomorrow = new Date(today);
                    tomorrow.setDate(tomorrow.getDate() + 1);

                    setStartDate(today.toISOString().split('T')[0]);
                    setEndDate(tomorrow.toISOString().split('T')[0]);
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
        if (!startDate || !startTime || !endDate || !endTime) return null;

        const start = new Date(`${startDate}T${startTime}`);
        const end = new Date(`${endDate}T${endTime}`);
        const diffMs = end - start;

        if (diffMs < 0) return null;

        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        return { hours, minutes, totalHours: hours + (minutes > 0 ? 1 : 0) };
    };

    const calculatePrice = () => {
        if (!bike) return null;
        const duration = calculateDuration();
        if (!duration) return null;
        return duration.totalHours * parseFloat(bike.price_per_hour);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        const startDateTime = `${startDate}T${startTime}:00`;
        const endDateTime = `${endDate}T${endTime}:00`;

        if (new Date(startDateTime) >= new Date(endDateTime)) {
            setError('End time must be after start time');
            setSubmitting(false);
            return;
        }

        const totalPrice = calculatePrice();
        const rentalData = {
            start_time: startDateTime,
            end_time: endDateTime,
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
                setTimeout(() => {
                    setSuccess(false);
                    if (onSuccess) onSuccess();
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
                <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-muted-foreground font-medium">Loading bike details...</p>
            </div>
        );
    }

    const duration = calculateDuration();
    const price = calculatePrice();

    return (
        <div className="w-full">
            {/* Bike Info */}
            <div className="bg-muted/50 rounded-xl border border-border/50 p-4 mb-6">
                <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-card rounded-lg border border-border/50 overflow-hidden flex-shrink-0">
                        <img
                            src={getBikeImage(bike?.id)}
                            alt={bike?.brand}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div>
                        <h3 className="font-bold text-foreground text-lg">{bike?.brand} {bike?.model}</h3>
                        <p className="text-sm text-muted-foreground capitalize">{bike?.type} Bike</p>
                    </div>
                    <div className="ml-auto text-right">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Rate</p>
                        <p className="text-xl font-bold text-primary">${bike?.price_per_hour}<span className="text-sm font-normal text-muted-foreground">/hr</span></p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Date and Time Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Start Date & Time */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1.5">
                                Pickup Date
                            </label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    min={new Date().toISOString().split('T')[0]}
                                    required
                                    className="input-shadow pl-10"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1.5">
                                Pickup Time
                            </label>
                            <div className="relative">
                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                                <input
                                    type="time"
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                    required
                                    className="input-shadow pl-10"
                                />
                            </div>
                        </div>
                    </div>

                    {/* End Date & Time */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1.5">
                                Return Date
                            </label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    min={startDate || new Date().toISOString().split('T')[0]}
                                    required
                                    className="input-shadow pl-10"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1.5">
                                Return Time
                            </label>
                            <div className="relative">
                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                                <input
                                    type="time"
                                    value={endTime}
                                    onChange={(e) => setEndTime(e.target.value)}
                                    required
                                    className="input-shadow pl-10"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Duration and Price Summary */}
                {duration && price !== null && (
                    <div className="bg-muted/30 rounded-xl border border-border/50 p-4 space-y-4">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Duration</span>
                            <span className="font-medium text-foreground">{duration.hours}h {duration.minutes}m</span>
                        </div>
                        <div className="flex justify-between items-center pt-4 border-t border-border/50">
                            <span className="text-base font-bold text-foreground">Total Price</span>
                            <span className="text-2xl font-bold text-primary">${price.toFixed(2)}</span>
                        </div>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 flex items-center gap-3">
                        <AlertCircle size={18} className="text-destructive" />
                        <p className="text-sm text-destructive font-medium">{error}</p>
                    </div>
                )}

                {/* Success Message */}
                {success && (
                    <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center gap-3">
                        <CheckCircle size={18} className="text-emerald-600" />
                        <p className="text-sm text-emerald-600 font-medium">Booking confirmed! Redirecting...</p>
                    </div>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={submitting || !startDate || !endDate}
                    className="btn-primary w-full py-3 text-base"
                >
                    {submitting ? (
                        <span className="flex items-center justify-center gap-2">
                            <div className="h-4 w-4 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
                            Processing...
                        </span>
                    ) : (
                        'Confirm Booking'
                    )}
                </button>
            </form>
        </div>
    );
};

export default OrderForm;
