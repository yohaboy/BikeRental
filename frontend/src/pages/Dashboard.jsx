import React, { useState, useEffect } from 'react';
import {
    LayoutDashboard,
    Bike,
    Calendar,
    Settings,
    LogOut,
    Plus,
    X,
    Clock,
    DollarSign,
    User,
    Menu
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
            className={`w-full flex items-center gap-3 px-4 py-3 transition-all ${activeTab === tab
                    ? 'bg-primary text-white border-l-4 border-white'
                    : 'text-foreground hover:bg-muted border-l-4 border-transparent'
                }`}
        >
            <Icon size={20} />
            <span className="font-bold text-sm uppercase tracking-wider">{label}</span>
            {badge && (
                <span className="ml-auto bg-primary text-white px-2 py-0.5 text-xs font-bold">
                    {badge}
                </span>
            )}
        </button>
    );

    return (
        <div className="min-h-screen bg-background flex">
            {/* Sidebar */}
            <aside className={`fixed md:sticky top-0 left-0 h-screen bg-card border-r-2 border-border shadow-warm z-40 transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
                } w-64`}>
                <div className="p-6 border-b-2 border-border">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary flex items-center justify-center">
                            <User className="text-white" size={24} />
                        </div>
                        <div>
                            <h2 className="font-bold text-lg">{userProfile?.username}</h2>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider">
                                {userProfile?.role}
                            </p>
                        </div>
                    </div>
                </div>

                <nav className="py-4">
                    <SidebarLink icon={LayoutDashboard} label="Overview" tab="overview" />

                    {userProfile?.role === 'owner' ? (
                        <>
                            <SidebarLink icon={Bike} label="My Bikes" tab="bikes" badge={bikes.length} />
                            <SidebarLink icon={Calendar} label="Bookings" tab="bookings" badge={ownerRentals.length} />
                        </>
                    ) : (
                        <SidebarLink icon={Calendar} label="My Rentals" tab="rentals" badge={rentals.length} />
                    )}

                    <SidebarLink icon={Settings} label="Settings" tab="settings" />
                </nav>

                <div className="absolute bottom-0 left-0 right-0 p-4 border-t-2 border-border">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-destructive hover:bg-destructive/10 transition-all border-2 border-destructive"
                    >
                        <LogOut size={20} />
                        <span className="font-bold text-sm uppercase tracking-wider">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}

            {/* Main Content */}
            <main className="flex-1 p-6">
                {/* Mobile Header */}
                <div className="md:hidden flex items-center justify-between mb-6">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="p-2 border-2 border-primary text-primary"
                    >
                        <Menu size={24} />
                    </button>
                    <h1 className="text-2xl font-bold">Dashboard</h1>
                    <div className="w-10"></div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="h-12 w-12 border-4 border-primary border-t-transparent animate-spin"></div>
                    </div>
                ) : (
                    <>
                        {/* Overview Tab */}
                        {activeTab === 'overview' && (
                            <div>
                                <h1 className="text-heading mb-8">Dashboard Overview</h1>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                    {userProfile?.role === 'owner' ? (
                                        <>
                                            <div className="card-shadow p-6">
                                                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Total Bikes</p>
                                                <p className="text-4xl font-bold text-primary">{bikes.length}</p>
                                            </div>
                                            <div className="card-shadow p-6">
                                                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Active Bookings</p>
                                                <p className="text-4xl font-bold text-secondary">
                                                    {ownerRentals.filter(r => r.status === 'active').length}
                                                </p>
                                            </div>
                                            <div className="card-shadow p-6">
                                                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Total Revenue</p>
                                                <p className="text-4xl font-bold text-accent">
                                                    ${ownerRentals.reduce((sum, r) => sum + parseFloat(r.total_cost || 0), 0).toFixed(2)}
                                                </p>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="card-shadow p-6">
                                                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Total Rentals</p>
                                                <p className="text-4xl font-bold text-primary">{rentals.length}</p>
                                            </div>
                                            <div className="card-shadow p-6">
                                                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Active Rentals</p>
                                                <p className="text-4xl font-bold text-secondary">
                                                    {rentals.filter(r => r.status === 'active').length}
                                                </p>
                                            </div>
                                            <div className="card-shadow p-6">
                                                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Total Spent</p>
                                                <p className="text-4xl font-bold text-accent">
                                                    ${rentals.reduce((sum, r) => sum + parseFloat(r.total_cost || 0), 0).toFixed(2)}
                                                </p>
                                            </div>
                                        </>
                                    )}
                                </div>

                                <div className="card-shadow p-6">
                                    <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
                                    <div className="flex flex-wrap gap-4">
                                        {userProfile?.role === 'owner' ? (
                                            <button
                                                onClick={() => setShowAddBikeModal(true)}
                                                className="btn-primary px-6 py-3 flex items-center gap-2"
                                            >
                                                <Plus size={20} />
                                                Add New Bike
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => navigate('/')}
                                                className="btn-primary px-6 py-3"
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
                            <div>
                                <div className="flex justify-between items-center mb-8">
                                    <h1 className="text-heading">My Bikes</h1>
                                    <button
                                        onClick={() => setShowAddBikeModal(true)}
                                        className="btn-primary px-6 py-3 flex items-center gap-2"
                                    >
                                        <Plus size={20} />
                                        Add Bike
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {bikes.map((bike) => (
                                        <div key={bike.id} className="card-shadow">
                                            <div className="h-32 bg-muted border-b-2 border-border flex items-center justify-center">
                                                <Bike size={64} className="text-primary" strokeWidth={1.5} />
                                            </div>
                                            <div className="p-6">
                                                <span className={`badge mb-3 ${bike.is_available ? 'bg-green-100 text-green-700 border-green-300' : 'bg-red-100 text-red-700 border-red-300'}`}>
                                                    {bike.is_available ? 'Available' : 'Rented'}
                                                </span>
                                                <h3 className="font-bold text-xl mb-1">{bike.brand}</h3>
                                                <p className="text-muted-foreground mb-4">{bike.model}</p>
                                                <div className="flex justify-between items-center mb-4">
                                                    <span className="text-xs uppercase text-muted-foreground">Price</span>
                                                    <span className="text-xl font-bold text-primary">${bike.price_per_hour}/hr</span>
                                                </div>
                                                <button
                                                    onClick={() => handleDeleteBike(bike.id)}
                                                    className="w-full py-2 border-2 border-destructive text-destructive hover:bg-destructive hover:text-white transition-all font-bold text-sm"
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
                            <div>
                                <h1 className="text-heading mb-8">Bike Bookings</h1>

                                <div className="card-shadow overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="border-b-2 border-border">
                                            <tr>
                                                <th className="text-left p-4 text-xs uppercase tracking-wider text-muted-foreground">Bike</th>
                                                <th className="text-left p-4 text-xs uppercase tracking-wider text-muted-foreground">Renter</th>
                                                <th className="text-left p-4 text-xs uppercase tracking-wider text-muted-foreground">Start</th>
                                                <th className="text-left p-4 text-xs uppercase tracking-wider text-muted-foreground">End</th>
                                                <th className="text-left p-4 text-xs uppercase tracking-wider text-muted-foreground">Cost</th>
                                                <th className="text-left p-4 text-xs uppercase tracking-wider text-muted-foreground">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {ownerRentals.map((rental) => (
                                                <tr key={rental.id} className="border-b border-border">
                                                    <td className="p-4 font-bold">{rental.bike_details?.brand} {rental.bike_details?.model}</td>
                                                    <td className="p-4">{rental.renter_username}</td>
                                                    <td className="p-4 text-sm">{new Date(rental.start_time).toLocaleString()}</td>
                                                    <td className="p-4 text-sm">{new Date(rental.end_time).toLocaleString()}</td>
                                                    <td className="p-4 font-bold text-primary">${rental.total_cost}</td>
                                                    <td className="p-4">
                                                        <span className={`badge ${rental.status === 'active' ? 'bg-green-100 text-green-700 border-green-300' :
                                                                rental.status === 'completed' ? 'bg-gray-100 text-gray-700 border-gray-300' :
                                                                    'bg-yellow-100 text-yellow-700 border-yellow-300'
                                                            }`}>
                                                            {rental.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* My Rentals Tab (Renter) */}
                        {activeTab === 'rentals' && userProfile?.role === 'renter' && (
                            <div>
                                <h1 className="text-heading mb-8">My Rentals</h1>

                                <div className="space-y-4">
                                    {rentals.map((rental) => (
                                        <div key={rental.id} className="card-shadow p-6">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-16 h-16 bg-muted border-2 border-border flex items-center justify-center">
                                                        <Bike size={32} className="text-primary" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-lg">{rental.bike_details?.brand} {rental.bike_details?.model}</h3>
                                                        <p className="text-sm text-muted-foreground">{rental.bike_details?.type}</p>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col md:items-end gap-2">
                                                    <span className={`badge ${rental.status === 'active' ? 'bg-green-100 text-green-700 border-green-300' :
                                                            rental.status === 'completed' ? 'bg-gray-100 text-gray-700 border-gray-300' :
                                                                'bg-yellow-100 text-yellow-700 border-yellow-300'
                                                        }`}>
                                                        {rental.status}
                                                    </span>
                                                    <p className="text-2xl font-bold text-primary">${rental.total_cost}</p>
                                                </div>
                                            </div>
                                            <div className="mt-4 pt-4 border-t-2 border-border grid grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <p className="text-xs uppercase text-muted-foreground mb-1">Pickup</p>
                                                    <p className="font-bold">{new Date(rental.start_time).toLocaleString()}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs uppercase text-muted-foreground mb-1">Return</p>
                                                    <p className="font-bold">{new Date(rental.end_time).toLocaleString()}</p>
                                                </div>
                                            </div>
                                            {rental.status === 'active' && (
                                                <button
                                                    onClick={() => handleCompleteRental(rental.id)}
                                                    className="mt-4 btn-primary px-6 py-2 text-sm"
                                                >
                                                    Complete Rental
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Settings Tab */}
                        {activeTab === 'settings' && (
                            <div>
                                <h1 className="text-heading mb-8">Settings</h1>

                                <div className="card-shadow p-6 max-w-2xl">
                                    <h2 className="text-xl font-bold mb-6">Profile Information</h2>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-bold mb-2 uppercase tracking-wider text-muted-foreground">
                                                Username
                                            </label>
                                            <input
                                                type="text"
                                                value={userProfile?.username || ''}
                                                disabled
                                                className="input-shadow bg-muted"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold mb-2 uppercase tracking-wider text-muted-foreground">
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                value={userProfile?.email || ''}
                                                disabled
                                                className="input-shadow bg-muted"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold mb-2 uppercase tracking-wider text-muted-foreground">
                                                Role
                                            </label>
                                            <input
                                                type="text"
                                                value={userProfile?.role || ''}
                                                disabled
                                                className="input-shadow bg-muted capitalize"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </main>

            {/* Add Bike Modal */}
            {showAddBikeModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-background/95">
                    <div className="w-full max-w-2xl border-4 border-primary bg-card shadow-warm-lg">
                        <div className="bg-primary p-6 flex justify-between items-center border-b-4 border-primary">
                            <h3 className="text-2xl font-bold uppercase tracking-wider text-white">Add New Bike</h3>
                            <button
                                onClick={() => setShowAddBikeModal(false)}
                                className="text-3xl text-white hover:text-white/70 transition-all"
                            >
                                ×
                            </button>
                        </div>
                        <div className="p-8">
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

export default Dashboard;
