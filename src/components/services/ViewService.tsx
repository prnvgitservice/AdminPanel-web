import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Wrench } from "lucide-react";

interface Service {
  id: string;
  category: string;
  name: string;
  price: number;
  image: string;
  technicianName: string;
  discount: string;
  createdAt: string;
}

const ViewService: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const service = state?.service as Service | undefined;

  // Simulate loading and error states (no context used as per non-integrated approach)
  const loading = false;
  const error = service ? null : "No service data available.";

  if (loading) {
    return (
      <div className="text-center py-6 text-gray-600">Loading service...</div>
    );
  }

  if (error) {
    return <div className="text-center py-6 text-red-600">{error}</div>;
  }

  if (!service) {
    return (
      <div className="text-center py-6 text-red-600">
        No service data available. Please select a service.
      </div>
    );
  }

  // Format discount for display
  const formatDiscount = (discount: string) => {
    if (!discount) return "No discount";
    return discount.includes("%") ? `${discount} off` : `$${discount} off`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-md">
              <Wrench className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
              {service.name}
            </h1>
          </div>
          <button
            onClick={() => navigate("/services/all")}
            className="flex items-center px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-md hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </button>
        </div>

        {/* Service Details Card */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
          <div className="relative">
            <div className="flex justify-center items-center">
              <img
                src={service.image}
                alt={service.name}
                className="max-w-2xl h-40 rounded-md mb-4 object-cover"
                onError={(e) => {
                  e.currentTarget.src = "https://via.placeholder.com/150?text=Image+Not+Found";
                }}
              />
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-medium text-gray-700">Service Name</h2>
                <p className="text-gray-900 font-semibold">{service.name}</p>
              </div>
              <div className="text-sm text-gray-500">
                {new Date(service.createdAt).toLocaleDateString("en-GB")}
              </div>
            </div>

            <div>
              <h2 className="text-sm font-bold text-gray-700">Category</h2>
              <p className="text-gray-900">{service.category}</p>
            </div>

            <div>
              <h2 className="text-sm font-bold text-gray-700">Price</h2>
              <p className="text-gray-900">${service.price.toFixed(2)}</p>
            </div>

            <div>
              <h2 className="text-sm font-bold text-gray-700">Discount</h2>
              <p className="text-gray-900">{formatDiscount(service.discount)}</p>
            </div>

            <div>
              <h2 className="text-sm font-bold text-gray-700">Technician</h2>
              <p className="text-gray-900">{service.technicianName}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewService;