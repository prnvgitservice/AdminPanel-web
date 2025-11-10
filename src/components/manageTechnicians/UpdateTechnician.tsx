// UpdateTechnician.tsx
import React, { useState, useCallback, useEffect } from "react";
import { ArrowLeft, Eye, EyeOff, Edit } from "lucide-react";
import { getAllCategories, getAllPincodes, getPlans, updateTechByAdmin } from "../../api/apiMethods";
import { useLocation, useNavigate } from "react-router-dom";

interface TechnicianData {
  username: string;
  category: string;
  phoneNumber: string;
  password: string;
  buildingName: string;
  areaName: string;
  subAreaName: string;
  city: string;
  state: string;
  pincode: string;
  subscriptionId: string;
  description: string;
  authorizedPerson1Phone: string;
  authorizedPerson2Phone: string;
  profileImage?: File | null;
  aadharFront?: File | null;
  aadharBack?: File | null;
  panCard?: File | null;
  voterCard?: File | null;
  auth1Photo?: File | null;
  auth2Photo?: File | null;
}

interface PincodeData {
  _id: string;
  code: string;
  city: string;
  state: string;
  areas: { _id: string; name: string; subAreas: { _id: string; name: string }[] }[];
}

interface SubscriptionPlan {
  _id: string;
  name: string;
  originalPrice: number | null;
  discount: string;
  discountPercentage: number | null;
  price: number;
  gstPercentage: number;
  gst: number;
  finalPrice: number;
  validity: number | null;
  leads: number | null;
  features: {
    name: string;
    included: boolean;
  }[];
  fullFeatures: {
    text: string;
  }[];
  isPopular: boolean;
  isActive: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  __v: number;
  commisionAmount: number;
  endUpPrice: number | null;
  executiveCommissionAmount: number;
  refExecutiveCommisionAmount: number;
  referalCommisionAmount: number;
}

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
}

interface FormErrors {
  username?: string;
  category?: string;
  phoneNumber?: string;
  password?: string;
  buildingName?: string;
  pincode?: string;
  areaName?: string;
  city?: string;
  state?: string;
  subscriptionId?: string;
  description?: string;
  authorizedPerson1Phone?: string;
  authorizedPerson2Phone?: string;
  profileImage?: string;
  aadharFront?: string;
  aadharBack?: string;
  panCard?: string;
  voterCard?: string;
  auth1Photo?: string;
  auth2Photo?: string;
  general?: string;
}

const initialFormState: TechnicianData = {
  username: "",
  category: "",
  phoneNumber: "",
  password: "",
  buildingName: "",
  areaName: "",
  subAreaName: "",
  city: "",
  state: "",
  pincode: "",
  subscriptionId: "",
  description: "",
  authorizedPerson1Phone: "",
  authorizedPerson2Phone: "",
  profileImage: null,
  aadharFront: null,
  aadharBack: null,
  panCard: null,
  voterCard: null,
  auth1Photo: null,
  auth2Photo: null,
};

const UpdateTechnician: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const technician: Technician | undefined = location.state?.technician;

  const [formData, setFormData] = useState<TechnicianData>(initialFormState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [apiCategories, setApiCategories] = useState<
    { _id: string; category_name: string; status: number }[]
  >([]);
  const [catLoading, setCatLoading] = useState<boolean>(false);
  const [catError, setCatError] = useState<string | null>(null);
  const [pincodeData, setPincodeData] = useState<PincodeData[]>([]);
  const [selectedPincode, setSelectedPincode] = useState<string>("");
  const [areaOptions, setAreaOptions] = useState<
    { _id: string; name: string; subAreas: { _id: string; name: string }[] }[]
  >([]);
  const [subAreaOptions, setSubAreaOptions] = useState<
    { _id: string; name: string }[]
  >([]);
  const [showPassword, setShowPassword] = useState(false);
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>([]);
  const [planLoading, setPlanLoading] = useState<boolean>(false);
  const [planError, setPlanError] = useState<string | null>(null);
  const [previews, setPreviews] = useState({
    profileImage: '',
    aadharFront: '',
    aadharBack: '',
    panCard: '',
    voterCard: '',
    auth1Photo: '',
    auth2Photo: '',
  });

  useEffect(() => {
    getAllPincodes()
      .then((res: any) => {
        if (Array.isArray(res?.data)) {
          setPincodeData(res.data);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    setCatLoading(true);
    getAllCategories(null)
      .then((res: any) => {
        if (Array.isArray(res?.data)) {
          setApiCategories(res.data);
        } else {
          setApiCategories([]);
          setCatError("Failed to load categories");
        }
      })
      .catch(() => {
        setApiCategories([]);
        setCatError("Failed to load categories");
      })
      .finally(() => setCatLoading(false));
  }, []);

  useEffect(() => {
    setPlanLoading(true);
    getPlans({})
      .then((res: any) => {
        if (Array.isArray(res?.data)) {
          setSubscriptionPlans(res.data);
        } else {
          setSubscriptionPlans([]);
          setPlanError("Failed to load subscription plans");
        }
      })
      .catch(() => {
        setSubscriptionPlans([]);
        setPlanError("Failed to load subscription plans");
      })
      .finally(() => setPlanLoading(false));
  }, []);

  useEffect(() => {
    if (technician && pincodeData.length > 0 && apiCategories.length > 0) {
      const foundPin = pincodeData.find((p) => p.code === technician.pincode);
      let tempAreaOptions: typeof areaOptions = [];
      let tempSubAreaOptions: typeof subAreaOptions = [];
      let tempCity = technician.city;
      let tempState = technician.state;
      let categoryId = "";

      // Map category name to ID
      const categoryName = technician.category || technician.techDetails.categoryName;
      const foundCategory = apiCategories.find((c) => c.category_name.toLowerCase() === categoryName.toLowerCase());
      categoryId = foundCategory?._id || "";

      if (foundPin) {
        tempAreaOptions = foundPin.areas;
        const foundArea = foundPin.areas.find((a) => a.name === technician.areaName);
        if (foundArea) {
          tempSubAreaOptions = foundArea.subAreas;
        }
        tempCity = foundPin.city;
        tempState = foundPin.state;
      }

      setAreaOptions(tempAreaOptions);
      setSubAreaOptions(tempSubAreaOptions.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase())));
      setSelectedPincode(technician.pincode);

      setFormData({
        username: technician.username || "",
        category: technician.category,
        phoneNumber: technician.phoneNumber || "",
        password: "",
        buildingName: technician.buildingName || "",
        areaName: technician.areaName || "",
        subAreaName: technician.subAreaName === "-" ? "" : technician.subAreaName || "",
        city: tempCity,
        state: tempState,
        pincode: technician.pincode || "",
        subscriptionId: technician.techDetails.planDetails.subscriptionId || "",
        description: technician.description || "",
        authorizedPerson1Phone: "",
        authorizedPerson2Phone: "",
        profileImage: null,
        aadharFront: null,
        aadharBack: null,
        panCard: null,
        voterCard: null,
        auth1Photo: null,
        auth2Photo: null,
      });
    }
  }, [technician, pincodeData, apiCategories]);

  useEffect(() => {
    if (selectedPincode) {
      const found = pincodeData.find((p) => p.code === selectedPincode);
      if (found && found.areas) {
        setAreaOptions(found.areas);
        setFormData((prev) => ({
          ...prev,
          city: found.city,
          state: found.state,
        }));
      } else {
        setAreaOptions([]);
        setFormData((prev) => ({
          ...prev,
          city: "",
          state: "",
          areaName: "",
          subAreaName: "",
        }));
      }
    } else {
      setAreaOptions([]);
      setFormData((prev) => ({
        ...prev,
        city: "",
        state: "",
        areaName: "",
        subAreaName: "",
      }));
    }
  }, [selectedPincode, pincodeData]);

  useEffect(() => {
    if (formData.areaName) {
      const selectedArea = areaOptions.find(
        (a) => a.name === formData.areaName
      );
      if (selectedArea && selectedArea.subAreas) {
        setSubAreaOptions(selectedArea.subAreas.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase())));
      } else {
        setSubAreaOptions([]);
      }
      setFormData((prev) => ({ ...prev, subAreaName: "" }));
    }
  }, [formData.areaName, areaOptions]);

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      Object.values(previews).forEach((url) => {
        if (url) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [previews]);

  const validateForm = useCallback((): FormErrors => {
    const newErrors: FormErrors = {};
    // Common fields only for edit
    if (!formData.username.trim()) {
      newErrors.username = "Technician Name is required.";
    }
    if (!formData.category) {
      newErrors.category = "Category is required.";
    }
    if (!formData.phoneNumber || !/^\d{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Phone number must be exactly 10 digits.";
    }
    if (formData.password && (formData.password.length < 6 || formData.password.length > 10)) {
      newErrors.password = "Password must be 6-10 characters if provided.";
    }
    if (!formData.buildingName.trim()) {
      newErrors.buildingName = "Building name is required.";
    }
    if (!formData.pincode || formData.pincode.length !== 6) {
      newErrors.pincode = "Pincode must be exactly 6 digits.";
    }
    if (!formData.areaName) {
      newErrors.areaName = "Area is required.";
    }
    if (!formData.city) {
      newErrors.city = "City is required.";
    }
    if (!formData.state) {
      newErrors.state = "State is required.";
    }
    if (!formData.subscriptionId) {
      newErrors.subscriptionId = "Subscription Plan is required.";
    }
    // Skip creation fields in edit
    return newErrors;
  }, [formData]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (name === "pincode") {
        setSelectedPincode(value);
      }
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    },
    []
  );

  const handleFileChange = useCallback((name: keyof TechnicianData, file: File | null) => {
    setFormData((prev) => ({ ...prev, [name]: file }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));

    const prevUrl = previews[name as keyof typeof previews];
    if (prevUrl) {
      URL.revokeObjectURL(prevUrl);
    }

    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setPreviews((prev) => ({ ...prev, [name as keyof typeof previews]: previewUrl }));
    } else {
      setPreviews((prev) => ({ ...prev, [name as keyof typeof previews]: '' }));
    }
  }, [previews]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const updateFormData = new FormData();
      updateFormData.append("technicianId", technician!.id);
      updateFormData.append("username", formData.username);
      updateFormData.append("category", formData.category);
      updateFormData.append("phoneNumber", formData.phoneNumber);
      updateFormData.append("buildingName", formData.buildingName);
      updateFormData.append("areaName", formData.areaName);
      updateFormData.append("subAreaName", formData.subAreaName || "-");
      updateFormData.append("city", formData.city);
      updateFormData.append("state", formData.state);
      updateFormData.append("pincode", formData.pincode);
      updateFormData.append("description", formData.description);
      if (formData.password) {
        updateFormData.append("password", formData.password);
      }
      if (formData.profileImage) {
        updateFormData.append("profileImage", formData.profileImage);
      }
      if (formData.subscriptionId) {
        updateFormData.append("subscriptionId", formData.subscriptionId);
      }
      const response = await updateTechByAdmin(updateFormData);
      if (!response || !response.success) {
        alert(`Failed to update technician.`);
      } else {
        alert("Technician updated successfully!");
      }
      setLoading(false);
      navigate("/management/technicians");
    } catch (error) {
      setLoading(false);
      alert("Something went wrong");
      console.error("Error updating technician:", error);
      setErrors({
        general: "An error occurred while submitting the form.",
      });
    }
  };

  const IconComponent = Edit;
  const title = "Edit Technician";
  const submitText = "Update";
  const passwordPlaceholder = "Leave blank to keep current password";
  const passwordRequired = false;

  if (!technician) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <p className="text-red-500">Technician data not found. Please go back.</p>
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
              <IconComponent className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {title}
            </h1>
          </div>
          <button
            onClick={() => navigate("/management/technicians")}
            className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {errors.general && (
            <div className="text-red-600 text-sm text-center bg-red-50 p-2 rounded">
              {errors.general}
            </div>
          )}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-blue-700 px-6 py-4">
              <h2 className="text-lg font-semibold text-white">
                Technician Information
              </h2>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Technician Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter technician name"
                    required
                    aria-describedby={
                      errors.username ? "username-error" : undefined
                    }
                  />
                  {errors.username && (
                    <p id="username-error" className="text-red-500 text-sm">
                      {errors.username}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    required
                    disabled={catLoading}
                    aria-describedby={
                      errors.category ? "category-error" : undefined
                    }
                  >
                     <option value="" disabled>
                      {catLoading ? "Loading categories..." : "Select a category"}
                    </option>
                    
                    {apiCategories
                      .sort((a, b) => a.category_name.toLowerCase().localeCompare(b.category_name.toLowerCase()))
                      .map((item) => (
                        <option key={item._id} value={item._id}>
                          {item.category_name}
                        </option>
                      ))}
                  </select>
                  {errors.category && (
                    <p id="category-error" className="text-red-500 text-sm">
                      {errors.category}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 py-3 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm rounded-l-lg">
                      🇮🇳 +91
                    </span>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter 10-digit mobile number"
                      pattern="[0-9]{10}"
                      required
                      aria-describedby={
                        errors.phoneNumber ? "phoneNumber-error" : undefined
                      }
                    />
                  </div>
                  {errors.phoneNumber && (
                    <p id="phoneNumber-error" className="text-red-500 text-sm">
                      {errors.phoneNumber}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Password {!passwordRequired && <span className="text-gray-500">(optional)</span>}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder={passwordPlaceholder}
                      minLength={6}
                      maxLength={10}
                      required={passwordRequired}
                      aria-describedby={
                        errors.password ? "password-error" : undefined
                      }
                    />
                    <span
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 hover:text-blue-500"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </span>
                  </div>
                  {errors.password && (
                    <p id="password-error" className="text-red-500 text-sm">
                      {errors.password}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Profile Image
                  </label>
                  <div className="flex items-center space-x-4">
                    <img
                      src={previews.profileImage || technician?.profileImage || "https://img-new.cgtrader.com/items/4519471/f444ec0898/large/mechanic-avatar-3d-icon-3d-model-f444ec0898.jpg"}
                      alt="Profile Preview"
                      className="w-20 h-20 rounded-full object-cover"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange("profileImage", e.target.files?.[0] || null)}
                      className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Building Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="buildingName"
                    value={formData.buildingName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter building name"
                    required
                    aria-describedby={
                      errors.buildingName ? "buildingName-error" : undefined
                    }
                  />
                  {errors.buildingName && (
                    <p id="buildingName-error" className="text-red-500 text-sm">
                      {errors.buildingName}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Years in Service
                  </label>
                  <input
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter years in service"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Pincode <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    required
                    aria-describedby={
                      errors.pincode ? "pincode-error" : undefined
                    }
                  >
                    <option value="" disabled>
                      Select Pincode
                    </option>
                    {pincodeData
                      .sort((a, b) => Number(a.code) - Number(b.code))
                      .map((p) => (
                        <option key={p._id} value={p.code}>
                          {p.code}
                        </option>
                      ))}
                  </select>
                  {errors.pincode && (
                    <p id="pincode-error" className="text-red-500 text-sm">
                      {errors.pincode}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Area <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="areaName"
                    value={formData.areaName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100"
                    required
                    disabled={!selectedPincode}
                    aria-describedby={
                      errors.areaName ? "areaName-error" : undefined
                    }
                  >
                    <option value="" disabled>
                      Select Area
                    </option>
                    {areaOptions.map((a) => (
                      <option key={a._id} value={a.name}>
                        {a.name}
                      </option>
                    ))}
                  </select>
                  {errors.areaName && (
                    <p id="areaName-error" className="text-red-500 text-sm">
                      {errors.areaName}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Sub Area <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="subAreaName"
                    value={formData.subAreaName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100"
                    disabled={!formData.areaName}
                    required
                  >
                    <option value="">Select Sub Area</option>
                    {subAreaOptions
                      .map((a) => (
                        <option key={a._id} value={a.name}>
                          {a.name}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    City <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100"
                    required
                    disabled={!selectedPincode}
                    aria-describedby={errors.city ? "city-error" : undefined}
                  >
                    <option value="" disabled>
                      Select City
                    </option>
                    {selectedPincode &&
                      pincodeData.find((p) => p.code === selectedPincode) && (
                        <option
                          value={
                            pincodeData.find((p) => p.code === selectedPincode)
                              ?.city
                          }
                        >
                          {
                            pincodeData.find((p) => p.code === selectedPincode)
                              ?.city
                          }
                        </option>
                      )}
                  </select>
                  {errors.city && (
                    <p id="city-error" className="text-red-500 text-sm">
                      {errors.city}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    State <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100"
                    required
                    disabled={!selectedPincode}
                    aria-describedby={errors.state ? "state-error" : undefined}
                  >
                    <option value="" disabled>
                      Select State
                    </option>
                    {selectedPincode &&
                      pincodeData.find((p) => p.code === selectedPincode) && (
                        <option
                          value={
                            pincodeData.find((p) => p.code === selectedPincode)
                              ?.state
                          }
                        >
                          {
                            pincodeData.find((p) => p.code === selectedPincode)
                              ?.state
                          }
                        </option>
                      )}
                  </select>
                  {errors.state && (
                    <p id="state-error" className="text-red-500 text-sm">
                      {errors.state}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Subscription Plan <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="subscriptionId"
                    value={formData.subscriptionId}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    required
                    aria-describedby={
                      errors.subscriptionId ? "subscriptionId-error" : undefined
                    }
                  >
                    <option value="" disabled>
                      Select Subscription Plan
                    </option>
                    {subscriptionPlans
                      .filter((plan) => plan.isActive)
                      .map((plan) => (
                        <option key={plan._id} value={plan._id}>
                          {plan.name} - ₹{plan.finalPrice} ({plan.price} + {plan.gst} GST)
                        </option>
                      ))}
                  </select>
                  {errors.subscriptionId && (
                    <p id="subscriptionId-error" className="text-red-500 text-sm">
                      {errors.subscriptionId}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => {
                if (window.confirm("Are you sure you want to cancel? Unsaved changes will be lost.")) {
                  navigate("/management/technicians");
                }
              }}
              className="w-full sm:w-auto px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Processing..." : submitText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateTechnician;