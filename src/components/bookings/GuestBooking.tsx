import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { BookOpen, Search, Eye, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { getAllGuestBookings, updateGuestBookingStatus } from '../../api/apiMethods';

interface GuestBooking {
  _id: string;
  categoryId: string;
  name: string;
  phoneNumber: number;
  status: string;
  categoryName?: string;
  message?: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface ApiResponse {
  success: boolean;
  message: string;
  result: GuestBooking[];
}

const AllGuestBookings: React.FC = () => {
  const [bookings, setBookings] = useState<GuestBooking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [selectedBooking, setSelectedBooking] = useState<GuestBooking | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);

  const handleView = (bookingId: string) => {
    const booking = bookings.find(b => b._id === bookingId);
    if (booking) {
      setSelectedBooking(booking);
      setIsViewModalOpen(true);
    }
  };

  const handleMessage = (bookingId: string) => {
    // Implement message functionality here
    console.log(`Messaging booking with ID: ${bookingId}`);
  };

  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedBooking(null);
  };

  const handleStatusChange = async (bookingId: string, currentStatus: string) => {
    try{
      if(window.confirm("Are you sure you want to mark this booking as completed?")){
        if (currentStatus.toLowerCase() === 'pending') {
          const response = await updateGuestBookingStatus({ bookingId, status: 'completed' });
          if (!response?.success) {
            throw new Error(response?.message || "Failed to update booking status");
          }
          if(response?.success){ 
            alert(response?.message || "Booking status updated to completed.");
            // Refresh bookings to reflect the updated status
            fetchBookings();
          }
        }
      }
    }catch(err){
      console.error("Error updating booking status:", err);
    }
  };

  // Fetch all bookings once on mount
  const fetchBookings = useCallback(
    async () => {
      try {
        setLoading(true);
        setError(null);

        const response = (await getAllGuestBookings({ offset: 0, limit: 10000 })) as ApiResponse;

        if (!response.success) {
          throw new Error(response.message || "Failed to fetch bookings");
        }

        setBookings(response?.result || []);
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "An unexpected error occurred. Please try again.";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Trigger fetch on mount
  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  // Reset offset when search or filter changes
  useEffect(() => {
    setOffset(0);
  }, [searchTerm, statusFilter]);

  const filteredBookings = useMemo(() => {
    return bookings
      .filter((booking) => {
        const matchesSearch =
          booking.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.phoneNumber.toString().includes(searchTerm);
        const matchesStatus =
          statusFilter === 'all' || booking.status.toLowerCase() === statusFilter.toLowerCase();
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [bookings, searchTerm, statusFilter]);

  const total = filteredBookings.length;
  const displayedBookings = filteredBookings.slice(offset, offset + limit);

  const currentPage = useMemo(() => Math.floor(offset / limit) + 1, [offset, limit]);
  const totalPages = useMemo(() => Math.ceil(total / limit), [total, limit]);

  const goToPage = useCallback((page: number) => {
    setOffset((page - 1) * limit);
  }, [limit]);

  const visiblePages = useMemo(() => {
    const pages: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (currentPage > 3) {
        pages.push('...');
      }
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) {
        pages.push('...');
      }
      pages.push(totalPages);
    }
    return pages;
  }, [currentPage, totalPages]);

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
              All Guest Bookings
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
                placeholder="Search by name or phone number..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as 'all' | 'pending' | 'completed')}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
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
                <thead className=" bg-gray-50 text-left">
                  <tr>
                    <th className="px-6 py-3 ">
                      Name
                    </th>
                    <th className="px-6 py-3 ">
                      Phone Number
                    </th>
                    <th className="px-6 py-3 ">
                      Category
                    </th>
                    <th className="px-6 py-3 ">
                      Message
                    </th>
                    <th className="px-6 py-3">
                      Requested Date
                    </th>
                    <th className="px-6 py-3 ">
                      Status
                    </th>
                    <th className="px-6 py-3 ">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {displayedBookings.map((booking) => (
                    <tr key={booking._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {booking.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {booking.phoneNumber}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {booking.categoryName || booking.categoryId || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {booking.message || 'No message'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {formatDate(booking.createdAt)}
                        </div>
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
                          <span
                            className="px-4 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-600"
                          >
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
            {total > 0 && totalPages > 1 && (
              <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
                <div className="flex-1 flex justify-between sm:hidden gap-1">
                  <button
                    onClick={() => goToPage(1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-3 py-2 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    First
                  </button>
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-3 py-2 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-3 py-2 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                  <button
                    onClick={() => goToPage(totalPages)}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-3 py-2 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Last
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">{Math.min(offset + 1, total)}</span> to{" "}
                      <span className="font-medium">
                        {Math.min(offset + limit, total)}
                      </span>{" "}
                      of <span className="font-medium">{total}</span> results
                    </p>
                  </div>
                  <div>
                    <nav
                      className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                      aria-label="Pagination"
                    >
                      {/* First */}
                      <button
                        onClick={() => goToPage(1)}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="sr-only">First</span>
                        <ChevronLeft className="h-5 w-5" />
                        <ChevronLeft className="h-5 w-5 ml-[-2px]" />
                      </button>
                      {/* Previous */}
                      <button
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="sr-only">Previous</span>
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      {/* Page numbers */}
                      {visiblePages.map((page, index) => (
                        <React.Fragment key={index}>
                          {typeof page === 'string' ? (
                            <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500">...</span>
                          ) : (
                            <button
                              onClick={() => goToPage(page)}
                              className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${
                                currentPage === page
                                  ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                  : 'text-gray-500 hover:bg-gray-50'
                              }`}
                            >
                              {page}
                            </button>
                          )}
                        </React.Fragment>
                      ))}
                      {/* Next */}
                      <button
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="sr-only">Next</span>
                        <ChevronRight className="h-5 w-5" />
                      </button>
                      {/* Last */}
                      <button
                        onClick={() => goToPage(totalPages)}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="sr-only">Last</span>
                        <ChevronRight className="h-5 w-5" />
                        <ChevronRight className="h-5 w-5 ml-[-2px]" />
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* View Modal */}
        {isViewModalOpen && selectedBooking && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Booking Details</h2>
                <button
                  onClick={closeViewModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Name</label>
                    <p className="text-base text-gray-900 font-medium">{selectedBooking.name}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Phone Number</label>
                    <p className="text-base text-gray-900 font-medium">{selectedBooking.phoneNumber}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Category</label>
                    <p className="text-base text-gray-900 font-medium">{selectedBooking.categoryName || selectedBooking.categoryId || '-'}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Status</label>
                    <span
                      className={`inline-flex px-4 py-1 text-xs leading-5 font-semibold rounded-full ${
                        selectedBooking.status.toLowerCase() === "pending"
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-green-100 text-green-600"
                      }`}
                    >
                      {selectedBooking.status}
                    </span>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Requested Date</label>
                    <p className="text-base text-gray-900 font-medium">{formatDate(selectedBooking.createdAt)}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Message</label>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <p className="text-base text-gray-900">
                      {selectedBooking.message || 'No message available'}
                    </p>
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

export default AllGuestBookings;
// import React, { useState, useEffect, useCallback } from 'react';
// import { ArrowLeft, BookOpen, Search, Eye, X } from 'lucide-react';
// import { getAllGuestBookings, updateGuestBookingStatus } from '../../api/apiMethods';
// import debounce from "lodash/debounce";

// interface GuestBooking {
//   _id: string;
//   categoryId: string;
//   name: string;
//   phoneNumber: number;
//   status: string;
//   message?: string;
//   createdAt: string;
//   updatedAt: string;
//   __v: number;
// }

// interface ApiResponse {
//   success: boolean;
//   message: string;
//   result: GuestBooking[];
// }

// const AllGuestBookings: React.FC = () => {
//   const [bookings, setBookings] = useState<GuestBooking[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [offset, setOffset] = useState<number>(0);
//   const [limit, setLimit] = useState<number>(10);
//   const [total, setTotal] = useState<number>(0);
//   const [searchTerm, setSearchTerm] = useState<string>("");
//   const [selectedBooking, setSelectedBooking] = useState<GuestBooking | null>(null);
//   const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);

//   const handleView = (bookingId: string) => {
//     const booking = bookings.find(b => b._id === bookingId);
//     if (booking) {
//       setSelectedBooking(booking);
//       setIsViewModalOpen(true);
//     }
//   };

//   const handleMessage = (bookingId: string) => {
//     // Implement message functionality here
//     console.log(`Messaging booking with ID: ${bookingId}`);
//   };

//   const closeViewModal = () => {
//     setIsViewModalOpen(false);
//     setSelectedBooking(null);
//   };

//   const handleStatusChange = async (bookingId: string, currentStatus: string) => {
//     try{

//       if(window.confirm("Are you sure you want to mark this booking as completed?")){
//         if (currentStatus.toLowerCase() === 'pending') {
    
//           const response = await updateGuestBookingStatus({ bookingId, status: 'completed' });
  
//           if (!response.success) {
//             throw new Error(response.message || "Failed to update booking status");
//           }
  
    
//           setBookings(prevBookings =>
//             prevBookings.map(booking =>
//               booking._id === bookingId
//                 ? { ...booking, status: 'completed' }
//                 : booking
//             )
//           );
//         }
//       }

//     }catch(err){
//       console.error("Error updating booking status:", err);
//     }
//   };

//   // Debounced fetch function with stable dependencies
//   const debouncedFetch = useCallback(
//     debounce((offset: number, limit: number) => {
//       fetchBookings(offset, limit);
//     }, 500),
//     []
//   );

//   // Fetch bookings with improved error handling
//   const fetchBookings = useCallback(
//     async (offset: number, limit: number) => {
//       try {
//         setLoading(true);
//         setError(null);

//         const response: ApiResponse = await getAllGuestBookings({ offset, limit });

//         if (!response.success) {
//           throw new Error(response.message || "Failed to fetch bookings");
//         }

//         setBookings(response?.result || []);
//         setTotal(response?.result?.length || 0);
//       } catch (err: unknown) {
//         const errorMessage =
//           err instanceof Error
//             ? err.message
//             : "An unexpected error occurred. Please try again.";
//         setError(errorMessage);
//       } finally {
//         setLoading(false);
//       }
//     },
//     []
//   );

//   // Trigger fetch on mount and when params change
//   useEffect(() => {
//     debouncedFetch(offset, limit);
//     return () => debouncedFetch.cancel();
//   }, [offset, limit, debouncedFetch]);

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//     });
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
//           <div className="flex items-center gap-3">
//             <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
//               <BookOpen className="h-6 w-6 text-white" />
//             </div>
//             <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
//               All Guest Bookings
//             </h1>
//           </div>
//         </div>

//         {/* Search and Filter */}
//         <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">
//           <div className="flex flex-col md:flex-row gap-4">
//             <div className="relative flex-1">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <Search className="h-5 w-5 text-gray-400" />
//               </div>
//               <input
//                 type="text"
//                 placeholder="Search by name or phone number..."
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>
//             <div className="flex gap-2">
//               <select
//                 className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 value={limit}
//                 onChange={(e) => setLimit(Number(e.target.value))}
//               >
//                 <option value={5}>5 per page</option>
//                 <option value={10}>10 per page</option>
//                 <option value={20}>20 per page</option>
//                 <option value={50}>50 per page</option>
//               </select>
//             </div>
//           </div>
//         </div>

//         {/* Error Message */}
//         {error && (
//           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
//             {error}
//           </div>
//         )}

//         {/* Loading State */}
//         {loading && (
//           <div className="flex justify-center items-center h-64">
//             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//           </div>
//         )}

//         {/* Bookings Table */}
//         {!loading && (
//           <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className=" bg-gray-50 text-left">
//                   <tr>
//                     <th className="px-6 py-3 ">
//                       Name
//                     </th>
//                     <th className="px-6 py-3 ">
//                       Phone Number
//                     </th>
//                     <th className="px-6 py-3 ">
//                       Category
//                     </th>
//                     <th className="px-6 py-3 ">
//                       Message
//                     </th>
//                     <th className="px-6 py-3">
//                       Requested Date
//                     </th>
//                     <th className="px-6 py-3 ">
//                       Status
//                     </th>
//                     <th className="px-6 py-3 ">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {bookings
//                     .filter(
//                       (booking) =>
//                         booking.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                         booking.phoneNumber.toString().includes(searchTerm)
//                     )
//                     .slice(offset, offset + limit)
//                     .map((booking) => (
//                       <tr key={booking._id} className="hover:bg-gray-50">
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="text-sm font-medium text-gray-900">
//                             {booking.name}
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="text-sm text-gray-900">
//                             {booking.phoneNumber}
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="text-sm text-gray-900">
//                             {booking.categoryId || '-'}
//                           </div>
//                         </td>
//                         <td className="px-6 py-4">
//                           <div className="text-sm text-gray-900">
//                             {booking.message || 'No message'}
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="text-sm text-gray-500">
//                             {formatDate(booking.createdAt)}
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           {booking.status.toLowerCase() === 'pending' ? (
//                             <button
//                               onClick={() => handleStatusChange(booking._id, booking.status)}
//                               className="px-4 py-1 text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-600 hover:bg-yellow-200 transition-colors cursor-pointer"
//                             >
//                               {booking.status}
//                             </button>
//                           ) : (
//                             <span
//                               className="px-4 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-600"
//                             >
//                               {booking.status}
//                             </span>
//                           )}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="flex items-center gap-3">
//                             <button
//                               onClick={() => handleView(booking._id)}
//                               className="text-green-600 hover:text-green-800 transition-colors"
//                               title="View"
//                             >
//                               <Eye className="h-5 w-5" />
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                 </tbody>
//               </table>
//             </div>

//             {/* Pagination */}
//             <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
//               <div className="flex-1 flex justify-between sm:hidden">
//                 <button
//                   onClick={() => setOffset(Math.max(0, offset - limit))}
//                   disabled={offset === 0}
//                   className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
//                 >
//                   Previous
//                 </button>
//                 <button
//                   onClick={() => setOffset(offset + limit)}
//                   disabled={offset + limit >= total}
//                   className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
//                 >
//                   Next
//                 </button>
//               </div>
//               <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
//                 <div>
//                   <p className="text-sm text-gray-700">
//                     Showing <span className="font-medium">{offset + 1}</span> to{" "}
//                     <span className="font-medium">
//                       {Math.min(offset + limit, total)}
//                     </span>{" "}
//                     of <span className="font-medium">{total}</span> results
//                   </p>
//                 </div>
//                 <div>
//                   <nav
//                     className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
//                     aria-label="Pagination"
//                   >
//                     <button
//                       onClick={() => setOffset(Math.max(0, offset - limit))}
//                       disabled={offset === 0}
//                       className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                     >
//                       <span className="sr-only">Previous</span>
//                       <ArrowLeft className="h-5 w-5" />
//                     </button>
//                     <button
//                       onClick={() => setOffset(offset + limit)}
//                       disabled={offset + limit >= total}
//                       className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                     >
//                       <span className="sr-only">Next</span>
//                       <ArrowLeft className="h-5 w-5 transform rotate-180" />
//                     </button>
//                   </nav>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* View Modal */}
//         {isViewModalOpen && selectedBooking && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//             <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//               <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
//                 <h2 className="text-xl font-bold text-gray-900">Booking Details</h2>
//                 <button
//                   onClick={closeViewModal}
//                   className="text-gray-400 hover:text-gray-600 transition-colors"
//                 >
//                   <X className="h-6 w-6" />
//                 </button>
//               </div>

//               <div className="p-6 space-y-6">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-500 mb-1">Name</label>
//                     <p className="text-base text-gray-900 font-medium">{selectedBooking.name}</p>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-500 mb-1">Phone Number</label>
//                     <p className="text-base text-gray-900 font-medium">{selectedBooking.phoneNumber}</p>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-500 mb-1">Category</label>
//                     <p className="text-base text-gray-900 font-medium">{selectedBooking.categoryId || '-'}</p>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-500 mb-1">Status</label>
//                     <span
//                       className={`inline-flex px-4 py-1 text-xs leading-5 font-semibold rounded-full ${
//                         selectedBooking.status.toLowerCase() === "pending"
//                           ? "bg-yellow-100 text-yellow-600"
//                           : "bg-green-100 text-green-600"
//                       }`}
//                     >
//                       {selectedBooking.status}
//                     </span>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-500 mb-1">Requested Date</label>
//                     <p className="text-base text-gray-900 font-medium">{formatDate(selectedBooking.createdAt)}</p>
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-500 mb-1">Message</label>
//                   <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
//                     <p className="text-base text-gray-900">
//                       {selectedBooking.message || 'No message available'}
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex justify-end">
//                 <button
//                   onClick={closeViewModal}
//                   className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AllGuestBookings;








// import React, { useState, useEffect } from "react";
// import { ArrowLeft, BookOpen, Search, Edit, Trash2, Eye, Plus } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { getAllGuestBookings } from "../../api/apiMethods";

// interface GuestBooking {
//   _id: string;
//   categoryId: string;
//   name: string;
//   phoneNumber: number;
//   status: string;
//   createdAt: string;
//   updatedAt: string;
// }

// const AllGuestBookings = () => {
//   const [bookings, setBookings] = useState<GuestBooking[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [offset, setOffset] = useState(0);
//   const [limit, setLimit] = useState(10);
//   const [total, setTotal] = useState(0);
//   const [searchTerm, setSearchTerm] = useState("");
//   const navigate = useNavigate();

//   useEffect(() => {
//     // Simulate fetching data (replace with actual API call)
//     const fetchBookings = async () => {
//       try {
//         setLoading(true);
//         // Mock data - replace with actual API endpoint
//         const response = await getAllGuestBookings()
//         setBookings(response?.result);
//         setTotal(response?.result?.length);
//       } catch (err: any) {
//         setError(err.message || "Failed to fetch bookings");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBookings();
//   }, [offset, limit, searchTerm]);

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//     });
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
//           <div className="flex items-center gap-3">
//             <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
//               <BookOpen className="h-6 w-6 text-white" />
//             </div>
//             <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
//               All Guest Bookings
//             </h1>
//           </div>
//         </div>

//         {/* Search and Filter */}
//         <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">
//           <div className="flex flex-col md:flex-row gap-4">
//             <div className="relative flex-1">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <Search className="h-5 w-5 text-gray-400" />
//               </div>
//               <input
//                 type="text"
//                 placeholder="Search by name or phone number..."
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>
//             <div className="flex gap-2">
//               <select
//                 className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 value={limit}
//                 onChange={(e) => setLimit(Number(e.target.value))}
//               >
//                 <option value={5}>5 per page</option>
//                 <option value={10}>10 per page</option>
//                 <option value={20}>20 per page</option>
//                 <option value={50}>50 per page</option>
//               </select>
//             </div>
//           </div>
//         </div>

//         {/* Error Message */}
//         {error && (
//           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
//             {error}
//           </div>
//         )}

//         {/* Loading State */}
//         {loading && (
//           <div className="flex justify-center items-center h-64">
//             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//           </div>
//         )}

//         {/* Bookings Table */}
//         {!loading && (
//           <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className=" bg-gray-50 text-left">
//                   <tr>
//                     <th className="px-6 py-3 ">
//                       Name
//                     </th>
//                     <th className="px-6 py-3 ">
//                       Phone Number
//                     </th>
//                     <th className="px-6 py-3 ">
//                       Category
//                     </th>
//                     <th className="px-6 py-3">
//                       Requested Date
//                     </th>
//                     <th className="px-6 py-3 ">
//                       Status
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {bookings
//                     .filter(
//                       (booking) =>
//                         booking.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                         booking.phoneNumber.toString().includes(searchTerm)
//                     )
//                     .slice(offset, offset + limit)
//                     .map((booking) => (
//                       <tr key={booking._id} className="hover:bg-gray-50">
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="text-sm font-medium text-gray-900">
//                             {booking.name}
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="text-sm text-gray-900">
//                             {booking.phoneNumber}
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="text-sm text-gray-900">
//                             {booking.categoryId || '-'}
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="text-sm text-gray-500">
//                             {formatDate(booking.createdAt)}
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <span
//                             className={`px-4 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                               booking.status === "pending"
//                                 ? "bg-yellow-100 text-yellow-600"
//                                 : "bg-green-100 text-green-600"
//                             }`}
//                           >
//                             {booking.status}
//                           </span>
//                         </td>
//                       </tr>
//                     ))}
//                 </tbody>
//               </table>
//             </div>

//             {/* Pagination */}
//             <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
//               <div className="flex-1 flex justify-between sm:hidden">
//                 <button
//                   onClick={() => setOffset(Math.max(0, offset - limit))}
//                   disabled={offset === 0}
//                   className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
//                 >
//                   Previous
//                 </button>
//                 <button
//                   onClick={() => setOffset(offset + limit)}
//                   disabled={offset + limit >= total}
//                   className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
//                 >
//                   Next
//                 </button>
//               </div>
//               <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
//                 <div>
//                   <p className="text-sm text-gray-700">
//                     Showing <span className="font-medium">{offset + 1}</span> to{" "}
//                     <span className="font-medium">
//                       {Math.min(offset + limit, total)}
//                     </span>{" "}
//                     of <span className="font-medium">{total}</span> results
//                   </p>
//                 </div>
//                 <div>
//                   <nav
//                     className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
//                     aria-label="Pagination"
//                   >
//                     <button
//                       onClick={() => setOffset(Math.max(0, offset - limit))}
//                       disabled={offset === 0}
//                       className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                     >
//                       <span className="sr-only">Previous</span>
//                       <ArrowLeft className="h-5 w-5" />
//                     </button>
//                     <button
//                       onClick={() => setOffset(offset + limit)}
//                       disabled={offset + limit >= total}
//                       className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                     >
//                       <span className="sr-only">Next</span>
//                       <ArrowLeft className="h-5 w-5 transform rotate-180" />
//                     </button>
//                   </nav>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AllGuestBookings;