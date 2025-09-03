import React, { useEffect, useState } from 'react';
import { Filter, Plus, Eye, Pencil, Trash2 } from 'lucide-react';
import { getAllExecutives } from "../../api/apiMethods"; 

interface ExecutiveProps {
  onAddExecutive?: () => void;
}

interface ExecutiveData {
  id: string;
  executiveId: string;
  executivename: string;
  phoneNumber: string;
  role: string;
  buildingName: string;
  areaName: string;
  city: string;
  state: string;
  pincode: string;
  profileImage?: string;
}

const AllExecutives: React.FC<ExecutiveProps> = ({ onAddExecutive }) => {
  const [showFilter, setShowFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [executives, setExecutives] = useState<ExecutiveData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    executivename: '',
    phoneNumber: ''
  });
  const [totalItems, setTotalItems] = useState(0);

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentExecutives = executives.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFilterSubmit = () => {
    console.log('Applying filters:', filters);
    setShowFilter(false);
    fetchAllExecutives(); // Re-fetch with filters
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchAllExecutives(page, itemsPerPage);
  };

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newItemsPerPage = Number(e.target.value);
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
    fetchAllExecutives(1, newItemsPerPage);
  };

  // Action handlers
  const handleView = (id: string) => {
    console.log(`View executive with ID: ${id}`);
  };

  const handleEdit = (id: string) => {
    console.log(`Edit executive with ID: ${id}`);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this executive?')) {
      console.log(`Delete executive with ID: ${id}`);
    }
  };

  const fetchAllExecutives = async (page: number = currentPage, limit: number = itemsPerPage) => {
    try {
      setLoading(true);
      const offset = (page - 1) * limit;
      const response = await getAllExecutives({ offset, limit });
      if (response?.success && response?.executives) {
        setExecutives(response.executives);
        setTotalItems(response.total);
      } else {
        setError('Invalid response format');
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch executives');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllExecutives();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Executives</h1>
          <div className="flex flex-wrap items-center gap-2">
            <button 
              onClick={() => setShowFilter(!showFilter)}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </button>
            <button 
              onClick={onAddExecutive}
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Executive Name</label>
                <select
                  value={filters.executivename}
                  onChange={(e) => handleFilterChange('executivename', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select executive name</option>
                  {executives.map(executive => (
                    <option key={executive.id} value={executive.executivename}>
                      {executive.executivename}
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
                  {executives.map(executive => (
                    <option key={executive.id} value={executive.phoneNumber}>
                      {executive.phoneNumber}
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Executive Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Executive ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone Number</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center">
                      <div className="flex justify-center items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                      </div>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-red-500">
                      {error}
                    </td>
                  </tr>
                ) : currentExecutives.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      No executives found
                    </td>
                  </tr>
                ) : (
                  currentExecutives.map((executive) => (
                    <tr key={executive.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">{executive.executivename}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">{executive.executiveId}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{executive.phoneNumber}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{executive.role}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 max-w-xs">
                        <div className="truncate">{`${executive.buildingName}, ${executive.areaName}, ${executive.city}, ${executive.state} ${executive.pincode}`}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => handleEdit(executive.id)}
                            className="text-blue-600 hover:text-blue-800 transition-colors duration-150"
                            title="Edit"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleView(executive.id)}
                            className="text-green-600 hover:text-green-800 transition-colors duration-150"
                            title="View"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(executive.id)}
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
              <span className="font-medium">{Math.min(indexOfLastItem, totalItems)}</span> of{' '}
              <span className="font-medium">{totalItems}</span> executives
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

export default AllExecutives;






// import React, { useEffect, useState } from 'react';
// import { Filter, Plus, Eye, Pencil, Trash2 } from 'lucide-react';

// interface ExecutiveProps {
//   onAddExecutive?: () => void;
// }

// interface ExecutiveData {
//   id: string;
//   executiveId: string;
//   executiveName: string;
//   mobileNumber: string;
//   joinDate: string;
//   address: string;
//   totalExecutives: number;
// }

// // Mock API service function
// const getAllExecutives = async () => {
//   return new Promise<{ executives: ExecutiveData[] }>((resolve) => {
//     setTimeout(() => {
//       resolve({
//         executives: [
//           {
//             id: '1',
//             executiveId: 'EX-001',
//             executiveName: 'John Smith',
//             mobileNumber: '9876543210',
//             joinDate: '15-01-2024',
//             address: '123 Business District, Mumbai, 400001',
//             totalExecutives: 5
//           },
//           {
//             id: '2',
//             executiveId: 'EX-002',
//             executiveName: 'Sarah Johnson',
//             mobileNumber: '8765432109',
//             joinDate: '22-02-2024',
//             address: '456 Corporate Ave, Delhi, 110001',
//             totalExecutives: 8
//           },
//           {
//             id: '3',
//             executiveId: 'EX-003',
//             executiveName: 'Michael Chen',
//             mobileNumber: '7654321098',
//             joinDate: '10-03-2024',
//             address: '789 Executive Plaza, Bangalore, 560001',
//             totalExecutives: 3
//           },
//           {
//             id: '4',
//             executiveId: 'EX-004',
//             executiveName: 'Emily Davis',
//             mobileNumber: '6543210987',
//             joinDate: '05-04-2024',
//             address: '321 Management Street, Chennai, 600001',
//             totalExecutives: 12
//           },
//           {
//             id: '5',
//             executiveId: 'EX-005',
//             executiveName: 'David Wilson',
//             mobileNumber: '5432109876',
//             joinDate: '18-05-2024',
//             address: '654 Leadership Lane, Pune, 411001',
//             totalExecutives: 7
//           }
//         ]
//       });
//     }, 1000);
//   });
// };

// const AllExecutives: React.FC<ExecutiveProps> = ({ onAddExecutive }) => {
//   const [showFilter, setShowFilter] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(8);
//   const [executives, setExecutives] = useState<ExecutiveData[]>([]);
//   const [error, setError] = useState<string | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [filters, setFilters] = useState({
//     executiveName: '',
//     mobileNumber: ''
//   });

//   // Pagination calculations
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentExecutives = executives.slice(indexOfFirstItem, indexOfLastItem);
//   const totalPages = Math.ceil(executives.length / itemsPerPage);

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

//   const handlePageChange = (page: number) => {
//     setCurrentPage(page);
//   };

//   const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     setItemsPerPage(Number(e.target.value));
//     setCurrentPage(1);
//   };

//   // Action handlers
//   const handleView = (id: string) => {
//     console.log(`View executive with ID: ${id}`);
//   };

//   const handleEdit = (id: string) => {
//     console.log(`Edit executive with ID: ${id}`);
//   };

//   const handleDelete = (id: string) => {
//     if (window.confirm('Are you sure you want to delete this executive?')) {
//       console.log(`Delete executive with ID: ${id}`);
//     }
//   };

//   const fetchAllExecutives = async () => {
//     try {
//       setLoading(true);
//       const response = await getAllExecutives();
//       if (response?.executives) {
//         setExecutives(response.executives);
//       } else {
//         setError('Invalid response format');
//       }
//     } catch (err: any) {
//       setError(err?.message || 'Failed to fetch executives');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAllExecutives();
//   }, []);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
//           <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Executives</h1>
//           <div className="flex flex-wrap items-center gap-2">
//             <button 
//               onClick={() => setShowFilter(!showFilter)}
//               className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
//             >
//               <Filter className="h-4 w-4 mr-2" />
//               Filter
//             </button>
//             <button 
//               onClick={onAddExecutive}
//               className="flex items-center px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl"
//             >
//               <Plus className="h-4 w-4 mr-2" />
//               Add
//             </button>
//           </div>
//         </div>

//         {/* Filter Panel */}
//         {showFilter && (
//           <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8 animate-in slide-in-from-top duration-300">
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Executive Name</label>
//                 <select
//                   value={filters.executiveName}
//                   onChange={(e) => handleFilterChange('executiveName', e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 >
//                   <option value="">Select executive name</option>
//                   {executives.map(executive => (
//                     <option key={executive.id} value={executive.executiveName}>
//                       {executive.executiveName}
//                     </option>
//                   ))}
//                 </select>
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Mobile No</label>
//                 <select
//                   value={filters.mobileNumber}
//                   onChange={(e) => handleFilterChange('mobileNumber', e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 >
//                   <option value="">Select Mobile No</option>
//                   {executives.map(executive => (
//                     <option key={executive.id} value={executive.mobileNumber}>
//                       {executive.mobileNumber}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>
            
//             <div className="flex justify-center">
//               <button
//                 onClick={handleFilterSubmit}
//                 className="px-8 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
//               >
//                 Submit
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Table */}
//         <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
//           <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
//             <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
//               <div className="flex items-center gap-2">
//                 <label className="text-sm font-medium text-gray-700">Show</label>
//                 <select
//                   value={itemsPerPage}
//                   onChange={handleItemsPerPageChange}
//                   className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
//                 >
//                   <option value={8}>8</option>
//                   <option value={12}>12</option>
//                   <option value={16}>16</option>
//                 </select>
//                 <span className="text-sm text-gray-700">entries</span>
//               </div>
//             </div>
//           </div>

//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Executive Name</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Executive ID</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mobile Number</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Executives</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {loading ? (
//                   <tr>
//                     <td colSpan={7} className="px-6 py-8 text-center">
//                       <div className="flex justify-center items-center">
//                         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
//                       </div>
//                     </td>
//                   </tr>
//                 ) : error ? (
//                   <tr>
//                     <td colSpan={7} className="px-6 py-8 text-center text-red-500">
//                       {error}
//                     </td>
//                   </tr>
//                 ) : currentExecutives.length === 0 ? (
//                   <tr>
//                     <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
//                       No executives found
//                     </td>
//                   </tr>
//                 ) : (
//                   currentExecutives.map((executive) => (
//                     <tr key={executive.id} className="hover:bg-gray-50 transition-colors duration-150">
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className="text-sm font-medium text-gray-900">{executive.executiveName}</span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">{executive.executiveId}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{executive.mobileNumber}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{executive.joinDate}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 max-w-xs">
//                         <div className="truncate">{executive.address}</div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-center">
//                         <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
//                           {executive.totalExecutives}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex items-center space-x-2">
//                           <button 
//                             onClick={() => handleEdit(executive.id)}
//                             className="text-blue-600 hover:text-blue-800 transition-colors duration-150"
//                             title="Edit"
//                           >
//                             <Pencil className="h-4 w-4" />
//                           </button>
//                           <button 
//                             onClick={() => handleView(executive.id)}
//                             className="text-green-600 hover:text-green-800 transition-colors duration-150"
//                             title="View"
//                           >
//                             <Eye className="h-4 w-4" />
//                           </button>
//                           <button 
//                             onClick={() => handleDelete(executive.id)}
//                             className="text-red-600 hover:text-red-800 transition-colors duration-150"
//                             title="Delete"
//                           >
//                             <Trash2 className="h-4 w-4" />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {/* Pagination */}
//           <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex flex-col sm:flex-row items-center justify-between gap-4">
//             <div className="text-sm text-gray-700">
//               Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
//               <span className="font-medium">{Math.min(indexOfLastItem, executives.length)}</span> of{' '}
//               <span className="font-medium">{executives.length}</span> executives
//             </div>
//             <div className="flex space-x-2">
//               <button
//                 onClick={() => handlePageChange(currentPage - 1)}
//                 disabled={currentPage === 1}
//                 className={`px-3 py-1 rounded-md ${currentPage === 1 
//                   ? 'bg-gray-200 cursor-not-allowed text-gray-500' 
//                   : 'bg-white border border-gray-300 hover:bg-gray-100 text-gray-700'}`}
//               >
//                 Previous
//               </button>
              
//               <div className="flex space-x-1">
//                 {Array.from({ length: totalPages }, (_, index) => (
//                   <button
//                     key={index + 1}
//                     onClick={() => handlePageChange(index + 1)}
//                     className={`px-3 py-1 rounded-md ${currentPage === index + 1 
//                       ? 'bg-blue-500 text-white' 
//                       : 'bg-white border border-gray-300 hover:bg-gray-100 text-gray-700'}`}
//                   >
//                     {index + 1}
//                   </button>
//                 ))}
//               </div>
              
//               <button
//                 onClick={() => handlePageChange(currentPage + 1)}
//                 disabled={currentPage === totalPages}
//                 className={`px-3 py-1 rounded-md ${currentPage === totalPages 
//                   ? 'bg-gray-200 cursor-not-allowed text-gray-500' 
//                   : 'bg-white border border-gray-300 hover:bg-gray-100 text-gray-700'}`}
//               >
//                 Next
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   // // Action handlers
//   // function handleView(id: string) {
//   //   console.log(`View executive with ID: ${id}`);
//   // }

//   // function handleEdit(id: string) {
//   //   console.log(`Edit executive with ID: ${id}`);
//   // }

//   // function handleDelete(id: string) {
//   //   if (window.confirm('Are you sure you want to delete this executive?')) {
//   //     console.log(`Delete executive with ID: ${id}`);
//   //   }
//   // }
// };

// export default AllExecutives;