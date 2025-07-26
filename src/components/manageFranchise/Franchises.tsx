import React, { useState } from 'react';
import { Filter, Plus, Calendar, Eye, Pencil, Trash2 } from 'lucide-react';

interface FranchiseProps {
  onAddFranchise?: () => void;
}

const Franchise: React.FC<FranchiseProps> = ({ onAddFranchise }) => {
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState({
    franchiseName: '',
    contactNo: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const franchises = [
    {
      id: 1,
      franchiseId: 'FR-001',
      franchiseName: 'City Electric Services',
      contactNo: '9876543210',
      joiningDate: '15-03-2024',
      totalTechnicians: 8,
      avatar: 'https://images.pexels.com/photos/3768911/pexels-photo-3768911.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    {
      id: 2,
      franchiseId: 'FR-002',
      franchiseName: 'Metro Plumbing Solutions',
      contactNo: '8765432109',
      joiningDate: '22-04-2024',
      totalTechnicians: 12,
      avatar: 'https://images.pexels.com/photos/3779428/pexels-photo-3779428.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    {
      id: 3,
      franchiseId: 'FR-003',
      franchiseName: 'Cool Air AC Technicians',
      contactNo: '7654321098',
      joiningDate: '05-05-2024',
      totalTechnicians: 6,
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    {
      id: 4,
      franchiseId: 'FR-004',
      franchiseName: 'Precision Carpentry Works',
      contactNo: '6543210987',
      joiningDate: '18-06-2024',
      totalTechnicians: 9,
      avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    {
      id: 5,
      franchiseId: 'FR-005',
      franchiseName: 'Colorful Painting Services',
      contactNo: '5432109876',
      joiningDate: '29-07-2024',
      totalTechnicians: 7,
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    {
      id: 6,
      franchiseId: 'FR-006',
      franchiseName: 'Auto Care Mechanics',
      contactNo: '4321098765',
      joiningDate: '11-08-2024',
      totalTechnicians: 10,
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    {
      id: 7,
      franchiseId: 'FR-007',
      franchiseName: 'Quick Fix Electricians',
      contactNo: '3210987654',
      joiningDate: '03-01-2024',
      totalTechnicians: 15,
      avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    {
      id: 8,
      franchiseId: 'FR-008',
      franchiseName: 'Waterworks Plumbers',
      contactNo: '2109876543',
      joiningDate: '14-02-2024',
      totalTechnicians: 11,
      avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    {
      id: 9,
      franchiseId: 'FR-009',
      franchiseName: 'Pro Painters',
      contactNo: '1098765432',
      joiningDate: '25-03-2024',
      totalTechnicians: 14,
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    {
      id: 10,
      franchiseId: 'FR-010',
      franchiseName: 'Chill AC Services',
      contactNo: '0987654321',
      joiningDate: '07-04-2024',
      totalTechnicians: 8,
      avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    {
      id: 11,
      franchiseId: 'FR-011',
      franchiseName: 'Master Craftsmen Carpentry',
      contactNo: '1122334455',
      joiningDate: '19-05-2024',
      totalTechnicians: 6,
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    {
      id: 12,
      franchiseId: 'FR-012',
      franchiseName: 'Speedy Auto Repairs',
      contactNo: '2233445566',
      joiningDate: '30-06-2024',
      totalTechnicians: 9,
      avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    {
      id: 13,
      franchiseId: 'FR-013',
      franchiseName: 'Bright Sparks Electrical',
      contactNo: '3344556677',
      joiningDate: '12-07-2024',
      totalTechnicians: 12,
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    {
      id: 14,
      franchiseId: 'FR-014',
      franchiseName: 'Clear Flow Plumbing',
      contactNo: '4455667788',
      joiningDate: '24-08-2024',
      totalTechnicians: 7,
      avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    {
      id: 15,
      franchiseId: 'FR-015',
      franchiseName: 'Creative Colors Painting',
      contactNo: '5566778899',
      joiningDate: '05-09-2024',
      totalTechnicians: 10,
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    {
      id: 16,
      franchiseId: 'FR-016',
      franchiseName: 'Frosty Air Conditioning',
      contactNo: '6677889900',
      joiningDate: '17-10-2024',
      totalTechnicians: 8,
      avatar: 'https://images.pexels.com/photos/3779428/pexels-photo-3779428.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    {
      id: 17,
      franchiseId: 'FR-017',
      franchiseName: 'Precision Auto Care',
      contactNo: '7788990011',
      joiningDate: '28-11-2024',
      totalTechnicians: 11,
      avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    {
      id: 18,
      franchiseId: 'FR-018',
      franchiseName: 'Wire Wizards Electrical',
      contactNo: '8899001122',
      joiningDate: '09-12-2024',
      totalTechnicians: 13,
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    {
      id: 19,
      franchiseId: 'FR-019',
      franchiseName: 'Artistic Touch Painters',
      contactNo: '9900112233',
      joiningDate: '21-01-2025',
      totalTechnicians: 9,
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    {
      id: 20,
      franchiseId: 'FR-020',
      franchiseName: 'Wood Masters Carpentry',
      contactNo: '0011223344',
      joiningDate: '02-02-2025',
      totalTechnicians: 7,
      avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=100'
    }
  ];

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
                <option value="city">City Electric Services</option>
                <option value="metro">Metro Plumbing Solutions</option>
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
                <option value="9876543210">9876543210</option>
                <option value="8765432109">8765432109</option>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date of Joining</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Technicians</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentFranchises.map((franchise) => (
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
                      <button 
                        onClick={() => handleEdit(franchise.id)}
                        className="text-yellow-600 hover:text-yellow-900"
                        title="Edit"
                      >
                        <Pencil className="h-5 w-5" />
                      </button>
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
              ))}
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

export default Franchise;