import React, { useEffect, useState } from 'react';
import { Filter, Plus, Eye, Trash2 } from 'lucide-react';
import { getAllTechnicians } from '../../api/apiMethods';

interface Technician {
  id: string;
  username: string;
  phoneNumber: string;
  category?: string;
  joinDate?: string;
  subscription?: string;
  buildingName?: string;
  areaName?: string;
  city?: string;
  state?: string;
  pincode?: string;
  avatar?: string;
}

interface TechniciansProps {
  onAddTechnician?: () => void;
}

const Technicians: React.FC<TechniciansProps> = ({ onAddTechnician }) => {
  const [showFilter, setShowFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ 
    technicianName: '', 
    phoneNumber: '' 
  });

  const fetchAllTechnicians = async () => {
    try {
      setLoading(true);
      const response = await getAllTechnicians();
      if (response?.technicians) {
        setTechnicians(response.technicians);
      } else {
        setError('Invalid response format');
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch technicians');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllTechnicians();
  }, []);

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTechnicians = technicians.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(technicians.length / itemsPerPage);

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleFilterSubmit = () => {
    console.log('Filters applied:', filters);
    setShowFilter(false);
  };

  const handleView = (id: string) => {
    console.log(`View Technician ID: ${id}`);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this technician?')) {
      console.log(`Delete Technician ID: ${id}`);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Technicians</h1>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowFilter(!showFilter)}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Filter className="h-4 w-4 mr-2" /> Filter
            </button>
            <button
              onClick={onAddTechnician}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Plus className="h-4 w-4 mr-2" /> Add
            </button>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilter && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8 animate-in slide-in-from-top duration-300">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Technician Name</label>
                <select
                  value={filters.technicianName}
                  onChange={(e) => handleFilterChange('technicianName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select technician name</option>
                  {technicians.map(tech => (
                    <option key={tech.id} value={tech.username}>
                      {tech.username}
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
                  <option value="">Select Mobile no</option>
                  {technicians.map(tech => (
                    <option key={tech.id} value={tech.phoneNumber}>
                      {tech.phoneNumber}
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Technician Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Technician ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mobile No</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subscription</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center">
                      <div className="flex justify-center items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                      </div>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center text-red-500">
                      {error}
                    </td>
                  </tr>
                ) : currentTechnicians.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                      No technicians found
                    </td>
                  </tr>
                ) : (
                  currentTechnicians.map((tech) => (
                    <tr key={tech.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            src={tech.avatar || '/default-avatar.png'}
                            alt={tech.username}
                            className="h-10 w-10 rounded-full object-cover mr-3 shadow-sm"
                          />
                          <span className="text-sm font-medium text-gray-900">{tech.username}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">{tech.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{tech.category || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{tech.phoneNumber}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{tech.joinDate || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{tech.subscription || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {[tech.areaName, tech.city, tech.pincode]
                          .filter(Boolean)
                          .join(', ') || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => handleView(tech.id)} 
                            className="text-blue-600 hover:text-blue-800 transition-colors duration-150" 
                            title="View"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(tech.id)} 
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
              <span className="font-medium">{Math.min(indexOfLastItem, technicians.length)}</span> of{' '}
              <span className="font-medium">{technicians.length}</span> results
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-md ${
                  currentPage === 1
                    ? 'bg-gray-200 cursor-not-allowed text-gray-500'
                    : 'bg-white border border-gray-300 hover:bg-gray-100 text-gray-700'
                }`}
              >
                Previous
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === page
                      ? 'bg-blue-500 text-white'
                      : 'bg-white border border-gray-300 hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-md ${
                  currentPage === totalPages
                    ? 'bg-gray-200 cursor-not-allowed text-gray-500'
                    : 'bg-white border border-gray-300 hover:bg-gray-100 text-gray-700'
                }`}
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

export default Technicians;




// import React, { useEffect, useState } from 'react';
// import { Filter, Plus, Eye, Pencil, Trash2 } from 'lucide-react';
// import { getAllTechnicians } from '../../api/apiMethods';

// interface Technician {
//   id: string;
//   username: string;
//   phoneNumber: string;
//   category?: string;
//   joinDate?: string;
//   subscription?: string;
//   buildingName?: string;
//   areaName?: string;
//   city?: string;
//   state?: string;
//   pincode?: string;
//   avatar?: string;
// }

// interface TechniciansProps {
//   onAddTechnician?: () => void;
// }

// const Technicians: React.FC<TechniciansProps> = ({ onAddTechnician }) => {
//   const [showFilter, setShowFilter] = useState(false);
//   const [filters, setFilters] = useState({ technicianName: '', phoneNumber: '' });
//   const [technicians, setTechnicians] = useState<Technician[]>([]);
//   const [error, setError] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 10;

//   const fetchAllTechnicians = async () => {
//     try {
//       const response = await getAllTechnicians();
//       if (response?.technicians) {
//         setTechnicians(response.technicians);
//       } else {
//         setError('Invalid response format');
//       }
//     } catch (err: any) {
//       setError(err?.message || 'Failed to fetch technicians');
//     }
//   };

//   useEffect(() => {
//     fetchAllTechnicians();
//   }, []);

//   const handleFilterChange = (field: string, value: string) => {
//     setFilters((prev) => ({ ...prev, [field]: value }));
//   };

//   const handleFilterSubmit = () => {
//     console.log('Filters applied:', filters);
//     setShowFilter(false);
//   };

//   const handleView = (id: string) => {
//     console.log(`View Technician ID: ${id}`);
//   };

//   const handleEdit = (id: string) => {
//     console.log(`Edit Technician ID: ${id}`);
//   };

//   const handleDelete = (id: string) => {
//     console.log(`Delete Technician ID: ${id}`);
//   };

//   const totalPages = Math.ceil(technicians.length / itemsPerPage);
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const endIndex = startIndex + itemsPerPage;
//   const currentTechnicians = technicians.slice(startIndex, endIndex);

//   const goToPage = (page: number) => setCurrentPage(page);
//   const nextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
//   const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <h1 className="text-2xl font-bold text-gray-900">Technicians</h1>
//         <div className="flex items-center space-x-2">
//           <button
//             onClick={() => setShowFilter(!showFilter)}
//             className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg"
//           >
//             <Filter className="h-4 w-4 mr-2" /> Filter
//           </button>
//           <button
//             onClick={onAddTechnician}
//             className="flex items-center px-4 py-2 bg-emerald-500 text-white rounded-lg"
//           >
//             <Plus className="h-4 w-4 mr-2" /> Add
//           </button>
//         </div>
//       </div>

//       {showFilter && (
//         <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Technician Name</label>
//               <input
//                 type="text"
//                 value={filters.technicianName}
//                 onChange={(e) => handleFilterChange('technicianName', e.target.value)}
//                 className="w-full border px-3 py-2 rounded-md border-gray-300"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Mobile No</label>
//               <input
//                 type="text"
//                 value={filters.phoneNumber}
//                 onChange={(e) => handleFilterChange('phoneNumber', e.target.value)}
//                 className="w-full border px-3 py-2 rounded-md border-gray-300"
//               />
//             </div>
//           </div>
//           <div className="flex justify-center">
//             <button
//               onClick={handleFilterSubmit}
//               className="px-6 py-2 bg-blue-500 text-white rounded-lg"
//             >
//               Submit
//             </button>
//           </div>
//         </div>
//       )}

//       <div className="bg-white rounded-lg shadow-sm border border-gray-200">
//         <div className="overflow-x-auto">
//           <table className="w-full ">
//             <thead className="bg-gray-50 text-left">
//               <tr>
//                 <th className="px-6 py-3">Technician Name</th>
//                 <th className="px-6 py-3">Technician ID</th>
//                 <th className="px-6 py-3">Category</th>
//                 <th className="px-6 py-3">Mobile No</th>
//                 <th className="px-6 py-3">Join Date</th>
//                 <th className="px-6 py-3">Subscription</th>
//                 <th className="px-6 py-3">Address</th>
//                 <th className="px-6 py-3">Action</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-100">
//               {currentTechnicians.map((tech) => (
//                 <tr key={tech.id} className="hover:bg-gray-50">
//                   <td className="px-6 py-4">
//                     <div className="flex items-center space-x-3">
//                       <img
//                         src={tech.avatar || '/default-avatar.png'}
//                         alt={tech.username}
//                         className="w-8 h-8 rounded-full object-cover"
//                       />
//                       <span>{tech.username}</span>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 font-mono text-xs">{tech.id}</td>
//                   <td className="px-6 py-4">{tech.category || '-'}</td>
//                   <td className="px-6 py-4">{tech.phoneNumber}</td>
//                   <td className="px-6 py-4">{tech.joinDate || '-'}</td>
//                   <td className="px-6 py-4">{tech.subscription || '-'}</td>
//                   <td className="px-6 py-4 max-w-xs">
//                     <div className="line-clamp-2">
//                       {[tech.areaName, tech.city, tech.pincode]
//                         .filter(Boolean)
//                         .join(', ')}
//                     </div>
//                   </td>
//                   <td className="px-6 py-4">
//                     <div className="flex space-x-2">
//                       <button onClick={() => handleView(tech.id)} className="text-blue-600" title="View">
//                         <Eye size={18} />
//                       </button>
//                       {/* <button onClick={() => handleEdit(tech.id)} className="text-yellow-500" title="Edit">
//                         <Pencil className="h-5 w-5" />
//                       </button> */}
//                       <button onClick={() => handleDelete(tech.id)} className="text-red-600" title="Delete">
//                         <Trash2 size={18} />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//               {currentTechnicians.length === 0 && (
//                 <tr>
//                   <td colSpan={8} className="text-center py-4 text-gray-500">
//                     No technicians found.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* Pagination */}
//         <div className="flex items-center justify-between px-6 py-4 border-t">
//           <div className="text-sm text-gray-700">
//             Showing {startIndex + 1} to {Math.min(endIndex, technicians.length)} of {technicians.length} technicians
//           </div>
//           <div className="flex space-x-2">
//             <button
//               onClick={prevPage}
//               disabled={currentPage === 1}
//               className={`px-3 py-1 rounded ${
//                 currentPage === 1
//                   ? 'bg-gray-200 text-gray-500'
//                   : 'bg-blue-500 text-white hover:bg-blue-600'
//               }`}
//             >
//               Previous
//             </button>
//             {Array.from({ length: totalPages }, (_, i) => (
//               <button
//                 key={i}
//                 onClick={() => goToPage(i + 1)}
//                 className={`w-8 h-8 rounded ${
//                   currentPage === i + 1
//                     ? 'bg-blue-500 text-white'
//                     : 'bg-white border border-gray-300 hover:bg-gray-50'
//                 }`}
//               >
//                 {i + 1}
//               </button>
//             ))}
//             <button
//               onClick={nextPage}
//               disabled={currentPage === totalPages}
//               className={`px-3 py-1 rounded ${
//                 currentPage === totalPages
//                   ? 'bg-gray-200 text-gray-500'
//                   : 'bg-blue-500 text-white hover:bg-blue-600'
//               }`}
//             >
//               Next
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Technicians;