import React, { useState } from 'react';
import { RotateCcw } from 'lucide-react';

const WorkGallery: React.FC = () => {
  const workGalleryData = [
    {
      id: 11,
      providerEmail: 'zameer0212khan@gmail.com',
      providerName: 'Zameer Mohammed Khan',
      gallery: 'uploads/workgallery/IMG-20230306-WA0041.jpg',
      status: 'approved',
      rejectReason: '',
      date: '13 Jul 2023'
    },
    {
      id: 12,
      providerEmail: 'zameer0212khan@gmail.com',
      providerName: 'Zameer Mohammed Khan',
      gallery: 'uploads/workgallery/IMG-20230306-WA0036.jpg',
      status: 'approved',
      rejectReason: '',
      date: '13 Jul 2023'
    },
    {
      id: 13,
      providerEmail: 'zameer0212khan@gmail.com',
      providerName: 'Zameer Mohammed Khan',
      gallery: 'uploads/workgallery/IMG-20230306-WA0029.jpg',
      status: 'approved',
      rejectReason: '',
      date: '13 Jul 2023'
    },
    {
      id: 14,
      providerEmail: 'zameer0212khan@gmail.com',
      providerName: 'Zameer Mohammed Khan',
      gallery: 'uploads/workgallery/IMG-20230306-WA0026.jpg',
      status: 'approved',
      rejectReason: '',
      date: '13 Jul 2023'
    },
    {
      id: 15,
      providerEmail: 'zameer0212khan@gmail.com',
      providerName: 'Zameer Mohammed Khan',
      gallery: 'uploads/workgallery/IMG-20190320-WA0029.jpg',
      status: 'approved',
      rejectReason: '',
      date: '13 Jul 2023'
    },
    {
      id: 16,
      providerEmail: 'zameer0212khan@gmail.com',
      providerName: 'Zameer Mohammed Khan',
      gallery: 'uploads/workgallery/IMG-20190401-WA0001.jpg',
      status: 'approved',
      rejectReason: '',
      date: '13 Jul 2023'
    }
  ];

  const handleRefresh = () => {
    console.log('Refreshing work gallery...');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Work Gallery</h1>
        <button 
          onClick={handleRefresh}
          className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Refresh
        </button>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Provider Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Provider Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gallery</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reject Reason</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {workGalleryData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.providerEmail}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.providerName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img 
                      src="https://images.pexels.com/photos/3768911/pexels-photo-3768911.jpeg?auto=compress&cs=tinysrgb&w=100" 
                      alt="Gallery"
                      className="h-12 w-12 rounded object-cover"
                    />
                    <div className="text-xs text-gray-500 mt-1">{item.gallery}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.status}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">-</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.rejectReason || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default WorkGallery;