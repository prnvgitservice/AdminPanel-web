import React, { useState } from 'react';
import { Filter, Plus, Edit } from 'lucide-react';

interface AdminUsersProps {
  onAddUser?: () => void;
}

const AdminUsers: React.FC<AdminUsersProps> = ({ onAddUser }) => {
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState({
    userName: ''
  });

  const adminUsers = [
    {
      id: 1,
      fullName: 'SRILATHA',
      username: 'srilatha',
      emailId: 'sarasprnv@gmail.com',
      avatar: 'https://images.pexels.com/photos/3768911/pexels-photo-3768911.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    {
      id: 2,
      fullName: 'RAVI TEJA',
      username: 'raviteja',
      emailId: 'ravitejprnv@gmail.com',
      avatar: 'https://images.pexels.com/photos/3735781/pexels-photo-3735781.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    {
      id: 3,
      fullName: 'admin',
      username: 'admin',
      emailId: 'prnvservices@gmail.com',
      avatar: 'https://images.pexels.com/photos/3768911/pexels-photo-3768911.jpeg?auto=compress&cs=tinysrgb&w=100'
    }
  ];

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Admin Users</h1>
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setShowFilter(!showFilter)}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </button>
          <button 
            onClick={onAddUser}
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">User Name</label>
              <select
                value={filters.userName}
                onChange={(e) => handleFilterChange('userName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">Select user name</option>
                <option value="srilatha">SRILATHA</option>
                <option value="raviteja">RAVI TEJA</option>
                <option value="admin">admin</option>
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
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Show</span>
              <select className="border border-gray-300 rounded px-2 py-1 text-sm">
                <option>10</option>
                <option>25</option>
                <option>50</option>
              </select>
              <span className="text-sm text-gray-600">entries</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Search:</span>
              <input 
                type="text" 
                className="border border-gray-300 rounded px-3 py-1 text-sm"
                placeholder="Search..."
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {adminUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img 
                        src={user.avatar} 
                        alt={user.fullName}
                        className="h-10 w-10 rounded-full object-cover mr-3"
                      />
                      <span className="text-sm font-medium text-gray-900">{user.fullName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.username}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.emailId}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button className="text-green-600 hover:text-green-800">
                      <Edit className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Showing 1 to 3 of 3 entries</span>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700">Previous</button>
              <button className="px-3 py-1 text-sm bg-blue-500 text-white rounded">1</button>
              <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700">Next</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;