import React from 'react';

function BikeRentalsDashboard(){
  const rentals = [
    {
      id: 1,
      bikeImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC_0AHoLqAJPUsl_EW0OI0h9P-VRUkpi1N0ndvXl3H4Axo5MVYTEAGHoaVQBCmADkksS0-cUEMImiBDItjRVbUF2a0f1Wj_KwV0mhhViAGbvX148sqHXd2rL5zadH113VxThS_cwvc7s7Z3sY2tUAyrmo9xdhST__hR3jwOyhY8ffqrrvqamJehza1qAq9LWCop-5H7-n7Or4VsLGkkeXswQYpd1xz6u_Ewg1TsRV4Hlav4xyPMTOiR0-YouCT_Z4B7o5Ej2ZhHqyA',
      startTime: 'Mon, Jul 15, 2024, 10:00 AM',
      endTime: 'Mon, Jul 15, 2024, 12:00 PM',
      total: '$20'
    },
    {
      id: 2,
      bikeImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAwRNKCLbAEBnCZh7ZXXyL768p82vRwbnYoli704Gx52OF-GHc8N3sl9sNOlYHinwK9bwAX_TQxUfIyxVQCd6Pg6KuiaDGmoC-1pYHqVElSzt__vvQsG3ysHtnhBuzt_XJM9J3mecVq1muceV681bgBTFZLOgyLjAdEwBu0enaaJ5BuGcimrGoLS5E9UpoH90NedPXnVV8efFFJbJnrBmbl-0WXzIid-Y3PUBnVsQdqrHgPS9g-4fn-wLa9qL_Bcpt2ZpnQx54FQqo',
      startTime: 'Tue, Jul 16, 2024, 09:00 AM',
      endTime: 'Tue, Jul 16, 2024, 11:00 AM',
      total: '$25'
    },
    {
      id: 3,
      bikeImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCtX8xSwP77vcZDXZQk3R-ohwKaD6fteYnlMztEEwHwpnfvCdGgzXJdgQskJClJEwrfzBM72UuuikavhhwsDN6zBoqp-0Ywoe_hzYWNuLi3rmP5mkVi76D9yMWIXCcSFZrO_QR9GiEa7Lx8qlBgKsOzHXOVVzEFWJxferRIZgRRHZXmcIAMTWhbWhTcbTWlxawJvnV24NLcOrQ5N9Bp0j4RTjpbqvUq_BAcxhTlrsMMfxKM-RxPecK8JpB6hkgSa-EBeL-dl9bKrF0',
      startTime: 'Wed, Jul 17, 2024, 08:00 AM',
      endTime: 'Wed, Jul 17, 2024, 10:00 AM',
      total: '$30'
    }
  ];

  return (
    <div className="min-h-screen max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Your Bike Rentals</h1>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bike</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rental Period</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {rentals.map((rental) => (
              <tr key={rental.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <img className="h-10 w-10 rounded-full" src={rental.bikeImage} alt="Bike" />
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{rental.startTime}</div>
                  <div className="text-sm text-gray-500">to {rental.endTime}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {rental.total}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BikeRentalsDashboard;