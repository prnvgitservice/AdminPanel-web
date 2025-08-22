import React, { useState, useCallback, useEffect } from "react";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { getAllCategories, getAllPincodes, getPlans, registerTechByAdmin } from "../../api/apiMethods";
import { useNavigate } from "react-router-dom";

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
  price: number;
  finalPrice: number;
  gst: number;
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
};

const AddTechnician: React.FC = () => {
  const [formData, setFormData] = useState<TechnicianData>(initialFormState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiCategories, setApiCategories] = useState<
    { _id: string; category_name: string; status: number }[]
  >([]);
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
  const navigate = useNavigate();

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
    getAllCategories(null)
      .then((res: any) => {
        if (Array.isArray(res?.data)) {
          setApiCategories(res.data);
        } else {
          setApiCategories([]);
          setErrors({ category: "Failed to load categories" });
        }
      })
      .catch(() => {
        setApiCategories([]);
        setErrors({ category: "Failed to load categories" });
      });
  }, []);

  useEffect(() => {
    getPlans()
      .then((res: any) => {
        if (Array.isArray(res?.data)) {
          setSubscriptionPlans(res.data);
        } else {
          setSubscriptionPlans([]);
        }
      })
      .catch(() => {
        setSubscriptionPlans([]);
      });
  }, []);

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
        setSubAreaOptions(selectedArea.subAreas);
      } else {
        setSubAreaOptions([]);
      }
      setFormData((prev) => ({ ...prev, subAreaName: "" }));
    }
  }, [formData.areaName, areaOptions]);

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

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};
    if (!formData.username.trim()) {
      newErrors.username = "Technician Name is required.";
    }
    if (!formData.category) {
      newErrors.category = "Category is required.";
    }
    if (!formData.phoneNumber || !/^\d{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Phone number must be exactly 10 digits.";
    }
    if (
      !formData.password ||
      formData.password.length < 6 ||
      formData.password.length > 10
    ) {
      newErrors.password = "Password must be 6-10 characters.";
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
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        username: formData.username,
        category: formData.category,
        phoneNumber: formData.phoneNumber,
        password: formData.password,
        buildingName: formData.buildingName,
        areaName: formData.areaName,
        subAreaName: formData.subAreaName || "-",
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        subscriptionId: formData.subscriptionId,
      };
      await registerTechByAdmin(payload);
      alert("Technician added successfully!");
      setIsSubmitting(false);
      navigate(`management/technicians/all`);
    } catch (error) {
      setIsSubmitting(false);
      alert("Something went wrong");
      console.error("Error adding technician:", error);
      setErrors({
        username: "An error occurred while submitting the form.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Add Technician
            </h1>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
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
                    aria-describedby={
                      errors.category ? "category-error" : undefined
                    }
                  >
                    <option value="" disabled>
                      Select a category
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
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="6-10 characters"
                      minLength={6}
                      maxLength={10}
                      required
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
                    Sub Area
                  </label>
                  <select
                    name="subAreaName"
                    value={formData.subAreaName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100"
                    disabled={!formData.areaName}
                  >
                    <option value="">Select Sub Area</option>
                    {subAreaOptions
                      .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
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
                      .filter((plan) => ['Economy Plan', 'Free Plan'].includes(plan.name))
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
              onClick={() => navigate(-1)}
              className="w-full sm:w-auto px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Processing..." : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTechnician;
// import React, { useState, useCallback, useEffect } from "react";
// import { ArrowLeft, Eye, EyeOff } from "lucide-react";
// import { getAllCategories, getAllPincodes, getPlans, registerTechByAdmin } from "../../api/apiMethods";
// import { useNavigate } from "react-router-dom";

// interface TechnicianData {
//   username: string;
//   category: string;
//   phoneNumber: string;
//   password: string;
//   buildingName: string;
//   areaName: string;
//   city: string;
//   state: string;
//   pincode: string;
//   subscriptionId: string;
//   // status: "active" | "inactive";
// }

// interface PincodeData {
//   _id: string;
//   code: string;
//   city: string;
//   state: string;
//   areas: { _id: string; name: string }[];
// }

// interface SubscriptionPlan {
//   _id: string;
//   name: string;
//   price: number;
//   finalPrice: number;
//   gst: number;
// }

// interface FormErrors {
//   username?: string;
//   category?: string;
//   phoneNumber?: string;
//   password?: string;
//   buildingName?: string;
//   pincode?: string;
//   areaName?: string;
//   city?: string;
//   state?: string;
//   subscriptionId?: string;
// }

// const initialFormState: TechnicianData = {
//   username: "",
//   category: "",
//   phoneNumber: "",
//   password: "",
//   buildingName: "",
//   areaName: "",
//   city: "",
//   state: "",
//   pincode: "",
//   subscriptionId: "",
//   // status: "active",
// };


// const AddTechnician: React.FC = () => {
//   const [formData, setFormData] = useState<TechnicianData>(initialFormState);
//   const [errors, setErrors] = useState<FormErrors>({});
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [apiCategories, setApiCategories] = useState<
//     { _id: string; category_name: string; status: number }[]
//   >([]);
//   const [pincodeData, setPincodeData] = useState<PincodeData[]>([]);
//   const [selectedPincode, setSelectedPincode] = useState<string>("");
//   const [areaOptions, setAreaOptions] = useState<
//     { _id: string; name: string }[]
//   >([]);
//   const [showPassword, setShowPassword] = useState(false);
//   const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     getAllPincodes()
//       .then((res: any) => {
//         if (Array.isArray(res?.data)) {
//           setPincodeData(res.data);
//         }
//       })
//       .catch(() => {});
//   }, []);

//   useEffect(() => {
//     getAllCategories(null)
//       .then((res: any) => {
//         if (Array.isArray(res?.data)) {
//           setApiCategories(res.data);
//         } else {
//           setApiCategories([]);
//           setErrors({ category: "Failed to load categories" });
//         }
//       })
//       .catch(() => {
//         setApiCategories([]);
//         setErrors({ category: "Failed to load categories" });
//       });
//   }, []);

//   useEffect(() => {
//     getPlans()
//       .then((res: any) => {
//         if (Array.isArray(res?.data)) {
//           setSubscriptionPlans(res.data);
//         } else {
//           setSubscriptionPlans([]);
//         }
//       })
//       .catch(() => {
//         setSubscriptionPlans([]);
//       });
//   }, []);

//   useEffect(() => {
//     if (selectedPincode) {
//       const found = pincodeData.find((p) => p.code === selectedPincode);
//       if (found && found.areas) {
//         setAreaOptions(found.areas);
//         setFormData((prev) => ({
//           ...prev,
//           city: found.city,
//           state: found.state,
//         }));
//       } else {
//         setAreaOptions([]);
//         setFormData((prev) => ({
//           ...prev,
//           city: "",
//           state: "",
//           areaName: "",
//         }));
//       }
//     } else {
//       setAreaOptions([]);
//       setFormData((prev) => ({
//         ...prev,
//         city: "",
//         state: "",
//         areaName: "",
//       }));
//     }
//   }, [selectedPincode, pincodeData]);

//   const handleInputChange = useCallback(
//     (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//       const { name, value } = e.target;
//       setFormData((prev) => ({ ...prev, [name]: value }));
//       if (name === "pincode") {
//         setSelectedPincode(value);
//       }
//       setErrors((prev) => ({ ...prev, [name]: undefined }));
//     },
//     []
//   );

//   const validateForm = (): FormErrors => {
//     const newErrors: FormErrors = {};
//     if (!formData.username.trim()) {
//       newErrors.username = "Technician Name is required.";
//     }
//     if (!formData.category) {
//       newErrors.category = "Category is required.";
//     }
//     if (!formData.phoneNumber || !/^\d{10}$/.test(formData.phoneNumber)) {
//       newErrors.phoneNumber = "Phone number must be exactly 10 digits.";
//     }
//     if (
//       !formData.password ||
//       formData.password.length < 6 ||
//       formData.password.length > 10
//     ) {
//       newErrors.password = "Password must be 6-10 characters.";
//     }
//     if (!formData.buildingName.trim()) {
//       newErrors.buildingName = "Building name is required.";
//     }
//     if (!formData.pincode || formData.pincode.length !== 6) {
//       newErrors.pincode = "Pincode must be exactly 6 digits.";
//     }
//     if (!formData.areaName) {
//       newErrors.areaName = "Area is required.";
//     }
//     if (!formData.city) {
//       newErrors.city = "City is required.";
//     }
//     if (!formData.state) {
//       newErrors.state = "State is required.";
//     }
//     if (!formData.subscriptionPlan) {
//       newErrors.subscriptionPlan = "Subscription Plan is required.";
//     }
//     return newErrors;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const validationErrors = validateForm();
//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       return;
//     }

//     setIsSubmitting(true);
//     try {
//       await registerTechByAdmin(formData);
//       alert("Technician added successfully!");
//       setIsSubmitting(false);
//       navigate(-1);
//     } catch (error) {
//       setIsSubmitting(false);
//       alert("something went wrong")
//       console.error("Error adding technician:", error);
//       setErrors({
//         username: "An error occurred while submitting the form.",
//       });
//     }
// };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
//       <div className="max-w-4xl mx-auto">
//         {/* Header */}
//         <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
//           <div className="flex items-center gap-3">
//             <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
//               <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
//               </svg>
//             </div>
//             <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
//               Add Technician
//             </h1>
//           </div>
//           <button
//             onClick={() => navigate(-1)}
//             className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
//           >
//             <ArrowLeft className="h-4 w-4 mr-2" />
//             Back
//           </button>
//         </div>

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="space-y-8">
//           <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
//             <div className="bg-gradient-to-r from-blue-500 to-blue-700 px-6 py-4">
//               <h2 className="text-lg font-semibold text-white">
//                 Technician Information
//               </h2>
//             </div>

//             <div className="p-6 space-y-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="space-y-2">
//                   <label className="block text-sm font-medium text-gray-700">
//                     Technician Name <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     name="username"
//                     value={formData.username}
//                     onChange={handleInputChange}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                     placeholder="Enter technician name"
//                     required
//                     aria-describedby={
//                       errors.username ? "username-error" : undefined
//                     }
//                   />
//                   {errors.username && (
//                     <p id="username-error" className="text-red-500 text-sm">
//                       {errors.username}
//                     </p>
//                   )}
//                 </div>

//                 <div className="space-y-2">
//                   <label className="block text-sm font-medium text-gray-700">
//                     Category <span className="text-red-500">*</span>
//                   </label>
//                   <select
//                     name="category"
//                     value={formData.category}
//                     onChange={handleInputChange}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                     required
//                     aria-describedby={
//                       errors.category ? "category-error" : undefined
//                     }
//                   >
//                     <option value="" disabled>
//                       Select a category
//                     </option>
//                     {apiCategories
//                     .sort((a, b) => a.category_name.toLowerCase().localeCompare(b.category_name.toLowerCase()))
//                       // .filter((category) => category?.status === 1)
//                       .map((item) => (
//                         <option key={item._id} value={item._id}>
//                           {item.category_name}
//                         </option>
//                       ))}
//                   </select>
//                   {errors.category && (
//                     <p id="category-error" className="text-red-500 text-sm">
//                       {errors.category}
//                     </p>
//                   )}
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="space-y-2">
//                   <label className="block text-sm font-medium text-gray-700">
//                     Mobile Number <span className="text-red-500">*</span>
//                   </label>
//                   <div className="flex">
//                     <span className="inline-flex items-center px-3 py-3 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm rounded-l-lg">
//                       🇮🇳 +91
//                     </span>
//                     <input
//                       type="tel"
//                       name="phoneNumber"
//                       value={formData.phoneNumber}
//                       onChange={handleInputChange}
//                       className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                       placeholder="Enter 10-digit mobile number"
//                       pattern="[0-9]{10}"
//                       required
//                       aria-describedby={
//                         errors.phoneNumber ? "phoneNumber-error" : undefined
//                       }
//                     />
//                   </div>
//                   {errors.phoneNumber && (
//                     <p id="phoneNumber-error" className="text-red-500 text-sm">
//                       {errors.phoneNumber}
//                     </p>
//                   )}
//                 </div>

//                 <div className="space-y-2">
//                   <label className="block text-sm font-medium text-gray-700">
//                     Password <span className="text-red-500">*</span>
//                   </label>
//                   <div className="relative">
//                     <input
//                       type={showPassword ? "text" : "password"}
//                       name="password"
//                       value={formData.password}
//                       onChange={handleInputChange}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                       placeholder="6-10 characters"
//                       minLength={6}
//                       maxLength={10}
//                       required
//                       aria-describedby={
//                         errors.password ? "password-error" : undefined
//                       }
//                     />
//                     <span
//                       className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 hover:text-blue-500"
//                       onClick={() => setShowPassword((prev) => !prev)}
//                     >
//                       {showPassword ? (
//                         <EyeOff className="h-5 w-5" />
//                       ) : (
//                         <Eye className="h-5 w-5" />
//                       )}
//                     </span>
//                   </div>
//                   {errors.password && (
//                     <p id="password-error" className="text-red-500 text-sm">
//                       {errors.password}
//                     </p>
//                   )}
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <label className="block text-sm font-medium text-gray-700">
//                   Building Name <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   name="buildingName"
//                   value={formData.buildingName}
//                   onChange={handleInputChange}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                   placeholder="Enter building name"
//                   required
//                   aria-describedby={
//                     errors.buildingName ? "buildingName-error" : undefined
//                   }
//                 />
//                 {errors.buildingName && (
//                   <p id="buildingName-error" className="text-red-500 text-sm">
//                     {errors.buildingName}
//                   </p>
//                 )}
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="space-y-2">
//                   <label className="block text-sm font-medium text-gray-700">
//                     Pincode <span className="text-red-500">*</span>
//                   </label>
//                   <select
//                     name="pincode"
//                     value={formData.pincode}
//                     onChange={handleInputChange}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                     required
//                     aria-describedby={
//                       errors.pincode ? "pincode-error" : undefined
//                     }
//                   >
//                     <option value="" disabled>
//                       Select Pincode
//                     </option>
//                     {pincodeData
//                     .sort((a, b) => Number(a.code) - Number(b.code))
//                     .map((p) => (
//                       <option key={p._id} value={p.code}>
//                         {p.code}
//                       </option>
//                     ))}
//                   </select>
//                   {errors.pincode && (
//                     <p id="pincode-error" className="text-red-500 text-sm">
//                       {errors.pincode}
//                     </p>
//                   )}
//                 </div>

//                 <div className="space-y-2">
//                   <label className="block text-sm font-medium text-gray-700">
//                     Area <span className="text-red-500">*</span>
//                   </label>
//                   <select
//                     name="areaName"
//                     value={formData.areaName}
//                     onChange={handleInputChange}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100"
//                     required
//                     disabled={!selectedPincode}
//                     aria-describedby={
//                       errors.areaName ? "areaName-error" : undefined
//                     }
//                   >
//                     <option value="" disabled>
//                       Select Area
//                     </option>
//                     {areaOptions.map((a) => (
//                       <option key={a._id} value={a.name}>
//                         {a.name}
//                       </option>
//                     ))}
//                   </select>
//                   {errors.areaName && (
//                     <p id="areaName-error" className="text-red-500 text-sm">
//                       {errors.areaName}
//                     </p>
//                   )}
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="space-y-2">
//                   <label className="block text-sm font-medium text-gray-700">
//                     City <span className="text-red-500">*</span>
//                   </label>
//                   <select
//                     name="city"
//                     value={formData.city}
//                     onChange={handleInputChange}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100"
//                     required
//                     disabled={!selectedPincode}
//                     aria-describedby={errors.city ? "city-error" : undefined}
//                   >
//                     <option value="" disabled>
//                       Select City
//                     </option>
//                     {selectedPincode &&
//                       pincodeData.find((p) => p.code === selectedPincode) && (
//                         <option
//                           value={
//                             pincodeData.find((p) => p.code === selectedPincode)
//                               ?.city
//                           }
//                         >
//                           {
//                             pincodeData.find((p) => p.code === selectedPincode)
//                               ?.city
//                           }
//                         </option>
//                       )}
//                   </select>
//                   {errors.city && (
//                     <p id="city-error" className="text-red-500 text-sm">
//                       {errors.city}
//                     </p>
//                   )}
//                 </div>

//                 <div className="space-y-2">
//                   <label className="block text-sm font-medium text-gray-700">
//                     State <span className="text-red-500">*</span>
//                   </label>
//                   <select
//                     name="state"
//                     value={formData.state}
//                     onChange={handleInputChange}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100"
//                     required
//                     disabled={!selectedPincode}
//                     aria-describedby={errors.state ? "state-error" : undefined}
//                   >
//                     <option value="" disabled>
//                       Select State
//                     </option>
//                     {selectedPincode &&
//                       pincodeData.find((p) => p.code === selectedPincode) && (
//                         <option
//                           value={
//                             pincodeData.find((p) => p.code === selectedPincode)
//                               ?.state
//                           }
//                         >
//                           {
//                             pincodeData.find((p) => p.code === selectedPincode)
//                               ?.state
//                           }
//                         </option>
//                       )}
//                   </select>
//                   {errors.state && (
//                     <p id="state-error" className="text-red-500 text-sm">
//                       {errors.state}
//                     </p>
//                   )}
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <label className="block text-sm font-medium text-gray-700">
//                   Subscription Plan <span className="text-red-500">*</span>
//                 </label>
//                 <select
//                   name="subscriptionPlan"
//                   value={formData.subscriptionPlan}
//                   onChange={handleInputChange}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                   required
//                   aria-describedby={
//                     errors.subscriptionPlan ? "subscriptionPlan-error" : undefined
//                   }
//                 >
//                   <option value="" disabled>
//                     Select Subscription Plan
//                   </option>
//                   {subscriptionPlans
//                     .filter((plan) => plan.name === 'Economy Plan')
//                     .map((plan) => (
//                       <option key={plan._id} value={plan._id}>
//                         {plan.name} - ₹{plan.finalPrice} ({plan.price} + {plan.gst} GST)
//                       </option>
//                     ))}
//                 </select>
//                 {errors.subscriptionPlan && (
//                   <p id="subscriptionPlan-error" className="text-red-500 text-sm">
//                     {errors.subscriptionPlan}
//                   </p>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Action Buttons */}
//           <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
//             <button
//               type="button"
//               onClick={() => navigate(-1)}
//               className="w-full sm:w-auto px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
//               disabled={isSubmitting}
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
//               disabled={isSubmitting}
//             >
//               {isSubmitting ? "Processing..." : "Add"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddTechnician;
// import React, { useState, useCallback, useEffect } from "react";
// import { ArrowLeft, Eye, EyeOff, Upload, User } from "lucide-react";
// import { getAllCategories, getAllPincodes } from "../../api/apiMethods";
// import { useNavigate } from "react-router-dom";

// interface TechnicianData {
//   username: string;
//   franchiseId: string;
//   category: string;
//   phoneNumber: string;
//   password: string;
//   buildingName: string;
//   areaName: string;
//   city: string;
//   state: string;
//   pincode: string;
//   profileImage: File | null;
//   status: "active" | "inactive";
// }

// interface PincodeData {
//   _id: string;
//   code: string;
//   city: string;
//   state: string;
//   areas: { _id: string; name: string }[];
// }

// interface FormErrors {
//   username?: string;
//   category?: string;
//   phoneNumber?: string;
//   password?: string;
//   buildingName?: string;
//   pincode?: string;
//   areaName?: string;
//   profileImage?: string;
// }

// const initialFormState: TechnicianData = {
//   username: "",
//   franchiseId: "",
//   category: "",
//   phoneNumber: "",
//   password: "",
//   buildingName: "",
//   areaName: "",
//   city: "",
//   state: "",
//   pincode: "",
//   profileImage: null,
//   status: "active",
// };

// const AddTechnician: React.FC = () => {
//   const [formData, setFormData] = useState<TechnicianData>(initialFormState);
//   const [errors, setErrors] = useState<FormErrors>({});
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [apiCategories, setApiCategories] = useState<
//     { _id: string; category_name: string; status: number }[]
//   >([]);
//   const [pincodeData, setPincodeData] = useState<PincodeData[]>([]);
//   const [selectedPincode, setSelectedPincode] = useState<string>("");
//   const [areaOptions, setAreaOptions] = useState<
//     { _id: string; name: string }[]
//   >([]);
//   const [showPassword, setShowPassword] = useState(false);
//   const [imagePreview, setImagePreview] = useState<string | null>(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     getAllPincodes()
//       .then((res: any) => {
//         if (Array.isArray(res?.data)) {
//           setPincodeData(res.data);
//         }
//       })
//       .catch(() => {});
//   }, []);

//   useEffect(() => {
//     getAllCategories(null)
//       .then((res: any) => {
//         if (Array.isArray(res?.data)) {
//           setApiCategories(res.data);
//         } else {
//           setApiCategories([]);
//           setErrors({ category: "Failed to load categories" });
//         }
//       })
//       .catch(() => {
//         setApiCategories([]);
//         setErrors({ category: "Failed to load categories" });
//       });
//   }, []);

//   useEffect(() => {
//     if (selectedPincode) {
//       const found = pincodeData.find((p) => p.code === selectedPincode);
//       if (found && found.areas) {
//         setAreaOptions(found.areas);
//         setFormData((prev) => ({
//           ...prev,
//           city: found.city,
//           state: found.state,
//         }));
//       } else {
//         setAreaOptions([]);
//         setFormData((prev) => ({
//           ...prev,
//           city: "",
//           state: "",
//           areaName: "",
//         }));
//       }
//     } else {
//       setAreaOptions([]);
//       setFormData((prev) => ({
//         ...prev,
//         city: "",
//         state: "",
//         areaName: "",
//       }));
//     }
//   }, [selectedPincode, pincodeData]);

//   const handleInputChange = useCallback(
//     (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//       const { name, value } = e.target;
//       setFormData((prev) => ({ ...prev, [name]: value }));
//       if (name === "pincode") {
//         setSelectedPincode(value);
//       }
//       setErrors((prev) => ({ ...prev, [name]: undefined }));
//     },
//     []
//   );

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0] || null;
//     if (file) {
//       const validTypes = ["image/png", "image/jpeg", "image/gif"];
//       if (!validTypes.includes(file.type)) {
//         setErrors({ profileImage: "Please upload a PNG, JPG, or GIF image." });
//         return;
//       }
//       if (file.size > 2 * 1024 * 1024) {
//         setErrors({ profileImage: "Image size must be less than 2MB." });
//         return;
//       }
//       setFormData((prev) => ({ ...prev, profileImage: file }));
//       setImagePreview(URL.createObjectURL(file));
//       setErrors((prev) => ({ ...prev, profileImage: undefined }));
//     }
//   };

//   const validateForm = (): FormErrors => {
//     const newErrors: FormErrors = {};
//     if (!formData.username.trim()) {
//       newErrors.username = "Username is required.";
//     }
//     if (!formData.category) {
//       newErrors.category = "Category is required.";
//     }
//     if (!formData.phoneNumber || !/^\d{10}$/.test(formData.phoneNumber)) {
//       newErrors.phoneNumber = "Phone number must be exactly 10 digits.";
//     }
//     if (
//       !formData.password ||
//       formData.password.length < 6 ||
//       formData.password.length > 10
//     ) {
//       newErrors.password = "Password must be 6-10 characters.";
//     }
//     if (!formData.buildingName.trim()) {
//       newErrors.buildingName = "Building name is required.";
//     }
//     if (!formData.pincode || formData.pincode.length !== 6) {
//       newErrors.pincode = "Pincode must be exactly 6 digits.";
//     }
//     if (!formData.areaName) {
//       newErrors.areaName = "Area is required.";
//     }
//     if (!formData.profileImage) {
//       newErrors.profileImage = "Profile image is required.";
//     }
//     return newErrors;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const validationErrors = validateForm();
//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       return;
//     }

//     setIsSubmitting(true);
//     try {
//       const franchiseId = localStorage.getItem("userId");
//       if (!franchiseId) {
//         setErrors({ username: "Franchise ID not found. Please log in again." });
//         setIsSubmitting(false);
//         return;
//       }

//       const data = { ...formData, franchiseId };
//       console.log("Submitting technician data:", data);
//       setTimeout(() => {
//         alert("Technician added successfully!");
//         setIsSubmitting(false);
//         navigate(-1);
//       }, 1000);
//     } catch (error) {
//       setIsSubmitting(false);
//       setErrors({
//         profileImage: "An error occurred while submitting the form.",
//       });
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
//       <div className="max-w-4xl mx-auto">
//         {/* Header */}
//         <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
//           <div className="flex items-center gap-3">
//             <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
//               <User className="h-6 w-6 text-white" />
//             </div>
//             <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
//               Add Technician
//             </h1>
//           </div>
//           <button
//             onClick={() => navigate(-1)}
//             className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
//           >
//             <ArrowLeft className="h-4 w-4 mr-2" />
//             Back
//           </button>
//         </div>

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="space-y-8">
//           <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
//             <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4">
//               <h2 className="text-lg font-semibold text-white">
//                 Technician Information
//               </h2>
//             </div>

//             <div className="p-6 space-y-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="space-y-2">
//                   <label className="block text-sm font-medium text-gray-700">
//                     Username <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     name="username"
//                     value={formData.username}
//                     onChange={handleInputChange}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                     placeholder="Enter username"
//                     required
//                     aria-describedby={
//                       errors.username ? "username-error" : undefined
//                     }
//                   />
//                   {errors.username && (
//                     <p id="username-error" className="text-red-500 text-sm">
//                       {errors.username}
//                     </p>
//                   )}
//                 </div>

//                 <div className="space-y-2">
//                   <label className="block text-sm font-medium text-gray-700">
//                     Category <span className="text-red-500">*</span>
//                   </label>
//                   <select
//                     name="category"
//                     value={formData.category}
//                     onChange={handleInputChange}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                     required
//                     aria-describedby={
//                       errors.category ? "category-error" : undefined
//                     }
//                   >
//                     <option value="" disabled>
//                       Select a category
//                     </option>
//                     {apiCategories
//                       .filter((category) => category?.status === 1)
//                       .map((item) => (
//                         <option key={item._id} value={item._id}>
//                           {item.category_name}
//                         </option>
//                       ))}
//                   </select>
//                   {errors.category && (
//                     <p id="category-error" className="text-red-500 text-sm">
//                       {errors.category}
//                     </p>
//                   )}
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="space-y-2">
//                   <label className="block text-sm font-medium text-gray-700">
//                     Mobile Number <span className="text-red-500">*</span>
//                   </label>
//                   <div className="flex">
//                     <span className="inline-flex items-center px-3 py-3 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm rounded-l-lg">
//                       🇮🇳 +91
//                     </span>
//                     <input
//                       type="tel"
//                       name="phoneNumber"
//                       value={formData.phoneNumber}
//                       onChange={handleInputChange}
//                       className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                       placeholder="Enter 10-digit mobile number"
//                       pattern="[0-9]{10}"
//                       required
//                       aria-describedby={
//                         errors.phoneNumber ? "phoneNumber-error" : undefined
//                       }
//                     />
//                   </div>
//                   {errors.phoneNumber && (
//                     <p id="phoneNumber-error" className="text-red-500 text-sm">
//                       {errors.phoneNumber}
//                     </p>
//                   )}
//                 </div>

//                 <div className="space-y-2">
//                   <label className="block text-sm font-medium text-gray-700">
//                     Password <span className="text-red-500">*</span>
//                   </label>
//                   <div className="relative">
//                     <input
//                       type={showPassword ? "text" : "password"}
//                       name="password"
//                       value={formData.password}
//                       onChange={handleInputChange}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                       placeholder="6-10 characters"
//                       minLength={6}
//                       maxLength={10}
//                       required
//                       aria-describedby={
//                         errors.password ? "password-error" : undefined
//                       }
//                     />
//                     <span
//                       className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 hover:text-blue-500"
//                       onClick={() => setShowPassword((prev) => !prev)}
//                     >
//                       {showPassword ? (
//                         <EyeOff className="h-5 w-5" />
//                       ) : (
//                         <Eye className="h-5 w-5" />
//                       )}
//                     </span>
//                   </div>
//                   {errors.password && (
//                     <p id="password-error" className="text-red-500 text-sm">
//                       {errors.password}
//                     </p>
//                   )}
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <label className="block text-sm font-medium text-gray-700">
//                   Building Name <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   name="buildingName"
//                   value={formData.buildingName}
//                   onChange={handleInputChange}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                   placeholder="Enter building name"
//                   required
//                   aria-describedby={
//                     errors.buildingName ? "buildingName-error" : undefined
//                   }
//                 />
//                 {errors.buildingName && (
//                   <p id="buildingName-error" className="text-red-500 text-sm">
//                     {errors.buildingName}
//                   </p>
//                 )}
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="space-y-2">
//                   <label className="block text-sm font-medium text-gray-700">
//                     Pincode <span className="text-red-500">*</span>
//                   </label>
//                   <select
//                     name="pincode"
//                     value={formData.pincode}
//                     onChange={handleInputChange}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                     required
//                     aria-describedby={
//                       errors.pincode ? "pincode-error" : undefined
//                     }
//                   >
//                     <option value="" disabled>
//                       Select Pincode
//                     </option>
//                     {pincodeData.map((p) => (
//                       <option key={p._id} value={p.code}>
//                         {p.code}
//                       </option>
//                     ))}
//                   </select>
//                   {errors.pincode && (
//                     <p id="pincode-error" className="text-red-500 text-sm">
//                       {errors.pincode}
//                     </p>
//                   )}
//                 </div>

//                 <div className="space-y-2">
//                   <label className="block text-sm font-medium text-gray-700">
//                     Area <span className="text-red-500">*</span>
//                   </label>
//                   <select
//                     name="areaName"
//                     value={formData.areaName}
//                     onChange={handleInputChange}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100"
//                     required
//                     disabled={!selectedPincode}
//                     aria-describedby={
//                       errors.areaName ? "areaName-error" : undefined
//                     }
//                   >
//                     <option value="" disabled>
//                       Select Area
//                     </option>
//                     {areaOptions.map((a) => (
//                       <option key={a._id} value={a.name}>
//                         {a.name}
//                       </option>
//                     ))}
//                   </select>
//                   {errors.areaName && (
//                     <p id="areaName-error" className="text-red-500 text-sm">
//                       {errors.areaName}
//                     </p>
//                   )}
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="space-y-2">
//                   <label className="block text-sm font-medium text-gray-700">
//                     City <span className="text-red-500">*</span>
//                   </label>
//                   <select
//                     name="city"
//                     value={formData.city}
//                     onChange={handleInputChange}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100"
//                     required
//                     disabled={!selectedPincode}
//                     aria-describedby={errors.city ? "city-error" : undefined}
//                   >
//                     <option value="" disabled>
//                       Select City
//                     </option>
//                     {selectedPincode &&
//                       pincodeData.find((p) => p.code === selectedPincode) && (
//                         <option
//                           value={
//                             pincodeData.find((p) => p.code === selectedPincode)
//                               ?.city
//                           }
//                         >
//                           {
//                             pincodeData.find((p) => p.code === selectedPincode)
//                               ?.city
//                           }
//                         </option>
//                       )}
//                   </select>
//                 </div>

//                 <div className="space-y-2">
//                   <label className="block text-sm font-medium text-gray-700">
//                     State <span className="text-red-500">*</span>
//                   </label>
//                   <select
//                     name="state"
//                     value={formData.state}
//                     onChange={handleInputChange}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100"
//                     required
//                     disabled={!selectedPincode}
//                     aria-describedby={errors.state ? "state-error" : undefined}
//                   >
//                     <option value="" disabled>
//                       Select State
//                     </option>
//                     {selectedPincode &&
//                       pincodeData.find((p) => p.code === selectedPincode) && (
//                         <option
//                           value={
//                             pincodeData.find((p) => p.code === selectedPincode)
//                               ?.state
//                           }
//                         >
//                           {
//                             pincodeData.find((p) => p.code === selectedPincode)
//                               ?.state
//                           }
//                         </option>
//                       )}
//                   </select>
//                 </div>
//               </div>

//               <div className="space-y-4">
//                 <label className="block text-sm font-medium text-gray-700">
//                   Profile Image <span className="text-red-500">*</span>
//                 </label>
//                 <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
//                   <div className="h-20 w-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center shadow-inner">
//                     {imagePreview ? (
//                       <img
//                         src={imagePreview}
//                         alt="Profile preview"
//                         className="h-full w-full object-cover rounded-full"
//                       />
//                     ) : (
//                       <User className="h-8 w-8 text-gray-500" />
//                     )}
//                   </div>
//                   <div className="flex-1">
//                     <input
//                       type="file"
//                       accept="image/png,image/jpeg,image/gif"
//                       className="hidden"
//                       id="profile-image"
//                       onChange={handleImageChange}
//                       required
//                       aria-describedby={
//                         errors.profileImage ? "profileImage-error" : undefined
//                       }
//                     />
//                     <label
//                       htmlFor="profile-image"
//                       className="inline-flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 cursor-pointer transition-colors duration-200"
//                     >
//                       <Upload className="h-4 w-4 mr-2" />
//                       Change profile picture
//                     </label>
//                     <p className="text-sm text-gray-500 mt-2">
//                       JPG, PNG or GIF (max. 2MB)
//                     </p>
//                     {errors.profileImage && (
//                       <p
//                         id="profileImage-error"
//                         className="text-red-500 text-sm mt-2"
//                       >
//                         {errors.profileImage}
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Action Buttons */}
//           <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
//             <button
//               type="button"
//               onClick={() => navigate(-1)}
//               className="w-full sm:w-auto px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
//               disabled={isSubmitting}
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
//               disabled={isSubmitting}
//             >
//               {isSubmitting ? "Processing..." : "Add Technician"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddTechnician;
{
  /* <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value="active"
                      checked={formData.status === 'active'}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <div
                      className={`flex items-center px-4 py-2 rounded-lg border-2 transition-all duration-200 ${
                        formData.status === 'active'
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      <div
                        className={`w-3 h-3 rounded-full mr-2 ${
                          formData.status === 'active' ? 'bg-green-500' : 'bg-gray-300'
                        }`}
                      ></div>
                      Active
                    </div>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value="inactive"
                      checked={formData.status === 'inactive'}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <div
                      className={`flex items-center px-4 py-2 rounded-lg border-2 transition-all duration-200 ${
                        formData.status === 'inactive'
                          ? 'border-red-500 bg-red-50 text-red-700'
                          : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      <div
                        className={`w-3 h-3 rounded-full mr-2 ${
                          formData.status === 'inactive' ? 'bg-red-500' : 'bg-gray-300'
                        }`}
                      ></div>
                      Inactive
                    </div>
                  </label>
                </div>
              </div> */
}

// import React, { useState, useCallback, useEffect } from 'react';
// import { ArrowLeft, Eye, EyeOff, Upload } from 'lucide-react';
// import { getAllCategories, getAllPincodes } from '../../api/apiMethods';
// import { useNavigate } from 'react-router-dom';

// interface TechnicianData {
//   username: string;
//   franchiseId: string;
//   category: string;
//   phoneNumber: string;
//   password: string;
//   buildingName: string;
//   areaName: string;
//   city: string;
//   state: string;
//   pincode: string;
//   profileImage: File | null;
// }

// interface PincodeData {
//   _id: string;
//   code: string;
//   city: string;
//   state: string;
//   areas: { _id: string; name: string }[];
// }

// const initialFormState: TechnicianData = {
//   username: '',
//   franchiseId: '',
//   category: '',
//   phoneNumber: '',
//   password: '',
//   buildingName: '',
//   areaName: '',
//   city: '',
//   state: '',
//   pincode: '',
//   profileImage: null,
// };

// const AddTechnician: React.FC = () => {
//   const [formData, setFormData] = useState<TechnicianData>(initialFormState);
//   const [error, setError] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [apiCategories, setApiCategories] = useState<{ _id: string; category_name: string; status: number }[]>([]);
//   const [pincodeData, setPincodeData] = useState<PincodeData[]>([]);
//   const [selectedPincode, setSelectedPincode] = useState<string>('');
//   const [areaOptions, setAreaOptions] = useState<{ _id: string; name: string }[]>([]);
//   const [showPassword, setShowPassword] = useState(false);
//   const [imagePreview, setImagePreview] = useState<string | null>(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     getAllPincodes()
//       .then((res: any) => {
//         if (Array.isArray(res?.data)) {
//           setPincodeData(res.data);
//         }
//       })
//       .catch(() => {});
//   }, []);

//   useEffect(() => {
//     getAllCategories(null)
//       .then((res: any) => {
//         if (Array.isArray(res?.data)) {
//           setApiCategories(res.data);
//         } else {
//           setApiCategories([]);
//           setError('Failed to load categories');
//         }
//       })
//       .catch(() => {
//         setApiCategories([]);
//         setError('Failed to load categories');
//       });
//   }, []);

//   useEffect(() => {
//     if (selectedPincode) {
//       const found = pincodeData.find((p) => p.code === selectedPincode);
//       if (found && found.areas) {
//         setAreaOptions(found.areas);
//         setFormData((prev) => ({
//           ...prev,
//           city: found.city,
//           state: found.state,
//         }));
//       } else {
//         setAreaOptions([]);
//         setFormData((prev) => ({
//           ...prev,
//           city: '',
//           state: '',
//           areaName: '',
//         }));
//       }
//     } else {
//       setAreaOptions([]);
//       setFormData((prev) => ({
//         ...prev,
//         city: '',
//         state: '',
//         areaName: '',
//       }));
//     }
//   }, [selectedPincode, pincodeData]);

//   const handleChange = useCallback(
//     (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//       const { name, value } = e.target;
//       setFormData((prev) => ({ ...prev, [name]: value }));
//       if (name === 'pincode') {
//         setSelectedPincode(value);
//       }
//     },
//     []
//   );

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       if (!file.type.startsWith('image/')) {
//         setError('Please upload an image file');
//         return;
//       }
//       if (file.size > 2 * 1024 * 1024) {
//         setError('Image size must be less than 2MB');
//         return;
//       }
//       setFormData((prev) => ({ ...prev, profileImage: file }));
//       setImagePreview(URL.createObjectURL(file));
//     }
//   };

//   const handleSubmit = useCallback(
//     async (e: React.FormEvent) => {
//       e.preventDefault();
//       setError(null);
//       setLoading(true);

//       try {
//         const franchiseId = localStorage.getItem('userId');
//         if (!franchiseId) {
//           setError('Franchise ID not found. Please log in again.');
//           setLoading(false);
//           return;
//         }

//         if (!formData.pincode || formData.pincode.length !== 6) {
//           setError('Pincode must be exactly 6 digits');
//           setLoading(false);
//           return;
//         }

//         if (!/^\d{10}$/.test(formData.phoneNumber)) {
//           setError('Phone number must be exactly 10 digits');
//           setLoading(false);
//           return;
//         }

//         if (!formData.profileImage) {
//           setError('Please upload a profile image');
//           setLoading(false);
//           return;
//         }

//         // Log form data (for demo; replace with API call)
//         console.log('Technician Data:', { ...formData, franchiseId });
//         alert('Technician added successfully!');
//         navigate(-1);
//       } catch (err: any) {
//         setError(err?.message || 'Failed to add technician. Please try again.');
//       } finally {
//         setLoading(false);
//       }
//     },
//     [formData, navigate]
//   );

//   return (
//     <div className="max-w-lg mx-auto p-4 bg-gray-50 min-h-screen">
//       <div className="flex items-center justify-between mb-6">
//         <h1 className="text-2xl font-bold text-gray-900">Add Technician</h1>
//         <button
//           onClick={() => navigate(-1)}
//           className="flex items-center px-3 py-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-md transition-colors"
//         >
//           <ArrowLeft className="h-4 w-4 mr-1" />
//           Back
//         </button>
//       </div>

//       {error && (
//         <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm text-center">{error}</div>
//       )}

//       <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-5">
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image <span className="text-red-500">*</span></label>
//           <div className="flex items-center space-x-3">
//             <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
//               {imagePreview ? (
//                 <img src={imagePreview} alt="Profile preview" className="h-full w-full object-cover" />
//               ) : (
//                 <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
//               )}
//             </div>
//             <div>
//               <input
//                 type="file"
//                 id="profileImage"
//                 name="profileImage"
//                 accept="image/*"
//                 onChange={handleImageChange}
//                 className="hidden"
//               />
//               <label
//                 htmlFor="profileImage"
//                 className="inline-flex items-center px-3 py-1.5 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-600 cursor-pointer transition-colors"
//               >
//                 <Upload className="h-4 w-4 mr-1" />
//                 Upload
//               </label>
//             </div>
//           </div>
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Username <span className="text-red-500">*</span></label>
//           <input
//             type="text"
//             name="username"
//             value={formData.username}
//             onChange={handleChange}
//             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//             placeholder="Enter username"
//             required
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Category <span className="text-red-500">*</span></label>
//           <select
//             name="category"
//             value={formData.category}
//             onChange={handleChange}
//             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//             required
//           >
//             <option value="" disabled>Select a category</option>
//             {apiCategories
//               .filter((category) => category?.status === 1)
//               .map((item) => (
//                 <option key={item._id} value={item._id}>
//                   {item.category_name}
//                 </option>
//               ))}
//           </select>
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number <span className="text-red-500">*</span></label>
//           <div className="flex">
//             <span className="inline-flex items-center px-3 py-2 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm rounded-l-md">
//               🇮🇳 +91
//             </span>
//             <input
//               type="tel"
//               name="phoneNumber"
//               value={formData.phoneNumber}
//               onChange={handleChange}
//               className="flex-1 px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//               placeholder="Enter 10-digit phone number"
//               pattern="[0-9]{10}"
//               required
//             />
//           </div>
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Password <span className="text-red-500">*</span></label>
//           <div className="relative">
//             <input
//               type={showPassword ? 'text' : 'password'}
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//               placeholder="6-10 characters"
//               minLength={6}
//               maxLength={10}
//               required
//             />
//             <span
//               className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 hover:text-blue-500"
//               onClick={() => setShowPassword((prev) => !prev)}
//             >
//               {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//             </span>
//           </div>
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Building Name <span className="text-red-500">*</span></label>
//           <input
//             type="text"
//             name="buildingName"
//             value={formData.buildingName}
//             onChange={handleChange}
//             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//             placeholder="Enter building name"
//             required
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Pincode <span className="text-red-500">*</span></label>
//           <select
//             name="pincode"
//             value={formData.pincode}
//             onChange={handleChange}
//             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//             required
//           >
//             <option value="" disabled>Select Pincode</option>
//             {pincodeData.map((p) => (
//               <option key={p._id} value={p.code}>
//                 {p.code}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Area <span className="text-red-500">*</span></label>
//           <select
//             name="areaName"
//             value={formData.areaName}
//             onChange={handleChange}
//             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-100"
//             required
//             disabled={!selectedPincode}
//           >
//             <option value="" disabled>Select Area</option>
//             {areaOptions.map((a) => (
//               <option key={a._id} value={a.name}>
//                 {a.name}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">City <span className="text-red-500">*</span></label>
//           <select
//             name="city"
//             value={formData.city}
//             onChange={handleChange}
//             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-100"
//             required
//             disabled={!selectedPincode}
//           >
//             <option value="" disabled>Select City</option>
//             {selectedPincode && pincodeData.find((p) => p.code === selectedPincode) && (
//               <option value={pincodeData.find((p) => p.code === selectedPincode)?.city}>
//                 {pincodeData.find((p) => p.code === selectedPincode)?.city}
//               </option>
//             )}
//           </select>
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">State <span className="text-red-500">*</span></label>
//           <select
//             name="state"
//             value={formData.state}
//             onChange={handleChange}
//             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-100"
//             required
//             disabled={!selectedPincode}
//           >
//             <option value="" disabled>Select State</option>
//             {selectedPincode && pincodeData.find((p) => p.code === selectedPincode) && (
//               <option value={pincodeData.find((p) => p.code === selectedPincode)?.state}>
//                 {pincodeData.find((p) => p.code === selectedPincode)?.state}
//               </option>
//             )}
//           </select>
//         </div>

//         <div className="flex justify-end space-x-3">
//           <button
//             type="button"
//             onClick={() => navigate(-1)}
//             className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             disabled={loading}
//             className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
//           >
//             {loading ? (
//               <div className="flex items-center">
//                 <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z" />
//                 </svg>
//                 Saving...
//               </div>
//             ) : (
//               'Save Technician'
//             )}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default AddTechnician;
// import React, { useState, useCallback, useEffect } from 'react';
// import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
// import { getAllCategories, getAllPincodes, getPlans } from '../../api/apiMethods';
// import { useNavigate } from 'react-router-dom';

// interface TechnicianData {
//   username: string;
//   franchiseId: string;
//   category: string;
//   phoneNumber: string;
//   password: string;
//   buildingName: string;
//   areaName: string;
//   city: string;
//   state: string;
//   pincode: string;
//   subscriptionId: string;
// }

// interface PincodeData {
//   _id: string;
//   code: string;
//   city: string;
//   state: string;
//   areas: { _id: string; name: string }[];
// }

// interface SubscriptionPlan {
//   _id: string;
//   name: string;
//   price: number;
//   finalPrice: number;
//   gst: number;
// }

// const initialFormState: TechnicianData = {
//   username: '',
//   franchiseId: '',
//   category: '',
//   phoneNumber: '',
//   password: '',
//   buildingName: '',
//   areaName: '',
//   city: '',
//   state: '',
//   pincode: '',
//   subscriptionId: '',
// };

// const AddTechnician: React.FC = () => {
//   const [formData, setFormData] = useState<TechnicianData>(initialFormState);
//   const [error, setError] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [apiCategories, setApiCategories] = useState<{ _id: string; category_name: string; status: number }[]>([]);
//   const [pincodeData, setPincodeData] = useState<PincodeData[]>([]);
//   const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>([]);
//   const [selectedPincode, setSelectedPincode] = useState<string>('');
//   const [areaOptions, setAreaOptions] = useState<{ _id: string; name: string }[]>([]);
//   const [showPassword, setShowPassword] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     getAllPincodes()
//       .then((res: any) => {
//         if (Array.isArray(res?.data)) {
//           setPincodeData(res.data);
//         }
//       })
//       .catch(() => {});
//   }, []);

//   useEffect(() => {
//     getAllCategories(null)
//       .then((res: any) => {
//         if (Array.isArray(res?.data)) {
//           setApiCategories(res.data);
//         } else {
//           setApiCategories([]);
//           setError('Failed to load categories');
//         }
//       })
//       .catch(() => {
//         setApiCategories([]);
//         setError('Failed to load categories');
//       });
//   }, []);

//   useEffect(() => {
//     getPlans()
//       .then((res: any) => {
//         if (Array.isArray(res?.data)) {
//           setSubscriptionPlans(res.data);
//         } else {
//           setSubscriptionPlans([]);
//           setError('Failed to load subscription plans');
//         }
//       })
//       .catch(() => {
//         setSubscriptionPlans([]);
//         setError('Failed to load subscription plans');
//       });
//   }, []);

//   useEffect(() => {
//     if (selectedPincode) {
//       const found = pincodeData.find((p) => p.code === selectedPincode);
//       if (found && found.areas) {
//         setAreaOptions(found.areas);
//         setFormData((prev) => ({
//           ...prev,
//           city: found.city,
//           state: found.state,
//         }));
//       } else {
//         setAreaOptions([]);
//         setFormData((prev) => ({
//           ...prev,
//           city: '',
//           state: '',
//           areaName: '',
//         }));
//       }
//     } else {
//       setAreaOptions([]);
//       setFormData((prev) => ({
//         ...prev,
//         city: '',
//         state: '',
//         areaName: '',
//       }));
//     }
//   }, [selectedPincode, pincodeData]);

//   const handleChange = useCallback(
//     (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//       const { name, value } = e.target;
//       setFormData((prev) => ({ ...prev, [name]: value }));
//       if (name === 'pincode') {
//         setSelectedPincode(value);
//       }
//     },
//     []
//   );

//   const handleSubmit = useCallback(
//     async (e: React.FormEvent) => {
//       e.preventDefault();
//       setError(null);
//       setLoading(true);

//       try {
//         const franchiseId = localStorage.getItem('userId');
//         if (!franchiseId) {
//           setError('Franchise ID not found. Please log in again.');
//           setLoading(false);
//           return;
//         }

//         if (!formData.pincode || formData.pincode.length !== 6) {
//           setError('Pincode must be exactly 6 digits');
//           setLoading(false);
//           return;
//         }

//         if (!/^\d{10}$/.test(formData.phoneNumber)) {
//           setError('Phone number must be exactly 10 digits');
//           setLoading(false);
//           return;
//         }

//         if (!formData.subscriptionId) {
//           setError('Please select a subscription plan');
//           setLoading(false);
//           return;
//         }

//         const selectedPlan = subscriptionPlans.find((plan) => plan._id === formData.subscriptionId);
//         if (!selectedPlan) {
//           setError('Selected subscription plan is invalid');
//           setLoading(false);
//           return;
//         }

//         navigate('/buyPlan', {
//           state: {
//             plan: selectedPlan,
//             technicianData: { ...formData, franchiseId },
//           },
//         });
//       } catch (err: any) {
//         setError(err?.data?.error?.[0] || err?.message || 'Failed to proceed. Please try again.');
//       } finally {
//         setLoading(false);
//       }
//     },
//     [formData, subscriptionPlans, navigate]
//   );

//   return (
//     <div className="space-y-6 max-w-3xl mx-auto">
//       <div className="flex items-center justify-between">
//         <h1 className="text-2xl font-bold text-gray-900">Add Technician</h1>
//         <button
//           onClick={() => navigate(-1)}
//           className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800"
//         >
//           <ArrowLeft className="h-4 w-4 mr-2" />
//           Back
//         </button>
//       </div>

//       {error && (
//         <div className="text-red-600 text-sm text-center bg-red-100 p-3 rounded-lg">{error}</div>
//       )}

//       <form onSubmit={handleSubmit} className="space-y-6">
//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//           <div className="space-y-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Username <span className="text-red-500">*</span></label>
//               <input
//                 type="text"
//                 name="username"
//                 value={formData.username}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 placeholder="Enter username"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Category <span className="text-red-500">*</span></label>
//               <select
//                 name="category"
//                 value={formData.category}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 required
//               >
//                 <option value="" disabled>Select a category</option>
//                 {apiCategories
//                   .filter((category) => category?.status === 1)
//                   .map((item) => (
//                     <option key={item._id} value={item._id}>
//                       {item.category_name}
//                     </option>
//                   ))}
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number <span className="text-red-500">*</span></label>
//               <div className="flex">
//                 <span className="inline-flex items-center px-3 py-2 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm rounded-l-md">
//                   🇮🇳 +91
//                 </span>
//                 <input
//                   type="tel"
//                   name="phoneNumber"
//                   value={formData.phoneNumber}
//                   onChange={handleChange}
//                   className="flex-1 px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   placeholder="Enter 10-digit phone number"
//                   pattern="[0-9]{10}"
//                   required
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Password <span className="text-red-500">*</span></label>
//               <div className="relative">
//                 <input
//                   type={showPassword ? 'text' : 'password'}
//                   name="password"
//                   value={formData.password}
//                   onChange={handleChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   placeholder="6-10 characters"
//                   minLength={6}
//                   maxLength={10}
//                   required
//                 />
//                 <span
//                   className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 hover:text-blue-500"
//                   onClick={() => setShowPassword((prev) => !prev)}
//                 >
//                   {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
//                 </span>
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Building Name <span className="text-red-500">*</span></label>
//               <input
//                 type="text"
//                 name="buildingName"
//                 value={formData.buildingName}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 placeholder="Enter building name"
//                 required
//               />
//             </div>
//           </div>
//         </div>

//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//           <div className="space-y-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Pincode <span className="text-red-500">*</span></label>
//               <select
//                 name="pincode"
//                 value={formData.pincode}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 required
//               >
//                 <option value="" disabled>Select Pincode</option>
//                 {pincodeData.map((p) => (
//                   <option key={p._id} value={p.code}>
//                     {p.code}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Area <span className="text-red-500">*</span></label>
//               <select
//                 name="areaName"
//                 value={formData.areaName}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 required
//                 disabled={!selectedPincode}
//               >
//                 <option value="" disabled>Select Area</option>
//                 {areaOptions.map((a) => (
//                   <option key={a._id} value={a.name}>
//                     {a.name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">City <span className="text-red-500">*</span></label>
//               <select
//                 name="city"
//                 value={formData.city}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 required
//                 disabled={!selectedPincode}
//               >
//                 <option value="" disabled>Select City</option>
//                 {selectedPincode && pincodeData.find((p) => p.code === selectedPincode) && (
//                   <option value={pincodeData.find((p) => p.code === selectedPincode)?.city}>
//                     {pincodeData.find((p) => p.code === selectedPincode)?.city}
//                   </option>
//                 )}
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">State <span className="text-red-500">*</span></label>
//               <select
//                 name="state"
//                 value={formData.state}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 required
//                 disabled={!selectedPincode}
//               >
//                 <option value="" disabled>Select State</option>
//                 {selectedPincode && pincodeData.find((p) => p.code === selectedPincode) && (
//                   <option value={pincodeData.find((p) => p.code === selectedPincode)?.state}>
//                     {pincodeData.find((p) => p.code === selectedPincode)?.state}
//                   </option>
//                 )}
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Subscription Plan <span className="text-red-500">*</span></label>
//               <select
//                 name="subscriptionId"
//                 value={formData.subscriptionId}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 required
//               >
//                 <option value="" disabled>Select Subscription Plan</option>
//                 {subscriptionPlans
//                   .filter((plan) => plan.name !== 'Free Plan')
//                   .map((plan) => (
//                     <option key={plan._id} value={plan._id}>
//                       {plan.name} - ₹{plan.finalPrice} ({plan.price} + {plan.gst} GST)
//                     </option>
//                   ))}
//               </select>
//             </div>
//           </div>
//         </div>

//         <div className="flex items-center justify-between">
//           <button
//             type="button"
//             onClick={() => navigate(-1)}
//             className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             disabled={loading}
//             className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-md hover:from-blue-600 hover:to-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
//           >
//             {loading ? (
//               <div className="flex items-center justify-center">
//                 <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z" />
//                 </svg>
//                 Processing...
//               </div>
//             ) : (
//               'Proceed to Payment'
//             )}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default AddTechnician;
// import React, { useState } from 'react';
// import { ArrowLeft, Upload } from 'lucide-react';

// interface AddProviderProps {
//   onBack: () => void;
// }

// const AddProvider: React.FC<AddProviderProps> = ({ onBack }) => {
//   const [formData, setFormData] = useState({
//     name: '',
//     mobileNumber: '',
//     email: '',
//     status: 'active',
//     bdaName: '',
//     videoLink: ''
//   });

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     console.log('Provider created:', formData);
//     alert('Provider created successfully!');
//     onBack();
//   };

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <h1 className="text-2xl font-bold text-gray-900">Add Provider</h1>
//         <button
//           onClick={onBack}
//           className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800"
//         >
//           <ArrowLeft className="h-4 w-4 mr-2" />
//           Back
//         </button>
//       </div>

//       <form onSubmit={handleSubmit} className="space-y-6">
//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//           <div className="space-y-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Name(English)</label>
//               <input
//                 type="text"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleInputChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number</label>
//               <div className="flex">
//                 <span className="inline-flex items-center px-3 py-2 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm rounded-l-md">
//                   🇮🇳 +91
//                 </span>
//                 <input
//                   type="tel"
//                   name="mobileNumber"
//                   value={formData.mobileNumber}
//                   onChange={handleInputChange}
//                   className="flex-1 px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   required
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
//               <input
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleInputChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Profile Image</label>
//               <div className="flex items-center space-x-4">
//                 <div className="h-20 w-20 bg-gray-200 rounded-full flex items-center justify-center">
//                   <div className="h-16 w-16 bg-gray-300 rounded-full"></div>
//                 </div>
//                 <button
//                   type="button"
//                   className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
//                 >
//                   Change profile picture
//                 </button>
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
//               <div className="flex items-center space-x-4">
//                 <label className="flex items-center">
//                   <input
//                     type="radio"
//                     name="status"
//                     value="active"
//                     checked={formData.status === 'active'}
//                     onChange={handleInputChange}
//                     className="mr-2"
//                   />
//                   Active
//                 </label>
//                 <label className="flex items-center">
//                   <input
//                     type="radio"
//                     name="status"
//                     value="inactive"
//                     checked={formData.status === 'inactive'}
//                     onChange={handleInputChange}
//                     className="mr-2"
//                   />
//                   Inactive
//                 </label>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//           <h2 className="text-lg font-semibold text-gray-900 mb-6">Service Gallery</h2>

//           <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
//             <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//             <p className="text-gray-600 mb-2">Upload service image <span className="text-red-500">*</span></p>
//             <input
//               type="file"
//               accept="image/*"
//               className="hidden"
//               id="service-image"
//             />
//             <label
//               htmlFor="service-image"
//               className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-md hover:from-blue-600 hover:to-blue-700 cursor-pointer"
//             >
//               Choose File
//             </label>
//           </div>
//         </div>

//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//           <div className="space-y-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">BDA</label>
//               <select
//                 name="bdaName"
//                 value={formData.bdaName}
//                 onChange={handleInputChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               >
//                 <option value="">Select BDA Name</option>
//                 <option value="bda1">BDA 1</option>
//                 <option value="bda2">BDA 2</option>
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Video Link</label>
//               <input
//                 type="url"
//                 name="videoLink"
//                 value={formData.videoLink}
//                 onChange={handleInputChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 placeholder="https://..."
//               />
//             </div>
//           </div>
//         </div>

//         <div className="flex items-center justify-between">
//           <button
//             type="button"
//             onClick={onBack}
//             className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-md hover:from-blue-600 hover:to-blue-700"
//           >
//             Submit
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default AddProvider;
