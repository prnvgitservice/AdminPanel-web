import React, { useState } from 'react';
import { Filter, Plus, Calendar, Eye, Pencil, Trash2 } from 'lucide-react';

interface TechniciansProps {
  onAddTechnician?: () => void;
}

const Technicians: React.FC<TechniciansProps> = ({ onAddTechnician }) => {
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState({
    TechnicianName: '',
    email: '',
    fromDate: '',
    toDate: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const technicians = [
    {
      id: 1,
      TechnicianName: 'Sumit',
      CategoryName: 'Electrician',
      contactNo: '7978071081',
      regDate: '03-08-2024',
      subscription: 'Free Plan',
      recentLogout: '25-07-2025',
      avatar: 'https://images.pexels.com/photos/3768911/pexels-photo-3768911.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    {
      id: 2,
      TechnicianName: 'Ravi Kumar',
      CategoryName: 'Plumber',
      contactNo: '9001123456',
      regDate: '12-09-2024',
      subscription: 'Premium Plan',
      recentLogout: '24-07-2025',
      avatar: 'https://images.pexels.com/photos/3779428/pexels-photo-3779428.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    {
      id: 3,
      TechnicianName: 'Pooja Sharma',
      CategoryName: 'AC Technician',
      contactNo: '7896541230',
      regDate: '10-07-2024',
      subscription: 'Free Plan',
      recentLogout: '20-07-2025',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    {
      id: 4,
      TechnicianName: 'Rajesh Reddy',
      CategoryName: 'Carpenter',
      contactNo: '9988776655',
      regDate: '01-06-2024',
      subscription: 'Standard Plan',
      recentLogout: '22-07-2025',
      avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    {
      id: 5,
      TechnicianName: 'Anjali Verma',
      CategoryName: 'Painter',
      contactNo: '9123456789',
      regDate: '22-05-2024',
      subscription: 'Free Plan',
      recentLogout: '21-07-2025',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    {
      id: 6,
      TechnicianName: 'Naveen Rao',
      CategoryName: 'Mechanic',
      contactNo: '9345678123',
      regDate: '18-06-2024',
      subscription: 'Premium Plan',
      recentLogout: '20-07-2025',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    {
      id: 7,
      TechnicianName: 'Sneha Patil',
      CategoryName: 'Electrician',
      contactNo: '8888441122',
      regDate: '03-05-2024',
      subscription: 'Free Plan',
      recentLogout: '23-07-2025',
      avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    {
      id: 8,
      TechnicianName: 'Vikram Singh',
      CategoryName: 'Plumber',
      contactNo: '9112233445',
      regDate: '09-06-2024',
      subscription: 'Standard Plan',
      recentLogout: '24-07-2025',
      avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    {
      id: 9,
      TechnicianName: 'Ritika Das',
      CategoryName: 'Painter',
      contactNo: '9000123456',
      regDate: '15-07-2024',
      subscription: 'Premium Plan',
      recentLogout: '25-07-2025',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    {
      id: 10,
      TechnicianName: 'Manoj Patel',
      CategoryName: 'AC Technician',
      contactNo: '9988998899',
      regDate: '01-08-2024',
      subscription: 'Free Plan',
      recentLogout: '25-07-2025',
      avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    {
      id: 11,
      TechnicianName: 'Priya Mehta',
      CategoryName: 'Carpenter',
      contactNo: '9876543210',
      regDate: '12-08-2024',
      subscription: 'Premium Plan',
      recentLogout: '25-07-2025',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    {
      id: 12,
      TechnicianName: 'Ajay Dev',
      CategoryName: 'Mechanic',
      contactNo: '9001122334',
      regDate: '10-06-2024',
      subscription: 'Free Plan',
      recentLogout: '25-07-2025',
      avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    {
      id: 13,
      TechnicianName: 'Deepika Nair',
      CategoryName: 'Electrician',
      contactNo: '9988776655',
      regDate: '09-05-2024',
      subscription: 'Standard Plan',
      recentLogout: '25-07-2025',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    {
      id: 14,
      TechnicianName: 'Arjun Rao',
      CategoryName: 'Plumber',
      contactNo: '9111223344',
      regDate: '14-07-2024',
      subscription: 'Free Plan',
      recentLogout: '25-07-2025',
      avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    {
      id: 15,
      TechnicianName: 'Meena Joshi',
      CategoryName: 'Painter',
      contactNo: '9001234567',
      regDate: '05-08-2024',
      subscription: 'Standard Plan',
      recentLogout: '25-07-2025',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    {
      id: 16,
      TechnicianName: 'Kiran Kumar',
      CategoryName: 'AC Technician',
      contactNo: '9234567890',
      regDate: '02-07-2024',
      subscription: 'Premium Plan',
      recentLogout: '25-07-2025',
      avatar: 'https://images.pexels.com/photos/3779428/pexels-photo-3779428.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    {
      id: 17,
      TechnicianName: 'Swathi Reddy',
      CategoryName: 'Mechanic',
      contactNo: '9678451230',
      regDate: '17-07-2024',
      subscription: 'Free Plan',
      recentLogout: '25-07-2025',
      avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    {
      id: 18,
      TechnicianName: 'Karthik Varma',
      CategoryName: 'Electrician',
      contactNo: '9345012345',
      regDate: '30-06-2024',
      subscription: 'Standard Plan',
      recentLogout: '25-07-2025',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    {
      id: 19,
      TechnicianName: 'Lavanya Das',
      CategoryName: 'Painter',
      contactNo: '9123456781',
      regDate: '20-06-2024',
      subscription: 'Premium Plan',
      recentLogout: '25-07-2025',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    {
      id: 20,
      TechnicianName: 'Rohan Joshi',
      CategoryName: 'Carpenter',
      contactNo: '9988123411',
      regDate: '25-07-2024',
      subscription: 'Free Plan',
      recentLogout: '25-07-2025',
      avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=100'
    }
  ];

  // Calculate pagination values
  const totalPages = Math.ceil(technicians.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTechnicians = technicians.slice(startIndex, endIndex);

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
    console.log(`View technician with ID: ${id}`);
    // Add your view logic here
  };

  const handleEdit = (id: number) => {
    console.log(`Edit technician with ID: ${id}`);
    // Add your edit logic here
  };

  const handleDelete = (id: number) => {
    console.log(`Delete technician with ID: ${id}`);
    // Add your delete logic here
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Technicians</h1>
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setShowFilter(!showFilter)}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </button>
          <button 
            onClick={onAddTechnician}
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Technician Name</label>
              <select
                value={filters.TechnicianName}
                onChange={(e) => handleFilterChange('TechnicianName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">Select technician name</option>
                <option value="sumit">Sumit</option>
                <option value="plumber">My plumber services</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <select
                value={filters.mobile}
                onChange={(e) => handleFilterChange('PhoneNumber', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">Select Phone Number</option>
                <option value="sumit">9666151431</option>
              </select>
            </div>
            
            <div>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TechnicianName</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CategoryName</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ContactNo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date of Joining</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subscription</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recent Activity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentTechnicians.map((technician) => (
                <tr key={technician.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{technician.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={technician.avatar}
                        alt={technician.TechnicianName}
                        className="h-10 w-10 rounded-full object-cover mr-3"
                      />
                      <span className="text-sm font-medium text-gray-900">{technician.TechnicianName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{technician.CategoryName || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{technician.contactNo}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{technician.regDate || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{technician.subscription || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{technician.recentLogout || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleView(technician.id)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      <button 
                        onClick={() => handleEdit(technician.id)}
                        className="text-yellow-600 hover:text-yellow-900"
                        title="Edit"
                      >
                        <Pencil className="h-5 w-5" />
                      </button>
                      <button 
                        onClick={() => handleDelete(technician.id)}
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
            <span className="font-medium">{Math.min(endIndex, technicians.length)}</span> of{' '}
            <span className="font-medium">{technicians.length}</span> technicians
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

export default Technicians;