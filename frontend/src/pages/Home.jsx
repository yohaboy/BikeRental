import React, { useState, useEffect } from 'react';
import { Search, Bike as BikeIcon, Clock, MapPin, Star, Filter, ArrowRight, X, ChevronRight } from 'lucide-react';
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
            <section className="relative pt-10 lg:pt-20 pb-20 lg:pb-32 border-b border-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
                        <div className="text-center lg:text-left space-y-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1 border border-primary/30 bg-primary/5 text-primary font-bold text-xs uppercase tracking-widest">
                                <span className="w-2 h-2 bg-primary"></span>
                                System Online
                            </div>

                            <h1 className="text-display leading-none">
                                Rent <span className="text-primary">Your Ride</span><br />
                                And Go
                            </h1>


                            <p className="text-body max-w-xl mx-auto lg:mx-0">
                                Access our premium fleet of urban transport units. Optimized for city navigation and rapid transit. Secure your vehicle today.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                                <button onClick={() => document.getElementById('browse-bikes').scrollIntoView({ behavior: 'smooth' })} className="btn-primary w-full sm:w-auto">
                                    Explore Bikes
                                    <ChevronRight className="ml-2 h-4 w-4" />
                                </button>
                                <a href="/login" className="btn-outline w-full sm:w-auto">
                                    Get Started
                                </a>
                            </div>

                            <div className="pt-8 flex items-center justify-center lg:justify-start gap-8 text-muted-foreground text-xs uppercase tracking-wider font-bold">
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-primary"></div>
                                    <span>Instant Access</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-primary"></div>
                                    <span>Verified Units</span>
                                </div>
                            </div>
                        </div>

                        <div className="relative lg:h-[500px] w-full flex items-center justify-center p-4">
                            <div className="tech-border-full p-2 w-full h-full flex items-center justify-center bg-card/50 backdrop-blur-sm">
                                <img
                                    src="/assets/bike2.jpg"
                                    alt="Hero Bike"
                                    className="w-full h-full object-cover hover:grayscale-0 transition-all duration-500"
                                />
                                <div className="absolute bottom-6 right-6 bg-background/90 border border-primary p-4 max-w-xs hidden md:block">
                                    <div className="text-xs text-primary uppercase tracking-widest mb-1">Featured Unit</div>
                                    <div className="font-bold text-lg">Cyber Cruiser X1</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Search & Filter Section */}
            <div id="browse-bikes" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20 mb-16">
                <div className="bg-card border border-border p-6 shadow-none">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                        <div className="md:col-span-5 relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Search className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <input
                                type="text"
                                placeholder="SEARCH UNITS..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="block w-full pl-10 pr-4 py-3 border border-border bg-background focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm font-medium uppercase placeholder:text-muted-foreground/50"
                            />
                        </div>

                        <div className="md:col-span-3 relative">
                            <select
                                value={selectedFilter.type}
                                onChange={(e) => setSelectedFilter(prev => ({ ...prev, type: e.target.value }))}
                                className="block w-full pl-4 pr-10 py-3 border border-border bg-background focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm font-medium uppercase appearance-none cursor-pointer"
                            >
                                <option value="">All Types</option>
                                <option value="electric">Electric</option>
                                <option value="mountain">Mountain</option>
                                <option value="road">Road</option>
                                <option value="city">City</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                                <Filter className="h-3 w-3 text-muted-foreground" />
                            </div>
                        </div>

                        <div className="md:col-span-3 relative">
                            <select
                                value={selectedFilter.price}
                                onChange={(e) => setSelectedFilter(prev => ({ ...prev, price: e.target.value }))}
                                className="block w-full pl-4 pr-10 py-3 border border-border bg-background focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm font-medium uppercase appearance-none cursor-pointer"
                            >
                                <option value="">Any Price</option>
                                <option value="25">Under $25/hr</option>
                                <option value="50">Under $50/hr</option>
                                <option value="100">Under $100/hr</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                                <Filter className="h-3 w-3 text-muted-foreground" />
                            </div>
                        </div>

                        <div className="md:col-span-1">
                            <button className="w-full h-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center justify-center">
                                <Search size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bikes Grid */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-end mb-8 border-b border-border pb-4">
                    <h2 className="text-heading">Available Units</h2>
                    <span className="text-xs font-bold px-3 py-1 bg-primary/10 text-primary border border-primary/20 uppercase tracking-wider">
                        {bikes.length} Units Detected
                    </span>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 border border-border border-dashed bg-card/50">
                        <div className="h-8 w-8 border-2 border-primary border-t-transparent animate-spin mb-4"></div>
                        <p className="text-muted-foreground font-bold text-sm uppercase tracking-widest">Scanning Database...</p>
                    </div>
                ) : bikes.length === 0 ? (
                    <div className="text-center py-32 border border-border border-dashed bg-card/50">
                        <div className="w-16 h-16 bg-muted flex items-center justify-center mx-auto mb-4">
                            <BikeIcon size={32} className="text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-bold text-foreground mb-1 uppercase">No Units Found</h3>
                        <p className="text-sm text-muted-foreground">Adjust filter parameters</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {bikes.map((bike) => (
                            <div key={bike.id} className="group tech-card hover:border-primary/50 transition-all duration-300 flex flex-col">
                                {/* Bike Image */}
                                <div className="aspect-[4/3] bg-muted relative overflow-hidden mb-4 border border-border">
                                    <img
                                        src={getBikeImage(bike.id)}
                                        alt={`${bike.brand} ${bike.model}`}
                                        className="w-full h-full object-cover group-hover:grayscale-0 transition-all duration-500"
                                    />

                                    <div className="absolute top-2 right-2">
                                        <span className="bg-background/90 text-foreground text-[10px] font-bold px-2 py-1 border border-border uppercase tracking-wider">
                                            {bike.type}
                                        </span>
                                    </div>
                                </div>

                                {/* Bike Info */}
                                <div className="flex-1 flex flex-col">
                                    <div className="mb-4">
                                        <h3 className="font-bold text-lg uppercase tracking-tight">{bike.brand}</h3>
                                        <p className="text-sm text-muted-foreground uppercase">{bike.model}</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 mb-6 text-xs text-muted-foreground">
                                        <div className="flex items-center gap-1.5 border border-border p-1.5">
                                            <Star size={12} className="text-primary" />
                                            <span>RATING: 4.8</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 border border-border p-1.5">
                                            <Clock size={12} />
                                            <span>MIN: 1H</span>
                                        </div>
                                    </div>

                                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-border border-dashed">
                                        <div>
                                            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-0.5">Rate / Hour</p>
                                            <div className="flex items-baseline gap-0.5">
                                                <span className="text-lg font-bold text-primary">${bike.price_per_hour}</span>
                                            </div>
                                        </div>
                                        {(!user || user.role === 'renter') ? (
                                            <button
                                                onClick={() => handleOrderClick(bike.id)}
                                                className="btn-primary px-4 py-2 text-xs"
                                            >
                                                Book Unit
                                            </button>
                                        ) : (
                                            <button
                                                disabled
                                                className="btn-secondary px-4 py-2 text-xs opacity-50 cursor-not-allowed"
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
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/90 backdrop-blur-sm">
                    <div className="w-full max-w-lg bg-card border border-primary shadow-2xl animate-in fade-in zoom-in duration-200 tech-border-full p-1">
                        <div className="bg-card p-6">
                            <div className="border-b border-border pb-4 mb-6 flex justify-between items-center">
                                <h3 className="text-lg font-bold text-foreground uppercase tracking-wider">Initialize Booking</h3>
                                <button
                                    onClick={() => setShowOrderForm(false)}
                                    className="text-muted-foreground hover:text-primary transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            <OrderForm bikeId={selectedBikeId} onSuccess={() => setShowOrderForm(false)} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default HomePage;
