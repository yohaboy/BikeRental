import React, { useState, useEffect } from 'react';
import { Search, Bike as BikeIcon, Clock, MapPin, Star, Filter } from 'lucide-react';
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
        <div className="min-h-screen pb-20">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-b from-primary/5 to-background pt-20 pb-32 overflow-hidden">
                <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[bottom_1px_center] [mask-image:linear-gradient(to_bottom,transparent,black)]"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center max-w-3xl mx-auto">
                        <h1 className="text-display mb-6">
                            Find Your Perfect Ride
                        </h1>
                        <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
                            Premium bikes for every journey. Whether you're commuting, exploring, or adventuring, we have the right bike for you.
                        </p>

                        {/* Search Bar */}
                        <div className="bg-card p-2 rounded-2xl shadow-lg border border-border/50 max-w-4xl mx-auto">
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
                                <div className="md:col-span-5 relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Search className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Search by brand or model..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="block w-full pl-10 pr-3 py-3 border-none rounded-xl bg-muted/50 focus:bg-background focus:ring-2 focus:ring-primary/20 transition-all text-sm font-medium"
                                    />
                                </div>

                                <div className="md:col-span-3 relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <BikeIcon className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                    <select
                                        value={selectedFilter.type}
                                        onChange={(e) => setSelectedFilter(prev => ({ ...prev, type: e.target.value }))}
                                        className="block w-full pl-10 pr-8 py-3 border-none rounded-xl bg-muted/50 focus:bg-background focus:ring-2 focus:ring-primary/20 transition-all text-sm font-medium appearance-none cursor-pointer"
                                    >
                                        <option value="">All Types</option>
                                        <option value="electric">Electric</option>
                                        <option value="mountain">Mountain</option>
                                        <option value="road">Road</option>
                                        <option value="city">City</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                        <Filter className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                </div>

                                <div className="md:col-span-3 relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <DollarSign className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                    <select
                                        value={selectedFilter.price}
                                        onChange={(e) => setSelectedFilter(prev => ({ ...prev, price: e.target.value }))}
                                        className="block w-full pl-10 pr-8 py-3 border-none rounded-xl bg-muted/50 focus:bg-background focus:ring-2 focus:ring-primary/20 transition-all text-sm font-medium appearance-none cursor-pointer"
                                    >
                                        <option value="">Any Price</option>
                                        <option value="25">Under $25/hr</option>
                                        <option value="50">Under $50/hr</option>
                                        <option value="100">Under $100/hr</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                        <Filter className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                </div>

                                <div className="md:col-span-1">
                                    <button className="w-full h-full bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center">
                                        <Search size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Bikes Grid */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20">
                <div className="flex justify-between items-baseline mb-6">
                    <h2 className="text-2xl font-bold text-foreground">Available Bikes</h2>
                    <span className="text-sm font-medium px-3 py-1 bg-primary/10 text-primary rounded-full">
                        {bikes.length} bikes found
                    </span>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-card rounded-2xl shadow-sm border border-border/50">
                        <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-muted-foreground font-medium">Loading available bikes...</p>
                    </div>
                ) : bikes.length === 0 ? (
                    <div className="text-center py-20 bg-card rounded-2xl shadow-sm border border-border/50">
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                            <BikeIcon size={32} className="text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-1">No bikes found</h3>
                        <p className="text-muted-foreground">Try adjusting your search filters</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {bikes.map((bike) => (
                            <div key={bike.id} className="group bg-card rounded-2xl border border-border/50 overflow-hidden hover:shadow-lg hover:border-primary/20 transition-all duration-300 flex flex-col">
                                {/* Bike Image Placeholder */}
                                <div className="aspect-[4/3] bg-muted relative flex items-center justify-center overflow-hidden group-hover:bg-muted/80 transition-colors">
                                    <BikeIcon size={64} strokeWidth={1} className="text-muted-foreground/50 group-hover:scale-110 transition-transform duration-500" />
                                    <div className="absolute top-4 right-4">
                                        <span className="bg-background/90 backdrop-blur-sm text-foreground text-xs font-bold px-3 py-1.5 rounded-full shadow-sm border border-border/50 capitalize">
                                            {bike.type}
                                        </span>
                                    </div>
                                </div>

                                {/* Bike Info */}
                                <div className="p-5 flex-1 flex flex-col">
                                    <div className="mb-4">
                                        <h3 className="font-bold text-lg text-foreground mb-1 group-hover:text-primary transition-colors">{bike.brand}</h3>
                                        <p className="text-muted-foreground text-sm">{bike.model}</p>
                                    </div>

                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                                            <Star size={16} className="text-yellow-400 fill-yellow-400" />
                                            <span>4.8</span>
                                        </div>
                                        <div className="w-1 h-1 rounded-full bg-border"></div>
                                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                            <Clock size={16} />
                                            <span>Min 1h</span>
                                        </div>
                                    </div>

                                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-border/50">
                                        <div>
                                            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-0.5">Price</p>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-xl font-bold text-primary">${bike.price_per_hour}</span>
                                                <span className="text-sm text-muted-foreground">/hr</span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleOrderClick(bike.id)}
                                            className="btn-primary px-5 py-2.5"
                                        >
                                            Book Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Order Modal */}
            {showOrderForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
                    <div className="w-full max-w-lg bg-card rounded-2xl shadow-2xl border border-border animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-border flex justify-between items-center">
                            <h3 className="text-xl font-bold text-foreground">Book Your Ride</h3>
                            <button
                                onClick={() => setShowOrderForm(false)}
                                className="text-muted-foreground hover:text-foreground transition-colors p-1 hover:bg-muted rounded-full"
                            >
                                <X size={20} />
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

// Helper component for dollar sign since it wasn't imported
function DollarSign({ className, size }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <line x1="12" x2="12" y1="2" y2="22" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
    );
}

// Helper for X icon
function X({ size, className }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M18 6 6 18" />
            <path d="m6 6 18 18" />
        </svg>
    );
}

export default HomePage;
