// AddTechnician.tsx
import React, { useState, useCallback, useEffect } from "react";
import { ArrowLeft, Eye, EyeOff, Plus } from "lucide-react";
import {
  getAllCategories,
  getAllPincodes,
  getPlans,
  registerTechByAdmin,
} from "../../api/apiMethods";
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
  areas: {
    _id: string;
    name: string;
    subAreas: { _id: string; name: string }[];
  }[];
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

interface FormErrors {
  username?: string;
  category?: string;
  phoneNumber?: string;
  password?: string;
  buildingName?: string;
  pincode?: string;
  areaName?: string;
  subAreaName?: string;
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

const NAME_REGEX = /^[A-Za-z ]+$/;
const PHONE_REGEX = /^[0-9]{10}$/;
const PASS_REGEX = /^[A-Za-z0-9@_#]{6,10}$/;

const isCtrlCombo = (e: React.KeyboardEvent<HTMLInputElement>) =>
  e.ctrlKey || e.metaKey || e.altKey;

const allowNameKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (isCtrlCombo(e)) return;
  const k = e.key;
  const allowed =
    /^[A-Za-z ]$/.test(k) ||
    [
      "Backspace",
      "Delete",
      "ArrowLeft",
      "ArrowRight",
      "Tab",
      "Home",
      "End",
    ].includes(k);
  if (!allowed) e.preventDefault();
};

const allowDigitKey = (
  e: React.KeyboardEvent<HTMLInputElement>,
  maxLen = 10
) => {
  if (isCtrlCombo(e)) return;
  const k = e.key;
  const target = e.target as HTMLInputElement;
  const isNav = [
    "Backspace",
    "Delete",
    "ArrowLeft",
    "ArrowRight",
    "Tab",
    "Home",
    "End",
  ].includes(k);
  if (isNav) return;
  if (!/^[0-9]$/.test(k)) {
    e.preventDefault();
    return;
  }
  const selection = (target.selectionEnd ?? 0) - (target.selectionStart ?? 0);
  if (target.value.length - selection >= maxLen) e.preventDefault();
};

const allowPasswordKey = (
  e: React.KeyboardEvent<HTMLInputElement>,
  maxLen = 10
) => {
  if (isCtrlCombo(e)) return;
  const k = e.key;
  const target = e.target as HTMLInputElement;
  const isNav = [
    "Backspace",
    "Delete",
    "ArrowLeft",
    "ArrowRight",
    "Tab",
    "Home",
    "End",
  ].includes(k);
  if (isNav) return;
  if (!/^[A-Za-z0-9@_#]$/.test(k)) {
    e.preventDefault();
    return;
  }
  const selection = (target.selectionEnd ?? 0) - (target.selectionStart ?? 0);
  if (target.value.length - selection >= maxLen) e.preventDefault();
};

const sanitizeName = (v: string) => v.replace(/[^A-Za-z ]+/g, "");
const sanitizePhone = (v: string) => v.replace(/[^0-9]+/g, "").slice(0, 10);
const sanitizePassword = (v: string) =>
  v.replace(/[^A-Za-z0-9@_#]+/g, "").slice(0, 10);

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

const fieldOrder: (keyof FormErrors)[] = [
  "username",
  "phoneNumber",
  "password",
  "buildingName",
  "pincode",
  "areaName",
  "subAreaName",
  "city",
  "state",
  "category",
  "subscriptionId",
  "description",
  "profileImage",
  "aadharFront",
  "aadharBack",
  "panCard",
  "authorizedPerson1Phone",
  "auth1Photo",
  "authorizedPerson2Phone",
  "auth2Photo",
  "general",
];

const AddTechnician: React.FC = () => {
  const navigate = useNavigate();

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
  const [subscriptionPlans, setSubscriptionPlans] = useState<
    SubscriptionPlan[]
  >([]);
  const [planLoading, setPlanLoading] = useState<boolean>(false);
  const [planError, setPlanError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [previews, setPreviews] = useState({
    profileImage: "",
    aadharFront: "",
    aadharBack: "",
    panCard: "",
    voterCard: "",
    auth1Photo: "",
    auth2Photo: "",
  });

  const steps = [
    "Personal Information",
    "Address Details",
    "Service & Subscription",
    "Documents",
  ];

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
    getPlans()
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
        setSubAreaOptions(
          selectedArea.subAreas.sort((a, b) =>
            a.name.toLowerCase().localeCompare(b.name.toLowerCase())
          )
        );
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

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name } = e.target;
      let value: string = (e.target as HTMLInputElement).value;

      if (name === "username") value = sanitizeName(value);
      if (
        name === "phoneNumber" ||
        name === "authorizedPerson1Phone" ||
        name === "authorizedPerson2Phone"
      )
        value = sanitizePhone(value);
      if (name === "password") value = sanitizePassword(value);

      setFormData((prev) => ({ ...prev, [name]: value }));
      if (name === "pincode") setSelectedPincode(value);
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    },
    []
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLInputElement>) => {
      const input = e.target as HTMLInputElement;
      const name = input.name as keyof TechnicianData;
      const pasted = e.clipboardData.getData("text");
      let clean = pasted;
      if (name === "username") clean = sanitizeName(pasted);
      if (
        name === "phoneNumber" ||
        name === "authorizedPerson1Phone" ||
        name === "authorizedPerson2Phone"
      )
        clean = sanitizePhone(pasted);
      if (name === "password") clean = sanitizePassword(pasted);
      e.preventDefault();
      setFormData((prev) => ({ ...prev, [name]: clean as any }));
    },
    []
  );

  const handleFileChange = useCallback(
    (name: keyof TechnicianData, file: File | null) => {
      setFormData((prev) => ({ ...prev, [name]: file }));
      setErrors((prev) => ({ ...prev, [name]: undefined }));

      const prevUrl = previews[name as keyof typeof previews];
      if (prevUrl) {
        URL.revokeObjectURL(prevUrl);
      }

      if (file) {
        const previewUrl = URL.createObjectURL(file);
        setPreviews((prev) => ({
          ...prev,
          [name as keyof typeof previews]: previewUrl,
        }));
      } else {
        setPreviews((prev) => ({
          ...prev,
          [name as keyof typeof previews]: "",
        }));
      }
    },
    [previews]
  );

  const scrollToFirstError = useCallback((err: FormErrors) => {
    const firstKey = fieldOrder.find((k) => err[k]);
    if (!firstKey) return;
    const el = document.getElementById(firstKey);
    if (el && el.scrollIntoView)
      el.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  const validateCurrentStep = useCallback((): FormErrors => {
    const f = formData;
    const e: FormErrors = {};
    switch (currentStep) {
      case 1:
        if (!f.username.trim() || !NAME_REGEX.test(f.username.trim()))
          e.username = "Only alphabets allowed";
        if (!PHONE_REGEX.test(f.phoneNumber))
          e.phoneNumber = "Enter 10-digit number";
        if (!PASS_REGEX.test(f.password))
          e.password = "6–10 chars: A–Z, 0–9, @ _ #";
        break;
      case 2:
        if (!f.buildingName.trim())
          e.buildingName = "Building name is required";
        if (!f.pincode) e.pincode = "Pincode is required";
        if (!f.areaName) e.areaName = "Area is required";
        // if (!f.subAreaName) e.subAreaName = "Sub Area is required";
        if (!f.city) e.city = "City is required";
        if (!f.state) e.state = "State is required";
        break;
      case 3:
        if (!f.category) e.category = "Service category is required";
        if (!f.subscriptionId)
          e.subscriptionId = "Subscription plan is required";
        break;
      case 4:
        if (!f.profileImage) e.profileImage = "Profile image is required";
        if (!f.aadharFront) e.aadharFront = "Aadhar front image is required";
        if (!f.aadharBack) e.aadharBack = "Aadhar back image is required";
        if (!f.panCard && !f.voterCard) e.panCard = "Provide Pan or Voter card";
        if (!PHONE_REGEX.test(f.authorizedPerson1Phone))
          e.authorizedPerson1Phone = "Enter 10-digit number";
        if (!f.auth1Photo) e.auth1Photo = "Photo is required";
        if (!PHONE_REGEX.test(f.authorizedPerson2Phone))
          e.authorizedPerson2Phone = "Enter 10-digit number";
        if (!f.auth2Photo) e.auth2Photo = "Photo is required";
        break;
    }
    return e;
  }, [formData, currentStep]);

  const nextStep = useCallback(() => {
    const stepErrors = validateCurrentStep();
    setErrors(stepErrors);
    if (Object.keys(stepErrors).length === 0) {
      setCurrentStep((prev) => prev + 1);
    } else {
      scrollToFirstError(stepErrors);
    }
  }, [validateCurrentStep, scrollToFirstError]);

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => prev - 1);
  }, []);

