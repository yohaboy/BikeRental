import React, { useState, useEffect } from 'react';
import { Search, Bike as BikeIcon, Clock, MapPin, Star } from 'lucide-react';
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
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="border-b-2 border-border section-shadow">
                <div className="max-w-7xl mx-auto px-6 py-20">
                    <div className="max-w-3xl">
                        <h1 className="text-display mb-6 text-foreground">
                            Find Your Perfect Bike
                        </h1>
                        <p className="text-body text-muted-foreground mb-12 text-lg">
                            Explore our collection of quality bikes. Simple booking, great rides, memorable adventures.
                        </p>

                        {/* Search Bar */}
                        <div className="card-shadow bg-card p-6">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-xs font-bold mb-2 uppercase tracking-wider text-muted-foreground">
                                        <MapPin size={14} className="inline mr-1" />
                                        Search
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Brand or model"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full px-3 py-2 bg-muted border-2 border-border focus:outline-none focus:border-primary transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold mb-2 uppercase tracking-wider text-muted-foreground">
                                        <BikeIcon size={14} className="inline mr-1" />
                                        Type
                                    </label>
                                    <select
                                        value={selectedFilter.type}
                                        onChange={(e) => setSelectedFilter(prev => ({ ...prev, type: e.target.value }))}
                                        className="w-full px-3 py-2 bg-muted border-2 border-border focus:outline-none focus:border-primary transition-all appearance-none"
                                    >
                                        <option value="">All Types</option>
                                        <option value="electric">Electric</option>
                                        <option value="mountain">Mountain</option>
                                        <option value="road">Road</option>
                                        <option value="city">City</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold mb-2 uppercase tracking-wider text-muted-foreground">
                                        <Clock size={14} className="inline mr-1" />
                                        Price
                                    </label>
                                    <select
                                        value={selectedFilter.price}
                                        onChange={(e) => setSelectedFilter(prev => ({ ...prev, price: e.target.value }))}
                                        className="w-full px-3 py-2 bg-muted border-2 border-border focus:outline-none focus:border-primary transition-all appearance-none"
                                    >
                                        <option value="">All Prices</option>
                                        <option value="25">Under $25/hr</option>
                                        <option value="50">Under $50/hr</option>
                                        <option value="100">Under $100/hr</option>
                                    </select>
                                </div>

                                <div className="flex items-end">
                                    <button className="btn-primary w-full text-sm uppercase tracking-wider">
                                        <Search size={16} className="inline mr-2" />
                                        Search
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Bikes Grid */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex justify-between items-baseline mb-8">
                        <h2 className="text-heading">Available Bikes</h2>
                        <p className="text-sm font-bold text-primary">{bikes.length} bikes</p>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="text-center">
                                <div className="inline-block h-12 w-12 border-4 border-primary border-t-transparent animate-spin mb-4"></div>
                                <p className="text-sm text-muted-foreground font-medium">Loading bikes...</p>
                            </div>
                        </div>
                    ) : bikes.length === 0 ? (
                        <div className="text-center py-20 card-shadow">
                            <BikeIcon size={48} className="mx-auto text-muted-foreground mb-4" strokeWidth={1.5} />
                            <p className="text-muted-foreground">No bikes found</p>
                        </div>
                    ) : (
                        <div className="grid-clean">
                            {bikes.map((bike) => (
                                <div key={bike.id} className="card-shadow">
                                    {/* Bike Icon */}
                                    <div className="mb-6 flex items-center justify-center h-32 bg-muted border-2 border-border">
                                        <BikeIcon size={64} strokeWidth={1.5} className="text-primary" />
                                    </div>

                                    {/* Bike Info */}
                                    <div className="space-y-4">
                                        <div>
                                            <span className="badge mb-2 capitalize">{bike.type}</span>
                                            <h3 className="font-bold text-xl mt-2">{bike.brand}</h3>
                                            <p className="text-muted-foreground font-medium">{bike.model}</p>
                                        </div>

                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Star size={16} className="text-primary fill-primary" />
                                            <span className="font-medium">4.8 Rating</span>
                                        </div>

                                        <div className="flex justify-between items-center pt-4 border-t-2 border-border">
                                            <div>
                                                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Per Hour</p>
                                                <p className="font-bold text-2xl text-primary">${bike.price_per_hour}</p>
                                            </div>
                                            <button
                                                onClick={() => handleOrderClick(bike.id)}
                                                className="btn-primary px-5 py-2.5 text-sm"
                                            >
                                                Book Now
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Order Modal */}
            {showOrderForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-background/95">
                    <div className="w-full max-w-2xl border-4 border-primary bg-card shadow-warm-lg">
                        <div className="bg-primary p-6 flex justify-between items-center border-b-4 border-primary">
                            <h3 className="text-2xl font-bold uppercase tracking-wider text-white">Book Your Bike</h3>
                            <button
                                onClick={() => setShowOrderForm(false)}
                                className="text-3xl text-white hover:text-white/70 transition-all"
                            >
                                ×
                            </button>
                        </div>
                        <div className="p-8">
                            <OrderForm bikeId={selectedBikeId} onSuccess={() => setShowOrderForm(false)} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default HomePage;
