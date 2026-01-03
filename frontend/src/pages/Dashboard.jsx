import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Plus, CheckCircle, Bike as BikeIcon, ArrowRight, Trash2, LayoutDashboard, List } from 'lucide-react';
import BikeForm from '../components/BikeForm';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';

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
        if (status === 'active' || status === true) return 'bg-primary/10 text-primary border-primary/20 dark:bg-primary/20 dark:text-white dark:border-primary/30';
        if (status === 'completed' || status === false) return 'bg-secondary text-secondary-foreground border-secondary/50 dark:bg-secondary/30 dark:text-gray-300 dark:border-secondary/50';
        return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700';
    };

    return (
        <div className="min-h-screen mesh-gradient pt-24 pb-12 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter">DASHBOARD</h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1 font-medium">Manage your rentals and fleet</p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex bg-white dark:bg-slate-800 p-1.5 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 w-fit"
                    >
                        <button
                            onClick={() => setActiveTab('rentals')}
                            className={cn(
                                "px-6 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2",
                                activeTab === 'rentals'
                                    ? "bg-primary text-white shadow-lg shadow-primary/30"
                                    : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                            )}
                        >
                            <LayoutDashboard size={18} />
                            My Rentals
                        </button>
                        <button
                            onClick={() => setActiveTab('bikes')}
                            className={cn(
                                "px-6 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2",
                                activeTab === 'bikes'
                                    ? "bg-primary text-white shadow-lg shadow-primary/30"
                                    : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                            )}
                        >
                            <List size={18} />
                            My Bikes
                        </button>
                    </motion.div>
                </div>

                <AnimatePresence mode="wait">
                    {activeTab === 'rentals' ? (
                        <motion.div
                            key="rentals"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="glass-card overflow-hidden"
                        >
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50/50 dark:bg-slate-800/50 border-b border-gray-100 dark:border-slate-700">
                                            <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Bike</th>
                                            <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Period</th>
                                            <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Cost</th>
                                            <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Status</th>
                                            <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50 dark:divide-slate-800">
                                        {loading ? (
                                            <tr><td colSpan="5" className="px-8 py-12 text-center text-gray-400 font-medium animate-pulse">Loading rentals...</td></tr>
                                        ) : rentals.length > 0 ? (
                                            rentals.map((rental) => (
                                                <tr key={rental.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/50 transition-colors group">
                                                    <td className="px-8 py-6">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                                                <BikeIcon size={24} />
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-gray-900 dark:text-white text-lg">{rental.bikeName}</p>
                                                                <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">{rental.bikeType}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <div className="flex flex-col gap-2">
                                                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 font-medium">
                                                                <Calendar size={14} className="text-gray-400" />
                                                                {rental.startTime}
                                                            </div>
                                                            <div className="flex items-center gap-2 text-sm text-gray-400 font-medium pl-6 relative">
                                                                <div className="absolute left-[5px] top-[-10px] bottom-[10px] w-px bg-gray-200 dark:bg-slate-700"></div>
                                                                {rental.endTime}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <p className="font-black text-gray-900 dark:text-white text-xl">${rental.total}</p>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border ${getStatusStyle(rental.status)}`}>
                                                            {rental.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-8 py-6 text-right">
                                                        {rental.status === 'active' && (
                                                            <button
                                                                onClick={() => handleReturnBike(rental.id)}
                                                                className="btn-primary py-2 px-4 text-xs uppercase tracking-widest shadow-none hover:shadow-lg"
                                                            >
                                                                Return Bike
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr><td colSpan="5" className="px-8 py-12 text-center text-gray-400 font-medium">No rentals found.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="bikes"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">My Fleet</h2>
                                <button
                                    onClick={() => setShowBikeForm(true)}
                                    className="btn-primary flex items-center gap-2 py-3 px-6"
                                >
                                    <Plus size={20} />
                                    Add New Bike
                                </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                {loading ? (
                                    <div className="col-span-full text-center py-20 text-gray-400 font-medium animate-pulse">Loading fleet...</div>
                                ) : bikes.length > 0 ? (
                                    bikes.map((bike) => (
                                        <div key={bike.id} className="glass-card group overflow-hidden">
                                            <div className="h-48 bg-gray-100 dark:bg-slate-800 relative overflow-hidden">
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                                <div className="absolute top-4 right-4">
                                                    <span className={cn(
                                                        "px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border bg-white/90 backdrop-blur-md shadow-sm",
                                                        bike.is_available
                                                            ? "text-green-600 border-green-200"
                                                            : "text-blue-600 border-blue-200"
                                                    )}>
                                                        {bike.is_available ? 'Available' : 'Rented'}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-center h-full text-gray-300 dark:text-gray-700 group-hover:scale-110 transition-transform duration-700">
                                                    <BikeIcon size={80} strokeWidth={0.5} className="group-hover:text-primary/40 transition-colors" />
                                                </div>
                                            </div>
                                            <div className="p-6">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <h4 className="font-black text-gray-900 dark:text-white text-lg leading-tight">{bike.brand}</h4>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{bike.model}</p>
                                                    </div>
                                                    <p className="text-xl font-black text-primary">${bike.price_per_hour}<span className="text-xs font-medium text-gray-400">/hr</span></p>
                                                </div>
                                                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-slate-700">
                                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{bike.type}</span>
                                                    <button
                                                        onClick={() => handleDeleteBike(bike.id)}
                                                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
                                                        title="Delete Bike"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-full glass-card border-dashed p-12 text-center">
                                        <BikeIcon size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                                        <p className="text-gray-500 dark:text-gray-400 font-medium">You haven't listed any bikes yet.</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Bike Form Modal */}
            <AnimatePresence>
                {showBikeForm && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowBikeForm(false)}
                            className="absolute inset-0 bg-gray-900/80 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden relative z-10 border border-white/20"
                        >
                            <div className="px-8 py-6 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center bg-gray-50/50 dark:bg-slate-800/50">
                                <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">ADD NEW BIKE</h3>
                                <button
                                    onClick={() => setShowBikeForm(false)}
                                    className="w-10 h-10 flex items-center justify-center rounded-2xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-400 hover:text-red-500 hover:border-red-100 transition-all text-2xl"
                                >
                                    &times;
                                </button>
                            </div>
                            <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                                <BikeForm onSuccess={() => { setShowBikeForm(false); fetchBikes(); }} />
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default BikeRentalsDashboard;
