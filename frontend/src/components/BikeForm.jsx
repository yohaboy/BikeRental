import React, { useState } from 'react';

const BikeForm = () => {
    const [formData, setFormData] = useState({
        brand: '',
        model: '',
        type: '',
        price_per_hour: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
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
                        headers: {
                            'Content-Type': 'application/json',
                        },
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await apiCall('http://127.0.0.1:8000/api/my_bikes/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response && response.ok) {
                const data = await response.json();
                console.log('Bike added successfully:', data);
                setFormData({
                    brand: '',
                    model: '',
                    type: '',
                    price_per_hour: '',
                });
            } else {
                console.error('Error adding bike:', response.statusText);
            }
        } catch (error) {
            console.error('Error adding bike:', error);
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Add Rental Bike</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-1">
                        Brand
                    </label>
                    <input
                        type="text"
                        id="brand"
                        name="brand"
                        value={formData.brand}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-1">
                        Model
                    </label>
                    <input
                        type="text"
                        id="model"
                        name="model"
                        value={formData.model}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                        Type
                    </label>
                    <input
                        type="text"
                        id="type"
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="price_per_hour" className="block text-sm font-medium text-gray-700 mb-1">
                        Price per Hour ($)
                    </label>
                    <input
                        type="number"
                        step="0.01"
                        id="price_per_hour"
                        name="price_per_hour"
                        value={formData.price_per_hour}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    Add Bike
                </button>
            </form>
        </div>
    );
};

export default BikeForm;