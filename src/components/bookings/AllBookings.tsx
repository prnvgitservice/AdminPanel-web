import React, { useState, useEffect } from 'react';
import { ArrowLeft, BookOpen, Search, Eye, X } from 'lucide-react';

interface Booking {
  _id: string;
  userName: string;
  technicianName: string;
  price: number;
  time: string;
  status: string;
  service?: string;
  duration?: number;
  date?: string;
  createdAt: string;
  updatedAt: string;
}

const sampleBookings: Booking[] = [
  {
    _id: "BK001",
    userName: "John Doe",
    technicianName: "Alice Johnson",
    price: 50,
    time: "10:00 AM",
    status: "pending",
    service: "Haircut",
    duration: 30,
    date: "2023-10-01",
    createdAt: "2023-10-01T09:00:00Z",
    updatedAt: "2023-10-01T09:00:00Z"
  },
  {
    _id: "BK002",
    userName: "Jane Smith",
    technicianName: "Bob Wilson",
    price: 75,
    time: "2:00 PM",
    status: "pending",
    service: "Manicure",
    duration: 45,
    date: "2023-10-02",
    createdAt: "2023-10-02T13:00:00Z",
    updatedAt: "2023-10-02T14:00:00Z"
  },
  {
    _id: "BK003",
    userName: "Mike Johnson",
    technicianName: "Alice Johnson",
    price: 100,
    time: "11:30 AM",
    status: "pending",
    service: "Facial",
    duration: 60,
    date: "2023-10-03",
    createdAt: "2023-10-03T10:30:00Z",
    updatedAt: "2023-10-03T10:30:00Z"
  },
  {
    _id: "BK004",
    userName: "Sarah Wilson",
    technicianName: "Bob Wilson",
    price: 60,
    time: "3:00 PM",
    status: "pending",
    service: "Pedicure",
    duration: 40,
    date: "2023-10-04",
    createdAt: "2023-10-04T14:00:00Z",
    updatedAt: "2023-10-04T15:00:00Z"
  },
  {
    _id: "BK005",
    userName: "David Brown",
    technicianName: "Alice Johnson",
    price: 80,
    time: "9:00 AM",
    status: "pending",
    service: "Massage",
    duration: 50,
    date: "2023-10-05",
    createdAt: "2023-10-05T08:00:00Z",
    updatedAt: "2023-10-05T08:00:00Z"
  },
  {
    _id: "BK006",
    userName: "Emily Davis",
    technicianName: "Bob Wilson",
    price: 90,
    time: "1:00 PM",
    status: "pending",
    service: "Hair Coloring",
    duration: 120,
    date: "2023-10-06",
    createdAt: "2023-10-06T12:00:00Z",
    updatedAt: "2023-10-06T14:00:00Z"
  },
  {
    _id: "BK007",
    userName: "Chris Lee",
    technicianName: "Alice Johnson",
    price: 55,
    time: "4:00 PM",
    status: "pending",
    service: "Shave",
    duration: 20,
    date: "2023-10-07",
    createdAt: "2023-10-07T15:00:00Z",
    updatedAt: "2023-10-07T15:00:00Z"
  },
  {
    _id: "BK008",
    userName: "Lisa Garcia",
    technicianName: "Bob Wilson",
    price: 120,
    time: "12:00 PM",
    status: "pending",
    service: "Full Spa",
    duration: 90,
    date: "2023-10-08",
    createdAt: "2023-10-08T11:00:00Z",
    updatedAt: "2023-10-08T13:00:00Z"
  },
  {
    _id: "BK009",
    userName: "Tom Martinez",
    technicianName: "Alice Johnson",
    price: 65,
    time: "10:30 AM",
    status: "pending",
    service: "Nail Polish",
    duration: 35,
    date: "2023-10-09",
    createdAt: "2023-10-09T09:30:00Z",
    updatedAt: "2023-10-09T09:30:00Z"
  },
  {
    _id: "BK010",
    userName: "Anna Rodriguez",
    technicianName: "Bob Wilson",
    price: 70,
    time: "2:30 PM",
    status: "pending",
    service: "Eyebrow Shaping",
    duration: 25,
    date: "2023-10-10",
    createdAt: "2023-10-10T13:30:00Z",
    updatedAt: "2023-10-10T14:00:00Z"
  }
];

const AllBookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>(() => {
    // Load statuses from localStorage or use sampleBookings
    const savedStatuses = localStorage.getItem('bookingStatuses');
    if (savedStatuses) {
      const statuses = JSON.parse(savedStatuses);
      return sampleBookings.map(booking => ({
        ...booking,
        status: statuses[booking._id] || booking.status
      }));
    }
    return sampleBookings;
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);
  const [total] = useState<number>(sampleBookings.length);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);

  // Save status changes to localStorage
  useEffect(() => {
    const statuses = bookings.reduce((acc, booking) => {
      acc[booking._id] = booking.status;
      return acc;
    }, {} as Record<string, string>);
    localStorage.setItem('bookingStatuses', JSON.stringify(statuses));
  }, [bookings]);

  const handleView = (bookingId: string) => {
    const booking = bookings.find(b => b._id === bookingId);
    if (booking) {
      setSelectedBooking(booking);
      setIsViewModalOpen(true);
    }
  };

  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedBooking(null);
  };

  const handleStatusChange = (bookingId: string, currentStatus: string) => {
    if (currentStatus.toLowerCase() === 'pending') {
      setBookings(prevBookings =>
        prevBookings.map(booking =>
          booking._id === bookingId
            ? { ...booking, status: 'completed' }
            : booking
        )
      );
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              All Bookings
            </h1>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by user name or booking ID..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value))}
              >
                <option value={5}>5 per page</option>
                <option value={10}>10 per page</option>
                <option value={20}>20 per page</option>
                <option value={50}>50 per page</option>
              </select>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Bookings Table */}
        {!loading && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 text-left">
                  <tr>
                    <th className="px-6 py-3">Booking ID</th>
                    <th className="px-6 py-3">User</th>
                    <th className="px-6 py-3">Technician</th>
                    <th className="px-6 py-3">Price</th>
                    <th className="px-6 py-3">Time</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bookings
                    .filter(
                      (booking) =>
                        booking.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        booking._id.includes(searchTerm)
                    )
                    .slice(offset, offset + limit)
                    .map((booking) => (
                      <tr key={booking._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{booking._id}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{booking.userName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{booking.technicianName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">${booking.price}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{booking.time}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {booking.status.toLowerCase() === 'pending' ? (
                            <button
                              onClick={() => handleStatusChange(booking._id, booking.status)}
                              className="px-4 py-1 text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-600 hover:bg-yellow-200 transition-colors cursor-pointer"
                            >
                              {booking.status}
                            </button>
                          ) : (
                            <span className="px-4 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-600">
                              {booking.status}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleView(booking._id)}
                              className="text-green-600 hover:text-green-800 transition-colors"
                              title="View"
                            >
                              <Eye className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setOffset(Math.max(0, offset - limit))}
                  disabled={offset === 0}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setOffset(offset + limit)}
                  disabled={offset + limit >= total}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{offset + 1}</span> to{" "}
                    <span className="font-medium">
                      {Math.min(offset + limit, total)}
                    </span>{" "}
                    of <span className="font-medium">{total}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => setOffset(Math.max(0, offset - limit))}
                      disabled={offset === 0}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">Previous</span>
                      <ArrowLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setOffset(offset + limit)}
                      disabled={offset + limit >= total}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">Next</span>
                      <ArrowLeft className="h-5 w-5 transform rotate-180" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* View Modal */}
        {isViewModalOpen && selectedBooking && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Booking Details</h2>
                <button onClick={closeViewModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="p-6">
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50 text-left">
                        <tr>
                          <th className="px-6 py-3">Booking ID</th>
                          <th className="px-6 py-3">Name</th>
                          <th className="px-6 py-3">Technician</th>
                          <th className="px-6 py-3">Price</th>
                          <th className="px-6 py-3">Time</th>
                          <th className="px-6 py-3">Status</th>
                          <th className="px-6 py-3">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{selectedBooking._id}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{selectedBooking.userName}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{selectedBooking.technicianName}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">${selectedBooking.price}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{selectedBooking.time}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {selectedBooking.status.toLowerCase() === 'pending' ? (
                              <button
                                onClick={() => handleStatusChange(selectedBooking._id, selectedBooking.status)}
                                className="px-4 py-1 text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-600 hover:bg-yellow-200 transition-colors cursor-pointer"
                              >
                                {selectedBooking.status}
                              </button>
                            ) : (
                              <span className="px-4 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-600">
                                {selectedBooking.status}
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              {selectedBooking.status.toLowerCase() === 'pending' ? (
                                <button
                                  onClick={() => handleStatusChange(selectedBooking._id, selectedBooking.status)}
                                  className="text-yellow-600 hover:text-yellow-800 transition-colors"
                                  title="Change Status"
                                >
                                  <span className="px-4 py-1 text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-600 hover:bg-yellow-200">
                                    Toggle Status
                                  </span>
                                </button>
                              ) : (
                                <span className="px-4 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-600">
                                  Completed
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex justify-end">
                <button
                  onClick={closeViewModal}
                  className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllBookings;