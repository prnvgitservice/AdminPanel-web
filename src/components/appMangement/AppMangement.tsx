import React, { useEffect, useState } from "react";
import {
  deleteAppVersion,
  getAllAppVersions,
  updateAppVersion,
} from "../../api/apiMethods";
import { Plus, SeparatorVertical, X, Check, Trash2, Edit3 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface VersionData {
  _id: string;
  name: string;
  version: string;
  stagingUrl?: string;
  productionUrl: string;
  playStoreLink?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface VersionResponse {
  success: boolean;
  data: VersionData[];
}

interface UpdateVersionResponse {
  success: boolean;
  message?: string;
  data?: VersionData;
}

interface DeleteVersionResponse {
  success: boolean;
  message?: string;
}

interface FormErrors {
  name?: string;
  version?: string;
  productionUrl?: string;
  stagingUrl?: string;
  playStoreLink?: string;
}

const AppManagement: React.FC = () => {
  const [versions, setVersions] = useState<VersionData[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingData, setEditingData] = useState<VersionData | null>(null);
  const [originalData, setOriginalData] = useState<VersionData | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{
    type: "success" | "error" | "";
    text: string;
  }>({
    type: "",
    text: "",
  });
  const navigate = useNavigate();

  // Fetch versions
  const fetchVersions = async () => {
    setLoading(true);
    try {
      const res = (await getAllAppVersions()) as VersionResponse;
      setVersions(res.data || []);
    } catch (err: any) {
      setMessage({ type: "error", text: "Failed to load versions" });
    } finally {
      setLoading(false);
    }
  };

  // Validate single field
  const validateField = (field: keyof FormErrors, value: string): string => {
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
  const validateForm = (): boolean => {
    if (!editingData) return false;
    const newErrors: FormErrors = {};
    Object.keys(editingData).forEach((key) => {
      const field = key as keyof VersionData;
      if (field === "_id" || field === "createdAt" || field === "updatedAt") return;
      const value = (editingData as any)[field];
      const error = validateField(field as keyof FormErrors, value || "");
      if (error) newErrors[field as keyof FormErrors] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle field change with validation
  const handleFieldChange = (field: keyof VersionData, value: string) => {
    setEditingData({ ...editingData!, [field]: value });
    const error = validateField(field as keyof FormErrors, value);
    setErrors((prev) => {
      if (error) {
        return { ...prev, [field as keyof FormErrors]: error };
      } else {
        const { [field as keyof FormErrors]: omitted, ...rest } = prev;
        return rest;
      }
    });
  };

  // Check if data has changed
  const hasChanges = () => {
    if (!editingData || !originalData) return false;
    return (
      editingData.name !== originalData.name ||
      editingData.version !== originalData.version ||
      editingData.productionUrl !== originalData.productionUrl ||
      editingData.stagingUrl !== originalData.stagingUrl ||
      editingData.playStoreLink !== originalData.playStoreLink
    );
  };

  // Update version
  const updateVersion = async () => {
    if (!editingData || !validateForm()) {
      setMessage({ type: "error", text: "Please fix the errors before saving." });
      return;
    }
    if (!window.confirm("Are you sure you want to update this version?")) {
      return;
    }
    setUpdating(true);
    try {
      const payload = {
        id: editingData._id,
        name: editingData.name,
        version: editingData.version,
        productionUrl: editingData.productionUrl,
        ...(editingData.stagingUrl && { stagingUrl: editingData.stagingUrl }),
        ...(editingData.playStoreLink && {
          playStoreLink: editingData.playStoreLink,
        }),
      };
      const res = (await updateAppVersion(payload)) as UpdateVersionResponse;
      if (res.success) {
        setMessage({
          type: "success",
          text: res.message || "Version updated successfully",
        });
        fetchVersions();
        cancelEdit();
      } else {
        setMessage({
          type: "error",
          text: res.message || "Failed to update version",
        });
      }
    } catch (err: any) {
      setMessage({ type: "error", text: "Failed to update version" });
    } finally {
      setUpdating(false);
    }
  };

  // Delete version
  const handleDelete = async (version: VersionData) => {
    if (!window.confirm(`Are you sure you want to delete "${version.name}"? This action cannot be undone.`)) {
      return;
    }
    setDeletingId(version._id);
    try {
      const res = (await deleteAppVersion(version._id)) as DeleteVersionResponse;
      if (res.success) {
        setMessage({
          type: "success",
          text: res.message || "Version deleted successfully",
        });
        fetchVersions();
      } else {
        setMessage({
          type: "error",
          text: res.message || "Failed to delete version",
        });
      }
    } catch (err: any) {
      setMessage({ type: "error", text: "Failed to delete version" });
    } finally {
      setDeletingId(null);
    }
  };

  // Start editing a version
  const startEdit = (version: VersionData) => {
    setEditingId(version._id);
    setEditingData({ ...version });
    setOriginalData({ ...version });
    setErrors({});
  };

  // Cancel editing
  const cancelEdit = () => {
    if (hasChanges() && !window.confirm("You have unsaved changes. Are you sure you want to cancel?")) {
      return;
    }
    setEditingId(null);
    setEditingData(null);
    setOriginalData(null);
    setErrors({});
  };

  useEffect(() => {
    fetchVersions();
  }, []);

  const clearMessage = () => {
    setMessage({ type: "", text: "" });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading versions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-md">
              <SeparatorVertical className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Version Manager</h1>
          </div>
          <button
            onClick={() => navigate("/appmanagement/add")}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 whitespace-nowrap"
          >
            <Plus className="h-5 w-5" />
            Add New Version
          </button>
        </div>

        {/* Message */}
        {message.text && (
          <div
            className={`mx-auto max-w-md p-4 mb-6 rounded-xl shadow-md transition-all duration-200 ${
              message.type === "success"
                ? "bg-green-50 border border-green-200 text-green-800"
                : "bg-red-50 border border-red-200 text-red-800"
            }`}
            onClick={clearMessage}
          >
            <div className="flex items-center gap-2">
              {message.type === "success" ? (
                <Check className="h-5 w-5" />
              ) : (
                <X className="h-5 w-5" />
              )}
              <span>{message.text}</span>
            </div>
          </div>
        )}

        {/* Versions Grid */}
        {versions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-500 mb-4">No versions found.</p>
            <button
              onClick={() => navigate("/appmanagement/add")}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-purple-700 transition-all duration-200"
            >
              Create Your First Version
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {versions.map((version) => (
              <div
                key={version._id}
                className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200 ${
                  editingId === version._id ? "ring-2 ring-blue-500 ring-opacity-30" : ""
                }`}
              >
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    {version.name}
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      v{version.version}
                    </span>
                  </h2>
                  {editingId !== version._id && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(version)}
                        className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit3 className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(version)}
                        disabled={deletingId === version._id}
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Delete"
                      >
                        {deletingId === version._id ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600"></div>
                        ) : (
                          <Trash2 className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  {editingId === version._id ? (
                    // Edit Form
                    <form className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          App Name *
                        </label>
                        <input
                          type="text"
                          value={editingData?.name || ""}
                          onChange={(e) => handleFieldChange("name", e.target.value)}
                          className={`w-full border rounded-lg p-3 focus:ring-2 focus:border-transparent transition-colors ${
                            errors.name
                              ? "border-red-500 focus:ring-red-500"
                              : "border-gray-300 focus:ring-blue-500"
                          }`}
                          required
                        />
                        {errors.name && (
                          <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Version *
                          </label>
                          <input
                            type="text"
                            value={editingData?.version || ""}
                            onChange={(e) => handleFieldChange("version", e.target.value)}
                            className={`w-full border rounded-lg p-3 focus:ring-2 focus:border-transparent transition-colors ${
                              errors.version
                                ? "border-red-500 focus:ring-red-500"
                                : "border-gray-300 focus:ring-blue-500"
                            }`}
                            required
                          />
                          {errors.version && (
                            <p className="mt-1 text-sm text-red-600">{errors.version}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Production URL *
                          </label>
                          <input
                            type="url"
                            value={editingData?.productionUrl || ""}
                            onChange={(e) => handleFieldChange("productionUrl", e.target.value)}
                            className={`w-full border rounded-lg p-3 focus:ring-2 focus:border-transparent transition-colors ${
                              errors.productionUrl
                                ? "border-red-500 focus:ring-red-500"
                                : "border-gray-300 focus:ring-blue-500"
                            }`}
                            required
                          />
                          {errors.productionUrl && (
                            <p className="mt-1 text-sm text-red-600">{errors.productionUrl}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Staging URL (Optional)
                        </label>
                        <input
                          type="url"
                          value={editingData?.stagingUrl || ""}
                          onChange={(e) => handleFieldChange("stagingUrl", e.target.value)}
                          className={`w-full border rounded-lg p-3 focus:ring-2 focus:border-transparent transition-colors ${
                            errors.stagingUrl
                              ? "border-red-500 focus:ring-red-500"
                              : "border-gray-300 focus:ring-blue-500"
                          }`}
                        />
                        {errors.stagingUrl && (
                          <p className="mt-1 text-sm text-red-600">{errors.stagingUrl}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Play Store Link (Optional)
                        </label>
                        <input
                          type="url"
                          value={editingData?.playStoreLink || ""}
                          onChange={(e) => handleFieldChange("playStoreLink", e.target.value)}
                          className={`w-full border rounded-lg p-3 focus:ring-2 focus:border-transparent transition-colors ${
                            errors.playStoreLink
                              ? "border-red-500 focus:ring-red-500"
                              : "border-gray-300 focus:ring-blue-500"
                          }`}
                        />
                        {errors.playStoreLink && (
                          <p className="mt-1 text-sm text-red-600">{errors.playStoreLink}</p>
                        )}
                      </div>

                      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                        <button
                          type="button"
                          onClick={cancelEdit}
                          disabled={updating}
                          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={updateVersion}
                          disabled={updating || Object.keys(errors).length > 0}
                          className={`px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                            updating || Object.keys(errors).length > 0
                              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                              : "bg-blue-600 text-white hover:bg-blue-700"
                          }`}
                        >
                          {updating && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
                          Save Changes
                        </button>
                      </div>
                    </form>
                  ) : (
                    // View Mode
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500 font-medium">App Name:</span>
                        <span className="text-gray-900 font-medium">{version.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500 font-medium">Version:</span>
                        <span className="text-gray-900 font-medium">{version.version}</span>
                      </div>
                      <div className="pt-3 border-t border-gray-200">
                        <span className="text-gray-500 font-medium block mb-1">Production URL:</span>
                        <a
                          href={version.productionUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 break-all inline-block"
                        >
                          {version.productionUrl}
                        </a>
                      </div>
                      {version.stagingUrl && (
                        <div>
                          <span className="text-gray-500 font-medium block mb-1">Staging URL:</span>
                          <a
                            href={version.stagingUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 break-all inline-block"
                          >
                            {version.stagingUrl}
                          </a>
                        </div>
                      )}
                      {version.playStoreLink && (
                        <div>
                          <span className="text-gray-500 font-medium block mb-1">Play Store Link:</span>
                          <a
                            href={version.playStoreLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 break-all inline-block"
                          >
                            {version.playStoreLink}
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AppManagement;
// import React, { useEffect, useState } from "react";
// import {
//   deleteAppVersion,
//   getAllAppVersions,
//   updateAppVersion,
// } from "../../api/apiMethods";
// import { Plus, SeparatorVertical, X, Check, Trash2, Edit3 } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// interface VersionData {
//   _id: string;
//   name: string;
//   version: string;
//   stagingUrl?: string;
//   productionUrl: string;
//   playStoreLink?: string;
//   createdAt?: string;
//   updatedAt?: string;
// }

// interface VersionResponse {
//   success: boolean;
//   data: VersionData[];
// }

// interface UpdateVersionResponse {
//   success: boolean;
//   message?: string;
//   data?: VersionData;
// }

// interface DeleteVersionResponse {
//   success: boolean;
//   message?: string;
// }

// interface FormErrors {
//   name?: string;
//   version?: string;
//   productionUrl?: string;
//   stagingUrl?: string;
//   playStoreLink?: string;
// }

// const AppManagement: React.FC = () => {
//   const [versions, setVersions] = useState<VersionData[]>([]);
//   const [editingId, setEditingId] = useState<string | null>(null);
//   const [editingData, setEditingData] = useState<VersionData | null>(null);
//   const [originalData, setOriginalData] = useState<VersionData | null>(null);
//   const [errors, setErrors] = useState<FormErrors>({});
//   const [loading, setLoading] = useState(false);
//   const [updating, setUpdating] = useState(false);
//   const [deletingId, setDeletingId] = useState<string | null>(null);
//   const [message, setMessage] = useState<{
//     type: "success" | "error" | "";
//     text: string;
//   }>({
//     type: "",
//     text: "",
//   });
//   const navigate = useNavigate();

//   // Fetch versions
//   const fetchVersions = async () => {
//     setLoading(true);
//     try {
//       const res = (await getAllAppVersions()) as VersionResponse;
//       setVersions(res.data || []);
//     } catch (err: any) {
//       setMessage({ type: "error", text: "Failed to load versions" });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Validate single field
//   const validateField = (field: keyof FormErrors, value: string): string => {
//     switch (field) {
//       case "name":
//         if (!value.trim()) return "App name is required.";
//         if (value.trim().length < 2) return "App name must be at least 2 characters long.";
//         return "";
//       case "version":
//         if (!value.trim()) return "Version is required.";
//         const semverRegex = /^(\d+\.)?(\d+\.)?(\*|\d+)$/;
//         if (!semverRegex.test(value.trim())) return "Version must be in semantic format (e.g., 1.0.0).";
//         return "";
//       case "productionUrl":
//         if (!value.trim()) return "Production URL is required.";
//         try {
//           new URL(value.trim());
//         } catch {
//           return "Production URL must be a valid URL.";
//         }
//         return "";
//       case "stagingUrl":
//         if (!value.trim()) return "";
//         try {
//           new URL(value.trim());
//         } catch {
//           return "Staging URL must be a valid URL.";
//         }
//         return "";
//       case "playStoreLink":
//         if (!value.trim()) return "";
//         try {
//           new URL(value.trim());
//         } catch {
//           return "Play Store link must be a valid URL.";
//         }
//         return "";
//       default:
//         return "";
//     }
//   };

//   // Validate all fields
//   const validateForm = (): boolean => {
//     if (!editingData) return false;
//     const newErrors: FormErrors = {};
//     Object.keys(editingData).forEach((key) => {
//       const field = key as keyof VersionData;
//       if (field === "_id" || field === "createdAt" || field === "updatedAt") return;
//       const value = (editingData as any)[field];
//       const error = validateField(field as keyof FormErrors, value || "");
//       if (error) newErrors[field as keyof FormErrors] = error;
//     });
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   // Handle field change with validation
//   const handleFieldChange = (field: keyof VersionData, value: string) => {
//     setEditingData({ ...editingData!, [field]: value });
//     const error = validateField(field as keyof FormErrors, value);
//     setErrors((prev) => ({
//       ...prev,
//       [field]: error,
//     }));
//   };

//   // Check if data has changed
//   const hasChanges = () => {
//     if (!editingData || !originalData) return false;
//     return (
//       editingData.name !== originalData.name ||
//       editingData.version !== originalData.version ||
//       editingData.productionUrl !== originalData.productionUrl ||
//       editingData.stagingUrl !== originalData.stagingUrl ||
//       editingData.playStoreLink !== originalData.playStoreLink
//     );
//   };

//   // Update version
//   const updateVersion = async () => {
//     if (!editingData || !validateForm()) {
//       setMessage({ type: "error", text: "Please fix the errors before saving." });
//       return;
//     }
//     if (!window.confirm("Are you sure you want to update this version?")) {
//       return;
//     }
//     setUpdating(true);
//     try {
//       const payload = {
//         id: editingData._id,
//         name: editingData.name,
//         version: editingData.version,
//         productionUrl: editingData.productionUrl,
//         ...(editingData.stagingUrl && { stagingUrl: editingData.stagingUrl }),
//         ...(editingData.playStoreLink && {
//           playStoreLink: editingData.playStoreLink,
//         }),
//       };
//       const res = (await updateAppVersion(payload)) as UpdateVersionResponse;
//       if (res.success) {
//         setMessage({
//           type: "success",
//           text: res.message || "Version updated successfully",
//         });
//         fetchVersions();
//         cancelEdit();
//       } else {
//         setMessage({
//           type: "error",
//           text: res.message || "Failed to update version",
//         });
//       }
//     } catch (err: any) {
//       setMessage({ type: "error", text: "Failed to update version" });
//     } finally {
//       setUpdating(false);
//     }
//   };

//   // Delete version
//   const handleDelete = async (version: VersionData) => {
//     if (!window.confirm(`Are you sure you want to delete "${version.name}"? This action cannot be undone.`)) {
//       return;
//     }
//     setDeletingId(version._id);
//     try {
//       const res = (await deleteAppVersion(version._id)) as DeleteVersionResponse;
//       if (res.success) {
//         setMessage({
//           type: "success",
//           text: res.message || "Version deleted successfully",
//         });
//         fetchVersions();
//       } else {
//         setMessage({
//           type: "error",
//           text: res.message || "Failed to delete version",
//         });
//       }
//     } catch (err: any) {
//       setMessage({ type: "error", text: "Failed to delete version" });
//     } finally {
//       setDeletingId(null);
//     }
//   };

//   // Start editing a version
//   const startEdit = (version: VersionData) => {
//     setEditingId(version._id);
//     setEditingData({ ...version });
//     setOriginalData({ ...version });
//     setErrors({});
//   };

//   // Cancel editing
//   const cancelEdit = () => {
//     if (hasChanges() && !window.confirm("You have unsaved changes. Are you sure you want to cancel?")) {
//       return;
//     }
//     setEditingId(null);
//     setEditingData(null);
//     setOriginalData(null);
//     setErrors({});
//   };

//   useEffect(() => {
//     fetchVersions();
//   }, []);

//   const clearMessage = () => {
//     setMessage({ type: "", text: "" });
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
//           <p className="text-gray-500">Loading versions...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
//           <div className="flex items-center gap-3">
//             <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-md">
//               <SeparatorVertical className="h-6 w-6 text-white" />
//             </div>
//             <h1 className="text-3xl font-bold text-gray-900">Version Manager</h1>
//           </div>
//           <button
//             onClick={() => navigate("/appmanagement/add")}
//             className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 whitespace-nowrap"
//           >
//             <Plus className="h-5 w-5" />
//             Add New Version
//           </button>
//         </div>

//         {/* Message */}
//         {message.text && (
//           <div
//             className={`mx-auto max-w-md p-4 mb-6 rounded-xl shadow-md transition-all duration-200 ${
//               message.type === "success"
//                 ? "bg-green-50 border border-green-200 text-green-800"
//                 : "bg-red-50 border border-red-200 text-red-800"
//             }`}
//             onClick={clearMessage}
//           >
//             <div className="flex items-center gap-2">
//               {message.type === "success" ? (
//                 <Check className="h-5 w-5" />
//               ) : (
//                 <X className="h-5 w-5" />
//               )}
//               <span>{message.text}</span>
//             </div>
//           </div>
//         )}

//         {/* Versions Grid */}
//         {versions.length === 0 ? (
//           <div className="text-center py-12">
//             <p className="text-xl text-gray-500 mb-4">No versions found.</p>
//             <button
//               onClick={() => navigate("/appmanagement/add")}
//               className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-purple-700 transition-all duration-200"
//             >
//               Create Your First Version
//             </button>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//             {versions.map((version) => (
//               <div
//                 key={version._id}
//                 className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200 ${
//                   editingId === version._id ? "ring-2 ring-blue-500 ring-opacity-30" : ""
//                 }`}
//               >
//                 <div className="flex justify-between items-start mb-6">
//                   <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
//                     {version.name}
//                     <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
//                       v{version.version}
//                     </span>
//                   </h2>
//                   {editingId !== version._id && (
//                     <div className="flex gap-2">
//                       <button
//                         onClick={() => startEdit(version)}
//                         className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
//                         title="Edit"
//                       >
//                         <Edit3 className="h-5 w-5" />
//                       </button>
//                       <button
//                         onClick={() => handleDelete(version)}
//                         disabled={deletingId === version._id}
//                         className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
//                         title="Delete"
//                       >
//                         {deletingId === version._id ? (
//                           <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600"></div>
//                         ) : (
//                           <Trash2 className="h-5 w-5" />
//                         )}
//                       </button>
//                     </div>
//                   )}
//                 </div>

//                 <div className="space-y-4">
//                   {editingId === version._id ? (
//                     // Edit Form
//                     <form className="space-y-4">
//                       <div>
//                         <label className="block text-sm font-semibold text-gray-700 mb-2">
//                           App Name *
//                         </label>
//                         <input
//                           type="text"
//                           value={editingData?.name || ""}
//                           onChange={(e) => handleFieldChange("name", e.target.value)}
//                           className={`w-full border rounded-lg p-3 focus:ring-2 focus:border-transparent transition-colors ${
//                             errors.name
//                               ? "border-red-500 focus:ring-red-500"
//                               : "border-gray-300 focus:ring-blue-500"
//                           }`}
//                           required
//                         />
//                         {errors.name && (
//                           <p className="mt-1 text-sm text-red-600">{errors.name}</p>
//                         )}
//                       </div>

//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <div>
//                           <label className="block text-sm font-semibold text-gray-700 mb-2">
//                             Version *
//                           </label>
//                           <input
//                             type="text"
//                             value={editingData?.version || ""}
//                             onChange={(e) => handleFieldChange("version", e.target.value)}
//                             className={`w-full border rounded-lg p-3 focus:ring-2 focus:border-transparent transition-colors ${
//                               errors.version
//                                 ? "border-red-500 focus:ring-red-500"
//                                 : "border-gray-300 focus:ring-blue-500"
//                             }`}
//                             required
//                           />
//                           {errors.version && (
//                             <p className="mt-1 text-sm text-red-600">{errors.version}</p>
//                           )}
//                         </div>

//                         <div>
//                           <label className="block text-sm font-semibold text-gray-700 mb-2">
//                             Production URL *
//                           </label>
//                           <input
//                             type="url"
//                             value={editingData?.productionUrl || ""}
//                             onChange={(e) => handleFieldChange("productionUrl", e.target.value)}
//                             className={`w-full border rounded-lg p-3 focus:ring-2 focus:border-transparent transition-colors ${
//                               errors.productionUrl
//                                 ? "border-red-500 focus:ring-red-500"
//                                 : "border-gray-300 focus:ring-blue-500"
//                             }`}
//                             required
//                           />
//                           {errors.productionUrl && (
//                             <p className="mt-1 text-sm text-red-600">{errors.productionUrl}</p>
//                           )}
//                         </div>
//                       </div>

//                       <div>
//                         <label className="block text-sm font-semibold text-gray-700 mb-2">
//                           Staging URL (Optional)
//                         </label>
//                         <input
//                           type="url"
//                           value={editingData?.stagingUrl || ""}
//                           onChange={(e) => handleFieldChange("stagingUrl", e.target.value)}
//                           className={`w-full border rounded-lg p-3 focus:ring-2 focus:border-transparent transition-colors ${
//                             errors.stagingUrl
//                               ? "border-red-500 focus:ring-red-500"
//                               : "border-gray-300 focus:ring-blue-500"
//                           }`}
//                         />
//                         {errors.stagingUrl && (
//                           <p className="mt-1 text-sm text-red-600">{errors.stagingUrl}</p>
//                         )}
//                       </div>

//                       <div>
//                         <label className="block text-sm font-semibold text-gray-700 mb-2">
//                           Play Store Link (Optional)
//                         </label>
//                         <input
//                           type="url"
//                           value={editingData?.playStoreLink || ""}
//                           onChange={(e) => handleFieldChange("playStoreLink", e.target.value)}
//                           className={`w-full border rounded-lg p-3 focus:ring-2 focus:border-transparent transition-colors ${
//                             errors.playStoreLink
//                               ? "border-red-500 focus:ring-red-500"
//                               : "border-gray-300 focus:ring-blue-500"
//                           }`}
//                         />
//                         {errors.playStoreLink && (
//                           <p className="mt-1 text-sm text-red-600">{errors.playStoreLink}</p>
//                         )}
//                       </div>

//                       <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
//                         <button
//                           type="button"
//                           onClick={cancelEdit}
//                           disabled={updating}
//                           className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
//                         >
//                           Cancel
//                         </button>
//                         <button
//                           type="button"
//                           onClick={updateVersion}
//                           disabled={updating || Object.keys(errors).length > 0}
//                           className={`px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
//                             updating || Object.keys(errors).length > 0
//                               ? "bg-gray-300 text-gray-500 cursor-not-allowed"
//                               : "bg-blue-600 text-white hover:bg-blue-700"
//                           }`}
//                         >
//                           {updating && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
//                           Save Changes
//                         </button>
//                       </div>
//                     </form>
//                   ) : (
//                     // View Mode
//                     <div className="space-y-3 text-sm">
//                       <div className="flex justify-between">
//                         <span className="text-gray-500 font-medium">App Name:</span>
//                         <span className="text-gray-900 font-medium">{version.name}</span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-gray-500 font-medium">Version:</span>
//                         <span className="text-gray-900 font-medium">{version.version}</span>
//                       </div>
//                       <div className="pt-3 border-t border-gray-200">
//                         <span className="text-gray-500 font-medium block mb-1">Production URL:</span>
//                         <a
//                           href={version.productionUrl}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="text-blue-600 hover:text-blue-800 break-all inline-block"
//                         >
//                           {version.productionUrl}
//                         </a>
//                       </div>
//                       {version.stagingUrl && (
//                         <div>
//                           <span className="text-gray-500 font-medium block mb-1">Staging URL:</span>
//                           <a
//                             href={version.stagingUrl}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="text-green-600 hover:text-green-800 break-all inline-block"
//                           >
//                             {version.stagingUrl}
//                           </a>
//                         </div>
//                       )}
//                       {version.playStoreLink && (
//                         <div>
//                           <span className="text-gray-500 font-medium block mb-1">Play Store Link:</span>
//                           <a
//                             href={version.playStoreLink}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="text-purple-600 hover:text-purple-800 break-all inline-block"
//                           >
//                             {version.playStoreLink}
//                           </a>
//                         </div>
//                       )}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AppManagement;
// import React, { useEffect, useState } from "react";
// import {
//   deleteAppVersion,
//   getAllAppVersions,
//   updateAppVersion,
// } from "../../api/apiMethods";
// import { Plus, SeparatorVertical, X, Check, Trash2, Edit3 } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// interface VersionData {
//   _id: string;
//   name: string;
//   version: string;
//   stagingUrl?: string;
//   productionUrl: string;
//   playStoreLink?: string;
//   createdAt?: string;
//   updatedAt?: string;
// }

// interface VersionResponse {
//   success: boolean;
//   data: VersionData[];
// }

// interface UpdateVersionResponse {
//   success: boolean;
//   message?: string;
//   data?: VersionData;
// }

// interface DeleteVersionResponse {
//   success: boolean;
//   message?: string;
// }

// const AppManagement: React.FC = () => {
//   const [versions, setVersions] = useState<VersionData[]>([]);
//   const [editingId, setEditingId] = useState<string | null>(null);
//   const [editingData, setEditingData] = useState<VersionData | null>(null);
//   const [originalData, setOriginalData] = useState<VersionData | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [updating, setUpdating] = useState(false);
//   const [deletingId, setDeletingId] = useState<string | null>(null);
//   const [message, setMessage] = useState<{
//     type: "success" | "error" | "";
//     text: string;
//   }>({
//     type: "",
//     text: "",
//   });
//   const navigate = useNavigate();

//   // Fetch versions
//   const fetchVersions = async () => {
//     setLoading(true);
//     try {
//       const res = (await getAllAppVersions()) as VersionResponse;
//       setVersions(res.data || []);
//     } catch (err: any) {
//       setMessage({ type: "error", text: "Failed to load versions" });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Check if data has changed
//   const hasChanges = () => {
//     if (!editingData || !originalData) return false;
//     return (
//       editingData.name !== originalData.name ||
//       editingData.version !== originalData.version ||
//       editingData.productionUrl !== originalData.productionUrl ||
//       editingData.stagingUrl !== originalData.stagingUrl ||
//       editingData.playStoreLink !== originalData.playStoreLink
//     );
//   };

//   // Update version
//   const updateVersion = async () => {
//     if (!editingData) return;
//     if (!window.confirm("Are you sure you want to update this version?")) {
//       return;
//     }
//     setUpdating(true);
//     try {
//       const payload = {
//         id: editingData._id,
//         name: editingData.name,
//         version: editingData.version,
//         productionUrl: editingData.productionUrl,
//         ...(editingData.stagingUrl && { stagingUrl: editingData.stagingUrl }),
//         ...(editingData.playStoreLink && {
//           playStoreLink: editingData.playStoreLink,
//         }),
//       };
//       const res = (await updateAppVersion(payload)) as UpdateVersionResponse;
//       if (res.success) {
//         setMessage({
//           type: "success",
//           text: res.message || "Version updated successfully",
//         });
//         fetchVersions();
//         cancelEdit();
//       } else {
//         setMessage({
//           type: "error",
//           text: res.message || "Failed to update version",
//         });
//       }
//     } catch (err: any) {
//       setMessage({ type: "error", text: "Failed to update version" });
//     } finally {
//       setUpdating(false);
//     }
//   };

//   // Delete version
//   const handleDelete = async (version: VersionData) => {
//     if (
//       !window.confirm(
//         `Are you sure you want to delete "${version.name}"? This action cannot be undone.`
//       )
//     ) {
//       return;
//     }
//     setDeletingId(version._id);
//     try {
//       const res = (await deleteAppVersion(
//         version._id
//       )) as DeleteVersionResponse;
//       if (res.success) {
//         setMessage({
//           type: "success",
//           text: res.message || "Version deleted successfully",
//         });
//         fetchVersions();
//       } else {
//         setMessage({
//           type: "error",
//           text: res.message || "Failed to delete version",
//         });
//       }
//     } catch (err: any) {
//       setMessage({ type: "error", text: "Failed to delete version" });
//     } finally {
//       setDeletingId(null);
//     }
//   };

//   // Start editing a version
//   const startEdit = (version: VersionData) => {
//     setEditingId(version._id);
//     setEditingData({ ...version });
//     setOriginalData({ ...version });
//   };

//   // Cancel editing
//   const cancelEdit = () => {
//     if (
//       hasChanges() &&
//       !window.confirm(
//         "You have unsaved changes. Are you sure you want to cancel?"
//       )
//     ) {
//       return;
//     }
//     setEditingId(null);
//     setEditingData(null);
//     setOriginalData(null);
//   };

//   useEffect(() => {
//     fetchVersions();
//   }, []);

//   const clearMessage = () => {
//     setMessage({ type: "", text: "" });
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
//           <p className="text-gray-500">Loading versions...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
//           <div className="flex items-center gap-3">
//             <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-md">
//               <SeparatorVertical className="h-6 w-6 text-white" />
//             </div>
//             <h1 className="text-3xl font-bold text-gray-900">
//               Version Manager
//             </h1>
//           </div>
//           <button
//             onClick={() => navigate("/appmanagement/add")}
//             className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 whitespace-nowrap"
//           >
//             <Plus className="h-5 w-5" />
//             Add New Version
//           </button>
//         </div>

//         {/* Message */}
//         {message.text && (
//           <div
//             className={`mx-auto max-w-md p-4 mb-6 rounded-xl shadow-md transition-all duration-200 ${
//               message.type === "success"
//                 ? "bg-green-50 border border-green-200 text-green-800"
//                 : "bg-red-50 border border-red-200 text-red-800"
//             }`}
//             onClick={clearMessage}
//           >
//             <div className="flex items-center gap-2">
//               {message.type === "success" ? (
//                 <Check className="h-5 w-5" />
//               ) : (
//                 <X className="h-5 w-5" />
//               )}
//               <span>{message.text}</span>
//             </div>
//           </div>
//         )}

//         {/* Versions Grid */}
//         {versions.length === 0 ? (
//           <div className="text-center py-12">
//             <p className="text-xl text-gray-500 mb-4">No versions found.</p>
//             <button
//               onClick={() => navigate("/appmanagement/add")}
//               className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-purple-700 transition-all duration-200"
//             >
//               Create Your First Version
//             </button>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//             {versions.map((version) => (
//               <div
//                 key={version._id}
//                 className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200 ${
//                   editingId === version._id
//                     ? "ring-2 ring-blue-500 ring-opacity-30"
//                     : ""
//                 }`}
//               >
//                 <div className="flex justify-between items-start mb-6">
//                   <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
//                     {version.name}
//                     <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
//                       v{version.version}
//                     </span>
//                   </h2>
//                   {editingId !== version._id && (
//                     <div className="flex gap-2">
//                       <button
//                         onClick={() => startEdit(version)}
//                         className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
//                         title="Edit"
//                       >
//                         <Edit3 className="h-5 w-5" />
//                       </button>
//                       <button
//                         onClick={() => handleDelete(version)}
//                         disabled={deletingId === version._id}
//                         className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
//                         title="Delete"
//                       >
//                         {deletingId === version._id ? (
//                           <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600"></div>
//                         ) : (
//                           <Trash2 className="h-5 w-5" />
//                         )}
//                       </button>
//                     </div>
//                   )}
//                 </div>

//                 <div className="space-y-4">
//                   {editingId === version._id ? (
//                     // Edit Form
//                     <form className="space-y-4">
//                       <div>
//                         <label className="block text-sm font-semibold text-gray-700 mb-2">
//                           App Name *
//                         </label>
//                         <input
//                           type="text"
//                           value={editingData?.name || ""}
//                           onChange={(e) =>
//                             setEditingData({
//                               ...editingData!,
//                               name: e.target.value,
//                             })
//                           }
//                           className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                           required
//                         />
//                       </div>

//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <div>
//                           <label className="block text-sm font-semibold text-gray-700 mb-2">
//                             Version *
//                           </label>
//                           <input
//                             type="text"
//                             value={editingData?.version || ""}
//                             onChange={(e) =>
//                               setEditingData({
//                                 ...editingData!,
//                                 version: e.target.value,
//                               })
//                             }
//                             className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                             required
//                           />
//                         </div>

//                         <div>
//                           <label className="block text-sm font-semibold text-gray-700 mb-2">
//                             Production URL *
//                           </label>
//                           <input
//                             type="url"
//                             value={editingData?.productionUrl || ""}
//                             placeholder="https://staging.example.com"
//                             onChange={(e) =>
//                               setEditingData({
//                                 ...editingData!,
//                                 productionUrl: e.target.value,
//                               })
//                             }
//                             className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                             required
//                           />
//                         </div>
//                       </div>

//                       <div>
//                         <label className="block text-sm font-semibold text-gray-700 mb-2">
//                           Staging URL (Optional)
//                         </label>
//                         <input
//                           type="url"
//                           value={editingData?.stagingUrl || ""}
//                           placeholder="https://staging.example.com"
//                           onChange={(e) =>
//                             setEditingData({
//                               ...editingData!,
//                               stagingUrl: e.target.value || undefined,
//                             })
//                           }
//                           className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-sm font-semibold text-gray-700 mb-2">
//                           Play Store Link (Optional)
//                         </label>
//                         <input
//                           type="url"
//                           value={editingData?.playStoreLink || ""}
//                           placeholder="https://play.google.com/store/apps/details?id=..."
//                           onChange={(e) =>
//                             setEditingData({
//                               ...editingData!,
//                               playStoreLink: e.target.value || undefined,
//                             })
//                           }
//                           className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                         />
//                       </div>

//                       <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
//                         <button
//                           type="button"
//                           onClick={cancelEdit}
//                           disabled={updating}
//                           className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
//                         >
//                           Cancel
//                         </button>
//                         <button
//                           type="button"
//                           onClick={updateVersion}
//                           disabled={updating || !editingData}
//                           className={`px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
//                             updating || !editingData
//                               ? "bg-gray-300 text-gray-500 cursor-not-allowed"
//                               : "bg-blue-600 text-white hover:bg-blue-700"
//                           }`}
//                         >
//                           {updating && (
//                             <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//                           )}
//                           Save Changes
//                         </button>
//                       </div>
//                     </form>
//                   ) : (
//                     // View Mode
//                     <div className="space-y-3 text-sm">
//                       <div className="flex justify-between">
//                         <span className="text-gray-500 font-medium">
//                           App Name:
//                         </span>
//                         <span className="text-gray-900 font-medium">
//                           {version.name}
//                         </span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-gray-500 font-medium">
//                           Version:
//                         </span>
//                         <span className="text-gray-900 font-medium">
//                           {version.version}
//                         </span>
//                       </div>
//                       <div className="pt-3 border-t border-gray-200">
//                         <span className="text-gray-500 font-medium block mb-1">
//                           Production URL:
//                         </span>
//                         <a
//                           href={version.productionUrl}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="text-blue-600 hover:text-blue-800 break-all inline-block"
//                         >
//                           {version.productionUrl}
//                         </a>
//                       </div>
//                       {version.stagingUrl && (
//                         <div>
//                           <span className="text-gray-500 font-medium block mb-1">
//                             Staging URL:
//                           </span>
//                           <a
//                             href={version.stagingUrl}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="text-blue-600 hover:text-blue-800 break-all inline-block"
//                           >
//                             {version.stagingUrl}
//                           </a>
//                         </div>
//                       )}
//                       {version.playStoreLink && (
//                         <div>
//                           <span className="text-gray-500 font-medium block mb-1">
//                             Play Store Link:
//                           </span>
//                           <a
//                             href={version.playStoreLink}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="text-blue-600 hover:text-blue-800 break-all inline-block"
//                           >
//                             {version.playStoreLink}
//                           </a>
//                         </div>
//                       )}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AppManagement;
// import React, { useEffect, useState, version } from "react";
// import {
//   deleteAppVersion,
//   getAllAppVersions,
//   updateAppVersion,
// } from "../../api/apiMethods";
// import { Plus, SeparatorVertical } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// interface VersionData {
//   _id: string;
//   name: string;
//   version: string;
//   stagingUrl?: string;
//   productionUrl: string;
//   playStoreLink?: string;
//   createdAt?: string;
//   updatedAt?: string;
// }

// interface VersionResponse {
//   success: boolean;
//   data: VersionData[];
// }

// interface UpdateVersionResponse {
//   success: boolean;
//   message?: string;
//   data?: VersionData;
// }

// interface DeleteVersionResponse {
//   success: boolean;
//   message?: string;
// }

// const AppMangement: React.FC = () => {
//   const [versions, setVersions] = useState<VersionData[]>([]);
//   const [editingId, setEditingId] = useState<string | null>(null);
//   const [editingData, setEditingData] = useState<VersionData | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [updating, setUpdating] = useState(false);
//   const [message, setMessage] = useState<{
//     type: "success" | "error" | "";
//     text: string;
//   }>({
//     type: "",
//     text: "",
//   });
//   const navigate = useNavigate();

//   // Fetch versions
//   const fetchVersions = async () => {
//     setLoading(true);
//     try {
//       const res = (await getAllAppVersions()) as VersionResponse;
//       setVersions(res.data || []);
//       setLoading(false);
//     } catch (err: any) {
//       setLoading(false);
//       setMessage({ type: "error", text: "Failed to load versions" });
//     }
//   };

//   // Update version
//   const updateVersion = async () => {
//     if (!editingData) return;
//     setUpdating(true);
//     try {
//       const payload = {
//         id: editingData._id,
//         name: editingData.name,
//         version: editingData.version,
//         productionUrl: editingData.productionUrl,
//         ...(editingData.stagingUrl && { stagingUrl: editingData.stagingUrl }),
//         ...(editingData.playStoreLink && {
//           playStoreLink: editingData.playStoreLink,
//         }),
//       };
//       const res = (await updateAppVersion(payload)) as UpdateVersionResponse;
//       if (res.success) {
//         setMessage({
//           type: "success",
//           text: res.message || "Version updated successfully",
//         });
//         fetchVersions();
//         cancelEdit();
//       } else {
//         setMessage({
//           type: "error",
//           text: res.message || "Failed to update version",
//         });
//       }
//       setUpdating(false);
//     } catch (err: any) {
//       setUpdating(false);
//       setMessage({ type: "error", text: "Failed to update version" });
//     }
//   };

//   // Start editing a version
//   const startEdit = (version: VersionData) => {
//     setEditingId(version._id);
//     setEditingData({ ...version });
//   };

//   const handleDelete = async (version: VersionData) => {
//     try {
//         if(window.confirm === true){

//             const res = (await deleteAppVersion(
//               version._id
//             )) as DeleteVersionResponse;
//             if (res.success) {
//               setMessage({
//                 type: "success",
//                 text: res.message || "Version updated successfully",
//               });
//               fetchVersions();
//         }
//       } else {
//         setMessage({
//           type: "error",
//           text: res.message || "Failed to update version",
//         });
//       }
//       setUpdating(false);
//     } catch (err: any) {
//       setUpdating(false);
//       setMessage({ type: "error", text: "Failed to delete version" });
//     }
//   };

//   // Cancel editing
//   const cancelEdit = () => {
//     setEditingId(null);
//     setEditingData(null);
//   };

//   useEffect(() => {
//     fetchVersions();
//   }, []);

//   const clearMessage = () => {
//     setMessage({ type: "", text: "" });
//   };

//   return (
//     <div className="min-h-screen max-w-7xl bg-gray-100 gap-3 justify-center flex-col px-4 py-8">
//       <div className="flex items-center justify-between mb-8">
//         <div className="flex items-center gap-3">
//           <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
//             <SeparatorVertical className="h-5 w-5 text-white" />
//           </div>
//           <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
//             Version Manager
//           </h1>
//         </div>
//         <button
//           onClick={() => navigate("/appmangement/add")}
//           className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
//         >
//           <Plus className="h-4 w-4 mr-2" />
//           Add APP management
//         </button>
//       </div>

//       <div>
//         {message.text && (
//           <div
//             className={`text-center py-2 mb-4 rounded-md ${
//               message.type === "success"
//                 ? "bg-green-100 text-green-700"
//                 : message.type === "error"
//                 ? "bg-red-100 text-red-700"
//                 : ""
//             }`}
//             onClick={clearMessage}
//           >
//             {message.text}
//           </div>
//         )}

//         {loading ? (
//           <p className="text-center text-gray-500">Loading versions...</p>
//         ) : versions.length === 0 ? (
//           <p className="text-center text-gray-500">No versions found.</p>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {versions.map((version) => (
//               <div
//                 key={version._id}
//                 className="border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
//               >
//                 <div className="flex justify-between items-start mb-4">
//                   <h2 className="text-xl font-semibold text-gray-800">
//                     {version.name} — v{version.version}
//                   </h2>
//                   {editingId !== version._id && (
//                     <button
//                       onClick={() => startEdit(version)}
//                       className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors"
//                     >
//                       Edit
//                     </button>
//                   )}

//                   {editingId !== version._id && (
//                     <button
//                       onClick={() => handleDelete(version)}
//                       className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors"
//                     >
//                       Delete
//                     </button>
//                   )}
//                 </div>

//                 <div className="space-y-3">
//                   {editingId === version._id ? (
//                     // Edit Form
//                     <>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-600 mb-1">
//                           App Name
//                         </label>
//                         <input
//                           type="text"
//                           value={editingData?.name || ""}
//                           onChange={(e) =>
//                             setEditingData({
//                               ...editingData!,
//                               name: e.target.value,
//                             })
//                           }
//                           className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500"
//                         />
//                       </div>

//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <div>
//                           <label className="block text-sm font-medium text-gray-600 mb-1">
//                             Version
//                           </label>
//                           <input
//                             type="text"
//                             value={editingData?.version || ""}
//                             onChange={(e) =>
//                               setEditingData({
//                                 ...editingData!,
//                                 version: e.target.value,
//                               })
//                             }
//                             className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500"
//                           />
//                         </div>

//                         <div>
//                           <label className="block text-sm font-medium text-gray-600 mb-1">
//                             Production URL
//                           </label>
//                           <input
//                             type="text"
//                             value={editingData?.productionUrl || ""}
//                             onChange={(e) =>
//                               setEditingData({
//                                 ...editingData!,
//                                 productionUrl: e.target.value,
//                               })
//                             }
//                             className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500"
//                           />
//                         </div>
//                       </div>

//                       <div>
//                         <label className="block text-sm font-medium text-gray-600 mb-1">
//                           Staging URL
//                         </label>
//                         <input
//                           type="text"
//                           value={editingData?.stagingUrl || ""}
//                           onChange={(e) =>
//                             setEditingData({
//                               ...editingData!,
//                               stagingUrl: e.target.value || undefined,
//                             })
//                           }
//                           className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500"
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-sm font-medium text-gray-600 mb-1">
//                           Play Store Link
//                         </label>
//                         <input
//                           type="text"
//                           value={editingData?.playStoreLink || ""}
//                           onChange={(e) =>
//                             setEditingData({
//                               ...editingData!,
//                               playStoreLink: e.target.value || undefined,
//                             })
//                           }
//                           className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500"
//                         />
//                       </div>

//                       <div className="flex justify-end space-x-2 mt-4">
//                         <button
//                           onClick={cancelEdit}
//                           disabled={updating}
//                           className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md font-medium hover:bg-gray-400 transition-colors disabled:opacity-50"
//                         >
//                           Cancel
//                         </button>
//                         <button
//                           onClick={updateVersion}
//                           disabled={updating}
//                           className={`bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors ${
//                             updating ? "opacity-70 cursor-not-allowed" : ""
//                           }`}
//                         >
//                           {updating ? "Updating..." : "Save Changes"}
//                         </button>
//                       </div>
//                     </>
//                   ) : (
//                     // View Mode - Expandable details
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
//                       <div>
//                         <span className="font-medium text-gray-600">
//                           App Name:
//                         </span>
//                         <p className="text-gray-800 ml-2">{version.name}</p>
//                       </div>

//                       <div>
//                         <span className="font-medium text-gray-600">
//                           Version:
//                         </span>
//                         <p className="text-gray-800 ml-2">{version.version}</p>
//                       </div>

//                       <div className="md:col-span-2">
//                         <span className="font-medium text-gray-600">
//                           Production URL:
//                         </span>
//                         <p className="text-gray-800 ml-2 break-all">
//                           {version.productionUrl}
//                         </p>
//                       </div>

//                       {version.stagingUrl && (
//                         <div className="md:col-span-2">
//                           <span className="font-medium text-gray-600">
//                             Staging URL:
//                           </span>
//                           <p className="text-gray-800 ml-2 break-all">
//                             {version.stagingUrl}
//                           </p>
//                         </div>
//                       )}

//                       {version.playStoreLink && (
//                         <div className="md:col-span-2">
//                           <span className="font-medium text-gray-600">
//                             Play Store Link:
//                           </span>
//                           <p className="text-gray-800 ml-2 break-all">
//                             {version.playStoreLink}
//                           </p>
//                         </div>
//                       )}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AppMangement;
// import React, { useEffect, useState } from "react";
// import axios from "axios";

// interface VersionData {
//   _id: string;
//   name: string;
//   version: string;
//   stagingUrl?: string;
//   productionUrl: string;
//   playStoreLink?: string;
//   createdAt?: string;
//   updatedAt?: string;
// }

// const AppMangement: React.FC = () => {
//   const [versions, setVersions] = useState<VersionData[]>([]);
//   const [selected, setSelected] = useState<VersionData | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [updating, setUpdating] = useState(false);
//   const [message, setMessage] = useState<{ type: "success" | "error" | ""; text: string }>({
//     type: "",
//     text: "",
//   });

//   // Fetch versions
//   const fetchVersions = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.get("http://localhost:5000/api/appVersion/getAll");
//       setVersions(res.data.data || []);
//       setLoading(false);
//     } catch (err: any) {
//       setLoading(false);
//       setMessage({ type: "error", text: "Failed to load versions" });
//     }
//   };

//   // Update version
//   const updateVersion = async () => {
//     if (!selected?._id) return;
//     setUpdating(true);
//     try {
//       await axios.put(`http://localhost:5000/api/appVersion/update`, selected);
//       setMessage({ type: "success", text: "Version updated successfully" });
//       setUpdating(false);
//       fetchVersions();
//     } catch (err: any) {
//       setUpdating(false);
//       setMessage({ type: "error", text: "Failed to update version" });
//     }
//   };

//   useEffect(() => {
//     fetchVersions();
//   }, []);

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
//       <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-8">
//         <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
//           Version Manager
//         </h1>

//         {message.text && (
//           <div
//             className={`text-center py-2 mb-4 rounded-md ${
//               message.type === "success"
//                 ? "bg-green-100 text-green-700"
//                 : message.type === "error"
//                 ? "bg-red-100 text-red-700"
//                 : ""
//             }`}
//           >
//             {message.text}
//           </div>
//         )}

//         {loading ? (
//           <p className="text-center text-gray-500">Loading versions...</p>
//         ) : versions.length === 0 ? (
//           <p className="text-center text-gray-500">No versions found.</p>
//         ) : (
//           <>
//             <div className="mb-4 flex justify-center">
//               <select
//                 className="border border-gray-300 rounded-md p-2 w-full md:w-2/3 text-gray-700 focus:ring-2 focus:ring-red-500"
//                 value={selected?._id || ""}
//                 onChange={(e) =>
//                   setSelected(versions.find((v) => v._id === e.target.value) || null)
//                 }
//               >
//                 <option value="">Select a version</option>
//                 {versions.map((v) => (
//                   <option key={v._id} value={v._id}>
//                     {v.name} — v{v.version}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {selected && (
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-600 mb-1">
//                     App Name
//                   </label>
//                   <input
//                     type="text"
//                     value={selected.name}
//                     onChange={(e) =>
//                       setSelected({ ...selected, name: e.target.value })
//                     }
//                     className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-red-500"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-600 mb-1">
//                     Version
//                   </label>
//                   <input
//                     type="text"
//                     value={selected.version}
//                     onChange={(e) =>
//                       setSelected({ ...selected, version: e.target.value })
//                     }
//                     className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-red-500"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-600 mb-1">
//                     Staging URL
//                   </label>
//                   <input
//                     type="text"
//                     value={selected.stagingUrl || ""}
//                     onChange={(e) =>
//                       setSelected({ ...selected, stagingUrl: e.target.value })
//                     }
//                     className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-red-500"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-600 mb-1">
//                     Production URL
//                   </label>
//                   <input
//                     type="text"
//                     value={selected.productionUrl}
//                     onChange={(e) =>
//                       setSelected({ ...selected, productionUrl: e.target.value })
//                     }
//                     className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-red-500"
//                   />
//                 </div>

//                 <div className="md:col-span-2">
//                   <label className="block text-sm font-medium text-gray-600 mb-1">
//                     Play Store Link
//                   </label>
//                   <input
//                     type="text"
//                     value={selected.playStoreLink || ""}
//                     onChange={(e) =>
//                       setSelected({ ...selected, playStoreLink: e.target.value })
//                     }
//                     className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-red-500"
//                   />
//                 </div>

//                 <div className="md:col-span-2 flex justify-center mt-4">
//                   <button
//                     onClick={updateVersion}
//                     disabled={updating}
//                     className={`bg-red-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-700 transition-all ${
//                       updating ? "opacity-70 cursor-not-allowed" : ""
//                     }`}
//                   >
//                     {updating ? "Updating..." : "Save Changes"}
//                   </button>
//                 </div>
//               </div>
//             )}
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AppMangement;
