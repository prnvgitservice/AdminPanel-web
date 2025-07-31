import React, { useEffect, useState } from 'react';
import { Filter, Plus, Eye, Pencil, Trash2 } from 'lucide-react';
// import { getAllAdminCreatedTechnicians } from '../../api/apiMethods';

interface Technician {
  id: string;
  username: string;
  phoneNumber: string;
  category?: string;
  joiningDate?: string;
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

const AdminCreatedTechnicians: React.FC<TechniciansProps> = ({ onAddTechnician }) => {
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState({ technicianName: '', phoneNumber: '' });
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchAllAdminCreatedTechnicians = async () => {
    try {
      const response = await getAllAdminCreatedTechnicians();
      if (response?.technicians) {
        setTechnicians(response.technicians);
      } else {
        setError('Invalid response format');
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch technicians');
    }
  };

  useEffect(() => {
    fetchAllAdminCreatedTechnicians();
  }, []);

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

  const handleEdit = (id: string) => {
    console.log(`Edit Technician ID: ${id}`);
  };

  const handleDelete = (id: string) => {
    console.log(`Delete Technician ID: ${id}`);
  };

  const totalPages = Math.ceil(technicians.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTechnicians = technicians.slice(startIndex, endIndex);

  const goToPage = (page: number) => setCurrentPage(page);
  const nextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
  const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Technicians</h1>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowFilter(!showFilter)}
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            <Filter className="h-4 w-4 mr-2" /> Filter
          </button>
          <button
            onClick={onAddTechnician}
            className="flex items-center px-4 py-2 bg-emerald-500 text-white rounded-lg"
          >
            <Plus className="h-4 w-4 mr-2" /> Add
          </button>
        </div>
      </div>

      {showFilter && (
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Technician Name</label>
              <input
                type="text"
                value={filters.technicianName}
                onChange={(e) => handleFilterChange('technicianName', e.target.value)}
                className="w-full border px-3 py-2 rounded-md border-gray-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <input
                type="text"
                value={filters.phoneNumber}
                onChange={(e) => handleFilterChange('phoneNumber', e.target.value)}
                className="w-full border px-3 py-2 rounded-md border-gray-300"
              />
            </div>
          </div>
          <div className="flex justify-center">
            <button
              onClick={handleFilterSubmit}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg"
            >
              Submit
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-6 py-3">Technician</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Mobile No</th>
                <th className="px-6 py-3">Joining Date</th>
                <th className="px-6 py-3">Subscription</th>
                <th className="px-6 py-3">Address</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentTechnicians.map((tech) => (
                <tr key={tech.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={tech.avatar || '/default-avatar.png'}
                        alt={tech.username}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span>{tech.username}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">{tech.category || '-'}</td>
                  <td className="px-6 py-4">{tech.phoneNumber}</td>
                  <td className="px-6 py-4">{tech.joiningDate || '-'}</td>
                  <td className="px-6 py-4">{tech.subscription || '-'}</td>
                  <td className="px-6 py-4">
                    {[tech.buildingName, tech.areaName, tech.city, tech.state, tech.pincode]
                      .filter(Boolean)
                      .join(', ')}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button onClick={() => handleView(tech.id)} className="text-blue-600" title="View">
                        <Eye className="h-5 w-5" />
                      </button>
                      {/* <button onClick={() => handleEdit(tech.id)} className="text-yellow-500" title="Edit">
                        <Pencil className="h-5 w-5" />
                      </button> */}
                      <button onClick={() => handleDelete(tech.id)} className="text-red-600" title="Delete">
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {currentTechnicians.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-4 text-gray-500">
                    No technicians found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t">
          <div className="text-sm text-gray-700">
            Showing {startIndex + 1} to {Math.min(endIndex, technicians.length)} of {technicians.length} technicians
          </div>
          <div className="flex space-x-2">
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded ${
                currentPage === 1
                  ? 'bg-gray-200 text-gray-500'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => goToPage(i + 1)}
                className={`w-8 h-8 rounded ${
                  currentPage === i + 1
                    ? 'bg-blue-500 text-white'
                    : 'bg-white border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded ${
                currentPage === totalPages
                  ? 'bg-gray-200 text-gray-500'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCreatedTechnicians;