  const validateForm = useCallback((): FormErrors => {
    const f = formData;
    const e: FormErrors = {};
    if (!f.username.trim() || !NAME_REGEX.test(f.username.trim()))
      e.username = "Only alphabets allowed";
    if (!f.category) e.category = "Service category is required";
    if (!PHONE_REGEX.test(f.phoneNumber))
      e.phoneNumber = "Enter 10-digit number";
    if (!PASS_REGEX.test(f.password))
      e.password = "6–10 chars: A–Z, 0–9, @ _ #";
    if (!f.buildingName.trim()) e.buildingName = "Building name is required";
    if (!f.pincode || f.pincode.length !== 6) e.pincode = "Pincode is required";
    if (!f.areaName) e.areaName = "Area is required";
    // if (!f.subAreaName) e.subAreaName = "Sub Area is required";
    if (!f.city) e.city = "City is required";
    if (!f.state) e.state = "State is required";
    if (!f.subscriptionId) e.subscriptionId = "Subscription plan is required";
    if (
      !f.authorizedPerson1Phone ||
      !PHONE_REGEX.test(f.authorizedPerson1Phone)
    )
      e.authorizedPerson1Phone = "Enter 10-digit number";
    if (!f.auth1Photo) e.auth1Photo = "Photo is required";
    if (
      !f.authorizedPerson2Phone ||
      !PHONE_REGEX.test(f.authorizedPerson2Phone)
    )
      e.authorizedPerson2Phone = "Enter 10-digit number";
    if (!f.auth2Photo) e.auth2Photo = "Photo is required";
    if (!f.aadharFront) e.aadharFront = "Aadhar front image is required";
    if (!f.aadharBack) e.aadharBack = "Aadhar back image is required";
    if (!f.panCard && !f.voterCard) e.panCard = "Provide Pan or Voter card";
    return e;
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      scrollToFirstError(validationErrors);
      // Jump to step with errors if any
      if (
        validationErrors.username ||
        validationErrors.phoneNumber ||
        validationErrors.password
      ) {
        setCurrentStep(1);
      } else if (
        validationErrors.buildingName ||
        validationErrors.pincode ||
        validationErrors.areaName ||
        validationErrors.subAreaName ||
        validationErrors.city ||
        validationErrors.state
      ) {
        setCurrentStep(2);
      } else if (validationErrors.category || validationErrors.subscriptionId) {
        setCurrentStep(3);
      } else {
        setCurrentStep(4);
      }
      return;
    }

    setLoading(true);
    try {
      const createFormData = new FormData();
      createFormData.append("username", formData.username);
      createFormData.append("category", formData.category);
      createFormData.append("phoneNumber", formData.phoneNumber);
      createFormData.append("password", formData.password);
      createFormData.append("buildingName", formData.buildingName);
      createFormData.append("areaName", formData.areaName);
      createFormData.append("subAreaName", formData.subAreaName || "-");
      createFormData.append("city", formData.city);
      createFormData.append("state", formData.state);
      createFormData.append("pincode", formData.pincode);
      createFormData.append("subscriptionId", formData.subscriptionId);
      createFormData.append("description", formData.description);
      createFormData.append(
        "authorizedPersons[0][phone]",
        formData.authorizedPerson1Phone
      );
      if (formData.auth1Photo) {
        createFormData.append("auth1Photo", formData.auth1Photo);
      }
      createFormData.append(
        "authorizedPersons[1][phone]",
        formData.authorizedPerson2Phone
      );
      if (formData.auth2Photo) {
        createFormData.append("auth2Photo", formData.auth2Photo);
      }
      if (formData.profileImage) {
        createFormData.append("profileImage", formData.profileImage);
      }
      if (formData.aadharFront) {
        createFormData.append("aadharFront", formData.aadharFront);
      }
      if (formData.aadharBack) {
        createFormData.append("aadharBack", formData.aadharBack);
      }
      if (formData.panCard) {
        createFormData.append("panCard", formData.panCard);
      }
      if (formData.voterCard) {
        createFormData.append("voterCard", formData.voterCard);
      }
      const response = await registerTechByAdmin(createFormData);
      if (!response || !response.success) {
        setErrors({
          general: "Failed to add technician.",
        });
        scrollToFirstError({ general: "Failed to add technician." });
      } else {
        alert("Technician added successfully!");
        navigate("/management/technicians");
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      const errMsg = "Something went wrong";
      setErrors({
        general: errMsg,
      });
      scrollToFirstError({ general: errMsg });
      console.error("Error adding technician:", error);
    }
  };

  const nameInputProps = {
    pattern: "[A-Za-z ]+",
    maxLength: 60,
    onKeyDown: allowNameKey,
    onPaste: handlePaste,
    placeholder: "Enter technician name",
  };

  const phoneInputProps = {
    inputMode: "numeric" as const,
    pattern: "[0-9]{10}",
    maxLength: 10,
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) =>
      allowDigitKey(e, 10),
    onPaste: handlePaste,
    placeholder: "Enter 10-digit mobile number",
  };

  const passwordInputProps = {
    pattern: "[A-Za-z0-9@_#]{6,10}",
    minLength: 6,
    maxLength: 10,
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) =>
      allowPasswordKey(e, 10),
    onPaste: handlePaste,
    placeholder: "6–10 (A–Z, 0–9, @ _ #)",
  };

  const IconComponent = Plus;
  const title = "Add Technician";
  const submitText = "Add";

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

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-blue-700 px-6 py-4">
            <h2 className="text-lg font-semibold text-white">
              Technician Information
            </h2>
          </div>

          <div className="mb-4 p-6">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / steps.length) * 100}%` }}
              ></div>
            </div>
          </div>

          <h3 className="text-lg font-medium mb-4 p-6 text-center">
            Step {currentStep} of {steps.length}: {steps[currentStep - 1]}
          </h3>

          <form onSubmit={handleSubmit} className="p-6 space-y-6" noValidate>
            {errors.general && (
              <div
                id="general"
                className="text-red-600 text-sm text-center bg-red-50 p-2 rounded"
              >
                {errors.general}
              </div>
            )}

            {currentStep === 1 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Technician Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      value={formData.username}
                      onChange={handleChange}
                      {...nameInputProps}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      required
                      aria-describedby={
                        errors.username ? "username-error" : undefined
                      }
                    />
                    {errors.username && (
                      <div
                        id="username-error"
                        className="text-red-500 text-xs mt-1"
                      >
                        {errors.username}
                      </div>
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
                        id="phoneNumber"
                        name="phoneNumber"
                        type="tel"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        {...phoneInputProps}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        required
                        aria-describedby={
                          errors.phoneNumber ? "phoneNumber-error" : undefined
                        }
                      />
                    </div>
                    {errors.phoneNumber && (
                      <div
                        id="phoneNumber-error"
                        className="text-red-500 text-xs mt-1"
                      >
                        {errors.phoneNumber}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      {...passwordInputProps}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pr-10"
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
                    <div
                      id="password-error"
                      className="text-red-500 text-xs mt-1"
                    >
                      {errors.password}
                    </div>
                  )}
                </div>
              </>
            )}

            {currentStep === 2 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Building Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="buildingName"
                      name="buildingName"
                      type="text"
                      value={formData.buildingName}
                      onChange={handleChange}
                      placeholder="Enter building name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      required
                      aria-describedby={
                        errors.buildingName ? "buildingName-error" : undefined
                      }
                    />
                    {errors.buildingName && (
                      <div
                        id="buildingName-error"
                        className="text-red-500 text-xs mt-1"
                      >
                        {errors.buildingName}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Years in Service
                    </label>
                    <input
                      id="description"
                      name="description"
                      type="text"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Enter years in service"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Pincode <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="pincode"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
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
                      <div
                        id="pincode-error"
                        className="text-red-500 text-xs mt-1"
                      >
                        {errors.pincode}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Area <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="areaName"
                      name="areaName"
                      value={formData.areaName}
                      onChange={handleChange}
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
                      <div
                        id="areaName-error"
                        className="text-red-500 text-xs mt-1"
                      >
                        {errors.areaName}
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Sub Area <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="subAreaName"
                      name="subAreaName"
                      value={formData.subAreaName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100"
                      // required
                      disabled={!formData.areaName}
                    >
                      <option value="">Select Sub Area</option>
                      {subAreaOptions.map((a) => (
                        <option key={a._id} value={a.name}>
                          {a.name}
                        </option>
                      ))}
                    </select>
                    {errors.subAreaName && (
                      <div
                        id="subAreaName-error"
                        className="text-red-500 text-xs mt-1"
                      >
                        {errors.subAreaName}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      City <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
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
                              pincodeData.find(
                                (p) => p.code === selectedPincode
                              )?.city
                            }
                          >
                            {
                              pincodeData.find(
                                (p) => p.code === selectedPincode
                              )?.city
                            }
                          </option>
                        )}
                    </select>
                    {errors.city && (
                      <div
                        id="city-error"
                        className="text-red-500 text-xs mt-1"
                      >
                        {errors.city}
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      State <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100"
                      required
                      disabled={!selectedPincode}
                      aria-describedby={
                        errors.state ? "state-error" : undefined
                      }
                    >
                      <option value="" disabled>
                        Select State
                      </option>
                      {selectedPincode &&
                        pincodeData.find((p) => p.code === selectedPincode) && (
                          <option
                            value={
                              pincodeData.find(
                                (p) => p.code === selectedPincode
                              )?.state
                            }
                          >
                            {
                              pincodeData.find(
                                (p) => p.code === selectedPincode
                              )?.state
                            }
                          </option>
                        )}
                    </select>
                    {errors.state && (
                      <div
                        id="state-error"
                        className="text-red-500 text-xs mt-1"
                      >
                        {errors.state}
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {currentStep === 3 && (
              <>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    required
                    disabled={catLoading}
                    aria-describedby={
                      errors.category ? "category-error" : undefined
                    }
                  >
                    <option value="" disabled>
                      {catLoading
                        ? "Loading categories..."
                        : "Select a category"}
                    </option>
                    {apiCategories
                      .sort((a, b) =>
                        a.category_name
                          .toLowerCase()
                          .localeCompare(b.category_name.toLowerCase())
                      )
                      .map((item) => (
                        <option key={item._id} value={item._id}>
                          {item.category_name}
                        </option>
                      ))}
                  </select>
                  {catError && (
                    <div className="text-red-500 text-xs mt-1">{catError}</div>
                  )}
                  {errors.category && (
                    <div
                      id="category-error"
                      className="text-red-500 text-xs mt-1"
                    >
                      {errors.category}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Subscription Plan <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="subscriptionId"
                    name="subscriptionId"
                    value={formData.subscriptionId}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    required
                    disabled={planLoading || subscriptionPlans.length === 0}
                    aria-describedby={
                      errors.subscriptionId ? "subscriptionId-error" : undefined
                    }
                  >
                    <option value="" disabled>
                      {planLoading
                        ? "Loading plans..."
                        : subscriptionPlans.length === 0
                        ? "No plans available"
                        : "Select Subscription Plan"}
                    </option>
                    {subscriptionPlans
                      .filter((plan) => plan.isActive)
                      .map((plan) => (
                        <option key={plan._id} value={plan._id}>
                          {plan.name} - ₹{plan.finalPrice} ({plan.price} +{" "}
                          {plan.gst} GST)
                        </option>
                      ))}
                  </select>
                  {planError && (
                    <div className="text-red-500 text-xs mt-1">{planError}</div>
                  )}
                  {errors.subscriptionId && (
                    <div
                      id="subscriptionId-error"
                      className="text-red-500 text-xs mt-1"
                    >
                      {errors.subscriptionId}
                    </div>
                  )}
                </div>
              </>
            )}

            {currentStep === 4 && (
              <>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Profile Image <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="profileImage"
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleFileChange(
                        "profileImage",
                        e.target.files?.[0] || null
                      )
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                  {formData.profileImage && (
                    <p className="text-sm text-gray-600">
                      Selected: {formData.profileImage.name}
                    </p>
                  )}
                  {previews.profileImage && (
                    <img
                      src={previews.profileImage}
                      alt="Profile Preview"
                      className="mt-2 w-32 h-32 rounded-full object-cover border border-gray-300"
                    />
                  )}
                  {errors.profileImage && (
                    <div
                      id="profileImage-error"
                      className="text-red-500 text-xs mt-1"
                    >
                      {errors.profileImage}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Aadhar Front <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="aadharFront"
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleFileChange(
                          "aadharFront",
                          e.target.files?.[0] || null
                        )
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                    {formData.aadharFront && (
                      <p className="text-sm text-gray-600">
                        Selected: {formData.aadharFront.name}
                      </p>
                    )}
                    {previews.aadharFront && (
                      <img
                        src={previews.aadharFront}
                        alt="Aadhar Front Preview"
                        className="mt-2 max-w-xs h-32 object-cover rounded-lg border border-gray-300"
                      />
                    )}
                    {errors.aadharFront && (
                      <div
                        id="aadharFront-error"
                        className="text-red-500 text-xs mt-1"
                      >
                        {errors.aadharFront}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Aadhar Back <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="aadharBack"
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleFileChange(
                          "aadharBack",
                          e.target.files?.[0] || null
                        )
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                    {formData.aadharBack && (
                      <p className="text-sm text-gray-600">
                        Selected: {formData.aadharBack.name}
                      </p>
                    )}
                    {previews.aadharBack && (
                      <img
                        src={previews.aadharBack}
                        alt="Aadhar Back Preview"
                        className="mt-2 max-w-xs h-32 object-cover rounded-lg border border-gray-300"
                      />
                    )}
                    {errors.aadharBack && (
                      <div
                        id="aadharBack-error"
                        className="text-red-500 text-xs mt-1"
                      >
                        {errors.aadharBack}
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Pan Card (At least one of Pan or Voter Card required){" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="panCard"
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleFileChange("panCard", e.target.files?.[0] || null)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                    {formData.panCard && (
                      <p className="text-sm text-gray-600">
                        Selected: {formData.panCard.name}
                      </p>
                    )}
                    {previews.panCard && (
                      <img
                        src={previews.panCard}
                        alt="Pan Card Preview"
                        className="mt-2 max-w-xs h-32 object-cover rounded-lg border border-gray-300"
                      />
                    )}
                    {errors.panCard && (
                      <div
                        id="panCard-error"
                        className="text-red-500 text-xs mt-1"
                      >
                        {errors.panCard}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Voter Card (Alternative to Pan Card)
                    </label>
                    <input
                      id="voterCard"
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleFileChange(
                          "voterCard",
                          e.target.files?.[0] || null
                        )
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                    {formData.voterCard && (
                      <p className="text-sm text-gray-600">
                        Selected: {formData.voterCard.name}
                      </p>
                    )}
                    {previews.voterCard && (
                      <img
                        src={previews.voterCard}
                        alt="Voter Card Preview"
                        className="mt-2 max-w-xs h-32 object-cover rounded-lg border border-gray-300"
                      />
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Authorized Person 1 Phone{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 py-3 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm rounded-l-lg">
                        🇮🇳 +91
                      </span>
                      <input
                        id="authorizedPerson1Phone"
                        name="authorizedPerson1Phone"
                        type="tel"
                        value={formData.authorizedPerson1Phone}
                        onChange={handleChange}
                        {...phoneInputProps}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        required
                        aria-describedby={
                          errors.authorizedPerson1Phone
                            ? "authorizedPerson1Phone-error"
                            : undefined
                        }
                      />
                    </div>
                    {errors.authorizedPerson1Phone && (
                      <div
                        id="authorizedPerson1Phone-error"
                        className="text-red-500 text-xs mt-1"
                      >
                        {errors.authorizedPerson1Phone}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Authorized Person 1 Photo{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="auth1Photo"
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleFileChange(
                          "auth1Photo",
                          e.target.files?.[0] || null
                        )
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                    {formData.auth1Photo && (
                      <p className="text-sm text-gray-600">
                        Selected: {formData.auth1Photo.name}
                      </p>
                    )}
                    {previews.auth1Photo && (
                      <img
                        src={previews.auth1Photo}
                        alt="Authorized Person 1 Photo Preview"
                        className="mt-2 max-w-xs h-32 object-cover rounded-lg border border-gray-300"
                      />
                    )}
                    {errors.auth1Photo && (
                      <div
                        id="auth1Photo-error"
                        className="text-red-500 text-xs mt-1"
                      >
                        {errors.auth1Photo}
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Authorized Person 2 Phone{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 py-3 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm rounded-l-lg">
                        🇮🇳 +91
                      </span>
                      <input
                        id="authorizedPerson2Phone"
                        name="authorizedPerson2Phone"
                        type="tel"
                        value={formData.authorizedPerson2Phone}
                        onChange={handleChange}
                        {...phoneInputProps}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        required
                        aria-describedby={
                          errors.authorizedPerson2Phone
                            ? "authorizedPerson2Phone-error"
                            : undefined
                        }
                      />
                    </div>
                    {errors.authorizedPerson2Phone && (
                      <div
                        id="authorizedPerson2Phone-error"
                        className="text-red-500 text-xs mt-1"
                      >
                        {errors.authorizedPerson2Phone}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Authorized Person 2 Photo{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="auth2Photo"
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleFileChange(
                          "auth2Photo",
                          e.target.files?.[0] || null
                        )
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                    {formData.auth2Photo && (
                      <p className="text-sm text-gray-600">
                        Selected: {formData.auth2Photo.name}
                      </p>
                    )}
                    {previews.auth2Photo && (
                      <img
                        src={previews.auth2Photo}
                        alt="Authorized Person 2 Photo Preview"
                        className="mt-2 max-w-xs h-32 object-cover rounded-lg border border-gray-300"
                      />
                    )}
                    {errors.auth2Photo && (
                      <div
                        id="auth2Photo-error"
                        className="text-red-500 text-xs mt-1"
                      >
                        {errors.auth2Photo}
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
              <button
                type="button"
                onClick={() => {
                  if (
                    window.confirm(
                      "Are you sure you want to cancel? Unsaved changes will be lost."
                    )
                  ) {
                    navigate("/management/technicians");
                  }
                }}
                className="w-full sm:w-auto px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                disabled={loading}
              >
                Cancel
              </button>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    disabled={loading}
                    className="w-full sm:w-auto px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all duration-200 disabled:opacity-50"
                  >
                    Previous
                  </button>
                )}
                {currentStep < steps.length ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={loading}
                    className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 disabled:opacity-50"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
                    disabled={loading}
                  >
                    {loading ? "Processing..." : submitText}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddTechnician;
// // AddTechnician.tsx
// import React, { useState, useCallback, useEffect } from "react";
// import { ArrowLeft, Eye, EyeOff, Plus } from "lucide-react";
// import { getAllCategories, getAllPincodes, getPlans, registerTechByAdmin } from "../../api/apiMethods";
// import { useNavigate } from "react-router-dom";

// interface TechnicianData {
//   username: string;
//   category: string;
//   phoneNumber: string;
//   password: string;
//   buildingName: string;
//   areaName: string;
//   subAreaName: string;
//   city: string;
//   state: string;
//   pincode: string;
//   subscriptionId: string;
//   description: string;
//   authorizedPerson1Phone: string;
//   authorizedPerson2Phone: string;
//   profileImage?: File | null;
//   aadharFront?: File | null;
//   aadharBack?: File | null;
//   panCard?: File | null;
//   voterCard?: File | null;
//   auth1Photo?: File | null;
//   auth2Photo?: File | null;
// }

// interface PincodeData {
//   _id: string;
//   code: string;
//   city: string;
//   state: string;
//   areas: { _id: string; name: string; subAreas: { _id: string; name: string }[] }[];
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
//   description?: string;
//   authorizedPerson1Phone?: string;
//   authorizedPerson2Phone?: string;
//   profileImage?: string;
//   aadharFront?: string;
//   aadharBack?: string;
//   panCard?: string;
//   voterCard?: string;
//   auth1Photo?: string;
//   auth2Photo?: string;
//   general?: string;
// }

// const initialFormState: TechnicianData = {
//   username: "",
//   category: "",
//   phoneNumber: "",
//   password: "",
//   buildingName: "",
//   areaName: "",
//   subAreaName: "",
//   city: "",
//   state: "",
//   pincode: "",
//   subscriptionId: "",
//   description: "",
//   authorizedPerson1Phone: "",
//   authorizedPerson2Phone: "",
//   profileImage: null,
//   aadharFront: null,
//   aadharBack: null,
//   panCard: null,
//   voterCard: null,
//   auth1Photo: null,
//   auth2Photo: null,
// };

// const AddTechnician: React.FC = () => {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState<TechnicianData>(initialFormState);
//   const [errors, setErrors] = useState<FormErrors>({});
//   const [loading, setLoading] = useState<boolean>(false);
//   const [apiCategories, setApiCategories] = useState<
//     { _id: string; category_name: string; status: number }[]
//   >([]);
//   const [catLoading, setCatLoading] = useState<boolean>(false);
//   const [catError, setCatError] = useState<string | null>(null);
//   const [pincodeData, setPincodeData] = useState<PincodeData[]>([]);
//   const [selectedPincode, setSelectedPincode] = useState<string>("");
//   const [areaOptions, setAreaOptions] = useState<
//     { _id: string; name: string; subAreas: { _id: string; name: string }[] }[]
//   >([]);
//   const [subAreaOptions, setSubAreaOptions] = useState<
//     { _id: string; name: string }[]
//   >([]);
//   const [showPassword, setShowPassword] = useState(false);
//   const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>([]);
//   const [planLoading, setPlanLoading] = useState<boolean>(false);
//   const [planError, setPlanError] = useState<string | null>(null);
//   const [currentStep, setCurrentStep] = useState<number>(1);
//   const [previews, setPreviews] = useState({
//     profileImage: '',
//     aadharFront: '',
//     aadharBack: '',
//     panCard: '',
//     voterCard: '',
//     auth1Photo: '',
//     auth2Photo: '',
//   });

//   const steps = ["Personal Information", "Address Details", "Service & Subscription", "Documents"];

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
//     setCatLoading(true);
//     getAllCategories(null)
//       .then((res: any) => {
//         if (Array.isArray(res?.data)) {
//           setApiCategories(res.data);
//         } else {
//           setApiCategories([]);
//           setCatError("Failed to load categories");
//         }
//       })
//       .catch(() => {
//         setApiCategories([]);
//         setCatError("Failed to load categories");
//       })
//       .finally(() => setCatLoading(false));
//   }, []);

//   useEffect(() => {
//     setPlanLoading(true);
//     getPlans()
//       .then((res: any) => {
//         if (Array.isArray(res?.data)) {
//           setSubscriptionPlans(res.data);
//         } else {
//           setSubscriptionPlans([]);
//           setPlanError("Failed to load subscription plans");
//         }
//       })
//       .catch(() => {
//         setSubscriptionPlans([]);
//         setPlanError("Failed to load subscription plans");
//       })
//       .finally(() => setPlanLoading(false));
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

//   useEffect(() => {
//     if (formData.areaName) {
//       const selectedArea = areaOptions.find(
//         (a) => a.name === formData.areaName
//       );
//       if (selectedArea && selectedArea.subAreas) {
//         setSubAreaOptions(selectedArea.subAreas.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase())));
//       } else {
//         setSubAreaOptions([]);
//       }
//       setFormData((prev) => ({ ...prev, subAreaName: "" }));
//     }
//   }, [formData.areaName, areaOptions]);

//   // Cleanup preview URLs on unmount
//   useEffect(() => {
//     return () => {
//       Object.values(previews).forEach((url) => {
//         if (url) {
//           URL.revokeObjectURL(url);
//         }
//       });
//     };
//   }, [previews]);

//   const validateCurrentStep = useCallback((): FormErrors => {
//     const newErrors: FormErrors = {};
//     switch (currentStep) {
//       case 1:
//         if (!formData.username.trim()) newErrors.username = "Technician Name is required.";
//         if (!formData.phoneNumber || !/^\d{10}$/.test(formData.phoneNumber)) {
//           newErrors.phoneNumber = "Phone number must be exactly 10 digits.";
//         }
//         if (!formData.password || formData.password.length < 6 || formData.password.length > 10) {
//           newErrors.password = "Password must be 6-10 characters.";
//         }
//         break;
//       case 2:
//         if (!formData.buildingName.trim()) {
//           newErrors.buildingName = "Building name is required.";
//         }
//         if (!formData.pincode || formData.pincode.length !== 6) {
//           newErrors.pincode = "Pincode must be exactly 6 digits.";
//         }
//         if (!formData.areaName) {
//           newErrors.areaName = "Area is required.";
//         }
//         if (!formData.city) {
//           newErrors.city = "City is required.";
//         }
//         if (!formData.state) {
//           newErrors.state = "State is required.";
//         }
//         break;
//       case 3:
//         if (!formData.category) {
//           newErrors.category = "Category is required.";
//         }
//         if (!formData.subscriptionId) {
//           newErrors.subscriptionId = "Subscription Plan is required.";
//         }
//         break;
//       case 4:
//         if (!formData.aadharFront || formData.aadharFront.size === 0) {
//           newErrors.aadharFront = "Aadhar front image is required.";
//         }
//         if (!formData.aadharBack || formData.aadharBack.size === 0) {
//           newErrors.aadharBack = "Aadhar back image is required.";
//         }
//         if (!formData.panCard && !formData.voterCard) {
//           newErrors.panCard = "At least one of Pan Card or Voter Card is required.";
//         }
//         if (!formData.authorizedPerson1Phone || !/^\d{10}$/.test(formData.authorizedPerson1Phone)) {
//           newErrors.authorizedPerson1Phone = "Authorized Person 1 phone must be exactly 10 digits.";
//         }
//         if (!formData.auth1Photo || formData.auth1Photo.size === 0) {
//           newErrors.auth1Photo = "Authorized Person 1 photo is required.";
//         }
//         if (!formData.authorizedPerson2Phone || !/^\d{10}$/.test(formData.authorizedPerson2Phone)) {
//           newErrors.authorizedPerson2Phone = "Authorized Person 2 phone must be exactly 10 digits.";
//         }
//         if (!formData.auth2Photo || formData.auth2Photo.size === 0) {
//           newErrors.auth2Photo = "Authorized Person 2 photo is required.";
//         }
//         break;
//     }
//     return newErrors;
//   }, [formData, currentStep]);

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

//   const handleFileChange = useCallback((name: keyof TechnicianData, file: File | null) => {
//     setFormData((prev) => ({ ...prev, [name]: file }));
//     setErrors((prev) => ({ ...prev, [name]: undefined }));

//     const prevUrl = previews[name as keyof typeof previews];
//     if (prevUrl) {
//       URL.revokeObjectURL(prevUrl);
//     }

//     if (file) {
//       const previewUrl = URL.createObjectURL(file);
//       setPreviews((prev) => ({ ...prev, [name as keyof typeof previews]: previewUrl }));
//     } else {
//       setPreviews((prev) => ({ ...prev, [name as keyof typeof previews]: '' }));
//     }
//   }, [previews]);

//   const nextStep = useCallback(() => {
//     const stepErrors = validateCurrentStep();
//     setErrors(stepErrors);
//     if (Object.keys(stepErrors).length === 0) {
//       setCurrentStep((prev) => prev + 1);
//     }
//   }, [validateCurrentStep]);

//   const prevStep = useCallback(() => {
//     setCurrentStep((prev) => prev - 1);
//   }, []);

//   const validateForm = useCallback((): FormErrors => {
//     const newErrors: FormErrors = {};
//     // Common fields
//     if (!formData.username.trim()) {
//       newErrors.username = "Technician Name is required.";
//     }
//     if (!formData.category) {
//       newErrors.category = "Category is required.";
//     }
//     if (!formData.phoneNumber || !/^\d{10}$/.test(formData.phoneNumber)) {
//       newErrors.phoneNumber = "Phone number must be exactly 10 digits.";
//     }
//     if (!formData.password || formData.password.length < 6 || formData.password.length > 10) {
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
//     if (!formData.subscriptionId) {
//       newErrors.subscriptionId = "Subscription Plan is required.";
//     }
//     // Creation fields
//     if (!formData.authorizedPerson1Phone || !/^\d{10}$/.test(formData.authorizedPerson1Phone)) {
//       newErrors.authorizedPerson1Phone = "Authorized Person 1 phone must be exactly 10 digits.";
//     }
//     if (!formData.auth1Photo || formData.auth1Photo?.size === 0) {
//       newErrors.auth1Photo = "Authorized Person 1 photo is required.";
//     }
//     if (!formData.authorizedPerson2Phone || !/^\d{10}$/.test(formData.authorizedPerson2Phone)) {
//       newErrors.authorizedPerson2Phone = "Authorized Person 2 phone must be exactly 10 digits.";
//     }
//     if (!formData.auth2Photo || formData.auth2Photo?.size === 0) {
//       newErrors.auth2Photo = "Authorized Person 2 photo is required.";
//     }
//     if (!formData.aadharFront || formData.aadharFront?.size === 0) {
//       newErrors.aadharFront = "Aadhar front image is required.";
//     }
//     if (!formData.aadharBack || formData.aadharBack?.size === 0) {
//       newErrors.aadharBack = "Aadhar back image is required.";
//     }
//     if (!formData.panCard && !formData.voterCard) {
//       newErrors.panCard = "At least one of Pan Card or Voter Card is required.";
//     }
//     return newErrors;
//   }, [formData]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const validationErrors = validateForm();
//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       // Jump to step with errors if any
//       if (validationErrors.username || validationErrors.phoneNumber || validationErrors.password) {
//         setCurrentStep(1);
//       } else if (validationErrors.buildingName || validationErrors.pincode || validationErrors.areaName || validationErrors.city || validationErrors.state) {
//         setCurrentStep(2);
//       } else if (validationErrors.category || validationErrors.subscriptionId) {
//         setCurrentStep(3);
//       } else {
//         setCurrentStep(4);
//       }
//       return;
//     }

//     setLoading(true);
//     try {
//       const createFormData = new FormData();
//       createFormData.append("username", formData.username);
//       createFormData.append("category", formData.category);
//       createFormData.append("phoneNumber", formData.phoneNumber);
//       createFormData.append("password", formData.password);
//       createFormData.append("buildingName", formData.buildingName);
//       createFormData.append("areaName", formData.areaName);
//       createFormData.append("subAreaName", formData.subAreaName || "-");
//       createFormData.append("city", formData.city);
//       createFormData.append("state", formData.state);
//       createFormData.append("pincode", formData.pincode);
//       createFormData.append("subscriptionId", formData.subscriptionId);
//       createFormData.append("description", formData.description);
//       createFormData.append("authorizedPersons[0][phone]", formData.authorizedPerson1Phone);
//       if (formData.auth1Photo) {
//         createFormData.append("auth1Photo", formData.auth1Photo);
//       }
//       createFormData.append("authorizedPersons[1][phone]", formData.authorizedPerson2Phone);
//       if (formData.auth2Photo) {
//         createFormData.append("auth2Photo", formData.auth2Photo);
//       }
//       if (formData.profileImage) {
//         createFormData.append("profileImage", formData.profileImage);
//       }
//       if (formData.aadharFront) {
//         createFormData.append("aadharFront", formData.aadharFront);
//       }
//       if (formData.aadharBack) {
//         createFormData.append("aadharBack", formData.aadharBack);
//       }
//       if (formData.panCard) {
//         createFormData.append("panCard", formData.panCard);
//       }
//       if (formData.voterCard) {
//         createFormData.append("voterCard", formData.voterCard);
//       }
//       const response = await registerTechByAdmin(createFormData);
//       if (!response || !response.success) {
//         alert("Failed to add technician.");
//       } else {
//         alert("Technician added successfully!");
//       }
//       setLoading(false);
//       navigate("/management/technicians");
//     } catch (error) {
//       setLoading(false);
//       alert("Something went wrong");
//       console.error("Error adding technician:", error);
//       setErrors({
//         general: "An error occurred while submitting the form.",
//       });
//     }
//   };

//   const IconComponent = Plus;
//   const title = "Add Technician";
//   const submitText = "Add";
//   const passwordPlaceholder = "6-10 characters";
//   const passwordRequired = true;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
//       <div className="max-w-4xl mx-auto">
//         {/* Header */}
//         <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
//           <div className="flex items-center gap-3">
//             <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
//               <IconComponent className="h-6 w-6 text-white" />
//             </div>
//             <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
//               {title}
//             </h1>
//           </div>
//           <button
//             onClick={() => navigate("/management/technicians")}
//             className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
//           >
//             <ArrowLeft className="h-4 w-4 mr-2" />
//             Back
//           </button>
//         </div>

//         <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
//           <div className="bg-gradient-to-r from-blue-500 to-blue-700 px-6 py-4">
//             <h2 className="text-lg font-semibold text-white">
//               Technician Information
//             </h2>
//           </div>

//           <div className="mb-4 p-6">
//             <div className="w-full bg-gray-200 rounded-full h-2">
//               <div
//                 className="bg-blue-600 h-2 rounded-full transition-all duration-300"
//                 style={{ width: `${(currentStep / steps.length) * 100}%` }}
//               ></div>
//             </div>
//           </div>

//           <h3 className="text-lg font-medium mb-4 p-6 text-center">
//             Step {currentStep} of {steps.length}: {steps[currentStep - 1]}
//           </h3>

//           <form onSubmit={handleSubmit} className="p-6 space-y-6">
//             {errors.general && (
//               <div className="text-red-600 text-sm text-center bg-red-50 p-2 rounded">
//                 {errors.general}
//               </div>
//             )}

//             {currentStep === 1 && (
//               <>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div className="space-y-2">
//                     <label className="block text-sm font-medium text-gray-700">
//                       Technician Name <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="text"
//                       name="username"
//                       value={formData.username}
//                       onChange={handleInputChange}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                       placeholder="Enter technician name"
//                       required
//                       aria-describedby={
//                         errors.username ? "username-error" : undefined
//                       }
//                     />
//                     {errors.username && (
//                       <p id="username-error" className="text-red-500 text-sm">
//                         {errors.username}
//                       </p>
//                     )}
//                   </div>

//                   <div className="space-y-2">
//                     <label className="block text-sm font-medium text-gray-700">
//                       Mobile Number <span className="text-red-500">*</span>
//                     </label>
//                     <div className="flex">
//                       <span className="inline-flex items-center px-3 py-3 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm rounded-l-lg">
//                         🇮🇳 +91
//                       </span>
//                       <input
//                         type="tel"
//                         name="phoneNumber"
//                         value={formData.phoneNumber}
//                         onChange={handleInputChange}
//                         className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                         placeholder="Enter 10-digit mobile number"
//                         pattern="[0-9]{10}"
//                         required
//                         aria-describedby={
//                           errors.phoneNumber ? "phoneNumber-error" : undefined
//                         }
//                       />
//                     </div>
//                     {errors.phoneNumber && (
//                       <p id="phoneNumber-error" className="text-red-500 text-sm">
//                         {errors.phoneNumber}
//                       </p>
//                     )}
//                   </div>
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
//                       placeholder={passwordPlaceholder}
//                       minLength={6}
//                       maxLength={10}
//                       required={passwordRequired}
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
//               </>
//             )}

//             {currentStep === 2 && (
//               <>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div className="space-y-2">
//                     <label className="block text-sm font-medium text-gray-700">
//                       Building Name <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="text"
//                       name="buildingName"
//                       value={formData.buildingName}
//                       onChange={handleInputChange}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                       placeholder="Enter building name"
//                       required
//                       aria-describedby={
//                         errors.buildingName ? "buildingName-error" : undefined
//                       }
//                     />
//                     {errors.buildingName && (
//                       <p id="buildingName-error" className="text-red-500 text-sm">
//                         {errors.buildingName}
//                       </p>
//                     )}
//                   </div>

//                   <div className="space-y-2">
//                     <label className="block text-sm font-medium text-gray-700">
//                       Years in Service
//                     </label>
//                     <input
//                       type="text"
//                       name="description"
//                       value={formData.description}
//                       onChange={handleInputChange}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                       placeholder="Enter years in service"
//                     />
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div className="space-y-2">
//                     <label className="block text-sm font-medium text-gray-700">
//                       Pincode <span className="text-red-500">*</span>
//                     </label>
//                     <select
//                       name="pincode"
//                       value={formData.pincode}
//                       onChange={handleInputChange}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                       required
//                       aria-describedby={
//                         errors.pincode ? "pincode-error" : undefined
//                       }
//                     >
//                       <option value="" disabled>
//                         Select Pincode
//                       </option>
//                       {pincodeData
//                         .sort((a, b) => Number(a.code) - Number(b.code))
//                         .map((p) => (
//                           <option key={p._id} value={p.code}>
//                             {p.code}
//                           </option>
//                         ))}
//                     </select>
//                     {errors.pincode && (
//                       <p id="pincode-error" className="text-red-500 text-sm">
//                         {errors.pincode}
//                       </p>
//                     )}
//                   </div>

//                   <div className="space-y-2">
//                     <label className="block text-sm font-medium text-gray-700">
//                       Area <span className="text-red-500">*</span>
//                     </label>
//                     <select
//                       name="areaName"
//                       value={formData.areaName}
//                       onChange={handleInputChange}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100"
//                       required
//                       disabled={!selectedPincode}
//                       aria-describedby={
//                         errors.areaName ? "areaName-error" : undefined
//                       }
//                     >
//                       <option value="" disabled>
//                         Select Area
//                       </option>
//                       {areaOptions.map((a) => (
//                         <option key={a._id} value={a.name}>
//                           {a.name}
//                         </option>
//                       ))}
//                     </select>
//                     {errors.areaName && (
//                       <p id="areaName-error" className="text-red-500 text-sm">
//                         {errors.areaName}
//                       </p>
//                     )}
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div className="space-y-2">
//                     <label className="block text-sm font-medium text-gray-700">
//                       Sub Area
//                     </label>
//                     <select
//                       name="subAreaName"
//                       value={formData.subAreaName}
//                       onChange={handleInputChange}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100"
//                       disabled={!formData.areaName}
//                     >
//                       <option value="">Select Sub Area</option>
//                       {subAreaOptions
//                         .map((a) => (
//                           <option key={a._id} value={a.name}>
//                             {a.name}
//                           </option>
//                         ))}
//                     </select>
//                   </div>

//                   <div className="space-y-2">
//                     <label className="block text-sm font-medium text-gray-700">
//                       City <span className="text-red-500">*</span>
//                     </label>
//                     <select
//                       name="city"
//                       value={formData.city}
//                       onChange={handleInputChange}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100"
//                       required
//                       disabled={!selectedPincode}
//                       aria-describedby={errors.city ? "city-error" : undefined}
//                     >
//                       <option value="" disabled>
//                         Select City
//                       </option>
//                       {selectedPincode &&
//                         pincodeData.find((p) => p.code === selectedPincode) && (
//                           <option
//                             value={
//                               pincodeData.find((p) => p.code === selectedPincode)
//                                 ?.city
//                             }
//                           >
//                             {
//                               pincodeData.find((p) => p.code === selectedPincode)
//                                 ?.city
//                             }
//                           </option>
//                         )}
//                     </select>
//                     {errors.city && (
//                       <p id="city-error" className="text-red-500 text-sm">
//                         {errors.city}
//                       </p>
//                     )}
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div className="space-y-2">
//                     <label className="block text-sm font-medium text-gray-700">
//                       State <span className="text-red-500">*</span>
//                     </label>
//                     <select
//                       name="state"
//                       value={formData.state}
//                       onChange={handleInputChange}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100"
//                       required
//                       disabled={!selectedPincode}
//                       aria-describedby={errors.state ? "state-error" : undefined}
//                     >
//                       <option value="" disabled>
//                         Select State
//                       </option>
//                       {selectedPincode &&
//                         pincodeData.find((p) => p.code === selectedPincode) && (
//                           <option
//                             value={
//                               pincodeData.find((p) => p.code === selectedPincode)
//                                 ?.state
//                             }
//                           >
//                             {
//                               pincodeData.find((p) => p.code === selectedPincode)
//                                 ?.state
//                             }
//                           </option>
//                         )}
//                     </select>
//                     {errors.state && (
//                       <p id="state-error" className="text-red-500 text-sm">
//                         {errors.state}
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               </>
//             )}

//             {currentStep === 3 && (
//               <>
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
//                     disabled={catLoading}
//                     aria-describedby={
//                       errors.category ? "category-error" : undefined
//                     }
//                   >
//                     <option value="" disabled>
//                       {catLoading ? "Loading categories..." : "Select a category"}
//                     </option>
//                     {apiCategories
//                       .sort((a, b) => a.category_name.toLowerCase().localeCompare(b.category_name.toLowerCase()))
//                       .map((item) => (
//                         <option key={item._id} value={item._id}>
//                           {item.category_name}
//                         </option>
//                       ))}
//                   </select>
//                   {catError && (
//                     <p className="text-red-500 text-sm">
//                       {catError}
//                     </p>
//                   )}
//                   {errors.category && (
//                     <p id="category-error" className="text-red-500 text-sm">
//                       {errors.category}
//                     </p>
//                   )}
//                 </div>

//                 <div className="space-y-2">
//                   <label className="block text-sm font-medium text-gray-700">
//                     Subscription Plan <span className="text-red-500">*</span>
//                   </label>
//                   <select
//                     name="subscriptionId"
//                     value={formData.subscriptionId}
//                     onChange={handleInputChange}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                     required
//                     disabled={planLoading || subscriptionPlans.length === 0}
//                     aria-describedby={
//                       errors.subscriptionId ? "subscriptionId-error" : undefined
//                     }
//                   >
//                     <option value="" disabled>
//                       {planLoading
//                         ? "Loading plans..."
//                         : subscriptionPlans.length === 0
//                         ? "No plans available"
//                         : "Select Subscription Plan"}
//                     </option>
//                     {subscriptionPlans
//                       .filter((plan) => ['Economy Plan', 'Free Plan'].includes(plan.name))
//                       .map((plan) => (
//                         <option key={plan._id} value={plan._id}>
//                           {plan.name} - ₹{plan.finalPrice} ({plan.price} + {plan.gst} GST)
//                         </option>
//                       ))}
//                   </select>
//                   {planError && (
//                     <p className="text-red-500 text-sm">
//                       {planError}
//                     </p>
//                   )}
//                   {errors.subscriptionId && (
//                     <p id="subscriptionId-error" className="text-red-500 text-sm">
//                       {errors.subscriptionId}
//                     </p>
//                   )}
//                 </div>
//               </>
//             )}

//             {currentStep === 4 && (
//               <>
//                 <div className="space-y-2">
//                   <label className="block text-sm font-medium text-gray-700">
//                     Profile Image <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="file"
//                     accept="image/*"
//                     onChange={(e) => handleFileChange("profileImage", e.target.files?.[0] || null)}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                     required
//                   />
//                   {formData.profileImage && (
//                     <p className="text-sm text-gray-600">Selected: {formData.profileImage.name}</p>
//                   )}
//                   {previews.profileImage && (
//                     <img
//                       src={previews.profileImage}
//                       alt="Profile Preview"
//                       className="mt-2 w-32 h-32 rounded-full object-cover border border-gray-300"
//                     />
//                   )}
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div className="space-y-2">
//                     <label className="block text-sm font-medium text-gray-700">
//                       Aadhar Front <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="file"
//                       accept="image/*"
//                       onChange={(e) => handleFileChange("aadharFront", e.target.files?.[0] || null)}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                       required
//                     />
//                     {formData.aadharFront && (
//                       <p className="text-sm text-gray-600">Selected: {formData.aadharFront.name}</p>
//                     )}
//                     {previews.aadharFront && (
//                       <img
//                         src={previews.aadharFront}
//                         alt="Aadhar Front Preview"
//                         className="mt-2 max-w-xs h-32 object-cover rounded-lg border border-gray-300"
//                       />
//                     )}
//                     {errors.aadharFront && (
//                       <p className="text-red-500 text-sm">
//                         {errors.aadharFront}
//                       </p>
//                     )}
//                   </div>

//                   <div className="space-y-2">
//                     <label className="block text-sm font-medium text-gray-700">
//                       Aadhar Back <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="file"
//                       accept="image/*"
//                       onChange={(e) => handleFileChange("aadharBack", e.target.files?.[0] || null)}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                       required
//                     />
//                     {formData.aadharBack && (
//                       <p className="text-sm text-gray-600">Selected: {formData.aadharBack.name}</p>
//                     )}
//                     {previews.aadharBack && (
//                       <img
//                         src={previews.aadharBack}
//                         alt="Aadhar Back Preview"
//                         className="mt-2 max-w-xs h-32 object-cover rounded-lg border border-gray-300"
//                       />
//                     )}
//                     {errors.aadharBack && (
//                       <p className="text-red-500 text-sm">
//                         {errors.aadharBack}
//                       </p>
//                     )}
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div className="space-y-2">
//                     <label className="block text-sm font-medium text-gray-700">
//                       Pan Card (At least one of Pan or Voter Card required) <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="file"
//                       accept="image/*"
//                       onChange={(e) => handleFileChange("panCard", e.target.files?.[0] || null)}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                     />
//                     {formData.panCard && (
//                       <p className="text-sm text-gray-600">Selected: {formData.panCard.name}</p>
//                     )}
//                     {previews.panCard && (
//                       <img
//                         src={previews.panCard}
//                         alt="Pan Card Preview"
//                         className="mt-2 max-w-xs h-32 object-cover rounded-lg border border-gray-300"
//                       />
//                     )}
//                     {errors.panCard && (
//                       <p className="text-red-500 text-sm">
//                         {errors.panCard}
//                       </p>
//                     )}
//                   </div>

//                   <div className="space-y-2">
//                     <label className="block text-sm font-medium text-gray-700">
//                       Voter Card (Alternative to Pan Card)
//                     </label>
//                     <input
//                       type="file"
//                       accept="image/*"
//                       onChange={(e) => handleFileChange("voterCard", e.target.files?.[0] || null)}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                     />
//                     {formData.voterCard && (
//                       <p className="text-sm text-gray-600">Selected: {formData.voterCard.name}</p>
//                     )}
//                     {previews.voterCard && (
//                       <img
//                         src={previews.voterCard}
//                         alt="Voter Card Preview"
//                         className="mt-2 max-w-xs h-32 object-cover rounded-lg border border-gray-300"
//                       />
//                     )}
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div className="space-y-2">
//                     <label className="block text-sm font-medium text-gray-700">
//                       Authorized Person 1 Phone <span className="text-red-500">*</span>
//                     </label>
//                     <div className="flex">
//                       <span className="inline-flex items-center px-3 py-3 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm rounded-l-lg">
//                         🇮🇳 +91
//                       </span>
//                       <input
//                         type="tel"
//                         name="authorizedPerson1Phone"
//                         value={formData.authorizedPerson1Phone}
//                         onChange={handleInputChange}
//                         className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                         placeholder="Enter 10-digit phone number"
//                         pattern="[0-9]{10}"
//                         required
//                         aria-describedby={
//                           errors.authorizedPerson1Phone ? "authorizedPerson1Phone-error" : undefined
//                         }
//                       />
//                     </div>
//                     {errors.authorizedPerson1Phone && (
//                       <p id="authorizedPerson1Phone-error" className="text-red-500 text-sm">
//                         {errors.authorizedPerson1Phone}
//                       </p>
//                     )}
//                   </div>

//                   <div className="space-y-2">
//                     <label className="block text-sm font-medium text-gray-700">
//                       Authorized Person 1 Photo <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="file"
//                       accept="image/*"
//                       onChange={(e) => handleFileChange("auth1Photo", e.target.files?.[0] || null)}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                       required
//                     />
//                     {formData.auth1Photo && (
//                       <p className="text-sm text-gray-600">Selected: {formData.auth1Photo.name}</p>
//                     )}
//                     {previews.auth1Photo && (
//                       <img
//                         src={previews.auth1Photo}
//                         alt="Authorized Person 1 Photo Preview"
//                         className="mt-2 max-w-xs h-32 object-cover rounded-lg border border-gray-300"
//                       />
//                     )}
//                     {errors.auth1Photo && (
//                       <p className="text-red-500 text-sm">
//                         {errors.auth1Photo}
//                       </p>
//                     )}
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div className="space-y-2">
//                     <label className="block text-sm font-medium text-gray-700">
//                       Authorized Person 2 Phone <span className="text-red-500">*</span>
//                     </label>
//                     <div className="flex">
//                       <span className="inline-flex items-center px-3 py-3 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm rounded-l-lg">
//                         🇮🇳 +91
//                       </span>
//                       <input
//                         type="tel"
//                         name="authorizedPerson2Phone"
//                         value={formData.authorizedPerson2Phone}
//                         onChange={handleInputChange}
//                         className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                         placeholder="Enter 10-digit phone number"
//                         pattern="[0-9]{10}"
//                         required
//                         aria-describedby={
//                           errors.authorizedPerson2Phone ? "authorizedPerson2Phone-error" : undefined
//                         }
//                       />
//                     </div>
//                     {errors.authorizedPerson2Phone && (
//                       <p id="authorizedPerson2Phone-error" className="text-red-500 text-sm">
//                         {errors.authorizedPerson2Phone}
//                       </p>
//                     )}
//                   </div>

//                   <div className="space-y-2">
//                     <label className="block text-sm font-medium text-gray-700">
//                       Authorized Person 2 Photo <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="file"
//                       accept="image/*"
//                       onChange={(e) => handleFileChange("auth2Photo", e.target.files?.[0] || null)}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                       required
//                     />
//                     {formData.auth2Photo && (
//                       <p className="text-sm text-gray-600">Selected: {formData.auth2Photo.name}</p>
//                     )}
//                     {previews.auth2Photo && (
//                       <img
//                         src={previews.auth2Photo}
//                         alt="Authorized Person 2 Photo Preview"
//                         className="mt-2 max-w-xs h-32 object-cover rounded-lg border border-gray-300"
//                       />
//                     )}
//                     {errors.auth2Photo && (
//                       <p className="text-red-500 text-sm">
//                         {errors.auth2Photo}
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               </>
//             )}

//             {/* Action Buttons */}
//             <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
//               <button
//                 type="button"
//                 onClick={() => {
//                   if (window.confirm("Are you sure you want to cancel? Unsaved changes will be lost.")) {
//                     navigate("/management/technicians");
//                   }
//                 }}
//                 className="w-full sm:w-auto px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
//                 disabled={loading}
//               >
//                 Cancel
//               </button>
//               <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
//                 {currentStep > 1 && (
//                   <button
//                     type="button"
//                     onClick={prevStep}
//                     disabled={loading}
//                     className="w-full sm:w-auto px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all duration-200 disabled:opacity-50"
//                   >
//                     Previous
//                   </button>
//                 )}
//                 {currentStep < steps.length ? (
//                   <button
//                     type="button"
//                     onClick={nextStep}
//                     disabled={loading}
//                     className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 disabled:opacity-50"
//                   >
//                     Next
//                   </button>
//                 ) : (
//                   <button
//                     type="submit"
//                     className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
//                     disabled={loading}
//                   >
//                     {loading ? "Processing..." : submitText}
//                   </button>
//                 )}
//               </div>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddTechnician;
