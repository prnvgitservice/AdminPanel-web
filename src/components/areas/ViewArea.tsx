import React, { useState, useEffect } from "react";
import { ArrowLeft, MapPin } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { getAllPincodes } from "../../api/apiMethods";
import "react-quill/dist/quill.snow.css";

interface SubArea {
  _id: string;
  name: string;
}

interface Area {
  _id: string;
  name: string;
  subAreas: SubArea[];
  pincode?: string;
  state?: string;
  city?: string;
}

interface Pincode {
  _id: string;
  code: string;
  city: string;
  state: string;
  areas: Area[];
  createdAt: string;
  updatedAt: string;
}

interface FetchPincodeResponse {
  success: boolean;
  data: Pincode[];
}

interface ViewAreaProps {
  onBack?: () => void;
}

const ViewArea: React.FC<ViewAreaProps> = ({ onBack }) => {
  const [pincode, setPincode] = useState<Pincode | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Extract pincodeId from the route or location state
  const pincodeId = location.pathname.split("/").pop();
  const { pincode: pincodeFromState } = location.state || {};

  useEffect(() => {
    const fetchPincodeInfo = async () => {
      try {
        setLoading(true);
        const res = await getAllPincodes();
        if (res.success && Array.isArray(res.data)) {
          const matchedPincode = res.data.find((p) => p._id === pincodeId) || pincodeFromState;
          if (matchedPincode) {
            setPincode(matchedPincode);
          } else {
            setError("Pincode not found");
          }
        } else {
          setError("Failed to fetch pincodes");
        }
      } catch (err) {
        setError("Error fetching pincode details");
      } finally {
        setLoading(false);
      }
    };
    fetchPincodeInfo();
  }, [pincodeId, pincodeFromState]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
              <MapPin className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              View Area Details
            </h1>
          </div>
          <button
            onClick={onBack || (() => navigate("/areas"))}
            className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {!loading && pincode && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
              <h2 className="text-lg font-semibold text-white">Area Details</h2>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pincode
                  </label>
                  <div className="text-sm text-gray-900">{pincode.code}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <div className="text-sm text-gray-900">{pincode.city}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State
                  </label>
                  <div className="text-sm text-gray-900">{pincode.state}</div>
                </div>
                {/* <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Created At
                  </label>
                  <div className="text-sm text-gray-900">{formatDate(pincode.createdAt)}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Updated At
                  </label>
                  <div className="text-sm text-gray-900">{formatDate(pincode.updatedAt)}</div>
                </div> */}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Areas
                </label>
                <div className="text-sm text-gray-900">
                  {pincode.areas.length > 0 ? (
                    pincode.areas.map((area) => (
                      <div key={area._id} className="mb-1">
                        {area.name}
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-gray-500">No areas</div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sub-Areas
                </label>
                <div className="text-sm text-gray-900">
                  {pincode.areas.flatMap((area) =>
                    area.subAreas.length > 0 ? (
                      area.subAreas.map((sub) => (
                        <div key={sub._id} className="mb-1">
                          {sub.name}
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-gray-500">No sub-areas</div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewArea;