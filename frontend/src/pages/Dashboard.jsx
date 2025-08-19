import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Plus } from 'lucide-react';

function BikeRentalsDashboard() {
  const [activeTab, setActiveTab] = useState('rentals');
  const [rentals, setRentals] = useState([]);
  const [bikes, setBikes] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/rentals/', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch rentals');
        }
        return response.json();
      })
      .then((data) => {
        const fetchBikeDetails = async (bikeId) => {
          try {
            const bikeResponse = await fetch(`http://127.0.0.1:8000/api/bikes/${bikeId}/`);
            const bikeData = await bikeResponse.json();
            return bikeData;
          } catch (error) {
            console.error(`Error fetching bike details for bike ID ${bikeId}:`, error);
            return null;
          }
        };

        const fetchUserDetails = async (userId) => {
          try {
            const userResponse = await fetch(`http://127.0.0.1:8000/api/users/${userId}/`);
            const userData = await userResponse.json();
            return userData;
          } catch (error) {
            console.error(`Error fetching user details for user ID ${userId}:`, error);
            return null;
          }
        };

        const formattedRentals = Promise.all(
          data.map(async (rental) => {
            const bikeDetails = await fetchBikeDetails(rental.bike);
            const userDetails = await fetchUserDetails(rental.user);
            return {
              id: rental.id,
              bikeImage: `https://via.placeholder.com/150?text=Bike+${rental.bike}`,
              bikeName: bikeDetails ? `${bikeDetails.brand} ${bikeDetails.model}` : `Bike ${rental.bike}`,
              startTime: new Date(rental.start_time).toLocaleString(),
              endTime: new Date(rental.end_time).toLocaleString(),
              duration: `${Math.round((new Date(rental.end_time) - new Date(rental.start_time)) / (1000 * 60 * 60))} hours`,
              total: `$${rental.total_cost}`,
              status: rental.status ? 'completed' : 'active',
            };
          })
        );

        formattedRentals.then((rentals) => setRentals(rentals));
      })
      .catch((error) => console.error('Error fetching rentals:', error));
  }, []);

  const getStatusColor = (status) => {
    const colors = {
      completed: 'bg-green-100 text-green-800 border-green-200',
      active: 'bg-blue-100 text-blue-800 border-blue-200',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      available: 'bg-green-100 text-green-800 border-green-200',
      'in-use': 'bg-blue-100 text-blue-800 border-blue-200',
      maintenance: 'bg-red-100 text-red-800 border-red-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8 border-b border-gray-200">
            {[
              { id: 'rentals', label: 'Rentals' },
              { id: 'bikes', label: 'My Bikes' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Rentals */}
        {activeTab === 'rentals' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-center">
              <h3 className="text-lg font-semibold text-gray-900">Recent Rentals</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bike Info</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rental Period</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {rentals.map((rental) => (
                    <tr key={rental.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12">
                            <img className="h-12 w-12 rounded-lg object-cover" src={rental.bikeImage} alt="Bike" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{rental.bikeName}</div>
                            <div className="text-sm text-gray-500">mountain</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 flex items-center">
                          <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                          {rental.startTime.split(',')[0]}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Clock className="w-4 h-4 mr-2 text-gray-400" />
                          {rental.startTime.split(', ').slice(-1)[0]} - {rental.endTime.split(', ').slice(-1)[0]}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {rental.duration}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {rental.total}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(rental.status)}`}>
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

        {/* Bikes Tab */}
        {activeTab === 'bikes' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">My bikes</h3>
              <button className="flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                <Plus className="w-4 h-4 mr-2" />
                Add New Bike
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {bikes.map((bike) => (
                <div key={bike.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="aspect-w-16 aspect-h-9 bg-gray-100">
                    <img 
                      className="w-full h-48 object-cover" 
                      src={bike.image} 
                      alt={bike.name} 
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="text-lg font-medium text-gray-900 mb-1">{bike.name}</h4>
                      </div>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(bike.status)}`}>
                        {bike.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <p className="text-sm text-gray-500">{bike.category}</p>
                      </div>
                      <div className="text-lg font-bold text-gray-900">{bike.rate}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default BikeRentalsDashboard;