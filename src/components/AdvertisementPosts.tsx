import React, { useState } from 'react';
import { Edit, Trash2 } from 'lucide-react';

interface AdvertisementPostsProps {
  onEdit?: (id: number) => void;
}

const AdvertisementPosts: React.FC<AdvertisementPostsProps> = ({ onEdit }) => {
  const [posts, setPosts] = useState([
    {
      id: 1,
      image: 'https://images.pexels.com/photos/3768911/pexels-photo-3768911.jpeg?auto=compress&cs=tinysrgb&w=100',
      advPostName: 'sri',
      userName: '',
      userType: 'Provider',
      status: true
    },
    {
      id: 2,
      image: 'https://images.pexels.com/photos/3735781/pexels-photo-3735781.jpeg?auto=compress&cs=tinysrgb&w=100',
      advPostName: 'RK SNACKS',
      userName: 'rajesh',
      userType: 'BDA',
      status: true
    },
    {
      id: 3,
      image: 'https://images.pexels.com/photos/3768911/pexels-photo-3768911.jpeg?auto=compress&cs=tinysrgb&w=100',
      advPostName: 'Helping Society Foundation',
      userName: 'INAKOTI SANTHOSHI',
      userType: 'Provider',
      status: true
    },
    {
      id: 4,
      image: 'https://images.pexels.com/photos/3735781/pexels-photo-3735781.jpeg?auto=compress&cs=tinysrgb&w=100',
      advPostName: 'Helping Hand Foundation',
      userName: 'INAKOTI SANTHOSHI',
      userType: 'Provider',
      status: true
    },
    {
      id: 5,
      image: 'https://images.pexels.com/photos/3768911/pexels-photo-3768911.jpeg?auto=compress&cs=tinysrgb&w=100',
      advPostName: 'STAR PERSONAL & CARING || Health Insurance',
      userName: 'PRNV SERVICES',
      userType: 'User',
      status: false
    },
    {
      id: 6,
      image: 'https://images.pexels.com/photos/3735781/pexels-photo-3735781.jpeg?auto=compress&cs=tinysrgb&w=100',
      advPostName: 'Sri Sri Radha Madanmohan Iskcon Temple',
      userName: 'PRNV SERVICES',
      userType: 'User',
      status: false
    },
    {
      id: 7,
      image: 'https://images.pexels.com/photos/3768911/pexels-photo-3768911.jpeg?auto=compress&cs=tinysrgb&w=100',
      advPostName: 'Chiranjeevi Charitable Trust',
      userName: 'INAKOTI SANTHOSHI',
      userType: 'Provider',
      status: false
    }
  ]);

  const handleEdit = (id: number) => {
    if (onEdit) {
      onEdit(id);
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this advertisement post?')) {
      setPosts(posts.filter(post => post.id !== id));
    }
  };

  const handleStatusToggle = (id: number) => {
    setPosts(posts.map(post => 
      post.id === id ? { ...post, status: !post.status } : post
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">All Adv Posts</h1>
      </div>

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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ADV Post Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{post.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img 
                      src={post.image} 
                      alt={post.advPostName}
                      className="h-12 w-12 rounded object-cover"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{post.advPostName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{post.userName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{post.userType}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={post.status}
                        onChange={() => handleStatusToggle(post.id)}
                      />
                      <div className={`w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${post.status ? 'peer-checked:bg-green-500' : 'peer-checked:bg-blue-500'}`}></div>
                    </label>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handleEdit(post.id)}
                        className="text-green-600 hover:text-green-800"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(post.id)}
                        className="text-red-600 hover:text-red-800"
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

        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Showing 1 to 7 of 7 entries</span>
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

export default AdvertisementPosts;