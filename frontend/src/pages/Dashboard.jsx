import React, { useState, useEffect } from 'react';
import {
    LayoutDashboard,
    Bike,
    Calendar,
    LogOut,
    Plus,
    Menu,
    User,
    DollarSign,
    Clock,
    X,
    Home
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import BikeForm from '../components/BikeForm';

function Dashboard() {
    const [activeTab, setActiveTab] = useState('overview');
    const [rentals, setRentals] = useState([]);
    const [bikes, setBikes] = useState([]);
    const [ownerRentals, setOwnerRentals] = useState([]);
    const [userProfile, setUserProfile] = useState(null);
    const [showAddBikeModal, setShowAddBikeModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { logout } = useAuth();
    const navigate = useNavigate();

    // Array of available bike images
    const bikeImages = [
        '/assets/bike1.jpg',
        '/assets/bike2.jpg',
        '/assets/bike3.jpg',
        '/assets/bike4.jpg'
    ];

    // Helper to get a deterministic image based on ID
    const getBikeImage = (id) => {
        if (!id) return bikeImages[0];
        const index = id % bikeImages.length;
        return bikeImages[index];
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
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ refresh: refreshToken }),
                    });

                    if (refreshResponse.ok) {
                        const data = await refreshResponse.json();
                        localStorage.setItem('access_token', data.access);
                        response = await makeRequest(data.access);
                    }
                } catch (error) {
                    console.error('Token refresh failed:', error);
                }
            }
        }
        return response;
    };

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch user profile
            const profileRes = await apiCall('http://127.0.0.1:8000/api/profile/');
            if (profileRes.ok) {
                const profileData = await profileRes.json();
                setUserProfile(profileData);

                // Fetch data based on role
                if (profileData.role === 'owner') {
                    // Fetch owned bikes
                    const bikesRes = await apiCall('http://127.0.0.1:8000/api/my_bikes/');
                    if (bikesRes.ok) {
                        const bikesData = await bikesRes.json();
                        setBikes(bikesData);
                    }

                    // Fetch rentals for owned bikes
                    const ownerRentalsRes = await apiCall('http://127.0.0.1:8000/api/owner_rentals/');
                    if (ownerRentalsRes.ok) {
                        const ownerRentalsData = await ownerRentalsRes.json();
                        setOwnerRentals(ownerRentalsData);
                    }
                } else {
                    // Fetch user's rentals
                    const rentalsRes = await apiCall('http://127.0.0.1:8000/api/rentals/');
                    if (rentalsRes.ok) {
                        const rentalsData = await rentalsRes.json();
                        setRentals(rentalsData);
                    }
                }
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleDeleteBike = async (bikeId) => {
        if (!window.confirm('Are you sure you want to delete this bike?')) return;

        try {
            const response = await apiCall(`http://127.0.0.1:8000/api/bikes/${bikeId}/`, {
                method: 'DELETE',
            });

            if (response.ok || response.status === 204) {
                fetchData();
            }
        } catch (error) {
            console.error('Error deleting bike:', error);
        }
    };

    const handleCompleteRental = async (rentalId) => {
        try {
            const response = await apiCall(`http://127.0.0.1:8000/api/rentals/${rentalId}/`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    actual_end_time: new Date().toISOString(),
                }),
            });

            if (response.ok) {
                fetchData();
            }
        } catch (error) {
            console.error('Error completing rental:', error);
        }
    };

    const SidebarLink = ({ icon: Icon, label, tab, badge }) => (
        <button
            onClick={() => {
                setActiveTab(tab);
                setSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 border-l-2 transition-all text-xs font-bold uppercase tracking-wider ${activeTab === tab
                ? 'border-primary bg-primary/5 text-primary'
                : 'border-transparent text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
        >
            <Icon size={16} />
            <span>{label}</span>
            {badge !== undefined && badge > 0 && (
                <span className="ml-auto bg-primary text-primary-foreground px-2 py-0.5 text-[10px] font-bold">
                    {badge}
                </span>
            )}
        </button>
    );

    return (
        <div className="min-h-screen bg-background flex">
            {/* Sidebar */}
            <aside className={`fixed md:sticky top-0 left-0 h-screen bg-card border-r border-border z-40 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
                } w-72 flex flex-col shadow-xl md:shadow-none`}>
                <div className="p-6 border-b border-border flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 flex items-center justify-center text-primary">
                            <User size={20} />
                        </div>
                        <div className="overflow-hidden">
                            <h2 className="font-bold text-sm text-foreground truncate uppercase tracking-wider">{userProfile?.username}</h2>
                            <p className="text-xs text-muted-foreground capitalize truncate">
                                {userProfile?.role} Account
                            </p>
                        </div>
                    </div>
                    {/* Close button for mobile sidebar */}
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="md:hidden text-muted-foreground hover:text-foreground"
                    >
                        <X size={20} />
                    </button>
                </div>

                <nav className="flex-1 py-4 space-y-1 overflow-y-auto">
                    <p className="px-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2 mt-2">Main Menu</p>
                    <SidebarLink icon={LayoutDashboard} label="Overview" tab="overview" />

                    {userProfile?.role === 'owner' ? (
                        <>
                            <SidebarLink icon={Bike} label="My Fleet" tab="bikes" badge={bikes.length} />
                            <SidebarLink icon={Calendar} label="Bookings" tab="bookings" badge={ownerRentals.length} />
                        </>
                    ) : (
                        <SidebarLink icon={Calendar} label="My Rentals" tab="rentals" badge={rentals.length} />
                    )}

                    <div className="my-4 border-t border-border"></div>
                    <button
                        onClick={() => navigate('/')}
                        className="w-full flex items-center gap-3 px-4 py-3 border-l-2 border-transparent text-muted-foreground hover:bg-muted hover:text-foreground transition-all text-xs font-bold uppercase tracking-wider"
                    >
                        <Home size={16} />
                        <span>Back to Home</span>
                    </button>
                </nav>

                <div className="p-4 border-t border-border">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 border border-transparent hover:border-destructive/20 hover:bg-destructive/5 text-muted-foreground hover:text-destructive transition-colors text-xs font-bold uppercase tracking-wider"
                    >
                        <LogOut size={16} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}

            {/* Main Content */}
            <main className="flex-1 min-w-0 overflow-auto h-screen">
                {/* Mobile Header */}
                <div className="md:hidden flex items-center justify-between p-4 border-b border-border bg-card sticky top-0 z-20">
                    <h1 className="text-lg font-bold text-primary uppercase tracking-widest">AddisBike</h1>
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="p-2 -mr-2 text-muted-foreground hover:bg-muted"
                    >
                        <Menu size={24} />
                    </button>
                </div>

                <div className="p-6 md:p-8 max-w-7xl mx-auto pb-24">
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="h-8 w-8 border-2 border-primary border-t-transparent animate-spin"></div>
                        </div>
                    ) : (
                        <>
                            {/* Overview Tab */}
                            {activeTab === 'overview' && (
                                <div className="space-y-8 animate-in fade-in duration-500">
                                    <div className="flex items-end justify-between border-b border-border pb-4">
                                        <div>
                                            <h1 className="text-2xl font-bold tracking-tight text-foreground uppercase">Dashboard</h1>
                                            <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">System Status: Online</p>
                                        </div>
                                        <div className="text-xs font-mono text-primary">
                                            {new Date().toLocaleDateString()}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {userProfile?.role === 'owner' ? (
                                            <>
                                                <StatsCard
                                                    title="Total Units"
                                                    value={bikes.length}
                                                    icon={Bike}
                                                    trend="+2 this week"
                                                />
                                                <StatsCard
                                                    title="Active Bookings"
                                                    value={ownerRentals.filter(r => r.status === 'active').length}
                                                    icon={Calendar}
                                                    color="text-emerald-600 bg-emerald-100"
                                                />
                                                <StatsCard
                                                    title="Total Revenue"
                                                    value={`$${ownerRentals.reduce((sum, r) => sum + parseFloat(r.total_cost || 0), 0).toFixed(2)}`}
                                                    icon={DollarSign}
                                                    color="text-primary bg-primary/10"
                                                />
                                            </>
                                        ) : (
                                            <>
                                                <StatsCard
                                                    title="Total Rentals"
                                                    value={rentals.length}
                                                    icon={Bike}
                                                />
                                                <StatsCard
                                                    title="Active Rentals"
                                                    value={rentals.filter(r => r.status === 'active').length}
                                                    icon={Clock}
                                                    color="text-emerald-600 bg-emerald-100"
                                                />
                                                <StatsCard
                                                    title="Total Spent"
                                                    value={`$${rentals.reduce((sum, r) => sum + parseFloat(r.total_cost || 0), 0).toFixed(2)}`}
                                                    icon={DollarSign}
                                                    color="text-primary bg-primary/10"
                                                />
                                            </>
                                        )}
                                    </div>

                                    <div className="tech-card">
                                        <div className="flex items-center justify-between mb-6 border-b border-border pb-2">
                                            <h2 className="text-sm font-bold uppercase tracking-wider">Quick Actions</h2>
                                        </div>
                                        <div className="flex flex-wrap gap-4">
                                            {userProfile?.role === 'owner' ? (
                                                <button
                                                    onClick={() => setShowAddBikeModal(true)}
                                                    className="btn-primary"
                                                >
                                                    <Plus size={16} className="mr-2" />
                                                    Add New Unit
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => navigate('/')}
                                                    className="btn-primary"
                                                >
                                                    Browse Units
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* My Bikes Tab (Owner) */}
                            {activeTab === 'bikes' && userProfile?.role === 'owner' && (
                                <div className="space-y-6 animate-in fade-in duration-500">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
                                        <div>
                                            <h1 className="text-2xl font-bold tracking-tight uppercase">My Fleet</h1>
                                            <p className="text-xs text-muted-foreground uppercase tracking-wider">Manage unit availability.</p>
                                        </div>
                                        <button
                                            onClick={() => setShowAddBikeModal(true)}
                                            className="btn-primary"
                                        >
                                            <Plus size={16} className="mr-2" />
                                            Add Unit
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {bikes.map((bike) => (
                                            <div key={bike.id} className="group tech-card hover:border-primary/50 transition-all duration-300">
                                                <div className="h-48 bg-muted relative overflow-hidden border-b border-border mb-4">
                                                    <img
                                                        src={getBikeImage(bike.id)}
                                                        alt={bike.brand}
                                                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                                                    />
                                                    <div className="absolute top-2 right-2">
                                                        <span className={`inline-flex items-center px-2 py-1 text-[10px] font-bold uppercase tracking-wider border ${bike.is_available
                                                            ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                                                            : 'bg-amber-100 text-amber-700 border-amber-200'
                                                            }`}>
                                                            {bike.is_available ? 'Available' : 'Rented'}
                                                        </span>
                                                    </div>
                                                </div>

                                                <h3 className="font-bold text-lg mb-1 uppercase">{bike.brand}</h3>
                                                <p className="text-xs text-muted-foreground mb-4 uppercase">{bike.model}</p>

                                                <div className="flex items-center justify-between pt-4 border-t border-border border-dashed">
                                                    <div>
                                                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Rate</p>
                                                        <p className="font-bold text-primary">${bike.price_per_hour}/hr</p>
                                                    </div>
                                                    <button
                                                        onClick={() => handleDeleteBike(bike.id)}
                                                        className="text-xs font-bold uppercase tracking-wider text-destructive hover:text-destructive/80 border border-transparent hover:border-destructive/20 px-3 py-1.5 transition-colors"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Bookings Tab (Owner) */}
                            {activeTab === 'bookings' && userProfile?.role === 'owner' && (
                                <div className="space-y-6 animate-in fade-in duration-500">
                                    <div className="border-b border-border pb-4">
                                        <h1 className="text-2xl font-bold tracking-tight uppercase">Bookings Log</h1>
                                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Track rental history.</p>
                                    </div>

                                    <div className="tech-card overflow-hidden p-0">
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm text-left">
                                                <thead className="bg-muted/50 text-muted-foreground font-bold uppercase text-xs tracking-wider border-b border-border">
                                                    <tr>
                                                        <th className="px-6 py-4">Unit</th>
                                                        <th className="px-6 py-4">Renter</th>
                                                        <th className="px-6 py-4">Duration</th>
                                                        <th className="px-6 py-4">Cost</th>
                                                        <th className="px-6 py-4">Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-border">
                                                    {ownerRentals.map((rental) => (
                                                        <tr key={rental.id} className="hover:bg-muted/10 transition-colors">
                                                            <td className="px-6 py-4">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-8 h-8 bg-muted border border-border">
                                                                        <img
                                                                            src={getBikeImage(rental.bike_details?.id)}
                                                                            alt="Bike"
                                                                            className="w-full h-full object-cover grayscale"
                                                                        />
                                                                    </div>
                                                                    <div>
                                                                        <div className="font-bold text-foreground uppercase text-xs">{rental.bike_details?.brand}</div>
                                                                        <div className="text-[10px] text-muted-foreground uppercase">{rental.bike_details?.model}</div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 uppercase text-xs font-medium">{rental.renter_username}</td>
                                                            <td className="px-6 py-4">
                                                                <div className="text-foreground text-xs font-medium">{new Date(rental.start_time).toLocaleDateString()}</div>
                                                                <div className="text-[10px] text-muted-foreground">
                                                                    {new Date(rental.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -
                                                                    {rental.end_time ? new Date(rental.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Ongoing'}
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 font-bold text-primary">${rental.total_cost}</td>
                                                            <td className="px-6 py-4">
                                                                <StatusBadge status={rental.status} />
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* My Rentals Tab (Renter) */}
                            {activeTab === 'rentals' && userProfile?.role === 'renter' && (
                                <div className="space-y-6 animate-in fade-in duration-500">
                                    <div className="border-b border-border pb-4">
                                        <h1 className="text-2xl font-bold tracking-tight uppercase">My Rentals</h1>
                                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Active and past sessions.</p>
                                    </div>

                                    <div className="grid gap-4">
                                        {rentals.map((rental) => (
                                            <div key={rental.id} className="tech-card flex flex-col md:flex-row gap-6 items-start md:items-center justify-between hover:border-primary/50 transition-all">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-16 h-16 bg-muted border border-border flex-shrink-0">
                                                        <img
                                                            src={getBikeImage(rental.bike_details?.id)}
                                                            alt="Bike"
                                                            className="w-full h-full object-cover grayscale"
                                                        />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-sm uppercase tracking-wide">{rental.bike_details?.brand} {rental.bike_details?.model}</h3>
                                                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                                            <Calendar size={12} />
                                                            <span>{new Date(rental.start_time).toLocaleDateString()}</span>
                                                            <span>•</span>
                                                            <span>{new Date(rental.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                                                    <div className="text-right">
                                                        <p className="text-[10px] text-muted-foreground mb-1 uppercase font-bold">Total</p>
                                                        <p className="font-bold text-lg text-primary">${rental.total_cost}</p>
                                                    </div>

                                                    <div className="flex flex-col items-end gap-2">
                                                        <StatusBadge status={rental.status} />
                                                        {rental.status === 'active' && (
                                                            <button
                                                                onClick={() => handleCompleteRental(rental.id)}
                                                                className="text-xs font-bold text-primary hover:underline uppercase tracking-wide"
                                                            >
                                                                Complete Rental
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>

            {/* Add Bike Modal */}
            {showAddBikeModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/90 backdrop-blur-sm">
                    <div className="w-full max-w-lg bg-card border border-primary shadow-2xl animate-in fade-in zoom-in duration-200 tech-border-full p-1">
                        <div className="bg-card p-6">
                            <div className="border-b border-border pb-4 mb-6 flex justify-between items-center">
                                <h3 className="text-lg font-bold text-foreground uppercase tracking-wider">Add New Unit</h3>
                                <button
                                    onClick={() => setShowAddBikeModal(false)}
                                    className="text-muted-foreground hover:text-primary transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            <BikeForm
                                onSuccess={() => {
                                    setShowAddBikeModal(false);
                                    fetchData();
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Helper Components
function StatsCard({ title, value, icon: Icon, trend, color }) {
    return (
        <div className="tech-card hover:border-primary/50 transition-colors">
            <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{title}</p>
                <div className={`p-1.5 border ${color ? 'border-emerald-200 bg-emerald-50 text-emerald-600' : 'border-border bg-muted text-foreground'}`}>
                    <Icon size={16} />
                </div>
            </div>
            <div>
                <h3 className="text-2xl font-bold text-foreground">{value}</h3>
                {trend && <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wide mt-1">{trend}</p>}
            </div>
        </div>
    );
}

function StatusBadge({ status }) {
    const styles = {
        active: 'bg-emerald-100 text-emerald-700 border-emerald-200',
        completed: 'bg-slate-100 text-slate-700 border-slate-200',
        pending: 'bg-amber-100 text-amber-700 border-amber-200'
    };

    return (
        <span className={`inline-flex items-center px-2 py-0.5 border text-[10px] font-bold uppercase tracking-wider ${styles[status] || styles.pending}`}>
            {status}
        </span>
    );
}

export default Dashboard;
