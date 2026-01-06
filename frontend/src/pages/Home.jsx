import React, { useState, useEffect } from 'react';
import { Search, Bike as BikeIcon, Clock, MapPin, Star, Filter, ArrowRight, X } from 'lucide-react';
import OrderForm from '../components/OrderForm';
import { useAuth } from '../context/AuthContext';

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
    const { user } = useAuth();

    const bikeImages = [
        '/assets/bike1.jpg',
        '/assets/bike2.jpg',
        '/assets/bike3.jpg',
        '/assets/bike4.jpg'
    ];

    const getBikeImage = (id) => {
        const index = id % bikeImages.length;
        return bikeImages[index];
    };

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
        if (user && user.role === 'owner') {
            alert("Bike owners cannot rent bikes. Please log in as a renter.");
            return;
        }
        setSelectedBikeId(bikeId);
        setShowOrderForm(true);
    };

    return (
        <div className="min-h-screen pb-20 bg-background">
            {/*Hero Section */}
            <section className="relative overflow-hidden pt-10 lg:pt-20 pb-20 lg:pb-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
                        <div className="text-center lg:text-left space-y-8">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-bold text-sm">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                                </span>
                                #1 Bike Rental Service
                            </div>

                            <h1 className="text-display leading-tight">
                                Explore the City on <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-500">Two Wheels</span>
                            </h1>

                            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto lg:mx-0">
                                Experience the freedom of the open road with our premium fleet. From city cruisers to mountain beasts, we have the perfect ride for your next adventure.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                                <button onClick={() => document.getElementById('browse-bikes').scrollIntoView({ behavior: 'smooth' })} className="btn-primary w-full sm:w-auto h-14 px-8 text-lg">
                                    Start Riding
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </button>
                                <button className="btn-outline w-full sm:w-auto h-14 px-8 text-lg">
                                    View Map
                                </button>
                            </div>

                            <div className="pt-8 flex items-center justify-center lg:justify-start gap-8 text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <CheckCircle size={20} className="text-primary" />
                                    <span className="font-medium">Instant Booking</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle size={20} className="text-primary" />
                                    <span className="font-medium">Insured Rides</span>
                                </div>
                            </div>
                        </div>

                        <div className="relative lg:h-[600px] w-full flex items-center justify-center">
                            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-emerald-500/20 rounded-[3rem] rotate-6 blur-3xl opacity-50"></div>
                            <img
                                src="/assets/bike2.jpg"
                                alt="Hero Bike"
                                className="relative z-10 w-full h-auto max-h-[500px] object-cover rounded-[2.5rem] shadow-2xl shadow-primary/20 transform hover:scale-[1.02] transition-transform duration-500"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Search & Filter Section */}
            <div id="browse-bikes" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20 mb-12">
                <div className="bg-card p-4 rounded-3xl shadow-xl shadow-primary/5 border border-border/50">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                        <div className="md:col-span-5 relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search by brand or model..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="block w-full pl-11 pr-4 py-4 border-none rounded-2xl bg-muted/50 focus:bg-background focus:ring-2 focus:ring-primary/20 transition-all text-base font-medium"
                            />
                        </div>

                        <div className="md:col-span-3 relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <BikeIcon className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <select
                                value={selectedFilter.type}
                                onChange={(e) => setSelectedFilter(prev => ({ ...prev, type: e.target.value }))}
                                className="block w-full pl-11 pr-10 py-4 border-none rounded-2xl bg-muted/50 focus:bg-background focus:ring-2 focus:ring-primary/20 transition-all text-base font-medium appearance-none cursor-pointer"
                            >
                                <option value="">All Types</option>
                                <option value="electric">Electric</option>
                                <option value="mountain">Mountain</option>
                                <option value="road">Road</option>
                                <option value="city">City</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                                <Filter className="h-4 w-4 text-muted-foreground" />
                            </div>
                        </div>

                        <div className="md:col-span-3 relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <DollarSign className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <select
                                value={selectedFilter.price}
                                onChange={(e) => setSelectedFilter(prev => ({ ...prev, price: e.target.value }))}
                                className="block w-full pl-11 pr-10 py-4 border-none rounded-2xl bg-muted/50 focus:bg-background focus:ring-2 focus:ring-primary/20 transition-all text-base font-medium appearance-none cursor-pointer"
                            >
                                <option value="">Any Price</option>
                                <option value="25">Under $25/hr</option>
                                <option value="50">Under $50/hr</option>
                                <option value="100">Under $100/hr</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                                <Filter className="h-4 w-4 text-muted-foreground" />
                            </div>
                        </div>

                        <div className="md:col-span-1">
                            <button className="w-full h-full bg-primary text-primary-foreground rounded-2xl hover:bg-primary/90 transition-colors flex items-center justify-center shadow-lg shadow-primary/25">
                                <Search size={24} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bikes Grid */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-baseline mb-8">
                    <h2 className="text-3xl font-bold text-foreground">Available Bikes</h2>
                    <span className="text-sm font-bold px-4 py-1.5 bg-primary/10 text-primary rounded-full">
                        {bikes.length} bikes found
                    </span>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 bg-card rounded-3xl shadow-sm border border-border/50">
                        <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-6"></div>
                        <p className="text-muted-foreground font-medium text-lg">Finding the best rides for you...</p>
                    </div>
                ) : bikes.length === 0 ? (
                    <div className="text-center py-32 bg-card rounded-3xl shadow-sm border border-border/50">
                        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                            <BikeIcon size={40} className="text-muted-foreground" />
                        </div>
                        <h3 className="text-xl font-bold text-foreground mb-2">No bikes found</h3>
                        <p className="text-muted-foreground">Try adjusting your search filters</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {bikes.map((bike) => (
                            <div key={bike.id} className="group bg-card rounded-[2rem] border border-border/50 overflow-hidden hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300 flex flex-col">
                                {/* Bike Image */}
                                <div className="aspect-[4/3] bg-muted relative overflow-hidden">
                                    <img
                                        src={getBikeImage(bike.id)}
                                        alt={`${bike.brand} ${bike.model}`}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>

                                    <div className="absolute top-4 right-4">
                                        <span className="bg-white/90 backdrop-blur-md text-foreground text-xs font-bold px-3 py-1.5 rounded-full shadow-lg capitalize">
                                            {bike.type}
                                        </span>
                                    </div>

                                    <div className="absolute bottom-4 left-4 text-white">
                                        <p className="font-bold text-lg drop-shadow-md">{bike.brand}</p>
                                        <p className="text-white/90 text-sm drop-shadow-md">{bike.model}</p>
                                    </div>
                                </div>

                                {/* Bike Info */}
                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="flex items-center gap-1.5 text-sm font-bold text-foreground bg-yellow-400/10 px-2 py-1 rounded-lg text-yellow-600">
                                            <Star size={16} className="fill-yellow-500 text-yellow-500" />
                                            <span>4.8</span>
                                        </div>
                                        <div className="w-1 h-1 rounded-full bg-border"></div>
                                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground font-medium">
                                            <Clock size={16} />
                                            <span>Min 1h</span>
                                        </div>
                                    </div>

                                    <div className="mt-auto flex items-center justify-between pt-6 border-t border-border/50">
                                        <div>
                                            <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-0.5">Price</p>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-2xl font-black text-primary">${bike.price_per_hour}</span>
                                                <span className="text-sm font-medium text-muted-foreground">/hr</span>
                                            </div>
                                        </div>
                                        {(!user || user.role === 'renter') ? (
                                            <button
                                                onClick={() => handleOrderClick(bike.id)}
                                                className="btn-primary px-6 py-3 rounded-2xl"
                                            >
                                                Book Now
                                            </button>
                                        ) : (
                                            <button
                                                disabled
                                                className="btn-secondary px-6 py-3 rounded-2xl opacity-50 cursor-not-allowed"
                                            >
                                                Owner View
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Order Modal */}
            {showOrderForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
                    <div className="w-full max-w-lg bg-card rounded-3xl shadow-2xl border border-border animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-border flex justify-between items-center">
                            <h3 className="text-xl font-bold text-foreground">Book Your Ride</h3>
                            <button
                                onClick={() => setShowOrderForm(false)}
                                className="text-muted-foreground hover:text-foreground transition-colors p-2 hover:bg-muted rounded-full"
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

// Helper Components
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

function CheckCircle({ size, className }) {
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
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
    );
}

export default HomePage;
