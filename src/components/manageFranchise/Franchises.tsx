import React, { useEffect, useState } from 'react';
import { Filter, Plus, Eye, Trash2 } from 'lucide-react';
import { getAllFranchises } from '../../api/apiMethods';

interface FranchiseProps {
  onAddFranchise?: () => void;
}

interface FranchiseData {
  id: string;
  franchiseId: string;
  username: string;
  buildingName: string;
  phoneNumber: string;
  areaName: string;
  city: string;
  state: string;
  pincode: string;
  joinDate?: string;
  totalTechnicians: number;
}

const Franchise: React.FC<FranchiseProps> = ({ onAddFranchise }) => {
  const [showFilter, setShowFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [franchises, setFranchises] = useState<FranchiseData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    buildingName: '',
    phoneNumber: ''
  });

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentFranchises = franchises.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(franchises.length / itemsPerPage);

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFilterSubmit = () => {
    console.log('Applying filters:', filters);
    setShowFilter(false);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  // Action handlers
  const handleView = (id: string) => {
    console.log(`View franchise with ID: ${id}`);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this franchise?')) {
      console.log(`Delete franchise with ID: ${id}`);
    }
  };

  const fetchAllFranchises = async () => {
    try {
      setLoading(true);
      const response = await getAllFranchises();
      if (response?.franchises) {
        // Add totalTechnicians with default value if not provided
        const franchisesWithTechCount = response.franchises.map(franchise => ({
          ...franchise,
          totalTechnicians: franchise.totalTechnicians || 0
        }));
        setFranchises(franchisesWithTechCount);
      } else {
        setError('Invalid response format');
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch franchises');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllFranchises();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Franchises</h1>
          <div className="flex flex-wrap items-center gap-2">
            <button 
              onClick={() => setShowFilter(!showFilter)}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </button>
            <button 
              onClick={onAddFranchise}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add
            </button>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilter && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8 animate-in slide-in-from-top duration-300">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Franchise Name</label>
                <select
                  value={filters.buildingName}
                  onChange={(e) => handleFilterChange('buildingName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select franchise name</option>
                  {franchises.map(franchise => (
                    <option key={franchise.id} value={franchise.buildingName}>
                      {franchise.username}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mobile No</label>
                <select
                  value={filters.phoneNumber}
                  onChange={(e) => handleFilterChange('phoneNumber', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Mobile No</option>
                  {franchises.map(franchise => (
                    <option key={franchise.id} value={franchise.phoneNumber}>
                      {franchise.phoneNumber}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex justify-center">
              <button
                onClick={handleFilterSubmit}
                className="px-8 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Submit
              </button>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Show</label>
                <select
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                  className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value={8}>8</option>
                  <option value={12}>12</option>
                  <option value={16}>16</option>
                </select>
                <span className="text-sm text-gray-700">entries</span>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Franchise Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Franchise ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mobile No</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Technicians</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center">
                      <div className="flex justify-center items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                      </div>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-red-500">
                      {error}
                    </td>
                  </tr>
                ) : currentFranchises.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                      No franchises found
                    </td>
                  </tr>
                ) : (
                  currentFranchises.map((franchise) => (
                    <tr key={franchise.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">{franchise.username}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">{franchise.franchiseId}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{franchise.phoneNumber}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{franchise.joinDate || "-"}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {franchise.areaName}, {franchise.city}, {franchise.pincode}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {franchise.totalTechnicians}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => handleView(franchise.id)}
                            className="text-blue-600 hover:text-blue-800 transition-colors duration-150"
                            title="View"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(franchise.id)}
                            className="text-red-600 hover:text-red-800 transition-colors duration-150"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
              <span className="font-medium">{Math.min(indexOfLastItem, franchises.length)}</span> of{' '}
              <span className="font-medium">{franchises.length}</span> franchises
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-md ${currentPage === 1 
                  ? 'bg-gray-200 cursor-not-allowed text-gray-500' 
                  : 'bg-white border border-gray-300 hover:bg-gray-100 text-gray-700'}`}
              >
                Previous
              </button>
              
              <div className="flex space-x-1">
                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => handlePageChange(index + 1)}
                    className={`px-3 py-1 rounded-md ${currentPage === index + 1 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-white border border-gray-300 hover:bg-gray-100 text-gray-700'}`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-md ${currentPage === totalPages 
                  ? 'bg-gray-200 cursor-not-allowed text-gray-500' 
                  : 'bg-white border border-gray-300 hover:bg-gray-100 text-gray-700'}`}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Franchise;




// import React, { useEffect, useState } from 'react';
// import { Filter, Plus, Eye, Pencil, Trash2 } from 'lucide-react';
// import { getAllFranchises } from '../../api/apiMethods';

// interface FranchiseProps {
//   onAddFranchise?: () => void;
// }

// interface FranchiseData {
//   id: string;
//   franchiseId: string;
//   buildingName: string;
//   phoneNumber: string;
//   areaName: string;
//   city: string;
//   state: string;
//   pincode: string;
//   totalTechnicians: number; // Added field
// }

// const Franchise: React.FC<FranchiseProps> = ({ onAddFranchise }) => {
//   const [showFilter, setShowFilter] = useState(false);
//   const [franchises, setFranchises] = useState<FranchiseData[]>([]);
//   const [error, setError] = useState<string | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [filters, setFilters] = useState({
//     buildingName: '',
//     phoneNumber: ''
//   });
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 10;

//   // Calculate pagination values
//   const totalPages = Math.ceil(franchises.length / itemsPerPage);
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const endIndex = startIndex + itemsPerPage;
//   const currentFranchises = franchises.slice(startIndex, endIndex);

//   const handleFilterChange = (field: string, value: string) => {
//     setFilters(prev => ({
//       ...prev,
//       [field]: value
//     }));
//   };

//   const handleFilterSubmit = () => {
//     console.log('Applying filters:', filters);
//     setShowFilter(false);
//   };

//   const goToPage = (page: number) => {
//     setCurrentPage(page);
//   };

//   const nextPage = () => {
//     if (currentPage < totalPages) {
//       setCurrentPage(currentPage + 1);
//     }
//   };

//   const prevPage = () => {
//     if (currentPage > 1) {
//       setCurrentPage(currentPage - 1);
//     }
//   };

//   // Action handlers
//   const handleView = (id: string) => {
//     console.log(`View franchise with ID: ${id}`);
//   };

//   const handleEdit = (id: string) => {
//     console.log(`Edit franchise with ID: ${id}`);
//   };

//   const handleDelete = (id: string) => {
//     console.log(`Delete franchise with ID: ${id}`);
//   };

//   const fetchAllFranchises = async () => {
//     try {
//       setLoading(true);
//       const response = await getAllFranchises();
//       if (response?.franchises) {
//         // Add totalTechnicians with default value if not provided
//         const franchisesWithTechCount = response.franchises.map(franchise => ({
//           ...franchise,
//           totalTechnicians: franchise.totalTechnicians || 0
//         }));
//         setFranchises(franchisesWithTechCount);
//       } else {
//         setError('Invalid response format');
//       }
//     } catch (err: any) {
//       setError(err?.message || 'Failed to fetch franchises');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAllFranchises();
//   }, []);

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <h1 className="text-2xl font-bold text-gray-900">Franchises</h1>
//         <div className="flex items-center space-x-2">
//           <button 
//             onClick={() => setShowFilter(!showFilter)}
//             className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
//           >
//             <Filter className="h-4 w-4 mr-2" />
//             Filter
//           </button>
//           <button 
//             onClick={onAddFranchise}
//             className="flex items-center px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl"
//           >
//             <Plus className="h-4 w-4 mr-2" />
//             Add
//           </button>
//         </div>
//       </div>

//       {/* Filter Panel */}
//       {showFilter && (
//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Franchise Name</label>
//               <select
//                 value={filters.buildingName}
//                 onChange={(e) => handleFilterChange('buildingName', e.target.value)}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
//               >
//                 <option value="">Select franchise name</option>
//                 {franchises.map(franchise => (
//                   <option key={franchise.id} value={franchise.buildingName}>
//                     {franchise.buildingName}
//                   </option>
//                 ))}
//               </select>
//             </div>
            
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Mobile No</label>
//               <select
//                 value={filters.phoneNumber}
//                 onChange={(e) => handleFilterChange('phoneNumber', e.target.value)}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
//               >
//                 <option value="">Select Mobile No</option>
//                 {franchises.map(franchise => (
//                   <option key={franchise.id} value={franchise.phoneNumber}>
//                     {franchise.phoneNumber}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>
          
//           <div className="flex justify-center">
//             <button
//               onClick={handleFilterSubmit}
//               className="px-8 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
//             >
//               Submit
//             </button>
//           </div>
//         </div>
//       )}

//       <div className="bg-white rounded-lg shadow-sm border border-gray-200">
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-gray-50 text-left">
//               <tr>
//                 <th className="px-6 py-3 ">Franchise Name</th>
//                 <th className="px-6 py-3 ">Franchise ID</th>
//                 <th className="px-6 py-3 ">Mobile No</th>
//                 <th className="px-6 py-3 ">Join Date</th>
//                 <th className="px-6 py-3 ">Address</th>
//                 <th className="px-6 py-3 ">Total Technicians</th>
//                 <th className="px-6 py-3 ">Action</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {loading ? (
//                 <tr>
//                   <td colSpan={6} className="px-6 py-4 text-center">
//                     <div className="flex justify-center items-center">
//                       <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
//                     </div>
//                   </td>
//                 </tr>
//               ) : error ? (
//                 <tr>
//                   <td colSpan={6} className="px-6 py-4 text-center text-red-500">
//                     {error}
//                   </td>
//                 </tr>
//               ) : currentFranchises.length === 0 ? (
//                 <tr>
//                   <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
//                     No franchises found
//                   </td>
//                 </tr>
//               ) : (
//                 currentFranchises.map((franchise) => (
//                   <tr key={franchise.id} className="hover:bg-gray-50">
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className="text-sm font-medium text-gray-900">{franchise.username}</span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{franchise.franchiseId}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{franchise.phoneNumber}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{franchise.joinDate || "-"}</td>
//                     <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
//                       <div className="line-clamp-2">
//                         {franchise.areaName}, {franchise.city}, {franchise.pincode}
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-center">
//                       <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
//                         {franchise.totalTechnicians}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       <div className="flex space-x-2">
//                         <button 
//                           onClick={() => handleView(franchise.id)}
//                           className="text-blue-600 hover:text-blue-900"
//                           title="View"
//                         >
//                           <Eye className="h-4 w-4" />
//                         </button>
//                         {/* <button 
//                           onClick={() => handleEdit(franchise.id)}
//                           className="text-yellow-600 hover:text-yellow-900"
//                           title="Edit"
//                         >
//                           <Pencil className="h-5 w-5" />
//                         </button> */}
//                         <button 
//                           onClick={() => handleDelete(franchise.id)}
//                           className="text-red-600 hover:text-red-900"
//                           title="Delete"
//                         >
//                           <Trash2 className="h-4 w-4" />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* Pagination */}
//         <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
//           <div className="text-sm text-gray-700">
//             Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
//             <span className="font-medium">{Math.min(endIndex, franchises.length)}</span> of{' '}
//             <span className="font-medium">{franchises.length}</span> franchises
//           </div>
//           <div className="flex items-center space-x-2">
//             <button
//               onClick={prevPage}
//               disabled={currentPage === 1}
//               className={`px-4 py-2 rounded-md ${currentPage === 1 
//                 ? 'bg-gray-200 cursor-not-allowed text-gray-500' 
//                 : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700'}`}
//             >
//               Previous
//             </button>
            
//             <div className="flex space-x-1">
//               {Array.from({ length: totalPages }, (_, index) => (
//                 <button
//                   key={index + 1}
//                   onClick={() => goToPage(index + 1)}
//                   className={`w-10 h-10 flex items-center justify-center rounded-md ${currentPage === index + 1 
//                     ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' 
//                     : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`}
//                 >
//                   {index + 1}
//                 </button>
//               ))}
//             </div>
            
//             <button
//               onClick={nextPage}
//               disabled={currentPage === totalPages}
//               className={`px-4 py-2 rounded-md ${currentPage === totalPages 
//                 ? 'bg-gray-200 cursor-not-allowed text-gray-500' 
//                 : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700'}`}
//             >
//               Next
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Franchise;