import React, { useState, useEffect } from "react";
import { ArrowLeft, MapPin, Search, Edit, Trash2, Eye, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getAllPincodes } from "../../api/apiMethods";
import "react-quill/dist/quill.snow.css";

interface SubArea {
  _id: string;
  name: string;
}

interface Area {
  _id: string;
  name: string;
  subAreas: SubArea[];
  pincode?: string;
  state?: string;
  city?: string;
}

interface Pincode {
  _id: string;
  code: string;
  city: string;
  state: string;
  areas: Area[];
  createdAt: string;
  updatedAt: string;
}

interface FetchPincodeResponse {
  success: boolean;
  data: Pincode[];
}

const AllAreas = () => {
  const [pincodes, setPincodes] = useState<Pincode[]>([]);
  const [areaOptions, setAreaOptions] = useState<Area[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedSubAreas, setExpandedSubAreas] = useState<{ [key: string]: boolean }>({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPincodeInfo = async () => {
      try {
        setLoading(true);
        const res: FetchPincodeResponse = await getAllPincodes();
        if (res.success && Array.isArray(res.data)) {
          const filteredData = res.data
          .filter(
            (pincode) =>
              pincode.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
              pincode.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
              pincode.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
              pincode.areas.some(
                (area) =>
                  area.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  area.subAreas.some((sub) =>
                    sub.name.toLowerCase().includes(searchTerm.toLowerCase())
                  )
              )
          );
          setPincodes(filteredData);
          setTotal(filteredData.length);
        } else {
          setError("Failed to fetch pincodes");
        }
      } catch (err) {
        setError("Error fetching pincodes");
      } finally {
        setLoading(false);
      }
    };
    fetchPincodeInfo();
  }, [offset, limit, searchTerm]);

  // Update area options when pincodeData is available
  useEffect(() => {
    const flattenedAreas = pincodes.flatMap((p) =>
      p.areas.map((area) => ({
        ...area,
        pincode: p.code,
        state: p.state,
        city: p.city,
      }))
    );
    setAreaOptions(flattenedAreas);
  }, [pincodes]);

  const handleEdit = (id: string) => {
    const pincode = pincodes.find((p) => p._id === id);
    navigate(`/areas/edit/${id}`, { state: { pincode } });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this pincode?")) {
      try {
        const response = await fetch(
          `https://services-platform-backend.onrender.com/api/pincodes/delete`,
          {
            method: "DELETE",
          }
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to delete pincode");
        }

        const res: FetchPincodeResponse = await getAllPincodes();
        if (res.success && Array.isArray(res.data)) {
          setPincodes(res.data);
          setTotal(res.data.length);
        } else {
          setError("Failed to fetch pincodes after deletion");
        }
      } catch (err: any) {
        setError(err.message);
      }
    }
  };

  const toggleSubAreas = (pincodeId: string) => {
    setExpandedSubAreas((prev) => ({
      ...prev,
      [pincodeId]: !prev[pincodeId],
    }));
  };

  const formatDate: any = (dateString: string) => {
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
              <MapPin className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              All Areas
            </h1>
          </div>
          <button
            onClick={() => navigate("/areas/add")}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Area
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
                placeholder="Search by area, city, pincode, or sub-area..."
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

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {!loading && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 text-left">
                  <tr>
                    <th className="px-6 py-3">Pincode</th>
                    <th className="px-6 py-3">City</th>
                    <th className="px-6 py-3">State</th>
                    <th className="px-6 py-3">Areas</th>
                    <th className="px-6 py-3">Sub-Areas</th>
                    <th className="px-6 py-3">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pincodes.sort((a, b) => Number(a.code) - Number(b.code))
                  .slice(offset, offset + limit)
                  .map((pincode) => {
                    const allSubAreas = pincode.areas.flatMap(
                      (area) => area.subAreas
                    );
                    const isExpanded = expandedSubAreas[pincode._id] || false;
                    const displayedSubAreas = isExpanded
                      ? allSubAreas
                      : allSubAreas.slice(0, 3); // Show up to 3 sub-areas by default

                    return (
                      <tr key={pincode._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {pincode.code}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {pincode.city}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {pincode.state}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {pincode.areas.map((area) => (
                              <div key={area._id} className="mb-1">
                                {area.name}
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {allSubAreas.length > 0 ? (
                              <>
                                {displayedSubAreas.map((sub) => (
                                  <div key={sub._id} className="mb-1">
                                    {sub.name}
                                  </div>
                                ))}
                                {allSubAreas.length > 3 && (
                                  <button
                                    onClick={() => toggleSubAreas(pincode._id)}
                                    className="text-blue-600 hover:text-blue-800 text-sm mt-1 focus:outline-none"
                                  >
                                    {isExpanded ? "View Less" : "Show More"}
                                  </button>
                                )}
                              </>
                            ) : (
                              <div className="text-sm text-gray-500">
                                No sub-areas
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                navigate(`/areas/view/${pincode._id}`, {
                                  state: { pincode },
                                })
                              }
                              className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                              title="View"
                            >
                              <Eye className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() =>
                                navigate(`/areas/edit/${pincode._id}`, {
                                  state: { pincode },
                                })
                              }
                              className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                              title="Edit"
                            >
                              <Edit className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(pincode._id)}
                              className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                              title="Delete"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

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

export default AllAreas;
// import React, { useState, useEffect } from "react";
// import { ArrowLeft, MapPin, Search, Edit, Trash2, Eye, Plus } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import "react-quill/dist/quill.snow.css";
// import { getAllPincodes } from "../../api/apiMethods";

// interface SubArea {
//   _id: string;
//   name: string;
// }

// interface Area {
//   _id: string;
//   name: string;
//   subAreas: SubArea[];
//   pincode?: string;
//   state?: string;
//   city?: string;
// }

// interface Pincode {
//   _id: string;
//   code: string;
//   city: string;
//   state: string;
//   areas: Area[];
//   createdAt: string;
//   updatedAt: string;
// }

// interface FetchPincodeResponse {
//   success: boolean;
//   data: Pincode[];
// }

// const AllAreas = () => {
//   const [pincodes, setPincodes] = useState<Pincode[]>([]);
//   const [areaOptions, setAreaOptions] = useState<Area[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [offset, setOffset] = useState(0);
//   const [limit, setLimit] = useState(10);
//   const [total, setTotal] = useState(0);
//   const [searchTerm, setSearchTerm] = useState("");
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchPincodeInfo = async () => {
//       try {
//         setLoading(true);
//         const res = await getAllPincodes();
//         if (res.success && Array.isArray(res.data)) {
//           const filteredData = res.data.filter((pincode) =>
//             pincode.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
//             pincode.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
//             pincode.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
//             pincode.areas.some((area) =>
//               area.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//               area.subAreas.some((sub) =>
//                 sub.name.toLowerCase().includes(searchTerm.toLowerCase())
//               )
//             )
//           );
//           setPincodes(filteredData);
//           setTotal(filteredData.length); // Adjust if API provides total
//         } else {
//           setError("Failed to fetch pincodes");
//         }
//       } catch (err) {
//         setError("Error fetching pincodes");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchPincodeInfo();
//   }, [offset, limit, searchTerm]);

//   // Update area options when pincodeData is available
//   useEffect(() => {
//     const flattenedAreas = pincodes.flatMap((p) =>
//       p.areas.map((area) => ({
//         ...area,
//         pincode: p.code,
//         state: p.state,
//         city: p.city,
//       }))
//     );
//     setAreaOptions(flattenedAreas);
//   }, [pincodes]);

//   const handleEdit = (id: string) => {
//     const pincode = pincodes.find((p) => p._id === id);
//     navigate(`/areas/add`, { state: { pincode } });
//   };

//   const handleDelete = async (id: string) => {
//     if (window.confirm("Are you sure you want to delete this pincode?")) {
//       try {
//         const response = await fetch(
//           `https://services-platform-backend.onrender.com/api/pincodeData/deletePincode/${id}`,
//           {
//             method: "DELETE",
//           }
//         );
//         const data = await response.json();

//         if (!response.ok) {
//           throw new Error(data.message || "Failed to delete pincode");
//         }

//         const res = await getAllPincodes();
//         if (res.success && Array.isArray(res.data)) {
//           setPincodes(res.data);
//           setTotal(res.data.length);
//         } else {
//           setError("Failed to fetch pincodes after deletion");
//         }
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
//               <MapPin className="h-6 w-6 text-white" />
//             </div>
//             <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
//               All Areas
//             </h1>
//           </div>
//           <button
//             onClick={() => navigate("/areas/add")}
//             className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
//           >
//             <Plus className="h-4 w-4 mr-2" />
//             Add Area
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
//                 placeholder="Search by area, city, pincode, or sub-area..."
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

//         {error && (
//           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
//             {error}
//           </div>
//         )}

//         {loading && (
//           <div className="flex justify-center items-center h-64">
//             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//           </div>
//         )}

//         {!loading && (
//           <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50 text-left">
//                   <tr>
//                     <th className="px-6 py-3">Pincode</th>
//                     <th className="px-6 py-3">City</th>
//                     <th className="px-6 py-3">State</th>
//                     <th className="px-6 py-3">Areas</th>
//                     <th className="px-6 py-3">Sub-Areas</th>
//                     <th className="px-6 py-3">Action</th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {pincodes.slice(offset, offset + limit).map((pincode) => (
//                     <tr key={pincode._id} className="hover:bg-gray-50">
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm font-medium text-gray-900">
//                           {pincode.code}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm text-gray-900">
//                           {pincode.city}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm text-gray-900">
//                           {pincode.state}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="text-sm text-gray-900">
//                           {pincode.areas.map((area) => (
//                             <div key={area._id} className="mb-1">
//                               {area.name}
//                             </div>
//                           ))}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="text-sm text-gray-900">
//                           {pincode.areas.flatMap((area) =>
//                             area.subAreas.length > 0 ? (
//                               area.subAreas.map((sub) => (
//                                 <div key={sub._id} className="mb-1">
//                                   {sub.name}
//                                 </div>
//                               ))
//                             ) : (
//                               <div className="text-sm text-gray-500">
//                                 No sub-areas
//                               </div>
//                             )
//                           )}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                         <div className="flex gap-2">
//                           <button
//                             onClick={() =>
//                               navigate(`/areas/view/${pincode._id}`, {
//                                 state: { pincode },
//                               })
//                             }
//                             className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
//                             title="View"
//                           >
//                             <Eye className="h-5 w-5" />
//                           </button>
//                           <button
//                             onClick={() => handleEdit(pincode._id)}
//                             className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
//                             title="Edit"
//                           >
//                             <Edit className="h-5 w-5" />
//                           </button>
//                           <button
//                             onClick={() => handleDelete(pincode._id)}
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

// export default AllAreas;