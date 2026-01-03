import React, { useState, useEffect } from 'react';
import { Search, Filter, Bike as BikeIcon, ArrowRight, Star, Clock, MapPin } from 'lucide-react';
import OrderForm from '../components/OrderForm';

function HomePage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFilter, setSelectedFilter] = useState({
        type: "",
        price: "",
    });
    const [bikes, setBikes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBikeId, setSelectedBikeId] = useState(null);
    const [showOrderForm, setShowOrderForm] = useState(false);

    useEffect(() => {
        const fetchBikes = async () => {
            setLoading(true);
            const query = new URLSearchParams({
                type: selectedFilter.type,
                price: selectedFilter.price,
                search: searchTerm,
            }).toString();

            try {
                const response = await fetch(`http://127.0.0.1:8000/api/bikes/?${query}`);
                if (!response.ok) throw new Error('Failed to fetch bikes');
                const data = await response.json();
                setBikes(data);
            } catch (error) {
                console.error('Error fetching bikes:', error);
            } finally {
                setLoading(false);
            }
        };

        const timeoutId = setTimeout(fetchBikes, 300);
        return () => clearTimeout(timeoutId);
    }, [searchTerm, selectedFilter]);

    const handleOrderClick = (bikeId) => {
        setSelectedBikeId(bikeId);
        setShowOrderForm(true);
    };

    return (
        <div className="min-h-screen bg-gray-50/50">
            {/* Hero Section */}
            <div className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                    <h1 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tight mb-4">
                        Ride the <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">Future</span>
                    </h1>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                        Premium bike rentals for your next adventure. Explore the city with style and comfort.
                    </p>
                </div>
            </div>

            {/* Search & Filters */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
                <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-6 md:p-8">
                    <div className="flex flex-col lg:flex-row gap-6">
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search by brand or model..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all font-medium"
                            />
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="relative">
                                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <select
                                    value={selectedFilter.type}
                                    onChange={(e) => setSelectedFilter(prev => ({ ...prev, type: e.target.value }))}
                                    className="pl-12 pr-10 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all font-medium appearance-none min-w-[160px]"
                                >
                                    <option value="">All Types</option>
                                    <option value="electric">Electric</option>
                                    <option value="mountain">Mountain</option>
                                    <option value="road">Road</option>
                                    <option value="city">City</option>
                                </select>
                            </div>
                            <div className="relative">
                                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <select
                                    value={selectedFilter.price}
                                    onChange={(e) => setSelectedFilter(prev => ({ ...prev, price: e.target.value }))}
                                    className="pl-12 pr-10 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all font-medium appearance-none min-w-[160px]"
                                >
                                    <option value="">All Prices</option>
                                    <option value="25">Under $25/hr</option>
                                    <option value="50">Under $50/hr</option>
                                    <option value="100">Under $100/hr</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="h-12 w-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-gray-500 font-medium">Finding the best rides for you...</p>
                    </div>
                ) : bikes.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
                        <BikeIcon size={48} className="mx-auto text-gray-300 mb-4" />
                        <h3 className="text-xl font-bold text-gray-900">No bikes found</h3>
                        <p className="text-gray-500">Try adjusting your search or filters to find more options.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {bikes.map((bike) => (
                            <div key={bike.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                <div className="h-56 bg-gray-100 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <div className="absolute top-4 left-4">
                                        <span className="px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-wider text-cyan-600 shadow-sm">
                                            {bike.type}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-center h-full text-gray-300 group-hover:scale-110 transition-transform duration-700">
                                        <BikeIcon size={80} strokeWidth={1} />
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-cyan-600 transition-colors">
                                            {bike.brand} {bike.model}
                                        </h3>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                                        <div className="flex items-center gap-1">
                                            <Star size={14} className="text-yellow-400 fill-yellow-400" />
                                            <span className="font-bold text-gray-700">4.9</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <MapPin size={14} />
                                            <span>2.4 km</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                        <div>
                                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Price</p>
                                            <p className="text-2xl font-black text-gray-900">${bike.price_per_hour}<span className="text-sm font-normal text-gray-400">/hr</span></p>
                                        </div>
                                        <button
                                            onClick={() => handleOrderClick(bike.id)}
                                            className="bg-gray-900 hover:bg-cyan-600 text-white p-3 rounded-2xl shadow-lg transition-all transform active:scale-90"
                                        >
                                            <ArrowRight size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Order Modal */}
            {showOrderForm && (
                <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="px-10 py-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <div>
                                <h3 className="text-2xl font-black text-gray-900">Reserve Your Ride</h3>
                                <p className="text-sm text-gray-500">Quick and easy bike rental</p>
                            </div>
                            <button
                                onClick={() => setShowOrderForm(false)}
                                className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-100 text-gray-400 hover:text-red-500 hover:border-red-100 transition-all text-2xl"
                            >
                                &times;
                            </button>
                        </div>
                        <div className="p-10">
                            <OrderForm bikeId={selectedBikeId} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default HomePage;
