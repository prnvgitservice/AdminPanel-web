import React, { useState, useCallback, useEffect } from "react";
import { ArrowLeft, Eye, EyeOff, User } from "lucide-react";
import { createUserByAdmin, getAllPincodes, updateUserByAdmin } from "../../api/apiMethods";
import { useNavigate, useLocation, useParams } from "react-router-dom";

const NAME_REGEX = /^[A-Za-z ]+$/;
const PHONE_REGEX = /^[0-9]{10}$/;
const PASS_REGEX = /^[A-Za-z0-9@_#]{6,10}$/;

interface UserData {
  username: string;
  phoneNumber: string;
  password: string;
  profileImage: string;
  buildingName: string;
  areaName: string;
  subAreaName: string;
  city: string;
  state: string;
  pincode: string;
}

interface PincodeData {
  _id: string;
  code: string;
  city: string;
  state: string;
  areas: { _id: string; name: string; subAreas: { _id: string; name: string }[] }[];
}

interface FormErrors {
  username?: string;
  phoneNumber?: string;
  password?: string;
  buildingName?: string;
  pincode?: string;
  areaName?: string;
  subAreaName?: string;
  city?: string;
  state?: string;
}

interface User {
  id: string;
  username: string;
  phoneNumber: string;
  role: string;
  buildingName: string;
  areaName: string;
  subAreaName: string;
  city: string;
  state: string;
  pincode: string;
  fullAddress: string;
  profileImage?: string;
}

// Initialize with payload data
const initialFormState: UserData = {
  username: "",
  phoneNumber: "",
  password: "",
  profileImage: "",
  buildingName: "",
  areaName: "",
  subAreaName: "",
  city: "",
  state: "",
  pincode: "",
};

const UserForm: React.FC = () => {
  const [formData, setFormData] = useState<UserData>(initialFormState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pincodeData, setPincodeData] = useState<PincodeData[]>([]);
  const [selectedPincode, setSelectedPincode] = useState<string>("");
  const [selectedArea, setSelectedArea] = useState<string>("");
  const [areaOptions, setAreaOptions] = useState<
    { _id: string; name: string; subAreas: { _id: string; name: string }[] }[]
  >([]);
  const [subAreaOptions, setSubAreaOptions] = useState<
    { _id: string; name: string }[]
  >([]);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const user: User | undefined = location.state?.user;
  const isEdit = !!user && !!id;
  const currentProfileImage = isEdit ? (user?.profileImage || '') : '';

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
    if (!isEdit || !user || pincodeData.length === 0) return;

    const hasPincode = pincodeData.some(p => p.code === user.pincode);
    if (!hasPincode) {
      const customPin: PincodeData = {
        _id: `custom-pincode-${user.pincode}`,
        code: user.pincode,
        city: user.city || '',
        state: user.state || '',
        areas: user.areaName ? [{
          _id: `custom-area-${user.areaName}`,
          name: user.areaName,
          subAreas: user.subAreaName ? [{
            _id: `custom-subarea-${user.subAreaName}`,
            name: user.subAreaName
          }] : []
        }] : []
      };
      setPincodeData(prev => {
        const newData = [...prev, customPin].sort((a, b) => Number(a.code) - Number(b.code));
        return newData;
      });
    }
  }, [isEdit, user, pincodeData.length]);

  useEffect(() => {
    if (isEdit && user) {
      setFormData({
        username: user.username,
        phoneNumber: user.phoneNumber,
        password: "",
        profileImage: "",
        buildingName: user.buildingName,
        areaName: user.areaName,
        subAreaName: user.subAreaName,
        city: user.city,
        state: user.state,
        pincode: user.pincode,
      });
      setSelectedPincode(user.pincode);
      setSelectedArea(user.areaName);
      setGeneralError(null);
      setSuccess(null);
    }
  }, [isEdit, user]);

  useEffect(() => {
    if (selectedPincode) {
      const found = pincodeData.find((p) => p.code === selectedPincode);
      if (found && found.areas) {
        let areas = found.areas;
        // If in edit mode and user's area not in options, add it as custom
        if (isEdit && user && user.areaName && !areas.some(a => a.name === user.areaName)) {
          areas = [...areas, {
            _id: `custom-area-${user.areaName}`,
            name: user.areaName,
            subAreas: []
          }];
        }
        setAreaOptions(areas);
        if (isEdit && user && selectedPincode === user.pincode) {
          setFormData((prev) => ({
            ...prev,
            areaName: user.areaName,
            subAreaName: user.subAreaName,
            city: found.city,
            state: found.state,
          }));
        } else {
          setFormData((prev) => ({
            ...prev,
            city: found.city,
            state: found.state,
          }));
        }
        // Ensure selectedArea is set after options are updated
        if (isEdit && user && user.areaName) {
          setSelectedArea(user.areaName);
        }
      } else {
        setAreaOptions([]);
        setSelectedArea("");
        setSubAreaOptions([]);
        setFormData((prev) => ({
          ...prev,
          areaName: "",
          subAreaName: "",
          city: "",
          state: "",
        }));
      }
    } else {
      setAreaOptions([]);
      setSelectedArea("");
      setSubAreaOptions([]);
      setFormData((prev) => ({
        ...prev,
        areaName: "",
        subAreaName: "",
        city: "",
        state: "",
      }));
    }
  }, [selectedPincode, pincodeData, isEdit, user]);

  useEffect(() => {
    if (selectedArea) {
      const foundArea = areaOptions.find((a) => a.name === selectedArea);
      if (foundArea) {
        let subAreas = foundArea.subAreas;
        // If in edit mode and user's subArea not in options, add it as custom
        if (isEdit && user && user.subAreaName && !subAreas.some(sa => sa.name === user.subAreaName)) {
          subAreas = [...subAreas, {
            _id: `custom-sub-${user.subAreaName}`,
            name: user.subAreaName
          }];
        }
        setSubAreaOptions(subAreas);
        if (isEdit && user && selectedArea === user.areaName) {
          setFormData(prev => ({ ...prev, subAreaName: user.subAreaName }));
        }
      } else {
        setSubAreaOptions([]);
        setFormData((prev) => ({
          ...prev,
          subAreaName: "",
        }));
      }
    } else {
      setSubAreaOptions([]);
      setFormData((prev) => ({
        ...prev,
        subAreaName: "",
      }));
    }
  }, [selectedArea, areaOptions, isEdit, user]);

  const getFieldError = (name: keyof FormErrors, value: string): string | undefined => {
    switch (name) {
      case 'username':
        const trimmedUsername = value.trim();
        if (!trimmedUsername) return "Name is required.";
        if (!NAME_REGEX.test(trimmedUsername)) return "Name can only contain letters and spaces.";
        return undefined;
      case 'phoneNumber':
        if (!value || !PHONE_REGEX.test(value)) return "Phone number must be exactly 10 digits.";
        return undefined;
      case 'password':
        if (!isEdit) {
          if (!value || !PASS_REGEX.test(value)) return "Password must be 6-10 characters with letters, numbers, @, _, #.";
        } else {
          if (value && !PASS_REGEX.test(value)) return "Password must be 6-10 characters with letters, numbers, @, _, #. if provided.";
        }
        return undefined;
      case 'buildingName':
        if (!value.trim()) return "Building name is required.";
        return undefined;
      case 'pincode':
        if (!value) return "Pincode is required.";
        return undefined;
      case 'areaName':
        if (!value) return "Area is required.";
        return undefined;
      case 'subAreaName':
        if (!value) return "Sub area is required.";
        return undefined;
      case 'city':
        if (!value) return "City is required.";
        return undefined;
      case 'state':
        if (!value) return "State is required.";
        return undefined;
      default:
        return undefined;
    }
  };

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      let filteredValue = value;
      if (name === "username") {
        filteredValue = value.replace(/[^A-Za-z ]/g, '');
      } else if (name === "phoneNumber") {
        filteredValue = value.replace(/[^0-9]/g, '');
      }
      const update: Partial<UserData> = { [name]: filteredValue };
      if (name === "areaName") {
        update.subAreaName = "";
        setSelectedArea(filteredValue);
      }
      setFormData((prev) => ({ ...prev, ...update }));
      if (name === "pincode") {
        setSelectedPincode(filteredValue);
        update.areaName = "";
        update.subAreaName = "";
      }
      const fieldError = getFieldError(name as keyof FormErrors, filteredValue);
      setErrors((prev) => ({
        ...prev,
        [name]: fieldError
      }));
    },
    [isEdit]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      const imageUrl = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, profileImage: imageUrl }));
    }
  };

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {
      username: getFieldError('username', formData.username),
      phoneNumber: getFieldError('phoneNumber', formData.phoneNumber),
      password: getFieldError('password', formData.password),
      buildingName: getFieldError('buildingName', formData.buildingName),
      pincode: getFieldError('pincode', formData.pincode),
      areaName: getFieldError('areaName', formData.areaName),
      subAreaName: getFieldError('subAreaName', formData.subAreaName),
      city: getFieldError('city', formData.city),
      state: getFieldError('state', formData.state),
    };
    // Remove undefined entries
    Object.keys(newErrors).forEach(key => {
      if (!newErrors[key as keyof FormErrors]) {
        delete newErrors[key as keyof FormErrors];
      }
    });
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);
    setSuccess(null);
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      let response;
      if (isEdit) {
        const submitData = new FormData();
        submitData.append('id', id!);
        submitData.append('username', formData.username);
        if (formData.password) {
          submitData.append('password', formData.password);
        }
        submitData.append('buildingName', formData.buildingName);
        submitData.append('areaName', formData.areaName);
        submitData.append('subAreaName', formData.subAreaName);
        submitData.append('city', formData.city);
        submitData.append('state', formData.state);
        submitData.append('pincode', formData.pincode);
        if (selectedFile) {
          submitData.append('profileImage', selectedFile);
        }

        response = await updateUserByAdmin(submitData);

        if (response && response.success) {
          setSuccess(response.message || 'User updated successfully!');
          setTimeout(() => {
            navigate("/management/users/all");
          }, 2000);
        } else {
          throw new Error(response?.message || 'Failed to update user.');
        }
      } else {
        const createPayload = { ...formData };
        delete createPayload.profileImage; // Ensure no profileImage for create
        response = await createUserByAdmin(createPayload);
        if (response && response.success) {
          setSuccess(response.message || "User created successfully!");
          setTimeout(() => {
            navigate("/management/users/all");
          }, 2000);
        } else {
          throw new Error(response?.message || 'Failed to create user.');
        }
      }
    } catch (error: any) {
      setIsSubmitting(false);
      setGeneralError(error?.message || "Operation failed. Please try again.");
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
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {isEdit ? "Edit User" : "Add User"}
              </h1>
            </div>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </button>
        </div>

        {/* General Error/Success */}
        {generalError && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-6">
            <div className="text-red-600 text-sm font-medium">{generalError}</div>
          </div>
        )}
        {success && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg mb-6">
            <div className="text-green-600 text-sm font-medium">{success}</div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
              <h2 className="text-lg font-semibold text-white">
                User Information
              </h2>
            </div>

            <div className="p-6 space-y-6">
              {isEdit && (
                /* Profile Image - Only for Edit */
                <div className="flex flex-col items-center space-y-4">
                  <label className="block text-sm font-medium text-gray-700">Profile Image</label>
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 p-1 shadow-lg">
                      <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                        {formData.profileImage ? (
                          <img
                            src={formData.profileImage}
                            alt="Profile"
                            className="w-full h-full object-cover rounded-full"
                          />
                        ) : currentProfileImage ? (
                          <img
                            src={currentProfileImage}
                            alt="Profile"
                            className="w-full h-full object-cover rounded-full"
                          />
                        ) : (
                          <User className="text-gray-400 h-8 w-8" />
                        )}
                      </div>
                    </div>
                  </div>
                  <input
                    type="file"
                    name="profileImage"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-blue-100 file:to-blue-200 file:text-blue-700 hover:file:bg-gradient-to-r hover:file:from-blue-200 hover:file:to-blue-300"
                  />
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
                    placeholder="Enter full name"
                    required
                    aria-describedby={errors.username ? "username-error" : undefined}
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
                      className={`flex-1 px-4 py-3 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${isEdit ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                      placeholder="Enter 10-digit mobile number"
                      pattern="[0-9]{10}"
                      required
                      maxLength={10}
                      disabled={isEdit}
                      aria-describedby={errors.phoneNumber ? "phoneNumber-error" : undefined}
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
                    Password {isEdit ? <span className="text-gray-500">(Optional)</span> : <span className="text-red-500">*</span>}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder={isEdit ? "Leave blank to keep current (6-10 characters if changing)" : "6-10 characters"}
                      minLength={6}
                      maxLength={10}
                      required={!isEdit}
                      aria-describedby={errors.password ? "password-error" : undefined}
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
                    aria-describedby={errors.buildingName ? "buildingName-error" : undefined}
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
                    aria-describedby={errors.pincode ? "pincode-error" : undefined}
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
                    aria-describedby={errors.areaName ? "areaName-error" : undefined}
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
                <div className="md:col-span-2 space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Sub Area <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="subAreaName"
                    value={formData.subAreaName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100"
                    // required
                    disabled={!selectedArea}
                    aria-describedby={errors.subAreaName ? "subAreaName-error" : undefined}
                  >
                    <option value="" disabled>
                      Select Sub Area
                    </option>
                    {subAreaOptions.map((sa) => (
                      <option key={sa._id} value={sa.name}>
                        {sa.name}
                      </option>
                    ))}
                  </select>
                  {errors.subAreaName && (
                    <p id="subAreaName-error" className="text-red-500 text-sm">
                      {errors.subAreaName}
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
                    disabled
                    aria-describedby={errors.city ? "city-error" : undefined}
                  >
                    <option value={formData.city}>{formData.city || "Select City"}</option>
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
                    disabled
                    aria-describedby={errors.state ? "state-error" : undefined}
                  >
                    <option value={formData.state}>{formData.state || "Select State"}</option>
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
              className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Processing..." : (isEdit ? "Update" : "Create")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;
// import React, { useState, useCallback, useEffect } from "react";
// import { ArrowLeft, Eye, EyeOff, User } from "lucide-react";
// import { createUserByAdmin, getAllPincodes, updateUserByAdmin } from "../../api/apiMethods";
// import { useNavigate, useLocation, useParams } from "react-router-dom";

// interface UserData {
//   username: string;
//   phoneNumber: string;
//   password: string;
//   profileImage: string;
//   buildingName: string;
//   areaName: string;
//   subAreaName: string;
//   city: string;
//   state: string;
//   pincode: string;
// }

// interface PincodeData {
//   _id: string;
//   code: string;
//   city: string;
//   state: string;
//   areas: { _id: string; name: string; subAreas: { _id: string; name: string }[] }[];
// }

// interface FormErrors {
//   username?: string;
//   phoneNumber?: string;
//   password?: string;
//   buildingName?: string;
//   pincode?: string;
//   areaName?: string;
//   subAreaName?: string;
//   city?: string;
//   state?: string;
// }

// interface User {
//   id: string;
//   username: string;
//   phoneNumber: string;
//   role: string;
//   buildingName: string;
//   areaName: string;
//   subAreaName: string;
//   city: string;
//   state: string;
//   pincode: string;
//   fullAddress: string;
//   profileImage?: string;
// }

// // Initialize with payload data
// const initialFormState: UserData = {
//   username: "",
//   phoneNumber: "",
//   password: "",
//   profileImage: "",
//   buildingName: "",
//   areaName: "",
//   subAreaName: "",
//   city: "",
//   state: "",
//   pincode: "",
// };

// const UserForm: React.FC = () => {
//   const [formData, setFormData] = useState<UserData>(initialFormState);
//   const [errors, setErrors] = useState<FormErrors>({});
//   const [generalError, setGeneralError] = useState<string | null>(null);
//   const [success, setSuccess] = useState<string | null>(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [pincodeData, setPincodeData] = useState<PincodeData[]>([]);
//   const [selectedPincode, setSelectedPincode] = useState<string>("");
//   const [selectedArea, setSelectedArea] = useState<string>("");
//   const [areaOptions, setAreaOptions] = useState<
//     { _id: string; name: string; subAreas: { _id: string; name: string }[] }[]
//   >([]);
//   const [subAreaOptions, setSubAreaOptions] = useState<
//     { _id: string; name: string }[]
//   >([]);
//   const [showPassword, setShowPassword] = useState(false);
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { id } = useParams<{ id: string }>();
//   const user: User | undefined = location.state?.user;
//   const isEdit = !!user && !!id;
//   const currentProfileImage = isEdit ? (user?.profileImage || '') : '';

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
//     if (isEdit && user) {
//       setFormData({
//         username: user.username,
//         phoneNumber: user.phoneNumber,
//         password: "",
//         profileImage: "",
//         buildingName: user.buildingName,
//         areaName: user.areaName,
//         subAreaName: user.subAreaName,
//         city: user.city,
//         state: user.state,
//         pincode: user.pincode,
//       });
//       setSelectedPincode(user.pincode);
//       setSelectedArea(user.areaName);
//       setGeneralError(null);
//       setSuccess(null);
//     }
//   }, [isEdit, user]);

//   useEffect(() => {
//     if (selectedPincode) {
//       const found = pincodeData.find((p) => p.code === selectedPincode);
//       if (found && found.areas) {
//         let areas = found.areas;
//         // If in edit mode and user's area not in options, add it as custom
//         if (isEdit && user && user.areaName && !areas.some(a => a.name === user.areaName)) {
//           areas = [...areas, {
//             _id: `custom-area-${user.areaName}`,
//             name: user.areaName,
//             subAreas: []
//           }];
//         }
//         setAreaOptions(areas);
//         setFormData((prev) => ({
//           ...prev,
//           city: found.city,
//           state: found.state,
//         }));
//         // Ensure selectedArea is set after options are updated
//         if (isEdit && user && user.areaName) {
//           setSelectedArea(user.areaName);
//         }
//       } else {
//         setAreaOptions([]);
//         setSelectedArea("");
//         setSubAreaOptions([]);
//         setFormData((prev) => ({
//           ...prev,
//           areaName: "",
//           subAreaName: "",
//           city: "",
//           state: "",
//         }));
//       }
//     } else {
//       setAreaOptions([]);
//       setSelectedArea("");
//       setSubAreaOptions([]);
//       setFormData((prev) => ({
//         ...prev,
//         areaName: "",
//         subAreaName: "",
//         city: "",
//         state: "",
//       }));
//     }
//   }, [selectedPincode, pincodeData, isEdit, user]);

//   useEffect(() => {
//     if (selectedArea) {
//       const foundArea = areaOptions.find((a) => a.name === selectedArea);
//       if (foundArea) {
//         let subAreas = foundArea.subAreas;
//         // If in edit mode and user's subArea not in options, add it as custom
//         if (isEdit && user && user.subAreaName && !subAreas.some(sa => sa.name === user.subAreaName)) {
//           subAreas = [...subAreas, {
//             _id: `custom-sub-${user.subAreaName}`,
//             name: user.subAreaName
//           }];
//         }
//         setSubAreaOptions(subAreas);
//         // Ensure subArea is preserved
//         if (isEdit && user && user.subAreaName && subAreas.some(sa => sa.name === user.subAreaName)) {
//           setFormData(prev => ({ ...prev, subAreaName: user.subAreaName }));
//         }
//       } else {
//         setSubAreaOptions([]);
//         setFormData((prev) => ({
//           ...prev,
//           subAreaName: "",
//         }));
//       }
//     } else {
//       setSubAreaOptions([]);
//       setFormData((prev) => ({
//         ...prev,
//         subAreaName: "",
//       }));
//     }
//   }, [selectedArea, areaOptions, isEdit, user]);

//   const handleInputChange = useCallback(
//     (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//       const { name, value } = e.target;
//       const update: Partial<UserData> = { [name]: value };
//       if (name === "areaName") {
//         update.subAreaName = "";
//         setSelectedArea(value);
//       }
//       setFormData((prev) => ({ ...prev, ...update }));
//       if (name === "pincode") {
//         setSelectedPincode(value);
//       }
//       setErrors((prev) => ({ ...prev, [name]: undefined }));
//     },
//     []
//   );

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files.length > 0) {
//       const file = e.target.files[0];
//       setSelectedFile(file);
//       const imageUrl = URL.createObjectURL(file);
//       setFormData((prev) => ({ ...prev, profileImage: imageUrl }));
//     }
//   };

//   const validateForm = (): FormErrors => {
//     const newErrors: FormErrors = {};
//     if (!formData.username.trim()) {
//       newErrors.username = "Name is required.";
//     }
//     if (!formData.phoneNumber || !/^\d{10}$/.test(formData.phoneNumber)) {
//       newErrors.phoneNumber = "Phone number must be exactly 10 digits.";
//     }
//     if (!isEdit) {
//       if (
//         !formData.password ||
//         formData.password.length < 6 ||
//         formData.password.length > 20
//       ) {
//         newErrors.password = "Password must be 6-20 characters.";
//       }
//     } else {
//       if (formData.password && (formData.password.length < 6 || formData.password.length > 20)) {
//         newErrors.password = "Password must be 6-20 characters if provided.";
//       }
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
//     if (!formData.subAreaName) {
//       newErrors.subAreaName = "Sub area is required.";
//     }
//     if (!formData.city) {
//       newErrors.city = "City is required.";
//     }
//     if (!formData.state) {
//       newErrors.state = "State is required.";
//     }
//     return newErrors;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setGeneralError(null);
//     setSuccess(null);
//     const validationErrors = validateForm();
//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       return;
//     }

//     setIsSubmitting(true);
//     try {
//       let response;
//       if (isEdit) {
//         const submitData = new FormData();
//         submitData.append('id', id!);
//         submitData.append('username', formData.username);
//         if (formData.password) {
//           submitData.append('password', formData.password);
//         }
//         submitData.append('buildingName', formData.buildingName);
//         submitData.append('areaName', formData.areaName);
//         submitData.append('subAreaName', formData.subAreaName);
//         submitData.append('city', formData.city);
//         submitData.append('state', formData.state);
//         submitData.append('pincode', formData.pincode);
//         if (selectedFile) {
//           submitData.append('profileImage', selectedFile);
//         }

//         response = await updateUserByAdmin(submitData);

//         if (response && response.success) {
//           setSuccess('User updated successfully!');
//           setTimeout(() => {
//             navigate("/management/users/all");
//           }, 2000);
//         } else {
//           throw new Error(response?.message || 'Failed to update user.');
//         }
//       } else {
//         const createPayload = { ...formData };
//         delete createPayload.profileImage; // Ensure no profileImage for create
//         response = await createUserByAdmin(createPayload);
//         if (response && response.success) {
//           setSuccess(response?.message || "User created successfully!");
//           setTimeout(() => {
//             navigate("/management/users/all");
//           }, 2000);
//         } else {
//           throw new Error(response?.message || 'Failed to create user.');
//         }
//       }
//     } catch (error: any) {
//       setIsSubmitting(false);
//       setGeneralError(error?.message || "Operation failed. Please try again.");
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
//             <div>
//               <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
//                 {isEdit ? "Edit User" : "Add User"}
//               </h1>
//             </div>
//           </div>
//           <button
//             onClick={() => navigate(-1)}
//             className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
//           >
//             <ArrowLeft className="h-4 w-4 mr-2" />
//             Back
//           </button>
//         </div>

//         {/* General Error/Success */}
//         {generalError && (
//           <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-6">
//             <div className="text-red-600 text-sm font-medium">{generalError}</div>
//           </div>
//         )}
//         {success && (
//           <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg mb-6">
//             <div className="text-green-600 text-sm font-medium">{success}</div>
//           </div>
//         )}

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="space-y-8">
//           <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
//             <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
//               <h2 className="text-lg font-semibold text-white">
//                 User Information
//               </h2>
//             </div>

//             <div className="p-6 space-y-6">
//               {isEdit && (
//                 /* Profile Image - Only for Edit */
//                 <div className="flex flex-col items-center space-y-4">
//                   <label className="block text-sm font-medium text-gray-700">Profile Image</label>
//                   <div className="relative">
//                     <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 p-1 shadow-lg">
//                       <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
//                         {formData.profileImage ? (
//                           <img
//                             src={formData.profileImage}
//                             alt="Profile"
//                             className="w-full h-full object-cover rounded-full"
//                           />
//                         ) : currentProfileImage ? (
//                           <img
//                             src={currentProfileImage}
//                             alt="Profile"
//                             className="w-full h-full object-cover rounded-full"
//                           />
//                         ) : (
//                           <User className="text-gray-400 h-8 w-8" />
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                   <input
//                     type="file"
//                     name="profileImage"
//                     accept="image/*"
//                     onChange={handleFileChange}
//                     className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-blue-100 file:to-blue-200 file:text-blue-700 hover:file:bg-gradient-to-r hover:file:from-blue-200 hover:file:to-blue-300"
//                   />
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
//                     placeholder="Enter full name"
//                     required
//                     aria-describedby={errors.username ? "username-error" : undefined}
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
//                       className={`flex-1 px-4 py-3 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${isEdit ? 'bg-gray-100 cursor-not-allowed' : ''}`}
//                       placeholder="Enter 10-digit mobile number"
//                       pattern="[0-9]{10}"
//                       required
//                       maxLength={10}
//                       disabled={isEdit}
//                       aria-describedby={errors.phoneNumber ? "phoneNumber-error" : undefined}
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
//                     Password {isEdit ? <span className="text-gray-500">(Optional)</span> : <span className="text-red-500">*</span>}
//                   </label>
//                   <div className="relative">
//                     <input
//                       type={showPassword ? "text" : "password"}
//                       name="password"
//                       value={formData.password}
//                       onChange={handleInputChange}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                       placeholder={isEdit ? "Leave blank to keep current (6-20 characters if changing)" : "6-20 characters"}
//                       minLength={6}
//                       maxLength={20}
//                       required={!isEdit}
//                       aria-describedby={errors.password ? "password-error" : undefined}
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
//                     aria-describedby={errors.buildingName ? "buildingName-error" : undefined}
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
//                     aria-describedby={errors.pincode ? "pincode-error" : undefined}
//                   >
//                     <option value="" disabled>
//                       Select Pincode
//                     </option>
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
//                     aria-describedby={errors.areaName ? "areaName-error" : undefined}
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
//                 <div className="md:col-span-2 space-y-2">
//                   <label className="block text-sm font-medium text-gray-700">
//                     Sub Area <span className="text-red-500">*</span>
//                   </label>
//                   <select
//                     name="subAreaName"
//                     value={formData.subAreaName}
//                     onChange={handleInputChange}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100"
//                     required
//                     disabled={!selectedArea}
//                     aria-describedby={errors.subAreaName ? "subAreaName-error" : undefined}
//                   >
//                     <option value="" disabled>
//                       Select Sub Area
//                     </option>
//                     {subAreaOptions.map((sa) => (
//                       <option key={sa._id} value={sa.name}>
//                         {sa.name}
//                       </option>
//                     ))}
//                   </select>
//                   {errors.subAreaName && (
//                     <p id="subAreaName-error" className="text-red-500 text-sm">
//                       {errors.subAreaName}
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
//                     disabled
//                     aria-describedby={errors.city ? "city-error" : undefined}
//                   >
//                     <option value={formData.city}>{formData.city || "Select City"}</option>
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
//                     disabled
//                     aria-describedby={errors.state ? "state-error" : undefined}
//                   >
//                     <option value={formData.state}>{formData.state || "Select State"}</option>
//                   </select>
//                   {errors.state && (
//                     <p id="state-error" className="text-red-500 text-sm">
//                       {errors.state}
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
//               {isSubmitting ? "Processing..." : (isEdit ? "Update" : "Create")}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default UserForm;
// import React, { useState, useCallback, useEffect } from "react";
// import { ArrowLeft, Eye, EyeOff, User } from "lucide-react";
// import { createUserByAdmin, getAllPincodes, updateUserByAdmin } from "../../api/apiMethods";
// import { useNavigate, useLocation, useParams } from "react-router-dom";

// interface UserData {
//   username: string;
//   phoneNumber: string;
//   password: string;
//   profileImage: string;
//   buildingName: string;
//   areaName: string;
//   subAreaName: string;
//   city: string;
//   state: string;
//   pincode: string;
// }

// interface PincodeData {
//   _id: string;
//   code: string;
//   city: string;
//   state: string;
//   areas: { _id: string; name: string; subAreas: { _id: string; name: string }[] }[];
// }

// interface FormErrors {
//   username?: string;
//   phoneNumber?: string;
//   password?: string;
//   buildingName?: string;
//   pincode?: string;
//   areaName?: string;
//   subAreaName?: string;
//   city?: string;
//   state?: string;
// }

// interface User {
//   id: string;
//   username: string;
//   phoneNumber: string;
//   role: string;
//   buildingName: string;
//   areaName: string;
//   subAreaName: string;
//   city: string;
//   state: string;
//   pincode: string;
//   fullAddress: string;
//   profileImage?: string;
// }

// // Initialize with payload data
// const initialFormState: UserData = {
//   username: "",
//   phoneNumber: "",
//   password: "",
//   profileImage: "",
//   buildingName: "",
//   areaName: "",
//   subAreaName: "",
//   city: "",
//   state: "",
//   pincode: "",
// };

// const UserForm: React.FC = () => {
//   const [formData, setFormData] = useState<UserData>(initialFormState);
//   const [errors, setErrors] = useState<FormErrors>({});
//   const [generalError, setGeneralError] = useState<string | null>(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [pincodeData, setPincodeData] = useState<PincodeData[]>([]);
//   const [selectedPincode, setSelectedPincode] = useState<string>("");
//   const [selectedArea, setSelectedArea] = useState<string>("");
//   const [areaOptions, setAreaOptions] = useState<
//     { _id: string; name: string; subAreas: { _id: string; name: string }[] }[]
//   >([]);
//   const [subAreaOptions, setSubAreaOptions] = useState<
//     { _id: string; name: string }[]
//   >([]);
//   const [showPassword, setShowPassword] = useState(false);
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { id } = useParams<{ id: string }>();
//   const user: User | undefined = location.state?.user;
//   const isEdit = !!user && !!id;
//   const currentProfileImage = isEdit ? (user?.profileImage || '') : '';

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
//     if (isEdit && user) {
//       setFormData({
//         username: user.username,
//         phoneNumber: user.phoneNumber,
//         password: "",
//         profileImage: "",
//         buildingName: user.buildingName,
//         areaName: user.areaName,
//         subAreaName: user.subAreaName,
//         city: user.city,
//         state: user.state,
//         pincode: user.pincode,
//       });
//       setSelectedPincode(user.pincode);
//       setSelectedArea(user.areaName);
//       setGeneralError(null);
//     }
//   }, [isEdit, user]);

//   useEffect(() => {
//     if (selectedPincode) {
//       const found = pincodeData.find((p) => p.code === selectedPincode);
//       if (found && found.areas) {
//         let areas = found.areas;
//         // If in edit mode and user's area not in options, add it as custom
//         if (isEdit && user && user.areaName && !areas.some(a => a.name === user.areaName)) {
//           areas = [...areas, {
//             _id: `custom-area-${user.areaName}`,
//             name: user.areaName,
//             subAreas: []
//           }];
//         }
//         setAreaOptions(areas);
//         setFormData((prev) => ({
//           ...prev,
//           city: found.city,
//           state: found.state,
//         }));
//         // Ensure selectedArea is set after options are updated
//         if (isEdit && user && user.areaName) {
//           setSelectedArea(user.areaName);
//         }
//       } else {
//         setAreaOptions([]);
//         setSelectedArea("");
//         setSubAreaOptions([]);
//         setFormData((prev) => ({
//           ...prev,
//           areaName: "",
//           subAreaName: "",
//           city: "",
//           state: "",
//         }));
//       }
//     } else {
//       setAreaOptions([]);
//       setSelectedArea("");
//       setSubAreaOptions([]);
//       setFormData((prev) => ({
//         ...prev,
//         areaName: "",
//         subAreaName: "",
//         city: "",
//         state: "",
//       }));
//     }
//   }, [selectedPincode, pincodeData, isEdit, user]);

//   useEffect(() => {
//   if (selectedPincode) {
//     const found = pincodeData.find((p) => p.code === selectedPincode);
//     if (found && found.areas) {
//       let areas = found.areas;
//       // If in edit mode and user's area not in options, add it as custom
//       if (isEdit && user && user.areaName && !areas.some(a => a.name === user.areaName)) {
//         areas = [...areas, {
//           _id: `custom-area-${user.areaName}`,
//           name: user.areaName,
//           subAreas: []
//         }];
//       }
//       setAreaOptions(areas);
//       setFormData((prev) => ({
//         ...prev,
//         city: found.city,
//         state: found.state,
//       }));
//       if (isEdit && user && formData.areaName === '' && formData.pincode === user.pincode) {
//         setFormData((prev) => ({ ...prev, areaName: user.areaName }));
//       }
//       if (isEdit && user && selectedArea === '' && formData.pincode === user.pincode) {
//         setSelectedArea(user.areaName);
//       }
//     } else {
//       setAreaOptions([]);
//       setSelectedArea("");
//       setSubAreaOptions([]);
//       setFormData((prev) => ({
//         ...prev,
//         areaName: "",
//         subAreaName: "",
//         city: "",
//         state: "",
//       }));
//     }
//   } else {
//     setAreaOptions([]);
//     setSelectedArea("");
//     setSubAreaOptions([]);
//     setFormData((prev) => ({
//       ...prev,
//       areaName: "",
//       subAreaName: "",
//       city: "",
//       state: "",
//     }));
//   }
// }, [selectedPincode, pincodeData, isEdit, user]);

// useEffect(() => {
//   if (selectedArea) {
//     const foundArea = areaOptions.find((a) => a.name === selectedArea);
//     if (foundArea) {
//       let subAreas = foundArea.subAreas;
//       // If in edit mode and user's subArea not in options, add it as custom
//       if (isEdit && user && user.subAreaName && !subAreas.some(sa => sa.name === user.subAreaName)) {
//         subAreas = [...subAreas, {
//           _id: `custom-sub-${user.subAreaName}`,
//           name: user.subAreaName
//         }];
//       }
//       setSubAreaOptions(subAreas);
//       setFormData((prev) => ({
//         ...prev,
//         subAreaName: subAreas.some((sa) => sa.name === prev.subAreaName)
//           ? prev.subAreaName
//           : "",
//       }));
//       // Ensure subArea is preserved
//       if (isEdit && user && formData.subAreaName === '' && formData.areaName === user.areaName && subAreas.some(sa => sa.name === user.subAreaName)) {
//         setFormData(prev => ({ ...prev, subAreaName: user.subAreaName }));
//       }
//     } else {
//       setSubAreaOptions([]);
//       setFormData((prev) => ({
//         ...prev,
//         subAreaName: "",
//       }));
//     }
//   } else {
//     setSubAreaOptions([]);
//     setFormData((prev) => ({
//       ...prev,
//       subAreaName: "",
//     }));
//   }
// }, [selectedArea, areaOptions, isEdit, user]);

//   useEffect(() => {
//     if (selectedArea) {
//       const foundArea = areaOptions.find((a) => a.name === selectedArea);
//       if (foundArea) {
//         let subAreas = foundArea.subAreas;
//         // If in edit mode and user's subArea not in options, add it as custom
//         if (isEdit && user && user.subAreaName && !subAreas.some(sa => sa.name === user.subAreaName)) {
//           subAreas = [...subAreas, {
//             _id: `custom-sub-${user.subAreaName}`,
//             name: user.subAreaName
//           }];
//         }
//         setSubAreaOptions(subAreas);
//         setFormData((prev) => ({
//           ...prev,
//           subAreaName: subAreas.some((sa) => sa.name === prev.subAreaName)
//             ? prev.subAreaName
//             : "",
//         }));
//         // Ensure subArea is preserved
//         if (isEdit && user && user.subAreaName && subAreas.some(sa => sa.name === user.subAreaName)) {
//           setFormData(prev => ({ ...prev, subAreaName: user.subAreaName }));
//         }
//       } else {
//         setSubAreaOptions([]);
//         setFormData((prev) => ({
//           ...prev,
//           subAreaName: "",
//         }));
//       }
//     } else {
//       setSubAreaOptions([]);
//       setFormData((prev) => ({
//         ...prev,
//         subAreaName: "",
//       }));
//     }
//   }, [selectedArea, areaOptions, isEdit, user]);



//   const handleInputChange = useCallback(
//     (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//       const { name, value } = e.target;
//       const update: Partial<UserData> = { [name]: value };
//       if (name === "areaName") {
//         update.subAreaName = "";
//         setSelectedArea(value);
//       }
//       setFormData((prev) => ({ ...prev, ...update }));
//       if (name === "pincode") {
//         setSelectedPincode(value);
//       }
//       setErrors((prev) => ({ ...prev, [name]: undefined }));
//     },
//     []
//   );

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files.length > 0) {
//       const file = e.target.files[0];
//       setSelectedFile(file);
//       const imageUrl = URL.createObjectURL(file);
//       setFormData((prev) => ({ ...prev, profileImage: imageUrl }));
//     }
//   };

//   const validateForm = (): FormErrors => {
//     const newErrors: FormErrors = {};
//     if (!formData.username.trim()) {
//       newErrors.username = "Name is required.";
//     }
//     if (!formData.phoneNumber || !/^\d{10}$/.test(formData.phoneNumber)) {
//       newErrors.phoneNumber = "Phone number must be exactly 10 digits.";
//     }
//     if (!isEdit) {
//       if (
//         !formData.password ||
//         formData.password.length < 6 ||
//         formData.password.length > 10
//       ) {
//         newErrors.password = "Password must be 6-10 characters.";
//       }
//     } else {
//       if (formData.password && (formData.password.length < 6 || formData.password.length > 10)) {
//         newErrors.password = "Password must be 6-10 characters if provided.";
//       }
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
//     if (!formData.subAreaName) {
//       newErrors.subAreaName = "Sub area is required.";
//     }
//     if (!formData.city) {
//       newErrors.city = "City is required.";
//     }
//     if (!formData.state) {
//       newErrors.state = "State is required.";
//     }
//     return newErrors;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setGeneralError(null);
//     const validationErrors = validateForm();
//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       return;
//     }

//     setIsSubmitting(true);
//     try {
//       let response;
//       if (isEdit) {
//         let payload = { 
//           id, 
//           username: formData.username,
//           password: formData.password,
//           buildingName: formData.buildingName,
//           areaName: formData.areaName,
//           subAreaName: formData.subAreaName,
//           city: formData.city,
//           state: formData.state,
//           pincode: formData.pincode
//         };
//         // If password is empty in edit, remove it from payload
//         if (!formData.password) {
//           delete payload.password;
//         }
//         // If file is selected, add files with binary file
//         if (selectedFile) {
//           payload.profileImage = { selectedFile };
//         }
//         response = await updateUserByAdmin(payload);
//         setTimeout(() => {
//           alert("User updated successfully!");
//           setIsSubmitting(false);
//           navigate("/management/users/all");
//         }, 1000);
//       } else {
//         const createPayload = { ...formData };
//         delete createPayload.profileImage; // Ensure no profileImage for create
//         response = await createUserByAdmin(createPayload);
//         setTimeout(() => {
//           alert(response?.message || "User created successfully!");
//           setIsSubmitting(false);
//           navigate("/management/users/all");
//         }, 1000);
//       }
//       if (!response) {
//         throw new Error("Operation failed.");
//       }
//     } catch (error: any) {
//       setIsSubmitting(false);
//       setGeneralError(error?.message || "Operation failed. Please try again.");
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
//             <div>
//               <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
//                 {isEdit ? "Edit User" : "Add User"}
//               </h1>
//             </div>
//           </div>
//           <button
//             onClick={() => navigate(-1)}
//             className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
//           >
//             <ArrowLeft className="h-4 w-4 mr-2" />
//             Back
//           </button>
//         </div>

//         {/* General Error */}
//         {generalError && (
//           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
//             {generalError}
//           </div>
//         )}

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="space-y-8">
//           <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
//             <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
//               <h2 className="text-lg font-semibold text-white">
//                 User Information
//               </h2>
//             </div>

//             <div className="p-6 space-y-6">
//               {isEdit && (
//                 /* Profile Image - Only for Edit */
//                 <div className="flex flex-col items-center space-y-4">
//                   <label className="block text-sm font-medium text-gray-700">Profile Image</label>
//                   <div className="relative">
//                     <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 p-1 shadow-lg">
//                       <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
//                         {formData.profileImage ? (
//                           <img
//                             src={formData.profileImage}
//                             alt="Profile"
//                             className="w-full h-full object-cover rounded-full"
//                           />
//                         ) : currentProfileImage ? (
//                           <img
//                             src={currentProfileImage}
//                             alt="Profile"
//                             className="w-full h-full object-cover rounded-full"
//                           />
//                         ) : (
//                           <User className="text-gray-400 h-8 w-8" />
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                   <input
//                     type="file"
//                     name="profileImage"
//                     accept="image/*"
//                     onChange={handleFileChange}
//                     className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-blue-100 file:to-blue-200 file:text-blue-700 hover:file:bg-gradient-to-r hover:file:from-blue-200 hover:file:to-blue-300"
//                   />
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
//                     placeholder="Enter full name"
//                     required
//                     aria-describedby={errors.username ? "username-error" : undefined}
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
//                       className={`flex-1 px-4 py-3 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${isEdit ? 'bg-gray-100 cursor-not-allowed' : ''}`}
//                       placeholder="Enter 10-digit mobile number"
//                       pattern="[0-9]{10}"
//                       required
//                       maxLength={10}
//                       disabled={isEdit}
//                       aria-describedby={errors.phoneNumber ? "phoneNumber-error" : undefined}
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
//                     Password {isEdit ? <span className="text-gray-500">(Optional)</span> : <span className="text-red-500">*</span>}
//                   </label>
//                   <div className="relative">
//                     <input
//                       type={showPassword ? "text" : "password"}
//                       name="password"
//                       value={formData.password}
//                       onChange={handleInputChange}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                       placeholder={isEdit ? "Leave blank to keep current (6-10 characters if changing)" : "6-10 characters"}
//                       minLength={6}
//                       maxLength={10}
//                       required={!isEdit}
//                       aria-describedby={errors.password ? "password-error" : undefined}
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
//                     aria-describedby={errors.buildingName ? "buildingName-error" : undefined}
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
//                     aria-describedby={errors.pincode ? "pincode-error" : undefined}
//                   >
//                     <option value="" disabled>
//                       Select Pincode
//                     </option>
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
//                     aria-describedby={errors.areaName ? "areaName-error" : undefined}
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
//                 <div className="md:col-span-2 space-y-2">
//                   <label className="block text-sm font-medium text-gray-700">
//                     Sub Area <span className="text-red-500">*</span>
//                   </label>
//                   <select
//                     name="subAreaName"
//                     value={formData.subAreaName}
//                     onChange={handleInputChange}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100"
//                     required
//                     disabled={!selectedArea}
//                     aria-describedby={errors.subAreaName ? "subAreaName-error" : undefined}
//                   >
//                     <option value="" disabled>
//                       Select Sub Area
//                     </option>
//                     {subAreaOptions.map((sa) => (
//                       <option key={sa._id} value={sa.name}>
//                         {sa.name}
//                       </option>
//                     ))}
//                   </select>
//                   {errors.subAreaName && (
//                     <p id="subAreaName-error" className="text-red-500 text-sm">
//                       {errors.subAreaName}
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
//                     disabled
//                     aria-describedby={errors.city ? "city-error" : undefined}
//                   >
//                     <option value={formData.city}>{formData.city || "Select City"}</option>
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
//                     disabled
//                     aria-describedby={errors.state ? "state-error" : undefined}
//                   >
//                     <option value={formData.state}>{formData.state || "Select State"}</option>
//                   </select>
//                   {errors.state && (
//                     <p id="state-error" className="text-red-500 text-sm">
//                       {errors.state}
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
//               {isSubmitting ? "Processing..." : (isEdit ? "Update" : "Create")}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default UserForm;
// import React, { useState, useCallback, useEffect } from "react";
// import { ArrowLeft, Eye, EyeOff, User } from "lucide-react";
// import { createUserByAdmin, getAllPincodes, updateUserByAdmin } from "../../api/apiMethods";
// import { useNavigate, useLocation, useParams } from "react-router-dom";

// interface UserData {
//   username: string;
//   phoneNumber: string;
//   password: string;
//   profileImage: string;
//   buildingName: string;
//   areaName: string;
//   subAreaName: string;
//   city: string;
//   state: string;
//   pincode: string;
// }

// interface PincodeData {
//   _id: string;
//   code: string;
//   city: string;
//   state: string;
//   areas: { _id: string; name: string; subAreas: { _id: string; name: string }[] }[];
// }

// interface FormErrors {
//   username?: string;
//   phoneNumber?: string;
//   password?: string;
//   buildingName?: string;
//   pincode?: string;
//   areaName?: string;
//   subAreaName?: string;
//   city?: string;
//   state?: string;
// }

// interface User {
//   id: string;
//   username: string;
//   phoneNumber: string;
//   role: string;
//   buildingName: string;
//   areaName: string;
//   subAreaName: string;
//   city: string;
//   state: string;
//   pincode: string;
//   fullAddress: string;
//   profileImage?: string;
// }

// // Initialize with payload data
// const initialFormState: UserData = {
//   username: "",
//   phoneNumber: "",
//   password: "",
//   profileImage: "",
//   buildingName: "",
//   areaName: "",
//   subAreaName: "",
//   city: "",
//   state: "",
//   pincode: "",
// };

// const UserForm: React.FC = () => {
//   const [formData, setFormData] = useState<UserData>(initialFormState);
//   const [errors, setErrors] = useState<FormErrors>({});
//   const [generalError, setGeneralError] = useState<string | null>(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [pincodeData, setPincodeData] = useState<PincodeData[]>([]);
//   const [selectedPincode, setSelectedPincode] = useState<string>("");
//   const [selectedArea, setSelectedArea] = useState<string>("");
//   const [areaOptions, setAreaOptions] = useState<
//     { _id: string; name: string; subAreas: { _id: string; name: string }[] }[]
//   >([]);
//   const [subAreaOptions, setSubAreaOptions] = useState<
//     { _id: string; name: string }[]
//   >([]);
//   const [showPassword, setShowPassword] = useState(false);
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { id } = useParams<{ id: string }>();
//   const user: User | undefined = location.state?.user;
//   const isEdit = !!user && !!id;

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
//     if (isEdit && user) {
//       setFormData({
//         username: user.username,
//         phoneNumber: user.phoneNumber,
//         password: "",
//         profileImage: user.profileImage || "",
//         buildingName: user.buildingName,
//         areaName: user.areaName,
//         subAreaName: user.subAreaName,
//         city: user.city,
//         state: user.state,
//         pincode: user.pincode,
//       });
//       setSelectedPincode(user.pincode);
//       setSelectedArea(user.areaName);
//       setGeneralError(null);
//     }
//   }, [isEdit, user]);

//   useEffect(() => {
//     if (selectedPincode) {
//       const found = pincodeData.find((p) => p.code === selectedPincode);
//       if (found && found.areas) {
//         let areas = found.areas;
//         // If in edit mode and user's area not in options, add it as custom
//         if (isEdit && user && user.areaName && !areas.some(a => a.name === user.areaName)) {
//           areas = [...areas, {
//             _id: `custom-area-${user.areaName}`,
//             name: user.areaName,
//             subAreas: []
//           }];
//         }
//         setAreaOptions(areas);
//         setFormData((prev) => ({
//           ...prev,
//           city: found.city,
//           state: found.state,
//         }));
//       } else {
//         setAreaOptions([]);
//         setSelectedArea("");
//         setSubAreaOptions([]);
//         setFormData((prev) => ({
//           ...prev,
//           areaName: "",
//           subAreaName: "",
//           city: "",
//           state: "",
//         }));
//       }
//     } else {
//       setAreaOptions([]);
//       setSelectedArea("");
//       setSubAreaOptions([]);
//       setFormData((prev) => ({
//         ...prev,
//         areaName: "",
//         subAreaName: "",
//         city: "",
//         state: "",
//       }));
//     }
//   }, [selectedPincode, pincodeData, isEdit, user]);

//   useEffect(() => {
//     if (selectedArea) {
//       const foundArea = areaOptions.find((a) => a.name === selectedArea);
//       if (foundArea) {
//         let subAreas = foundArea.subAreas;
//         // If in edit mode and user's subArea not in options, add it as custom
//         if (isEdit && user && user.subAreaName && !subAreas.some(sa => sa.name === user.subAreaName)) {
//           subAreas = [...subAreas, {
//             _id: `custom-sub-${user.subAreaName}`,
//             name: user.subAreaName
//           }];
//         }
//         setSubAreaOptions(subAreas);
//         setFormData((prev) => ({
//           ...prev,
//           subAreaName: subAreas.some((sa) => sa.name === prev.subAreaName)
//             ? prev.subAreaName
//             : "",
//         }));
//       } else {
//         setSubAreaOptions([]);
//         setFormData((prev) => ({
//           ...prev,
//           subAreaName: "",
//         }));
//       }
//     } else {
//       setSubAreaOptions([]);
//       setFormData((prev) => ({
//         ...prev,
//         subAreaName: "",
//       }));
//     }
//   }, [selectedArea, areaOptions, isEdit, user]);

//   const handleInputChange = useCallback(
//     (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//       const { name, value } = e.target;
//       const update: Partial<UserData> = { [name]: value };
//       if (name === "areaName") {
//         update.subAreaName = "";
//         setSelectedArea(value);
//       }
//       setFormData((prev) => ({ ...prev, ...update }));
//       if (name === "pincode") {
//         setSelectedPincode(value);
//       }
//       setErrors((prev) => ({ ...prev, [name]: undefined }));
//     },
//     []
//   );

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files.length > 0) {
//       const file = e.target.files[0];
//       const imageUrl = URL.createObjectURL(file);
//       setFormData((prev) => ({ ...prev, profileImage: imageUrl }));
//     }
//   };

//   const validateForm = (): FormErrors => {
//     const newErrors: FormErrors = {};
//     if (!formData.username.trim()) {
//       newErrors.username = "Name is required.";
//     }
//     if (!formData.phoneNumber || !/^\d{10}$/.test(formData.phoneNumber)) {
//       newErrors.phoneNumber = "Phone number must be exactly 10 digits.";
//     }
//     if (!isEdit) {
//       if (
//         !formData.password ||
//         formData.password.length < 6 ||
//         formData.password.length > 10
//       ) {
//         newErrors.password = "Password must be 6-10 characters.";
//       }
//     } else {
//       if (formData.password && (formData.password.length < 6 || formData.password.length > 10)) {
//         newErrors.password = "Password must be 6-10 characters if provided.";
//       }
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
//     if (!formData.subAreaName) {
//       newErrors.subAreaName = "Sub area is required.";
//     }
//     if (!formData.city) {
//       newErrors.city = "City is required.";
//     }
//     if (!formData.state) {
//       newErrors.state = "State is required.";
//     }
//     return newErrors;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setGeneralError(null);
//     const validationErrors = validateForm();
//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       return;
//     }

//     setIsSubmitting(true);
//     try {
//       let response;
//       if (isEdit) {
//         let payload = { 
//           id, 
//           username: formData.username,
//           password: formData.password,
//           files: { profileImage: formData.profileImage },
//           buildingName: formData.buildingName,
//           areaName: formData.areaName,
//           subAreaName: formData.subAreaName,
//           city: formData.city,
//           state: formData.state,
//           pincode: formData.pincode
//         };
//         // If password is empty in edit, remove it from payload
//         if (!formData.password) {
//           delete payload.password;
//         }
//         // If files is empty in edit, remove it from payload to avoid overwriting
//         if (!formData.files.profileImage) {
//           delete payload.files.profileImage;
//         }
//         response = await updateUserByAdmin(payload);
//         setTimeout(() => {
//           alert("User updated successfully!");
//           setIsSubmitting(false);
//           navigate("/management/users/all");
//         }, 1000);
//       } else {
//         response = await createUserByAdmin(formData);
//         setTimeout(() => {
//           alert(response?.message || "User created successfully!");
//           setIsSubmitting(false);
//           navigate("/management/users/all");
//         }, 1000);
//       }
//       if (!response) {
//         throw new Error("Operation failed.");
//       }
//     } catch (error: any) {
//       setIsSubmitting(false);
//       setGeneralError(error?.message || "Operation failed. Please try again.");
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
//             <div>
//               <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
//                 {isEdit ? "Edit User" : "Add User"}
//               </h1>
//             </div>
//           </div>
//           <button
//             onClick={() => navigate(-1)}
//             className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
//           >
//             <ArrowLeft className="h-4 w-4 mr-2" />
//             Back
//           </button>
//         </div>

//         {/* General Error */}
//         {generalError && (
//           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
//             {generalError}
//           </div>
//         )}

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="space-y-8">
//           <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
//             <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
//               <h2 className="text-lg font-semibold text-white">
//                 User Information
//               </h2>
//             </div>

//             <div className="p-6 space-y-6">
//               {/* Profile Image */}
//               <div className="flex flex-col items-center space-y-4">
//                 <label className="block text-sm font-medium text-gray-700">Profile Image</label>
//                 <div className="relative">
//                   <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 p-1 shadow-lg">
//                     <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
//                       {formData.profileImage ? (
//                         <img
//                           src={formData.profileImage}
//                           alt="Profile"
//                           className="w-full h-full object-cover rounded-full"
//                         />
//                       ) : (
//                         <User className="text-gray-400 h-8 w-8" />
//                       )}
//                     </div>
//                   </div>
//                 </div>
//                 <input
//                   type="file"
//                   name="profileImage"
//                   accept="image/*"
//                   onChange={handleFileChange}
//                   className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-blue-100 file:to-blue-200 file:text-blue-700 hover:file:bg-gradient-to-r hover:file:from-blue-200 hover:file:to-blue-300"
//                 />
//               </div>

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
//                     placeholder="Enter full name"
//                     required
//                     aria-describedby={errors.username ? "username-error" : undefined}
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
//                       className={`flex-1 px-4 py-3 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${isEdit ? 'bg-gray-100 cursor-not-allowed' : ''}`}
//                       placeholder="Enter 10-digit mobile number"
//                       pattern="[0-9]{10}"
//                       required
//                       maxLength={10}
//                       disabled={isEdit}
//                       aria-describedby={errors.phoneNumber ? "phoneNumber-error" : undefined}
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
//                     Password {isEdit ? <span className="text-gray-500">(Optional)</span> : <span className="text-red-500">*</span>}
//                   </label>
//                   <div className="relative">
//                     <input
//                       type={showPassword ? "text" : "password"}
//                       name="password"
//                       value={formData.password}
//                       onChange={handleInputChange}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                       placeholder={isEdit ? "Leave blank to keep current (6-10 characters if changing)" : "6-10 characters"}
//                       minLength={6}
//                       maxLength={10}
//                       required={!isEdit}
//                       aria-describedby={errors.password ? "password-error" : undefined}
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
//                     aria-describedby={errors.buildingName ? "buildingName-error" : undefined}
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
//                     aria-describedby={errors.pincode ? "pincode-error" : undefined}
//                   >
//                     <option value="" disabled>
//                       Select Pincode
//                     </option>
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
//                     aria-describedby={errors.areaName ? "areaName-error" : undefined}
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
//                 <div className="md:col-span-2 space-y-2">
//                   <label className="block text-sm font-medium text-gray-700">
//                     Sub Area <span className="text-red-500">*</span>
//                   </label>
//                   <select
//                     name="subAreaName"
//                     value={formData.subAreaName}
//                     onChange={handleInputChange}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100"
//                     required
//                     disabled={!selectedArea}
//                     aria-describedby={errors.subAreaName ? "subAreaName-error" : undefined}
//                   >
//                     <option value="" disabled>
//                       Select Sub Area
//                     </option>
//                     {subAreaOptions.map((sa) => (
//                       <option key={sa._id} value={sa.name}>
//                         {sa.name}
//                       </option>
//                     ))}
//                   </select>
//                   {errors.subAreaName && (
//                     <p id="subAreaName-error" className="text-red-500 text-sm">
//                       {errors.subAreaName}
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
//                     disabled
//                     aria-describedby={errors.city ? "city-error" : undefined}
//                   >
//                     <option value={formData.city}>{formData.city || "Select City"}</option>
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
//                     disabled
//                     aria-describedby={errors.state ? "state-error" : undefined}
//                   >
//                     <option value={formData.state}>{formData.state || "Select State"}</option>
//                   </select>
//                   {errors.state && (
//                     <p id="state-error" className="text-red-500 text-sm">
//                       {errors.state}
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
//               {isSubmitting ? "Processing..." : (isEdit ? "Update" : "Create")}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default UserForm;

// import React, { useState, useCallback, useEffect } from "react";
// import { ArrowLeft, Eye, EyeOff, User } from "lucide-react";
// import { createUserByAdmin, getAllPincodes } from "../../api/apiMethods";
// import { useNavigate, useLocation, useParams } from "react-router-dom";

// interface UserData {
//   username: string;
//   phoneNumber: string;
//   password: string;
//   buildingName: string;
//   subAreaName: string;
//   areaName: string; // Assuming this is sent to API, even if not input
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
//   subAreaName?: string;
//   city?: string;
//   state?: string;
// }

// interface User {
//   id: string;
//   username: string;
//   phoneNumber: string;
//   role: string;
//   buildingName: string;
//   areaName: string;
//   subAreaName: string;
//   city: string;
//   state: string;
//   pincode: string;
//   fullAddress: string;
// }

// // Initialize with payload data
// const initialFormState: UserData = {
//   username: "",
//   phoneNumber: "",
//   password: "",
//   buildingName: "",
//   subAreaName: "",
//   areaName: "",
//   city: "",
//   state: "",
//   pincode: "",
// };

// const UserForm: React.FC = () => {
//   const [formData, setFormData] = useState<UserData>(initialFormState);
//   const [errors, setErrors] = useState<FormErrors>({});
//   const [generalError, setGeneralError] = useState<string | null>(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [pincodeData, setPincodeData] = useState<PincodeData[]>([]);
//   const [selectedPincode, setSelectedPincode] = useState<string>(formData.pincode);
//   const [areaOptions, setAreaOptions] = useState<
//     { _id: string; name: string }[]
//   >([]);
//   const [showPassword, setShowPassword] = useState(false);
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { id } = useParams<{ id: string }>();
//   const user: User | undefined = location.state?.user;
//   const isEdit = !!user && !!id;

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
//     if (isEdit && user) {
//       setFormData({
//         username: user.username,
//         phoneNumber: user.phoneNumber,
//         password: "",
//         buildingName: user.buildingName,
//         subAreaName: user.subAreaName,
//         areaName: user.areaName,
//         city: user.city,
//         state: user.state,
//         pincode: user.pincode,
//       });
//       setSelectedPincode(user.pincode);
//       setGeneralError(null);
//     }
//   }, [isEdit, user]);

//   useEffect(() => {
//     if (selectedPincode) {
//       const found = pincodeData.find((p) => p.code === selectedPincode);
//       if (found && found.areas) {
//         setAreaOptions(found.areas);
//         setFormData((prev) => ({
//           ...prev,
//           city: found.city,
//           state: found.state,
//           areaName: found.areaName || prev.areaName, // Assuming areaName might be set in PincodeData if extended
//           subAreaName: found.areas.some((a) => a.name === prev.subAreaName)
//             ? prev.subAreaName
//             : "",
//         }));
//       } else {
//         setAreaOptions([]);
//         setFormData((prev) => ({
//           ...prev,
//           city: "",
//           state: "",
//           areaName: "",
//           subAreaName: "",
//         }));
//       }
//     } else {
//       setAreaOptions([]);
//       setFormData((prev) => ({
//         ...prev,
//         city: "",
//         state: "",
//         areaName: "",
//         subAreaName: "",
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
//       newErrors.username = "Name is required.";
//     }
//     if (!formData.phoneNumber || !/^\d{10}$/.test(formData.phoneNumber)) {
//       newErrors.phoneNumber = "Phone number must be exactly 10 digits.";
//     }
//     if (!isEdit) {
//       if (
//         !formData.password ||
//         formData.password.length < 6 ||
//         formData.password.length > 10
//       ) {
//         newErrors.password = "Password must be 6-10 characters.";
//       }
//     } else {
//       if (formData.password && (formData.password.length < 6 || formData.password.length > 10)) {
//         newErrors.password = "Password must be 6-10 characters if provided.";
//       }
//     }
//     if (!formData.buildingName.trim()) {
//       newErrors.buildingName = "Building name is required.";
//     }
//     if (!formData.pincode || formData.pincode.length !== 6) {
//       newErrors.pincode = "Pincode must be exactly 6 digits.";
//     }
//     if (!formData.subAreaName) {
//       newErrors.subAreaName = "Sub area is required.";
//     }
//     if (!formData.city) {
//       newErrors.city = "City is required.";
//     }
//     if (!formData.state) {
//       newErrors.state = "State is required.";
//     }
//     return newErrors;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setGeneralError(null);
//     const validationErrors = validateForm();
//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       return;
//     }

//     setIsSubmitting(true);
//     try {
//       let response;
//       if (isEdit) {
//         response = await updateUserByAdmin(id!, formData);
//         setTimeout(() => {
//           alert(response?.message || "User updated successfully!");
//           setIsSubmitting(false);
//           navigate("/users");
//         }, 1000);
//       } else {
//         response = await createUserByAdmin(formData);
//         setTimeout(() => {
//           alert(response?.message || "User created successfully!");
//           setIsSubmitting(false);
//           navigate("/users");
//         }, 1000);
//       }
//       if (!response) {
//         throw new Error("Operation failed.");
//       }
//     } catch (error: any) {
//       setIsSubmitting(false);
//       setGeneralError(error?.message || "Operation failed. Please try again.");
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
//             <div>
//               <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
//                 {isEdit ? "Edit User" : "Add User"}
//               </h1>
//             </div>
//           </div>
//           <button
//             onClick={() => navigate(-1)}
//             className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
//           >
//             <ArrowLeft className="h-4 w-4 mr-2" />
//             Back
//           </button>
//         </div>

//         {/* General Error */}
//         {generalError && (
//           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
//             {generalError}
//           </div>
//         )}

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="space-y-8">
//           <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
//             <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
//               <h2 className="text-lg font-semibold text-white">
//                 User Information
//               </h2>
//             </div>

//             <div className="p-6 space-y-6">

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
//                     placeholder="Enter full name"
//                     required
//                     aria-describedby={errors.username ? "username-error" : undefined}
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
//                       className={`flex-1 px-4 py-3 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${isEdit ? 'bg-gray-100 cursor-not-allowed' : ''}`}
//                       placeholder="Enter 10-digit mobile number"
//                       pattern="[0-9]{10}"
//                       required
//                       maxLength={10}
//                       disabled={isEdit}
//                       aria-describedby={errors.phoneNumber ? "phoneNumber-error" : undefined}
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
//                       type={showPassword ? "text" : "password"}
//                       name="password"
//                       value={formData.password}
//                       onChange={handleInputChange}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                       placeholder={isEdit ? "Leave blank or (6-10 characters)" : "6-10 characters"}
//                       minLength={6}
//                       maxLength={10}
//                       required={!isEdit}
//                       aria-describedby={errors.password ? "password-error" : undefined}
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
//                     aria-describedby={errors.buildingName ? "buildingName-error" : undefined}
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
//                     aria-describedby={errors.pincode ? "pincode-error" : undefined}
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
//                     Sub Area <span className="text-red-500">*</span>
//                   </label>
//                   <select
//                     name="subAreaName"
//                     value={formData.subAreaName}
//                     onChange={handleInputChange}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100"
//                     required
//                     disabled={!selectedPincode}
//                     aria-describedby={errors.subAreaName ? "subAreaName-error" : undefined}
//                   >
//                     <option value="" disabled>
//                       Select Sub Area
//                     </option>
//                     {areaOptions.map((a) => (
//                       <option key={a._id} value={a.name}>
//                         {a.name}
//                       </option>
//                     ))}
//                   </select>
//                   {errors.subAreaName && (
//                     <p id="subAreaName-error" className="text-red-500 text-sm">
//                       {errors.subAreaName}
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
//               {isSubmitting ? "Processing..." : (isEdit ? "Update" : "Create")}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default UserForm;
// import React, { useState, useCallback, useEffect } from "react";
// import { ArrowLeft, Eye, EyeOff, User } from "lucide-react";
// import { createUserByAdmin, getAllPincodes } from "../../api/apiMethods";
// import { useNavigate } from "react-router-dom";

// interface UserData {
//   username: string;
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
//   city?: string;
//   state?: string;
//   status?: string;
// }

// // Initialize with payload data
// const initialFormState: UserData = {
//   username: "",
//   phoneNumber: "",
//   password: "",
//   buildingName: "",
//   areaName: "",
//   city: "",
//   state: "",
//   pincode: "",
// };

// const AddUser: React.FC = () => {
//   const [formData, setFormData] = useState<UserData>(initialFormState);
//   const [errors, setErrors] = useState<FormErrors>({});
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [pincodeData, setPincodeData] = useState<PincodeData[]>([]);
//   const [selectedPincode, setSelectedPincode] = useState<string>(formData.pincode);
//   const [areaOptions, setAreaOptions] = useState<
//     { _id: string; name: string }[]
//   >([]);
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
//           areaName: found.areas.some((a) => a.name === prev.areaName)
//             ? prev.areaName
//             : "",
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
//       newErrors.username = "Name is required.";
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
//       const response = await createUserByAdmin(formData);
//       if (!response) {
//         alert("User creation failed.");
//       }

//       setTimeout(() => {
//         alert(response ? response.message : "User created successfully!");
//         setIsSubmitting(false);
//         navigate(-1);
//       }, 1000);
//     } catch (error) {
//       setIsSubmitting(false);
//       setErrors(error?.message);
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
//               Add User
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
//             <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
//               <h2 className="text-lg font-semibold text-white">
//                 User Information
//               </h2>
//             </div>

//             <div className="p-6 space-y-6">

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
//                     placeholder="Enter full name"
//                     required
//                     aria-describedby={errors.username ? "username-error" : undefined}
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
//                       aria-describedby={errors.phoneNumber ? "phoneNumber-error" : undefined}
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
//                       type={showPassword ? "text" : "password"}
//                       name="password"
//                       value={formData.password}
//                       onChange={handleInputChange}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                       placeholder="6-10 characters"
//                       minLength={6}
//                       maxLength={10}
//                       required
//                       aria-describedby={errors.password ? "password-error" : undefined}
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
//                     aria-describedby={errors.buildingName ? "buildingName-error" : undefined}
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
//                     aria-describedby={errors.pincode ? "pincode-error" : undefined}
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
//                     aria-describedby={errors.areaName ? "areaName-error" : undefined}
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
//               {isSubmitting ? "Processing..." : "Create"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddUser;
// import React, { useState, useCallback, useEffect } from "react";
// import { ArrowLeft, Eye, EyeOff, Upload, User } from "lucide-react";
// import { getAllPincodes } from "../../api/apiMethods";
// import { useNavigate } from "react-router-dom";

// interface UserData {
//   username: string;
//   phoneNumber: string;
//   password: string;
//   buildingName: string;
//   areaName: string;
//   city: string;
//   state: string;
//   pincode: string;
//   // status: "active" | "inactive";
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
//   city?: string;
//   state?: string;
//   // status?: string;
// }

// // Initialize with payload data
// const initialFormState: UserData = {
//   username: "",
//   phoneNumber: "",
//   password: "",
//   buildingName: "",
//   areaName: "",
//   city: "",
//   state: "",
//   pincode: "",
//   // status: "active",
// };

// const AddUser: React.FC = () => {
//   const [formData, setFormData] = useState<UserData>(initialFormState);
//   const [errors, setErrors] = useState<FormErrors>({});
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [pincodeData, setPincodeData] = useState<PincodeData[]>([]);
//   const [selectedPincode, setSelectedPincode] = useState<string>(formData.pincode);
//   const [areaOptions, setAreaOptions] = useState<
//     { _id: string; name: string }[]
//   >([]);
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
//           areaName: found.areas.some((a) => a.name === prev.areaName)
//             ? prev.areaName
//             : "",
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
//       newErrors.username = "Name is required.";
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
//     // if (!formData.status) {
//     //   newErrors.status = "Status is required.";
//     // }
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
//       // Simulate API call (replace with actual createUser API)
//       console.log("Submitting user data:", formData);
//       setTimeout(() => {
//         alert("User created successfully!");
//         setIsSubmitting(false);
//         navigate(-1);
//       }, 1000);
//     } catch (error) {
//       setIsSubmitting(false);
//       setErrors({
//         username: "An error occurred while submitting the form.",
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
//               Add User
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
//             <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
//               <h2 className="text-lg font-semibold text-white">
//                 User Information
//               </h2>
//             </div>

//             <div className="p-6 space-y-6">
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
//                     placeholder="Enter full name"
//                     required
//                     aria-describedby={errors.username ? "username-error" : undefined}
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
//                       aria-describedby={errors.phoneNumber ? "phoneNumber-error" : undefined}
//                     />
//                   </div>
//                   {errors.phoneNumber && (
//                     <p id="phoneNumber-error" className="text-red-500 text-sm">
//                       {errors.phoneNumber}
//                     </p>
//                   )}
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <label className="block text-sm font-medium text-gray-700">
//                   Password <span className="text-red-500">*</span>
//                 </label>
//                 <div className="relative">
//                   <input
//                     type={showPassword ? "text" : "password"}
//                     name="password"
//                     value={formData.password}
//                     onChange={handleInputChange}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                     placeholder="6-10 characters"
//                     minLength={6}
//                     maxLength={10}
//                     required
//                     aria-describedby={errors.password ? "password-error" : undefined}
//                   />
//                   <span
//                     className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 hover:text-blue-500"
//                     onClick={() => setShowPassword((prev) => !prev)}
//                   >
//                     {showPassword ? (
//                       <EyeOff className="h-5 w-5" />
//                     ) : (
//                       <Eye className="h-5 w-5" />
//                     )}
//                   </span>
//                 </div>
//                 {errors.password && (
//                   <p id="password-error" className="text-red-500 text-sm">
//                     {errors.password}
//                   </p>
//                 )}
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
//                   aria-describedby={errors.buildingName ? "buildingName-error" : undefined}
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
//                     aria-describedby={errors.pincode ? "pincode-error" : undefined}
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
//                     aria-describedby={errors.areaName ? "areaName-error" : undefined}
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
//               {isSubmitting ? "Processing..." : "Create"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddUser;
// import React, { useState } from 'react';
// import { ArrowLeft, Upload, User } from 'lucide-react';

// interface AddUserProps {
//   onBack: () => void;
// }

// const AddUser: React.FC<AddUserProps> = ({ onBack }) => {
//   const [formData, setFormData] = useState({
//     name: '',
//     mobileNumber: '',
//     email: '',
//     status: 'active'
//   });

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     console.log('User created:', formData);
//     alert('User created successfully!');
//     onBack();
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
//             <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Add User</h1>
//           </div>
//           <button
//             onClick={onBack}
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
//               <h2 className="text-lg font-semibold text-white">User Information</h2>
//             </div>
            
//             <div className="p-6 space-y-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="space-y-2">
//                   <label className="block text-sm font-medium text-gray-700">
//                     Name (English) <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     name="name"
//                     value={formData.name}
//                     onChange={handleInputChange}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                     placeholder="Enter full name"
//                     required
//                   />
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
//                       name="mobileNumber"
//                       value={formData.mobileNumber}
//                       onChange={handleInputChange}
//                      className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                       placeholder="Enter mobile number"
//                       required
//                     />
//                   </div>
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <label className="block text-sm font-medium text-gray-700">
//                   Email <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleInputChange}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                   placeholder="Enter email address"
//                   required
//                 />
//               </div>

//               <div className="space-y-4">
//                 <label className="block text-sm font-medium text-gray-700">Profile Image</label>
//                 <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
//                   <div className="h-20 w-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center shadow-inner">
//                     <User className="h-8 w-8 text-gray-500" />
//                   </div>
//                   <div className="flex-1">
//                     <input
//                       type="file"
//                       accept="image/*"
//                       className="hidden"
//                       id="profile-image"
//                     />
//                     <label
//                       htmlFor="profile-image"
//                       className="inline-flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 cursor-pointer transition-colors duration-200"
//                     >
//                       <Upload className="h-4 w-4 mr-2" />
//                       Change profile picture
//                     </label>
//                     <p className="text-sm text-gray-500 mt-2">JPG, PNG or GIF (max. 2MB)</p>
//                   </div>
//                 </div>
//               </div>

//               <div className="space-y-4">
//                 <label className="block text-sm font-medium text-gray-700">Status</label>
//                 <div className="flex flex-wrap gap-4">
//                   <label className="flex items-center cursor-pointer">
//                     <input
//                       type="radio"
//                       name="status"
//                       value="active"
//                       checked={formData.status === 'active'}
//                       onChange={handleInputChange}
//                       className="sr-only"
//                     />
//                     <div className={`flex items-center px-4 py-2 rounded-lg border-2 transition-all duration-200 ${
//                       formData.status === 'active' 
//                         ? 'border-green-500 bg-green-50 text-green-700' 
//                         : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
//                     }`}>
//                       <div className={`w-3 h-3 rounded-full mr-2 ${
//                         formData.status === 'active' ? 'bg-green-500' : 'bg-gray-300'
//                       }`}></div>
//                       Active
//                     </div>
//                   </label>
//                   <label className="flex items-center cursor-pointer">
//                     <input
//                       type="radio"
//                       name="status"
//                       value="inactive"
//                       checked={formData.status === 'inactive'}
//                       onChange={handleInputChange}
//                       className="sr-only"
//                     />
//                     <div className={`flex items-center px-4 py-2 rounded-lg border-2 transition-all duration-200 ${
//                       formData.status === 'inactive' 
//                         ? 'border-red-500 bg-red-50 text-red-700' 
//                         : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
//                     }`}>
//                       <div className={`w-3 h-3 rounded-full mr-2 ${
//                         formData.status === 'inactive' ? 'bg-red-500' : 'bg-gray-300'
//                       }`}></div>
//                       Inactive
//                     </div>
//                   </label>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Action Buttons */}
//           <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
//             <button
//               type="button"
//               onClick={onBack}
//               className="w-full sm:w-auto px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
//             >
//               Create User
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddUser;