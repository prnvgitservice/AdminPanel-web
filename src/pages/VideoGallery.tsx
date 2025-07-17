import React, { useState } from 'react';
import { RotateCcw } from 'lucide-react';

const VideoGallery: React.FC = () => {
  const videoGalleryData = [
    {
      id: 1,
      providerEmail: 'santhoshimathaprnv@gmail.com',
      providerName: 'INAKOTI SANTHOSHI',
      videoUrl: 'https://www.youtube.com/watch?v=6e4RfhrEGY',
      status: 'approved',
      rejectReason: '',
      date: '22 Aug 2023'
    },
    {
      id: 2,
      providerEmail: 'sri123@gmail.com',
      providerName: 'sri',
      videoUrl: 'https://www.youtube.com/watch?v=QU9co053UAU',
      status: 'approved',
      rejectReason: '',
      date: '25 Aug 2023'
    },
    {
      id: 3,
      providerEmail: 'sri123@gmail.com',
      providerName: 'sri',
      videoUrl: 'https://www.youtube.com/watch?v=-5q5mZbe3V8',
      status: 'approved',
      rejectReason: '',
      date: '25 Aug 2023'
    },
    {
      id: 4,
      providerEmail: 'sri123@gmail.com',
      providerName: 'sri',
      videoUrl: 'https://www.youtube.com/watch?v=-5q5mZbe3V8',
      status: 'approved',
      rejectReason: '',
      date: '25 Aug 2023'
    }
  ];

  const handleRefresh = () => {
    console.log('Refreshing video gallery...');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Video Gallery</h1>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Video URL</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reject Reason</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {videoGalleryData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.providerEmail}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.providerName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:text-blue-800">
                    <a href={item.videoUrl} target="_blank" rel="noopener noreferrer">
                      {item.videoUrl}
                    </a>
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

        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Showing 1 to 4 of 4 entries</span>
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

export default VideoGallery;