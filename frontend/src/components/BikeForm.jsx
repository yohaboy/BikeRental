import React, { useState } from 'react';
import { X, Upload, DollarSign, Tag, FileText, Type } from 'lucide-react';

function BikeForm({ onSuccess }) {
    const [formData, setFormData] = useState({
        brand: '',
        model: '',
        type: 'road',
        price_per_hour: '',
        condition: 'new',
        description: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('access_token');
            const response = await fetch('http://127.0.0.1:8000/api/bikes/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                onSuccess();
            } else {
                const data = await response.json();
                setError(JSON.stringify(data));
            }
        } catch (err) {
            setError('Failed to add bike. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 text-xs font-bold uppercase tracking-wider">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-1">
                        Brand
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Tag size={16} className="text-muted-foreground" />
                        </div>
                        <input
                            type="text"
                            name="brand"
                            required
                            value={formData.brand}
                            onChange={handleChange}
                            className="input-shadow pl-10"
                            placeholder="TREK"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-1">
                        Model
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Type size={16} className="text-muted-foreground" />
                        </div>
                        <input
                            type="text"
                            name="model"
                            required
                            value={formData.model}
                            onChange={handleChange}
                            className="input-shadow pl-10"
                            placeholder="MARLIN 5"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-1">
                        Type
                    </label>
                    <select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className="input-shadow appearance-none cursor-pointer"
                    >
                        <option value="road">ROAD</option>
                        <option value="mountain">MOUNTAIN</option>
                        <option value="hybrid">HYBRID</option>
                        <option value="electric">ELECTRIC</option>
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-1">
                        Price per Hour ($)
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <DollarSign size={16} className="text-muted-foreground" />
                        </div>
                        <input
                            type="number"
                            name="price_per_hour"
                            required
                            min="0"
                            step="0.01"
                            value={formData.price_per_hour}
                            onChange={handleChange}
                            className="input-shadow pl-10"
                            placeholder="0.00"
                        />
                    </div>
                </div>
            </div>

            <div>
                <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-1">
                    Description
                </label>
                <div className="relative">
                    <div className="absolute top-3 left-3 pointer-events-none">
                        <FileText size={16} className="text-muted-foreground" />
                    </div>
                    <textarea
                        name="description"
                        rows="3"
                        value={formData.description}
                        onChange={handleChange}
                        className="input-shadow pl-10 resize-none"
                        placeholder="ENTER UNIT DETAILS..."
                    ></textarea>
                </div>
            </div>

            <div className="pt-2">
                <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full"
                >
                    {loading ? 'PROCESSING...' : 'ADD UNIT TO FLEET'}
                </button>
            </div>
        </form>
    );
}

export default BikeForm;
