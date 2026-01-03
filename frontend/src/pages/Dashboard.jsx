import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Plus, CheckCircle, Bike as BikeIcon, ArrowRight, Trash2 } from 'lucide-react';
import BikeForm from '../components/BikeForm';

function BikeRentalsDashboard() {
    const [activeTab, setActiveTab] = useState('rentals');
    const [rentals, setRentals] = useState([]);
    const [bikes, setBikes] = useState([]);
    const [showBikeForm, setShowBikeForm] = useState(false);
    const [loading, setLoading] = useState(true);

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

    const fetchRentals = async () => {
        setLoading(true);
        try {
            const response = await apiCall('http://127.0.0.1:8000/api/rentals/');
            if (response && response.ok) {
                const data = await response.json();

                const formattedRentals = await Promise.all(
                    data.map(async (rental) => {
                        const bikeResponse = await apiCall(`http://127.0.0.1:8000/api/bikes/${rental.bike}/`);
                        const bikeDetails = bikeResponse && bikeResponse.ok ? await bikeResponse.json() : null;

                        return {
                            id: rental.id,
                            bikeName: bikeDetails ? `${bikeDetails.brand} ${bikeDetails.model}` : `Bike ${rental.bike}`,
                            bikeType: bikeDetails ? bikeDetails.type : 'unknown',
                            startTime: new Date(rental.start_time).toLocaleString(),
                            endTime: rental.end_time ? new Date(rental.end_time).toLocaleString() : 'N/A',
                            total: rental.total_cost,
                            status: rental.status ? 'active' : 'completed',
                        };
                    })
                );
                setRentals(formattedRentals);
            }
        } catch (error) {
            console.error('Error fetching rentals:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchBikes = async () => {
        setLoading(true);
        try {
            const response = await apiCall('http://127.0.0.1:8000/api/my_bikes/');
            if (response && response.ok) {
                const data = await response.json();
                setBikes(data);
            }
        } catch (error) {
            console.error('Error fetching bikes:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'rentals') fetchRentals();
        else fetchBikes();
    }, [activeTab]);

    const handleReturnBike = async (rentalId) => {
        const now = new Date().toISOString();
        try {
            const response = await apiCall(`http://127.0.0.1:8000/api/rentals/${rentalId}/`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    end_time: now,
                    status: false
                }),
            });
            if (response && response.ok) {
                fetchRentals();
            }
        } catch (error) {
            console.error('Error returning bike:', error);
        }
    };

    const handleDeleteBike = async (bikeId) => {
        if (!window.confirm('Are you sure you want to delete this bike?')) return;
        try {
            const response = await apiCall(`http://127.0.0.1:8000/api/bikes/${bikeId}/`, {
                method: 'DELETE',
            });
            if (response && response.ok) {
                fetchBikes();
            }
        } catch (error) {
            console.error('Error deleting bike:', error);
        }
    };

    const getStatusStyle = (status) => {
        if (status === 'active' || status === true) return 'bg-blue-100 text-blue-700 border-blue-200';
        if (status === 'completed' || status === false) return 'bg-green-100 text-green-700 border-green-200';
        return 'bg-gray-100 text-gray-700 border-gray-200';
    };

    return (
        <div className="min-h-screen bg-gray-50/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Dashboard</h1>
                        <p className="text-gray-500 mt-1">Manage your rentals and bikes in one place.</p>
                    </div>
                    <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-200 w-fit">
                        <button
                            onClick={() => setActiveTab('rentals')}
                            className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'rentals' ? 'bg-cyan-500 text-white shadow-md' : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            My Rentals
                        </button>
                        <button
                            onClick={() => setActiveTab('bikes')}
                            className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'bikes' ? 'bg-cyan-500 text-white shadow-md' : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            My Bikes
                        </button>
                    </div>
                </div>

                {activeTab === 'rentals' ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50/50 border-b border-gray-100">
                                        <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-wider">Bike</th>
                                        <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-wider">Period</th>
                                        <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-wider">Cost</th>
                                        <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-wider text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {loading ? (
                                        <tr><td colSpan="5" className="px-6 py-10 text-center text-gray-400">Loading...</td></tr>
                                    ) : rentals.length > 0 ? (
                                        rentals.map((rental) => (
                                            <tr key={rental.id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center text-cyan-600">
                                                            <BikeIcon size={20} />
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-gray-900">{rental.bikeName}</p>
                                                            <p className="text-xs text-gray-500 capitalize">{rental.bikeType}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col gap-1">
                                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                                            <Calendar size={14} className="text-gray-400" />
                                                            {rental.startTime}
                                                        </div>
                                                        <div className="flex items-center gap-2 text-sm text-gray-400">
                                                            <ArrowRight size={14} />
                                                            {rental.endTime}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p className="font-black text-gray-900">${rental.total}</p>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyle(rental.status)}`}>
                                                        {rental.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    {rental.status === 'active' && (
                                                        <button
                                                            onClick={() => handleReturnBike(rental.id)}
                                                            className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-sm transition-all"
                                                        >
                                                            Return Bike
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr><td colSpan="5" className="px-6 py-10 text-center text-gray-400">No rentals found.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-900">My Listed Bikes</h2>
                            <button
                                onClick={() => setShowBikeForm(true)}
                                className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg transition-all"
                            >
                                <Plus size={18} />
                                Add New Bike
                            </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {loading ? (
                                <div className="col-span-full text-center py-10 text-gray-400">Loading...</div>
                            ) : bikes.length > 0 ? (
                                bikes.map((bike) => (
                                    <div key={bike.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden group hover:shadow-md transition-all">
                                        <div className="h-40 bg-gray-100 relative overflow-hidden">
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                                            <div className="absolute top-3 right-3">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border bg-white ${bike.is_available ? 'text-green-600 border-green-100' : 'text-blue-600 border-blue-100'}`}>
                                                    {bike.is_available ? 'Available' : 'Rented'}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-center h-full text-gray-300 group-hover:scale-110 transition-transform duration-500">
                                                <BikeIcon size={64} strokeWidth={1} />
                                            </div>
                                        </div>
                                        <div className="p-5">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h4 className="font-bold text-gray-900 text-lg">{bike.brand}</h4>
                                                    <p className="text-sm text-gray-500">{bike.model}</p>
                                                </div>
                                                <p className="text-xl font-black text-cyan-600">${bike.price_per_hour}<span className="text-xs font-normal text-gray-400">/hr</span></p>
                                            </div>
                                            <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{bike.type}</span>
                                                <button
                                                    onClick={() => handleDeleteBike(bike.id)}
                                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full bg-white rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center">
                                    <p className="text-gray-400 font-medium">You haven't listed any bikes yet.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Bike Form Modal */}
            {showBikeForm && (
                <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <h3 className="text-xl font-black text-gray-900">List a New Bike</h3>
                            <button onClick={() => setShowBikeForm(false)} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
                        </div>
                        <div className="p-8">
                            <BikeForm onSuccess={() => { setShowBikeForm(false); fetchBikes(); }} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default BikeRentalsDashboard;
