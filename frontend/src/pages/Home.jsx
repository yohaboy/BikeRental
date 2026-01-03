import React, { useState, useEffect } from 'react';
import { Search, Filter, Bike as BikeIcon } from 'lucide-react';
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
        <div className="min-h-screen bg-background">
            {/* Hero Section - Minimal, Text-Focused */}
            <section className="border-b-2 border-border">
                <div className="max-w-7xl mx-auto px-6 py-24">
                    <div className="max-w-3xl">
                        <h1 className="text-display mb-6">
                            BIKE RENTAL
                        </h1>
                        <p className="text-body text-muted-foreground mb-12 max-w-xl">
                            Simple, straightforward bike rental. Browse available bikes, select your dates, and ride.
                        </p>

                        {/* Search Bar - Minimal Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-px bg-border border-2 border-border">
                            <div className="bg-background p-4">
                                <label className="block text-xs font-bold mb-2 uppercase tracking-wider">Search</label>
                                <input
                                    type="text"
                                    placeholder="Brand or model"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-transparent border-none focus:outline-none text-sm"
                                />
                            </div>

                            <div className="bg-background p-4">
                                <label className="block text-xs font-bold mb-2 uppercase tracking-wider">Type</label>
                                <select
                                    value={selectedFilter.type}
                                    onChange={(e) => setSelectedFilter(prev => ({ ...prev, type: e.target.value }))}
                                    className="w-full bg-transparent border-none focus:outline-none text-sm appearance-none"
                                >
                                    <option value="">All</option>
                                    <option value="electric">Electric</option>
                                    <option value="mountain">Mountain</option>
                                    <option value="road">Road</option>
                                    <option value="city">City</option>
                                </select>
                            </div>

                            <div className="bg-background p-4">
                                <label className="block text-xs font-bold mb-2 uppercase tracking-wider">Price</label>
                                <select
                                    value={selectedFilter.price}
                                    onChange={(e) => setSelectedFilter(prev => ({ ...prev, price: e.target.value }))}
                                    className="w-full bg-transparent border-none focus:outline-none text-sm appearance-none"
                                >
                                    <option value="">All</option>
                                    <option value="25">Under $25/hr</option>
                                    <option value="50">Under $50/hr</option>
                                    <option value="100">Under $100/hr</option>
                                </select>
                            </div>

                            <button className="bg-primary text-primary-foreground p-4 font-bold text-sm uppercase tracking-wider hover:bg-transparent hover:text-primary transition-all border-2 border-transparent hover:border-primary">
                                Filter
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Bikes Grid - Minimal, Information-Dense */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex justify-between items-baseline mb-8 pb-4 border-b-2 border-border">
                        <h2 className="text-heading">Available Bikes</h2>
                        <p className="text-sm text-muted-foreground">{bikes.length} bikes</p>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="text-center">
                                <div className="inline-block h-8 w-8 border-2 border-foreground border-t-transparent animate-spin mb-4"></div>
                                <p className="text-sm text-muted-foreground">Loading...</p>
                            </div>
                        </div>
                    ) : bikes.length === 0 ? (
                        <div className="text-center py-20 border-2 border-border">
                            <BikeIcon size={48} className="mx-auto text-muted-foreground mb-4" strokeWidth={1.5} />
                            <p className="text-muted-foreground">No bikes found</p>
                        </div>
                    ) : (
                        <div className="grid-minimal">
                            {bikes.map((bike) => (
                                <div key={bike.id} className="p-6 hover:bg-muted transition-all group">
                                    {/* Bike Icon */}
                                    <div className="mb-6 flex items-center justify-center h-32 border-2 border-border group-hover:border-foreground transition-all">
                                        <BikeIcon size={64} strokeWidth={1} className="text-muted-foreground group-hover:text-foreground transition-all" />
                                    </div>

                                    {/* Bike Info - Structured Data */}
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Model</p>
                                            <h3 className="font-bold text-lg">{bike.brand} {bike.model}</h3>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Type</p>
                                                <p className="font-medium capitalize">{bike.type}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Rate</p>
                                                <p className="font-bold">${bike.price_per_hour}/hr</p>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => handleOrderClick(bike.id)}
                                            className="w-full mt-4 py-3 border-2 border-foreground font-bold text-sm uppercase tracking-wider hover:bg-foreground hover:text-background transition-all"
                                        >
                                            Reserve
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Order Modal - Minimal */}
            {showOrderForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-background/95">
                    <div className="w-full max-w-2xl border-2 border-foreground bg-background">
                        <div className="border-b-2 border-foreground p-6 flex justify-between items-center">
                            <h3 className="text-xl font-bold uppercase tracking-wider">Reserve Bike</h3>
                            <button
                                onClick={() => setShowOrderForm(false)}
                                className="text-2xl hover:text-muted-foreground transition-all"
                            >
                                ×
                            </button>
                        </div>
                        <div className="p-6">
                            <OrderForm bikeId={selectedBikeId} onSuccess={() => setShowOrderForm(false)} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default HomePage;
