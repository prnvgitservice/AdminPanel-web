import React, { useState, useEffect } from "react";
import { ArrowLeft, Briefcase, Search, Eye, Plus, Pencil, Trash, ArrowUpDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCategoryContext } from "../Context/CategoryContext";
import { getServicesByCateId, deleteServiceByAdmin } from "../../api/apiMethods";

// Interface for Service data
interface Service {
  id: string;
  category: string;
  name: string;
  price: number;
  image: string;
  createdAt: string;
}

// Interface for Category (from provided context)
interface Category {
  _id: string;
  category_name: string;
  category_image: string;
  status: number;
  meta_title: string;
  meta_description: string;
  servicesCount: number;
  createdAt: string;
}

const AllServices = () => {
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategoryContext();
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null); // Track deleting service
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [sortField, setSortField] = useState<keyof Service>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const navigate = useNavigate();

  // Set default category when categories are loaded
  useEffect(() => {
    if (categories.length > 0 && !selectedCategory) {
      setSelectedCategory(categories[0]._id);
    }
  }, [categories, selectedCategory]);

  // Fetch services when category, offset, limit, search term, or sort changes
  useEffect(() => {
    if (!selectedCategory) return;

    const fetchServices = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getServicesByCateId(selectedCategory);
        const allServices = response?.result?.length > 0 ? response?.result?.map((service: any) => ({
          id: service._id,
          category: categories.find((cat) => cat._id === service.categoryId)?.category_name || "Unknown",
          name: service.serviceName,
          price: service.servicePrice,
          image: service.serviceImg || "https://via.placeholder.com/150?text=Service",
          createdAt: service.createdAt || new Date().toISOString(),
        })) : [];

        // Filter and sort services
        const filtered = allServices.filter((service) =>
          service.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

        const sorted = filtered.sort((a, b) => {
          const aValue = a[sortField];
          const bValue = b[sortField];
          if (sortField === "price") {
            return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
          }
          return sortOrder === "asc"
            ? String(aValue).localeCompare(String(bValue))
            : String(bValue).localeCompare(String(aValue));
        });

        setTotal(sorted.length);
        setServices(sorted.slice(offset, offset + limit));
        setFilteredServices(sorted);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || "Failed to load services. Please try again.");
        setServices([]);
        setFilteredServices([]);
        setTotal(0);
        setLoading(false);
      }
    };

    fetchServices();
  }, [offset, limit, searchTerm, selectedCategory, categories, sortField, sortOrder]);

  // Delete service
  const handleDeleteService = async (serviceId: string) => {
    if (!window.confirm("Are you sure you want to delete this service?")) return;

    setDeleteLoading(serviceId);
    setError(null);
    try {
      await deleteServiceByAdmin(serviceId);
      setServices(services.filter((service) => service.id !== serviceId));
      setFilteredServices(filteredServices.filter((service) => service.id !== serviceId));
      setTotal((prev) => prev - 1);
      alert("Service deleted successfully!");
    } catch (err: any) {
      setError(err.message || "Failed to delete service. Please try again.");
    } finally {
      setDeleteLoading(null);
    }
  };

  // Toggle sorting
  const handleSort = (field: keyof Service) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
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
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
              <Briefcase className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              All Services
            </h1>
          </div>
          <button
            onClick={() => navigate("/services/add")}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Service
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by service name..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-40 md:w-48 lg:w-64"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                disabled={categoriesLoading}
              >
                {categoriesLoading ? (
                  <option>Loading categories...</option>
                ) : (
                  categories
                    .sort((a, b) => a.category_name.toLowerCase().localeCompare(b.category_name.toLowerCase()))
                    .map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.category_name}
                      </option>
                    ))
                )}
              </select>
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-24 md:w-32 lg:w-40"
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

        {/* Error Messages */}
        {(error || categoriesError) && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error || categoriesError}
          </div>
        )}

        {/* Loading State */}
        {(loading || categoriesLoading) && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Services Table */}
        {!loading && !categoriesLoading && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 text-left">
                  <tr>
                    <th className="px-6 py-3">
                      <button
                        className="flex items-center gap-1 text-gray-500 hover:text-gray-700"
                        onClick={() => handleSort("category")}
                      >
                        Category
                        {sortField === "category" && (
                          <ArrowUpDown className={`h-4 w-4 ${sortOrder === "asc" ? "rotate-0" : "rotate-180"}`} />
                        )}
                      </button>
                    </th>
                    <th className="px-6 py-3">
                      <button
                        className="flex items-center gap-1 text-gray-500 hover:text-gray-700"
                        onClick={() => handleSort("name")}
                      >
                        Service
                        {sortField === "name" && (
                          <ArrowUpDown className={`h-4 w-4 ${sortOrder === "asc" ? "rotate-0" : "rotate-180"}`} />
                        )}
                      </button>
                    </th>
                    <th className="px-6 py-3">
                      <button
                        className="flex items-center gap-1 text-gray-500 hover:text-gray-700"
                        onClick={() => handleSort("price")}
                      >
                        Price
                        {sortField === "price" && (
                          <ArrowUpDown className={`h-4 w-4 ${sortOrder === "asc" ? "rotate-0" : "rotate-180"}`} />
                        )}
                      </button>
                    </th>
                    <th className="px-6 py-3">Image</th>
                    <th className="px-6 py-3">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {services.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center">
                        <p className="text-gray-500 text-lg">
                          There are no services in the{" "}
                          {categories.find((cat) => cat._id === selectedCategory)?.category_name || "selected"} category.
                        </p>
                        <button
                          onClick={() => navigate("/services/add")}
                          className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Create Services
                        </button>
                      </td>
                    </tr>
                  ) : (
                    services.map((service) => (
                      <tr key={service.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {service.category}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{service.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">₹ {service.price}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <img
                            src={service.image}
                            alt={service.name}
                            className="h-10 w-10 rounded object-cover"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() =>
                              navigate(`/services/view/${service.id}`, { state: { service } })
                            }
                            className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                            title="View"
                            disabled={deleteLoading === service.id}
                          >
                            <Eye className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() =>
                              navigate(`/services/edit/${service.id}`, { state: { service } })
                            }
                            className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                            title="Edit"
                            disabled={deleteLoading === service.id}
                          >
                            <Pencil className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteService(service.id)}
                            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                            title="Delete"
                            disabled={deleteLoading === service.id}
                          >
                            {deleteLoading === service.id ? (
                              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-red-500"></div>
                            ) : (
                              <Trash className="h-5 w-5" />
                            )}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination (only shown when services exist) */}
            {services.length > 0 && (
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
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllServices;
// import React, { useState, useEffect } from "react";
// import { ArrowLeft, Briefcase, Search, Eye, Plus, Pencil, Trash, ArrowUpDown } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { useCategoryContext } from "../Context/CategoryContext";
// import { getServicesByCateId, deleteServiceByAdmin } from "../../api/apiMethods";

// // Interface for Service data
// interface Service {
//   id: string;
//   category: string;
//   name: string;
//   price: number;
//   image: string;
//   createdAt: string;
// }

// // Interface for Category (from provided context)
// interface Category {
//   _id: string;
//   category_name: string;
//   category_image: string;
//   status: number;
//   meta_title: string;
//   meta_description: string;
//   servicesCount: number;
//   createdAt: string;
// }

// const AllServices = () => {
//   const { categories, loading: categoriesLoading, error: categoriesError } = useCategoryContext();
//   const [services, setServices] = useState<Service[]>([]);
//   const [filteredServices, setFilteredServices] = useState<Service[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [deleteLoading, setDeleteLoading] = useState<string | null>(null); // Track deleting service
//   const [error, setError] = useState<string | null>(null);
//   const [offset, setOffset] = useState(0);
//   const [limit, setLimit] = useState(10);
//   const [total, setTotal] = useState(0);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState<string>("");
//   const [sortField, setSortField] = useState<keyof Service>("name");
//   const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
//   const navigate = useNavigate();

//   // Set default category when categories are loaded
//   useEffect(() => {
//     if (categories.length > 0 && !selectedCategory) {
//       setSelectedCategory(categories[0]._id);
//     }
//   }, [categories, selectedCategory]);

//   // Fetch services when category, offset, limit, or search term changes
//   useEffect(() => {
//     if (!selectedCategory) return;

//     const fetchServices = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const response = await getServicesByCateId(selectedCategory);

//         if (!response?.result) {
//           setError("No services found for this category.");
//         }

//         const allServices = response?.result?.map((service: any) => ({
//           id: service._id,
//           category: categories.find((cat) => cat._id === service.categoryId)?.category_name || "Unknown",
//           name: service.serviceName,
//           price: service.servicePrice,
//           image: service.serviceImg || "https://via.placeholder.com/150?text=Service",
//           createdAt: service.createdAt || new Date().toISOString(),
//         }));

//         // Filter and sort services
//         const filtered = allServices.filter((service) =>
//           service.name.toLowerCase().includes(searchTerm.toLowerCase())
//         );

//         const sorted = filtered.sort((a, b) => {
//           const aValue = a[sortField];
//           const bValue = b[sortField];
//           if (sortField === "price") {
//             return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
//           }
//           return sortOrder === "asc"
//             ? String(aValue).localeCompare(String(bValue))
//             : String(bValue).localeCompare(String(aValue));
//         });

//         setTotal(sorted.length);
//         const paginated = sorted.slice(offset, offset + limit);
//         setServices(paginated);
//         setFilteredServices(sorted);
//         setLoading(false);
//       } catch (err: any) {
//         setError(err.message || "Failed to load services. Please try again.");
//         setLoading(false);
//       }
//     };

//     fetchServices();
//   }, [offset, limit, searchTerm, selectedCategory, categories, sortField, sortOrder]);

//   // Delete service
//   const handleDeleteService = async (serviceId: string) => {
//     if (!window.confirm("Are you sure you want to delete this service?")) return;

//     setDeleteLoading(serviceId);
//     setError(null);
//     try {
//       await deleteServiceByAdmin(serviceId);
//       setServices(services.filter((service) => service.id !== serviceId));
//       setFilteredServices(filteredServices.filter((service) => service.id !== serviceId));
//       setTotal((prev) => prev - 1);
//       alert("Service deleted successfully!");
//     } catch (err: any) {
//       setError(err.message || "Failed to delete service. Please try again.");
//     } finally {
//       setDeleteLoading(null);
//     }
//   };

//   // Toggle sorting
//   const handleSort = (field: keyof Service) => {
//     if (sortField === field) {
//       setSortOrder(sortOrder === "asc" ? "desc" : "asc");
//     } else {
//       setSortField(field);
//       setSortOrder("asc");
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
//               <Briefcase className="h-6 w-6 text-white" />
//             </div>
//             <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
//               All Services
//             </h1>
//           </div>
//           <button
//             onClick={() => navigate("/services/add")}
//             className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
//           >
//             <Plus className="h-4 w-4 mr-2" />
//             Add Service
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
//                 placeholder="Search by service name..."
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>
//             <div className="flex gap-2">
//               <select
//                 className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-40 md:w-48 lg:w-64"
//                 value={selectedCategory}
//                 onChange={(e) => setSelectedCategory(e.target.value)}
//                 disabled={categoriesLoading}
//               >
//                 {categoriesLoading ? (
//                   <option>Loading categories...</option>
//                 ) : (
//                   categories
//                     .sort((a, b) => a.category_name.toLowerCase().localeCompare(b.category_name.toLowerCase()))
//                     .map((category) => (
//                       <option key={category._id} value={category._id}>
//                         {category.category_name}
//                       </option>
//                     ))
//                 )}
//               </select>
//               <select
//                 className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-24 md:w-32 lg:w-40"
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

//         {/* Error Messages */}
//         {(error || categoriesError) && (
//           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
//             {error || categoriesError}
//           </div>
//         )}

//         {/* Loading State */}
//         {(loading || categoriesLoading) && (
//           <div className="flex justify-center items-center h-64">
//             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//           </div>
//         )}

//         {/* Services Table */}
//         {!loading && !categoriesLoading && (
//           <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50 text-left">
//                   <tr>
//                     <th className="px-6 py-3">
//                       <button
//                         className="flex items-center gap-1 text-gray-500 hover:text-gray-700"
//                         onClick={() => handleSort("category")}
//                       >
//                         Category
//                         {sortField === "category" && (
//                           <ArrowUpDown className={`h-4 w-4 ${sortOrder === "asc" ? "rotate-0" : "rotate-180"}`} />
//                         )}
//                       </button>
//                     </th>
//                     <th className="px-6 py-3">
//                       <button
//                         className="flex items-center gap-1 text-gray-500 hover:text-gray-700"
//                         onClick={() => handleSort("name")}
//                       >
//                         Service
//                         {sortField === "name" && (
//                           <ArrowUpDown className={`h-4 w-4 ${sortOrder === "asc" ? "rotate-0" : "rotate-180"}`} />
//                         )}
//                       </button>
//                     </th>
//                     <th className="px-6 py-3">
//                       <button
//                         className="flex items-center gap-1 text-gray-500 hover:text-gray-700"
//                         onClick={() => handleSort("price")}
//                       >
//                         Price
//                         {sortField === "price" && (
//                           <ArrowUpDown className={`h-4 w-4 ${sortOrder === "asc" ? "rotate-0" : "rotate-180"}`} />
//                         )}
//                       </button>
//                     </th>
//                     <th className="px-6 py-3">Image</th>
//                     <th className="px-6 py-3">Action</th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {services.length < 0 ? (
//                     <tr>
//                       <td colSpan={5} className="px-6 py-4 text-center">
//                         <p className="text-gray-500 text-lg">
//                           There are no services in the{" "}
//                           {categories.find((cat) => cat._id === selectedCategory)?.category_name || "selected"} category.
//                         </p>
//                         <button
//                           onClick={() => navigate("/services/add")}
//                           className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
//                         >
//                           <Plus className="h-4 w-4 mr-2" />
//                           Create Services
//                         </button>
//                       </td>
//                     </tr>
//                   ) : (
//                     services.map((service) => (
//                       <tr key={service.id} className="hover:bg-gray-50">
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="text-sm font-medium text-gray-900">
//                             {service.category}
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="text-sm text-gray-900">{service.name}</div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="text-sm text-gray-900">₹ {service.price}</div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <img
//                             src={service.image}
//                             alt={service.name}
//                             className="h-10 w-10 rounded object-cover"
//                           />
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                           <button
//                             onClick={() =>
//                               navigate(`/services/view/${service.id}`, { state: { service } })
//                             }
//                             className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
//                             title="View"
//                             disabled={deleteLoading === service.id}
//                           >
//                             <Eye className="h-5 w-5" />
//                           </button>
//                           <button
//                             onClick={() =>
//                               navigate(`/services/edit/${service.id}`, { state: { service } })
//                             }
//                             className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
//                             title="Edit"
//                             disabled={deleteLoading === service.id}
//                           >
//                             <Pencil className="h-5 w-5" />
//                           </button>
//                           <button
//                             onClick={() => handleDeleteService(service.id)}
//                             className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
//                             title="Delete"
//                             disabled={deleteLoading === service.id}
//                           >
//                             {deleteLoading === service.id ? (
//                               <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-red-500"></div>
//                             ) : (
//                               <Trash className="h-5 w-5" />
//                             )}
//                           </button>
//                         </td>
//                       </tr>
//                     ))
//                   )}
//                 </tbody>
//               </table>
//             </div>

//             {/* Pagination (only shown when services exist) */}
//             {services.length > 0 && (
//               <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
//                 <div className="flex-1 flex justify-between sm:hidden">
//                   <button
//                     onClick={() => setOffset(Math.max(0, offset - limit))}
//                     disabled={offset === 0}
//                     className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
//                   >
//                     Previous
//                   </button>
//                   <button
//                     onClick={() => setOffset(offset + limit)}
//                     disabled={offset + limit >= total}
//                     className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
//                   >
//                     Next
//                   </button>
//                 </div>
//                 <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
//                   <div>
//                     <p className="text-sm text-gray-700">
//                       Showing <span className="font-medium">{offset + 1}</span> to{" "}
//                       <span className="font-medium">
//                         {Math.min(offset + limit, total)}
//                       </span>{" "}
//                       of <span className="font-medium">{total}</span> results
//                     </p>
//                   </div>
//                   <div>
//                     <nav
//                       className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
//                       aria-label="Pagination"
//                     >
//                       <button
//                         onClick={() => setOffset(Math.max(0, offset - limit))}
//                         disabled={offset === 0}
//                         className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                       >
//                         <span className="sr-only">Previous</span>
//                         <ArrowLeft className="h-5 w-5" />
//                       </button>
//                       <button
//                         onClick={() => setOffset(offset + limit)}
//                         disabled={offset + limit >= total}
//                         className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                       >
//                         <span className="sr-only">Next</span>
//                         <ArrowLeft className="h-5 w-5 transform rotate-180" />
//                       </button>
//                     </nav>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AllServices;

// import React, { useState, useEffect } from "react";
// import { ArrowLeft, Briefcase, Search, Eye, Plus, Pencil, Trash } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { useCategoryContext } from "../Context/CategoryContext";
// import { getServicesByCateId } from "../../api/apiMethods";

// // Interface for Service data
// interface Service {
//   id: string;
//   category: string;
//   name: string;
//   price: number;
//   image: string;
//   technicianName: string;
//   createdAt: string;
// }

// // Interface for Category (from provided context)
// interface Category {
//   _id: string;
//   category_name: string;
//   category_image: string;
//   status: number;
//   meta_title: string;
//   meta_description: string;
//   servicesCount: number;
//   createdAt: string;
// }

// const AllServices = () => {
//   const { categories, loading: categoriesLoading, error: categoriesError } = useCategoryContext();
//   const [services, setServices] = useState<Service[]>([]);
//   const [filteredServices, setFilteredServices] = useState<Service[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [offset, setOffset] = useState(0);
//   const [limit, setLimit] = useState(10);
//   const [total, setTotal] = useState(0);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState<string>("");
//   const navigate = useNavigate();

//   // Set default category when categories are loaded
//   useEffect(() => {
//     if (categories.length > 0 && !selectedCategory) {
//       setSelectedCategory(categories[0]._id); // Set default to first category ID
//     }
//   }, [categories, selectedCategory]);

//   // Fetch services when category, offset, limit, or search term changes
//   useEffect(() => {
//     if (!selectedCategory) return;

//     const fetchServices = async () => {
//       setLoading(true);
//       try {
//         const response = await getServicesByCateId(selectedCategory);
//         const allServices = response?.result?.map((service: any) => ({
//           id: service._id,
//           category: categories.find((cat) => cat._id === service.categoryId)?.category_name || "Unknown",
//           name: service.serviceName,
//           price: service.servicePrice,
//           image: service.serviceImg || "https://via.placeholder.com/150?text=Service",
//           createdAt: service.createdAt || new Date().toISOString(),
//         }));

//         // Filter services based on search term
//         const filtered = allServices.filter(
//           (service) =>
//             service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//             service.technicianName.toLowerCase().includes(searchTerm.toLowerCase())
//         );

//         setTotal(filtered.length);
//         const paginated = filtered.slice(offset, offset + limit);
//         setServices(paginated);
//         setFilteredServices(filtered);
//         setLoading(false);
//       } catch (err: any) {
//         setError(err.message || "Failed to load services");
//         setLoading(false);
//       }
//     };

//     fetchServices();
//   }, [offset, limit, searchTerm, selectedCategory, categories]);

//   // Placeholder delete function (replace with actual API call)
//   const deleteService = async (serviceId: string) => {
//     try {
//       // Assuming you have a deleteService API function
//       // await deleteService(serviceId);
//       // Simulate API call
//       setServices(services.filter((service) => service.id !== serviceId));
//       setFilteredServices(filteredServices.filter((service) => service.id !== serviceId));
//       setTotal((prev) => prev - 1);
//       alert("Service deleted successfully!");
//     } catch (err: any) {
//       setError(err.message || "Failed to delete service");
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
//               <Briefcase className="h-6 w-6 text-white" />
//             </div>
//             <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
//               All Services
//             </h1>
//           </div>
//           <button
//             onClick={() => navigate("/services/add")}
//             className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
//           >
//             <Plus className="h-4 w-4 mr-2" />
//             Add Service
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
//                 placeholder="Search by service name or technician..."
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>
//             <div className="flex gap-2">
//               <select
//                 className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-40 md:w-48 lg:w-64"
//                 value={selectedCategory}
//                 onChange={(e) => setSelectedCategory(e.target.value)}
//                 disabled={categoriesLoading}
//               >
//                 {categoriesLoading ? (
//                   <option>Loading categories...</option>
//                 ) : (
//                   categories
//                     .sort((a, b) => a.category_name.toLowerCase().localeCompare(b.category_name.toLowerCase()))
//                     .map((category) => (
//                       <option key={category._id} value={category._id}>
//                         {category.category_name}
//                       </option>
//                     ))
//                 )}
//               </select>
//               <select
//                 className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-24 md:w-32 lg:w-40"
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

//         {/* Error Messages */}
//         {(error || categoriesError) && (
//           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
//             {error || categoriesError}
//           </div>
//         )}

//         {/* Loading State */}
//         {(loading || categoriesLoading) && (
//           <div className="flex justify-center items-center h-64">
//             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//           </div>
//         )}

//         {/* Empty State */}
//         {!loading && !categoriesLoading && services.length === 0 && (
//           <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 text-center">
//             <p className="text-gray-500 text-lg">
//               No services found for the selected category or search term.
//             </p>
//             <button
//               onClick={() => navigate("/services/add")}
//               className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
//             >
//               <Plus className="h-4 w-4 mr-2" />
//               Add a New Service
//             </button>
//           </div>
//         )}

//         {/* Services Table */}
//         {!loading && !categoriesLoading && services.length > 0 && (
//           <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50 text-left">
//                   <tr>
//                     <th className="px-6 py-3">Category</th>
//                     <th className="px-6 py-3">Service</th>
//                     <th className="px-6 py-3">Price</th>
//                     <th className="px-6 py-3">Image</th>
//                     <th className="px-6 py-3">Action</th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {services.map((service) => (
//                     <tr key={service.id} className="hover:bg-gray-50">
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm font-medium text-gray-900">
//                           {service.category}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm text-gray-900">{service.name}</div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm text-gray-900">₹ {service.price}</div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <img
//                           src={service.image}
//                           alt={service.name}
//                           className="h-10 w-10 rounded object-cover"
//                         />
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                         <button
//                           onClick={() =>
//                             navigate(`/services/view/${service.id}`, { state: { service } })
//                           }
//                           className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
//                           title="View"
//                         >
//                           <Eye className="h-5 w-5" />
//                         </button>
//                         <button
//                           onClick={() =>
//                             navigate(`/services/edit/${service.id}`, { state: { service } })
//                           }
//                           className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
//                           title="Edit"
//                         >
//                           <Pencil className="h-5 w-5" />
//                         </button>
//                         <button
//                           onClick={() => {
//                             if (window.confirm("Are you sure you want to delete this service?")) {
//                               deleteService(service.id);
//                             }
//                           }}
//                           className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
//                           title="Delete"
//                         >
//                           <Trash className="h-5 w-5" />
//                         </button>
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

// export default AllServices;

// import React, { useState, useEffect } from "react";
// import { ArrowLeft, Briefcase, Search, Eye, Plus, Pencil, Trash } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// // Interface for Service data
// interface Service {
//   id: string;
//   category: string;
//   name: string;
//   price: number;
//   image: string;
//   technicianName: string;
//   createdAt: string;
// }

// const AllServices = () => {
//   const [services, setServices] = useState<Service[]>([]);
//   const [filteredServices, setFilteredServices] = useState<Service[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [offset, setOffset] = useState(0);
//   const [limit, setLimit] = useState(10);
//   const [total, setTotal] = useState(0);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("Plumbing");
//   const navigate = useNavigate();

//   // Fake data for services
//   const fakeServices: Service[] = [
//     {
//       id: "1",
//       category: "Plumbing",
//       name: "Pipe Repair",
//       price: 150,
//       image: "https://via.placeholder.com/150?text=Pipe+Repair",
//       technicianName: "John Doe",
//       createdAt: "2025-07-10",
//     },
//     {
//       id: "2",
//       category: "Plumbing",
//       name: "Faucet Installation",
//       price: 200,
//       image: "https://via.placeholder.com/150?text=Faucet+Install",
//       technicianName: "Jane Smith",
//       createdAt: "2025-07-12",
//     },
//     {
//       id: "3",
//       category: "Electrical",
//       name: "Wiring Repair",
//       price: 250,
//       image: "https://via.placeholder.com/150?text=Wiring+Repair",
//       technicianName: "Mike Johnson",
//       createdAt: "2025-07-15",
//     },
//     {
//       id: "4",
//       category: "Electrical",
//       name: "Light Fixture Installation",
//       price: 180,
//       image: "https://via.placeholder.com/150?text=Light+Fixture",
//       technicianName: "Emily Davis",
//       createdAt: "2025-07-18",
//     },
//     {
//       id: "5",
//       category: "Cleaning",
//       name: "Deep Cleaning",
//       price: 300,
//       image: "https://via.placeholder.com/150?text=Deep+Cleaning",
//       technicianName: "Sarah Wilson",
//       createdAt: "2025-07-20",
//     },
//     {
//       id: "6",
//       category: "Cleaning",
//       name: "Carpet Cleaning",
//       price: 120,
//       image: "https://via.placeholder.com/150?text=Carpet+Cleaning",
//       technicianName: "Tom Brown",
//       createdAt: "2025-07-22",
//     },
//   ];

//   // Categories for filter
//   const categories = ["Plumbing", "Electrical", "Cleaning"];

//   useEffect(() => {
//     // Simulate fetching data
//     setLoading(true);
//     setTimeout(() => {
//       try {
//         const filtered = fakeServices.filter(
//           (service) =>
//             service.category === selectedCategory &&
//             (service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//               service.technicianName.toLowerCase().includes(searchTerm.toLowerCase()))
//         );
//         setTotal(filtered.length);
//         const paginated = filtered.slice(offset, offset + limit);
//         setServices(paginated);
//         setFilteredServices(filtered);
//         setLoading(false);
//       } catch (err: any) {
//         setError("Failed to load services");
//         setLoading(false);
//       }
//     }, 500);
//   }, [offset, limit, searchTerm, selectedCategory]);

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
//               <Briefcase className="h-6 w-6 text-white" />
//             </div>
//             <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
//               All Services
//             </h1>
//           </div>
//           <button
//             onClick={() => navigate("/services/add")}
//             className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
//           >
//             <Plus className="h-4 w-4 mr-2" />
//             Add Service
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
//                 placeholder="Search by service name or technician..."
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>
//             <div className="flex gap-2">
//               <select
//                 className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 value={selectedCategory}
//                 onChange={(e) => setSelectedCategory(e.target.value)}
//               >
//                 {categories.map((category) => (
//                   <option key={category} value={category}>
//                     {category}
//                   </option>
//                 ))}
//               </select>
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

//         {/* Services Table */}
//         {!loading && (
//           <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50 text-left">
//                   <tr>
//                     <th className="px-6 py-3">Category</th>
//                     <th className="px-6 py-3">Service</th>
//                     <th className="px-6 py-3">Price</th>
//                     <th className="px-6 py-3">Technician</th>
//                     <th className="px-6 py-3">Image</th>
//                     <th className="px-6 py-3">Action</th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {services.map((service) => (
//                     <tr key={service.id} className="hover:bg-gray-50">
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm font-medium text-gray-900">
//                           {service.category}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm text-gray-900">{service.name}</div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm text-gray-900">${service.price}</div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm text-gray-500">{service.technicianName}</div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <img
//                           src={service.image}
//                           alt={service.name}
//                           className="h-10 w-10 rounded object-cover"
//                         />
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                         <button
//                           onClick={() =>
//                             navigate(`/services/view/${service.id}`, { state: { service } })
//                           }
//                           className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
//                           title="View"
//                         >
//                           <Eye className="h-5 w-5" />
//                         </button>

//                         <button
//                           onClick={() =>
//                             navigate(`/services/edit/${service.id}`, { state: { service } })
//                           }
//                           className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
//                           title="Edit"
//                         >
//                           <Pencil className="h-5 w-5" />
//                         </button>

//                         <button
//                           className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
//                           title="Delete"
//                         >
//                           <Trash className="h-5 w-5" />
//                         </button>
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

// export default AllServices;