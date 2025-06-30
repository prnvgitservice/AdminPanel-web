import React, { useState } from 'react';
import { RotateCcw, Filter, Eye, Calendar } from 'lucide-react';

const DeletedServices: React.FC = () => {
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    subCategory: '',
    serviceTitle: '',
    fromDate: '',
    toDate: ''
  });

  const deletedServices = [
    {
      id: 1,
      name: 'test',
      category: 'Lift Repair & Services',
      subCategory: 'Services',
      amount: '₹1000',
      date: '14 Jun 2024',
      deletedReason: '',
      image: 'https://images.pexels.com/photos/3768911/pexels-photo-3768911.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 2,
      name: 'Residential House Cleaning',
      category: 'Deep Cleaning Services',
      subCategory: 'Bedroom Cleaning',
      amount: '₹200',
      date: '22 Jul 2023',
      deletedReason: 'frhgtrg',
      image: 'https://images.pexels.com/photos/3735781/pexels-photo-3735781.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 3,
      name: 'Baby pamper, care and play',
      category: 'Babysitting Services',
      subCategory: 'Baby Care',
      amount: '₹4500',
      date: '12 Jul 2023',
      deletedReason: '',
      image: 'https://images.pexels.com/photos/3768911/pexels-photo-3768911.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 4,
      name: 'BABY CARE(per day)',
      category: 'Babysitting Services',
      subCategory: 'Child Care Services',
      amount: '₹3500',
      date: '12 Jul 2023',
      deletedReason: '',
      image: 'https://images.pexels.com/photos/3735781/pexels-photo-3735781.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 5,
      name: 'DRONE PHOTO and VIDEOGRAPHY',
      category: 'Photography & Videography Services',
      subCategory: 'Drone Videography',
      amount: '₹75000',
      date: '04 Jul 2023',
      deletedReason: '',
      image: 'https://images.pexels.com/photos/3768911/pexels-photo-3768911.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 6,
      name: 'BUNGLAW PAINTING',
      category: 'Painting Services',
      subCategory: 'House Painting',
      amount: '₹400',
      date: '29 Jun 2023',
      deletedReason: '',
      image: 'https://images.pexels.com/photos/3735781/pexels-photo-3735781.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
  ];

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRefresh = () => {
    setShowFilter(false);
    setFilters({
      category: '',
      subCategory: '',
      serviceTitle: '',
      fromDate: '',
      toDate: ''
    });
  };

  const handleFilterSubmit = () => {
    console.log('Applying filters:', filters);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Deleted Services</h1>
        <div className="flex items-center space-x-2">
          <button 
            onClick={handleRefresh}
            className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Refresh
          </button>
          <button 
            onClick={() => setShowFilter(!showFilter)}
            className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </button>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilter && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">Select category</option>
                <option value="lift-repair">Lift Repair & Services</option>
                <option value="deep-cleaning">Deep Cleaning Services</option>
                <option value="babysitting">Babysitting Services</option>
                <option value="photography">Photography & Videography Services</option>
                <option value="painting">Painting Services</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sub Category</label>
              <select
                value={filters.subCategory}
                onChange={(e) => handleFilterChange('subCategory', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">Select subcategory</option>
                <option value="services">Services</option>
                <option value="bedroom-cleaning">Bedroom Cleaning</option>
                <option value="baby-care">Baby Care</option>
                <option value="child-care">Child Care Services</option>
                <option value="drone-videography">Drone Videography</option>
                <option value="house-painting">House Painting</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Service Title</label>
              <select
                value={filters.serviceTitle}
                onChange={(e) => handleFilterChange('serviceTitle', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">Select service</option>
                <option value="test">Test</option>
                <option value="house-cleaning">Residential House Cleaning</option>
                <option value="baby-care">Baby Care</option>
                <option value="drone-photography">Drone Photography</option>
                <option value="painting">Painting</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
              <div className="relative">
                <input
                  type="date"
                  value={filters.fromDate}
                  onChange={(e) => handleFilterChange('fromDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
                <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
              <div className="relative">
                <input
                  type="date"
                  value={filters.toDate}
                  onChange={(e) => handleFilterChange('toDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
                <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
          
          <div className="flex justify-center">
            <button
              onClick={handleFilterSubmit}
              className="px-8 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
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
                placeholder="Search services..."
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Services</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sub Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deleted Reason</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {deletedServices.map((service, index) => (
                <tr key={service.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img 
                        src={service.image} 
                        alt={service.name}
                        className="h-10 w-10 rounded-lg object-cover mr-3"
                      />
                      <span className="text-sm font-medium text-gray-900">{service.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{service.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{service.subCategory}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{service.amount}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{service.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{service.deletedReason || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button className="text-green-600 hover:text-green-800">
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DeletedServices;