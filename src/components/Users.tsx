import React, { useState } from 'react';
import { Filter, Plus, Calendar, Edit, Trash2 } from 'lucide-react';

interface UsersProps {
  onAddUser?: () => void;
}

const Users: React.FC<UsersProps> = ({ onAddUser }) => {
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState({
    userName: '',
    emailId: '',
    fromDate: '',
    toDate: ''
  });

  const users = [
    {
      id: 1,
      userName: 'Meesala Srikar',
      email: 'stylishtarar7@gmail.com',
      contactNo: '9490370463',
      signupDate: '2024-08-06 09:43:09',
      lastLogin: '2024-08-06 15:13:12',
      status: true,
      avatar: 'https://images.pexels.com/photos/3768911/pexels-photo-3768911.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    {
      id: 2,
      userName: 'padmini',
      email: 'pvarma1986@gmail.com',
      contactNo: '7780672181',
      signupDate: '2024-08-05 11:16:57',
      lastLogin: '2024-08-05 16:47:00',
      status: true,
      avatar: 'https://images.pexels.com/photos/3735781/pexels-photo-3735781.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    {
      id: 3,
      userName: 'Neelima',
      email: 'gudikandulaneelima29@gmail.com',
      contactNo: '9390335237',
      signupDate: '2024-08-05 11:00:55',
      lastLogin: '2024-08-05 17:00:41',
      status: true,
      avatar: 'https://images.pexels.com/photos/3768911/pexels-photo-3768911.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    {
      id: 4,
      userName: 'Veekshith K',
      email: 'veekshithbharadwaj@gmail.com',
      contactNo: '9177460386',
      signupDate: '2024-08-03 21:42:10',
      lastLogin: '2024-08-04 03:16:23',
      status: true,
      avatar: 'https://images.pexels.com/photos/3735781/pexels-photo-3735781.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    {
      id: 5,
      userName: 'kiran',
      email: 'sabavathkiran143@gmail.com',
      contactNo: '8374460488',
      signupDate: '2024-07-10 12:13:34',
      lastLogin: '2024-07-10 17:43:37',
      status: true,
      avatar: 'https://images.pexels.com/photos/3768911/pexels-photo-3768911.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    {
      id: 6,
      userName: 'Biswojeet',
      email: 'biswaibiswojeet@gmail.com',
      contactNo: '7008040474',
      signupDate: '2024-06-10 17:18:49',
      lastLogin: '2024-07-05 06:46:21',
      status: true,
      avatar: 'https://images.pexels.com/photos/3735781/pexels-photo-3735781.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    {
      id: 7,
      userName: 'Tanneerlakshmanarao',
      email: 'lucky70328@gmail.com',
      contactNo: '6304181708',
      signupDate: '2024-05-27 14:58:24',
      lastLogin: '2024-05-27 20:28:27',
      status: true,
      avatar: 'https://images.pexels.com/photos/3768911/pexels-photo-3768911.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    {
      id: 8,
      userName: 'Damodar',
      email: 'sandcash8@gmail.com',
      contactNo: '9030075965',
      signupDate: '2024-05-06 14:13:26',
      lastLogin: '2024-05-06 19:43:29',
      status: true,
      avatar: 'https://images.pexels.com/photos/3735781/pexels-photo-3735781.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    {
      id: 9,
      userName: 'ganeshprnv@gmail.com',
      email: 'ganeshprnv2023@gmail.com',
      contactNo: '9059789177',
      signupDate: '2024-01-11 14:16:38',
      lastLogin: '2024-08-05 21:08:16',
      status: true,
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

  const handleStatusToggle = (id: number) => {
    console.log('Toggle status for user:', id);
  };

  const handleEdit = (id: number) => {
    console.log('Edit user:', id);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      console.log('Delete user:', id);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Users</h1>
          <div className="flex flex-wrap items-center gap-2">
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
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8 animate-in slide-in-from-top duration-300">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">User Name</label>
                <select
                  value={filters.userName}
                  onChange={(e) => handleFilterChange('userName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="">Select user name</option>
                  <option value="meesala">Meesala Srikar</option>
                  <option value="padmini">padmini</option>
                  <option value="neelima">Neelima</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email ID</label>
                <select
                  value={filters.emailId}
                  onChange={(e) => handleFilterChange('emailId', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="">Select email</option>
                  <option value="stylishtarar7">stylishtarar7@gmail.com</option>
                  <option value="pvarma1986">pvarma1986@gmail.com</option>
                  <option value="gudikandula">gudikandulaneelima29@gmail.com</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
                <div className="relative">
                  <input
                    type="date"
                    value={filters.fromDate}
                    onChange={(e) => handleFilterChange('fromDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                  <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
                <div className="relative">
                  <input
                    type="date"
                    value={filters.toDate}
                    onChange={(e) => handleFilterChange('toDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                  <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
            
            <div className="flex justify-center">
              <button
                onClick={handleFilterSubmit}
                className="px-8 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-colors duration-200"
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
                  className="border border-gray-300 rounded px-3 py-1 text-sm w-full sm:w-auto"
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact No</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Signup Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img 
                          src={user.avatar} 
                          alt={user.userName}
                          className="h-10 w-10 rounded-full object-cover mr-3 shadow-sm"
                        />
                        <span className="text-sm font-medium text-gray-900">{user.userName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.contactNo}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.signupDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.lastLogin}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={user.status}
                          onChange={() => handleStatusToggle(user.id)}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                      </label>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => handleEdit(user.id)}
                          className="text-green-600 hover:text-green-800 transition-colors duration-150"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(user.id)}
                          className="text-red-600 hover:text-red-800 transition-colors duration-150"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;