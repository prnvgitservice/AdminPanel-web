import React, { useState, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import { createAppVersion } from "../../api/apiMethods";
import { ArrowLeft, Package } from 'lucide-react';

interface VersionData {
  id: string;
  name: string;
  version: string;
  stagingUrl?: string;
  productionUrl: string;
  playStoreLink?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface CreateVersionResponse {
  success: boolean;
  message?: string;
  data?: VersionData;
}

interface FormData {
  name: string;
  version: string;
  stagingUrl: string;
  productionUrl: string;
  playStoreLink: string;
}

interface FormErrors {
  name?: string;
  version?: string;
  productionUrl?: string;
  stagingUrl?: string;
  playStoreLink?: string;
  global?: string;
}

const initialFormState: FormData = {
  name: "",
  version: "",
  stagingUrl: "",
  productionUrl: "",
  playStoreLink: "",
};

const AppMangeAdd: React.FC = () => {
  const [formData, setFormData] = useState<FormData>(initialFormState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const navigate = useNavigate();

  // Validate single field
  const validateField = (field: keyof Omit<FormErrors, 'global'>, value: string): string => {
    switch (field) {
      case "name":
        if (!value.trim()) return "App name is required.";
        if (value.trim().length < 2) return "App name must be at least 2 characters long.";
        return "";
      case "version":
        if (!value.trim()) return "Version is required.";
        const semverRegex = /^(\d+\.)?(\d+\.)?(\*|\d+)$/;
        if (!semverRegex.test(value.trim())) return "Version must be in semantic format (e.g., 1.0.0).";
        return "";
      case "productionUrl":
        if (!value.trim()) return "Production URL is required.";
        try {
          new URL(value.trim());
        } catch {
          return "Production URL must be a valid URL.";
        }
        return "";
      case "stagingUrl":
        if (!value.trim()) return "";
        try {
          new URL(value.trim());
        } catch {
          return "Staging URL must be a valid URL.";
        }
        return "";
      case "playStoreLink":
        if (!value.trim()) return "";
        try {
          new URL(value.trim());
        } catch {
          return "Play Store link must be a valid URL.";
        }
        return "";
      default:
        return "";
    }
  };

  // Validate all fields
  const validateForm = useCallback((): boolean => {
    const newErrors: Omit<FormErrors, 'global'> = {};
    const fields: (keyof Omit<FormErrors, 'global'>)[] = ['name', 'version', 'productionUrl', 'stagingUrl', 'playStoreLink'];
    fields.forEach((field) => {
      const value = formData[field];
      const error = validateField(field, value);
      if (error) {
        newErrors[field] = error;
      }
    });
    setErrors((prev) => ({ ...prev, ...newErrors }));
    const hasErrors = Object.keys(newErrors).length > 0;
    if (!hasErrors) {
      // Clear any previous validation errors if all good
      setErrors((prev) => {
        const { global: g, ...rest } = prev;
        return g ? { global: g } : {};
      });
    }
    return !hasErrors;
  }, [formData]);

  // Handle field change with validation
  const handleFieldChange = useCallback(
    (field: keyof FormData, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      const error = validateField(field, value);
      setErrors((prev) => {
        // Clear global on any input change
        const { global: _, ...fieldErrors } = prev;
        if (error) {
          return { ...fieldErrors, [field]: error };
        } else {
          const { [field]: omitted, ...rest } = fieldErrors;
          return rest;
        }
      });
      setSubmissionStatus('idle');
    },
    []
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      handleFieldChange(name as keyof FormData, value);
    },
    [handleFieldChange]
  );

  const cancelCreate =()=>{
    if (window.confirm("You have unsaved changes. Are you sure you want to cancel?")) {
    navigate(-1)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      setSubmissionStatus('error');
      return;
    }

    setLoading(true);
    setSubmissionStatus('idle');

    try {
      const payload = {
        name: formData.name.trim(),
        version: formData.version.trim(),
        productionUrl: formData.productionUrl.trim(),
        ...(formData.stagingUrl.trim() && { stagingUrl: formData.stagingUrl.trim() }),
        ...(formData.playStoreLink.trim() && { playStoreLink: formData.playStoreLink.trim() }),
      };

      const res = await createAppVersion(payload) as CreateVersionResponse;
      if (res.success) {
        setSubmissionStatus('success');
        setFormData(initialFormState);
        setErrors({});

        setTimeout(()=>{navigate("/appmangement")},3000)
      } else {
        setErrors({ global: res.message || "Failed to create version" });
        setSubmissionStatus('error');
      }
    } catch (err: any) {
      setErrors({ global: "Failed to create version" });
      setSubmissionStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const hasValidationErrors = Object.entries(errors).some(([key, value]) => key !== 'global' && !!value);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
              <Package className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Create New Version</h1>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
            disabled={loading}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
              <h2 className="text-lg font-semibold text-white">App Version Information</h2>
            </div>

            <div className="p-6 space-y-6">
              {submissionStatus === 'success' && (
                <div className="text-green-600 text-sm text-center bg-green-50 p-2 rounded">
                  Version created successfully!
                </div>
              )}
              {submissionStatus === 'error' && errors.global && (
                <div className="text-red-600 text-sm text-center bg-red-50 p-2 rounded">
                  {errors.global}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    App Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${
                      errors.name
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-blue-500"
                    }`}
                    placeholder="Enter app name"
                    required
                    aria-describedby={errors.name ? 'name-error' : undefined}
                    disabled={loading}
                  />
                  {errors.name && (
                    <p id="name-error" className="text-red-500 text-sm">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Version <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="version"
                    value={formData.version}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${
                      errors.version
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-blue-500"
                    }`}
                    placeholder="e.g., 1.0.0"
                    required
                    aria-describedby={errors.version ? 'version-error' : undefined}
                    disabled={loading}
                  />
                  {errors.version && (
                    <p id="version-error" className="text-red-500 text-sm">
                      {errors.version}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Production URL <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="url"
                    name="productionUrl"
                    value={formData.productionUrl}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${
                      errors.productionUrl
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-blue-500"
                    }`}
                    placeholder="https://example.com"
                    required
                    aria-describedby={errors.productionUrl ? 'productionUrl-error' : undefined}
                    disabled={loading}
                  />
                  {errors.productionUrl && (
                    <p id="productionUrl-error" className="text-red-500 text-sm">
                      {errors.productionUrl}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Staging URL
                  </label>
                  <input
                    type="url"
                    name="stagingUrl"
                    value={formData.stagingUrl}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${
                      errors.stagingUrl
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-blue-500"
                    }`}
                    placeholder="https://staging.example.com"
                    aria-describedby={errors.stagingUrl ? 'stagingUrl-error' : undefined}
                    disabled={loading}
                  />
                  {errors.stagingUrl && (
                    <p id="stagingUrl-error" className="text-red-500 text-sm">
                      {errors.stagingUrl}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Play Store Link
                </label>
                <input
                  type="url"
                  name="playStoreLink"
                  value={formData.playStoreLink}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${
                    errors.playStoreLink
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                  placeholder="https://play.google.com/store/apps/details?id=..."
                  aria-describedby={errors.playStoreLink ? 'playStoreLink-error' : undefined}
                  disabled={loading}
                />
                {errors.playStoreLink && (
                  <p id="playStoreLink-error" className="text-red-500 text-sm">
                    {errors.playStoreLink}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              type="button"
              onClick={cancelCreate}
              className="w-full sm:w-auto px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`w-full sm:w-auto px-8 py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl ${
                loading || hasValidationErrors
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed opacity-50"
                  : "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700"
              }`}
              disabled={loading || hasValidationErrors}
            >
              {loading ? 'Creating...' : 'Create Version'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppMangeAdd;
// import React, { useState, useCallback } from "react";
// import { useNavigate } from 'react-router-dom';
// import { createAppVersion } from "../../api/apiMethods";
// import { ArrowLeft, Package } from 'lucide-react';

// interface VersionData {
//   id: string;
//   name: string;
//   version: string;
//   stagingUrl?: string;
//   productionUrl: string;
//   playStoreLink?: string;
//   createdAt?: string;
//   updatedAt?: string;
// }

// interface CreateVersionResponse {
//   success: boolean;
//   message?: string;
//   data?: VersionData;
// }

// interface FormData {
//   name: string;
//   version: string;
//   stagingUrl: string;
//   productionUrl: string;
//   playStoreLink: string;
// }

// interface FormErrors {
//   [key: string]: string | undefined;
// }

// const initialFormState: FormData = {
//   name: "",
//   version: "",
//   stagingUrl: "",
//   productionUrl: "",
//   playStoreLink: "",
// };

// const AppMangeAdd: React.FC = () => {
//   const [formData, setFormData] = useState<FormData>(initialFormState);
//   const [errors, setErrors] = useState<FormErrors>({});
//   const [loading, setLoading] = useState(false);
//   const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'success' | 'error'>('idle');
//   const navigate = useNavigate();

//   const validateForm = useCallback((): FormErrors => {
//     const newErrors: FormErrors = {};
//     if (!formData.name.trim()) {
//       newErrors.name = 'App name is required.';
//     }
//     if (!formData.version.trim()) {
//       newErrors.version = 'Version is required.';
//     }
//     if (!formData.productionUrl.trim()) {
//       newErrors.productionUrl = 'Production URL is required.';
//     } else if (!/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(formData.productionUrl)) {
//       newErrors.productionUrl = 'Please enter a valid URL.';
//     }
//     return newErrors;
//   }, [formData]);

//   const handleInputChange = useCallback(
//     (e: React.ChangeEvent<HTMLInputElement>) => {
//       const { name, value } = e.target;
//       setFormData((prev) => ({ ...prev, [name]: value }));
//       setErrors((prev) => ({ ...prev, [name]: undefined }));
//       setSubmissionStatus('idle');
//     },
//     []
//   );

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const validationErrors = validateForm();
//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       setSubmissionStatus('error');
//       return;
//     }

//     setLoading(true);
//     setSubmissionStatus('idle');

//     try {
//       const payload = {
//         name: formData.name.trim(),
//         version: formData.version.trim(),
//         productionUrl: formData.productionUrl.trim(),
//         ...(formData.stagingUrl.trim() && { stagingUrl: formData.stagingUrl.trim() }),
//         ...(formData.playStoreLink.trim() && { playStoreLink: formData.playStoreLink.trim() }),
//       };

//       const res = await createAppVersion(payload) as CreateVersionResponse;
//       if (res.success) {
//         setSubmissionStatus('success');
//         setFormData(initialFormState);
//       } else {
//         setErrors({ global: res.message || "Failed to create version" });
//         setSubmissionStatus('error');
//       }
//     } catch (err: any) {
//       setErrors({ global: "Failed to create version" });
//       setSubmissionStatus('error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
//       <div className="max-w-4xl mx-auto">
//         {/* Header */}
//         <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
//           <div className="flex items-center gap-3">
//             <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
//               <Package className="h-6 w-6 text-white" />
//             </div>
//             <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Create New Version</h1>
//           </div>
//           <button
//             onClick={() => navigate(-1)}
//             className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
//             disabled={loading}
//           >
//             <ArrowLeft className="h-4 w-4 mr-2" />
//             Back
//           </button>
//         </div>

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="space-y-8">
//           <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
//             <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
//               <h2 className="text-lg font-semibold text-white">App Version Information</h2>
//             </div>

//             <div className="p-6 space-y-6">
//               {submissionStatus === 'success' && (
//                 <div className="text-green-600 text-sm text-center bg-green-50 p-2 rounded">
//                   Version created successfully!
//                 </div>
//               )}
//               {submissionStatus === 'error' && Object.keys(errors).length > 0 && (
//                 <div className="text-red-600 text-sm text-center bg-red-50 p-2 rounded">
//                   {errors.global || Object.values(errors)[0]}
//                 </div>
//               )}

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="space-y-2">
//                   <label className="block text-sm font-medium text-gray-700">
//                     App Name <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     name="name"
//                     value={formData.name}
//                     onChange={handleInputChange}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                     placeholder="Enter app name"
//                     required
//                     aria-describedby={errors.name ? 'name-error' : undefined}
//                     disabled={loading}
//                   />
//                   {errors.name && (
//                     <p id="name-error" className="text-red-500 text-sm">
//                       {errors.name}
//                     </p>
//                   )}
//                 </div>

//                 <div className="space-y-2">
//                   <label className="block text-sm font-medium text-gray-700">
//                     Version <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     name="version"
//                     value={formData.version}
//                     onChange={handleInputChange}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                     placeholder="e.g., 1.0.0"
//                     required
//                     aria-describedby={errors.version ? 'version-error' : undefined}
//                     disabled={loading}
//                   />
//                   {errors.version && (
//                     <p id="version-error" className="text-red-500 text-sm">
//                       {errors.version}
//                     </p>
//                   )}
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="space-y-2">
//                   <label className="block text-sm font-medium text-gray-700">
//                     Production URL <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="url"
//                     name="productionUrl"
//                     value={formData.productionUrl}
//                     onChange={handleInputChange}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                     placeholder="https://example.com"
//                     required
//                     aria-describedby={errors.productionUrl ? 'productionUrl-error' : undefined}
//                     disabled={loading}
//                   />
//                   {errors.productionUrl && (
//                     <p id="productionUrl-error" className="text-red-500 text-sm">
//                       {errors.productionUrl}
//                     </p>
//                   )}
//                 </div>

//                 <div className="space-y-2">
//                   <label className="block text-sm font-medium text-gray-700">
//                     Staging URL
//                   </label>
//                   <input
//                     type="url"
//                     name="stagingUrl"
//                     value={formData.stagingUrl}
//                     onChange={handleInputChange}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                     placeholder="https://staging.example.com"
//                     aria-describedby={errors.stagingUrl ? 'stagingUrl-error' : undefined}
//                     disabled={loading}
//                   />
//                   {errors.stagingUrl && (
//                     <p id="stagingUrl-error" className="text-red-500 text-sm">
//                       {errors.stagingUrl}
//                     </p>
//                   )}
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <label className="block text-sm font-medium text-gray-700">
//                   Play Store Link
//                 </label>
//                 <input
//                   type="url"
//                   name="playStoreLink"
//                   value={formData.playStoreLink}
//                   onChange={handleInputChange}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                   placeholder="https://play.google.com/store/apps/details?id=..."
//                   aria-describedby={errors.playStoreLink ? 'playStoreLink-error' : undefined}
//                   disabled={loading}
//                 />
//                 {errors.playStoreLink && (
//                   <p id="playStoreLink-error" className="text-red-500 text-sm">
//                     {errors.playStoreLink}
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
//               disabled={loading}
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
//               disabled={loading}
//             >
//               {loading ? 'Creating...' : 'Create Version'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AppMangeAdd;