import React from "react";
import { ArrowLeft, Users, Phone, MapPin, Building2, Map, BadgeCheck, CheckCircle, XCircle } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

// Interface for Technician data (same as in Technicians component)
interface Technician {
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
  admin: boolean;
  categoryServices: Array<{
    categoryServiceId: string;
    status: boolean;
    _id: string;
  }>;
  categoryCount: number;
}

const ViewTechnician = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const technician: Technician = location.state?.technician;

  if (!technician) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            Technician not found. Please go back and select a technician.
          </div>
          <button
            onClick={() => navigate("/management/technicians")}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Technicians
          </button>
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
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">View Technician</h1>
            </div>
          </div>
          <button
            onClick={() => navigate("/management/technicians")}
            className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to List
          </button>
        </div>

        {/* Technician Details Card */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 space-y-6">
          {/* Basic Info Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Users className="h-5 w-5 mr-2 text-blue-600" />
                Basic Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Technician Name</label>
                  <p className="text-lg font-semibold text-gray-900">{technician.username}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Technician ID</label>
                  <p className="text-sm text-gray-900 bg-gray-50 px-3 py-1 rounded-md">{technician.id}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                    technician.role === 'admin' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {technician.role}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Admin Status</label>
                  <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                    technician.admin ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {technician.admin ? 'Admin' : 'User'}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Phone className="h-5 w-5 mr-2 text-blue-600" />
                Contact Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <p className="text-lg text-gray-900 flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-gray-500" />
                    {technician.phoneNumber}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Address Section */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-blue-600" />
              Address
            </h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Building Name</label>
                  <p className="text-sm text-gray-900">{technician.buildingName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sub Area</label>
                  <p className="text-sm text-gray-900">{technician.subAreaName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Area</label>
                  <p className="text-sm text-gray-900">{technician.areaName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <p className="text-sm text-gray-900">{technician.city}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <p className="text-sm text-gray-900">{technician.state}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                  <p className="text-sm text-gray-900">{technician.pincode}</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Address</label>
                <p className="text-sm text-gray-900">{technician.fullAddress}</p>
              </div>
            </div>
          </div>

          {/* Category Services Section */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <BadgeCheck className="h-5 w-5 mr-2 text-blue-600" />
              Category Services ({technician.categoryCount})
            </h2>
            {technician.categoryServices.length === 0 ? (
              <div className="bg-gray-50 p-4 rounded-lg text-center text-gray-500">
                No category services assigned.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {technician.categoryServices.map((service, index) => (
                  <div key={service._id || index} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-gray-700">Category Service ID</label>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        service.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {service.status ? <CheckCircle className="h-3 w-3 mr-1" /> : <XCircle className="h-3 w-3 mr-1" />}
                        {service.status ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-900 break-all">{service.categoryServiceId}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewTechnician;