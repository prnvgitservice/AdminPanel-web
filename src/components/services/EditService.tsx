import React, { useState, useCallback, useEffect } from "react";
import { ArrowLeft, Briefcase, Image as ImageIcon } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

interface ServiceData {
  id: string;
  name: string;
  price: string;
  image: File | null;
  technicianName: string;
  category: string;
  discount: string;
}

interface FormErrors {
  name?: string;
  price?: string;
  image?: string;
  technicianName?: string;
  category?: string;
  discount?: string;
}

const EditService: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const service = state?.service as ServiceData | undefined;

  const initialFormState: ServiceData = service || {
    id: "",
    name: "",
    price: "",
    image: null,
    technicianName: "",
    category: "Plumbing",
    discount: "",
  };

  const [formData, setFormData] = useState<ServiceData>(initialFormState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(
    service?.image ? (typeof service.image === "string" ? service.image : null) : null
  );

  // Fake categories for the dropdown
  const categories = ["Plumbing", "Electrical", "Cleaning"];

  useEffect(() => {
    if (!service) {
      setErrors({ status: "No service data available. Please select a service." });
    }
  }, [service]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    },
    []
  );

  const handleImageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        if (!["image/jpeg", "image/png", "image/gif"].includes(file.type)) {
          setErrors((prev) => ({
            ...prev,
            image: "Only JPG, PNG, or GIF files are allowed.",
          }));
          return;
        }
        if (file.size > 5 * 1024 * 1024) {
          setErrors((prev) => ({
            ...prev,
            image: "Image size must be less than 5MB.",
          }));
          return;
        }
        setFormData((prev) => ({ ...prev, image: file }));
        setErrors((prev) => ({ ...prev, image: undefined }));
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setFormData((prev) => ({ ...prev, image: null }));
        setImagePreview(null);
      }
    },
    []
  );

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Service name is required.";
    }
    if (!formData.price || isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = "Price must be a positive number.";
    }
    if (!formData.image && !imagePreview) {
      newErrors.image = "Image is required.";
    }
    if (!formData.technicianName.trim()) {
      newErrors.technicianName = "Technician name is required.";
    }
    if (!formData.category) {
      newErrors.category = "Category is required.";
    }
    if (formData.discount) {
      const discountValue = formData.discount.trim();
      if (discountValue.endsWith("%")) {
        const percentage = parseFloat(discountValue.slice(0, -1));
        if (isNaN(percentage) || percentage < 0 || percentage > 100) {
          newErrors.discount = "Discount percentage must be between 0 and 100.";
        }
      } else {
        const amount = parseFloat(discountValue);
        if (isNaN(amount) || amount < 0) {
          newErrors.discount = "Discount amount must be a positive number.";
        } else if (amount >= Number(formData.price)) {
          newErrors.discount = "Discount cannot exceed the price.";
        }
      }
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
      // Simulate API call
      setTimeout(() => {
        alert("Service updated successfully!");
        setIsSubmitting(false);
        navigate("/services/all");
      }, 1000);
    } catch (error) {
      setIsSubmitting(false);
      setErrors({ status: "Failed to update service." });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
              <Briefcase className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Edit Service
            </h1>
          </div>
          <button
            onClick={() => navigate("/services/all")}
            className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </button>
        </div>

        {/* Error Message */}
        {errors.status && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {errors.status}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
              <h2 className="text-lg font-semibold text-white">
                Service Information
              </h2>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Service Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter service name"
                    required
                    aria-describedby={errors.name ? "name-error" : undefined}
                  />
                  {errors.name && (
                    <p id="name-error" className="text-red-500 text-sm">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Price <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter price"
                    min="0"
                    step="0.01"
                    required
                    aria-describedby={errors.price ? "price-error" : undefined}
                  />
                  {errors.price && (
                    <p id="price-error" className="text-red-500 text-sm">
                      {errors.price}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Image <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="file"
                      name="image"
                      accept="image/jpeg,image/png,image/gif"
                      onChange={handleImageChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      aria-describedby={errors.image ? "image-error" : undefined}
                    />
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="h-16 w-16 rounded object-cover"
                      />
                    ) : (
                      <ImageIcon className="h-16 w-16 text-gray-300" />
                    )}
                  </div>
                  {errors.image && (
                    <p id="image-error" className="text-red-500 text-sm">
                      {errors.image}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Technician Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="technicianName"
                    value={formData.technicianName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter technician name"
                    required
                    aria-describedby={errors.technicianName ? "technicianName-error" : undefined}
                  />
                  {errors.technicianName && (
                    <p id="technicianName-error" className="text-red-500 text-sm">
                      {errors.technicianName}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    aria-describedby={errors.category ? "category-error" : undefined}
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p id="category-error" className="text-red-500 text-sm">
                      {errors.category}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Discount (Optional)
                  </label>
                  <input
                    type="text"
                    name="discount"
                    value={formData.discount}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter discount (e.g., 50 or 10%)"
                    aria-describedby={errors.discount ? "discount-error" : undefined}
                  />
                  {errors.discount && (
                    <p id="discount-error" className="text-red-500 text-sm">
                      {errors.discount}
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
              onClick={() => navigate("/services/all")}
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
              {isSubmitting ? "Processing..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditService;