import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllPincodes, getFranchisePlans, registerFranchiseByAdmin } from '../../api/apiMethods';
import { ArrowLeft, User } from 'lucide-react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

interface FranchiseData {
  username: string;
  phoneNumber: string;
  password: string;
  buildingName: string;
  areaName: string;
  city: string;
  state: string;
  pincode: string;
  subscriptionPlanId: string;
}

interface PincodeData {
  _id: string;
  code: string;
  city: string;
  state: string;
  areas: { _id: string; name: string }[];
}

interface SubscriptionPlan {
  _id: string;
  name: string;
  originalPrice: number;
  price: number;
  gst: number;
  finalPrice: number;
}

interface FormErrors {
  [key: string]: string | undefined;
}

const initialFormState: FranchiseData = {
  username: '',
  phoneNumber: '',
  password: '',
  buildingName: '',
  areaName: '',
  city: '',
  state: '',
  pincode: '',
  subscriptionPlanId: '',
};

const AddFranchise: React.FC = () => {
  const [formData, setFormData] = useState<FranchiseData>(initialFormState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pincodeData, setPincodeData] = useState<PincodeData[]>([]);
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>([]);
  const [selectedPincode, setSelectedPincode] = useState<string>('');
  const [areaOptions, setAreaOptions] = useState<{ _id: string; name: string }[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const navigate = useNavigate();

  useEffect(() => {
    getAllPincodes()
      .then((res: any) => {
        if (Array.isArray(res?.data)) {
          setPincodeData(res.data);
        }
      })
      .catch(() => {});

    getFranchisePlans()
      .then((res: any) => {
        if (res?.success && Array.isArray(res?.data)) {
          setSubscriptionPlans(res.data.map((plan: any) => ({
            _id: plan._id,
            name: plan.name,
            originalPrice: plan.originalPrice,
            price: plan.price,
            gst: plan.gst,
            finalPrice: plan.finalPrice,
          })));
        }
      })
      .catch(() => {});
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
          areaName: '',
        }));
      } else {
        setAreaOptions([]);
        setFormData((prev) => ({
          ...prev,
          city: '',
          state: '',
          areaName: '',
        }));
      }
    } else {
      setAreaOptions([]);
      setFormData((prev) => ({
        ...prev,
        city: '',
        state: '',
        areaName: '',
      }));
    }
  }, [selectedPincode, pincodeData]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (name === 'pincode') {
        setSelectedPincode(value);
      }
      setErrors((prev) => ({ ...prev, [name]: undefined }));
      setSubmissionStatus('idle');
    },
    []
  );

  const validateForm = useCallback((): FormErrors => {
    const newErrors: FormErrors = {};
    if (!formData.username.trim()) {
      newErrors.username = 'Name is required.';
    }
    if (!formData.phoneNumber || !/^\d{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Phone number must be exactly 10 digits.';
    }
    if (!formData.password || formData.password.length < 6 || formData.password.length > 10) {
      newErrors.password = 'Password must be 6-10 characters.';
    }
    if (!formData.buildingName.trim()) {
      newErrors.buildingName = 'Building name is required.';
    }
    if (!formData.pincode || formData.pincode.length !== 6) {
      newErrors.pincode = 'Pincode must be exactly 6 digits.';
    }
    if (!formData.areaName) {
      newErrors.areaName = 'Area is required.';
    }
    if (!formData.city) {
      newErrors.city = 'City is required.';
    }
    if (!formData.state) {
      newErrors.state = 'State is required.';
    }
    if (!formData.subscriptionPlanId) {
      newErrors.subscriptionPlanId = 'Subscription plan is required.';
    }
    return newErrors;
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSubmissionStatus('error');
      return;
    }

    setIsSubmitting(true);
    setSubmissionStatus('idle');

    try {
      // Dynamically construct payload from formData
      const payload = Object.keys(formData).reduce((acc, key) => {
        if (key === 'subscriptionPlanId') {
          acc['franchiseSubscriptionId'] = formData[key];
        } else {
          acc[key] = formData[key as keyof FranchiseData];
        }
        return acc;
      }, {} as Record<string, string>);

      await registerFranchiseByAdmin(payload);
      setSubmissionStatus('success');
      
      // Dynamic post-submission actions
      setFormData(initialFormState);
      setSelectedPincode('');
      setAreaOptions([]);
      alert('Franchise added successfully!');

      // Optional: Redirect after a delay
      setTimeout(() => {
        navigate('/management/franchises/all'); // Adjust the route as needed
      }, 6000);
    } catch (error: any) {
      // Dynamic server-side error handling
      const serverErrors: FormErrors = {};
      if (error?.data?.errors && Array.isArray(error.data.errors)) {
        error.data.errors.forEach((err: { field: string; message: string }) => {
          serverErrors[err.field] = err.message;
        });
      } else {
        serverErrors.global = error?.data?.error?.[0] || error?.message || 'Registration failed. Please try again.';
      }
      setErrors(serverErrors);
      setSubmissionStatus('error');
      alert('Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
              <User className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Add Franchise</h1>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
            disabled={isSubmitting}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
              <h2 className="text-lg font-semibold text-white">Franchise Information</h2>
            </div>

            <div className="p-6 space-y-6">
              {submissionStatus === 'success' && (
                <div className="text-green-600 text-sm text-center bg-green-50 p-2 rounded">
                  Franchise added successfully! Redirecting...
                </div>
              )}
              {submissionStatus === 'error' && Object.keys(errors).length > 0 && (
                <div className="text-red-600 text-sm text-center bg-red-50 p-2 rounded">
                  {errors.global || Object.values(errors)[0]}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter name"
                    required
                    aria-describedby={errors.username ? 'username-error' : undefined}
                    disabled={isSubmitting}
                  />
                  {errors.username && (
                    <p id="username-error" className="text-red-500 text-sm">
                      {errors.username}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Phone Number <span className="text-red-500">*</span>
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
                      placeholder="Enter 10-digit phone number"
                      pattern="[0-9]{10}"
                      required
                      aria-describedby={errors.phoneNumber ? 'phoneNumber-error' : undefined}
                      disabled={isSubmitting}
                    />
                  </div>
                  {errors.phoneNumber && (
                    <p id="phoneNumber-error" className="text-red-500 text-sm">
                      {errors.phoneNumber}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="6-10 characters"
                      minLength={6}
                      maxLength={10}
                      required
                      aria-describedby={errors.password ? 'password-error' : undefined}
                      disabled={isSubmitting}
                    />
                    <span
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 hover:text-blue-500"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                    </span>
                  </div>
                  {errors.password && (
                    <p id="password-error" className="text-red-500 text-sm">
                      {errors.password}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    House/Building Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="buildingName"
                    value={formData.buildingName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter building name"
                    required
                    aria-describedby={errors.buildingName ? 'buildingName-error' : undefined}
                    disabled={isSubmitting}
                  />
                  {errors.buildingName && (
                    <p id="buildingName-error" className="text-red-500 text-sm">
                      {errors.buildingName}
                    </p>
                  )}
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
                    aria-describedby={errors.pincode ? 'pincode-error' : undefined}
                    disabled={isSubmitting}
                  >
                    <option value="" disabled>Select Pincode</option>
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
                    disabled={!selectedPincode || isSubmitting}
                    aria-describedby={errors.areaName ? 'areaName-error' : undefined}
                  >
                    <option value="" disabled>Select Area</option>
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
                    City <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100"
                    required
                    disabled={!selectedPincode || isSubmitting}
                    aria-describedby={errors.city ? 'city-error' : undefined}
                  >
                    <option value="" disabled>Select City</option>
                    {selectedPincode && pincodeData.find((p) => p.code === selectedPincode) && (
                      <option value={pincodeData.find((p) => p.code === selectedPincode)?.city}>
                        {pincodeData.find((p) => p.code === selectedPincode)?.city}
                      </option>
                    )}
                  </select>
                  {errors.city && (
                    <p id="city-error" className="text-red-500 text-sm">
                      {errors.city}
                    </p>
                  )}
                </div>

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
                    disabled={!selectedPincode || isSubmitting}
                    aria-describedby={errors.state ? 'state-error' : undefined}
                  >
                    <option value="" disabled>Select State</option>
                    {selectedPincode && pincodeData.find((p) => p.code === selectedPincode) && (
                      <option value={pincodeData.find((p) => p.code === selectedPincode)?.state}>
                        {pincodeData.find((p) => p.code === selectedPincode)?.state}
                      </option>
                    )}
                  </select>
                  {errors.state && (
                    <p id="state-error" className="text-red-500 text-sm">
                      {errors.state}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Subscription Plan <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="subscriptionPlanId"
                    value={formData.subscriptionPlanId}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    required
                    aria-describedby={errors.subscriptionPlanId ? 'subscriptionPlanId-error' : undefined}
                    disabled={isSubmitting}
                  >
                    <option value="" disabled>Select Subscription Plan</option>
                    {subscriptionPlans.map((plan) => (
                      <option key={plan._id} value={plan._id}>
                        {plan.name} - ₹{plan.finalPrice} ({plan.price} + {plan.gst} GST)
                      </option>
                    ))}
                  </select>
                  {errors.subscriptionPlanId && (
                    <p id="subscriptionPlanId-error" className="text-red-500 text-sm">
                      {errors.subscriptionPlanId}
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
              {isSubmitting ? 'Processing...' : 'Add Franchise'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddFranchise;
// import React, { useState, useCallback, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { getAllPincodes, getFranchisePlans, registerFranchiseByAdmin } from '../../api/apiMethods';
// import { ArrowLeft, User } from 'lucide-react';
// import { FaEye, FaEyeSlash } from 'react-icons/fa';

// interface FranchiseData {
//   username: string;
//   phoneNumber: string;
//   password: string;
//   buildingName: string;
//   areaName: string;
//   city: string;
//   state: string;
//   pincode: string;
//   subscriptionPlanId: string;
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
//   originalPrice: number;
//   price: number;
//   gst: number;
//   finalPrice: number;
// }

// interface FormErrors {
//   username?: string;
//   phoneNumber?: string;
//   password?: string;
//   buildingName?: string;
//   pincode?: string;
//   areaName?: string;
//   city?: string;
//   state?: string;
//   subscriptionPlanId?: string;
// }

// const initialFormState: FranchiseData = {
//   username: '',
//   phoneNumber: '',
//   password: '',
//   buildingName: '',
//   areaName: '',
//   city: '',
//   state: '',
//   pincode: '',
//   subscriptionPlanId: '',
// };

// const AddFranchise: React.FC = () => {
//   const [formData, setFormData] = useState<FranchiseData>(initialFormState);
//   const [errors, setErrors] = useState<FormErrors>({});
//   const [isSubmitting, setIsSubmitting] = useState(false);
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

//     getFranchisePlans()
//       .then((res: any) => {
//         if (res?.success && Array.isArray(res?.data)) {
//           setSubscriptionPlans(res.data.map((plan: any) => ({
//             _id: plan._id,
//             name: plan.name,
//             originalPrice: plan.originalPrice,
//             price: plan.price,
//             gst: plan.gst,
//             finalPrice: plan.finalPrice,
//           })));
//         }
//       })
//       .catch(() => {});
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

//   const handleInputChange = useCallback(
//     (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//       const { name, value } = e.target;
//       setFormData((prev) => ({ ...prev, [name]: value }));
//       if (name === 'pincode') {
//         setSelectedPincode(value);
//       }
//       setErrors((prev) => ({ ...prev, [name]: undefined }));
//     },
//     []
//   );

//   const validateForm = (): FormErrors => {
//     const newErrors: FormErrors = {};
//     if (!formData.username.trim()) {
//       newErrors.username = 'Name is required.';
//     }
//     if (!formData.phoneNumber || !/^\d{10}$/.test(formData.phoneNumber)) {
//       newErrors.phoneNumber = 'Phone number must be exactly 10 digits.';
//     }
//     if (!formData.password || formData.password.length < 6 || formData.password.length > 10) {
//       newErrors.password = 'Password must be 6-10 characters.';
//     }
//     if (!formData.buildingName.trim()) {
//       newErrors.buildingName = 'Building name is required.';
//     }
//     if (!formData.pincode || formData.pincode.length !== 6) {
//       newErrors.pincode = 'Pincode must be exactly 6 digits.';
//     }
//     if (!formData.areaName) {
//       newErrors.areaName = 'Area is required.';
//     }
//     if (!formData.city) {
//       newErrors.city = 'City is required.';
//     }
//     if (!formData.state) {
//       newErrors.state = 'State is required.';
//     }
//     if (!formData.subscriptionPlanId) {
//       newErrors.subscriptionPlanId = 'Subscription plan is required.';
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
//       const payload = {
//         username: formData.username,
//         phoneNumber: formData.phoneNumber,
//         password: formData.password,
//         buildingName: formData.buildingName,
//         areaName: formData.areaName,
//         city: formData.city,
//         state: formData.state,
//         pincode: formData.pincode,
//         franchiseSubscriptionId: formData.subscriptionPlanId,
//       };
//       await registerFranchiseByAdmin(payload);
//       alert("Franchise added successfully!");


//     } catch (error: any) {
//       setErrors({
//         username: error?.data?.error?.[0] || error?.message || 'Registration failed. Please try again.',
//       });
//       alert("something went wrong");
//     } finally {
//       setIsSubmitting(false);
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
//             <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Add Franchise</h1>
//           </div>
//           <button
//             onClick={() => navigate(-1)}
//             className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
//             disabled={isSubmitting}
//           >
//             <ArrowLeft className="h-4 w-4 mr-2" />
//             Back
//           </button>
//         </div>

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="space-y-8">
//           <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
//             <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
//               <h2 className="text-lg font-semibold text-white">Franchise Information</h2>
//             </div>

//             <div className="p-6 space-y-6">
//               {Object.keys(errors).length > 0 && (
//                 <div className="text-red-600 text-sm text-center bg-red-50 p-2 rounded">
//                   {Object.values(errors)[0]}
//                 </div>
//               )}

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="space-y-2">
//                   <label className="block text-sm font-medium text-gray-700">
//                     Name <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     name="username"
//                     value={formData.username}
//                     onChange={handleInputChange}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                     placeholder="Enter name"
//                     required
//                     aria-describedby={errors.username ? 'username-error' : undefined}
//                   />
//                   {errors.username && (
//                     <p id="username-error" className="text-red-500 text-sm">
//                       {errors.username}
//                     </p>
//                   )}
//                 </div>

//                 <div className="space-y-2">
//                   <label className="block text-sm font-medium text-gray-700">
//                     Phone Number <span className="text-red-500">*</span>
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
//                       placeholder="Enter 10-digit phone number"
//                       pattern="[0-9]{10}"
//                       required
//                       aria-describedby={errors.phoneNumber ? 'phoneNumber-error' : undefined}
//                     />
//                   </div>
//                   {errors.phoneNumber && (
//                     <p id="phoneNumber-error" className="text-red-500 text-sm">
//                       {errors.phoneNumber}
//                     </p>
//                   )}
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="space-y-2">
//                   <label className="block text-sm font-medium text-gray-700">
//                     Password <span className="text-red-500">*</span>
//                   </label>
//                   <div className="relative">
//                     <input
//                       type={showPassword ? 'text' : 'password'}
//                       name="password"
//                       value={formData.password}
//                       onChange={handleInputChange}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                       placeholder="6-10 characters"
//                       minLength={6}
//                       maxLength={10}
//                       required
//                       aria-describedby={errors.password ? 'password-error' : undefined}
//                     />
//                     <span
//                       className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 hover:text-blue-500"
//                       onClick={() => setShowPassword((prev) => !prev)}
//                     >
//                       {showPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
//                     </span>
//                   </div>
//                   {errors.password && (
//                     <p id="password-error" className="text-red-500 text-sm">
//                       {errors.password}
//                     </p>
//                   )}
//                 </div>

//                 <div className="space-y-2">
//                   <label className="block text-sm font-medium text-gray-700">
//                     House/Building Name <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     name="buildingName"
//                     value={formData.buildingName}
//                     onChange={handleInputChange}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                     placeholder="Enter building name"
//                     required
//                     aria-describedby={errors.buildingName ? 'buildingName-error' : undefined}
//                   />
//                   {errors.buildingName && (
//                     <p id="buildingName-error" className="text-red-500 text-sm">
//                       {errors.buildingName}
//                     </p>
//                   )}
//                 </div>
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
//                     aria-describedby={errors.pincode ? 'pincode-error' : undefined}
//                   >
//                     <option value="" disabled>Select Pincode</option>
//                     {pincodeData
//                       .sort((a, b) => Number(a.code) - Number(b.code))
//                       .map((p) => (
//                         <option key={p._id} value={p.code}>
//                           {p.code}
//                         </option>
//                       ))}
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
//                     aria-describedby={errors.areaName ? 'areaName-error' : undefined}
//                   >
//                     <option value="" disabled>Select Area</option>
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
//                     aria-describedby={errors.city ? 'city-error' : undefined}
//                   >
//                     <option value="" disabled>Select City</option>
//                     {selectedPincode && pincodeData.find((p) => p.code === selectedPincode) && (
//                       <option value={pincodeData.find((p) => p.code === selectedPincode)?.city}>
//                         {pincodeData.find((p) => p.code === selectedPincode)?.city}
//                       </option>
//                     )}
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
//                     aria-describedby={errors.state ? 'state-error' : undefined}
//                   >
//                     <option value="" disabled>Select State</option>
//                     {selectedPincode && pincodeData.find((p) => p.code === selectedPincode) && (
//                       <option value={pincodeData.find((p) => p.code === selectedPincode)?.state}>
//                         {pincodeData.find((p) => p.code === selectedPincode)?.state}
//                       </option>
//                     )}
//                   </select>
//                   {errors.state && (
//                     <p id="state-error" className="text-red-500 text-sm">
//                       {errors.state}
//                     </p>
//                   )}
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="space-y-2">
//                   <label className="block text-sm font-medium text-gray-700">
//                     Subscription Plan <span className="text-red-500">*</span>
//                   </label>
//                   <select
//                     name="subscriptionPlanId"
//                     value={formData.subscriptionPlanId}
//                     onChange={handleInputChange}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                     required
//                     aria-describedby={errors.subscriptionPlanId ? 'subscriptionPlanId-error' : undefined}
//                   >
//                     <option value="" disabled>Select Subscription Plan</option>
//                     {subscriptionPlans.map((plan) => (
//                       <option key={plan._id} value={plan._id}>
//                        {plan.name} - ₹{plan.finalPrice} ({plan.price} + {plan.gst} GST)
//                       </option>
//                     ))}
//                   </select>
//                   {errors.subscriptionPlanId && (
//                     <p id="subscriptionPlanId-error" className="text-red-500 text-sm">
//                       {errors.subscriptionPlanId}
//                     </p>
//                   )}
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
//               {isSubmitting ? 'Processing...' : 'Add Franchise'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddFranchise;

// import React, { useState, useCallback, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { getAllPincodes, getFranchisePlans} from '../../api/apiMethods';
// import { FaEye, FaEyeSlash } from 'react-icons/fa';

// interface FranchiseData {
//   username: string;
//   phoneNumber: string;
//   password: string;
//   buildingName: string;
//   areaName: string;
//   city: string;
//   state: string;
//   pincode: string;
//   subscriptionPlanId: string;
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
//   originalPrice: number;
//   price: number;
//   gst: number;
//   finalPrice: number;
// }

// interface FormErrors {
//   username?: string;
//   phoneNumber?: string;
//   password?: string;
//   buildingName?: string;
//   pincode?: string;
//   areaName?: string;
//   city?: string;
//   state?: string;
//   subscriptionPlanId?: string;
// }

// const initialFormState: FranchiseData = {
//   username: '',
//   phoneNumber: '',
//   password: '',
//   buildingName: '',
//   areaName: '',
//   city: '',
//   state: '',
//   pincode: '',
//   subscriptionPlanId: '',
// };

// const AddFranchise: React.FC = () => {
//   const [formData, setFormData] = useState<FranchiseData>(initialFormState);
//   const [errors, setErrors] = useState<FormErrors>({});
//   const [isSubmitting, setIsSubmitting] = useState(false);
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

//     getFranchisePlans()
//       .then((res: any) => {
//         if (res?.success && Array.isArray(res?.data)) {
//           setSubscriptionPlans(res.data.map((plan: any) => ({
//             _id: plan._id,
//             name: plan.name,
//             originalPrice: plan.originalPrice,
//             price: plan.price,
//             gst: plan.gst,
//             finalPrice: plan.finalPrice,
//           })));
//         }
//       })
//       .catch(() => {});
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

//   const handleInputChange = useCallback(
//     (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//       const { name, value } = e.target;
//       setFormData((prev) => ({ ...prev, [name]: value }));
//       if (name === 'pincode') {
//         setSelectedPincode(value);
//       }
//       setErrors((prev) => ({ ...prev, [name]: undefined }));
//     },
//     []
//   );

//   const validateForm = (): FormErrors => {
//     const newErrors: FormErrors = {};
//     if (!formData.username.trim()) {
//       newErrors.username = 'Name is required.';
//     }
//     if (!formData.phoneNumber || !/^\d{10}$/.test(formData.phoneNumber)) {
//       newErrors.phoneNumber = 'Phone number must be exactly 10 digits.';
//     }
//     if (!formData.password || formData.password.length < 6 || formData.password.length > 10) {
//       newErrors.password = 'Password must be 6-10 characters.';
//     }
//     if (!formData.buildingName.trim()) {
//       newErrors.buildingName = 'Building name is required.';
//     }
//     if (!formData.pincode || formData.pincode.length !== 6) {
//       newErrors.pincode = 'Pincode must be exactly 6 digits.';
//     }
//     if (!formData.areaName) {
//       newErrors.areaName = 'Area is required.';
//     }
//     if (!formData.city) {
//       newErrors.city = 'City is required.';
//     }
//     if (!formData.state) {
//       newErrors.state = 'State is required.';
//     }
//     if (!formData.subscriptionPlanId) {
//       newErrors.subscriptionPlanId = 'Subscription plan is required.';
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
//       const payload = {
//         username: formData.username,
//         phoneNumber: formData.phoneNumber,
//         password: formData.password,
//         buildingName: formData.buildingName,
//         areaName: formData.areaName,
//         city: formData.city,
//         state: formData.state,
//         pincode: formData.pincode,
//         subscriptionPlanId: formData.subscriptionPlanId,
//       };

//       console.log('Registering franchise with payload:', payload);

//       const response = await franchiseRegister(payload);

//       if (response?.success) {
//         alert('Franchise added successfully!');
//         navigate('/admin/franchises');
//       } else {
//         throw new Error('Registration failed');
//       }
//     } catch (error: any) {
//       setErrors({
//         username: error?.data?.error?.[0] || error?.message || 'Registration failed. Please try again.',
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <main className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
//       <div className="flex justify-center">
//         <div className="bg-blue-900 rounded px-1 py-1 w-fit flex">
//           <img
//             src="https://prnvservices.com/uploads/logo/1695377568_logo-white.png"
//             alt="Justdial Logo"
//             className="h-8 w-auto"
//           />
//         </div>
//       </div>
//       <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
//         <h2 className="text-2xl font-semibold mb-6 text-center">Add Franchise</h2>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           {Object.keys(errors).length > 0 && (
//             <div className="text-red-600 text-sm text-center bg-red-50 p-2 rounded">
//               {Object.values(errors)[0]}
//             </div>
//           )}

//           {[
//             { id: 'username', label: 'Name', type: 'text' },
//             { id: 'phoneNumber', label: 'Phone Number', type: 'tel', pattern: '[0-9]{10}' },
//             { id: 'password', label: 'Password', type: 'password', minLength: 6, maxLength: 10 },
//             { id: 'buildingName', label: 'House/Building Name', type: 'text' },
//             { id: 'pincode', label: 'Pincode', type: 'select' },
//             { id: 'areaName', label: 'Area', type: 'select' },
//             { id: 'city', label: 'City', type: 'select' },
//             { id: 'state', label: 'State', type: 'select' },
//             { id: 'subscriptionPlanId', label: 'Subscription Plan', type: 'select' },
//           ].map(({ id, label, type, pattern, minLength, maxLength }) => (
//             <div key={id} className="space-y-2">
//               <label htmlFor={id} className="block text-sm font-medium text-gray-700">
//                 {label} <span className="text-red-600">*</span>
//               </label>
//               {id === 'password' ? (
//                 <div className="relative">
//                   <input
//                     id={id}
//                     name={id}
//                     type={showPassword ? 'text' : 'password'}
//                     placeholder="Password (6-10 characters)"
//                     required
//                     value={formData[id as keyof FranchiseData]}
//                     onChange={handleInputChange}
//                     pattern={pattern}
//                     minLength={minLength}
//                     maxLength={maxLength}
//                     className="mt-1 w-full border border-gray-300 rounded-md p-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     aria-describedby={errors[id as keyof FormErrors] ? `${id}-error` : undefined}
//                   />
//                   <span
//                     className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 hover:text-blue-500"
//                     onClick={() => setShowPassword((prev) => !prev)}
//                   >
//                     {showPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
//                   </span>
//                 </div>
//               ) : id === 'pincode' ? (
//                 <select
//                   id={id}
//                   name={id}
//                   value={formData.pincode}
//                   onChange={handleInputChange}
//                   required
//                   className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   aria-describedby={errors.pincode ? 'pincode-error' : undefined}
//                 >
//                   <option value="">Select Pincode</option>
//                   {pincodeData
//                     .sort((a, b) => Number(a.code) - Number(b.code))
//                     .map((p) => (
//                       <option key={p._id} value={p.code}>
//                         {p.code}
//                       </option>
//                     ))}
//                 </select>
//               ) : id === 'areaName' ? (
//                 <select
//                   id={id}
//                   name={id}
//                   value={formData.areaName}
//                   onChange={handleInputChange}
//                   required
//                   disabled={!selectedPincode}
//                   className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
//                   aria-describedby={errors.areaName ? 'areaName-error' : undefined}
//                 >
//                   <option value="">Select Area</option>
//                   {areaOptions.map((a) => (
//                     <option key={a._id} value={a.name}>
//                       {a.name}
//                     </option>
//                   ))}
//                 </select>
//               ) : id === 'city' ? (
//                 <select
//                   id={id}
//                   name={id}
//                   value={formData.city}
//                   onChange={handleInputChange}
//                   required
//                   disabled={!selectedPincode}
//                   className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
//                   aria-describedby={errors.city ? 'city-error' : undefined}
//                 >
//                   <option value="">Select City</option>
//                   {selectedPincode && pincodeData.find((p) => p.code === selectedPincode) && (
//                     <option value={pincodeData.find((p) => p.code === selectedPincode)?.city}>
//                       {pincodeData.find((p) => p.code === selectedPincode)?.city}
//                     </option>
//                   )}
//                 </select>
//               ) : id === 'state' ? (
//                 <select
//                   id={id}
//                   name={id}
//                   value={formData.state}
//                   onChange={handleInputChange}
//                   required
//                   disabled={!selectedPincode}
//                   className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
//                   aria-describedby={errors.state ? 'state-error' : undefined}
//                 >
//                   <option value="">Select State</option>
//                   {selectedPincode && pincodeData.find((p) => p.code === selectedPincode) && (
//                     <option value={pincodeData.find((p) => p.code === selectedPincode)?.state}>
//                       {pincodeData.find((p) => p.code === selectedPincode)?.state}
//                     </option>
//                   )}
//                 </select>
//               ) : id === 'subscriptionPlanId' ? (
//                 <select
//                   id={id}
//                   name={id}
//                   value={formData.subscriptionPlanId}
//                   onChange={handleInputChange}
//                   required
//                   className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   aria-describedby={errors.subscriptionPlanId ? 'subscriptionPlanId-error' : undefined}
//                 >
//                   <option value="">Select Subscription Plan</option>
//                   {subscriptionPlans.map((plan) => (
//                     <option key={plan._id} value={plan._id}>
//                       {plan.name} (₹{plan.finalPrice} incl. GST, was ₹{plan.originalPrice + plan.gst})
//                     </option>
//                   ))}
//                 </select>
//               ) : (
//                 <input
//                   id={id}
//                   name={id}
//                   type={type}
//                   placeholder={label}
//                   required
//                   value={formData[id as keyof FranchiseData]}
//                   onChange={handleInputChange}
//                   pattern={pattern}
//                   className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   aria-describedby={errors[id as keyof FormErrors] ? `${id}-error` : undefined}
//                 />
//               )}
//               {errors[id as keyof FormErrors] && (
//                 <p id={`${id}-error`} className="text-red-500 text-sm">
//                   {errors[id as keyof FormErrors]}
//                 </p>
//               )}
//             </div>
//           ))}

//           <div className="pt-4 flex flex-col sm:flex-row gap-4">
//             <button
//               type="button"
//               onClick={() => navigate(-1)}
//               disabled={isSubmitting}
//               className="w-full sm:w-auto px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={isSubmitting}
//               className="w-full sm:w-auto px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
//             >
//               {isSubmitting ? 'Adding Franchise...' : 'Add Franchise'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </main>
//   );
// };

// export default AddFranchise;
// import React, { useState, useCallback, useEffect } from 'react';
// import { ArrowLeft, Eye, EyeOff, Upload, User } from 'lucide-react';
// import { getAllPincodes } from '../../api/apiMethods';
// import { useNavigate } from 'react-router-dom';

// interface FranchiseData {
//   username: string;
//   franchiseId: string;
//   phoneNumber: string;
//   password: string;
//   buildingName: string;
//   areaName: string;
//   city: string;
//   state: string;
//   pincode: string;
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
//   phoneNumber?: string;
//   password?: string;
//   buildingName?: string;
//   pincode?: string;
//   areaName?: string;
// }

// const initialFormState: FranchiseData = {
//   username: '',
//   franchiseId: '',
//   phoneNumber: '',
//   password: '',
//   buildingName: '',
//   areaName: '',
//   city: '',
//   state: '',
//   pincode: '',
// };

// const AddFranchise: React.FC = () => {
//   const [formData, setFormData] = useState<FranchiseData>(initialFormState);
//   const [errors, setErrors] = useState<FormErrors>({});
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [pincodeData, setPincodeData] = useState<PincodeData[]>([]);
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

//   const handleInputChange = useCallback(
//     (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//       const { name, value } = e.target;
//       setFormData((prev) => ({ ...prev, [name]: value }));
//       if (name === 'pincode') {
//         setSelectedPincode(value);
//       }
//       setErrors((prev) => ({ ...prev, [name]: undefined }));
//     },
//     []
//   );


//   const validateForm = (): FormErrors => {
//     const newErrors: FormErrors = {};
//     if (!formData.username.trim()) {
//       newErrors.username = 'Username is required.';
//     }
//     if (!formData.phoneNumber || !/^\d{10}$/.test(formData.phoneNumber)) {
//       newErrors.phoneNumber = 'Phone number must be exactly 10 digits.';
//     }
//     if (!formData.password || formData.password.length < 6 || formData.password.length > 10) {
//       newErrors.password = 'Password must be 6-10 characters.';
//     }
//     if (!formData.buildingName.trim()) {
//       newErrors.buildingName = 'Building name is required.';
//     }
//     if (!formData.pincode || formData.pincode.length !== 6) {
//       newErrors.pincode = 'Pincode must be exactly 6 digits.';
//     }
//     if (!formData.areaName) {
//       newErrors.areaName = 'Area is required.';
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
//       const franchiseId = localStorage.getItem('userId');
//       if (!franchiseId) {
//         setErrors({ username: 'Franchise ID not found. Please log in again.' });
//         setIsSubmitting(false);
//         return;
//       }

//       const data = { ...formData, franchiseId };
//       console.log('Submitting franchise data:', data);
//       setTimeout(() => {
//         alert('Franchise added successfully!');
//         setIsSubmitting(false);
//         navigate(-1);
//       }, 1000);
//     } catch (error) {
//       setIsSubmitting(false);
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
//             <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Add Franchise</h1>
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
//               <h2 className="text-lg font-semibold text-white">Franchise Information</h2>
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
//                     aria-describedby={errors.username ? 'username-error' : undefined}
//                   />
//                   {errors.username && (
//                     <p id="username-error" className="text-red-500 text-sm">
//                       {errors.username}
//                     </p>
//                   )}
//                 </div>

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
//                       aria-describedby={errors.phoneNumber ? 'phoneNumber-error' : undefined}
//                     />
//                   </div>
//                   {errors.phoneNumber && (
//                     <p id="phoneNumber-error" className="text-red-500 text-sm">
//                       {errors.phoneNumber}
//                     </p>
//                   )}
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="space-y-2">
//                   <label className="block text-sm font-medium text-gray-700">
//                     Password <span className="text-red-500">*</span>
//                   </label>
//                   <div className="relative">
//                     <input
//                       type={showPassword ? 'text' : 'password'}
//                       name="password"
//                       value={formData.password}
//                       onChange={handleInputChange}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                       placeholder="6-10 characters"
//                       minLength={6}
//                       maxLength={10}
//                       required
//                       aria-describedby={errors.password ? 'password-error' : undefined}
//                     />
//                     <span
//                       className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 hover:text-blue-500"
//                       onClick={() => setShowPassword((prev) => !prev)}
//                     >
//                       {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
//                     </span>
//                   </div>
//                   {errors.password && (
//                     <p id="password-error" className="text-red-500 text-sm">
//                       {errors.password}
//                     </p>
//                   )}
//                 </div>

//                 <div className="space-y-2">
//                   <label className="block text-sm font-medium text-gray-700">
//                     Building Name <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     name="buildingName"
//                     value={formData.buildingName}
//                     onChange={handleInputChange}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                     placeholder="Enter building name"
//                     required
//                     aria-describedby={errors.buildingName ? 'buildingName-error' : undefined}
//                   />
//                   {errors.buildingName && (
//                     <p id="buildingName-error" className="text-red-500 text-sm">
//                       {errors.buildingName}
//                     </p>
//                   )}
//                 </div>
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
//                     aria-describedby={errors.pincode ? 'pincode-error' : undefined}
//                   >
//                     <option value="" disabled>Select Pincode</option>
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
//                     aria-describedby={errors.areaName ? 'areaName-error' : undefined}
//                   >
//                     <option value="" disabled>Select Area</option>
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
//                     aria-describedby={errors.city ? 'city-error' : undefined}
//                   >
//                     <option value="" disabled>Select City</option>
//                     {selectedPincode && pincodeData.find((p) => p.code === selectedPincode) && (
//                       <option value={pincodeData.find((p) => p.code === selectedPincode)?.city}>
//                         {pincodeData.find((p) => p.code === selectedPincode)?.city}
//                       </option>
//                     )}
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
//                     aria-describedby={errors.state ? 'state-error' : undefined}
//                   >
//                     <option value="" disabled>Select State</option>
//                     {selectedPincode && pincodeData.find((p) => p.code === selectedPincode) && (
//                       <option value={pincodeData.find((p) => p.code === selectedPincode)?.state}>
//                         {pincodeData.find((p) => p.code === selectedPincode)?.state}
//                       </option>
//                     )}
//                   </select>
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
//               {isSubmitting ? 'Processing...' : 'Add Franchise'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddFranchise;