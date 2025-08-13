import React, { useState, useEffect } from "react";
import { ArrowLeft, MapPin, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
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

interface AddAreaProps {
  onBack?: () => void;
  isEdit?: boolean;
  pincodeId?: string | null;
}

const AddArea: React.FC<AddAreaProps> = ({
  onBack,
  isEdit = false,
  pincodeId,
}) => {
  const [pincodeData, setPincodeData] = useState<Pincode[]>([]);
  const [areaOptions, setAreaOptions] = useState<Area[]>([]);
  const [subAreaOptions, setSubAreaOptions] = useState<SubArea[]>([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedPincode, setSelectedPincode] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedSubArea, setSelectedSubArea] = useState("");
  const [formData, setFormData] = useState({
    areaName: "",
    city: "",
    state: "",
    pincode: "",
    subAreas: [] as string[],
  });
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Fetch pincode and area data
  useEffect(() => {
    const fetchPincodeInfo = async () => {
      try {
        const res = await getAllPincodes();
        if (res.success && Array.isArray(res.data)) {
          setPincodeData(res.data);
          if (isEdit && pincodeId) {
            const pincode = res.data.find((p) => p._id === pincodeId);
            if (pincode) {
              setSelectedCity(pincode.city);
              setSelectedState(pincode.state);
              setSelectedPincode(pincode.code);
              setFormData((prev) => ({
                ...prev,
                city: pincode.city,
                state: pincode.state,
                pincode: pincode.code,
              }));
            }
          }
        } else {
          setError("Failed to fetch pincodes");
        }
      } catch (err) {
        setError("Error fetching pincodes");
      }
    };
    fetchPincodeInfo();
  }, [isEdit, pincodeId]);

  // Update area options when pincodeData is available
  useEffect(() => {
    const flattenedAreas = pincodeData.flatMap((p) =>
      p.areas.map((area) => ({
        ...area,
        pincode: p.code,
        state: p.state,
        city: p.city,
      }))
    );
    setAreaOptions(flattenedAreas);
  }, [pincodeData]);

  // Handle area selection and update sub-areas
  const handleAreaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const areaName = e.target.value;
    setSelectedArea(areaName);

    const matchedPincodeObj = pincodeData.find((p) =>
      p.areas.some((a) => a.name === areaName)
    );

    if (matchedPincodeObj) {
      setSelectedPincode(matchedPincodeObj.code);
      setSelectedState(matchedPincodeObj.state);
      setSelectedCity(matchedPincodeObj.city);

      const matchedArea = matchedPincodeObj.areas.find(
        (a) => a.name === areaName
      );
      const subAreas = matchedArea?.subAreas || [];

      setSubAreaOptions(
        [...subAreas].sort((a, b) => a.name.localeCompare(b.name))
      );
      setSelectedSubArea("");
      setFormData((prev) => ({
        ...prev,
        areaName,
        city: matchedPincodeObj.city,
        state: matchedPincodeObj.state,
        pincode: matchedPincodeObj.code,
      }));
    } else {
      setSelectedPincode("");
      setSelectedState("");
      setSelectedCity("");
      setSubAreaOptions([]);
      setSelectedSubArea("");
      setFormData((prev) => ({
        ...prev,
        areaName,
        city: "",
        state: "",
        pincode: "",
      }));
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubAreaAdd = () => {
    if (selectedSubArea && !formData.subAreas.includes(selectedSubArea)) {
      setFormData((prev) => ({
        ...prev,
        subAreas: [...prev.subAreas, selectedSubArea],
      }));
      setSelectedSubArea("");
    }
  };

  const handleSubAreaRemove = (subArea: string) => {
    setFormData((prev) => ({
      ...prev,
      subAreas: prev.subAreas.filter((sa) => sa !== subArea),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      if (
        !formData.areaName ||
        !formData.city ||
        !formData.state ||
        !formData.pincode
      ) {
        setError("Please fill all required fields");
        return;
      }

      const requestData = {
        areaName: formData.areaName,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        subAreas: formData.subAreas,
      };

      const response = await fetch(
        `https://services-platform-backend.onrender.com/api/pincodeData/createArea`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit area");
      }

      alert(isEdit ? "Area updated successfully!" : "Area added successfully!");
      setFormData({
        areaName: "",
        city: "",
        state: "",
        pincode: "",
        subAreas: [],
      });
      setSelectedCity("");
      setSelectedState("");
      setSelectedPincode("");
      setSelectedArea("");
      setSelectedSubArea("");
      setSubAreaOptions([]);
      if (onBack) onBack();
      else navigate("/areas");
    } catch (error: any) {
      const errorMessage =
        error?.message || "An error occurred. Please try again later.";
      setError(errorMessage);
      alert(errorMessage);
    }
  };

  const handleReset = () => {
    setSelectedCity("");
    setSelectedState("");
    setSelectedPincode("");
    setSelectedArea("");
    setSelectedSubArea("");
    setSubAreaOptions([]);
    setFormData({
      areaName: "",
      city: "",
      state: "",
      pincode: "",
      subAreas: [],
    });
    setError(null);
  };

  const cityOptions = Array.from(new Set(pincodeData.map((p) => p.city)));
  const stateOptions = Array.from(new Set(pincodeData.map((p) => p.state)));
  const pincodeOptions = Array.from(new Set(pincodeData.map((p) => p.code)));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
              <MapPin className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {isEdit ? "Edit Area" : "Add Area"}
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

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
              <h2 className="text-lg font-semibold text-white">Area Details</h2>
            </div>

            <div className="p-6 space-y-6">
              {error && <div className="text-red-500 mb-4">{error}</div>}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                    value={selectedCity}
                    onChange={(e) => {
                      setSelectedCity(e.target.value);
                      setFormData((prev) => ({
                        ...prev,
                        city: e.target.value,
                      }));
                    }}
                    required
                  >
                    <option value="" disabled>
                      Select City
                    </option>
                    {cityOptions.map((city, idx) => (
                      <option key={idx} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                  <MapPin
                    className="absolute left-3 top-[38px] text-blue-400"
                    size={20}
                  />
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                    value={selectedState}
                    onChange={(e) => {
                      setSelectedState(e.target.value);
                      setFormData((prev) => ({
                        ...prev,
                        state: e.target.value,
                      }));
                    }}
                    required
                  >
                    <option value="" disabled>
                      Select State
                    </option>
                    {stateOptions.map((state, idx) => (
                      <option key={idx} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                  <MapPin
                    className="absolute left-3 top-[38px] text-blue-400"
                    size={20}
                  />
                </div>

                {/* <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pincode <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                    value={selectedPincode}
                    onChange={(e) => {
                      setSelectedPincode(e.target.value);
                      setFormData((prev) => ({ ...prev, pincode: e.target.value }));
                    }}
                    required
                  >
                    <option value="" disabled>
                      Select Pincode
                    </option>
                    {pincodeOptions.map((code, idx) => (
                      <option key={idx} value={code}>
                        {code}
                      </option>
                    ))}
                  </select>
                  <MapPin
                    className="absolute left-3 top-[38px] text-blue-400"
                    size={20}
                  />
                </div> */}

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pincode <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="pincode"
                    value={formData.pincode}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, ""); // remove non-numbers
                      if (val.length <= 6) {
                        handleInputChange(e);
                      }
                    }}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                    placeholder="Enter pincode"
                    max={6}
                    required
                  />
                  <MapPin
                    className="absolute left-3 top-[38px] text-blue-400"
                    size={20}
                  />
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Area Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="areaName"
                    value={formData.areaName}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                    placeholder="Enter area name"
                    required
                  />
                  <MapPin
                    className="absolute left-3 top-[38px] text-blue-400"
                    size={20}
                  />
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sub-Area
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={selectedSubArea}
                      onChange={(e) => setSelectedSubArea(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                      placeholder="Enter sub-area name"
                    />
                    <button
                      type="button"
                      onClick={handleSubAreaAdd}
                      className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200"
                      disabled={!selectedSubArea}
                    >
                      Add
                    </button>
                  </div>
                  <MapPin
                    className="absolute left-3 top-[38px] text-blue-400"
                    size={20}
                  />
                </div>
              </div>

              {formData.subAreas.length > 0 && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Added Sub-Areas
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {formData.subAreas.map((subArea, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700"
                      >
                        {subArea}
                        <button
                          type="button"
                          onClick={() => handleSubAreaRemove(subArea)}
                          className="text-red-600 hover:text-red-800"
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleReset}
                className="w-full sm:w-auto flex items-center gap-2 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                <RefreshCw className="h-5 w-5" />
                Reset
              </button>
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {isEdit ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddArea;
