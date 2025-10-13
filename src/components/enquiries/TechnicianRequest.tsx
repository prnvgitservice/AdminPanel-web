import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Eye,
  CheckCircle,
  Clock,
  XCircle,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
} from "lucide-react";
import {
  getAllTechRequest,
  updateTechnicianStatus,
} from "../../api/apiMethods";

interface AuthorizedPerson {
  phone: string;
  photo: string;
  _id: string;
}

interface CategoryService {
  categoryServiceId: string;
  status: boolean;
  _id: string;
}

interface PlanDetails {
  subscriptionId: string;
  subscriptionName: string;
  startDate: string;
  endDate: string | null;
  leads: number | null;
  ordersCount: number;
  _id: string;
}

interface TechDetails {
  categoryName: string;
  planDetails: PlanDetails;
}

interface Technician {
  id: string;
  username: string;
  phoneNumber: string;
  role: string;
  userId: string;
  category: string;
  buildingName: string;
  areaName: string;
  subAreaName: string;
  city: string;
  state: string;
  pincode: string;
  profileImage: string;
  admin: boolean;
  status: "requested" | "registered" | "declined";
  authorizedPersons: AuthorizedPerson[];
  aadharBack: string | null;
  aadharFront: string | null;
  voterCard: string | null;
  panCard: string | null;
  description: string;
  categoryServices: CategoryService[];
  createdAt: string;
  techDetails: TechDetails;
  franchiseId?: string | null;
  service?: string;
  franchiseAccount?: any;
}

interface ApiResponse {
  success: boolean;
  total: number;
  offset: number;
  limit: number;
  technicians: Technician[];
}

