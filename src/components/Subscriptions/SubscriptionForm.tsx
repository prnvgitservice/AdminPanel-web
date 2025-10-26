import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, X, Loader2, CheckSquare, Square } from "lucide-react";
import { addPlans, updatePlans } from "../../api/apiMethods";

interface Feature {
  name: string;
  included: boolean;
}

interface FullFeature {
  text: string;
}

interface Subscription {
  _id?: string;
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
  features: Feature[];
  fullFeatures: FullFeature[];
  isPopular: boolean;
  isActive: boolean;
  endUpPrice: number | null;
  commisionAmount: number;
  executiveCommissionAmount: number;
  refExecutiveCommisionAmount: number;
  referalCommisionAmount: number;
  createdAt?: string;
  updatedAt?: string;
}

interface SubscriptionFormProps {
  isEdit?: boolean;
}

const SubscriptionForm: React.FC<SubscriptionFormProps> = ({
  isEdit = false,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Initialize form data
  const initialSubscription = isEdit ? (location.state as Subscription) : null;
  const [formData, setFormData] = useState({
    name: initialSubscription?.name || "",
    originalPrice: initialSubscription?.originalPrice || null,
    discount: initialSubscription?.discount || "",
    discountPercentage: initialSubscription?.discountPercentage || null,
    price: initialSubscription?.price || 0,
    gstPercentage: initialSubscription?.gstPercentage || 0,
    gst: initialSubscription?.gst || 0,
    finalPrice: initialSubscription?.finalPrice || 0,
    validity: initialSubscription?.validity || null,
    leads: initialSubscription?.leads || null,
    features: initialSubscription?.features || [],
    fullFeatures: initialSubscription?.fullFeatures || [],
    isPopular: initialSubscription?.isPopular || false,
    isActive: initialSubscription?.isActive,
    endUpPrice: initialSubscription?.endUpPrice || null,
    commisionAmount: initialSubscription?.commisionAmount || 0,
    executiveCommissionAmount:
      initialSubscription?.executiveCommissionAmount || 0,
    refExecutiveCommisionAmount:
      initialSubscription?.refExecutiveCommisionAmount || 0,
    referalCommisionAmount: initialSubscription?.referalCommisionAmount || 0,
  });
  const [error, setError] = useState<string | null>(null);
  const [featureInput, setFeatureInput] = useState("");
  const [fullFeatureInput, setFullFeatureInput] = useState("");
  const [editingFeatureIndex, setEditingFeatureIndex] = useState<number | null>(
    null
  );
  const [editingFullFeatureIndex, setEditingFullFeatureIndex] = useState<
    number | null
  >(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    name: "",
    price: "",
    gstPercentage: "",
    gst: "",
    finalPrice: "",
    commisionAmount: "",
    executiveCommissionAmount: "",
    // refExecutiveCommisionAmount: '',
    // referalCommisionAmount: '',
    features: "",
  });

  // Auto-update discount percentage
  useEffect(() => {
    if (
      formData.originalPrice !== null &&
      formData.originalPrice > 0 &&
      formData.price > 0
    ) {
      const diff = formData.originalPrice - formData.price;
      const discount = (diff / formData.originalPrice) * 100;

      // Round to 2 decimal places, but remove trailing zeros if not needed
      const formattedDiscount = Math.round(discount * 100) / 100; // round to 2 decimals

      setFormData((prev) => ({
        ...prev,
        discountPercentage: formattedDiscount,
      }));
    } else {
      setFormData((prev) => ({ ...prev, discountPercentage: null }));
    }
  }, [formData.originalPrice, formData.price]);

  // Auto-update GST and final price
  useEffect(() => {
    if (formData.gstPercentage >= 0 && formData.price >= 0) {
      const gstRate = formData.gstPercentage / 100;
      const gstAmt = Math.round(formData.price * gstRate * 100) / 100;
      setFormData((prev) => ({
        ...prev,
        gst: gstAmt,
        finalPrice: formData.price + gstAmt,
      }));
    }
  }, [formData.gstPercentage, formData.price]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const parser = name === "gstPercentage" ? parseFloat : parseInt;
    setFormData((prev) => ({
      ...prev,
      [name]: value === "" ? null : parser(value) || 0,
    }));
  };

  const handleBooleanChange = (
    field: keyof Pick<Subscription, "isPopular" | "isActive">,
    value: boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFeatureInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFeatureInput(e.target.value);
  };

  const handleFeatureKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && featureInput.trim()) {
      e.preventDefault();
      const trimmedName = featureInput.trim();
      if (trimmedName.length < 1 || trimmedName.length > 100) {
        setFieldErrors((prev) => ({
          ...prev,
          features: "Feature name must be between 1 and 100 characters",
        }));
        return;
      }
      if (editingFeatureIndex !== null) {
        setFormData((prev) => ({
          ...prev,
          features: prev.features.map((feat, i) =>
            i === editingFeatureIndex ? { ...feat, name: trimmedName } : feat
          ),
        }));
        setEditingFeatureIndex(null);
      } else {
        const newFeature: Feature = { name: trimmedName, included: false };
        setFormData((prev) => ({
          ...prev,
          features: [...prev.features, newFeature],
        }));
      }
      setFeatureInput("");
      setFieldErrors((prev) => ({ ...prev, features: "" }));
    }
  };

  const toggleFeatureIncluded = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.map((feat, i) =>
        i === index ? { ...feat, included: !feat.included } : feat
      ),
    }));
  };

  const editFeature = (index: number) => {
    setEditingFeatureIndex(index);
    setFeatureInput(formData.features[index].name);
  };

  const removeFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
    if (editingFeatureIndex === index) {
      setEditingFeatureIndex(null);
      setFeatureInput("");
    }
  };

  const handleFullFeatureInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFullFeatureInput(e.target.value);
  };

  const handleFullFeatureKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter" && fullFeatureInput.trim()) {
      e.preventDefault();
      const trimmedText = fullFeatureInput.trim();
      if (trimmedText.length < 1 || trimmedText.length > 500) {
        setError("Full feature text must be between 1 and 500 characters");
        return;
      }
      if (editingFullFeatureIndex !== null) {
        setFormData((prev) => ({
          ...prev,
          fullFeatures: prev.fullFeatures.map((feat, i) =>
            i === editingFullFeatureIndex ? { text: trimmedText } : feat
          ),
        }));
        setEditingFullFeatureIndex(null);
      } else {
        const newFullFeature: FullFeature = { text: trimmedText };
        setFormData((prev) => ({
          ...prev,
          fullFeatures: [...prev.fullFeatures, newFullFeature],
        }));
      }
      setFullFeatureInput("");
    }
  };

  const editFullFeature = (index: number) => {
    setEditingFullFeatureIndex(index);
    setFullFeatureInput(formData.fullFeatures[index].text);
  };

  const removeFullFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      fullFeatures: prev.fullFeatures.filter((_, i) => i !== index),
    }));
    if (editingFullFeatureIndex === index) {
      setEditingFullFeatureIndex(null);
      setFullFeatureInput("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    const errors = {
      name:
        formData.name.trim().length >= 3
          ? ""
          : "Name must be at least 3 characters",
      price: formData.price >= 0 ? "" : "Price must be at least 0",
      gstPercentage:
        formData.gstPercentage >= 0 ? "" : "GST percentage must be at least 0",
      gst: formData.gst >= 0 ? "" : "GST must be at least 0",
      finalPrice:
        formData.finalPrice >= 0 ? "" : "Final price must be at least 0",
      commisionAmount:
        formData.commisionAmount >= 0
          ? ""
          : "Commission amount must be at least 0",
      executiveCommissionAmount:
        formData.executiveCommissionAmount >= 0
          ? ""
          : "Executive commission must be at least 0",
      refExecutiveCommisionAmount:
        formData.refExecutiveCommisionAmount >= 0
          ? ""
          : "Ref executive commission must be at least 0",
      referalCommisionAmount:
        formData.referalCommisionAmount >= 0
          ? ""
          : "Referral commission must be at least 0",
      features:
        formData.features.length > 0 ? "" : "At least one feature is required",
    };
    setFieldErrors(errors);

    if (Object.values(errors).some((error) => error)) {
      setError("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const payload = {
      name: formData.name.trim(),
      originalPrice: formData.originalPrice,
      discount: formData.discount,
      discountPercentage: formData.discountPercentage,
      price: formData.price,
      gstPercentage: formData.gstPercentage,
      gst: formData.gst,
      finalPrice: formData.finalPrice,
      validity: formData.validity,
      leads: formData.leads,
      endUpPrice: formData.endUpPrice,
      commisionAmount: formData.commisionAmount,
      executiveCommissionAmount: formData.executiveCommissionAmount,
      refExecutiveCommisionAmount: formData.refExecutiveCommisionAmount,
      referalCommisionAmount: formData.referalCommisionAmount,
      features: formData.features,
      fullFeatures: formData.fullFeatures,
      isPopular: formData.isPopular,
      isActive: formData.isActive,
    };

    if (isEdit && initialSubscription?._id) {
      payload.id = initialSubscription._id;
    }

    try {
      const response =
        isEdit && initialSubscription?._id
          ? await updatePlans(payload)
          : await addPlans(payload);

      if (response.success) {
        alert(
          isEdit ? "Plan updated successfully!" : "New plan added successfully!"
        );
        navigate("/subscription/all");
      } else {
        setError(
          response.message ||
            (isEdit
              ? "Failed to update subscription plan"
              : "Failed to create subscription plan")
        );
      }
    } catch (err: any) {
      setError(
        err.message ||
          (isEdit
            ? "Error updating subscription plan. Please try again."
            : "Error creating subscription plan. Please try again.")
      );
      console.error(
        `Error ${isEdit ? "updating" : "adding"} subscription:`,
        err
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-green-500 to-green-600 rounded-lg transform transition-transform hover:scale-110">
            <CheckSquare className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            {isEdit ? "Edit Subscription Plan" : "Add Subscription Plan"}
          </h1>
        </div>
        <button
          onClick={() => navigate("/subscription/all")}
          className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
          disabled={isSubmitting}
          aria-label="Back to all subscriptions"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        {error && (
          <div
            className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg animate-slide-in"
            role="alert"
          >
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-6">
            {/* Plan Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Plan Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border ${
                  fieldErrors.name ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200`}
                placeholder="Enter subscription plan name"
                required
                aria-invalid={!!fieldErrors.name}
                aria-describedby={fieldErrors.name ? "name-error" : undefined}
              />
              {fieldErrors.name && (
                <p
                  id="name-error"
                  className="text-red-500 text-sm mt-1 animate-slide-in"
                >
                  {fieldErrors.name}
                </p>
              )}
            </div>

            {/* Pricing Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="originalPrice"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Original Price
                </label>
                <input
                  type="number"
                  id="originalPrice"
                  name="originalPrice"
                  value={formData.originalPrice || ""}
                  onChange={handleNumberInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  placeholder="0"
                  min="0"
                  step="1"
                />
              </div>
              <div>
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Price *
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleNumberInputChange}
                  className={`w-full px-4 py-3 border ${
                    fieldErrors.price ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200`}
                  placeholder="0"
                  min="0"
                  step="1"
                  required
                />
                {fieldErrors.price && (
                  <p className="text-red-500 text-sm mt-1 animate-slide-in">
                    {fieldErrors.price}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="discount"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Discount
                </label>
                <input
                  type="text"
                  id="discount"
                  name="discount"
                  value={formData.discount}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  placeholder="Discount code or description"
                />
              </div>
              <div>
                <label
                  htmlFor="discountPercentage"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Discount Percentage
                </label>
                <input
                  type="number"
                  id="discountPercentage"
                  name="discountPercentage"
                  value={formData.discountPercentage || ""}
                  disabled
                  className="w-full px-4 py-3 border border-gray-300 bg-gray-100 rounded-lg cursor-not-allowed"
                  placeholder="Auto-calculated"
                  step="1"
                />
              </div>
            </div>

            {/* Tax Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label
                  htmlFor="gstPercentage"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  GST Percentage *
                </label>
                <input
                  type="number"
                  id="gstPercentage"
                  name="gstPercentage"
                  value={formData.gstPercentage}
                  onChange={handleNumberInputChange}
                  className={`w-full px-4 py-3 border ${
                    fieldErrors.gstPercentage
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200`}
                  placeholder="0"
                  min="0"
                  step="0.01"
                  required
                />
                {fieldErrors.gstPercentage && (
                  <p className="text-red-500 text-sm mt-1 animate-slide-in">
                    {fieldErrors.gstPercentage}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="gst"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  GST Amount *
                </label>
                <input
                  type="number"
                  id="gst"
                  name="gst"
                  value={formData.gst}
                  disabled
                  className={`w-full px-4 py-3 border ${
                    fieldErrors.gst ? "border-red-500" : "border-gray-300"
                  } bg-gray-100 rounded-lg cursor-not-allowed`}
                  placeholder="Auto-calculated"
                  min="0"
                  step="0.01"
                  required
                />
                {fieldErrors.gst && (
                  <p className="text-red-500 text-sm mt-1 animate-slide-in">
                    {fieldErrors.gst}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="finalPrice"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Final Price *
                </label>
                <input
                  type="number"
                  id="finalPrice"
                  name="finalPrice"
                  value={formData.finalPrice}
                  disabled
                  className={`w-full px-4 py-3 border ${
                    fieldErrors.finalPrice
                      ? "border-red-500"
                      : "border-gray-300"
                  } bg-gray-100 rounded-lg cursor-not-allowed`}
                  placeholder="Auto-calculated"
                  min="0"
                  step="0.01"
                  required
                />
                {fieldErrors.finalPrice && (
                  <p className="text-red-500 text-sm mt-1 animate-slide-in">
                    {fieldErrors.finalPrice}
                  </p>
                )}
              </div>
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label
                  htmlFor="validity"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Validity (days)
                </label>
                <input
                  type="number"
                  id="validity"
                  name="validity"
                  value={formData.validity || ""}
                  onChange={handleNumberInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  placeholder="0"
                  min="0"
                  step="1"
                />
              </div>
              <div>
                <label
                  htmlFor="leads"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Leads
                </label>
                <input
                  type="number"
                  id="leads"
                  name="leads"
                  value={formData.leads || ""}
                  onChange={handleNumberInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  placeholder="0"
                  min="0"
                  step="1"
                />
              </div>
              <div>
                <label
                  htmlFor="endUpPrice"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  End Up Price
                </label>
                <input
                  type="number"
                  id="endUpPrice"
                  name="endUpPrice"
                  value={formData.endUpPrice || ""}
                  onChange={handleNumberInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  placeholder="0"
                  min="0"
                  step="1"
                />
              </div>
            </div>

            {/* Commission Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="commisionAmount"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Commission Amount *
                </label>
                <input
                  type="number"
                  id="commisionAmount"
                  name="commisionAmount"
                  value={formData.commisionAmount}
                  onChange={handleNumberInputChange}
                  className={`w-full px-4 py-3 border ${
                    fieldErrors.commisionAmount
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200`}
                  placeholder="0"
                  min="0"
                  step="1"
                  required
                />
                {fieldErrors.commisionAmount && (
                  <p className="text-red-500 text-sm mt-1 animate-slide-in">
                    {fieldErrors.commisionAmount}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="executiveCommissionAmount"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Executive Commission Amount *
                </label>
                <input
                  type="number"
                  id="executiveCommissionAmount"
                  name="executiveCommissionAmount"
                  value={formData.executiveCommissionAmount}
                  onChange={handleNumberInputChange}
                  className={`w-full px-4 py-3 border ${
                    fieldErrors.executiveCommissionAmount
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200`}
                  placeholder="0"
                  min="0"
                  required
                />
                {fieldErrors.executiveCommissionAmount && (
                  <p className="text-red-500 text-sm mt-1 animate-slide-in">
                    {fieldErrors.executiveCommissionAmount}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="refExecutiveCommisionAmount"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Ref Executive Commission Amount *
                </label>
                <input
                  type="number"
                  id="refExecutiveCommisionAmount"
                  name="refExecutiveCommisionAmount"
                  value={formData.refExecutiveCommisionAmount}
                  onChange={handleNumberInputChange}
                  className={`w-full px-4 py-3 border ${
                    fieldErrors.refExecutiveCommisionAmount
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200`}
                  placeholder="0"
                  min="0"
                  step="1"
                  required
                />
                {/* {fieldErrors.refExecutiveCommisionAmount && (
                  <p className="text-red-500 text-sm mt-1 animate-slide-in">{fieldErrors.refExecutiveCommisionAmount}</p>
                )} */}
              </div>
              <div>
                <label
                  htmlFor="referalCommisionAmount"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Referral Commission Amount *
                </label>
                <input
                  type="number"
                  id="referalCommisionAmount"
                  name="referalCommisionAmount"
                  value={formData.referalCommisionAmount}
                  onChange={handleNumberInputChange}
                  className={`w-full px-4 py-3 border ${
                    fieldErrors.referalCommisionAmount
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200`}
                  placeholder="0"
                  min="0"
                  step="1"
                  required
                />
                {/* {fieldErrors.referalCommisionAmount && (
                  <p className="text-red-500 text-sm mt-1 animate-slide-in">{fieldErrors.referalCommisionAmount}</p>
                )} */}
              </div>
            </div>

            {/* Toggles */}
            <div className="flex items-center gap-8">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isPopular}
                  onChange={(e) =>
                    handleBooleanChange("isPopular", e.target.checked)
                  }
                  className="rounded"
                />
                <span className="text-sm font-medium text-gray-700">
                  Popular Plan
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) =>
                    handleBooleanChange("isActive", e.target.checked)
                  }
                  className="rounded"
                />
                <span className="text-sm font-medium text-gray-700">
                  Active
                </span>
              </label>
            </div>

            {/* Features */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Features *
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.features.map((feature, index) => (
                  <div
                    key={index}
                    className="inline-flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-800 text-sm font-medium rounded-lg transition-transform duration-200 hover:scale-105"
                  >
                    <button
                      type="button"
                      onClick={() => toggleFeatureIncluded(index)}
                      className="p-1"
                      aria-label={
                        feature.included ? "Exclude feature" : "Include feature"
                      }
                    >
                      {feature.included ? (
                        <CheckSquare className="w-4 h-4 text-green-600" />
                      ) : (
                        <Square className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                    <span
                      className="cursor-pointer"
                      onClick={() => editFeature(index)}
                    >
                      {feature.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="ml-2 text-gray-500 hover:text-red-500"
                      aria-label={`Remove feature ${feature.name}`}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              <input
                type="text"
                value={featureInput}
                onChange={handleFeatureInputChange}
                onKeyDown={handleFeatureKeyDown}
                className={`w-full px-4 py-3 border ${
                  fieldErrors.features ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200`}
                placeholder={
                  editingFeatureIndex !== null
                    ? "Edit feature name and press Enter"
                    : "Type feature name and press Enter to add"
                }
                aria-invalid={!!fieldErrors.features}
                aria-describedby={
                  fieldErrors.features ? "features-error" : undefined
                }
              />
              {fieldErrors.features && (
                <p
                  id="features-error"
                  className="text-red-500 text-sm mt-1 animate-slide-in"
                >
                  {fieldErrors.features}
                </p>
              )}
            </div>

            {/* Full Features */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Features
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.fullFeatures.map((fullFeat, index) => (
                  <span
                    key={index}
                    className={`inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full cursor-pointer transition-transform duration-200 hover:scale-105 ${
                      editingFullFeatureIndex === index
                        ? "ring-2 ring-blue-500"
                        : ""
                    }`}
                    onClick={() => editFullFeature(index)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) =>
                      e.key === "Enter" && editFullFeature(index)
                    }
                  >
                    {fullFeat.text.substring(0, 20)}
                    {fullFeat.text.length > 20 ? "..." : ""}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFullFeature(index);
                      }}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                      aria-label={`Remove full feature ${fullFeat.text}`}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                value={fullFeatureInput}
                onChange={handleFullFeatureInputChange}
                onKeyDown={handleFullFeatureKeyDown}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                placeholder={
                  editingFullFeatureIndex !== null
                    ? "Edit full feature text and press Enter"
                    : "Type full feature text and press Enter to add"
                }
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-between space-x-4 pt-8 border-gray-200">
            <button
              type="button"
              onClick={() => {
                if (window.confirm("Are sure want to discard")) {
                  navigate("/subscription/all");
                }
              }}
              className="px-6 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
              disabled={isSubmitting}
              aria-label="Cancel and return to subscriptions"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg font-semibold hover:from-green-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
              aria-label={
                isEdit ? "Update subscription" : "Create subscription"
              }
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  {isEdit ? "Updating..." : "Creating..."}
                </span>
              ) : (
                <>{isEdit ? "Update Plan" : "Create Plan"}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubscriptionForm;
// import React, { useState, useEffect } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { ArrowLeft, X, Loader2, CheckSquare, Square } from 'lucide-react';
// import { addPlans, updatePlans } from '../../api/apiMethods';

// interface Feature {
//   name: string;
//   included: boolean;
// }

// interface FullFeature {
//   text: string;
// }

// interface Subscription {
//   _id?: string;
//   name: string;
//   originalPrice: number | null;
//   discount: string;
//   discountPercentage: number | null;
//   price: number;
//   gstPercentage: number;
//   gst: number;
//   finalPrice: number;
//   validity: number | null;
//   leads: number | null;
//   features: Feature[];
//   fullFeatures: FullFeature[];
//   isPopular: boolean;
//   isActive: boolean;
//   endUpPrice: number | null;
//   commisionAmount: number;
//   executiveCommissionAmount: number;
//   refExecutiveCommisionAmount: number;
//   referalCommisionAmount: number;
//   createdAt?: string;
//   updatedAt?: string;
// }

// interface SubscriptionFormProps {
//   isEdit?: boolean;
// }

// const SubscriptionForm: React.FC<SubscriptionFormProps> = ({ isEdit = false }) => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   // Initialize form data
//   const initialSubscription = isEdit ? (location.state as Subscription) : null;
//   const [formData, setFormData] = useState({
//     name: initialSubscription?.name || '',
//     originalPrice: initialSubscription?.originalPrice || null,
//     discount: initialSubscription?.discount || '',
//     discountPercentage: initialSubscription?.discountPercentage || null,
//     price: initialSubscription?.price || 0,
//     gstPercentage: initialSubscription?.gstPercentage || 0,
//     gst: initialSubscription?.gst || 0,
//     finalPrice: initialSubscription?.finalPrice || 0,
//     validity: initialSubscription?.validity || null,
//     leads: initialSubscription?.leads || null,
//     features: initialSubscription?.features || [],
//     fullFeatures: initialSubscription?.fullFeatures || [],
//     isPopular: initialSubscription?.isPopular || false,
//     isActive: initialSubscription?.isActive || true,
//     endUpPrice: initialSubscription?.endUpPrice || null,
//     commisionAmount: initialSubscription?.commisionAmount || 0,
//     executiveCommissionAmount: initialSubscription?.executiveCommissionAmount || 0,
//     refExecutiveCommisionAmount: initialSubscription?.refExecutiveCommisionAmount || 0,
//     referalCommisionAmount: initialSubscription?.referalCommisionAmount || 0,
//   });
//   const [error, setError] = useState<string | null>(null);
//   const [featureInput, setFeatureInput] = useState('');
//   const [fullFeatureInput, setFullFeatureInput] = useState('');
//   const [editingFeatureIndex, setEditingFeatureIndex] = useState<number | null>(null);
//   const [editingFullFeatureIndex, setEditingFullFeatureIndex] = useState<number | null>(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [fieldErrors, setFieldErrors] = useState({
//     name: '',
//     price: '',
//     gstPercentage: '',
//     gst: '',
//     finalPrice: '',
//     commisionAmount: '',
//     executiveCommissionAmount: '',
//     // refExecutiveCommisionAmount: '',
//     // referalCommisionAmount: '',
//     features: '',
//   });

//   // Auto-update discount percentage
// useEffect(() => {
//   if (
//     formData.originalPrice !== null &&
//     formData.originalPrice > 0 &&
//     formData.price > 0
//   ) {
//     const diff = formData.originalPrice - formData.price;
//     const discount = (diff / formData.originalPrice) * 100;

//     // Round to 2 decimal places, but remove trailing zeros if not needed
//     const formattedDiscount =
//       Math.round(discount * 100) / 100; // round to 2 decimals

//     setFormData((prev) => ({
//       ...prev,
//       discountPercentage: formattedDiscount,
//     }));
//   } else {
//     setFormData((prev) => ({ ...prev, discountPercentage: null }));
//   }
// }, [formData.originalPrice, formData.price]);

//   // Auto-update GST and final price
//   useEffect(() => {
//     if (formData.gstPercentage >= 0 && formData.price >= 0) {
//       const total = formData.price * formData.gstPercentage;
//       let gstAmt = Math.floor(total / 100);
//       const rem = total % 100;
//       if (rem >= 50) {
//         gstAmt += 1;
//       }
//       setFormData((prev) => ({
//         ...prev,
//         gst: gstAmt,
//         finalPrice: prev.price + gstAmt,
//       }));
//     }
//   }, [formData.gstPercentage, formData.price]);

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value === '' ? null : parseInt(value) || 0 }));
//   };

//   const handleBooleanChange = (field: keyof Pick<Subscription, 'isPopular' | 'isActive'>, value: boolean) => {
//     setFormData((prev) => ({ ...prev, [field]: value }));
//   };

//   const handleFeatureInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFeatureInput(e.target.value);
//   };

//   const handleFeatureKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === 'Enter' && featureInput.trim()) {
//       e.preventDefault();
//       const trimmedName = featureInput.trim();
//       if (trimmedName.length < 1 || trimmedName.length > 100) {
//         setFieldErrors((prev) => ({ ...prev, features: 'Feature name must be between 1 and 100 characters' }));
//         return;
//       }
//       if (editingFeatureIndex !== null) {
//         setFormData((prev) => ({
//           ...prev,
//           features: prev.features.map((feat, i) => (i === editingFeatureIndex ? { ...feat, name: trimmedName } : feat)),
//         }));
//         setEditingFeatureIndex(null);
//       } else {
//         const newFeature: Feature = { name: trimmedName, included: false };
//         setFormData((prev) => ({
//           ...prev,
//           features: [...prev.features, newFeature],
//         }));
//       }
//       setFeatureInput('');
//       setFieldErrors((prev) => ({ ...prev, features: '' }));
//     }
//   };

//   const toggleFeatureIncluded = (index: number) => {
//     setFormData((prev) => ({
//       ...prev,
//       features: prev.features.map((feat, i) => (i === index ? { ...feat, included: !feat.included } : feat)),
//     }));
//   };

//   const editFeature = (index: number) => {
//     setEditingFeatureIndex(index);
//     setFeatureInput(formData.features[index].name);
//   };

//   const removeFeature = (index: number) => {
//     setFormData((prev) => ({
//       ...prev,
//       features: prev.features.filter((_, i) => i !== index),
//     }));
//     if (editingFeatureIndex === index) {
//       setEditingFeatureIndex(null);
//       setFeatureInput('');
//     }
//   };

//   const handleFullFeatureInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFullFeatureInput(e.target.value);
//   };

//   const handleFullFeatureKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === 'Enter' && fullFeatureInput.trim()) {
//       e.preventDefault();
//       const trimmedText = fullFeatureInput.trim();
//       if (trimmedText.length < 1 || trimmedText.length > 500) {
//         setError('Full feature text must be between 1 and 500 characters');
//         return;
//       }
//       if (editingFullFeatureIndex !== null) {
//         setFormData((prev) => ({
//           ...prev,
//           fullFeatures: prev.fullFeatures.map((feat, i) => (i === editingFullFeatureIndex ? { text: trimmedText } : feat)),
//         }));
//         setEditingFullFeatureIndex(null);
//       } else {
//         const newFullFeature: FullFeature = { text: trimmedText };
//         setFormData((prev) => ({
//           ...prev,
//           fullFeatures: [...prev.fullFeatures, newFullFeature],
//         }));
//       }
//       setFullFeatureInput('');
//     }
//   };

//   const editFullFeature = (index: number) => {
//     setEditingFullFeatureIndex(index);
//     setFullFeatureInput(formData.fullFeatures[index].text);
//   };

//   const removeFullFeature = (index: number) => {
//     setFormData((prev) => ({
//       ...prev,
//       fullFeatures: prev.fullFeatures.filter((_, i) => i !== index),
//     }));
//     if (editingFullFeatureIndex === index) {
//       setEditingFullFeatureIndex(null);
//       setFullFeatureInput('');
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     // Validate required fields
//     const errors = {
//       name: formData.name.trim().length >= 3 ? '' : 'Name must be at least 3 characters',
//       price: formData.price >= 0 ? '' : 'Price must be at least 0',
//       gstPercentage: formData.gstPercentage >= 0 ? '' : 'GST percentage must be at least 0',
//       gst: formData.gst >= 0 ? '' : 'GST must be at least 0',
//       finalPrice: formData.finalPrice >= 0 ? '' : 'Final price must be at least 0',
//       commisionAmount: formData.commisionAmount > 0 ? '' : 'Commission amount must be greater than 0',
//       executiveCommissionAmount: formData.executiveCommissionAmount > 0 ? '' : 'Executive commission must be greater than 0',
//     //   refExecutiveCommisionAmount: formData.refExecutiveCommisionAmount > 0 ? '' : 'Ref executive commission must be greater than 0',
//     //   referalCommisionAmount: formData.referalCommisionAmount > 0 ? '' : 'Referral commission must be greater than 0',
//       features: formData.features.length > 0 ? '' : 'At least one feature is required',
//     };
//     setFieldErrors(errors);

//     if (Object.values(errors).some((error) => error)) {
//       setError('Please fill in all required fields');
//       return;
//     }

//     setIsSubmitting(true);
//     setError(null);

//     const payload = {
//       name: formData.name.trim(),
//       originalPrice: formData.originalPrice,
//       discount: formData.discount,
//       discountPercentage: formData.discountPercentage,
//       price: formData.price,
//       gstPercentage: formData.gstPercentage,
//       gst: formData.gst,
//       finalPrice: formData.finalPrice,
//       validity: formData.validity,
//       leads: formData.leads,
//       endUpPrice: formData.endUpPrice,
//       commisionAmount: formData.commisionAmount,
//       executiveCommissionAmount: formData.executiveCommissionAmount,
//       refExecutiveCommisionAmount: formData.refExecutiveCommisionAmount,
//       referalCommisionAmount: formData.referalCommisionAmount,
//       features: formData.features,
//       fullFeatures: formData.fullFeatures,
//       isPopular: formData.isPopular,
//       isActive: formData.isActive,
//     };

//     if (isEdit && initialSubscription?._id) {
//       payload.id = initialSubscription._id;
//     }

//     try {
//       const response = isEdit && initialSubscription?._id
//         ? await updatePlans(payload)
//         : await addPlans(payload);

//       if (response.success) {
//         alert(isEdit ? 'Plan updated successfully!' : 'New plan added successfully!');
//         navigate('/subscription/all');
//       } else {
//         setError(response.message || (isEdit ? 'Failed to update subscription plan' : 'Failed to create subscription plan'));
//       }
//     } catch (err: any) {
//       setError(err.message || (isEdit ? 'Error updating subscription plan. Please try again.' : 'Error creating subscription plan. Please try again.'));
//       console.error(`Error ${isEdit ? 'updating' : 'adding'} subscription:`, err);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-8">
//         <div className="flex items-center gap-3">
//           <div className="p-2 bg-gradient-to-r from-green-500 to-green-600 rounded-lg transform transition-transform hover:scale-110">
//             <CheckSquare className="h-5 w-5 text-white" />
//           </div>
//           <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
//             {isEdit ? 'Edit Subscription Plan' : 'Add Subscription Plan'}
//           </h1>
//         </div>
//         <button
//           onClick={() => navigate('/subscription/all')}
//           className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
//           disabled={isSubmitting}
//           aria-label="Back to all subscriptions"
//         >
//           <ArrowLeft className="w-5 h-5 mr-2" />
//           Back
//         </button>
//       </div>

//       {/* Form */}
//       <div className="bg-white rounded-xl shadow-lg p-8">
//         {error && (
//           <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg animate-slide-in" role="alert">
//             {error}
//           </div>
//         )}
//         <form onSubmit={handleSubmit} className="space-y-8">
//           <div className="space-y-6">
//             {/* Plan Name */}
//             <div>
//               <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
//                 Plan Name *
//               </label>
//               <input
//                 type="text"
//                 id="name"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleInputChange}
//                 className={`w-full px-4 py-3 border ${
//                   fieldErrors.name ? 'border-red-500' : 'border-gray-300'
//                 } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200`}
//                 placeholder="Enter subscription plan name"
//                 required
//                 aria-invalid={!!fieldErrors.name}
//                 aria-describedby={fieldErrors.name ? 'name-error' : undefined}
//               />
//               {fieldErrors.name && (
//                 <p id="name-error" className="text-red-500 text-sm mt-1 animate-slide-in">
//                   {fieldErrors.name}
//                 </p>
//               )}
//             </div>

//             {/* Pricing Section */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label htmlFor="originalPrice" className="block text-sm font-medium text-gray-700 mb-2">
//                   Original Price
//                 </label>
//                 <input
//                   type="number"
//                   id="originalPrice"
//                   name="originalPrice"
//                   value={formData.originalPrice || ''}
//                   onChange={handleNumberInputChange}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
//                   placeholder="0"
//                   min="0"
//                   step="1"
//                 />
//               </div>
//               <div>
//                 <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
//                   Price *
//                 </label>
//                 <input
//                   type="number"
//                   id="price"
//                   name="price"
//                   value={formData.price}
//                   onChange={handleNumberInputChange}
//                   className={`w-full px-4 py-3 border ${
//                     fieldErrors.price ? 'border-red-500' : 'border-gray-300'
//                   } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200`}
//                   placeholder="0"
//                   min="0"
//                   step="1"
//                   required
//                 />
//                 {fieldErrors.price && (
//                   <p className="text-red-500 text-sm mt-1 animate-slide-in">{fieldErrors.price}</p>
//                 )}
//               </div>
//               <div>
//                 <label htmlFor="discount" className="block text-sm font-medium text-gray-700 mb-2">
//                   Discount
//                 </label>
//                 <input
//                   type="text"
//                   id="discount"
//                   name="discount"
//                   value={formData.discount}
//                   onChange={handleInputChange}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
//                   placeholder="Discount code or description"
//                 />
//               </div>
//               <div>
//                 <label htmlFor="discountPercentage" className="block text-sm font-medium text-gray-700 mb-2">
//                   Discount Percentage
//                 </label>
//                 <input
//                   type="number"
//                   id="discountPercentage"
//                   name="discountPercentage"
//                   value={formData.discountPercentage || ''}
//                   disabled
//                   className="w-full px-4 py-3 border border-gray-300 bg-gray-100 rounded-lg cursor-not-allowed"
//                   placeholder="Auto-calculated"
//                   step="1"
//                 />
//               </div>
//             </div>

//             {/* Tax Section */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               <div>
//                 <label htmlFor="gstPercentage" className="block text-sm font-medium text-gray-700 mb-2">
//                   GST Percentage *
//                 </label>
//                 <input
//                   type="number"
//                   id="gstPercentage"
//                   name="gstPercentage"
//                   value={formData.gstPercentage}
//                   onChange={handleNumberInputChange}
//                   className={`w-full px-4 py-3 border ${
//                     fieldErrors.gstPercentage ? 'border-red-500' : 'border-gray-300'
//                   } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200`}
//                   placeholder="0"
//                   min="0"
//                   step="1"
//                   required
//                 />
//                 {fieldErrors.gstPercentage && (
//                   <p className="text-red-500 text-sm mt-1 animate-slide-in">{fieldErrors.gstPercentage}</p>
//                 )}
//               </div>
//               <div>
//                 <label htmlFor="gst" className="block text-sm font-medium text-gray-700 mb-2">
//                   GST Amount *
//                 </label>
//                 <input
//                   type="number"
//                   id="gst"
//                   name="gst"
//                   value={formData.gst}
//                   disabled
//                   className={`w-full px-4 py-3 border ${
//                     fieldErrors.gst ? 'border-red-500' : 'border-gray-300'
//                   } bg-gray-100 rounded-lg cursor-not-allowed`}
//                   placeholder="Auto-calculated"
//                   min="0"
//                   step="1"
//                   required
//                 />
//                 {fieldErrors.gst && (
//                   <p className="text-red-500 text-sm mt-1 animate-slide-in">{fieldErrors.gst}</p>
//                 )}
//               </div>
//               <div>
//                 <label htmlFor="finalPrice" className="block text-sm font-medium text-gray-700 mb-2">
//                   Final Price *
//                 </label>
//                 <input
//                   type="number"
//                   id="finalPrice"
//                   name="finalPrice"
//                   value={formData.finalPrice}
//                   disabled
//                   className={`w-full px-4 py-3 border ${
//                     fieldErrors.finalPrice ? 'border-red-500' : 'border-gray-300'
//                   } bg-gray-100 rounded-lg cursor-not-allowed`}
//                   placeholder="Auto-calculated"
//                   min="0"
//                   step="1"
//                   required
//                 />
//                 {fieldErrors.finalPrice && (
//                   <p className="text-red-500 text-sm mt-1 animate-slide-in">{fieldErrors.finalPrice}</p>
//                 )}
//               </div>
//             </div>

//             {/* Additional Info */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               <div>
//                 <label htmlFor="validity" className="block text-sm font-medium text-gray-700 mb-2">
//                   Validity (days)
//                 </label>
//                 <input
//                   type="number"
//                   id="validity"
//                   name="validity"
//                   value={formData.validity || ''}
//                   onChange={handleNumberInputChange}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
//                   placeholder="0"
//                   min="0"
//                   step="1"
//                 />
//               </div>
//               <div>
//                 <label htmlFor="leads" className="block text-sm font-medium text-gray-700 mb-2">
//                   Leads
//                 </label>
//                 <input
//                   type="number"
//                   id="leads"
//                   name="leads"
//                   value={formData.leads || ''}
//                   onChange={handleNumberInputChange}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
//                   placeholder="0"
//                   min="0"
//                   step="1"
//                 />
//               </div>
//               <div>
//                 <label htmlFor="endUpPrice" className="block text-sm font-medium text-gray-700 mb-2">
//                   End Up Price
//                 </label>
//                 <input
//                   type="number"
//                   id="endUpPrice"
//                   name="endUpPrice"
//                   value={formData.endUpPrice || ''}
//                   onChange={handleNumberInputChange}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
//                   placeholder="0"
//                   min="0"
//                   step="1"
//                 />
//               </div>
//             </div>

//             {/* Commission Section */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label htmlFor="commisionAmount" className="block text-sm font-medium text-gray-700 mb-2">
//                   Commission Amount *
//                 </label>
//                 <input
//                   type="number"
//                   id="commisionAmount"
//                   name="commisionAmount"
//                   value={formData.commisionAmount}
//                   onChange={handleNumberInputChange}
//                   className={`w-full px-4 py-3 border ${
//                     fieldErrors.commisionAmount ? 'border-red-500' : 'border-gray-300'
//                   } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200`}
//                   placeholder="0"
//                   min="0"
//                   step="1"
//                   required
//                 />
//                 {fieldErrors.commisionAmount && (
//                   <p className="text-red-500 text-sm mt-1 animate-slide-in">{fieldErrors.commisionAmount}</p>
//                 )}
//               </div>
//               <div>
//                 <label htmlFor="executiveCommissionAmount" className="block text-sm font-medium text-gray-700 mb-2">
//                   Executive Commission Amount *
//                 </label>
//                 <input
//                   type="number"
//                   id="executiveCommissionAmount"
//                   name="executiveCommissionAmount"
//                   value={formData.executiveCommissionAmount}
//                   onChange={handleNumberInputChange}
//                   className={`w-full px-4 py-3 border ${
//                     fieldErrors.executiveCommissionAmount ? 'border-red-500' : 'border-gray-300'
//                   } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200`}
//                   placeholder="0"
//                   min="0"
//                   required
//                 />
//                 {fieldErrors.executiveCommissionAmount && (
//                   <p className="text-red-500 text-sm mt-1 animate-slide-in">{fieldErrors.executiveCommissionAmount}</p>
//                 )}
//               </div>
//               <div>
//                 <label htmlFor="refExecutiveCommisionAmount" className="block text-sm font-medium text-gray-700 mb-2">
//                   Ref Executive Commission Amount *
//                 </label>
//                 <input
//                   type="number"
//                   id="refExecutiveCommisionAmount"
//                   name="refExecutiveCommisionAmount"
//                   value={formData.refExecutiveCommisionAmount}
//                   onChange={handleNumberInputChange}
//                   className={`w-full px-4 py-3 border ${
//                     fieldErrors?.refExecutiveCommisionAmount ? 'border-red-500' : 'border-gray-300'
//                   } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200`}
//                   placeholder="0"
//                   min="0"
//                   step="1"
//                   required
//                 />
//                 {/* {fieldErrors.refExecutiveCommisionAmount && (
//                   <p className="text-red-500 text-sm mt-1 animate-slide-in">{fieldErrors.refExecutiveCommisionAmount}</p>
//                 )} */}
//               </div>
//               <div>
//                 <label htmlFor="referalCommisionAmount" className="block text-sm font-medium text-gray-700 mb-2">
//                   Referral Commission Amount *
//                 </label>
//                 <input
//                   type="number"
//                   id="referalCommisionAmount"
//                   name="referalCommisionAmount"
//                   value={formData.referalCommisionAmount}
//                   onChange={handleNumberInputChange}
//                   className={`w-full px-4 py-3 border ${
//                     fieldErrors?.referalCommisionAmount ? 'border-red-500' : 'border-gray-300'
//                   } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200`}
//                   placeholder="0"
//                   min="0"
//                   step="1"
//                   required
//                 />
//                 {/* {fieldErrors.referalCommisionAmount && (
//                   <p className="text-red-500 text-sm mt-1 animate-slide-in">{fieldErrors.referalCommisionAmount}</p>
//                 )} */}
//               </div>
//             </div>

//             {/* Toggles */}
//             <div className="flex items-center gap-8">
//               <label className="flex items-center gap-2 cursor-pointer">
//                 <input
//                   type="checkbox"
//                   checked={formData.isPopular}
//                   onChange={(e) => handleBooleanChange('isPopular', e.target.checked)}
//                   className="rounded"
//                 />
//                 <span className="text-sm font-medium text-gray-700">Popular Plan</span>
//               </label>
//               <label className="flex items-center gap-2 cursor-pointer">
//                 <input
//                   type="checkbox"
//                   checked={formData.isActive}
//                   onChange={(e) => handleBooleanChange('isActive', e.target.checked)}
//                   className="rounded"
//                 />
//                 <span className="text-sm font-medium text-gray-700">Active</span>
//               </label>
//             </div>

//             {/* Features */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Features *
//               </label>
//               <div className="flex flex-wrap gap-2 mb-2">
//                 {formData.features.map((feature, index) => (
//                   <div
//                     key={index}
//                     className="inline-flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-800 text-sm font-medium rounded-lg transition-transform duration-200 hover:scale-105"
//                   >
//                     <button
//                       type="button"
//                       onClick={() => toggleFeatureIncluded(index)}
//                       className="p-1"
//                       aria-label={feature.included ? 'Exclude feature' : 'Include feature'}
//                     >
//                       {feature.included ? <CheckSquare className="w-4 h-4 text-green-600" /> : <Square className="w-4 h-4 text-gray-400" />}
//                     </button>
//                     <span
//                       className="cursor-pointer"
//                       onClick={() => editFeature(index)}
//                     >
//                       {feature.name}
//                     </span>
//                     <button
//                       type="button"
//                       onClick={() => removeFeature(index)}
//                       className="ml-2 text-gray-500 hover:text-red-500"
//                       aria-label={`Remove feature ${feature.name}`}
//                     >
//                       <X className="w-4 h-4" />
//                     </button>
//                   </div>
//                 ))}
//               </div>
//               <input
//                 type="text"
//                 value={featureInput}
//                 onChange={handleFeatureInputChange}
//                 onKeyDown={handleFeatureKeyDown}
//                 className={`w-full px-4 py-3 border ${
//                   fieldErrors.features ? 'border-red-500' : 'border-gray-300'
//                 } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200`}
//                 placeholder={editingFeatureIndex !== null ? 'Edit feature name and press Enter' : 'Type feature name and press Enter to add'}
//                 aria-invalid={!!fieldErrors.features}
//                 aria-describedby={fieldErrors.features ? 'features-error' : undefined}
//               />
//               {fieldErrors.features && (
//                 <p id="features-error" className="text-red-500 text-sm mt-1 animate-slide-in">
//                   {fieldErrors.features}
//                 </p>
//               )}
//             </div>

//             {/* Full Features */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Full Features
//               </label>
//               <div className="flex flex-wrap gap-2 mb-2">
//                 {formData.fullFeatures.map((fullFeat, index) => (
//                   <span
//                     key={index}
//                     className={`inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full cursor-pointer transition-transform duration-200 hover:scale-105 ${
//                       editingFullFeatureIndex === index ? 'ring-2 ring-blue-500' : ''
//                     }`}
//                     onClick={() => editFullFeature(index)}
//                     role="button"
//                     tabIndex={0}
//                     onKeyDown={(e) => e.key === 'Enter' && editFullFeature(index)}
//                   >
//                     {fullFeat.text.substring(0, 20)}{fullFeat.text.length > 20 ? '...' : ''}
//                     <button
//                       type="button"
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         removeFullFeature(index);
//                       }}
//                       className="ml-2 text-blue-600 hover:text-blue-800"
//                       aria-label={`Remove full feature ${fullFeat.text}`}
//                     >
//                       <X className="w-4 h-4" />
//                     </button>
//                   </span>
//                 ))}
//               </div>
//               <input
//                 type="text"
//                 value={fullFeatureInput}
//                 onChange={handleFullFeatureInputChange}
//                 onKeyDown={handleFullFeatureKeyDown}
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
//                 placeholder={editingFullFeatureIndex !== null ? 'Edit full feature text and press Enter' : 'Type full feature text and press Enter to add'}
//               />
//             </div>
//           </div>

//           {/* Form Actions */}
//           <div className="flex items-center justify-between space-x-4 pt-8 border-gray-200">
//             <button
//               type="button"
//               onClick={() => navigate('/subscription/all')}
//               className="px-6 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
//               disabled={isSubmitting}
//               aria-label="Cancel and return to subscriptions"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg font-semibold hover:from-green-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
//               disabled={isSubmitting}
//               aria-label={isEdit ? 'Update subscription' : 'Create subscription'}
//             >
//               {isSubmitting ? (
//                 <span className="flex items-center">
//                   <Loader2 className="w-5 h-5 mr-2 animate-spin" />
//                   {isEdit ? 'Updating...' : 'Creating...'}
//                 </span>
//               ) : (
//                 <>{isEdit ? 'Update Plan' : 'Create Plan'}</>
//               )}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default SubscriptionForm;
// import React, { useState, useEffect } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { ArrowLeft, X, Loader2, CheckSquare, Square } from 'lucide-react';
// import { addPlans, updatePlans } from '../../api/apiMethods';

// interface Feature {
//   name: string;
//   included: boolean;
// }

// interface FullFeature {
//   text: string;
// }

// interface Subscription {
//   _id?: string;
//   name: string;
//   originalPrice: number | null;
//   discount: string;
//   discountPercentage: number | null;
//   price: number;
//   gstPercentage: number;
//   gst: number;
//   finalPrice: number;
//   validity: number | null;
//   leads: number | null;
//   features: Feature[];
//   fullFeatures: FullFeature[];
//   isPopular: boolean;
//   isActive: boolean;
//   endUpPrice: number | null;
//   commisionAmount: number;
//   executiveCommissionAmount: number;
//   refExecutiveCommisionAmount: number;
//   referalCommisionAmount: number;
//   createdAt?: string;
//   updatedAt?: string;
// }

// interface SubscriptionFormProps {
//   isEdit?: boolean;
// }

// const SubscriptionForm: React.FC<SubscriptionFormProps> = ({ isEdit = false }) => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   // Initialize form data
//   const initialSubscription = isEdit ? (location.state as Subscription) : null;
//   const [formData, setFormData] = useState({
//     name: initialSubscription?.name || '',
//     originalPrice: initialSubscription?.originalPrice || null,
//     discount: initialSubscription?.discount || '',
//     discountPercentage: initialSubscription?.discountPercentage || null,
//     price: initialSubscription?.price || 0,
//     gstPercentage: initialSubscription?.gstPercentage || 0,
//     gst: initialSubscription?.gst || 0,
//     finalPrice: initialSubscription?.finalPrice || 0,
//     validity: initialSubscription?.validity || null,
//     leads: initialSubscription?.leads || null,
//     features: initialSubscription?.features || [],
//     fullFeatures: initialSubscription?.fullFeatures || [],
//     isPopular: initialSubscription?.isPopular || false,
//     isActive: initialSubscription?.isActive || true,
//     endUpPrice: initialSubscription?.endUpPrice || null,
//     commisionAmount: initialSubscription?.commisionAmount || 0,
//     executiveCommissionAmount: initialSubscription?.executiveCommissionAmount || 0,
//     refExecutiveCommisionAmount: initialSubscription?.refExecutiveCommisionAmount || 0,
//     referalCommisionAmount: initialSubscription?.referalCommisionAmount || 0,
//   });
//   const [error, setError] = useState<string | null>(null);
//   const [featureInput, setFeatureInput] = useState('');
//   const [fullFeatureInput, setFullFeatureInput] = useState('');
//   const [editingFeatureIndex, setEditingFeatureIndex] = useState<number | null>(null);
//   const [editingFullFeatureIndex, setEditingFullFeatureIndex] = useState<number | null>(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [fieldErrors, setFieldErrors] = useState({
//     name: '',
//     price: '',
//     gstPercentage: '',
//     gst: '',
//     finalPrice: '',
//     commisionAmount: '',
//     executiveCommissionAmount: '',
//     // refExecutiveCommisionAmount: '',
//     // referalCommisionAmount: '',
//     features: '',
//   });

//   // Auto-update discount percentage
//   useEffect(() => {
//     if (formData.originalPrice !== null && formData.originalPrice > 0 && formData.price > 0) {
//       const disc = Math.round(((formData.originalPrice - formData.price) / formData.originalPrice) * 100);
//       setFormData((prev) => ({ ...prev, discountPercentage: disc }));
//     } else {
//       setFormData((prev) => ({ ...prev, discountPercentage: null }));
//     }
//   }, [formData.originalPrice, formData.price]);

//   // Auto-update GST and final price
//   useEffect(() => {
//     if (formData.gstPercentage >= 0 && formData.price >= 0) {
//       const gstAmt = Math.round((formData.price * formData.gstPercentage) / 100);
//       setFormData((prev) => ({
//         ...prev,
//         gst: gstAmt,
//         finalPrice: formData.price + gstAmt,
//       }));
//     }
//   }, [formData.gstPercentage, formData.price]);

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value === '' ? null : parseInt(value) || 0 }));
//   };

//   const handleBooleanChange = (field: keyof Pick<Subscription, 'isPopular' | 'isActive'>, value: boolean) => {
//     setFormData((prev) => ({ ...prev, [field]: value }));
//   };

//   const handleFeatureInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFeatureInput(e.target.value);
//   };

//   const handleFeatureKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === 'Enter' && featureInput.trim()) {
//       e.preventDefault();
//       const trimmedName = featureInput.trim();
//       if (trimmedName.length < 1 || trimmedName.length > 100) {
//         setFieldErrors((prev) => ({ ...prev, features: 'Feature name must be between 1 and 100 characters' }));
//         return;
//       }
//       if (editingFeatureIndex !== null) {
//         setFormData((prev) => ({
//           ...prev,
//           features: prev.features.map((feat, i) => (i === editingFeatureIndex ? { ...feat, name: trimmedName } : feat)),
//         }));
//         setEditingFeatureIndex(null);
//       } else {
//         const newFeature: Feature = { name: trimmedName, included: false };
//         setFormData((prev) => ({
//           ...prev,
//           features: [...prev.features, newFeature],
//         }));
//       }
//       setFeatureInput('');
//       setFieldErrors((prev) => ({ ...prev, features: '' }));
//     }
//   };

//   const toggleFeatureIncluded = (index: number) => {
//     setFormData((prev) => ({
//       ...prev,
//       features: prev.features.map((feat, i) => (i === index ? { ...feat, included: !feat.included } : feat)),
//     }));
//   };

//   const editFeature = (index: number) => {
//     setEditingFeatureIndex(index);
//     setFeatureInput(formData.features[index].name);
//   };

//   const removeFeature = (index: number) => {
//     setFormData((prev) => ({
//       ...prev,
//       features: prev.features.filter((_, i) => i !== index),
//     }));
//     if (editingFeatureIndex === index) {
//       setEditingFeatureIndex(null);
//       setFeatureInput('');
//     }
//   };

//   const handleFullFeatureInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFullFeatureInput(e.target.value);
//   };

//   const handleFullFeatureKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === 'Enter' && fullFeatureInput.trim()) {
//       e.preventDefault();
//       const trimmedText = fullFeatureInput.trim();
//       if (trimmedText.length < 1 || trimmedText.length > 500) {
//         setError('Full feature text must be between 1 and 500 characters');
//         return;
//       }
//       if (editingFullFeatureIndex !== null) {
//         setFormData((prev) => ({
//           ...prev,
//           fullFeatures: prev.fullFeatures.map((feat, i) => (i === editingFullFeatureIndex ? { text: trimmedText } : feat)),
//         }));
//         setEditingFullFeatureIndex(null);
//       } else {
//         const newFullFeature: FullFeature = { text: trimmedText };
//         setFormData((prev) => ({
//           ...prev,
//           fullFeatures: [...prev.fullFeatures, newFullFeature],
//         }));
//       }
//       setFullFeatureInput('');
//     }
//   };

//   const editFullFeature = (index: number) => {
//     setEditingFullFeatureIndex(index);
//     setFullFeatureInput(formData.fullFeatures[index].text);
//   };

//   const removeFullFeature = (index: number) => {
//     setFormData((prev) => ({
//       ...prev,
//       fullFeatures: prev.fullFeatures.filter((_, i) => i !== index),
//     }));
//     if (editingFullFeatureIndex === index) {
//       setEditingFullFeatureIndex(null);
//       setFullFeatureInput('');
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     // Validate required fields
//     const errors = {
//       name: formData.name.trim().length >= 3 ? '' : 'Name must be at least 3 characters',
//       price: formData.price >= 0 ? '' : 'Price must be at least 0',
//       gstPercentage: formData.gstPercentage >= 0 ? '' : 'GST percentage must be at least 0',
//       gst: formData.gst >= 0 ? '' : 'GST must be at least 0',
//       finalPrice: formData.finalPrice >= 0 ? '' : 'Final price must be at least 0',
//       commisionAmount: formData.commisionAmount > 0 ? '' : 'Commission amount must be greater than 0',
//       executiveCommissionAmount: formData.executiveCommissionAmount > 0 ? '' : 'Executive commission must be greater than 0',
//     //   refExecutiveCommisionAmount: formData.refExecutiveCommisionAmount > 0 ? '' : 'Ref executive commission must be greater than 0',
//     //   referalCommisionAmount: formData.referalCommisionAmount > 0 ? '' : 'Referral commission must be greater than 0',
//       features: formData.features.length > 0 ? '' : 'At least one feature is required',
//     };
//     setFieldErrors(errors);

//     if (Object.values(errors).some((error) => error)) {
//       setError('Please fill in all required fields');
//       return;
//     }

//     setIsSubmitting(true);
//     setError(null);

//     const payload = {
//       name: formData.name.trim(),
//       originalPrice: formData.originalPrice,
//       discount: formData.discount,
//       discountPercentage: formData.discountPercentage,
//       price: formData.price,
//       gstPercentage: formData.gstPercentage,
//       gst: formData.gst,
//       finalPrice: formData.finalPrice,
//       validity: formData.validity,
//       leads: formData.leads,
//       endUpPrice: formData.endUpPrice,
//       commisionAmount: formData.commisionAmount,
//       executiveCommissionAmount: formData.executiveCommissionAmount,
//       refExecutiveCommisionAmount: formData.refExecutiveCommisionAmount,
//       referalCommisionAmount: formData.referalCommisionAmount,
//       features: formData.features,
//       fullFeatures: formData.fullFeatures,
//       isPopular: formData.isPopular,
//       isActive: formData.isActive,
//     };

//     if (isEdit && initialSubscription?._id) {
//       payload.id = initialSubscription._id;
//     }

//     try {
//       const response = isEdit && initialSubscription?._id
//         ? await updatePlans(payload)
//         : await addPlans(payload);

//       if (response.success) {
//         alert(isEdit ? 'Plan updated successfully!' : 'New plan added successfully!');
//         navigate('/subscription/all');
//       } else {
//         setError(response.message || (isEdit ? 'Failed to update subscription plan' : 'Failed to create subscription plan'));
//       }
//     } catch (err: any) {
//       setError(err.message || (isEdit ? 'Error updating subscription plan. Please try again.' : 'Error creating subscription plan. Please try again.'));
//       console.error(`Error ${isEdit ? 'updating' : 'adding'} subscription:`, err);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-8">
//         <div className="flex items-center gap-3">
//           <div className="p-2 bg-gradient-to-r from-green-500 to-green-600 rounded-lg transform transition-transform hover:scale-110">
//             <CheckSquare className="h-5 w-5 text-white" />
//           </div>
//           <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
//             {isEdit ? 'Edit Subscription Plan' : 'Add Subscription Plan'}
//           </h1>
//         </div>
//         <button
//           onClick={() => navigate('/subscription/all')}
//           className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
//           disabled={isSubmitting}
//           aria-label="Back to all subscriptions"
//         >
//           <ArrowLeft className="w-5 h-5 mr-2" />
//           Back
//         </button>
//       </div>

//       {/* Form */}
//       <div className="bg-white rounded-xl shadow-lg p-8">
//         {error && (
//           <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg animate-slide-in" role="alert">
//             {error}
//           </div>
//         )}
//         <form onSubmit={handleSubmit} className="space-y-8">
//           <div className="space-y-6">
//             {/* Plan Name */}
//             <div>
//               <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
//                 Plan Name *
//               </label>
//               <input
//                 type="text"
//                 id="name"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleInputChange}
//                 className={`w-full px-4 py-3 border ${
//                   fieldErrors.name ? 'border-red-500' : 'border-gray-300'
//                 } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200`}
//                 placeholder="Enter subscription plan name"
//                 required
//                 aria-invalid={!!fieldErrors.name}
//                 aria-describedby={fieldErrors.name ? 'name-error' : undefined}
//               />
//               {fieldErrors.name && (
//                 <p id="name-error" className="text-red-500 text-sm mt-1 animate-slide-in">
//                   {fieldErrors.name}
//                 </p>
//               )}
//             </div>

//             {/* Pricing Section */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label htmlFor="originalPrice" className="block text-sm font-medium text-gray-700 mb-2">
//                   Original Price
//                 </label>
//                 <input
//                   type="number"
//                   id="originalPrice"
//                   name="originalPrice"
//                   value={formData.originalPrice || ''}
//                   onChange={handleNumberInputChange}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
//                   placeholder="0"
//                   min="0"
//                   step="1"
//                 />
//               </div>
//               <div>
//                 <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
//                   Price *
//                 </label>
//                 <input
//                   type="number"
//                   id="price"
//                   name="price"
//                   value={formData.price}
//                   onChange={handleNumberInputChange}
//                   className={`w-full px-4 py-3 border ${
//                     fieldErrors.price ? 'border-red-500' : 'border-gray-300'
//                   } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200`}
//                   placeholder="0"
//                   min="0"
//                   step="1"
//                   required
//                 />
//                 {fieldErrors.price && (
//                   <p className="text-red-500 text-sm mt-1 animate-slide-in">{fieldErrors.price}</p>
//                 )}
//               </div>
//               <div>
//                 <label htmlFor="discount" className="block text-sm font-medium text-gray-700 mb-2">
//                   Discount
//                 </label>
//                 <input
//                   type="text"
//                   id="discount"
//                   name="discount"
//                   value={formData.discount}
//                   onChange={handleInputChange}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
//                   placeholder="Discount code or description"
//                 />
//               </div>
//               <div>
//                 <label htmlFor="discountPercentage" className="block text-sm font-medium text-gray-700 mb-2">
//                   Discount Percentage
//                 </label>
//                 <input
//                   type="number"
//                   id="discountPercentage"
//                   name="discountPercentage"
//                   value={formData.discountPercentage || ''}
//                   disabled
//                   className="w-full px-4 py-3 border border-gray-300 bg-gray-100 rounded-lg cursor-not-allowed"
//                   placeholder="Auto-calculated"
//                   step="1"
//                 />
//               </div>
//             </div>

//             {/* Tax Section */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               <div>
//                 <label htmlFor="gstPercentage" className="block text-sm font-medium text-gray-700 mb-2">
//                   GST Percentage *
//                 </label>
//                 <input
//                   type="number"
//                   id="gstPercentage"
//                   name="gstPercentage"
//                   value={formData.gstPercentage}
//                   onChange={handleNumberInputChange}
//                   className={`w-full px-4 py-3 border ${
//                     fieldErrors.gstPercentage ? 'border-red-500' : 'border-gray-300'
//                   } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200`}
//                   placeholder="0"
//                   min="0"
//                   step="1"
//                   required
//                 />
//                 {fieldErrors.gstPercentage && (
//                   <p className="text-red-500 text-sm mt-1 animate-slide-in">{fieldErrors.gstPercentage}</p>
//                 )}
//               </div>
//               <div>
//                 <label htmlFor="gst" className="block text-sm font-medium text-gray-700 mb-2">
//                   GST Amount *
//                 </label>
//                 <input
//                   type="number"
//                   id="gst"
//                   name="gst"
//                   value={formData.gst}
//                   disabled
//                   className={`w-full px-4 py-3 border ${
//                     fieldErrors.gst ? 'border-red-500' : 'border-gray-300'
//                   } bg-gray-100 rounded-lg cursor-not-allowed`}
//                   placeholder="Auto-calculated"
//                   min="0"
//                   step="1"
//                   required
//                 />
//                 {fieldErrors.gst && (
//                   <p className="text-red-500 text-sm mt-1 animate-slide-in">{fieldErrors.gst}</p>
//                 )}
//               </div>
//               <div>
//                 <label htmlFor="finalPrice" className="block text-sm font-medium text-gray-700 mb-2">
//                   Final Price *
//                 </label>
//                 <input
//                   type="number"
//                   id="finalPrice"
//                   name="finalPrice"
//                   value={formData.finalPrice}
//                   disabled
//                   className={`w-full px-4 py-3 border ${
//                     fieldErrors.finalPrice ? 'border-red-500' : 'border-gray-300'
//                   } bg-gray-100 rounded-lg cursor-not-allowed`}
//                   placeholder="Auto-calculated"
//                   min="0"
//                   step="1"
//                   required
//                 />
//                 {fieldErrors.finalPrice && (
//                   <p className="text-red-500 text-sm mt-1 animate-slide-in">{fieldErrors.finalPrice}</p>
//                 )}
//               </div>
//             </div>

//             {/* Additional Info */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               <div>
//                 <label htmlFor="validity" className="block text-sm font-medium text-gray-700 mb-2">
//                   Validity (days)
//                 </label>
//                 <input
//                   type="number"
//                   id="validity"
//                   name="validity"
//                   value={formData.validity || ''}
//                   onChange={handleNumberInputChange}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
//                   placeholder="0"
//                   min="0"
//                   step="1"
//                 />
//               </div>
//               <div>
//                 <label htmlFor="leads" className="block text-sm font-medium text-gray-700 mb-2">
//                   Leads
//                 </label>
//                 <input
//                   type="number"
//                   id="leads"
//                   name="leads"
//                   value={formData.leads || ''}
//                   onChange={handleNumberInputChange}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
//                   placeholder="0"
//                   min="0"
//                   step="1"
//                 />
//               </div>
//               <div>
//                 <label htmlFor="endUpPrice" className="block text-sm font-medium text-gray-700 mb-2">
//                   End Up Price
//                 </label>
//                 <input
//                   type="number"
//                   id="endUpPrice"
//                   name="endUpPrice"
//                   value={formData.endUpPrice || ''}
//                   onChange={handleNumberInputChange}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
//                   placeholder="0"
//                   min="0"
//                   step="1"
//                 />
//               </div>
//             </div>

//             {/* Commission Section */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label htmlFor="commisionAmount" className="block text-sm font-medium text-gray-700 mb-2">
//                   Commission Amount *
//                 </label>
//                 <input
//                   type="number"
//                   id="commisionAmount"
//                   name="commisionAmount"
//                   value={formData.commisionAmount}
//                   onChange={handleNumberInputChange}
//                   className={`w-full px-4 py-3 border ${
//                     fieldErrors.commisionAmount ? 'border-red-500' : 'border-gray-300'
//                   } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200`}
//                   placeholder="0"
//                   min="0"
//                   step="1"
//                   required
//                 />
//                 {fieldErrors.commisionAmount && (
//                   <p className="text-red-500 text-sm mt-1 animate-slide-in">{fieldErrors.commisionAmount}</p>
//                 )}
//               </div>
//               <div>
//                 <label htmlFor="executiveCommissionAmount" className="block text-sm font-medium text-gray-700 mb-2">
//                   Executive Commission Amount *
//                 </label>
//                 <input
//                   type="number"
//                   id="executiveCommissionAmount"
//                   name="executiveCommissionAmount"
//                   value={formData.executiveCommissionAmount}
//                   onChange={handleNumberInputChange}
//                   className={`w-full px-4 py-3 border ${
//                     fieldErrors.executiveCommissionAmount ? 'border-red-500' : 'border-gray-300'
//                   } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200`}
//                   placeholder="0"
//                   min="0"
//                   required
//                 />
//                 {fieldErrors.executiveCommissionAmount && (
//                   <p className="text-red-500 text-sm mt-1 animate-slide-in">{fieldErrors.executiveCommissionAmount}</p>
//                 )}
//               </div>
//               <div>
//                 <label htmlFor="refExecutiveCommisionAmount" className="block text-sm font-medium text-gray-700 mb-2">
//                   Ref Executive Commission Amount *
//                 </label>
//                 <input
//                   type="number"
//                   id="refExecutiveCommisionAmount"
//                   name="refExecutiveCommisionAmount"
//                   value={formData.refExecutiveCommisionAmount}
//                   onChange={handleNumberInputChange}
//                   className={`w-full px-4 py-3 border ${
//                     fieldErrors?.refExecutiveCommisionAmount ? 'border-red-500' : 'border-gray-300'
//                   } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200`}
//                   placeholder="0"
//                   min="0"
//                   step="1"
//                   required
//                 />
//                 {/* {fieldErrors.refExecutiveCommisionAmount && (
//                   <p className="text-red-500 text-sm mt-1 animate-slide-in">{fieldErrors.refExecutiveCommisionAmount}</p>
//                 )} */}
//               </div>
//               <div>
//                 <label htmlFor="referalCommisionAmount" className="block text-sm font-medium text-gray-700 mb-2">
//                   Referral Commission Amount *
//                 </label>
//                 <input
//                   type="number"
//                   id="referalCommisionAmount"
//                   name="referalCommisionAmount"
//                   value={formData.referalCommisionAmount}
//                   onChange={handleNumberInputChange}
//                   className={`w-full px-4 py-3 border ${
//                     fieldErrors?.referalCommisionAmount ? 'border-red-500' : 'border-gray-300'
//                   } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200`}
//                   placeholder="0"
//                   min="0"
//                   step="1"
//                   required
//                 />
//                 {/* {fieldErrors.referalCommisionAmount && (
//                   <p className="text-red-500 text-sm mt-1 animate-slide-in">{fieldErrors.referalCommisionAmount}</p>
//                 )} */}
//               </div>
//             </div>

//             {/* Toggles */}
//             <div className="flex items-center gap-8">
//               <label className="flex items-center gap-2 cursor-pointer">
//                 <input
//                   type="checkbox"
//                   checked={formData.isPopular}
//                   onChange={(e) => handleBooleanChange('isPopular', e.target.checked)}
//                   className="rounded"
//                 />
//                 <span className="text-sm font-medium text-gray-700">Popular Plan</span>
//               </label>
//               <label className="flex items-center gap-2 cursor-pointer">
//                 <input
//                   type="checkbox"
//                   checked={formData.isActive}
//                   onChange={(e) => handleBooleanChange('isActive', e.target.checked)}
//                   className="rounded"
//                 />
//                 <span className="text-sm font-medium text-gray-700">Active</span>
//               </label>
//             </div>

//             {/* Features */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Features *
//               </label>
//               <div className="flex flex-wrap gap-2 mb-2">
//                 {formData.features.map((feature, index) => (
//                   <div
//                     key={index}
//                     className="inline-flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-800 text-sm font-medium rounded-lg transition-transform duration-200 hover:scale-105"
//                   >
//                     <button
//                       type="button"
//                       onClick={() => toggleFeatureIncluded(index)}
//                       className="p-1"
//                       aria-label={feature.included ? 'Exclude feature' : 'Include feature'}
//                     >
//                       {feature.included ? <CheckSquare className="w-4 h-4 text-green-600" /> : <Square className="w-4 h-4 text-gray-400" />}
//                     </button>
//                     <span
//                       className="cursor-pointer"
//                       onClick={() => editFeature(index)}
//                     >
//                       {feature.name}
//                     </span>
//                     <button
//                       type="button"
//                       onClick={() => removeFeature(index)}
//                       className="ml-2 text-gray-500 hover:text-red-500"
//                       aria-label={`Remove feature ${feature.name}`}
//                     >
//                       <X className="w-4 h-4" />
//                     </button>
//                   </div>
//                 ))}
//               </div>
//               <input
//                 type="text"
//                 value={featureInput}
//                 onChange={handleFeatureInputChange}
//                 onKeyDown={handleFeatureKeyDown}
//                 className={`w-full px-4 py-3 border ${
//                   fieldErrors.features ? 'border-red-500' : 'border-gray-300'
//                 } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200`}
//                 placeholder={editingFeatureIndex !== null ? 'Edit feature name and press Enter' : 'Type feature name and press Enter to add'}
//                 aria-invalid={!!fieldErrors.features}
//                 aria-describedby={fieldErrors.features ? 'features-error' : undefined}
//               />
//               {fieldErrors.features && (
//                 <p id="features-error" className="text-red-500 text-sm mt-1 animate-slide-in">
//                   {fieldErrors.features}
//                 </p>
//               )}
//             </div>

//             {/* Full Features */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Full Features
//               </label>
//               <div className="flex flex-wrap gap-2 mb-2">
//                 {formData.fullFeatures.map((fullFeat, index) => (
//                   <span
//                     key={index}
//                     className={`inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full cursor-pointer transition-transform duration-200 hover:scale-105 ${
//                       editingFullFeatureIndex === index ? 'ring-2 ring-blue-500' : ''
//                     }`}
//                     onClick={() => editFullFeature(index)}
//                     role="button"
//                     tabIndex={0}
//                     onKeyDown={(e) => e.key === 'Enter' && editFullFeature(index)}
//                   >
//                     {fullFeat.text.substring(0, 20)}{fullFeat.text.length > 20 ? '...' : ''}
//                     <button
//                       type="button"
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         removeFullFeature(index);
//                       }}
//                       className="ml-2 text-blue-600 hover:text-blue-800"
//                       aria-label={`Remove full feature ${fullFeat.text}`}
//                     >
//                       <X className="w-4 h-4" />
//                     </button>
//                   </span>
//                 ))}
//               </div>
//               <input
//                 type="text"
//                 value={fullFeatureInput}
//                 onChange={handleFullFeatureInputChange}
//                 onKeyDown={handleFullFeatureKeyDown}
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
//                 placeholder={editingFullFeatureIndex !== null ? 'Edit full feature text and press Enter' : 'Type full feature text and press Enter to add'}
//               />
//             </div>
//           </div>

//           {/* Form Actions */}
//           <div className="flex items-center justify-between space-x-4 pt-8 border-gray-200">
//             <button
//               type="button"
//               onClick={() => navigate('/subscription/all')}
//               className="px-6 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
//               disabled={isSubmitting}
//               aria-label="Cancel and return to subscriptions"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg font-semibold hover:from-green-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
//               disabled={isSubmitting}
//               aria-label={isEdit ? 'Update subscription' : 'Create subscription'}
//             >
//               {isSubmitting ? (
//                 <span className="flex items-center">
//                   <Loader2 className="w-5 h-5 mr-2 animate-spin" />
//                   {isEdit ? 'Updating...' : 'Creating...'}
//                 </span>
//               ) : (
//                 <>{isEdit ? 'Update Plan' : 'Create Plan'}</>
//               )}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default SubscriptionForm;
