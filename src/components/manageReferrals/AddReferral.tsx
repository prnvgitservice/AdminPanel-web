import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, UserPlus } from 'lucide-react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

interface ReferralData {
  name: string;
  phoneNumber: string;
  password: string;
  buildingName: string;
  areaName: string;
  city: string;
  state: string;
  pincode: string;
}

interface PincodeData {
  _id: string;
  code: string;
  city: string;
  state: string;
  areas: { _id: string; name: string }[];
}

interface FormErrors {
  [key: string]: string | undefined;
}

const initialFormState: ReferralData = {
  name: '',
  phoneNumber: '',
  password: '',
  buildingName: '',
  areaName: '',
  city: '',
  state: '',
  pincode: '',
};

// Mock API functions
const getAllPincodes = async () => {
  return new Promise<{ data: PincodeData[] }>((resolve) => {
    setTimeout(() => {
      resolve({
        data: [
          {
            _id: '1',
            code: '400001',
            city: 'Mumbai',
            state: 'Maharashtra',
            areas: [
              { _id: '1', name: 'Fort' },
              { _id: '2', name: 'Colaba' },
              { _id: '3', name: 'Nariman Point' }
            ]
          },
          {
            _id: '2',
            code: '110001',
            city: 'New Delhi',
            state: 'Delhi',
            areas: [
              { _id: '4', name: 'Connaught Place' },
              { _id: '5', name: 'Karol Bagh' },
              { _id: '6', name: 'Chandni Chowk' }
            ]
          },
          {
            _id: '3',
            code: '560001',
            city: 'Bangalore',
            state: 'Karnataka',
            areas: [
              { _id: '7', name: 'MG Road' },
              { _id: '8', name: 'Brigade Road' },
              { _id: '9', name: 'Commercial Street' }
            ]
          }
        ]
      });
    }, 500);
  });
};

const registerReferral = async (data: ReferralData) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.8) {
        reject({ message: 'Registration failed. Please try again.' });
      } else {
        resolve({ success: true });
      }
    }, 1000);
  });
};

const AddReferral: React.FC = () => {
  const [formData, setFormData] = useState<ReferralData>(initialFormState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pincodeData, setPincodeData] = useState<PincodeData[]>([]);
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
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required.';
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
      await registerReferral(formData);
      setSubmissionStatus('success');
      
      setFormData(initialFormState);
      setSelectedPincode('');
      setAreaOptions([]);
      alert('Referral added successfully!');

      setTimeout(() => {
        navigate('/management/referrals/all');
      }, 2000);
    } catch (error: any) {
      const serverErrors: FormErrors = {};
      serverErrors.global = error?.message || 'Registration failed. Please try again.';
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
            <div className="p-2 bg-gradient-to-r from-green-500 to-green-600 rounded-lg">
              <UserPlus className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Add Referral</h1>
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
            <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4">
              <h2 className="text-lg font-semibold text-white">Referral Information</h2>
            </div>

            <div className="p-6 space-y-6">
              {submissionStatus === 'success' && (
                <div className="text-green-600 text-sm text-center bg-green-50 p-2 rounded">
                  Referral added successfully! Redirecting...
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
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter name"
                    required
                    aria-describedby={errors.name ? 'name-error' : undefined}
                    disabled={isSubmitting}
                  />
                  {errors.name && (
                    <p id="name-error" className="text-red-500 text-sm">
                      {errors.name}
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
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                      placeholder="6-10 characters"
                      minLength={6}
                      maxLength={10}
                      required
                      aria-describedby={errors.password ? 'password-error' : undefined}
                      disabled={isSubmitting}
                    />
                    <span
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 hover:text-green-500"
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
                    House/Building Name
                  </label>
                  <input
                    type="text"
                    name="buildingName"
                    value={formData.buildingName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter building name"
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
                    Pincode
                  </label>
                  <select
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    aria-describedby={errors.pincode ? 'pincode-error' : undefined}
                    disabled={isSubmitting}
                  >
                    <option value="">Select Pincode</option>
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
                    Area
                  </label>
                  <select
                    name="areaName"
                    value={formData.areaName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100"
                    disabled={!selectedPincode || isSubmitting}
                    aria-describedby={errors.areaName ? 'areaName-error' : undefined}
                  >
                    <option value="">Select Area</option>
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
                    City
                  </label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100"
                    disabled={!selectedPincode || isSubmitting}
                    aria-describedby={errors.city ? 'city-error' : undefined}
                  >
                    <option value="">Select City</option>
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
                    State
                  </label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100"
                    disabled={!selectedPincode || isSubmitting}
                    aria-describedby={errors.state ? 'state-error' : undefined}
                  >
                    <option value="">Select State</option>
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
              className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Processing...' : 'Add Referral'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddReferral;