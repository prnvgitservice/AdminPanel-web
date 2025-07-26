import React, { useState, useCallback, useEffect } from 'react';
import { ArrowLeft, Eye, EyeOff, Upload, User } from 'lucide-react';
import { getAllCategories, getAllPincodes } from '../../api/apiMethods';
import { useNavigate } from 'react-router-dom';

interface TechnicianData {
  username: string;
  franchiseId: string;
  category: string;
  phoneNumber: string;
  password: string;
  buildingName: string;
  areaName: string;
  city: string;
  state: string;
  pincode: string;
  profileImage: File | null;
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
  category?: string;
  phoneNumber?: string;
  password?: string;
  buildingName?: string;
  pincode?: string;
  areaName?: string;
  profileImage?: string;
}

const initialFormState: TechnicianData = {
  username: '',
  franchiseId: '',
  category: '',
  phoneNumber: '',
  password: '',
  buildingName: '',
  areaName: '',
  city: '',
  state: '',
  pincode: '',
  profileImage: null,
};

const AddTechnician: React.FC = () => {
  const [formData, setFormData] = useState<TechnicianData>(initialFormState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiCategories, setApiCategories] = useState<{ _id: string; category_name: string; status: number }[]>([]);
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
    getAllCategories(null)
      .then((res: any) => {
        if (Array.isArray(res?.data)) {
          setApiCategories(res.data);
        } else {
          setApiCategories([]);
          setErrors({ category: 'Failed to load categories' });
        }
      })
      .catch(() => {
        setApiCategories([]);
        setErrors({ category: 'Failed to load categories' });
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
      if (file.size > 10 * 1024 * 1024) {
        setErrors({ profileImage: 'Image size must be less than 10MB.' });
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
    if (!formData.category) {
      newErrors.category = 'Category is required.';
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
      console.log('Submitting technician data:', data);
      // Replace with actual API call
      setTimeout(() => {
        alert('Technician added successfully!');
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
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Add Technician</h1>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Technician Information */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
              <h2 className="text-lg font-semibold text-white">Technician Information</h2>
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
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    required
                    aria-describedby={errors.category ? 'category-error' : undefined}
                  >
                    <option value="" disabled>Select a category</option>
                    {apiCategories
                      .filter((category) => category?.status === 1)
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
          </div>

          {/* Profile Image */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
              <h2 className="text-lg font-semibold text-white">Profile Image</h2>
            </div>

            <div className="p-6 space-y-6">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors duration-200">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Upload profile image</p>
                <p className="text-sm text-gray-500 mb-4">PNG, JPG, GIF up to 10MB</p>
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
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 cursor-pointer transition-colors duration-200 shadow-lg hover:shadow-xl"
                >
                  Choose File
                </label>
                {imagePreview && (
                  <div className="mt-4">
                    <img
                      src={imagePreview}
                      alt="Profile preview"
                      className="max-w-xs mx-auto rounded-lg"
                    />
                    <p className="text-sm text-gray-600 mt-2">
                      Selected: {formData.profileImage?.name}
                    </p>
                  </div>
                )}
                {errors.profileImage && (
                  <p id="profileImage-error" className="text-red-500 text-sm mt-2">
                    {errors.profileImage}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
              <h2 className="text-lg font-semibold text-white">Address Information</h2>
            </div>

            <div className="p-6 space-y-6">
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
              {isSubmitting ? 'Processing...' : 'Add Technician'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTechnician;
// import React, { useState, useEffect } from 'react';
// import { ArrowLeft, Upload, Wrench } from 'lucide-react';
// import { addCategory } from '../../api/apiMethods';
// import { useNavigate } from 'react-router-dom';

// interface AddCategoryProps {
//   isEdit?: boolean;
//   category?: Category;
// }

// interface Category {
//   _id: string;
//   category_name: string;
//   category_image: string;
//   status: number;
//   meta_title: string;
//   meta_description: string;
//   servicesCount: number;
//   createdAt: string;
// }

// interface FormData {
//   category_name: string;
//   category_slug: string;
//   category_description: string;
//   status: number;
//   category_image: File | null;
//   meta_title: string;
//   meta_description: string;
// }

// interface FormErrors {
//   category_name?: string;
//   category_slug?: string;
//   category_image?: string;
// }

// const AddCategory: React.FC<AddCategoryProps> = ({ isEdit = false, category }) => {
//   const [formData, setFormData] = useState<FormData>({
//     category_name: '',
//     category_slug: '',
//     category_description: '',
//     status: 1,
//     category_image: null,
//     meta_title: '',
//     meta_description: '',
//   });
//   const [errors, setErrors] = useState<FormErrors>({});
//   const [imagePreview, setImagePreview] = useState<string | null>(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const navigate = useNavigate();
//   console.log('category:', category);

//   useEffect(() => {
//     if (isEdit && category) {
//       setFormData({
//         category_name: category.category_name || '',
//         category_slug: generateSlug(category.category_name) || '',
//         category_description: '',
//         status: category.status || 0, // 1 for active, 0 for inactive
//         category_image: null, // File is not set for edit; use imagePreview for display
//         meta_title: category.meta_title || '',
//         meta_description: category.meta_description || '',
//       });
//       setImagePreview(category.category_image || null); // Set existing image URL for preview
//     }
//   }, [isEdit, category]);

//   // Auto-generate slug from category name
//   const generateSlug = (name: string) => {
//     return name
//       .toLowerCase()
//       .trim()
//       .replace(/[^a-z0-9\s-]/g, '')
//       .replace(/\s+/g, '-')
//       .replace(/-+/g, '-');
//   };

//   const handleInputChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => {
//       const newData = {
//         ...prev,
//         [name]: name === 'status' ? parseInt(value) : value,
//       };
//       // Auto-generate slug when category_name changes
//       if (name === 'category_name') {
//         newData.category_slug = generateSlug(value);
//       }
//       return newData;
//     });
//     // Clear error for the field
//     setErrors((prev) => ({ ...prev, [name]: undefined }));
//   };

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0] || null;
//     if (file) {
//       // Validate file type and size
//       const validTypes = ['image/png', 'image/jpeg', 'image/gif'];
//       if (!validTypes.includes(file.type)) {
//         setErrors((prev) => ({
//           ...prev,
//           category_image: 'Please upload a PNG, JPG, or GIF image.',
//         }));
//         return;
//       }
//       if (file.size > 10 * 1024 * 1024) {
//         setErrors((prev) => ({
//           ...prev,
//           category_image: 'Image size must be less than 10MB.',
//         }));
//         return;
//       }
//       const image = URL.createObjectURL(file);
//       setFormData((prev) => ({ ...prev, category_image: file })); // Store File object
//       setImagePreview(image);
//       setErrors((prev) => ({ ...prev, category_image: undefined }));
//     }
//   };

//   const validateForm = (): FormErrors => {
//     const newErrors: FormErrors = {};
//     if (!formData.category_name.trim()) {
//       newErrors.category_name = 'Category name is required.';
//     }
//     if (!formData.category_slug.trim()) {
//       newErrors.category_slug = 'Category slug is required.';
//     } else if (!/^[a-z0-9-]+$/.test(formData.category_slug)) {
//       newErrors.category_slug = 'Slug can only contain lowercase letters, numbers, and hyphens.';
//     }
//     if (!formData.category_image && !isEdit) {
//       newErrors.category_image = 'Please select an image.';
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
//       const data = {
//         ...formData,
//         category_slug: formData.category_slug.toLowerCase().trim(),
//       };
//       console.log('Submitting category data:', data);
//       const response = await addCategory(data);
//       if (!response?.success) {
//         window.alert(response?.message);
//       } else if (response?.success) {
//         setTimeout(() => {
//           alert(`Category ${isEdit ? 'updated' : 'created'} successfully!`);
//           setIsSubmitting(false);
//         }, 1000);
//       }
//     } catch (error) {
//       setIsSubmitting(false);
//       console.log('error', error);
//       setErrors({ category_image: 'An error occurred while submitting the form.' });
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
//       <div className="max-w-4xl mx-auto">
//         {/* Header */}
//         <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
//           <div className="flex items-center gap-3">
//             <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
//               <Wrench className="h-6 w-6 text-white" />
//             </div>
//             <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
//               {isEdit ? 'Edit Category' : 'Add Category'}
//             </h1>
//           </div>
//           <button
//             onClick={() => navigate("/categories/all")}
//             className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
//           >
//             <ArrowLeft className="h-4 w-4 mr-2" />
//             Back to Categories
//           </button>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-8">
//           {/* Category Information */}
//           <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
//             <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
//               <h2 className="text-lg font-semibold text-white">Category Information</h2>
//             </div>

//             <div className="p-6 space-y-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="space-y-2">
//                   <label className="block text-sm font-medium text-gray-700">
//                     Category Name <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     name="category_name"
//                     value={formData.category_name}
//                     onChange={handleInputChange}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                     placeholder="Enter category name"
//                     required
//                     aria-describedby={errors.category_name ? 'category_name-error' : undefined}
//                   />
//                   {errors.category_name && (
//                     <p id="category_name-error" className="text-red-500 text-sm">
//                       {errors.category_name}
//                     </p>
//                   )}
//                 </div>

//                 <div className="space-y-2">
//                   <label className="block text-sm font-medium text-gray-700">Status</label>
//                   <div className="flex flex-wrap gap-4">
//                     <label className="flex items-center cursor-pointer">
//                       <input
//                         type="radio"
//                         name="status"
//                         value="1"
//                         checked={formData.status === 1}
//                         onChange={handleInputChange}
//                         className="sr-only"
//                         aria-label="Active"
//                       />
//                       <div
//                         className={`flex items-center px-4 py-2 rounded-lg border-2 transition-all duration-200 ${
//                           formData.status === 1
//                             ? 'border-green-500 bg-green-50 text-green-700'
//                             : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
//                         }`}
//                       >
//                         <div
//                           className={`w-3 h-3 rounded-full mr-2 ${
//                             formData.status === 1 ? 'bg-green-500' : 'bg-gray-300'
//                           }`}
//                         ></div>
//                         Active
//                       </div>
//                     </label>
//                     <label className="flex items-center cursor-pointer">
//                       <input
//                         type="radio"
//                         name="status"
//                         value="0"
//                         checked={formData.status === 0}
//                         onChange={handleInputChange}
//                         className="sr-only"
//                         aria-label="Inactive"
//                       />
//                       <div
//                         className={`flex items-center px-4 py-2 rounded-lg border-2 transition-all duration-200 ${
//                           formData.status === 0
//                             ? 'border-red-500 bg-red-50 text-red-700'
//                             : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
//                         }`}
//                       >
//                         <div
//                           className={`w-3 h-3 rounded-full mr-2 ${
//                             formData.status === 0 ? 'bg-red-500' : 'bg-gray-300'
//                           }`}
//                         ></div>
//                         Inactive
//                       </div>
//                     </label>
//                   </div>
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <label className="block text-sm font-medium text-gray-700">Description</label>
//                 <textarea
//                   name="category_description"
//                   value={formData.category_description}
//                   onChange={handleInputChange}
//                   rows={4}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                   placeholder="Enter category description..."
//                 />
//               </div>

//               <div className="space-y-2">
//                 <label className="block text-sm font-medium text-gray-700">
//                   Category Slug <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   name="category_slug"
//                   value={formData.category_slug}
//                   onChange={handleInputChange}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                   placeholder="Enter category slug"
//                   required
//                   aria-describedby={errors.category_slug ? 'category_slug-error' : undefined}
//                 />
//                 {errors.category_slug && (
//                   <p id="category_slug-error" className="text-red-500 text-sm">
//                     {errors.category_slug}
//                   </p>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Category Image */}
//           <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
//             <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
//               <h2 className="text-lg font-semibold text-white">Category Image</h2>
//             </div>

//             <div className="p-6 space-y-6">
//               <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors duration-200">
//                 <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//                 <p className="text-gray-600 mb-2">Upload category image</p>
//                 <p className="text-sm text-gray-500 mb-4">PNG, JPG, GIF up to 10MB</p>
//                 <input
//                   type="file"
//                   accept="image/png,image/jpeg,image/gif"
//                   className="hidden"
//                   id="category-image"
//                   onChange={handleImageChange}
//                   required={!isEdit}
//                   aria-describedby={errors.category_image ? 'category_image-error' : undefined}
//                 />
//                 <label
//                   htmlFor="category-image"
//                   className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 cursor-pointer transition-colors duration-200 shadow-lg hover:shadow-xl"
//                 >
//                   Choose File
//                 </label>
//                 {imagePreview && (
//                   <div className="mt-4">
//                     <img
//                       src={imagePreview}
//                       alt="Category preview"
//                       className="max-w-xs mx-auto rounded-lg"
//                     />
//                     <p className="text-sm text-gray-600 mt-2">
//                       Selected: {formData.category_image?.name || 'Existing image'}
//                     </p>
//                   </div>
//                 )}
//                 {errors.category_image && (
//                   <p id="category_image-error" className="text-red-500 text-sm mt-2">
//                     {errors.category_image}
//                   </p>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Meta Information */}
//           <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
//             <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
//               <h2 className="text-lg font-semibold text-white">Meta Information</h2>
//             </div>

//             <div className="p-6 space-y-6">
//               <div className="space-y-2">
//                 <label className="block text-sm font-medium text-gray-700">Meta Title</label>
//                 <input
//                   type="text"
//                   name="meta_title"
//                   value={formData.meta_title}
//                   onChange={handleInputChange}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                   placeholder="Enter meta title"
//                 />
//               </div>

//               <div className="space-y-2">
//                 <label className="block text-sm font-medium text-gray-700">Meta Description</label>
//                 <textarea
//                   name="meta_description"
//                   value={formData.meta_description}
//                   onChange={handleInputChange}
//                   rows={3}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                   placeholder="Enter meta description"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Action Buttons */}
//           <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
//             <button
//               type="button"
//               onClick={() => navigate('/categories/all')}
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
//               {isSubmitting
//                 ? 'Processing...'
//                 : isEdit
//                   ? 'Update Category'
//                   : 'Create Category'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddCategory;

// import React, { useState } from 'react';
// import { ArrowLeft, Upload, Wrench } from 'lucide-react';

// interface AddCategoryProps {
//   onBack: () => void;
//   isEdit?: boolean;
//   categoryId?: number | null;
// }

// interface formData {
//   categoryName: string,
//   categoryDescription: string,
//   status: number,
//   metaTitle: string,
//   metaDescription: string,
//   metaKeywords: string,
// }

// const AddCategory: React.FC<AddCategoryProps> = ({ onBack, isEdit = false, categoryId }) => {
//   const [formData, setFormData] = useState<formData>({
//     categoryName: '',
//     categoryDescription: '',
//     status: 1,
//     metaTitle: '',
//     metaDescription: '',
//     metaKeywords: '',
//   });

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     console.log('Category data:', formData);
//     alert(`Category ${isEdit ? 'updated' : 'created'} successfully!`);
//     onBack();
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
//       <div className="max-w-4xl mx-auto">
//         {/* Header */}
//         <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
//           <div className="flex items-center gap-3">
//             <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
//               <Wrench className="h-6 w-6 text-white" />
//             </div>
//             <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
//               {isEdit ? 'Edit Category' : 'Add Category'}
//             </h1>
//           </div>
//           <button
//             onClick={onBack}
//             className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
//           >
//             <ArrowLeft className="h-4 w-4 mr-2" />
//             Back to Categories
//           </button>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-8">
//           {/* Category Information */}
//           <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
//             <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
//               <h2 className="text-lg font-semibold text-white">Category Information</h2>
//             </div>

//             <div className="p-6 space-y-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="space-y-2">
//                   <label className="block text-sm font-medium text-gray-700">
//                     Category Name <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     name="categoryName"
//                     value={formData.categoryName}
//                     onChange={handleInputChange}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                     placeholder="Enter category name"
//                     required
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <label className="block text-sm font-medium text-gray-700">Status</label>
//                   <div className="flex flex-wrap gap-4">
//                     <label className="flex items-center cursor-pointer">
//                       <input
//                         type="radio"
//                         name="status"
//                         value={formData.status}
//                         checked={formData.status === 1}
//                         onChange={handleInputChange}
//                         className="sr-only"
//                       />
//                       <div className={`flex items-center px-4 py-2 rounded-lg border-2 transition-all duration-200 ${formData.status === 1
//                           ? 'border-green-500 bg-green-50 text-green-700'
//                           : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
//                         }`}>
//                         <div className={`w-3 h-3 rounded-full mr-2 ${formData.status === 1 ? 'bg-green-500' : 'bg-gray-300'
//                           }`}></div>
//                         Active
//                       </div>
//                     </label>
//                     <label className="flex items-center cursor-pointer">
//                       <input
//                         type="radio"
//                         name="status"
//                         value={formData.status}
//                         checked={formData.status === 0}
//                         onChange={handleInputChange}
//                         className="sr-only"
//                       />
//                       <div className={`flex items-center px-4 py-2 rounded-lg border-2 transition-all duration-200 ${formData.status === 0
//                           ? 'border-red-500 bg-red-50 text-red-700'
//                           : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
//                         }`}>
//                         <div className={`w-3 h-3 rounded-full mr-2 ${formData.status === 0 ? 'bg-red-500' : 'bg-gray-300'
//                           }`}></div>
//                         Inactive
//                       </div>
//                     </label>
//                   </div>
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <label className="block text-sm font-medium text-gray-700">Description</label>
//                 <textarea
//                   name="categoryDescription"
//                   value={formData.categoryDescription}
//                   onChange={handleInputChange}
//                   rows={4}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                   placeholder="Enter category description..."
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Category Image */}
//           <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
//             <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
//               <h2 className="text-lg font-semibold text-white">Category Image</h2>
//             </div>

//             <div className="p-6">
//               <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors duration-200">
//                 <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//                 <p className="text-gray-600 mb-2">Upload category image <span className="text-blue-500">*</span></p>
//                 <p className="text-sm text-gray-500 mb-4">PNG, JPG, GIF up to 10MB</p>
//                 <input
//                   type="file"
//                   accept="image/*"
//                   className="hidden"
//                   id="category-image"
//                 />
//                 <label
//                   htmlFor="category-image"
//                   className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 cursor-pointer transition-colors duration-200 shadow-lg hover:shadow-xl"
//                 >
//                   Choose File
//                 </label>
//               </div>
//             </div>
//           </div>

//           {/* Meta Information */}
//           <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
//             <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
//               <h2 className="text-lg font-semibold text-white">Meta Information</h2>
//             </div>

//             <div className="p-6 space-y-6">
//               <div className="space-y-2">
//                 <label className="block text-sm font-medium text-gray-700">Meta Title</label>
//                 <input
//                   type="text"
//                   name="metaTitle"
//                   value={formData.metaTitle}
//                   onChange={handleInputChange}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                   placeholder="Enter meta title"
//                 />
//               </div>

//               <div className="space-y-2">
//                 <label className="block text-sm font-medium text-gray-700">Meta Description</label>
//                 <textarea
//                   name="metaDescription"
//                   value={formData.metaDescription}
//                   onChange={handleInputChange}
//                   rows={3}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                   placeholder="Enter meta description"
//                 />
//               </div>

//               {/* <div className="space-y-2">
//                 <label className="block text-sm font-medium text-gray-700">Meta Keywords</label>
//                 <input
//                   type="text"
//                   name="metaKeywords"
//                   value={formData.metaKeywords}
//                   onChange={handleInputChange}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                   placeholder="Enter keywords separated by commas"
//                 />
//               </div> */}
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
//               {isEdit ? 'Update Category' : 'Create Category'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddCategory;
