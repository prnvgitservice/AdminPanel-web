import React, { useEffect, useState } from 'react';
import { Filter, Plus, Eye, Pencil, Trash2 } from 'lucide-react';

interface FranchiseProps {
  onAddFranchise?: () => void;
}

interface FranchiseData {
  id: number;
  franchiseId: string;
  franchiseName: string;
  contactNo: string;
  joiningDate: string;
  totalTechnicians: number;
  avatar: string;
  address: string;
}

// Mock API service function
const getAllFranchises = async () => {
  return new Promise<{ franchises: FranchiseData[] }>((resolve) => {
    setTimeout(() => {
      resolve({
        franchises: [
          {
            id: 1,
            franchiseId: 'FR-001',
            franchiseName: 'Metro Plumbing Solutions',
            contactNo: '8765432109',
            joiningDate: '22-04-2024',
            totalTechnicians: 12,
            avatar: 'https://images.pexels.com/photos/3779428/pexels-photo-3779428.jpeg?auto=compress&cs=tinysrgb&w=100',
            address: '456 Oak Ave, Los Angeles, CA 90001'
          },
          {
            id: 2,
            franchiseId: 'FR-002',
            franchiseName: 'Cool Air AC Technicians',
            contactNo: '7654321098',
            joiningDate: '05-05-2024',
            totalTechnicians: 6,
            avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100',
            address: '789 Pine Rd, Chicago, IL 60601'
          },
          {
            id: 3,
            franchiseId: 'FR-003',
            franchiseName: 'Precision Carpentry Works',
            contactNo: '6543210987',
            joiningDate: '18-06-2024',
            totalTechnicians: 9,
            avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=100',
            address: '321 Cedar Ln, Houston, TX 77001'
          },
          {
            id: 4,
            franchiseId: 'FR-004',
            franchiseName: 'Colorful Painting Services',
            contactNo: '5432109876',
            joiningDate: '29-07-2024',
            totalTechnicians: 7,
            avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100',
            address: '555 Maple Dr, Phoenix, AZ 85001'
          },
          {
            id: 5,
            franchiseId: 'FR-005',
            franchiseName: 'Swift Appliance Repairs',
            contactNo: '4321098765',
            joiningDate: '12-08-2024',
            totalTechnicians: 10,
            avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100',
            address: '777 Birch St, Philadelphia, PA 19101'
          }
        ]
      });
    }, 1000);
  });
};

const AdminCreatedFranchises: React.FC<FranchiseProps> = ({ onAddFranchise }) => {
  const [showFilter, setShowFilter] = useState(false);
  const [franchises, setFranchises] = useState<FranchiseData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    franchiseName: '',
    contactNo: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Calculate pagination values
  const totalPages = Math.ceil(franchises.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentFranchises = franchises.slice(startIndex, endIndex);

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

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Action handlers
  const handleView = (id: number) => {
    console.log(`View franchise with ID: ${id}`);
  };

  const handleEdit = (id: number) => {
    console.log(`Edit franchise with ID: ${id}`);
  };

  const handleDelete = (id: number) => {
    console.log(`Delete franchise with ID: ${id}`);
  };

  const fetchAllFranchises = async () => {
    try {
      setLoading(true);
      const response = await getAllFranchises();
      if (response?.franchises) {
        setFranchises(response.franchises);
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Franchises</h1>
        <div className="flex items-center space-x-2">
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
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Franchise Name</label>
              <select
                value={filters.franchiseName}
                onChange={(e) => handleFilterChange('franchiseName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">Select franchise name</option>
                {franchises.map(franchise => (
                  <option key={franchise.id} value={franchise.franchiseName}>
                    {franchise.franchiseName}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <select
                value={filters.contactNo}
                onChange={(e) => handleFilterChange('contactNo', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">Select Phone Number</option>
                {franchises.map(franchise => (
                  <option key={franchise.id} value={franchise.contactNo}>
                    {franchise.contactNo}
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

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Franchisee Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Franchise ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date of Joining</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Technicians</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center">
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-red-500">
                    {error}
                  </td>
                </tr>
              ) : currentFranchises.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                    No franchises found
                  </td>
                </tr>
              ) : (
                currentFranchises.map((franchise) => (
                  <tr key={franchise.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{franchise.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          src={franchise.avatar}
                          alt={franchise.franchiseName}
                          className="h-10 w-10 rounded-full object-cover mr-3"
                        />
                        <span className="text-sm font-medium text-gray-900">{franchise.franchiseName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{franchise.franchiseId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{franchise.contactNo}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                      <div className="line-clamp-2">{franchise.address}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{franchise.joiningDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {franchise.totalTechnicians}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleView(franchise.id)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                        {/* <button 
                          onClick={() => handleEdit(franchise.id)}
                          className="text-yellow-600 hover:text-yellow-900"
                          title="Edit"
                        >
                          <Pencil className="h-5 w-5" />
                        </button> */}
                        <button 
                          onClick={() => handleDelete(franchise.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <Trash2 className="h-5 w-5" />
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
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
            <span className="font-medium">{Math.min(endIndex, franchises.length)}</span> of{' '}
            <span className="font-medium">{franchises.length}</span> franchises
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-md ${currentPage === 1 
                ? 'bg-gray-200 cursor-not-allowed text-gray-500' 
                : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700'}`}
            >
              Previous
            </button>
            
            <div className="flex space-x-1">
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index + 1}
                  onClick={() => goToPage(index + 1)}
                  className={`w-10 h-10 flex items-center justify-center rounded-md ${currentPage === index + 1 
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' 
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            
            <button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-md ${currentPage === totalPages 
                ? 'bg-gray-200 cursor-not-allowed text-gray-500' 
                : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700'}`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCreatedFranchises;