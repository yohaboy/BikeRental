import React, { useState, useEffect } from 'react';
import { Calendar, Clock, CreditCard, AlertCircle } from 'lucide-react';

function OrderForm({ bikeId, onSuccess }) {
    const [bike, setBike] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        start_time: '',
        end_time: '' // Optional
    });

    useEffect(() => {
        const fetchBikeDetails = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/api/bikes/${bikeId}/`);
                if (response.ok) {
                    const data = await response.json();
                    setBike(data);
                }
            } catch (err) {
                console.error('Error fetching bike details:', err);
            } finally {
                setLoading(false);
            }
        };

        if (bikeId) {
            fetchBikeDetails();
        }
    }, [bikeId]);

    const calculateEstimatedCost = () => {
        if (!bike || !formData.start_time || !formData.end_time) return null;

        const start = new Date(formData.start_time);
        const end = new Date(formData.end_time);

        if (end <= start) return null;

        const diffInHours = (end - start) / (1000 * 60 * 60);
        return (diffInHours * parseFloat(bike.price_per_hour)).toFixed(2);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        try {
            const token = localStorage.getItem('access_token');
            const response = await fetch('http://127.0.0.1:8000/api/rentals/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    bike: bikeId,
                    start_time: formData.start_time,
                    end_time: formData.end_time || null
                }),
            });

            if (response.ok) {
                onSuccess();
            } else {
                const data = await response.json();
                setError(JSON.stringify(data));
            }
        } catch (err) {
            setError('Failed to process booking. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center py-8">
                <div className="h-8 w-8 border-2 border-primary border-t-transparent animate-spin"></div>
            </div>
        );
    }

    const estimatedCost = calculateEstimatedCost();

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 text-xs font-bold uppercase tracking-wider flex items-start gap-2">
                    <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                    <span className="break-words">{error}</span>
                </div>
            )}

            <div className="bg-muted/50 p-4 border border-border">
                <div className="flex justify-between items-start">
                    <div>
                        <h4 className="font-bold text-sm uppercase tracking-wider">{bike?.brand} {bike?.model}</h4>
                        <p className="text-xs text-muted-foreground uppercase">{bike?.type}</p>
                    </div>
                    <div className="text-right">
                        <p className="font-bold text-primary">${bike?.price_per_hour}/hr</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-1">
                        Start Time
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Calendar size={16} className="text-muted-foreground" />
                        </div>
                        <input
                            type="datetime-local"
                            required
                            value={formData.start_time}
                            onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                            className="input-shadow pl-10"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-1">
                        End Time (Optional)
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Clock size={16} className="text-muted-foreground" />
                        </div>
                        <input
                            type="datetime-local"
                            value={formData.end_time}
                            onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                            className="input-shadow pl-10"
                        />
                    </div>
                </div>
            </div>

            {estimatedCost && (
                <div className="bg-primary/5 border border-primary/20 p-4 flex justify-between items-center">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Estimated Cost</span>
                    <span className="text-xl font-bold text-primary">${estimatedCost}</span>
                </div>
            )}

            <div className="pt-2">
                <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary w-full flex justify-between items-center"
                >
                    <span>{submitting ? 'PROCESSING...' : 'CONFIRM BOOKING'}</span>
                    <CreditCard size={18} />
                </button>
                <p className="text-[10px] text-muted-foreground text-center mt-3 uppercase tracking-wider">
                    Payment will be processed upon completion
                </p>
            </div>
        </form>
    );
}

export default OrderForm;
