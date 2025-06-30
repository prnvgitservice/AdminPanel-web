import React from 'react';
import { Users, UserCheck, Wrench, CreditCard } from 'lucide-react';

const Dashboard: React.FC = () => {
  const stats = [
    { label: 'Users', value: '38', icon: Users, color: 'bg-red-500' },
    { label: 'Providers', value: '87', icon: UserCheck, color: 'bg-red-500' },
    { label: 'Services', value: '226', icon: Wrench, color: 'bg-red-500' },
    { label: 'Subscription', value: '₹333957', icon: CreditCard, color: 'bg-red-500' },
  ];

  const recentBookings = [
    { id: 1, name: 'MOKILA SHANKER YADHAV', date: '05 Aug 2024', service: 'Hardware Service', status: 'Pending', price: '₹0' },
    { id: 2, name: 'Surla Raju', date: '05 Aug 2024', service: 'AC Service', status: 'Pending', price: '₹0' },
    { id: 3, name: 'INDRA RAM', date: '03 Aug 2024', service: 'Repair Service', status: 'Cancelled by User', price: '₹0' },
    { id: 4, name: 'Pujari Chandan', date: '02 Aug 2024', service: 'Plumbing Service', status: 'Pending', price: '₹0' },
    { id: 5, name: 'JAMES GANDHALA', date: '10 Jul 2024', service: 'Electrical Service', status: 'Pending', price: '₹0' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Welcome Admin!</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Bookings</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Services</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 bg-gray-300 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700">
                            {booking.name.charAt(0)}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{booking.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{booking.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{booking.service}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        booking.status === 'Pending' 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{booking.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Payments</h2>
          </div>
          <div className="p-6">
            <div className="text-center text-gray-500">
              <p>No records found</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;