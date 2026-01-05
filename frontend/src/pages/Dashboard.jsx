import React, { useState, useEffect } from 'react';
import {
    LayoutDashboard,
    Bike,
    Calendar,
    Settings,
    LogOut,
    Plus,
    Menu,
    User,
    DollarSign,
    Clock,
    CheckCircle,
    AlertCircle
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
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium ${activeTab === tab
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
        >
            <Icon size={18} />
            <span>{label}</span>
            {badge !== undefined && badge > 0 && (
                <span className="ml-auto bg-primary text-primary-foreground px-2 py-0.5 rounded-full text-xs font-bold">
                    {badge}
                </span>
            )}
        </button>
    );

    return (
        <div className="min-h-screen bg-background flex">
            {/* Sidebar */}
            <aside className={`fixed md:sticky top-0 left-0 h-screen bg-card border-r border-border z-40 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
                } w-72 flex flex-col`}>
                <div className="p-6 border-b border-border/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <User size={20} />
                        </div>
                        <div className="overflow-hidden">
                            <h2 className="font-bold text-sm text-foreground truncate">{userProfile?.username}</h2>
                            <p className="text-xs text-muted-foreground capitalize truncate">
                                {userProfile?.role} Account
                            </p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 mt-2">Menu</p>
                    <SidebarLink icon={LayoutDashboard} label="Overview" tab="overview" />

                    {userProfile?.role === 'owner' ? (
                        <>
                            <SidebarLink icon={Bike} label="My Bikes" tab="bikes" badge={bikes.length} />
                            <SidebarLink icon={Calendar} label="Bookings" tab="bookings" badge={ownerRentals.length} />
                        </>
                    ) : (
                        <SidebarLink icon={Calendar} label="My Rentals" tab="rentals" badge={rentals.length} />
                    )}

                    <div className="my-4 border-t border-border/50"></div>
                    <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Account</p>
                    <SidebarLink icon={Settings} label="Settings" tab="settings" />
                </nav>

                <div className="p-4 border-t border-border/50">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors text-sm font-medium"
                    >
                        <LogOut size={18} />
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
            <main className="flex-1 min-w-0 overflow-auto">
                {/* Mobile Header */}
                <div className="md:hidden flex items-center justify-between p-4 border-b border-border bg-card sticky top-0 z-20">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="p-2 -ml-2 rounded-md text-muted-foreground hover:bg-muted"
                    >
                        <Menu size={24} />
                    </button>
                    <h1 className="text-lg font-bold">Dashboard</h1>
                    <div className="w-8"></div>
                </div>

                <div className="p-6 md:p-8 max-w-7xl mx-auto">
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : (
                        <>
                            {/* Overview Tab */}
                            {activeTab === 'overview' && (
                                <div className="space-y-8">
                                    <div>
                                        <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
                                        <p className="text-muted-foreground mt-1">Welcome back, here's what's happening today.</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {userProfile?.role === 'owner' ? (
                                            <>
                                                <StatsCard
                                                    title="Total Bikes"
                                                    value={bikes.length}
                                                    icon={Bike}
                                                    trend="+2 this week"
                                                />
                                                <StatsCard
                                                    title="Active Bookings"
                                                    value={ownerRentals.filter(r => r.status === 'active').length}
                                                    icon={Calendar}
                                                    color="text-emerald-500"
                                                />
                                                <StatsCard
                                                    title="Total Revenue"
                                                    value={`$${ownerRentals.reduce((sum, r) => sum + parseFloat(r.total_cost || 0), 0).toFixed(2)}`}
                                                    icon={DollarSign}
                                                    color="text-indigo-500"
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
                                                    color="text-emerald-500"
                                                />
                                                <StatsCard
                                                    title="Total Spent"
                                                    value={`$${rentals.reduce((sum, r) => sum + parseFloat(r.total_cost || 0), 0).toFixed(2)}`}
                                                    icon={DollarSign}
                                                    color="text-indigo-500"
                                                />
                                            </>
                                        )}
                                    </div>

                                    <div className="bg-card rounded-xl border border-border/50 shadow-sm p-6">
                                        <div className="flex items-center justify-between mb-6">
                                            <h2 className="text-lg font-semibold">Quick Actions</h2>
                                        </div>
                                        <div className="flex flex-wrap gap-4">
                                            {userProfile?.role === 'owner' ? (
                                                <button
                                                    onClick={() => setShowAddBikeModal(true)}
                                                    className="btn-primary"
                                                >
                                                    <Plus size={18} className="mr-2" />
                                                    Add New Bike
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => navigate('/')}
                                                    className="btn-primary"
                                                >
                                                    Browse Bikes
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* My Bikes Tab (Owner) */}
                            {activeTab === 'bikes' && userProfile?.role === 'owner' && (
                                <div className="space-y-6">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div>
                                            <h1 className="text-2xl font-bold tracking-tight">My Bikes</h1>
                                            <p className="text-muted-foreground">Manage your fleet and availability.</p>
                                        </div>
                                        <button
                                            onClick={() => setShowAddBikeModal(true)}
                                            className="btn-primary"
                                        >
                                            <Plus size={18} className="mr-2" />
                                            Add Bike
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {bikes.map((bike) => (
                                            <div key={bike.id} className="group bg-card rounded-xl border border-border/50 overflow-hidden hover:shadow-md transition-all">
                                                <div className="h-40 bg-muted/50 flex items-center justify-center relative">
                                                    <Bike size={48} className="text-muted-foreground/50" strokeWidth={1.5} />
                                                    <div className="absolute top-3 right-3">
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bike.is_available
                                                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
                                                                : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                                                            }`}>
                                                            {bike.is_available ? 'Available' : 'Rented'}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="p-5">
                                                    <h3 className="font-semibold text-lg mb-1">{bike.brand}</h3>
                                                    <p className="text-sm text-muted-foreground mb-4">{bike.model}</p>

                                                    <div className="flex items-center justify-between pt-4 border-t border-border/50">
                                                        <div>
                                                            <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Rate</p>
                                                            <p className="font-bold text-primary">${bike.price_per_hour}/hr</p>
                                                        </div>
                                                        <button
                                                            onClick={() => handleDeleteBike(bike.id)}
                                                            className="text-sm font-medium text-destructive hover:text-destructive/80 hover:bg-destructive/10 px-3 py-1.5 rounded-md transition-colors"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Bookings Tab (Owner) */}
                            {activeTab === 'bookings' && userProfile?.role === 'owner' && (
                                <div className="space-y-6">
                                    <div>
                                        <h1 className="text-2xl font-bold tracking-tight">Bookings</h1>
                                        <p className="text-muted-foreground">Track rental history and earnings.</p>
                                    </div>

                                    <div className="bg-card rounded-xl border border-border/50 shadow-sm overflow-hidden">
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm text-left">
                                                <thead className="bg-muted/50 text-muted-foreground font-medium border-b border-border/50">
                                                    <tr>
                                                        <th className="px-6 py-4">Bike</th>
                                                        <th className="px-6 py-4">Renter</th>
                                                        <th className="px-6 py-4">Duration</th>
                                                        <th className="px-6 py-4">Cost</th>
                                                        <th className="px-6 py-4">Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-border/50">
                                                    {ownerRentals.map((rental) => (
                                                        <tr key={rental.id} className="hover:bg-muted/30 transition-colors">
                                                            <td className="px-6 py-4">
                                                                <div className="font-medium text-foreground">{rental.bike_details?.brand}</div>
                                                                <div className="text-xs text-muted-foreground">{rental.bike_details?.model}</div>
                                                            </td>
                                                            <td className="px-6 py-4">{rental.renter_username}</td>
                                                            <td className="px-6 py-4">
                                                                <div className="text-foreground">{new Date(rental.start_time).toLocaleDateString()}</div>
                                                                <div className="text-xs text-muted-foreground">
                                                                    {new Date(rental.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -
                                                                    {rental.end_time ? new Date(rental.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Ongoing'}
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 font-medium text-foreground">${rental.total_cost}</td>
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
                                <div className="space-y-6">
                                    <div>
                                        <h1 className="text-2xl font-bold tracking-tight">My Rentals</h1>
                                        <p className="text-muted-foreground">View your current and past rides.</p>
                                    </div>

                                    <div className="grid gap-4">
                                        {rentals.map((rental) => (
                                            <div key={rental.id} className="bg-card rounded-xl border border-border/50 p-6 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between hover:shadow-md transition-all">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                                                        <Bike size={24} />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold text-lg">{rental.bike_details?.brand} {rental.bike_details?.model}</h3>
                                                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                                            <Calendar size={14} />
                                                            <span>{new Date(rental.start_time).toLocaleDateString()}</span>
                                                            <span>•</span>
                                                            <span>{new Date(rental.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                                                    <div className="text-right">
                                                        <p className="text-sm text-muted-foreground mb-1">Total</p>
                                                        <p className="font-bold text-xl">${rental.total_cost}</p>
                                                    </div>

                                                    <div className="flex flex-col items-end gap-2">
                                                        <StatusBadge status={rental.status} />
                                                        {rental.status === 'active' && (
                                                            <button
                                                                onClick={() => handleCompleteRental(rental.id)}
                                                                className="text-sm font-medium text-primary hover:underline"
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

                            {/* Settings Tab */}
                            {activeTab === 'settings' && (
                                <div className="space-y-6">
                                    <div>
                                        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
                                        <p className="text-muted-foreground">Manage your account preferences.</p>
                                    </div>

                                    <div className="bg-card rounded-xl border border-border/50 shadow-sm max-w-2xl">
                                        <div className="p-6 border-b border-border/50">
                                            <h2 className="font-semibold text-lg">Profile Information</h2>
                                        </div>
                                        <div className="p-6 space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-foreground mb-1.5">
                                                    Username
                                                </label>
                                                <input
                                                    type="text"
                                                    value={userProfile?.username || ''}
                                                    disabled
                                                    className="input-shadow bg-muted/50"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-foreground mb-1.5">
                                                    Email
                                                </label>
                                                <input
                                                    type="email"
                                                    value={userProfile?.email || ''}
                                                    disabled
                                                    className="input-shadow bg-muted/50"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-foreground mb-1.5">
                                                    Role
                                                </label>
                                                <input
                                                    type="text"
                                                    value={userProfile?.role || ''}
                                                    disabled
                                                    className="input-shadow bg-muted/50 capitalize"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>

            {/* Add Bike Modal */}
            {showAddBikeModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
                    <div className="w-full max-w-lg bg-card rounded-2xl shadow-2xl border border-border animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-border flex justify-between items-center">
                            <h3 className="text-xl font-bold text-foreground">Add New Bike</h3>
                            <button
                                onClick={() => setShowAddBikeModal(false)}
                                className="text-muted-foreground hover:text-foreground transition-colors p-1 hover:bg-muted rounded-full"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6">
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
        <div className="bg-card rounded-xl border border-border/50 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium text-muted-foreground">{title}</p>
                <div className={`p-2 rounded-lg bg-muted/50 ${color || 'text-primary'}`}>
                    <Icon size={20} />
                </div>
            </div>
            <div>
                <h3 className="text-2xl font-bold text-foreground">{value}</h3>
                {trend && <p className="text-xs text-emerald-500 font-medium mt-1">{trend}</p>}
            </div>
        </div>
    );
}

function StatusBadge({ status }) {
    const styles = {
        active: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
        completed: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300',
        pending: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
    };

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${styles[status] || styles.pending}`}>
            {status}
        </span>
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

export default Dashboard;
