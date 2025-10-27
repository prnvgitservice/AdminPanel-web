// components/GuestBookings.tsx
import React, { useState, useEffect } from 'react';
import { Booking, RecentGuestBookingsResponse } from '../../pages/Dashboard';
import { getRecentGuestBookingDashboard } from '../../api/apiMethods';

const GuestBookings: React.FC = () => {
  const [guestBookings, setGuestBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const guestBookingsResponse = await getRecentGuestBookingDashboard({}) as RecentGuestBookingsResponse;
        if (guestBookingsResponse.success) {
          const formattedGuestBookings: Booking[] = guestBookingsResponse.result.bookings
            .map((booking) => ({
              id: booking._id,
              name: booking.name,
              date: new Date(booking.createdAt).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              }),
              service: booking.categoryName,
              status: booking.status.charAt(0).toUpperCase() + booking.status.slice(1),
              createdAt: booking.createdAt,
            }))
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setGuestBookings(formattedGuestBookings);
        } else {
          setError('Failed to fetch guest bookings');
        }
      } catch (error) {
        setError('Error fetching guest bookings');
        console.error('Error fetching guest bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="text-center p-4">Loading guest bookings...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-600">{error}</div>;
  }

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-6 py-4">
        <h2 className="text-lg font-semibold text-white">Guest Bookings</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Service
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {guestBookings.map((booking) => (
              <tr key={booking.id} className="hover:bg-slate-50/50 transition-colors duration-150">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-sm font-medium text-white">{booking.name.charAt(0)}</span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-slate-900">{booking.name}</div>
                      <div className="text-sm text-slate-500">{booking.date}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{booking.service}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                      booking.status === 'Completed'
                        ? 'bg-green-100 text-green-800'
                        : booking.status === 'In Progress'
                        ? 'bg-blue-100 text-blue-800'
                        : booking.status === 'Pending'
                        ? 'bg-amber-100 text-amber-800'
                        : booking.status === 'Upcoming'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {booking.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GuestBookings;