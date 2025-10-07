import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Mail, Search } from 'lucide-react';
import { getInTouch } from '../../api/apiMethods';
import debounce from "lodash/debounce";

interface Contact {
  _id: string;
  categoryId: string;
  name: string;
  phoneNumber: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface ApiResponse {
  success: boolean;
  message: string;
  result: Contact[];
}

const GetInTouch: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Debounced fetch function with stable dependencies
  const debouncedFetch = useCallback(
    debounce((offset: number, limit: number) => {
      fetchContacts(offset, limit);
    }, 500),
    []
  );

  // Fetch contacts with improved error handling
  const fetchContacts = useCallback(
    async (offset: number, limit: number) => {
      try {
        setLoading(true);
        setError(null);

        const response: ApiResponse = await getInTouch({ offset, limit });

        if (!response.success) {
          throw new Error(response.message || "Failed to fetch contacts");
        }

        setContacts(response?.result || []);
        setTotal(response?.result?.length || 0);
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

  // Trigger fetch on mount and when params change
  useEffect(() => {
    debouncedFetch(offset, limit);
    return () => debouncedFetch.cancel();
  }, [offset, limit, debouncedFetch]);

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
              <Mail className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Get In Touch
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

        {/* Contacts Table */}
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
                    <th className="px-6 py-3">
                      Requested Date
                    </th>
                    <th className="px-6 py-3 ">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {contacts
                    .filter(
                      (contact) =>
                        contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        contact.phoneNumber.toString().includes(searchTerm)
                    )
                    .slice(offset, offset + limit)
                    .map((contact) => (
                      <tr key={contact._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {contact.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {contact.phoneNumber}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {contact.categoryId || '-'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {formatDate(contact.createdAt)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-4 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              contact.status === "pending"
                                ? "bg-yellow-100 text-yellow-600"
                                : "bg-green-100 text-green-600"
                            }`}
                          >
                            {contact.status}
                          </span>
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
                  <nav
                    className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                    aria-label="Pagination"
                  >
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
      </div>
    </div>
  );
};

export default GetInTouch;




// import React, { useState, useEffect, useCallback } from 'react';
// import { ArrowLeft, User, Search, Eye } from 'lucide-react';
// import { getInTouch } from '../../api/apiMethods';
// import debounce from "lodash/debounce";

// interface Contact {
//   _id: string;
//   categoryId: string;
//   name: string;
//   phoneNumber: number;
//   status: string;
//   createdAt: string;
//   updatedAt: string;
//   __v: number;
// }

// interface ApiResponse {
//   success: boolean;
//   message: string;
//   result: {
//     results: Contact[];
//     total: number;
//   };
// }

// const GetInTouch: React.FC = () => {
//   const [contacts, setContacts] = useState<Contact[]>([]);
//   const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [offset, setOffset] = useState<number>(0);
//   const [limit, setLimit] = useState<number>(10);
//   const [total, setTotal] = useState<number>(0);
//   const [searchTerm, setSearchTerm] = useState<string>("");

//   // Debounced fetch function with stable dependencies
//   const debouncedFetch = useCallback(
//     debounce((offset: number, limit: number) => {
//       fetchContacts(offset, limit);
//     }, 500),
//     [] // Empty dependency array to ensure stability
//   );

//   // Fetch contacts with improved error handling
//   const fetchContacts = useCallback(
//     async (offset: number, limit: number) => {
//       try {
//         setLoading(true);
//         setError(null);

//         const response: ApiResponse = await getInTouch({ offset, limit });
        
//         if (!response.success) {
//           throw new Error(response.message || "Failed to fetch contacts");
//         }

//         setContacts(response?.result || []);
//         setTotal(response.result.total || 0);
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
//     return () => debouncedFetch.cancel(); // Cleanup debounce on unmount
//   }, [offset, limit, debouncedFetch]);

//   // Filter contacts based on search term
//   useEffect(() => {
//     const filtered = contacts.filter((contact) =>
//       contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       contact.phoneNumber.toString().includes(searchTerm) ||
//       contact.status.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//     setFilteredContacts(filtered);
//   }, [contacts, searchTerm]);

//   const formatDate = (dateString: string): string => {
//     try {
//       return new Date(dateString).toLocaleDateString("en-US", {
//         year: "numeric",
//         month: "short",
//         day: "numeric",
//       });
//     } catch {
//       return "Invalid Date";
//     }
//   };

//   const getStatusColor = (status: string) => {
//     switch (status.toLowerCase()) {
//       case 'pending':
//         return 'bg-yellow-100 text-yellow-800 border-yellow-200';
//       case 'completed':
//         return 'bg-green-100 text-green-800 border-green-200';
//       case 'cancelled':
//         return 'bg-red-100 text-red-800 border-red-200';
//       default:
//         return 'bg-gray-100 text-gray-800 border-gray-200';
//     }
//   };

//   // Pagination logic
//   const totalPages = Math.max(1, Math.ceil(total / limit));
//   const currentPage = Math.floor(offset / limit) + 1;

//   // Generate page numbers for pagination
//   const getPageNumbers = () => {
//     const pages: number[] = [];
//     const maxPagesToShow = 5;
//     const startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
//     const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

//     for (let i = startPage; i <= endPage; i++) {
//       pages.push(i);
//     }
//     return pages;
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
//       <div className="max-w-7xl mx-auto">
//         {/* Header Section */}
//         <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
//           <div className="flex items-center gap-3">
//             <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
//               <User className="h-6 w-6 text-white" aria-hidden="true" />
//             </div>
//             <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
//               Get In Touch Contacts
//             </h1>
//           </div>
//         </div>

//         {/* Search and Limit Section */}
//         <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">
//           <div className="flex flex-col md:flex-row gap-4">
//             <div className="relative flex-1">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
//               </div>
//               <input
//                 type="text"
//                 placeholder="Search by name, phone, or status..."
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 aria-label="Search contacts by name, phone, or status"
//               />
//             </div>
//             <div className="flex gap-2">
//               <select
//                 className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 value={limit}
//                 onChange={(e) => {
//                   setLimit(Number(e.target.value));
//                   setOffset(0); // Reset offset when limit changes
//                 }}
//                 aria-label="Select items per page"
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
//           <div
//             className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 flex items-center justify-between"
//             role="alert"
//           >
//             <span>{error}</span>
//             <button
//               onClick={() => fetchContacts(offset, limit)}
//               className="text-sm text-red-600 hover:text-red-800 underline"
//               aria-label="Retry fetching contacts"
//             >
//               Retry
//             </button>
//           </div>
//         )}

//         {/* Loading State with Skeleton */}
//         {loading && (
//           <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
//             <div className="animate-pulse">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-3">
//                       <div className="h-4 bg-gray-200 rounded w-24"></div>
//                     </th>
//                     <th className="px-6 py-3">
//                       <div className="h-4 bg-gray-200 rounded w-24"></div>
//                     </th>
//                     <th className="px-6 py-3">
//                       <div className="h-4 bg-gray-200 rounded w-24"></div>
//                     </th>
//                     <th className="px-6 py-3">
//                       <div className="h-4 bg-gray-200 rounded w-24"></div>
//                     </th>
//                     <th className="px-6 py-3">
//                       <div className="h-4 bg-gray-200 rounded w-24"></div>
//                     </th>
//                     <th className="px-6 py-3">
//                       <div className="h-4 bg-gray-200 rounded w-24"></div>
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {[...Array(Math.min(limit, 10))].map((_, index) => (
//                     <tr key={index}>
//                       <td className="px-6 py-4">
//                         <div className="h-4 bg-gray-200 rounded w-32"></div>
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="h-4 bg-gray-200 rounded w-48"></div>
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="h-4 bg-gray-200 rounded w-64"></div>
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="h-4 bg-gray-200 rounded w-24"></div>
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="h-4 bg-gray-200 rounded w-24"></div>
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="h-4 bg-gray-200 rounded w-24"></div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}

//         {/* Content Table */}
//         {!loading && (
//           <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50 text-left">
//                   <tr>
//                     <th
//                       scope="col"
//                       className="px-6 py-3 text-sm font-medium text-gray-500"
//                     >
//                       Name
//                     </th>
//                     <th
//                       scope="col"
//                       className="px-6 py-3 text-sm font-medium text-gray-500"
//                     >
//                       Phone
//                     </th>
//                     <th
//                       scope="col"
//                       className="px-6 py-3 text-sm font-medium text-gray-500"
//                     >
//                       Status
//                     </th>
//                     <th
//                       scope="col"
//                       className="px-6 py-3 text-sm font-medium text-gray-500"
//                     >
//                       Created
//                     </th>
//                     <th
//                       scope="col"
//                       className="px-6 py-3 text-sm font-medium text-gray-500"
//                     >
//                       Updated
//                     </th>
//                     <th
//                       scope="col"
//                       className="px-6 py-3 text-sm font-medium text-gray-500"
//                     >
//                       Category ID
//                     </th>
//                     <th
//                       scope="col"
//                       className="px-6 py-3 text-sm font-medium text-gray-500"
//                     >
//                       Action
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {filteredContacts.length === 0 && (
//                     <tr>
//                       <td
//                         colSpan={7}
//                         className="px-6 py-4 text-center text-sm text-gray-500"
//                       >
//                         No contacts found.
//                       </td>
//                     </tr>
//                   )}
//                   {filteredContacts.map((contact) => (
//                     <tr key={contact._id} className="hover:bg-gray-50">
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm font-medium text-gray-900">
//                           {contact.name}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm text-gray-900">
//                           {contact.phoneNumber}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span
//                           className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
//                             contact.status
//                           )}`}
//                         >
//                           {contact.status.charAt(0).toUpperCase() + contact.status.slice(1)}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm text-gray-900">
//                           {formatDate(contact.createdAt)}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm text-gray-900">
//                           {formatDate(contact.updatedAt)}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm text-gray-900">
//                           {contact.categoryId.slice(-8)}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                         <div className="flex gap-2">
//                           <button
//                             onClick={() => console.log('View contact:', contact._id)} // Placeholder for view navigation
//                             className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-500"
//                             title="View contact"
//                             aria-label={`View contact for ${contact.name}`}
//                           >
//                             <Eye className="h-5 w-5" aria-hidden="true" />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             {/* Pagination */}
//             <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
//               <div className="flex-1 flex justify-between sm:hidden">
//                 <button
//                   onClick={() => setOffset(Math.max(0, offset - limit))}
//                   disabled={offset === 0}
//                   className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                   aria-label="Previous page"
//                 >
//                   Previous
//                 </button>
//                 <button
//                   onClick={() => setOffset(offset + limit)}
//                   disabled={offset + limit >= total}
//                   className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                   aria-label="Next page"
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
//                       aria-label="Previous page"
//                     >
//                       <span className="sr-only">Previous</span>
//                       <ArrowLeft className="h-5 w-5" aria-hidden="true" />
//                     </button>
//                     {getPageNumbers().map((page) => (
//                       <button
//                         key={page}
//                         onClick={() => setOffset((page - 1) * limit)}
//                         className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium ${
//                           currentPage === page
//                             ? "bg-blue-50 text-blue-600 border-blue-500"
//                             : "text-gray-700 bg-white hover:bg-gray-50"
//                         }`}
//                         aria-label={`Go to page ${page}`}
//                         aria-current={currentPage === page ? "page" : undefined}
//                       >
//                         {page}
//                       </button>
//                     ))}
//                     <button
//                       onClick={() => setOffset(offset + limit)}
//                       disabled={offset + limit >= total}
//                       className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                       aria-label="Next page"
//                     >
//                       <span className="sr-only">Next</span>
//                       <ArrowLeft
//                         className="h-5 w-5 transform rotate-180"
//                         aria-hidden="true"
//                       />
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

// export default GetInTouch;
// // Corrected component code (renamed to GetInTouch for convention, minor fixes for consistency)
// // File: GetInTouch.tsx (or similar)

// import React, { useState, useEffect } from 'react';
// import { getInTouch } from '../../api/apiMethods';
// import { Phone, User, Calendar, Clock, AlertCircle } from 'lucide-react';

// interface Contact {
//   _id: string;
//   categoryId: string;
//   name: string;
//   phoneNumber: number;
//   status: string;
//   createdAt: string;
//   updatedAt: string;
//   __v: number;
// }

// interface ApiResponse {
//   success: boolean;
//   message: string;
//   result: Contact[];
// }

// const GetInTouch: React.FC = () => {
//   const [contacts, setContacts] = useState<Contact[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [offset, setOffset] = useState<number>(1);
//   const [limit, setLimit] = useState<number>(10);

//   useEffect(() => {
//     fetchContacts();
//   }, [offset, limit]);

//   const fetchContacts = async () => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       const response: ApiResponse = await getInTouch({ offset, limit });
      
//       if (response.success) {
//         setContacts(response.result);
//       } else {
//         setError('Failed to fetch contacts');
//       }
//     } catch (err) {
//       setError('An error occurred while fetching contacts');
//       console.error('Error fetching contacts:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   const getStatusColor = (status: string) => {
//     switch (status.toLowerCase()) {
//       case 'pending':
//         return 'bg-yellow-100 text-yellow-800 border-yellow-200';
//       case 'completed':
//         return 'bg-green-100 text-green-800 border-green-200';
//       case 'cancelled':
//         return 'bg-red-100 text-red-800 border-red-200';
//       default:
//         return 'bg-gray-100 text-gray-800 border-gray-200';
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
//           <p className="text-gray-600 font-medium">Loading contacts...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
//         <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
//           <div className="text-center">
//             <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
//             <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
//             <p className="text-gray-600 mb-4">{error}</p>
//             <button
//               onClick={fetchContacts}
//               className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
//             >
//               Try Again
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header */}
//         <div className="text-center mb-8">
//           <h1 className="text-4xl font-bold text-gray-900 mb-4">Get In Touch Contacts</h1>
//           <p className="text-lg text-gray-600 max-w-2xl mx-auto">
//             Manage and view all customer contact requests and inquiries
//           </p>
//         </div>

//         {/* Controls */}
//         <div className="bg-white rounded-lg shadow-md p-6 mb-6">
//           <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
//             <div className="flex items-center gap-4">
//               <div className="flex items-center gap-2">
//                 <label htmlFor="limit" className="text-sm font-medium text-gray-700">
//                   Per Page:
//                 </label>
//                 <select
//                   id="limit"
//                   value={limit}
//                   onChange={(e) => setLimit(Number(e.target.value))}
//                   className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                 >
//                   <option value={5}>5</option>
//                   <option value={10}>10</option>
//                   <option value={20}>20</option>
//                   <option value={50}>50</option>
//                 </select>
//               </div>
//               <div className="flex items-center gap-2">
//                 <label htmlFor="offset" className="text-sm font-medium text-gray-700">
//                   Page:
//                 </label>
//                 <input
//                   id="offset"
//                   type="number"
//                   min="1"
//                   value={offset}
//                   onChange={(e) => setOffset(Number(e.target.value))}
//                   className="border border-gray-300 rounded-md px-3 py-1 w-20 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                 />
//               </div>
//             </div>
//             <button
//               onClick={fetchContacts}
//               className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-sm"
//             >
//               Refresh
//             </button>
//           </div>
//         </div>

//         {/* Contacts Grid */}
//         {contacts.length === 0 ? (
//           <div className="bg-white rounded-lg shadow-md p-12 text-center">
//             <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
//             <h3 className="text-xl font-medium text-gray-900 mb-2">No Contacts Found</h3>
//             <p className="text-gray-500">No contact requests are available at the moment.</p>
//           </div>
//         ) : (
//           <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//             {contacts.map((contact) => (
//               <div
//                 key={contact._id}
//                 className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-200"
//               >
//                 <div className="p-6">
//                   {/* Header */}
//                   <div className="flex items-start justify-between mb-4">
//                     <div className="flex items-center">
//                       <div className="bg-indigo-100 rounded-full p-2 mr-3">
//                         <User className="h-5 w-5 text-indigo-600" />
//                       </div>
//                       <div>
//                         <h3 className="text-lg font-semibold text-gray-900">{contact.name}</h3>
//                       </div>
//                     </div>
//                     <span
//                       className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
//                         contact.status
//                       )}`}
//                     >
//                       {contact.status.charAt(0).toUpperCase() + contact.status.slice(1)}
//                     </span>
//                   </div>

//                   {/* Contact Info */}
//                   <div className="space-y-3">
//                     <div className="flex items-center text-sm text-gray-600">
//                       <Phone className="h-4 w-4 mr-2 text-gray-400" />
//                       <span className="font-medium">{contact.phoneNumber}</span>
//                     </div>

//                     <div className="flex items-center text-sm text-gray-600">
//                       <Calendar className="h-4 w-4 mr-2 text-gray-400" />
//                       <span>Requested Date: {formatDate(contact.createdAt)}</span>
//                     </div>
//                   </div>

//                   {/* Category ID */}
//                   <div className="mt-4 pt-4 border-t border-gray-200">
//                     <p className="text-xs text-gray-500">
//                       Category: <span className="font-mono">{contact.categoryId}</span>
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Footer Info */}
//         <div className="mt-8 text-center">
//           <p className="text-sm text-gray-600">
//             Showing {contacts.length} contacts • Page {offset} • {limit} per page
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default GetInTouch;