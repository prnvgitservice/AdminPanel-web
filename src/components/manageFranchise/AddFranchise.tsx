import React, { useState, useCallback, useEffect } from 'react';
import { ArrowLeft, Eye, EyeOff, Upload, User } from 'lucide-react';
import { getAllPincodes } from '../../api/apiMethods';
import { useNavigate } from 'react-router-dom';

interface FranchiseData {
  username: string;
  franchiseId: string;
  phoneNumber: string;
  password: string;
  buildingName: string;
  areaName: string;
  city: string;
  state: string;
  pincode: string;
  profileImage: File | null;
  status: 'active' | 'inactive';
}

interface PincodeData {
  _id: string;
  code: string;
  city: string;
  state: string;
  areas: { _id: string; name: string }[];
}

interface FormErrors {
  username?: string;
  phoneNumber?: string;
  password?: string;
  buildingName?: string;
  pincode?: string;
  areaName?: string;
  profileImage?: string;
}

const initialFormState: FranchiseData = {
  username: '',
  franchiseId: '',
  phoneNumber: '',
  password: '',
  buildingName: '',
  areaName: '',
  city: '',
  state: '',
  pincode: '',
  profileImage: null,
  status: 'active',
};

const AddFranchise: React.FC = () => {
  const [formData, setFormData] = useState<FranchiseData>(initialFormState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pincodeData, setPincodeData] = useState<PincodeData[]>([]);
  const [selectedPincode, setSelectedPincode] = useState<string>('');
  const [areaOptions, setAreaOptions] = useState<{ _id: string; name: string }[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
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
    },
    []
  );

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      const validTypes = ['image/png', 'image/jpeg', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        setErrors({ profileImage: 'Please upload a PNG, JPG, or GIF image.' });
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        setErrors({ profileImage: 'Image size must be less than 2MB.' });
        return;
      }
      setFormData((prev) => ({ ...prev, profileImage: file }));
      setImagePreview(URL.createObjectURL(file));
      setErrors((prev) => ({ ...prev, profileImage: undefined }));
    }
  };

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required.';
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
    if (!formData.profileImage) {
      newErrors.profileImage = 'Profile image is required.';
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
      const franchiseId = localStorage.getItem('userId');
      if (!franchiseId) {
        setErrors({ username: 'Franchise ID not found. Please log in again.' });
        setIsSubmitting(false);
        return;
      }

      const data = { ...formData, franchiseId };
      console.log('Submitting franchise data:', data);
      setTimeout(() => {
        alert('Franchise added successfully!');
        setIsSubmitting(false);
        navigate(-1);
      }, 1000);
    } catch (error) {
      setIsSubmitting(false);
      setErrors({ profileImage: 'An error occurred while submitting the form.' });
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
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4">
              <h2 className="text-lg font-semibold text-white">Franchise Information</h2>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Username <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter username"
                    required
                    aria-describedby={errors.username ? 'username-error' : undefined}
                  />
                  {errors.username && (
                    <p id="username-error" className="text-red-500 text-sm">
                      {errors.username}
                    </p>
                  )}
                </div>

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
                      aria-describedby={errors.phoneNumber ? 'phoneNumber-error' : undefined}
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
                    />
                    <span
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 hover:text-blue-500"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
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
                    aria-describedby={errors.buildingName ? 'buildingName-error' : undefined}
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
                  >
                    <option value="" disabled>Select Pincode</option>
                    {pincodeData.map((p) => (
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
                    disabled={!selectedPincode}
                    aria-describedby={errors.city ? 'city-error' : undefined}
                  >
                    <option value="" disabled>Select City</option>
                    {selectedPincode && pincodeData.find((p) => p.code === selectedPincode) && (
                      <option value={pincodeData.find((p) => p.code === selectedPincode)?.city}>
                        {pincodeData.find((p) => p.code === selectedPincode)?.city}
                      </option>
                    )}
                  </select>
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
                    disabled={!selectedPincode}
                    aria-describedby={errors.state ? 'state-error' : undefined}
                  >
                    <option value="" disabled>Select State</option>
                    {selectedPincode && pincodeData.find((p) => p.code === selectedPincode) && (
                      <option value={pincodeData.find((p) => p.code === selectedPincode)?.state}>
                        {pincodeData.find((p) => p.code === selectedPincode)?.state}
                      </option>
                    )}
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">Profile Image <span className="text-red-500">*</span></label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="h-20 w-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center shadow-inner">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Profile preview" className="h-full w-full object-cover rounded-full" />
                    ) : (
                      <User className="h-8 w-8 text-gray-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/gif"
                      className="hidden"
                      id="profile-image"
                      onChange={handleImageChange}
                      required
                      aria-describedby={errors.profileImage ? 'profileImage-error' : undefined}
                    />
                    <label
                      htmlFor="profile-image"
                      className="inline-flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 cursor-pointer transition-colors duration-200"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Change profile picture
                    </label>
                    <p className="text-sm text-gray-500 mt-2">JPG, PNG or GIF (max. 2MB)</p>
                    {errors.profileImage && (
                      <p id="profileImage-error" className="text-red-500 text-sm mt-2">
                        {errors.profileImage}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
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