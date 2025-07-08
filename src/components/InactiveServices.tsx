import React, { useState } from 'react';
import { RotateCcw, Filter, Eye, Calendar } from 'lucide-react';

const InactiveServices: React.FC = () => {
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    subCategory: '',
    serviceTitle: '',
    fromDate: '',
    toDate: ''
  });

  const inactiveServices = [
    {
      id: 1,
      name: 'bed room cleaning',
      category: 'Dishwasher Repair & Services',
      subCategory: 'Maintenance',
      amount: '₹500',
      date: '17 Aug 2023',
      status: false,
      image: 'https://images.pexels.com/photos/3768911/pexels-photo-3768911.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 2,
      name: 'Switch board repair',
      category: 'Electrician Services',
      subCategory: 'Switch and Socket',
      amount: '₹150',
      date: '08 Aug 2023',
      status: false,
      image: 'https://images.pexels.com/photos/3735781/pexels-photo-3735781.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 3,
      name: 'Fan regulator replacement',
      category: 'Electrician Services',
      subCategory: 'Fan Installation and Repair',
      amount: '₹150',
      date: '08 Aug 2023',
      status: false,
      image: 'https://images.pexels.com/photos/3768911/pexels-photo-3768911.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 4,
      name: 'Fan replacement',
      category: 'Electrician Services',
      subCategory: 'Fan Installation and Repair',
      amount: '₹250',
      date: '08 Aug 2023',
      status: false,
      image: 'https://images.pexels.com/photos/3735781/pexels-photo-3735781.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 5,
      name: 'PHOTO',
      category: 'Photography & Videography Services',
      subCategory: 'Wedding Photography & Videography',
      amount: '₹3459',
      date: '19 Jul 2023',
      status: false,
      image: 'https://images.pexels.com/photos/3768911/pexels-photo-3768911.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 6,
      name: 'Event Photography(1photographer, 1videographer-6hrs)',
      category: 'Photography & Videography Services',
      subCategory: 'Event Photography',
      amount: '₹65000',
      date: '11 Jul 2023',
      status: false,
      image: 'https://images.pexels.com/photos/3735781/pexels-photo-3735781.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 7,
      name: 'ac repair',
      category: 'Plumber Services',
      subCategory: 'Basin and Sink',
      amount: '₹650',
      date: '21 Jun 2023',
      status: false,
      image: 'https://images.pexels.com/photos/3768911/pexels-photo-3768911.jpeg?auto=compress&cs=tinysrgb&w=400'
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
        <h1 className="text-2xl font-bold text-gray-900">Inactive Service</h1>
        <div className="flex items-center space-x-2">
          <button 
            onClick={handleRefresh}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Refresh
          </button>
          <button 
            onClick={() => setShowFilter(!showFilter)}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl"
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
                <option value="dishwasher">Dishwasher Repair & Services</option>
                <option value="electrician">Electrician Services</option>
                <option value="photography">Photography & Videography Services</option>
                <option value="plumber">Plumber Services</option>
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
                <option value="maintenance">Maintenance</option>
                <option value="switch-socket">Switch and Socket</option>
                <option value="fan-repair">Fan Installation and Repair</option>
                <option value="wedding-photography">Wedding Photography & Videography</option>
                <option value="event-photography">Event Photography</option>
                <option value="basin-sink">Basin and Sink</option>
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
                <option value="bedroom-cleaning">Bed Room Cleaning</option>
                <option value="switch-repair">Switch Board Repair</option>
                <option value="fan-regulator">Fan Regulator Replacement</option>
                <option value="fan-replacement">Fan Replacement</option>
                <option value="photography">Photography</option>
                <option value="ac-repair">AC Repair</option>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {inactiveServices.map((service, index) => (
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
                  <td className="px-6 py-4 whitespace-nowrap">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked={service.status} />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                    </label>
                  </td>
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

export default InactiveServices;