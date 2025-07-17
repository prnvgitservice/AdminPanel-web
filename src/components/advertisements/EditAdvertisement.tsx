import React, { useState } from 'react';
import { ArrowLeft, Upload } from 'lucide-react';

interface EditAdvertisementProps {
  onBack: () => void;
}

const EditAdvertisement: React.FC<EditAdvertisementProps> = ({ onBack }) => {
  const [formData, setFormData] = useState({
    advertisementName: 'sri',
    description: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Advertisement updated:', formData);
    alert('Advertisement updated successfully!');
    onBack();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Admin Edit Adv Post</h1>
        <button
          onClick={onBack}
          className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Advertisement Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Advertisement Information</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Advertisement Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="advertisementName"
              value={formData.advertisementName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        {/* Details Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Details Information</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Descriptions</label>
            <div className="border border-gray-300 rounded-md">
              {/* Rich text editor toolbar */}
              <div className="border-b border-gray-300 p-2 bg-gray-50">
                <div className="flex items-center space-x-2 text-sm">
                  <button type="button" className="px-2 py-1 hover:bg-gray-200 rounded">B</button>
                  <button type="button" className="px-2 py-1 hover:bg-gray-200 rounded italic">I</button>
                  <button type="button" className="px-2 py-1 hover:bg-gray-200 rounded underline">U</button>
                  <span className="text-gray-400">|</span>
                  <select className="text-sm border-none bg-transparent">
                    <option>Styles</option>
                  </select>
                  <select className="text-sm border-none bg-transparent">
                    <option>Format</option>
                  </select>
                </div>
              </div>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={8}
                className="w-full px-3 py-2 border-none focus:outline-none resize-none"
                placeholder="Enter description..."
              />
            </div>
          </div>
        </div>

        {/* Advertisement Image */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Advertisement Image</h2>
          
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">Upload Advertisement Images <span className="text-red-500">*</span></p>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="advertisement-image"
              />
              <label
                htmlFor="advertisement-image"
                className="inline-flex items-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 cursor-pointer"
              >
                Choose File
              </label>
            </div>

            {/* Current Image */}
            <div className="flex items-center space-x-4">
              <img 
                src="https://images.pexels.com/photos/3768911/pexels-photo-3768911.jpeg?auto=compress&cs=tinysrgb&w=150" 
                alt="Current advertisement"
                className="h-20 w-20 rounded object-cover"
              />
              <span className="text-sm text-gray-600">Current Image</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-md hover:from-blue-600 hover:to-blue-700"
          >
            Back
          </button>
          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={onBack}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              Save Changes
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditAdvertisement;