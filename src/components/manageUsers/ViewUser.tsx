import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Users, Phone, MapPin, User, Shield } from "lucide-react";

// Interface for User data
interface User {
  id: string;
  username: string;
  phoneNumber: string;
  role: string;
  buildingName: string;
  areaName: string;
  subAreaName: string;
  city: string;
  state: string;
  pincode: string;
  fullAddress: string;
}

const ViewUser = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user: User = location.state?.user;

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">User Not Found</h1>
            <p className="text-gray-500 mb-6">No user data available.</p>
            <button
              onClick={() => navigate("/management/users/all")}
              className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">View User</h1>
            </div>
          </div>
            <button
              onClick={() => navigate("/management/users/all")}
              className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
            >
              <ArrowLeft className="h-6 w-6" />
              back
            </button>
        </div>

        {/* User Details Card */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Basic Info Section */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User className="h-5 w-5 text-gray-500" />
              Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <p className="text-lg font-semibold text-gray-900">{user.username}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <p className="text-lg font-semibold text-gray-900">{user.phoneNumber}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                  user.role === 'admin' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {user.role}
                </span>
              </div>
            </div>
          </div>

          {/* Address Section */}
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-gray-500" />
              Address
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Building Name</label>
                <p className="text-gray-900">{user.buildingName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sub Area</label>
                <p className="text-gray-900">{user.subAreaName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Area</label>
                <p className="text-gray-900">{user.areaName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <p className="text-gray-900">{user.city}</p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                <p className="text-gray-900">{user.state}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                <p className="text-gray-900">{user.pincode}</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Address</label>
              <p className="text-gray-900 whitespace-pre-wrap">{user.fullAddress}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewUser;