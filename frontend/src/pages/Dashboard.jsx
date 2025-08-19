import React, { useState } from 'react';
import { Calendar, Clock, DollarSign, Bike, Plus, Filter, Search, MoreVertical, TrendingUp, Users, MapPin } from 'lucide-react';

function BikeRentalsDashboard() {
  const [activeTab, setActiveTab] = useState('rentals');

  const rentals = [
    {
      id: 1,
      bikeImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC_0AHoLqAJPUsl_EW0OI0h9P-VRUkpi1N0ndvXl3H4Axo5MVYTEAGHoaVQBCmADkksS0-cUEMImiBDItjRVbUF2a0f1Wj_KwV0mhhViAGbvX148sqHXd2rL5zadH113VxThS_cwvc7s7Z3sY2tUAyrmo9xdhST__hR3jwOyhY8ffqrrvqamJehza1qAq9LWCop-5H7-n7Or4VsLGkkeXswQYpd1xz6u_Ewg1TsRV4Hlav4xyPMTOiR0-YouCT_Z4B7o5Ej2ZhHqyA',
      bikeName: 'Canyon Ultimate CF SL',
      customerName: 'Sarah Chen',
      startTime: 'Mon, Jul 15, 2024, 10:00 AM',
      endTime: 'Mon, Jul 15, 2024, 12:00 PM',
      duration: '2 hours',
      total: '$20',
      status: 'completed'
    },
    {
      id: 2,
      bikeImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAwRNKCLbAEBnCZh7ZXXyL768p82vRwbnYoli704Gx52OF-GHc8N3sl9sNOlYHinwK9bwAX_TQxUfIyxVQCd6Pg6KuiaDGmoC-1pYHqVElSzt__vvQsG3ysHtnhBuzt_XJM9J3mecVq1muceV681bgBTFZLOgyLjAdEwBu0enaaJ5BuGcimrGoLS5E9UpoH90NedPXnVV8efFFJbJnrBmbl-0WXzIid-Y3PUBnVsQdqrHgPS9g-4fn-wLa9qL_Bcpt2ZpnQx54FQqo',
      bikeName: 'Trek Domane SL 7',
      customerName: 'Marcus Johnson',
      startTime: 'Tue, Jul 16, 2024, 09:00 AM',
      endTime: 'Tue, Jul 16, 2024, 11:00 AM',
      duration: '2 hours',
      total: '$25',
      status: 'active'
    },
  ];

  const bikes = [
    {
      id: 1,
      name: 'Canyon Ultimate CF SL',
      category: 'Road Bike',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC_0AHoLqAJPUsl_EW0OI0h9P-VRUkpi1N0ndvXl3H4Axo5MVYTEAGHoaVQBCmADkksS0-cUEMImiBDItjRVbUF2a0f1Wj_KwV0mhhViAGbvX148sqHXd2rL5zadH113VxThS_cwvc7s7Z3sY2tUAyrmo9xdhST__hR3jwOyhY8ffqrrvqamJehza1qAq9LWCop-5H7-n7Or4VsLGkkeXswQYpd1xz6u_Ewg1TsRV4Hlav4xyPMTOiR0-YouCT_Z4B7o5Ej2ZhHqyA',
      status: 'available',
      rate: '$12/hr',
      location: 'Station A'
    },
    {
      id: 2,
      name: 'Trek Domane SL 7',
      category: 'Endurance Road',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAwRNKCLbAEBnCZh7ZXXyL768p82vRwbnYoli704Gx52OF-GHc8N3sl9sNOlYHinwK9bwAX_TQxUfIyxVQCd6Pg6KuiaDGmoC-1pYHqVElSzt__vvQsG3ysHtnhBuzt_XJM9J3mecVq1muceV681bgBTFZLOgyLjAdEwBu0enaaJ5BuGcimrGoLS5E9UpoH90NedPXnVV8efFFJbJnrBmbl-0WXzIid-Y3PUBnVsQdqrHgPS9g-4fn-wLa9qL_Bcpt2ZpnQx54FQqo',
      status: 'in-use',
      rate: '$15/hr',
      location: 'Station B'
    },
  ];

  const getStatusColor = (status) => {
    const colors = {
      completed: 'bg-green-100 text-green-800 border-green-200',
      active: 'bg-blue-100 text-blue-800 border-blue-200',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      available: 'bg-green-100 text-green-800 border-green-200',
      'in-use': 'bg-blue-100 text-blue-800 border-blue-200',
      maintenance: 'bg-red-100 text-red-800 border-red-200'
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
              { id: 'bikes', label: 'My Bikes' }
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