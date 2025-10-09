import React from "react";
import { ArrowLeft, Users, Phone, MapPin, Building2, Map, BadgeCheck, CheckCircle, XCircle, Calendar, CreditCard, User } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

// Updated Interface for Technician data to match new structure
interface Technician {
  id: string;
  username: string;
  phoneNumber: string;
  role: string;
  userId: string;
  category?: string;
  buildingName: string;
  areaName: string;
  subAreaName: string;
  city: string;
  state: string;
  pincode: string;
  profileImage?: string;
  admin: boolean;
  description?: string;
  categoryServices: Array<{
    categoryServiceId: string;
    status: boolean;
    _id: string;
  }>;
  createdAt: string;
  techDetails: {
    categoryName: string;
    planDetails: {
      subscriptionId: string;
      subscriptionName: string;
      startDate: string;
      endDate: string;
      leads: number | null;
      ordersCount: number;
      _id: string;
    };
  };
  fullAddress: string;
}

const ViewTechnician = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const technician: Technician = location.state?.technician;

  if (!technician) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
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

  const currentSubscription = technician.techDetails.planDetails;
  // let isSubscriptionActive = false;

// if (currentSubscription) {
//   const notExpired = new Date(currentSubscription.endDate) > new Date();
//   const hasLeadsRemaining = currentSubscription.ordersCount === currentSubscription.leads || currentSubscription.leads === null;
//   isSubscriptionActive = notExpired && hasLeadsRemaining;
// }


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">View Technician</h1>
              <p className="text-sm text-gray-600">Detailed profile and information</p>
            </div>
          </div>
          <button
            onClick={() => navigate("/management/technicians")}
            className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </button>
        </div>

        {/* Profile Hero Section */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="flex-shrink-0">
              <img
                src={technician.profileImage || "https://img-new.cgtrader.com/items/4519471/f444ec0898/large/mechanic-avatar-3d-icon-3d-model-f444ec0898.jpg"}
                alt={technician.username}
                className="h-24 w-24 rounded-full object-cover border-4 border-blue-200"
              />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">{technician.username}</h2>
              <p className="text-sm text-gray-600 mb-4">Technician ID: {technician.userId}</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
                <span className={`flex justify-center items-center px-3 py-1 text-sm font-semibold rounded-full ${
                  technician.role === 'admin' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  <User className="h-3 w-3 mr-1" />
                  {technician.role}
                </span>
                <span className={`flex justify-center items-center px-3 py-1 text-sm font-semibold rounded-full ${
                  technician.admin ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {technician.admin ? <CheckCircle className="h-3 w-3 mr-1" /> : <XCircle className="h-3 w-3 mr-1" />}
                  {technician.admin ? 'Admin' : 'User'}
                </span>
                <span className="flex justify-center items-center px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-800">
                  <Calendar className="h-3 w-3 mr-1" />
                  Joined: {new Date(technician.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic & Contact Section */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Phone className="h-5 w-5 mr-2 text-blue-600" />
                Contact Information
              </h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-gray-500 flex-shrink-0" />
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <p className="text-lg text-gray-900">{technician.phoneNumber}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Category Section */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 space-y-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <BadgeCheck className="h-5 w-5 mr-2 text-blue-600" />
              Category
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Main Category</label>
                <p className="text-lg font-semibold text-gray-900">{technician.techDetails.categoryName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Services</label>
                <span className="inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-800">
                  {technician.categoryServices.length} Services
                </span>
              </div>
            </div>
          </div>

          {/* Address Section */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 space-y-6 lg:col-span-2">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-blue-600" />
              Address
            </h2>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="text-center md:text-left">
                  <label className="block text-sm font-medium text-gray-700 mb-1"><Building2 className="h-4 w-4 inline mr-1" />Building</label>
                  <p className="text-sm text-gray-900 font-medium">{technician.buildingName}</p>
                </div>
                <div className="text-center md:text-left">
                  <label className="block text-sm font-medium text-gray-700 mb-1"><Map className="h-4 w-4 inline mr-1" />Sub Area</label>
                  <p className="text-sm text-gray-900">{technician.subAreaName}</p>
                </div>
                <div className="text-center md:text-left">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Area</label>
                  <p className="text-sm text-gray-900">{technician.areaName}</p>
                </div>
                <div className="text-center md:text-left">
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <p className="text-sm text-gray-900">{technician.city}</p>
                </div>
                <div className="text-center md:text-left">
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <p className="text-sm text-gray-900">{technician.state}</p>
                </div>
                <div className="text-center md:text-left">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                  <p className="text-sm text-gray-900">{technician.pincode}</p>
                </div>
              </div>
              <div className="border-t border-gray-200 pt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Address</label>
                <p className="text-sm text-gray-900 italic">{technician.fullAddress}</p>
              </div>
            </div>
          </div>

          {/* Subscription Section */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 space-y-6 lg:col-span-2">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <CreditCard className="h-5 w-5 mr-2 text-blue-600" />
              Subscription Plans
            </h2>
            {currentSubscription ? (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{currentSubscription.subscriptionName}</h3>
                    {/* <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                      isSubscriptionActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {isSubscriptionActive ? <CheckCircle className="h-3 w-3 mr-1" /> : <XCircle className="h-3 w-3 mr-1" />}
                      {isSubscriptionActive ? 'Active' : 'Expired'}
                    </span> */}
                  </div>
                  <div className="text-sm text-gray-600 mt-2 md:mt-0">
                    Plan ID: {currentSubscription.subscriptionId}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1 flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      Start Date
                    </label>
                    <p className="text-gray-900">{new Date(currentSubscription.startDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1 flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      End Date
                    </label>
                    <p className="text-gray-900">{currentSubscription.endDate ? new Date(currentSubscription.endDate).toLocaleDateString() : 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Leads</label>
                    <p className="text-gray-900">{currentSubscription.leads ?? 'Unlimited'}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Orders Count</label>
                    <p className="text-gray-900">{currentSubscription.ordersCount}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 p-6 rounded-lg text-center text-gray-500">
                No active subscription found.
              </div>
            )}
          </div>

          {/* Category Services Section */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 space-y-6 lg:col-span-2">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <BadgeCheck className="h-5 w-5 mr-2 text-blue-600" />
              Assigned Services ({technician.categoryServices.length})
            </h2>
            {technician.categoryServices.length === 0 ? (
              <div className="bg-gray-50 p-4 rounded-lg text-center text-gray-500">
                No category services assigned.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {technician.categoryServices.map((service, index) => (
                  <div key={service._id || index} className="bg-gray-50 p-4 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-medium text-gray-700">Service ID</label>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        service.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {service.status ? <CheckCircle className="h-3 w-3 mr-1" /> : <XCircle className="h-3 w-3 mr-1" />}
                        {service.status ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-900 break-all font-mono bg-white p-2 rounded text-center">{service.categoryServiceId}</p>
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