// Modal Component for View Details
const TechnicianDetailsModal: React.FC<{
  technician: Technician;
  isOpen: boolean;
  onClose: () => void;
}> = ({ technician, isOpen, onClose }) => {
  if (!isOpen) return null;

  const planDetails = technician.techDetails.planDetails;
  const leads = planDetails.leads ?? 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Technician Details
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <img
                src={
                  technician.profileImage
                    ? technician.profileImage
                    : "https://img-new.cgtrader.com/items/4519471/f444ec0898/large/mechanic-avatar-3d-icon-3d-model-f444ec0898.jpg"
                }
                alt={technician.username}
                className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-blue-200"
              />
              <div>
                <h3 className="text-xl font-semibold text-gray-800">
                  {technician.username}
                </h3>
                <p className="text-gray-600">ID: {technician.userId}</p>
                <p className="text-gray-600">Phone: {technician.phoneNumber}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Location</p>
                <p className="text-gray-800">
                  {technician.buildingName}, {technician.areaName},{" "}
                  {technician.subAreaName}
                </p>
                <p className="text-gray-600">
                  {technician.city}, {technician.state} - {technician.pincode}
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Category</p>
                <p className="text-gray-800">
                  {technician.techDetails.categoryName}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Services ({technician.categoryServices.length})
                </p>
                <ul className="text-gray-600 space-y-1">
                  {technician.categoryServices.slice(0, 5).map((svc, idx) => (
                    <li key={idx} className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Service ID: {svc.categoryServiceId}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm font-medium text-blue-800">
                  Subscription: {planDetails.subscriptionName}
                </p>
                <p className="text-sm text-blue-600">
                  Leads: {leads} | Orders: {planDetails.ordersCount}
                </p>
              </div>
              {technician.authorizedPersons.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Authorized Persons
                  </p>
                  <div className="space-y-2">
                    {technician.authorizedPersons.map((person, idx) => (
                      <div
                        key={idx}
                        className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg"
                      >
                        <img
                          src={person.photo}
                          alt={`Authorized Person ${idx + 1}`}
                          className="w-12 h-12 rounded-full object-cover border border-gray-200"
                        />
                        <span className="text-gray-600 text-sm">
                          Phone: {person.phone}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="font-semibold text-gray-800 mb-4">Documents</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {technician.aadharFront && (
                <img
                  src={technician.aadharFront}
                  alt="Aadhar Front"
                  className="w-full max-w-md h-auto object-contain rounded border border-gray-300 shadow-sm"
                />
              )}
              {technician.aadharBack && (
                <img
                  src={technician.aadharBack}
                  alt="Aadhar Back"
                  className="w-full max-w-md h-auto object-contain rounded border border-gray-300 shadow-sm"
                />
              )}
              {technician.panCard && (
                <img
                  src={technician.panCard}
                  alt="PAN Card"
                  className="w-full max-w-md h-auto object-contain rounded border border-gray-300 shadow-sm"
                />
              )}
              {technician.voterCard && (
                <img
                  src={technician.voterCard}
                  alt="Voter Card"
                  className="w-full max-w-md h-auto object-contain rounded border border-gray-300 shadow-sm"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TechnicianRequest: React.FC = () => {
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<
    "all" | "requested" | "registered" | "declined"
  >("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState<number>(6);
  const [offset, setOffset] = useState<number>(0);
  const [selectedTechnician, setSelectedTechnician] =
    useState<Technician | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingIds, setLoadingIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  const fetchPage = async () => {
    if (loading) return;
    setLoading(true);
    try {
      // Server-side pagination with offset and limit
      const params: any = { offset, limit };
      const response = (await getAllTechRequest(params)) as ApiResponse;
      if (response.success) {
        setTechnicians(response.technicians);
        setTotal(response.total);
      }
    } catch (error) {
      console.error("Failed to fetch technicians:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when offset or limit changes
  useEffect(() => {
    fetchPage();
  }, [offset, limit]);

  // Update offset when currentPage or limit changes
  useEffect(() => {
    setOffset((currentPage - 1) * limit);
  }, [currentPage, limit]);

  // Client-side filtering based on search and status
  const filteredTechnicians = technicians.filter((technician) => {
    const matchesSearch =
      technician.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      technician.phoneNumber.includes(searchTerm);

    const matchesStatus =
      selectedStatus === "all" || technician.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(total / limit);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleStatusUpdate = async (
    id: string,
    status: "registered" | "declined"
  ) => {
    setLoadingIds((prev) => new Set([...prev, id]));
    try {
      // Call the update API
      const response = await updateTechnicianStatus({
        technicianId: id,
        status,
      });

      if (response.success) {
        // Send WhatsApp message based on status
        sendWhatsAppMessage(response.data, status);

        fetchPage();
      } else {
        alert("Something went wrong while updating status");
      }
    } catch (error) {
      console.error("Failed to update status:", error);
      // Optionally show an error message to the user
    } finally {
      setLoadingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  // Function to send WhatsApp message
  const sendWhatsAppMessage = (
    technicianData: any,
    status: "registered" | "declined"
  ) => {
    const phoneNumber = technicianData.phoneNumber;
    const technicianName = technicianData.username;
    const userId = technicianData.userId;
    const city = technicianData.city;

    let message = "";

    if (status === "registered") {
      message = `Dear ${technicianName},

🎉 Congratulations! Your technician registration has been successfully approved!

🔹 Your Technician ID: ${userId}
🔹 Location: ${city}
🔹 Status: Registered

You can now start accepting service requests and growing your business through our platform.

Welcome to our team! We're excited to have you on board.

Best regards,
Prnv Service`;
    } else if (status === "declined") {
      message = `Dear ${technicianName},

We regret to inform you that your technician registration application has been declined at this time.

🔹 Application ID: ${userId}
🔹 Reason: Could not meet current requirements

We understand this news may be disappointing. We encourage you to:
• Review our requirements
• Update your documentation
• Reapply after 30 days

If you have any questions, please contact our support team.

Thank you for your interest in working with us.

Best regards,
Prnv Service`;
    }

    // Use your existing function to open WhatsApp
    openWhatsApp(phoneNumber, message);
  };

  // Your existing function
  const openWhatsApp = (number: string, message: string) => {
    const url = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank"); // opens in new tab
  };

  // const handleStatusUpdate = async (id: string, status: 'registered' | 'declined') => {
  //   setLoadingIds((prev) => new Set([...prev, id]));
  //   try {
  //     // Call the update API
  //     const response = await updateTechnicianStatus({ technicianId: id, status });

  //     if (response.success) {
  //       fetchPage()

  //     } else {
  //       alert("something went wrong to update status")
  //       // Optionally show an error message to the user
  //     }
  //   } catch (error) {
  //     console.error('Failed to update status:', error);
  //     // Optionally show an error message to the user
  //   } finally {
  //     setLoadingIds((prev) => {
  //       const newSet = new Set(prev);
  //       newSet.delete(id);
  //       return newSet;
  //     });
  //   }
  // };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "registered":
        return "bg-green-100 text-green-800 border-green-200";
      case "requested":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "declined":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "registered":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "requested":
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case "declined":
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const renderPageButtons = () => {
    const pages: number[] = [];
    const startPage = Math.max(1, currentPage - 1);
    const endPage = Math.min(totalPages, currentPage + 1);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages.map((page) => (
      <button
        key={page}
        onClick={() => handlePageChange(page)}
        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
          page === currentPage
            ? "bg-blue-600 text-white"
            : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
        }`}
      >
        {page}
      </button>
    ));
  };

  if (loading && technicians.length === 0) {
    return (
      <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading technicians...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Technician Requests
          </h1>
          <p className="text-gray-600 mt-2">
            Manage and approve technician registrations.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by username or phone number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={selectedStatus}
              onChange={(e) =>
                setSelectedStatus(
                  e.target.value as
                    | "all"
                    | "requested"
                    | "registered"
                    | "declined"
                )
              }
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="requested">Requested</option>
              <option value="registered">Registered</option>
              <option value="declined">Declined</option>
            </select>
            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setCurrentPage(1); // Reset to first page when limit changes
              }}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={6}>6 per page</option>
              <option value={12}>12 per page</option>
              <option value={60}>60 per page</option>
              <option value={100}>100 per page</option>
            </select>
          </div>
        </div>

        {/* Active Technicians Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredTechnicians.map((technician) => {
            const status = technician.status;
            const planDetails = technician.techDetails.planDetails;
            const isActionable = status === "requested";
            const isLoading = loadingIds.has(technician.id);

            return (
              <div
                key={technician.id}
                className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          technician.profileImage
                            ? technician.profileImage
                            : "https://img-new.cgtrader.com/items/4519471/f444ec0898/large/mechanic-avatar-3d-icon-3d-model-f444ec0898.jpg"
                        }
                        alt={technician.username}
                        className="w-16 h-16 rounded-full object-cover border-2 border-blue-200"
                      />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {technician.username}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {technician.phoneNumber}
                        </p>
                      </div>
                    </div>
                    <div
                      className={`px-3 py-1 rounded-full border text-xs font-medium flex items-center gap-1 ${getStatusColor(
                        status
                      )}`}
                    >
                      {getStatusIcon(status)}
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-sm">
                      <svg
                        className="w-4 h-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <span className="text-gray-800">
                        {technician.areaName}, {technician.city}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <svg
                        className="w-4 h-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="text-gray-800">
                        {planDetails.subscriptionName}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      Services: {technician.categoryServices.length}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => {
                        setSelectedTechnician(technician);
                        setIsModalOpen(true);
                      }}
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>

                    {isActionable && (
                      <>
                        <button
                          onClick={() =>
                            handleStatusUpdate(technician.id, "registered")
                          }
                          disabled={isLoading}
                          className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 text-sm font-medium disabled:opacity-50"
                        >
                          {isLoading ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <CheckCircle className="w-4 h-4" />
                          )}
                          Approve
                        </button>
                        <button
                          onClick={() =>
                            handleStatusUpdate(technician.id, "declined")
                          }
                          disabled={isLoading}
                          className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2 text-sm font-medium disabled:opacity-50"
                        >
                          {isLoading ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <XCircle className="w-4 h-4" />
                          )}
                          Decline
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination - Based on server-side total */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-2 text-sm text-gray-700">
              <span>
                Showing {Math.min(offset + 1, total)} to{" "}
                {Math.min(offset + limit, total)} of {total} results
              </span>
              <span className="text-gray-500">
                (Filtered: {filteredTechnicians.length} of {technicians.length})
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 rounded-md border border-gray-300"
              >
                <ChevronsLeft className="w-4 h-4" />
                First
              </button>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 rounded-md border border-gray-300"
              >
                <ChevronLeft className="w-4 h-4" />
                Prev
              </button>
              {renderPageButtons()}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 rounded-md border border-gray-300"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 rounded-md border border-gray-300"
              >
                Last
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {filteredTechnicians.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {technicians.length === 0
                ? "No technicians found"
                : "No matching technicians"}
            </h3>
            <p className="text-gray-600">
              {technicians.length === 0
                ? "There are no technician requests at the moment."
                : "Try adjusting your search or filter criteria."}
            </p>
          </div>
        )}

        {/* Modal */}
        {selectedTechnician && (
          <TechnicianDetailsModal
            technician={selectedTechnician}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default TechnicianRequest;
// import React, { useState, useEffect } from 'react';
// import { Search, Filter, Eye, CheckCircle, Clock, ChevronLeft, ChevronRight, ChevronsLeft } from 'lucide-react'; // Assuming Lucide React icons are installed
// import { getAllTechRequest } from '../../api/apiMethods';

// // Assume the API function is imported
// // import { getAllTechRequest } from './api'; // Replace with actual import

// // Interfaces based on provided API response structure
// interface AuthorizedPerson {
//   phone: string;
//   photo: string;
//   _id: string;
// }

// interface CategoryService {
//   categoryServiceId: string;
//   status: boolean;
//   _id: string;
// }

// interface PlanDetails {
//   subscriptionId: string;
//   subscriptionName: string;
//   startDate: string;
//   endDate: string | null;
//   leads: number | null;
//   ordersCount: number;
//   _id: string;
// }

// interface TechDetails {
//   categoryName: string;
//   planDetails: PlanDetails;
// }

// interface Technician {
//   id: string;
//   username: string;
//   phoneNumber: string;
//   role: string;
//   userId: string;
//   category: string;
//   buildingName: string;
//   areaName: string;
//   subAreaName: string;
//   city: string;
//   state: string;
//   pincode: string;
//   profileImage: string;
//   admin: boolean;
//   status: 'requested' | 'registered';
//   authorizedPersons: AuthorizedPerson[];
//   aadharBack: string | null;
//   aadharFront: string | null;
//   voterCard: string | null;
//   panCard: string | null;
//   description: string;
//   categoryServices: CategoryService[];
//   createdAt: string;
//   techDetails: TechDetails;
//   franchiseId?: string | null;
//   service?: string;
//   franchiseAccount?: any;
// }

// interface ApiResponse {
//   success: boolean;
//   total: number;
//   offset: number;
//   limit: number;
//   technicians: Technician[];
// }

// // Modal Component for View Details
// const TechnicianDetailsModal: React.FC<{ technician: Technician; isOpen: boolean; onClose: () => void }> = ({
//   technician,
//   isOpen,
//   onClose,
// }) => {
//   if (!isOpen) return null;

//   const planDetails = technician.techDetails.planDetails;
//   const leads = planDetails.leads ?? 0;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
//         <div className="p-6">
//           <div className="flex justify-between items-center mb-6">
//             <h2 className="text-2xl font-bold text-gray-800">Technician Details</h2>
//             <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
//               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//               </svg>
//             </button>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="space-y-4">
//               <img src={technician.profileImage} alt={technician.username} className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-blue-200" />
//               <div>
//                 <h3 className="text-xl font-semibold text-gray-800">{technician.username}</h3>
//                 <p className="text-gray-600">ID: {technician.userId}</p>
//                 <p className="text-gray-600">Phone: {technician.phoneNumber}</p>
//               </div>
//               <div>
//                 <p className="text-sm font-medium text-gray-500">Location</p>
//                 <p className="text-gray-800">{technician.buildingName}, {technician.areaName}, {technician.subAreaName}</p>
//                 <p className="text-gray-600">{technician.city}, {technician.state} - {technician.pincode}</p>
//               </div>
//             </div>
//             <div className="space-y-4">
//               <div>
//                 <p className="text-sm font-medium text-gray-500">Category</p>
//                 <p className="text-gray-800">{technician.techDetails.categoryName}</p>
//               </div>
//               <div>
//                 <p className="text-sm font-medium text-gray-500">Services ({technician.categoryServices.length})</p>
//                 <ul className="text-gray-600 space-y-1">
//                   {technician.categoryServices.slice(0, 5).map((svc, idx) => (
//                     <li key={idx} className="flex items-center">
//                       <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
//                       Service ID: {svc.categoryServiceId}
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//               <div className="bg-blue-50 p-3 rounded-lg">
//                 <p className="text-sm font-medium text-blue-800">Subscription: {planDetails.subscriptionName}</p>
//                 <p className="text-sm text-blue-600">Leads: {leads} | Orders: {planDetails.ordersCount}</p>
//               </div>
//               {technician.authorizedPersons.length > 0 && (
//                 <div>
//                   <p className="text-sm font-medium text-gray-500">Authorized Persons</p>
//                   <div className="space-y-2">
//                     {technician.authorizedPersons.map((person, idx) => (
//                       <div key={idx} className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
//                         <img src={person.photo} alt={`Authorized Person ${idx + 1}`} className="w-12 h-12 rounded-full object-cover border border-gray-200" />
//                         <span className="text-gray-600 text-sm">Phone: {person.phone}</span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//           <div className="mt-6 pt-6 border-t border-gray-200">
//             <h4 className="font-semibold text-gray-800 mb-4">Documents</h4>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {technician.aadharFront && <img src={technician.aadharFront} alt="Aadhar Front" className="w-full max-w-md h-auto object-contain rounded border border-gray-300 shadow-sm" />}
//               {technician.aadharBack && <img src={technician.aadharBack} alt="Aadhar Back" className="w-full max-w-md h-auto object-contain rounded border border-gray-300 shadow-sm" />}
//               {technician.panCard && <img src={technician.panCard} alt="PAN Card" className="w-full max-w-md h-auto object-contain rounded border border-gray-300 shadow-sm" />}
//               {technician.voterCard && <img src={technician.voterCard} alt="Voter Card" className="w-full max-w-md h-auto object-contain rounded border border-gray-300 shadow-sm" />}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const TechnicianRequest: React.FC = () => {
//   const [technicians, setTechnicians] = useState<Technician[]>([]);
//   const [total, setTotal] = useState<number>(0);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedStatus, setSelectedStatus] = useState<'all' | 'requested' | 'registered'>('all');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [limit, setLimit] = useState<number>(6);
//   const [offset, setOffset] = useState<number>(0);
//   const [selectedTechnician, setSelectedTechnician] = useState<Technician | null>(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [loadingIds, setLoadingIds] = useState<Set<string>>(new Set());
//   const [loading, setLoading] = useState(false);

//   const fetchPage = async () => {
//     if (loading) return;
//     setLoading(true);
//     try {
//       // Prepare params for server-side filtering and pagination
//       const params: any = { offset, limit };
//       const response = await getAllTechRequest(params) as ApiResponse;
//       if (response.success) {
//         setTechnicians(response.technicians);
//         setTotal(response.total);
//       }
//     } catch (error) {
//       console.error('Failed to fetch technicians:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch data when offset, limit, search, or status changes
//   useEffect(() => {
//     fetchPage();
//   }, [offset, limit]);

//   // Update offset when currentPage or limit changes
//   useEffect(() => {
//     setOffset((currentPage - 1) * limit);
//   }, [currentPage, limit]);

//   const totalPages = Math.ceil(total / limit);
//   const paginatedTechnicians = technicians;

//   const handlePageChange = (page: number) => {
//     setCurrentPage(page);
//   };

//   const handleStatusUpdate = async (id: string) => {
//     setLoadingIds((prev) => new Set([...prev, id]));
//     try {
//       // Simulate API call delay - replace with actual approve API
//       await new Promise(resolve => setTimeout(resolve, 1000));
//       // Update local state
//       setTechnicians((prev) =>
//         prev.map((tech) => (tech.id === id ? { ...tech, status: 'registered' as const } : tech))
//       );
//       // Optionally refetch to sync with server
//       // await fetchPage();
//     } catch (error) {
//       console.error('Failed to update status:', error);
//     } finally {
//       setLoadingIds((prev) => {
//         const newSet = new Set(prev);
//         newSet.delete(id);
//         return newSet;
//       });
//     }
//   };

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'registered':
//         return 'bg-green-100 text-green-800 border-green-200';
//       case 'requested':
//         return 'bg-yellow-100 text-yellow-800 border-yellow-200';
//       default:
//         return 'bg-gray-100 text-gray-800 border-gray-200';
//     }
//   };

//   const getStatusIcon = (status: string) => {
//     switch (status) {
//       case 'registered':
//         return <CheckCircle className="w-5 h-5 text-green-600" />;
//       case 'requested':
//         return <Clock className="w-5 h-5 text-yellow-600" />;
//       default:
//         return <Clock className="w-5 h-5 text-gray-600" />;
//     }
//   };

//   const renderPageButtons = () => {
//     const pages: number[] = [];
//     const startPage = Math.max(1, currentPage - 1);
//     const endPage = Math.min(totalPages, currentPage + 1);

//     for (let i = startPage; i <= endPage; i++) {
//       pages.push(i);
//     }

//     return pages.map((page) => (
//       <button
//         key={page}
//         onClick={() => handlePageChange(page)}
//         className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
//           page === currentPage
//             ? 'bg-blue-600 text-white'
//             : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
//         }`}
//       >
//         {page}
//       </button>
//     ));
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-7xl mx-auto">
//           <div className="text-center py-12">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
//             <p className="text-gray-600">Loading technicians...</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900">Technician Requests</h1>
//           <p className="text-gray-600 mt-2">Manage and approve technician registrations.</p>
//         </div>

//         {/* Search and Filter */}
//         <div className="flex flex-col sm:flex-row gap-4 mb-8">
//           <div className="relative flex-1">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//             <input
//               type="text"
//               placeholder="Search by username or phone number..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             />
//           </div>
//           <div className="flex gap-2">
//             <select
//               value={selectedStatus}
//               onChange={(e) => setSelectedStatus(e.target.value as 'all' | 'requested' | 'registered')}
//               className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             >
//               <option value="all">All Status</option>
//               <option value="requested">Requested</option>
//               <option value="registered">Registered</option>
//             </select>
//             <select
//               value={limit}
//               onChange={(e) => {
//                 setLimit(Number(e.target.value));
//               }}
//               className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             >
//               <option value={6}>6 per page</option>
//               <option value={12}>12 per page</option>
//               <option value={60}>60 per page</option>
//               <option value={100}>100 per page</option>
//             </select>
//           </div>
//         </div>

//         {/* Active Technicians Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
//           {paginatedTechnicians.map((technician) => {
//             const status = technician.status;
//             const planDetails = technician.techDetails.planDetails;
//             return (
//               <div
//                 key={technician.id}
//                 className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
//               >
//                 <div className="p-6">
//                   <div className="flex items-start justify-between mb-4">
//                     <div className="flex items-center gap-3">
//                       <img
//                         src={technician.profileImage}
//                         alt={technician.username}
//                         className="w-16 h-16 rounded-full object-cover border-2 border-blue-200"
//                       />
//                       <div>
//                         <h3 className="text-lg font-semibold text-gray-900">{technician.username}</h3>
//                         <p className="text-sm text-gray-600">{technician.phoneNumber}</p>
//                       </div>
//                     </div>
//                     <div className={`px-3 py-1 rounded-full border text-xs font-medium flex items-center gap-1 ${getStatusColor(status)}`}>
//                       {getStatusIcon(status)}
//                       {status.charAt(0).toUpperCase() + status.slice(1)}
//                     </div>
//                   </div>

//                   <div className="space-y-3 mb-6">
//                     <div className="flex items-center gap-2 text-sm">
//                       <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
//                       </svg>
//                       <span className="text-gray-800">{technician.areaName}, {technician.city}</span>
//                     </div>
//                     <div className="flex items-center gap-2 text-sm">
//                       <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                       </svg>
//                       <span className="text-gray-800">{planDetails.subscriptionName}</span>
//                     </div>
//                     <div className="text-sm text-gray-600">Services: {technician.categoryServices.length}</div>
//                   </div>

//                   <div className="flex gap-3 pt-4 border-t border-gray-100">
//                     <button
//                       onClick={() => {
//                         setSelectedTechnician(technician);
//                         setIsModalOpen(true);
//                       }}
//                       className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
//                     >
//                       <Eye className="w-4 h-4" />
//                       View Details
//                     </button>
//                     {status === 'requested' && (
//                       <button
//                         onClick={() => handleStatusUpdate(technician.id)}
//                         disabled={loadingIds.has(technician.id)}
//                         className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 text-sm font-medium disabled:opacity-50"
//                       >
//                         {loadingIds.has(technician.id) ? (
//                           <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                         ) : (
//                           <CheckCircle className="w-4 h-4" />
//                         )}
//                         Register
//                       </button>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>

//         {/* Pagination */}
//         {totalPages > 1 && (
//           <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
//             <div className="flex items-center space-x-2 text-sm text-gray-700">
//               <span>Showing {Math.min(offset + 1, total)} to {Math.min(offset + limit, total)} of {total} results</span>
//             </div>
//             <div className="flex items-center space-x-1">
//               <button
//                 onClick={() => handlePageChange(1)}
//                 disabled={currentPage === 1}
//                 className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 rounded-md border border-gray-300"
//               >
//                 <ChevronsLeft className="w-4 h-4" />
//                 First
//               </button>
//               <button
//                 onClick={() => handlePageChange(currentPage - 1)}
//                 disabled={currentPage === 1}
//                 className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 rounded-md border border-gray-300"
//               >
//                 <ChevronLeft className="w-4 h-4" />
//                 Prev
//               </button>
//               {renderPageButtons()}
//               <button
//                 onClick={() => handlePageChange(currentPage + 1)}
//                 disabled={currentPage === totalPages}
//                 className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 rounded-md border border-gray-300"
//               >
//                 Next
//                 <ChevronRight className="w-4 h-4" />
//               </button>
//               <button
//                 onClick={() => handlePageChange(totalPages)}
//                 disabled={currentPage === totalPages}
//                 className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 rounded-md border border-gray-300"
//               >
//                 Last
//                 <ChevronRight className="w-4 h-4" />
//               </button>
//             </div>
//           </div>
//         )}

//         {paginatedTechnicians.length === 0 && total === 0 && (
//           <div className="text-center py-12">
//             <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//             <h3 className="text-lg font-medium text-gray-900 mb-2">No technicians found</h3>
//             <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
//           </div>
//         )}

//         {paginatedTechnicians.length === 0 && total > 0 && (
//           <div className="text-center py-12">
//             <p className="text-gray-600">No technicians on this page.</p>
//           </div>
//         )}

//         {/* Modal */}
//         {selectedTechnician && (
//           <TechnicianDetailsModal
//             technician={selectedTechnician}
//             isOpen={isModalOpen}
//             onClose={() => setIsModalOpen(false)}
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// export default TechnicianRequest;
