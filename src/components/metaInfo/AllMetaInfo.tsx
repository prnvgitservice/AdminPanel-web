import React, { useState, useEffect, useCallback } from "react";
import { ArrowLeft, BookOpen, Search, Edit, Trash2, Eye, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "react-quill/dist/quill.snow.css";
import { deleteCategorySearchDetails, getAllSearchContents } from "../../api/apiMethods";
import debounce from "lodash/debounce";
import { useCategoryContext } from "../Context/CategoryContext";

// Define interface for search content based on API response
interface SearchContent {
  id: string;
  categoryId: string;
  categoryName: string;
  areaName: string;
  city: string;
  state: string;
  pincode: string;
  meta_title: string;
  meta_description: string;
  seo_content: string;
  createdAt: string;
  updatedAt: string;
}

// Define interface for category from CategoryContext
interface Category {
  _id: string;
  category_name: string;
  category_slug: string;
  category_image: string;
  meta_title: string;
  meta_description: string;
  status: number;
  totalviews: number;
  ratings: number | null;
  seo_content: string;
  updatedAt: string;
}

// Define interface for API response to ensure type safety
interface ApiResponse {
  success: boolean;
  message?: string;
  result: {
    results: SearchContent[];
    total: number;
  };
}

const AllMetaInfo = () => {
  const { categories } = useCategoryContext();
  const [searchContents, setSearchContents] = useState<SearchContent[]>([]);
  const [filteredContents, setFilteredContents] = useState<SearchContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // Debounced fetch function with stable dependencies
  const debouncedFetch = useCallback(
    debounce((offset: number, limit: number) => {
      fetchSearchContents(offset, limit);
    }, 500),
    [] // Empty dependency array to ensure stability
  );

  // Fetch search contents with improved error handling
  const fetchSearchContents = useCallback(
    async (offset: number, limit: number) => {
      try {
        setLoading(true);
        setError(null);

        const response: ApiResponse = await getAllSearchContents({ offset, limit });

        if (!response.success) {
          throw new Error(response.message || "Failed to fetch meta information");
        }

        setSearchContents(response.result.results || []);
        setTotal(response.result.total || 0);
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

  // Filter contents by selected category and search term (pincode)
  useEffect(() => {
    let filtered = searchContents;

    // Apply pincode filter
    if (searchTerm) {
      filtered = filtered.filter((content) =>
        content.pincode.includes(searchTerm)
      );
    }

    setFilteredContents(filtered);
  }, [searchContents, searchTerm]);

  // Trigger fetch on mount and when params change
  useEffect(() => {
    debouncedFetch(offset, limit);
    return () => debouncedFetch.cancel(); // Cleanup debounce on unmount
  }, [offset, limit, debouncedFetch]);

  // Handle deletion with correct parameter passing
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this meta information?")) {
      return;
    }

    try {
      setError(null);
      const response = await deleteCategorySearchDetails(id);

      if (!response.success) {
        throw new Error(response.message || "Failed to delete meta information");
      }

      // Refresh data with current parameters
      fetchSearchContents(offset, limit);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to delete. Please try again.";
      setError(errorMessage);
    }
  };

  // Format date for display
  const formatDate = (dateString: string): string => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Invalid Date";
    }
  };

  // Pagination logic
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const currentPage = Math.floor(offset / limit) + 1;

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages: number[] = [];
    const maxPagesToShow = 5;
    const startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  // Handle pincode input validation
  const handleSearchTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numeric values and max length of 6 for pincode
    if (/^\d{0,6}$/.test(value)) {
      setSearchTerm(value);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
              <BookOpen className="h-6 w-6 text-white" aria-hidden="true" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              All Meta Info
            </h1>
          </div>
          <button
            onClick={() => navigate("/meta-info/add")}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Add new meta information"
          >
            <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
            Add Info
          </button>
        </div>

        {/* Search and Limit Section */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                type="text"
                placeholder="Search by pincode..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={handleSearchTermChange}
                aria-label="Search meta information by pincode"
              />
            </div>
            <div className="flex gap-2">
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setOffset(0); // Reset offset when limit changes
                }}
                aria-label="Select items per page"
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
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 flex items-center justify-between"
            role="alert"
          >
            <span>{error}</span>
            <button
              onClick={() => fetchSearchContents(offset, limit)}
              className="text-sm text-red-600 hover:text-red-800 underline"
              aria-label="Retry fetching meta information"
            >
              Retry
            </button>
          </div>
        )}

        {/* Loading State with Skeleton */}
        {loading && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="animate-pulse">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3">
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                    </th>
                    <th className="px-6 py-3">
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                    </th>
                    <th className="px-6 py-3">
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                    </th>
                    <th className="px-6 py-3">
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {[...Array(Math.min(limit, 10))].map((_, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded w-32"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded w-48"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded w-64"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Content Table */}
        {!loading && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 text-left">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-sm font-medium text-gray-500"
                    >
                      Category
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-sm font-medium text-gray-500"
                    >
                      Address
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-sm font-medium text-gray-500"
                    >
                      Meta Title
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-sm font-medium text-gray-500"
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredContents.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-6 py-4 text-center text-sm text-gray-500"
                      >
                        No meta information found.
                      </td>
                    </tr>
                  )}
                  {filteredContents.map((content) => (
                    <tr key={content.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {content.categoryName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{content.city}</div>
                        <div className="text-sm text-gray-500">
                          {content.areaName.trim()} - {content.pincode}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 line-clamp-2">
                          {content.meta_title}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              navigate(`/meta-info/view/${content.id}`, {
                                state: { content },
                              })
                            }
                            className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                            title="View meta information"
                            aria-label={`View meta information for ${content.meta_title}`}
                          >
                            <Eye className="h-5 w-5" aria-hidden="true" />
                          </button>
                          <button
                            onClick={() =>
                              navigate(`/meta-info/edit/${content.id}`, {
                                state: { content },
                              })
                            }
                            className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            title="Edit meta information"
                            aria-label={`Edit meta information for ${content.meta_title}`}
                          >
                            <Edit className="h-5 w-5" aria-hidden="true" />
                          </button>
                          <button
                            onClick={() => handleDelete(content.id)}
                            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
                            title="Delete meta information"
                            aria-label={`Delete meta information for ${content.meta_title}`}
                          >
                            <Trash2 className="h-5 w-5" aria-hidden="true" />
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
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Previous page"
                >
                  Previous
                </button>
                <button
                  onClick={() => setOffset(offset + limit)}
                  disabled={offset + limit >= total}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Next page"
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
                      aria-label="Previous page"
                    >
                      <span className="sr-only">Previous</span>
                      <ArrowLeft className="h-5 w-5" aria-hidden="true" />
                    </button>
                    {getPageNumbers().map((page) => (
                      <button
                        key={page}
                        onClick={() => setOffset((page - 1) * limit)}
                        className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium ${
                          currentPage === page
                            ? "bg-blue-50 text-blue-600 border-blue-500"
                            : "text-gray-700 bg-white hover:bg-gray-50"
                        }`}
                        aria-label={`Go to page ${page}`}
                        aria-current={currentPage === page ? "page" : undefined}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => setOffset(offset + limit)}
                      disabled={offset + limit >= total}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Next page"
                    >
                      <span className="sr-only">Next</span>
                      <ArrowLeft
                        className="h-5 w-5 transform rotate-180"
                        aria-hidden="true"
                      />
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

export default AllMetaInfo;
// import React, { useState, useEffect, useCallback } from "react";
// import { ArrowLeft, BookOpen, Search, Edit, Trash2, Eye, Plus } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import "react-quill/dist/quill.snow.css";
// import { deleteCategorySearchDetails, getAllSearchContents } from "../../api/apiMethods";
// import debounce from "lodash/debounce";

// // Define interface for search content based on API response
// interface SearchContent {
//   id: string;
//   categoryId: string;
//   categoryName: string;
//   areaName: string;
//   city: string;
//   state: string;
//   pincode: string;
//   meta_title: string;
//   meta_description: string;
//   seo_content: string;
//   createdAt: string;
//   updatedAt: string;
// }

// // Define interface for API response to ensure type safety
// interface ApiResponse {
//   success: boolean;
//   message?: string;
//   result: {
//     results: SearchContent[];
//     total: number;
//   };
// }

// const AllMetaInfo = () => {
//   const [searchContents, setSearchContents] = useState<SearchContent[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [offset, setOffset] = useState(0);
//   const [limit, setLimit] = useState(10);
//   const [total, setTotal] = useState(0);
//   const [searchTerm, setSearchTerm] = useState("");
//   const navigate = useNavigate();

//   // Debounced fetch function with stable dependencies
//   const debouncedFetch = useCallback(
//     debounce((offset: number, limit: number, searchTerm: string) => {
//       fetchSearchContents(offset, limit, searchTerm);
//     }, 500),
//     [] // Empty dependency array to ensure stability
//   );

//   // Fetch search contents with improved error handling
//   const fetchSearchContents = useCallback(
//     async (offset: number, limit: number, searchTerm: string) => {
//       try {
//         setLoading(true);
//         setError(null);

//         const response: ApiResponse = await getAllSearchContents({ offset, limit, searchTerm });

//         if (!response.success) {
//           throw new Error(response.message || "Failed to fetch meta information");
//         }

//         setSearchContents(response.result.results || []);
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
//     debouncedFetch(offset, limit, searchTerm);
//     return () => debouncedFetch.cancel(); // Cleanup debounce on unmount
//   }, [offset, limit, searchTerm, debouncedFetch]);

//   // Handle deletion with correct parameter passing
//   const handleDelete = async (id: string) => {
//     if (!window.confirm("Are you sure you want to delete this meta information?")) {
//       return;
//     }

//     try {
//       setError(null);
//       const response = await deleteCategorySearchDetails(id);

//       if (!response.success) {
//         throw new Error(response.message || "Failed to delete meta information");
//       }

//       // Refresh data with current parameters
//       fetchSearchContents(offset, limit, searchTerm);
//     } catch (err: unknown) {
//       const errorMessage =
//         err instanceof Error
//           ? err.message
//           : "Failed to delete. Please try again.";
//       setError(errorMessage);
//     }
//   };

//   // Format date for display
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
//               <BookOpen className="h-6 w-6 text-white" aria-hidden="true" />
//             </div>
//             <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
//               All Meta Info
//             </h1>
//           </div>
//           <button
//             onClick={() => navigate("/meta-info/add")}
//             className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             aria-label="Add new meta information"
//           >
//             <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
//             Add Info
//           </button>
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
//                 placeholder="Search by area, city, pincode, or title..."
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 aria-label="Search meta information by area, city, pincode, or title"
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
//               onClick={() => fetchSearchContents(offset, limit, searchTerm)}
//               className="text-sm text-red-600 hover:text-red-800 underline"
//               aria-label="Retry fetching meta information"
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
//                       Category
//                     </th>
//                     <th
//                       scope="col"
//                       className="px-6 py-3 text-sm font-medium text-gray-500"
//                     >
//                       Address
//                     </th>
//                     <th
//                       scope="col"
//                       className="px-6 py-3 text-sm font-medium text-gray-500"
//                     >
//                       Meta Title
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
//                   {searchContents.length === 0 && (
//                     <tr>
//                       <td
//                         colSpan={4}
//                         className="px-6 py-4 text-center text-sm text-gray-500"
//                       >
//                         No meta information found.
//                       </td>
//                     </tr>
//                   )}
//                   {searchContents.map((content) => (
//                     <tr key={content.id} className="hover:bg-gray-50">
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm font-medium text-gray-900">
//                           {content.categoryName}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm text-gray-900">{content.city}</div>
//                         <div className="text-sm text-gray-500">
//                           {content.areaName.trim()} - {content.pincode}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="text-sm text-gray-900 line-clamp-2">
//                           {content.meta_title}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                         <div className="flex gap-2">
//                           <button
//                             onClick={() =>
//                               navigate(`/meta-info/view/${content.id}`, {
//                                 state: { content },
//                               })
//                             }
//                             className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-500"
//                             title="View meta information"
//                             aria-label={`View meta information for ${content.meta_title}`}
//                           >
//                             <Eye className="h-5 w-5" aria-hidden="true" />
//                           </button>
//                           <button
//                             onClick={() =>
//                               navigate(`/meta-info/edit/${content.id}`, {
//                                 state: { content },
//                               })
//                             }
//                             className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                             title="Edit meta information"
//                             aria-label={`Edit meta information for ${content.meta_title}`}
//                           >
//                             <Edit className="h-5 w-5" aria-hidden="true" />
//                           </button>
//                           <button
//                             onClick={() => handleDelete(content.id)}
//                             className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
//                             title="Delete meta information"
//                             aria-label={`Delete meta information for ${content.meta_title}`}
//                           >
//                             <Trash2 className="h-5 w-5" aria-hidden="true" />
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

// export default AllMetaInfo;

// import React, { useState, useEffect } from "react";
// import { ArrowLeft, BookOpen, Search, Edit, Trash2, Eye, Plus } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import "react-quill/dist/quill.snow.css";

// interface SearchContent {
//   id: string;
//   categoryId: string;
//   categoryName: string;
//   areaName: string;
//   city: string;
//   state: string;
//   pincode: string;
//   meta_title: string;
//   meta_description: string;
//   seo_content: string;
//   createdAt: string;
//   updatedAt: string;
// }

// const AllMetaInfo = () => {
//   const [searchContents, setSearchContents] = useState<SearchContent[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [offset, setOffset] = useState(0);
//   const [limit, setLimit] = useState(10);
//   const [total, setTotal] = useState(0);
//   const [searchTerm, setSearchTerm] = useState("");
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchSearchContents();
//   }, [offset, limit, searchTerm]);

//   const fetchSearchContents = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch(
//         `https://services-platform-backend.onrender.com/api/searchContentData/getAllSearchContents?offset=${offset}&limit=${limit}&search=${searchTerm}`
//       );
//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || "Failed to fetch search contents");
//       }

//       setSearchContents(data.result.results);
//       setTotal(data.result.total);
//     } catch (err: any) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (id: string) => {
//     if (
//       window.confirm("Are you sure you want to delete this search content?")
//     ) {
//       try {
//         const response = await fetch(
//           `https://services-platform-backend.onrender.com/api/searchContentData/deleteCategorySearchDetails/${id}`,
//           {
//             method: "DELETE",
//           }
//         );
//         const data = await response.json();

//         if (!response.ok) {
//           throw new Error(data.message || "Failed to delete search content");
//         }

//         fetchSearchContents();
//       } catch (err: any) {
//         setError(err.message);
//       }
//     }
//   };

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
//         <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
//           <div className="flex items-center gap-3">
//             <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
//               <BookOpen className="h-6 w-6 text-white" />
//             </div>
//             <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
//               All Meta Info
//             </h1>
//           </div>
//           <button
//             onClick={() => navigate("/meta-info/add")}
            
//             className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
//           >
//             <Plus className="h-4 w-4 mr-2" />
//             Add Info
//           </button>
//         </div>

//         <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">
//           <div className="flex flex-col md:flex-row gap-4">
//             <div className="relative flex-1">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <Search className="h-5 w-5 text-gray-400" />
//               </div>
//               <input
//                 type="text"
//                 placeholder="Search by area, city, pincode or title..."
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

//         {/* Content Table */}
//         {!loading && (
//           <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className=" bg-gray-50 text-left">
//                   <tr>
//                     <th className="px-6 py-3 ">
//                       Category
//                     </th>
//                     <th className="px-6 py-3 ">
//                       Address
//                     </th>
//                     <th className="px-6 py-3 ">
//                       Meta Title
//                     </th>
//                     {/* <th className="px-6 py-3">
//                       Created
//                     </th> */}
//                     <th className="px-6 py-3 ">
//                       Action
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {searchContents.map((content) => (
//                     <tr key={content.id} className="hover:bg-gray-50">
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm font-medium text-gray-900">
//                           {content.categoryName}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm text-gray-900">
//                           {content.city},
//                         </div>
//                         <div className="text-sm text-gray-500">
//                           {content.areaName.trim()} - {content.pincode}
//                         </div>
//                         <div className="text-sm text-gray-500">
//                           {content.subAreaName}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="text-sm text-gray-900 line-clamp-2">
//                           {content.meta_title}
//                         </div>
//                       </td>
//                       {/* <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm text-gray-500">
//                           {formatDate(content.createdAt)}
//                         </div>
//                       </td> */}
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                         <div className="flex gap-2">
//                           <button
//                             onClick={() =>
//                               navigate(`/meta-info/view/${content.id}`, { state: { content } })
//                               // navigate(`/view-meta-info/${content}`)
//                             }
//                             className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
//                             title="View"
//                           >
//                             <Eye className="h-5 w-5" />{" "}
//                           </button>
//                           <button
//                             onClick={() => 
//                               navigate(`/meta-info/edit/${content.id}`, { state: { content } })
//                             }
//                             className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
//                             title="Edit"
//                           >
//                             <Edit className="h-5 w-5" />
//                           </button>

//                           <button
//                             onClick={() => handleDelete(content.id)}
//                             className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
//                             title="Delete"
//                           >
//                             <Trash2 className="h-5 w-5" />
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

// export default AllMetaInfo;
