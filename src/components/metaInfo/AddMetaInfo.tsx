import React, { useState, useEffect, useRef, useMemo } from "react";
import { ArrowLeft, BookOpen, MapPin, RefreshCw } from "lucide-react";
import { BiSolidCategory } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { getAllPincodes, createSeoContent } from "../../api/apiMethods";
import { useCategoryContext } from "../Context/CategoryContext";
import JoditEditor from "jodit-react";

interface AddCategoryProps {
  onBack: () => void;
  isEdit?: boolean;
  categoryId?: number | null;
}

const AddMetaInfo: React.FC = () => {
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategoryContext();
  const navigate = useNavigate();
  const editor = useRef(null);

  // States for dropdowns
  const [pincodeData, setPincodeData] = useState([]);
  const [areaOptions, setAreaOptions] = useState([]);
  const [subAreaOptions, setSubAreaOptions] = useState([]);
  const [selectedCity, setSelectedCity] = useState("Hyderabad");
  const [selectedState, setSelectedState] = useState("Telangana");
  const [selectedCategory, setSelectedCategory] = useState({
    name: "",
    slug: "",
    id: "",
  });
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedPincode, setSelectedPincode] = useState("");
  const [selectedSubArea, setSelectedSubArea] = useState("");
  const [formData, setFormData] = useState({
    categoryId: "",
    areaName: "",
    city: "",
    state: "",
    pincode: "",
    metaTitle: "",
    metaDescription: "",
    seoContent: "",
  });
  const [error, setError] = useState<string | null>(null);
  const cityOptions = ["Hyderabad"];

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getAllCategories();
        if (res.success && Array.isArray(res.data)) {
          setCategories(res.data.filter((cat) => cat?.status === 1));
        } else {
          setError("Failed to fetch categories");
        }
      } catch (err) {
        setError("Error fetching categories");
      }
    };
    fetchCategories();
  }, []);

  const config = {
    readonly: false,
    placeholder: "Start typing your SEO content...",
    minHeight: 300,
    buttons: [
      "bold",
      "italic",
      "underline",
      "|",
      "ul",
      "ol",
      "|",
      "link",
      "table",
      "|",
      "undo",
      "redo",
      "|",
      "source",
      "fullsize",
    ],
    enableDragAndDropFileToEditor: true,
    uploader: { insertImageAsBase64URI: true },
    removeButtons: ["image", "file"],
    style: {
      fontFamily: "Arial, sans-serif",
    },
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getAllCategories();
        if (res.success && Array.isArray(res.data)) {
          setCategories(res.data.filter((cat) => cat?.status === 1));
        } else {
          setError("Failed to fetch categories");
        }
      } catch (err) {
        setError("Error fetching categories");
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchPincodeInfo = async () => {
      try {
        const res = await fetchPincodes();
        if (res.success && Array.isArray(res.data)) {
          setPincodeData(res.data);
        } else {
          setError("Failed to fetch pincodes");
        }
      } catch (err) {
        setError("Error fetching pincodes");
      }
    };
    fetchPincodeInfo();
  }, []);

  // Update area options when pincodeData or selectedArea changes
  useEffect(() => {
    const flattenedAreas = pincodeData.flatMap((p) =>
      p.areas.map((area) => ({
        ...area,
        pincode: p.code,
        state: p.state,
        city: p.city,
      }))
    );
    setAreaOptions(flattenedAreas);
  }, [pincodeData]);

  // Handle area selection and update subareas
  const handleAreaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const areaName = e.target.value;
    setSelectedArea(areaName);

    const matchedPincodeObj = pincodeData.find((p) =>
      p.areas.some((a) => a.name === areaName)
    );
    if (matchedPincodeObj) {
      setSelectedPincode(matchedPincodeObj.code);
      setSelectedState(matchedPincodeObj.state);
      setSelectedCity(matchedPincodeObj.city);
      const matchedArea = matchedPincodeObj.areas.find(
        (a) => a.name === areaName
      );
      const subAreas = matchedArea?.subAreas || [];

      setSubAreaOptions(
        [...subAreas].sort((a, b) => a.name.localeCompare(b.name))
      );
      setSelectedSubArea("");
    } else {
      setSelectedPincode("");
      setSubAreaOptions([]);
      setSelectedSubArea("");
    }
  };

  const handleCategoryChange = (e) => {
    const index = e.target.selectedIndex - 1;
    if (index >= 0) {
      const cat = categories[index];
      setSelectedCategory({
        name: cat.category_name,
        slug: cat.category_slug,
        id: cat._id,
      });
      setFormData((prev) => ({
        ...prev,
        categoryId: cat._id,
      }));
    } else {
      setSelectedCategory({ name: "", slug: "", id: "" });
      setFormData((prev) => ({
        ...prev,
        categoryId: "",
      }));
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSeoContentChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      seoContent: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      if (
        !formData.categoryId ||
        !selectedArea ||
        !selectedPincode ||
        !formData.metaTitle ||
        !formData.metaDescription ||
        !formData.seoContent
      ) {
        setError("Please fill all required fields");
        return;
      }
      const requestData = {
        categoryId: formData.categoryId,
        areaName: selectedArea,
        city: selectedCity,
        state: selectedState,
        pincode: selectedPincode,
        meta_title: formData.metaTitle,
        meta_description: formData.metaDescription,
        seo_content: formData.seoContent,
      };
      const response = await createSeoContent(requestData);
      if (response?.success) {
        alert("Meta Info created successfully!");
        navigate(-1);
      } else {
        throw new Error(response?.message || "Failed to submit review");
      }
    } catch (error: any) {
      console.error("Error submitting review:", error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "An error occurred. Please try again later.";
      setError(errorMessage);
      alert(errorMessage);
    }
  };

  const handleReset = () => {
    setSelectedCategory({ name: "", slug: "", id: "" });
    setSelectedCity("Hyderabad");
    setSelectedState("Telangana");
    setSelectedPincode("");
    setSelectedArea("");
    setSelectedSubArea("");
    setSubAreaOptions([]);
    setFormData({
      categoryId: "",
      areaName: "",
      city: "",
      state: "",
      pincode: "",
      metaTitle: "",
      metaDescription: "",
      seoContent: "",
    });
    setError(null);
  };

  // JoditEditor configuration
  const config = useMemo(
    () => ({
      height: 400,
      buttons: [
        "bold",
        "italic",
        "underline",
        "|",
        "ul",
        "ol",
        "|",
        "link",
        "table",
        "|",
        "font",
        "fontsize",
        "brush",
        "|",
        { name: "heading", list: ["h1", "h2", "h3", "h4", "h5", "h6"] },
        "|",
        "undo",
        "redo",
      ],
      toolbarAdaptive: false,
      placeholder: "Enter SEO content here...",
      style: {
        font: "16px Arial",
      },
      colors: {
        text: [
          "#000000",
          "#FF0000",
          "#00FF00",
          "#0000FF",
          "#FFFF00",
          "#FF00FF",
          "#00FFFF",
        ],
        background: [
          "#FFFFFF",
          "#FFCCCC",
          "#CCFFCC",
          "#CCCCFF",
          "#FFFFCC",
          "#FFCCFF",
          "#CCFFFF",
        ],
      },
      fonts: [
        "Arial",
        "Helvetica",
        "Times New Roman",
        "Courier New",
        "Verdana",
        "Georgia",
        "Trebuchet MS",
      ],
      fontSize: ["8", "10", "12", "14", "16", "18", "24", "30", "36"],
      iframe: false,
      styleValues: {
        "jodit-container": "border border-gray-300 rounded-lg shadow-sm",
        "jodit-toolbar__box": "bg-gray-50 border-b border-gray-300 rounded-t-lg p-2",
        "jodit-toolbar-button": "text-gray-700 hover:bg-blue-100 hover:text-blue-600 px-2 py-1 rounded transition",
        "jodit-toolbar-button_active": "bg-blue-500 text-white",
        "jodit-wysiwyg": "p-4 min-h-[400px] focus:outline-none focus:ring-2 focus:ring-blue-500",
      },
    }),
    []
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {isEdit ? "Edit Meta Info" : "Add Meta Info"}
            </h1>
          </div>
          <button
            onClick={onBack}
            className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
              <h2 className="text-lg font-semibold text-white">
                Search Selection
              </h2>
            </div>
            <div className="p-6 space-y-6">
              {error && <div className="text-red-500 mb-4">{error}</div>}
              {categoriesLoading && <div className="text-gray-500 mb-4">Loading categories...</div>}
              {categoriesError && <div className="text-red-500 mb-4">{categoriesError}</div>}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                    value={selectedCategory.name}
                    onChange={handleCategoryChange}
                    required
                  >
                    <option value="" disabled>
                      Select Category
                    </option>
                    {categories
                      .filter((cat) => cat.status === 1)
                      .sort((a, b) => a.category_name.toLowerCase().localeCompare(b.category_name.toLowerCase()))
                      .map((cat, idx) => (
                        <option key={idx} value={cat.category_name}>
                          {cat.category_name}
                        </option>
                      ))}
                  </select>
                  <BiSolidCategory
                    className="absolute left-3 top-[38px] text-blue-400"
                    size={20}
                  />
                </div>
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    required
                  >
                    <option value="" disabled>
                      Select City
                    </option>
                    {cityOptions.map((city, idx) => (
                      <option key={idx} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                  <MapPin
                    className="absolute left-3 top-[38px] text-blue-400"
                    size={20}
                  />
                </div>
                <div className="relative">
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Area <span className="text-red-500">*</span>
  </label>
  <select
    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
    value={selectedArea}
    onChange={handleAreaChange}
    required
  >
    <option value="" disabled>
      Select Area
    </option>

    {areaOptions
      ?.slice()
      .sort((a, b) => Number(a.pincode) - Number(b.pincode))
      .map((area, idx) => (
        <option key={`${area.pincode}-${idx}`} value={area.name}>
          {area.name} - {area.pincode}
        </option>
      ))}
  </select>

  <MapPin
    className="absolute left-3 top-[38px] text-blue-400"
    size={20}
  />
</div>

                {/* <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Area <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                    value={selectedArea}
                    onChange={handleAreaChange}
                    required
                  >
                    <option value="" disabled>
                      Select Area 
                    </option>
                    {areaOptions
                      ?.slice()
                      .sort((a, b) => Number(a.pincode) - Number(b.pincode))
                      .map((area, idx) => (
                        <option
                          key={`${area.pincode}-${idx}`}
                          value={area.name}
                        >
                          {area.name} - {area.pincode}
                        </option>
                      ))}
                  </select>
                  <MapPin
                    className="absolute left-3 top-[38px] text-blue-400"
                    size={20}
                  />
                </div>

                {/* Subarea Dropdown */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subarea
                  </label>
                  <select
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                    value={selectedSubArea}
                    onChange={(e) => setSelectedSubArea(e.target.value)}
                    disabled={!subAreaOptions.length}
                  >
                    <option value="" disabled>
                      Select Subarea
                    </option>
                    {subAreaOptions.map((sub, idx) => (
                      <option key={sub._id || idx} value={sub.name}>
                        {sub.name}
                      </option>
                    ))}
                  </select>
                  <MapPin
                    className="absolute left-3 top-[38px] text-blue-400"
                    size={20}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
              <h2 className="text-lg font-semibold text-white">
                Meta Information
              </h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Meta Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="metaTitle"
                  value={formData.metaTitle}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter meta title"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Meta Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="metaDescription"
                  value={formData.metaDescription}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter meta description"
                  required
                />
              </div>
            </div>
          </div>

          {/* SEO Content */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-blue-600 mb-4">
              SEO Content
            </h2>
            <JoditEditor
              ref={editor}
              value={formData.seoContent}
              config={config}
              onChange={handleSeoContentChange}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleReset}
                className="w-full sm:w-auto flex items-center gap-2 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                <RefreshCw className="h-5 w-5" />
                Reset
              </button>
              {/* <button
                type="button"
                onClick={onBack}
                className="w-full sm:w-auto px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button> */}
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMetaInfo;
// import { useState, useEffect, useMemo, useRef } from "react";
// import { ArrowLeft, BookOpen, MapPin, RefreshCw } from "lucide-react";
// import { BiSolidCategory } from "react-icons/bi";
// import { getAllCategories, getAllPincodes, createSeoContent } from "../../api/apiMethods";
// import JoditEditor from "jodit-react";
// import HTMLReactParser from "html-react-parser";
// import { useNavigate } from "react-router-dom";
// import { Document, Packer, Paragraph, Table, TableRow, TableCell, WidthType, TextRun } from "docx";

// const AddMetaInfo: React.FC = () => {
//   const [categories, setCategories] = useState<any[]>([]);
//   const [pincodeData, setPincodeData] = useState<any[]>([]);
//   const [areaOptions, setAreaOptions] = useState<any[]>([]);
//   const [selectedCategory, setSelectedCategory] = useState({
//     name: "",
//     slug: "",
//     id: "",
//   });
//   const [selectedArea, setSelectedArea] = useState("");
//   const [selectedPincode, setSelectedPincode] = useState("");
//   const [selectedCity, setSelectedCity] = useState("Hyderabad");
//   const [selectedState, setSelectedState] = useState("Telangana");
//   const [formData, setFormData] = useState({
//     categoryId: "",
//     areaName: "",
//     city: "",
//     state: "",
//     pincode: "",
//     metaTitle: "",
//     metaDescription: "",
//     seoContent: "",
//   });
//   const [error, setError] = useState<string | null>(null);
//   const editor = useRef(null);
//   const navigate = useNavigate();

//   // JoditEditor configuration
//   const config = useMemo(
//     () => ({
//       height: 400,
//       buttons: [
//         "bold",
//         "italic",
//         "underline",
//         "|",
//         "ul",
//         "ol",
//         "|",
//         "link",
//         "table",
//         "|",
//         "font", // Font family
//         "fontsize", // Font size
//         "brush", // Text and background color
//         "|",
//         { name: "heading", list: ["h1", "h2", "h3", "h4", "h5", "h6"] }, // Heading levels
//         "|",
//         "undo",
//         "redo",
//       ],
//       toolbarAdaptive: false,
//       placeholder: "Enter SEO content here...",
//       style: {
//         font: "16px Arial", // Default font and size
//       },
//       colors: {
//         // Custom color palette for text and background
//         text: [
//           "#000000",
//           "#FF0000",
//           "#00FF00",
//           "#0000FF",
//           "#FFFF00",
//           "#FF00FF",
//           "#00FFFF",
//         ],
//         background: [
//           "#FFFFFF",
//           "#FFCCCC",
//           "#CCFFCC",
//           "#CCCCFF",
//           "#FFFFCC",
//           "#FFCCFF",
//           "#CCFFFF",
//         ],
//       },
//       fonts: [
//         "Arial",
//         "Helvetica",
//         "Times New Roman",
//         "Courier New",
//         "Verdana",
//         "Georgia",
//         "Trebuchet MS",
//       ],
//       fontSize: [
//         "8",
//         "10",
//         "12",
//         "14",
//         "16",
//         "18",
//         "24",
//         "30",
//         "36",
//       ],
//       // Custom styles for JoditEditor UI
//       iframe: false,
//       styleValues: {
//         "jodit-container": "border border-gray-300 rounded-lg shadow-sm",
//         "jodit-toolbar__box": "bg-gray-50 border-b border-gray-300 rounded-t-lg p-2",
//         "jodit-toolbar-button": "text-gray-700 hover:bg-blue-100 hover:text-blue-600 px-2 py-1 rounded transition",
//         "jodit-toolbar-button_active": "bg-blue-500 text-white",
//         "jodit-wysiwyg": "p-4 min-h-[400px] focus:outline-none focus:ring-2 focus:ring-blue-500",
//       },
//     }),
//     []
//   );

//   // Fetch categories
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const res = await getAllCategories();
//         if (res.success && Array.isArray(res.data)) {
//           setCategories(res.data.filter((cat: any) => cat?.status === 1));
//         } else {
//           setError("Failed to fetch categories");
//         }
//       } catch (err) {
//         setError("Error fetching categories");
//       }
//     };
//     fetchCategories();
//   }, []);

//   // Fetch pincode and area data
//   useEffect(() => {
//     const fetchPincodeInfo = async () => {
//       try {
//         const res = await getAllPincodes();
//         if (res.success && Array.isArray(res.data)) {
//           setPincodeData(res.data);
//         } else {
//           setError("Failed to fetch pincodes");
//         }
//       } catch (err) {
//         setError("Error fetching pincodes");
//       }
//     };
//     fetchPincodeInfo();
//   }, []);

//   // Update area options when pincodeData changes
//   useEffect(() => {
//     const flattenedAreas = pincodeData.flatMap((p: any) =>
//       p.areas.map((area: any) => ({
//         ...area,
//         pincode: p.code,
//         state: p.state,
//         city: p.city,
//       }))
//     );
//     setAreaOptions(flattenedAreas);
//   }, [pincodeData]);

//   // Handle area selection
//   const handleAreaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const areaName = e.target.value;
//     setSelectedArea(areaName);
//     const matchedPincodeObj = pincodeData.find((p: any) =>
//       p.areas.some((a: any) => a.name === areaName)
//     );
//     if (matchedPincodeObj) {
//       setSelectedPincode(matchedPincodeObj.code);
//       setSelectedState(matchedPincodeObj.state);
//       setSelectedCity(matchedPincodeObj.city);
//     } else {
//       setSelectedPincode("");
//     }
//   };

//   // Handle category selection
//   const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const index = e.target.selectedIndex - 1;
//     if (index >= 0) {
//       const cat = categories[index];
//       setSelectedCategory({
//         name: cat.category_name,
//         slug: cat.category_slug,
//         id: cat._id,
//       });
//       setFormData((prev) => ({ ...prev, categoryId: cat._id }));
//     } else {
//       setSelectedCategory({ name: "", slug: "", id: "" });
//       setFormData((prev) => ({ ...prev, categoryId: "" }));
//     }
//   };

//   // Handle input changes for meta title/description
//   const handleInputChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   // Handle JoditEditor content change
//   const handleJoditChange = (newContent: string) => {
//     setFormData((prev) => ({ ...prev, seoContent: newContent }));
//   };

//   // Handle form submission
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");
//     try {
//       if (
//         !formData.categoryId ||
//         !selectedArea ||
//         !selectedPincode ||
//         !formData.metaTitle ||
//         !formData.metaDescription ||
//         !formData.seoContent
//       ) {
//         setError("Please fill all required fields");
//         return;
//       }
//       const requestData = {
//         categoryId: formData.categoryId,
//         areaName: selectedArea,
//         city: selectedCity,
//         state: selectedState,
//         pincode: selectedPincode,
//         meta_title: formData.metaTitle,
//         meta_description: formData.metaDescription,
//         seo_content: formData.seoContent,
//       };
//       const response = await createSeoContent(requestData);
//       if (response?.success) {
//         alert("Meta Info added successfully!");
//         handleReset();
//       } else {
//         throw new Error(response?.message || "Failed to submit");
//       }
//     } catch (error: any) {
//       const errorMessage = error?.message || "An error occurred.";
//       setError(errorMessage);
//       alert(errorMessage);
//     }
//   };

//   // Handle form reset
//   const handleReset = () => {
//     setSelectedCategory({ name: "", slug: "", id: "" });
//     setSelectedCity("Hyderabad");
//     setSelectedState("Telangana");
//     setSelectedPincode("");
//     setSelectedArea("");
//     setFormData({
//       categoryId: "",
//       areaName: "",
//       city: "",
//       state: "",
//       pincode: "",
//       metaTitle: "",
//       metaDescription: "",
//       seoContent: "",
//     });
//     setError(null);
//   };

//   // Generate and download Word document
//   const generateWordDocument = () => {
//     const doc = new Document({
//       sections: [
//         {
//           properties: {},
//           children: [
//             new Paragraph({
//               children: [
//                 new TextRun({
//                   text: `SEO Content for ${selectedCategory.name} in ${
//                     selectedArea || "Hyderabad"
//                   }`,
//                   bold: true,
//                   size: 28,
//                 }),
//               ],
//               spacing: { after: 200 },
//             }),
//             new Paragraph({
//               children: [
//                 new TextRun({ text: `Meta Title: ${formData.metaTitle}` }),
//               ],
//               spacing: { after: 100 },
//             }),
//             new Paragraph({
//               children: [
//                 new TextRun({
//                   text: `Meta Description: ${formData.metaDescription}`,
//                 }),
//               ],
//               spacing: { after: 200 },
//             }),
//             ...parseHtmlToDocx(formData.seoContent),
//           ],
//         },
//       ],
//     });

//     Packer.toBlob(doc).then((blob) => {
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement("a");
//       a.href = url;
//       a.download = `SEO_Content_${selectedCategory.name}_${selectedArea}.docx`;
//       a.click();
//       window.URL.revokeObjectURL(url);
//     });
//   };

//   // Parse HTML to DOCX elements (supports headings, paragraphs, tables, colors, and fonts)
//   const parseHtmlToDocx = (html: string): any[] => {
//     const parser = new DOMParser();
//     const doc = parser.parseFromString(html, "text/html");
//     const elements = doc.body.children;
//     const docxElements: any[] = [];

//     Array.from(elements).forEach((element) => {
//       const style = element.getAttribute("style") || "";
//       let font = "Arial";
//       let size = 20; // Default size in half-points (10pt)
//       let color = undefined;
//       let bold = false;

//       // Parse style attribute for font, size, and color
//       if (style) {
//         const fontMatch = style.match(/font-family:\s*([^;]+)/);
//         const sizeMatch = style.match(/font-size:\s*(\d+)px/);
//         const colorMatch = style.match(/color:\s*(#[0-9A-Fa-f]{6}|rgb\([^)]+\))/);
//         const weightMatch = style.match(/font-weight:\s*bold/);

//         if (fontMatch) font = fontMatch[1].replace(/['"]/g, "");
//         if (sizeMatch) size = parseInt(sizeMatch[1]) * 2; // Convert px to half-points
//         if (colorMatch) color = colorMatch[1].replace("#", "");
//         if (weightMatch) bold = true;
//       }

//       if (element.tagName.match(/^H[1-6]$/)) {
//         const level = parseInt(element.tagName.replace("H", ""));
//         docxElements.push(
//           new Paragraph({
//             children: [
//               new TextRun({
//                 text: element.textContent || "",
//                 bold: true,
//                 size: 24 - level * 2, // Decrease size for lower headings
//                 font,
//                 color,
//               }),
//             ],
//             spacing: { after: 100 },
//           })
//         );
//       } else if (element.tagName === "P") {
//         docxElements.push(
//           new Paragraph({
//             children: [
//               new TextRun({
//                 text: element.textContent || "",
//                 font,
//                 size,
//                 color,
//                 bold,
//               }),
//             ],
//             spacing: { after: 100 },
//           })
//         );
//       } else if (element.tagName === "TABLE") {
//         const rows: TableRow[] = [];
//         const trs = element.querySelectorAll("tr");
//         trs.forEach((tr) => {
//           const cells: TableCell[] = [];
//           const tds = tr.querySelectorAll("td, th");
//           tds.forEach((td) => {
//             const tdStyle = td.getAttribute("style") || "";
//             let tdColor = undefined;
//             if (tdStyle) {
//               const bgMatch = tdStyle.match(/background-color:\s*(#[0-9A-Fa-f]{6}|rgb\([^)]+\))/);
//               if (bgMatch) tdColor = bgMatch[1].replace("#", "");
//             }
//             cells.push(
//               new TableCell({
//                 children: [
//                   new Paragraph({
//                     children: [
//                       new TextRun({
//                         text: td.textContent || "",
//                         font,
//                         size,
//                         color,
//                         bold,
//                       }),
//                     ],
//                   }),
//                 ],
//                 width: { size: 25, type: WidthType.PERCENTAGE },
//                 shading: tdColor ? { fill: tdColor } : undefined,
//               })
//             );
//           });
//           rows.push(new TableRow({ children: cells }));
//         });
//         docxElements.push(
//           new Table({
//             rows,
//             width: { size: 100, type: WidthType.PERCENTAGE },
//           })
//         );
//       }
//     });

//     return docxElements;
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
//       <div className="max-w-4xl mx-auto">
//         <div className="flex items-center justify-between mb-8">
//           <div className="flex items-center gap-3">
//             <BookOpen className="h-6 w-6 text-blue-600" />
//             <h1 className="text-3xl font-bold text-gray-900">Add Meta Info</h1>
//           </div>
//           <button
//             onClick={() => navigate(-1)}
//             className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 bg-white rounded-lg shadow-sm"
//           >
//             <ArrowLeft className="h-4 w-4 mr-2" />
//             Back
//           </button>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-8">
//           {error && <div className="text-red-500 mb-4">{error}</div>}

//           <div className="bg-white rounded-xl shadow-lg p-6">
//             <h2 className="text-lg font-semibold text-blue-600 mb-4">
//               Search Selection
//             </h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Category <span className="text-red-500">*</span>
//                 </label>
//                 <div className="relative">
//                   <select
//                     className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                     value={selectedCategory.name}
//                     onChange={handleCategoryChange}
//                     required
//                   >
//                     <option value="" disabled>
//                       Select Category
//                     </option>
//                     {categories
//                       .sort((a, b) =>
//                         a.category_name.localeCompare(b.category_name)
//                       )
//                       .map((cat, idx) => (
//                         <option key={idx} value={cat.category_name}>
//                           {cat.category_name}
//                         </option>
//                       ))}
//                   </select>
//                   <BiSolidCategory
//                     className="absolute left-3 top-3 text-blue-400"
//                     size={20}
//                   />
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Area <span className="text-red-500">*</span>
//                 </label>
//                 <div className="relative">
//                   <select
//                     className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                     value={selectedArea}
//                     onChange={handleAreaChange}
//                     required
//                   >
//                     <option value="" disabled>
//                       Select Area
//                     </option>
//                     {areaOptions
//                       .sort((a, b) => Number(a.pincode) - Number(b.pincode))
//                       .map((area, idx) => (
//                         <option
//                           key={`${area.pincode}-${idx}`}
//                           value={area.name}
//                         >
//                           {area.name} - {area.pincode}
//                         </option>
//                       ))}
//                   </select>
//                   <MapPin
//                     className="absolute left-3 top-3 text-blue-400"
//                     size={20}
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-xl shadow-lg p-6">
//             <h2 className="text-lg font-semibold text-blue-600 mb-4">
//               Meta Information
//             </h2>
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">
//                   Meta Title <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   name="metaTitle"
//                   value={formData.metaTitle}
//                   onChange={handleInputChange}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                   placeholder="Enter meta title"
//                   required
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">
//                   Meta Description <span className="text-red-500">*</span>
//                 </label>
//                 <textarea
//                   name="metaDescription"
//                   value={formData.metaDescription}
//                   onChange={handleInputChange}
//                   rows={3}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                   placeholder="Enter meta description"
//                   required
//                 />
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-xl shadow-lg p-6">
//             <h2 className="text-lg font-semibold text-blue-600 mb-4">
//               SEO Content
//             </h2>
//             <JoditEditor
//               ref={editor}
//               value={formData.seoContent}
//               config={config}
//               onChange={handleJoditChange}
//             />
//             <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
//               {HTMLReactParser(formData.seoContent)}
//             </div>
//           </div>

//           <div className="flex flex-col sm:flex-row gap-4">
//             <button
//               type="button"
//               onClick={handleReset}
//               className="flex items-center gap-2 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
//             >
//               <RefreshCw className="h-5 w-5" />
//               Reset
//             </button>
//             <button
//               type="submit"
//               className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
//             >
//               Add
//             </button>
//             <button
//               type="button"
//               onClick={generateWordDocument}
//               className="flex items-center gap-2 px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
//             >
//               Download Word Document
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddMetaInfo;
// import { useState, useEffect, useMemo, useRef } from "react";
// import { ArrowLeft, BookOpen, MapPin, RefreshCw } from "lucide-react";
// import { BiSolidCategory } from "react-icons/bi";
// import { getAllCategories, getAllPincodes, createSeoContent } from "../../api/apiMethods";
// import JoditEditor from "jodit-react";
// import HTMLReactParser from "html-react-parser";
// import { useNavigate } from "react-router-dom";
// import { Document, Packer, Paragraph, Table, TableRow, TableCell, WidthType, TextRun } from "docx";

// const AddMetaInfo: React.FC = () => {
//   const [categories, setCategories] = useState<any[]>([]);
//   const [pincodeData, setPincodeData] = useState<any[]>([]);
//   const [areaOptions, setAreaOptions] = useState<any[]>([]);
//   const [selectedCategory, setSelectedCategory] = useState({
//     name: "",
//     slug: "",
//     id: "",
//   });
//   const [selectedArea, setSelectedArea] = useState("");
//   const [selectedPincode, setSelectedPincode] = useState("");
//   const [selectedCity, setSelectedCity] = useState("Hyderabad");
//   const [selectedState, setSelectedState] = useState("Telangana");
//   const [formData, setFormData] = useState({
//     categoryId: "",
//     areaName: "",
//     city: "",
//     state: "",
//     pincode: "",
//     metaTitle: "",
//     metaDescription: "",
//     seoContent: "",
//   });
//   const [error, setError] = useState<string | null>(null);
//   const editor = useRef(null);
//   const navigate = useNavigate();

//   // JoditEditor configuration
//   const config = useMemo(
//     () => ({
//       height: 400,
//       buttons: [
//         "bold",
//         "italic",
//         "underline",
//         "|",
//         "ul",
//         "ol",
//         "|",
//         "link",
//         "table",
//         "|",
//         "font", // Font family
//         "fontsize", // Font size
//         "brush", // Text and background color
//         "|",
//         { name: "heading", list: ["h1", "h2", "h3", "h4", "h5", "h6"] }, // Heading levels
//         "|",
//         "undo",
//         "redo",
//       ],
//       toolbarAdaptive: false,
//       placeholder: "Enter SEO content here...",
//       style: {
//         font: "16px Arial", // Default font and size
//       },
//       colors: {
//         // Custom color palette for text and background
//         text: [
//           "#000000",
//           "#FF0000",
//           "#00FF00",
//           "#0000FF",
//           "#FFFF00",
//           "#FF00FF",
//           "#00FFFF",
//         ],
//         background: [
//           "#FFFFFF",
//           "#FFCCCC",
//           "#CCFFCC",
//           "#CCCCFF",
//           "#FFFFCC",
//           "#FFCCFF",
//           "#CCFFFF",
//         ],
//       },
//       fonts: [
//         "Arial",
//         "Helvetica",
//         "Times New Roman",
//         "Courier New",
//         "Verdana",
//         "Georgia",
//         "Trebuchet MS",
//       ],
//       fontSize: [
//         "8",
//         "10",
//         "12",
//         "14",
//         "16",
//         "18",
//         "24",
//         "30",
//         "36",
//       ],
//     }),
//     []
//   );

//   // Fetch categories
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const res = await getAllCategories();
//         if (res.success && Array.isArray(res.data)) {
//           setCategories(res.data.filter((cat: any) => cat?.status === 1));
//         } else {
//           setError("Failed to fetch categories");
//         }
//       } catch (err) {
//         setError("Error fetching categories");
//       }
//     };
//     fetchCategories();
//   }, []);

//   // Fetch pincode and area data
//   useEffect(() => {
//     const fetchPincodeInfo = async () => {
//       try {
//         const res = await getAllPincodes();
//         if (res.success && Array.isArray(res.data)) {
//           setPincodeData(res.data);
//         } else {
//           setError("Failed to fetch pincodes");
//         }
//       } catch (err) {
//         setError("Error fetching pincodes");
//       }
//     };
//     fetchPincodeInfo();
//   }, []);

//   // Update area options when pincodeData changes
//   useEffect(() => {
//     const flattenedAreas = pincodeData.flatMap((p: any) =>
//       p.areas.map((area: any) => ({
//         ...area,
//         pincode: p.code,
//         state: p.state,
//         city: p.city,
//       }))
//     );
//     setAreaOptions(flattenedAreas);
//   }, [pincodeData]);

//   // Handle area selection
//   const handleAreaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const areaName = e.target.value;
//     setSelectedArea(areaName);
//     const matchedPincodeObj = pincodeData.find((p: any) =>
//       p.areas.some((a: any) => a.name === areaName)
//     );
//     if (matchedPincodeObj) {
//       setSelectedPincode(matchedPincodeObj.code);
//       setSelectedState(matchedPincodeObj.state);
//       setSelectedCity(matchedPincodeObj.city);
//     } else {
//       setSelectedPincode("");
//     }
//   };

//   // Handle category selection
//   const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const index = e.target.selectedIndex - 1;
//     if (index >= 0) {
//       const cat = categories[index];
//       setSelectedCategory({
//         name: cat.category_name,
//         slug: cat.category_slug,
//         id: cat._id,
//       });
//       setFormData((prev) => ({ ...prev, categoryId: cat._id }));
//     } else {
//       setSelectedCategory({ name: "", slug: "", id: "" });
//       setFormData((prev) => ({ ...prev, categoryId: "" }));
//     }
//   };

//   // Handle input changes for meta title/description
//   const handleInputChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   // Handle JoditEditor content change
//   const handleJoditChange = (newContent: string) => {
//     setFormData((prev) => ({ ...prev, seoContent: newContent }));
//   };

//   // Handle form submission
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");
//     try {
//       if (
//         !formData.categoryId ||
//         !selectedArea ||
//         !selectedPincode ||
//         !formData.metaTitle ||
//         !formData.metaDescription ||
//         !formData.seoContent
//       ) {
//         setError("Please fill all required fields");
//         return;
//       }
//       const requestData = {
//         categoryId: formData.categoryId,
//         areaName: selectedArea,
//         city: selectedCity,
//         state: selectedState,
//         pincode: selectedPincode,
//         meta_title: formData.metaTitle,
//         meta_description: formData.metaDescription,
//         seo_content: formData.seoContent,
//       };
//       const response = await createSeoContent(requestData);
//       if (response?.success) {
//         alert("Meta Info added successfully!");
//         handleReset();
//       } else {
//         throw new Error(response?.message || "Failed to submit");
//       }
//     } catch (error: any) {
//       const errorMessage = error?.message || "An error occurred.";
//       setError(errorMessage);
//       alert(errorMessage);
//     }
//   };

//   // Handle form reset
//   const handleReset = () => {
//     setSelectedCategory({ name: "", slug: "", id: "" });
//     setSelectedCity("Hyderabad");
//     setSelectedState("Telangana");
//     setSelectedPincode("");
//     setSelectedArea("");
//     setFormData({
//       categoryId: "",
//       areaName: "",
//       city: "",
//       state: "",
//       pincode: "",
//       metaTitle: "",
//       metaDescription: "",
//       seoContent: "",
//     });
//     setError(null);
//   };

//   // Generate and download Word document
//   const generateWordDocument = () => {
//     const doc = new Document({
//       sections: [
//         {
//           properties: {},
//           children: [
//             new Paragraph({
//               children: [
//                 new TextRun({
//                   text: `SEO Content for ${selectedCategory.name} in ${
//                     selectedArea || "Hyderabad"
//                   }`,
//                   bold: true,
//                   size: 28,
//                 }),
//               ],
//               spacing: { after: 200 },
//             }),
//             new Paragraph({
//               children: [
//                 new TextRun({ text: `Meta Title: ${formData.metaTitle}` }),
//               ],
//               spacing: { after: 100 },
//             }),
//             new Paragraph({
//               children: [
//                 new TextRun({
//                   text: `Meta Description: ${formData.metaDescription}`,
//                 }),
//               ],
//               spacing: { after: 200 },
//             }),
//             ...parseHtmlToDocx(formData.seoContent),
//           ],
//         },
//       ],
//     });

//     Packer.toBlob(doc).then((blob) => {
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement("a");
//       a.href = url;
//       a.download = `SEO_Content_${selectedCategory.name}_${selectedArea}.docx`;
//       a.click();
//       window.URL.revokeObjectURL(url);
//     });
//   };

//   // Parse HTML to DOCX elements (supports headings, paragraphs, tables, colors, and fonts)
//   const parseHtmlToDocx = (html: string): any[] => {
//     const parser = new DOMParser();
//     const doc = parser.parseFromString(html, "text/html");
//     const elements = doc.body.children;
//     const docxElements: any[] = [];

//     Array.from(elements).forEach((element) => {
//       const style = element.getAttribute("style") || "";
//       let font = "Arial";
//       let size = 20; // Default size in half-points (10pt)
//       let color = undefined;
//       let bold = false;

//       // Parse style attribute for font, size, and color
//       if (style) {
//         const fontMatch = style.match(/font-family:\s*([^;]+)/);
//         const sizeMatch = style.match(/font-size:\s*(\d+)px/);
//         const colorMatch = style.match(/color:\s*(#[0-9A-Fa-f]{6}|rgb\([^)]+\))/);
//         const weightMatch = style.match(/font-weight:\s*bold/);

//         if (fontMatch) font = fontMatch[1].replace(/['"]/g, "");
//         if (sizeMatch) size = parseInt(sizeMatch[1]) * 2; // Convert px to half-points
//         if (colorMatch) color = colorMatch[1].replace("#", "");
//         if (weightMatch) bold = true;
//       }

//       if (element.tagName.match(/^H[1-6]$/)) {
//         const level = parseInt(element.tagName.replace("H", ""));
//         docxElements.push(
//           new Paragraph({
//             children: [
//               new TextRun({
//                 text: element.textContent || "",
//                 bold: true,
//                 size: 24 - level * 2, // Decrease size for lower headings
//                 font,
//                 color,
//               }),
//             ],
//             spacing: { after: 100 },
//           })
//         );
//       } else if (element.tagName === "P") {
//         docxElements.push(
//           new Paragraph({
//             children: [
//               new TextRun({
//                 text: element.textContent || "",
//                 font,
//                 size,
//                 color,
//                 bold,
//               }),
//             ],
//             spacing: { after: 100 },
//           })
//         );
//       } else if (element.tagName === "TABLE") {
//         const rows: TableRow[] = [];
//         const trs = element.querySelectorAll("tr");
//         trs.forEach((tr) => {
//           const cells: TableCell[] = [];
//           const tds = tr.querySelectorAll("td, th");
//           tds.forEach((td) => {
//             const tdStyle = td.getAttribute("style") || "";
//             let tdColor = undefined;
//             if (tdStyle) {
//               const bgMatch = tdStyle.match(/background-color:\s*(#[0-9A-Fa-f]{6}|rgb\([^)]+\))/);
//               if (bgMatch) tdColor = bgMatch[1].replace("#", "");
//             }
//             cells.push(
//               new TableCell({
//                 children: [
//                   new Paragraph({
//                     children: [
//                       new TextRun({
//                         text: td.textContent || "",
//                         font,
//                         size,
//                         color,
//                         bold,
//                       }),
//                     ],
//                   }),
//                 ],
//                 width: { size: 25, type: WidthType.PERCENTAGE },
//                 shading: tdColor ? { fill: tdColor } : undefined,
//               })
//             );
//           });
//           rows.push(new TableRow({ children: cells }));
//         });
//         docxElements.push(
//           new Table({
//             rows,
//             width: { size: 100, type: WidthType.PERCENTAGE },
//           })
//         );
//       }
//     });

//     return docxElements;
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
//       <div className="max-w-4xl mx-auto">
//         <div className="flex items-center justify-between mb-8">
//           <div className="flex items-center gap-3">
//             <BookOpen className="h-6 w-6 text-blue-600" />
//             <h1 className="text-3xl font-bold text-gray-900">Add Meta Info</h1>
//           </div>
//           <button
//             onClick={() => navigate(-1)}
//             className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 bg-white rounded-lg shadow-sm"
//           >
//             <ArrowLeft className="h-4 w-4 mr-2" />
//             Back
//           </button>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-8">
//           {error && <div className="text-red-500 mb-4">{error}</div>}

//           <div className="bg-white rounded-xl shadow-lg p-6">
//             <h2 className="text-lg font-semibold text-blue-600 mb-4">
//               Search Selection
//             </h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Category <span className="text-red-500">*</span>
//                 </label>
//                 <div className="relative">
//                   <select
//                     className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                     value={selectedCategory.name}
//                     onChange={handleCategoryChange}
//                     required
//                   >
//                     <option value="" disabled>
//                       Select Category
//                     </option>
//                     {categories
//                       .sort((a, b) =>
//                         a.category_name.localeCompare(b.category_name)
//                       )
//                       .map((cat, idx) => (
//                         <option key={idx} value={cat.category_name}>
//                           {cat.category_name}
//                         </option>
//                       ))}
//                   </select>
//                   <BiSolidCategory
//                     className="absolute left-3 top-3 text-blue-400"
//                     size={20}
//                   />
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Area <span className="text-red-500">*</span>
//                 </label>
//                 <div className="relative">
//                   <select
//                     className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                     value={selectedArea}
//                     onChange={handleAreaChange}
//                     required
//                   >
//                     <option value="" disabled>
//                       Select Area
//                     </option>
//                     {areaOptions
//                       .sort((a, b) => Number(a.pincode) - Number(b.pincode))
//                       .map((area, idx) => (
//                         <option
//                           key={`${area.pincode}-${idx}`}
//                           value={area.name}
//                         >
//                           {area.name} - {area.pincode}
//                         </option>
//                       ))}
//                   </select>
//                   <MapPin
//                     className="absolute left-3 top-3 text-blue-400"
//                     size={20}
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-xl shadow-lg p-6">
//             <h2 className="text-lg font-semibold text-blue-600 mb-4">
//               Meta Information
//             </h2>
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">
//                   Meta Title <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   name="metaTitle"
//                   value={formData.metaTitle}
//                   onChange={handleInputChange}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                   placeholder="Enter meta title"
//                   required
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">
//                   Meta Description <span className="text-red-500">*</span>
//                 </label>
//                 <textarea
//                   name="metaDescription"
//                   value={formData.metaDescription}
//                   onChange={handleInputChange}
//                   rows={3}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                   placeholder="Enter meta description"
//                   required
//                 />
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-xl shadow-lg p-6">
//             <h2 className="text-lg font-semibold text-blue-600 mb-4">
//               SEO Content
//             </h2>
//             <JoditEditor
//               ref={editor}
//               value={formData.seoContent}
//               config={config}
//               onChange={handleJoditChange}
//             />
//             <div className="mt-4">{HTMLReactParser(formData.seoContent)}</div>
//           </div>

//           <div className="flex flex-col sm:flex-row gap-4">
//             <button
//               type="button"
//               onClick={handleReset}
//               className="flex items-center gap-2 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
//             >
//               <RefreshCw className="h-5 w-5" />
//               Reset
//             </button>
//             <button
//               type="submit"
//               className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//             >
//               Add
//             </button>
//             <button
//               type="button"
//               onClick={generateWordDocument}
//               className="flex items-center gap-2 px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
//             >
//               Download Word Document
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddMetaInfo;
// import { useState, useEffect, useMemo, useRef } from "react";
// import { ArrowLeft, BookOpen, MapPin, RefreshCw } from "lucide-react";
// import { BiSolidCategory } from "react-icons/bi";
// import { getAllCategories, getAllPincodes, createSeoContent } from "../../api/apiMethods";
// import JoditEditor from "jodit-react";
// import HTMLReactParser from "html-react-parser";
// import { useNavigate } from "react-router-dom";
// import { Document, Packer, Paragraph, Table, TableRow, TableCell, WidthType, TextRun } from "docx";

// const AddMetaInfo: React.FC = () => {
//   const [categories, setCategories] = useState<any[]>([]);
//   const [pincodeData, setPincodeData] = useState<any[]>([]);
//   const [areaOptions, setAreaOptions] = useState<any[]>([]);
//   const [selectedCategory, setSelectedCategory] = useState({
//     name: "",
//     slug: "",
//     id: "",
//   });
//   const [selectedArea, setSelectedArea] = useState("");
//   const [selectedPincode, setSelectedPincode] = useState("");
//   const [selectedCity, setSelectedCity] = useState("Hyderabad");
//   const [selectedState, setSelectedState] = useState("Telangana");
//   const [formData, setFormData] = useState({
//     categoryId: "",
//     areaName: "",
//     city: "",
//     state: "",
//     pincode: "",
//     metaTitle: "",
//     metaDescription: "",
//     seoContent: "",
//   });
//   const [error, setError] = useState<string | null>(null);
//   const editor = useRef(null);
//   const navigate = useNavigate();

//   // JoditEditor configuration
//   const config = useMemo(
//     () => ({
//       height: 400,
//       buttons: [
//         "bold",
//         "italic",
//         "underline",
//         "|",
//         "ul",
//         "ol",
//         "|",
//         "link",
//         "table",
//         "|",
//         "undo",
//         "redo",
//       ],
//       toolbarAdaptive: false,
//       placeholder: "Enter SEO content here...",
//     }),
//     []
//   );

//   // Fetch categories
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const res = await getAllCategories();
//         if (res.success && Array.isArray(res.data)) {
//           setCategories(res.data.filter((cat: any) => cat?.status === 1));
//         } else {
//           setError("Failed to fetch categories");
//         }
//       } catch (err) {
//         setError("Error fetching categories");
//       }
//     };
//     fetchCategories();
//   }, []);

//   // Fetch pincode and area data
//   useEffect(() => {
//     const fetchPincodeInfo = async () => {
//       try {
//         const res = await getAllPincodes();
//         if (res.success && Array.isArray(res.data)) {
//           setPincodeData(res.data);
//         } else {
//           setError("Failed to fetch pincodes");
//         }
//       } catch (err) {
//         setError("Error fetching pincodes");
//       }
//     };
//     fetchPincodeInfo();
//   }, []);

//   // Update area options when pincodeData changes
//   useEffect(() => {
//     const flattenedAreas = pincodeData.flatMap((p: any) =>
//       p.areas.map((area: any) => ({
//         ...area,
//         pincode: p.code,
//         state: p.state,
//         city: p.city,
//       }))
//     );
//     setAreaOptions(flattenedAreas);
//   }, [pincodeData]);

//   // Handle area selection
//   const handleAreaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const areaName = e.target.value;
//     setSelectedArea(areaName);
//     const matchedPincodeObj = pincodeData.find((p: any) =>
//       p.areas.some((a: any) => a.name === areaName)
//     );
//     if (matchedPincodeObj) {
//       setSelectedPincode(matchedPincodeObj.code);
//       setSelectedState(matchedPincodeObj.state);
//       setSelectedCity(matchedPincodeObj.city);
//     } else {
//       setSelectedPincode("");
//     }
//   };

//   // Handle category selection
//   const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const index = e.target.selectedIndex - 1;
//     if (index >= 0) {
//       const cat = categories[index];
//       setSelectedCategory({
//         name: cat.category_name,
//         slug: cat.category_slug,
//         id: cat._id,
//       });
//       setFormData((prev) => ({ ...prev, categoryId: cat._id }));
//     } else {
//       setSelectedCategory({ name: "", slug: "", id: "" });
//       setFormData((prev) => ({ ...prev, categoryId: "" }));
//     }
//   };

//   // Handle input changes for meta title/description
//   const handleInputChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   // Handle JoditEditor content change
//   const handleJoditChange = (newContent: string) => {
//     setFormData((prev) => ({ ...prev, seoContent: newContent }));
//   };

//   // Handle form submission
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");
//     try {
//       if (
//         !formData.categoryId ||
//         !selectedArea ||
//         !selectedPincode ||
//         !formData.metaTitle ||
//         !formData.metaDescription ||
//         !formData.seoContent
//       ) {
//         setError("Please fill all required fields");
//         return;
//       }
//       const requestData = {
//         categoryId: formData.categoryId,
//         areaName: selectedArea,
//         city: selectedCity,
//         state: selectedState,
//         pincode: selectedPincode,
//         meta_title: formData.metaTitle,
//         meta_description: formData.metaDescription,
//         seo_content: formData.seoContent,
//       };
//       const response = await createSeoContent(requestData);
//       if (response?.success) {
//         alert("Meta Info added successfully!");
//         handleReset();
//       } else {
//         throw new Error(response?.message || "Failed to submit");
//       }
//     } catch (error: any) {
//       const errorMessage = error?.message || "An error occurred.";
//       setError(errorMessage);
//       alert(errorMessage);
//     }
//   };

//   // Handle form reset
//   const handleReset = () => {
//     setSelectedCategory({ name: "", slug: "", id: "" });
//     setSelectedCity("Hyderabad");
//     setSelectedState("Telangana");
//     setSelectedPincode("");
//     setSelectedArea("");
//     setFormData({
//       categoryId: "",
//       areaName: "",
//       city: "",
//       state: "",
//       pincode: "",
//       metaTitle: "",
//       metaDescription: "",
//       seoContent: "",
//     });
//     setError(null);
//   };

//   // Generate and download Word document
//   const generateWordDocument = () => {
//     const doc = new Document({
//       sections: [
//         {
//           properties: {},
//           children: [
//             new Paragraph({
//               children: [
//                 new TextRun({
//                   text: `SEO Content for ${selectedCategory.name} in ${
//                     selectedArea || "Hyderabad"
//                   }`,
//                   bold: true,
//                   size: 28,
//                 }),
//               ],
//               spacing: { after: 200 },
//             }),
//             new Paragraph({
//               children: [
//                 new TextRun({ text: `Meta Title: ${formData.metaTitle}` }),
//               ],
//               spacing: { after: 100 },
//             }),
//             new Paragraph({
//               children: [
//                 new TextRun({
//                   text: `Meta Description: ${formData.metaDescription}`,
//                 }),
//               ],
//               spacing: { after: 200 },
//             }),
//             ...parseHtmlToDocx(formData.seoContent),
//           ],
//         },
//       ],
//     });

//     Packer.toBlob(doc).then((blob) => {
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement("a");
//       a.href = url;
//       a.download = `SEO_Content_${selectedCategory.name}_${selectedArea}.docx`;
//       a.click();
//       window.URL.revokeObjectURL(url);
//     });
//   };

//   // Parse HTML to DOCX elements (supports headings, paragraphs and basic tables)
//   const parseHtmlToDocx = (html: string): any[] => {
//     const parser = new DOMParser();
//     const doc = parser.parseFromString(html, "text/html");
//     const elements = doc.body.children;
//     const docxElements: any[] = [];

//     Array.from(elements).forEach((element) => {
//       if (element.tagName.match(/^H[1-6]$/)) {
//         docxElements.push(
//           new Paragraph({
//             children: [
//               new TextRun({
//                 text: element.textContent || "",
//                 bold: true,
//                 size: 24,
//               }),
//             ],
//             spacing: { after: 100 },
//           })
//         );
//       } else if (element.tagName === "P") {
//         docxElements.push(
//           new Paragraph({
//             children: [new TextRun({ text: element.textContent || "" })],
//             spacing: { after: 100 },
//           })
//         );
//       } else if (element.tagName === "TABLE") {
//         const rows: TableRow[] = [];
//         const trs = element.querySelectorAll("tr");
//         trs.forEach((tr) => {
//           const cells: TableCell[] = [];
//           const tds = tr.querySelectorAll("td, th");
//           tds.forEach((td) => {
//             cells.push(
//               new TableCell({
//                 children: [
//                   new Paragraph({
//                     children: [new TextRun({ text: td.textContent || "" })],
//                   }),
//                 ],
//                 width: { size: 25, type: WidthType.PERCENTAGE },
//               })
//             );
//           });
//           rows.push(new TableRow({ children: cells }));
//         });
//         docxElements.push(
//           new Table({
//             rows,
//             width: { size: 100, type: WidthType.PERCENTAGE },
//           })
//         );
//       }
//     });

//     return docxElements;
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
//       <div className="max-w-4xl mx-auto">
//         <div className="flex items-center justify-between mb-8">
//           <div className="flex items-center gap-3">
//             <BookOpen className="h-6 w-6 text-blue-600" />
//             <h1 className="text-3xl font-bold text-gray-900">Add Meta Info</h1>
//           </div>
//           <button
//             onClick={() => navigate(-1)}
//             className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 bg-white rounded-lg shadow-sm"
//           >
//             <ArrowLeft className="h-4 w-4 mr-2" />
//             Back
//           </button>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-8">
//           {error && <div className="text-red-500 mb-4">{error}</div>}

//           <div className="bg-white rounded-xl shadow-lg p-6">
//             <h2 className="text-lg font-semibold text-blue-600 mb-4">
//               Search Selection
//             </h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Category <span className="text-red-500">*</span>
//                 </label>
//                 <div className="relative">
//                   <select
//                     className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                     value={selectedCategory.name}
//                     onChange={handleCategoryChange}
//                     required
//                   >
//                     <option value="" disabled>
//                       Select Category
//                     </option>
//                     {categories
//                       .sort((a, b) =>
//                         a.category_name.localeCompare(b.category_name)
//                       )
//                       .map((cat, idx) => (
//                         <option key={idx} value={cat.category_name}>
//                           {cat.category_name}
//                         </option>
//                       ))}
//                   </select>
//                   <BiSolidCategory
//                     className="absolute left-3 top-3 text-blue-400"
//                     size={20}
//                   />
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Area <span className="text-red-500">*</span>
//                 </label>
//                 <div className="relative">
//                   <select
//                     className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                     value={selectedArea}
//                     onChange={handleAreaChange}
//                     required
//                   >
//                     <option value="" disabled>
//                       Select Area
//                     </option>
//                     {areaOptions
//                       .sort((a, b) => Number(a.pincode) - Number(b.pincode))
//                       .map((area, idx) => (
//                         <option
//                           key={`${area.pincode}-${idx}`}
//                           value={area.name}
//                         >
//                           {area.name} - {area.pincode}
//                         </option>
//                       ))}
//                   </select>
//                   <MapPin
//                     className="absolute left-3 top-3 text-blue-400"
//                     size={20}
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-xl shadow-lg p-6">
//             <h2 className="text-lg font-semibold text-blue-600 mb-4">
//               Meta Information
//             </h2>
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">
//                   Meta Title <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   name="metaTitle"
//                   value={formData.metaTitle}
//                   onChange={handleInputChange}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                   placeholder="Enter meta title"
//                   required
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">
//                   Meta Description <span className="text-red-500">*</span>
//                 </label>
//                 <textarea
//                   name="metaDescription"
//                   value={formData.metaDescription}
//                   onChange={handleInputChange}
//                   rows={3}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                   placeholder="Enter meta description"
//                   required
//                 />
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-xl shadow-lg p-6">
//             <h2 className="text-lg font-semibold text-blue-600 mb-4">
//               SEO Content
//             </h2>
//             <JoditEditor
//               ref={editor}
//               value={formData.seoContent}
//               config={config}
//               onChange={handleJoditChange}
//             />
//             <div className="mt-4">{HTMLReactParser(formData.seoContent)}</div>
//           </div>

//           <div className="flex flex-col sm:flex-row gap-4">
//             <button
//               type="button"
//               onClick={handleReset}
//               className="flex items-center gap-2 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
//             >
//               <RefreshCw className="h-5 w-5" />
//               Reset
//             </button>
//             <button
//               type="submit"
//               className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//             >
//               Add
//             </button>
//             <button
//               type="button"
//               onClick={generateWordDocument}
//               className="flex items-center gap-2 px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
//             >
//               Download Word Document
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddMetaInfo;
// import React, { useState, useEffect, useMemo } from "react";
// import { ArrowLeft, BookOpen, MapPin, RefreshCw, Image, Table, Type, Code, List, AlignLeft, Link, Youtube, FileText } from "lucide-react";
// import { BiSolidCategory } from "react-icons/bi";
// import { getAllCategories, getAllPincodes, createSeoContent } from "../../api/apiMethods";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";
// import { useNavigate } from "react-router-dom";

// const AddMetaInfo: React.FC = () => {
//   const [categories, setCategories] = useState([]);
//   const [pincodeData, setPincodeData] = useState([]);
//   const [areaOptions, setAreaOptions] = useState([]);
//   const [subAreaOptions, setSubAreaOptions] = useState([]);
//   const [selectedCity, setSelectedCity] = useState("Hyderabad");
//   const [selectedState, setSelectedState] = useState("Telangana");
//   const [selectedCategory, setSelectedCategory] = useState({
//     name: "",
//     slug: "",
//     id: "",
//   });
//   const [selectedArea, setSelectedArea] = useState("");
//   const [selectedPincode, setSelectedPincode] = useState("");
//   const [selectedSubArea, setSelectedSubArea] = useState("");
//   const [formData, setFormData] = useState({
//     categoryId: "",
//     areaName: "",
//     city: "",
//     state: "",
//     pincode: "",
//     metaTitle: "",
//     metaDescription: "",
//     seoContent: "",
//   });
//   const [error, setError] = useState<string | null>(null);
//   const [isImageModalOpen, setIsImageModalOpen] = useState(false);
//   const [imageUrl, setImageUrl] = useState("");
//   const [imageAlt, setImageAlt] = useState("");
//   const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
//   const [linkUrl, setLinkUrl] = useState("");
//   const [linkText, setLinkText] = useState("");
//   const [isYoutubeModalOpen, setIsYoutubeModalOpen] = useState(false);
//   const [youtubeUrl, setYoutubeUrl] = useState("");
//   const [contentTemplates, setContentTemplates] = useState([]);
//   const [selectedTemplate, setSelectedTemplate] = useState("");

//   const cityOptions = ["Hyderabad"];
//   const navigate = useNavigate();

//   // Dynamic templates based on category
//   useEffect(() => {
//     if (selectedCategory.name) {
//       const templates = [
//         {
//           id: 'price-chart',
//           name: 'Price Chart',
//           content: `
//             <h1>PRNV Services Best ${selectedCategory.name} Services in ${selectedArea || 'Hyderabad'}</h1>
//             <table style="border-collapse: collapse; width: 100%; margin: 1rem 0;">
//               <tr>
//                 <th style="border: 1px solid #d1d5db; padding: 0.5rem; background-color: #f3f4f6; font-weight: bold; text-decoration: underline;">${selectedCategory.name} Works</th>
//                 <th style="border: 1px solid #d1d5db; padding: 0.5rem; background-color: #f3f4f6; font-weight: bold; text-decoration: underline;">Prices</th>
//                 <th style="border: 1px solid #d1d5db; padding: 0.5rem; background-color: #f3f4f6; font-weight: bold; text-decoration: underline;">Location</th>
//               </tr>
//               <tr>
//                 <td style="border: 1px solid #d1d5db; padding: 0.5rem;">Service 1</td>
//                 <td style="border: 1px solid #d1d5db; padding: 0.5rem;">Rs. 119</td>
//                 <td style="border: 1px solid #d1d5db; padding: 0.5rem;">${selectedArea || 'Hyderabad'}</td>
//               </tr>
//               <tr>
//                 <td style="border: 1px solid #d1d5db; padding: 0.5rem;">Service 2</td>
//                 <td style="border: 1px solid #d1d5db; padding: 0.5rem;">Rs. 149</td>
//                 <td style="border: 1px solid #d1d5db; padding: 0.5rem;">${selectedArea || 'Hyderabad'}</td>
//               </tr>
//               <tr>
//                 <td style="border: 1px solid #d1d5db; padding: 0.5rem;">Service 3</td>
//                 <td style="border: 1px solid #d1d5db; padding: 0.5rem;">Rs. 469</td>
//                 <td style="border: 1px solid #d1d5db; padding: 0.5rem;">${selectedArea || 'Hyderabad'}</td>
//               </tr>
//             </table>
//             <p>For more details, visit our <a href="https://prnvservices.com" target="_blank" rel="noopener noreferrer"><strong>website</strong></a>.</p>
//           `
//         },
//         {
//           id: 'service-overview',
//           name: 'Service Overview',
//           content: `
//             <h2>Professional ${selectedCategory.name} Services in ${selectedArea || 'Hyderabad'}</h2>
//             <p>We provide expert ${selectedCategory.name.toLowerCase()} services in ${selectedArea || 'Hyderabad'} and surrounding areas. Our skilled technicians are available 24/7 to handle all your ${selectedCategory.name.toLowerCase()} needs.</p>
//             <h3>Our Services Include:</h3>
//             <ul>
//               <li>Service 1</li>
//               <li>Service 2</li>
//               <li>Service 3</li>
//               <li>Emergency repairs</li>
//               <li>Maintenance packages</li>
//             </ul>
//             <p>Contact us today at <strong>+91 XXXXXXXXXX</strong> for a free quote!</p>
//           `
//         }
//       ];
//       setContentTemplates(templates);
//     }
//   }, [selectedCategory, selectedArea]);

//   // Quill modules configuration with enhanced toolbar
//   const modules = useMemo(
//     () => ({
//       toolbar: {
//         container: [
//           [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
//           [{ 'font': [] }],
//           [{ 'size': ['small', false, 'large', 'huge'] }],
//           ['bold', 'italic', 'underline', 'strike'],
//           [{ 'color': [] }, { 'background': [] }],
//           [{ 'script': 'sub'}, { 'script': 'super' }],
//           [{ 'list': 'ordered'}, { 'list': 'bullet' }],
//           [{ 'indent': '-1'}, { 'indent': '+1' }],
//           [{ 'align': [] }],
//           ['blockquote', 'code-block'],
//           ['link', 'image', 'video'],
//           ['clean'],
//           ['table']
//         ],
//         handlers: {
//           'image': imageHandler,
//           'link': linkHandler,
//           'video': youtubeHandler
//         }
//       },
//       table: true,
//       clipboard: {
//         matchVisual: false,
//       }
//     }),
//     []
//   );

//   // Image handler function
//   function imageHandler() {
//     setIsImageModalOpen(true);
//   }

//   // Link handler function
//   function linkHandler() {
//     setIsLinkModalOpen(true);
//   }

//   // YouTube handler function
//   function youtubeHandler() {
//     setIsYoutubeModalOpen(true);
//   }

//   // Insert image from URL
//   const insertImage = () => {
//     if (imageUrl) {
//       const quill = document.querySelector('.ql-editor') as HTMLElement;
//       if (quill) {
//         const img = `<img src="${imageUrl}" alt="${imageAlt || 'Image'}" style="max-width: 100%; height: auto;" />`;
//         const cursorPosition = window.getSelection()?.getRangeAt(0);

//         if (cursorPosition) {
//           const div = document.createElement('div');
//           div.innerHTML = img;
//           cursorPosition.insertNode(div);
//         } else {
//           quill.innerHTML += img;
//         }

//         handleQuillChange(quill.innerHTML);
//         setIsImageModalOpen(false);
//         setImageUrl("");
//         setImageAlt("");
//       }
//     }
//   };

//   // Insert link
//   const insertLink = () => {
//     if (linkUrl) {
//       const quill = document.querySelector('.ql-editor') as HTMLElement;
//       if (quill) {
//         const link = `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer">${linkText || linkUrl}</a>`;
//         const cursorPosition = window.getSelection()?.getRangeAt(0);

//         if (cursorPosition) {
//           const div = document.createElement('div');
//           div.innerHTML = link;
//           cursorPosition.insertNode(div);
//         } else {
//           quill.innerHTML += link;
//         }

//         handleQuillChange(quill.innerHTML);
//         setIsLinkModalOpen(false);
//         setLinkUrl("");
//         setLinkText("");
//       }
//     }
//   };

//   // Insert YouTube video
//   const insertYoutubeVideo = () => {
//     if (youtubeUrl) {
//       const videoId = youtubeUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);

//       if (videoId && videoId[1]) {
//         const quill = document.querySelector('.ql-editor') as HTMLElement;
//         if (quill) {
//           const iframe = `
//             <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; margin: 1rem 0;">
//               <iframe
//                 src="https://www.youtube.com/embed/${videoId[1]}"
//                 style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;"
//                 allowfullscreen
//                 title="YouTube Video">
//               </iframe>
//             </div>
//           `;

//           quill.innerHTML += iframe;
//           handleQuillChange(quill.innerHTML);
//           setIsYoutubeModalOpen(false);
//           setYoutubeUrl("");
//         }
//       } else {
//         alert("Please enter a valid YouTube URL");
//       }
//     }
//   };

//   // Insert template content
//   const insertTemplate = () => {
//     if (selectedTemplate) {
//       const template = contentTemplates.find(t => t.id === selectedTemplate);
//       if (template) {
//         const quill = document.querySelector('.ql-editor') as HTMLElement;
//         if (quill) {
//           quill.innerHTML += template.content;
//           handleQuillChange(quill.innerHTML);
//           setSelectedTemplate("");
//         }
//       }
//     }
//   };

//   // Quill formats configuration
//   const formats = [
//     'header', 'font', 'size',
//     'bold', 'italic', 'underline', 'strike',
//     'color', 'background', 'script',
//     'list', 'bullet', 'indent', 'align',
//     'blockquote', 'code-block', 'link', 'image', 'video', 'table'
//   ];

//   // Handle Quill content change
//   const handleQuillChange = (content: string) => {
//     setFormData((prev) => ({ ...prev, seoContent: content }));
//   };

//   // Fetch categories
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const res = await getAllCategories();
//         if (res.success && Array.isArray(res.data)) {
//           setCategories(res.data.filter((cat) => cat?.status === 1));
//         } else {
//           setError("Failed to fetch categories");
//         }
//       } catch (err) {
//         setError("Error fetching categories");
//       }
//     };
//     fetchCategories();
//   }, []);

//   // Fetch pincode and area data
//   useEffect(() => {
//     const fetchPincodeInfo = async () => {
//       try {
//         const res = await getAllPincodes();
//         if (res.success && Array.isArray(res.data)) {
//           setPincodeData(res.data);
//         } else {
//           setError("Failed to fetch pincodes");
//         }
//       } catch (err) {
//         setError("Error fetching pincodes");
//       }
//     };
//     fetchPincodeInfo();
//   }, []);

//   // Update area options
//   useEffect(() => {
//     const flattenedAreas = pincodeData.flatMap((p) =>
//       p.areas.map((area) => ({
//         ...area,
//         pincode: p.code,
//         state: p.state,
//         city: p.city,
//       }))
//     );
//     setAreaOptions(flattenedAreas);
//   }, [pincodeData]);

//   // Handle area selection
//   const handleAreaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const areaName = e.target.value;
//     setSelectedArea(areaName);

//     const matchedPincodeObj = pincodeData.find((p) =>
//       p.areas.some((a) => a.name === areaName)
//     );

//     if (matchedPincodeObj) {
//       setSelectedPincode(matchedPincodeObj.code);
//       setSelectedState(matchedPincodeObj.state);
//       setSelectedCity(matchedPincodeObj.city);

//       const matchedArea = matchedPincodeObj.areas.find(
//         (a) => a.name === areaName
//       );
//       const subAreas = matchedArea?.subAreas || [];
//       setSubAreaOptions([...subAreas].sort((a, b) => a.name.localeCompare(b.name)));
//       setSelectedSubArea("");
//     } else {
//       setSelectedPincode("");
//       setSubAreaOptions([]);
//       setSelectedSubArea("");
//     }
//   };

//   // Handle category selection
//   const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const index = e.target.selectedIndex - 1;
//     if (index >= 0) {
//       const cat = categories[index];
//       setSelectedCategory({
//         name: cat.category_name,
//         slug: cat.category_slug,
//         id: cat._id,
//       });
//       setFormData((prev) => ({
//         ...prev,
//         categoryId: cat._id,
//       }));
//     } else {
//       setSelectedCategory({ name: "", slug: "", id: "" });
//       setFormData((prev) => ({
//         ...prev,
//         categoryId: "",
//       }));
//     }
//   };

//   // Handle input changes
//   const handleInputChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   // Handle form submission
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");

//     try {
//       if (
//         !formData.categoryId ||
//         !selectedArea ||
//         !selectedPincode ||
//         !formData.metaTitle ||
//         !formData.metaDescription ||
//         !formData.seoContent
//       ) {
//         setError("Please fill all required fields");
//         return;
//       }

//       const requestData = {
//         categoryId: formData.categoryId,
//         areaName: selectedArea,
//         city: selectedCity,
//         state: selectedState,
//         pincode: selectedPincode,
//         meta_title: formData.metaTitle,
//         meta_description: formData.metaDescription,
//         seo_content: formData.seoContent,
//       };

//       console.log("Submitting SEO Content as HTML:", formData.seoContent);
//       const response = await createSeoContent(requestData);
//       if (response?.success) {
//         alert("Meta Info added Successfully!");
//         setFormData({
//           categoryId: "",
//           areaName: "",
//           city: "",
//           state: "",
//           pincode: "",
//           metaTitle: "",
//           metaDescription: "",
//           seoContent: "",
//         });
//         // Clear Quill editor
//         const quill = document.querySelector(".ql-editor") as HTMLElement;
//         if (quill) quill.innerHTML = "";
//       } else {
//         throw new Error(response?.message || "Failed to submit review");
//       }
//     } catch (error: any) {
//       const errorMessage =
//         error?.response?.data?.message ||
//         error?.message ||
//         "An error occurred. Please try again later.";
//       setError(errorMessage);
//       alert(errorMessage);
//     }
//   };

//   // Handle form reset
//   const handleReset = () => {
//     setSelectedCategory({ name: "", slug: "", id: "" });
//     setSelectedCity("Hyderabad");
//     setSelectedState("Telangana");
//     setSelectedPincode("");
//     setSelectedArea("");
//     setSelectedSubArea("");
//     setSubAreaOptions([]);
//     setFormData({
//       categoryId: "",
//       areaName: "",
//       city: "",
//       state: "",
//       pincode: "",
//       metaTitle: "",
//       metaDescription: "",
//       seoContent: "",
//     });
//     setError(null);
//     const quill = document.querySelector(".ql-editor") as HTMLElement;
//     if (quill) quill.innerHTML = "";
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
//       <div className="max-w-4xl mx-auto">
//         <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
//           <div className="flex items-center gap-3">
//             <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
//               <BookOpen className="h-6 w-6 text-white" />
//             </div>
//             <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
//               Add Meta Info
//             </h1>
//           </div>
//           <button
//             onClick={() => { navigate(-1); }}
//             className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
//           >
//             <ArrowLeft className="h-4 w-4 mr-2" />
//             Back
//           </button>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-8">
//           <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
//             <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
//               <h2 className="text-lg font-semibold text-white">Search Selection</h2>
//             </div>
//             <div className="p-6 space-y-6">
//               {error && <div className="text-red-500 mb-4">{error}</div>}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="relative">
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Category <span className="text-red-500">*</span>
//                   </label>
//                   <select
//                     className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
//                     value={selectedCategory.name}
//                     onChange={handleCategoryChange}
//                     required
//                   >
//                     <option value="" disabled>Select Category</option>
//                     {categories
//                       .sort((a, b) => a.category_name.toLowerCase().localeCompare(b.category_name.toLowerCase()))
//                       .map((cat, idx) => (
//                         <option key={idx} value={cat.category_name}>
//                           {cat.category_name}
//                         </option>
//                       ))}
//                   </select>
//                   <BiSolidCategory className="absolute left-3 top-[38px] text-blue-400" size={20} />
//                 </div>
//                 <div className="relative">
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     City <span className="text-red-500">*</span>
//                   </label>
//                   <select
//                     className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
//                     value={selectedCity}
//                     onChange={(e) => setSelectedCity(e.target.value)}
//                     required
//                   >
//                     <option value="" disabled>Select City</option>
//                     {cityOptions.map((city, idx) => (
//                       <option key={idx} value={city}>{city}</option>
//                     ))}
//                   </select>
//                   <MapPin className="absolute left-3 top-[38px] text-blue-400" size={20} />
//                 </div>
//                 <div className="relative">
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Area <span className="text-red-500">*</span>
//                   </label>
//                   <select
//                     className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
//                     value={selectedArea}
//                     onChange={handleAreaChange}
//                     required
//                   >
//                     <option value="" disabled>Select Area</option>
//                     {areaOptions
//                       ?.slice()
//                       .sort((a, b) => Number(a.pincode) - Number(b.pincode))
//                       .map((area, idx) => (
//                         <option key={`${area.pincode}-${idx}`} value={area.name}>
//                           {area.name} - {area.pincode}
//                         </option>
//                       ))}
//                   </select>
//                   <MapPin className="absolute left-3 top-[38px] text-blue-400" size={20} />
//                 </div>
//                 <div className="relative">
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Subarea</label>
//                   <select
//                     className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
//                     value={selectedSubArea}
//                     onChange={(e) => setSelectedSubArea(e.target.value)}
//                     disabled={!subAreaOptions.length}
//                   >
//                     <option value="" disabled>Select Subarea</option>
//                     {subAreaOptions.map((sub, idx) => (
//                       <option key={sub._id || idx} value={sub.name}>
//                         {sub.name}
//                       </option>
//                     ))}
//                   </select>
//                   <MapPin className="absolute left-3 top-[38px] text-blue-400" size={20} />
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
//             <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
//               <h2 className="text-lg font-semibold text-white">Meta Information</h2>
//             </div>
//             <div className="p-6 space-y-6">
//               <div className="space-y-2">
//                 <label className="block text-sm font-medium text-gray-700">
//                   Meta Title <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   name="metaTitle"
//                   value={formData.metaTitle}
//                   onChange={handleInputChange}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                   placeholder="Enter meta title"
//                   required
//                 />
//               </div>
//               <div className="space-y-2">
//                 <label className="block text-sm font-medium text-gray-700">
//                   Meta Description <span className="text-red-500">*</span>
//                 </label>
//                 <textarea
//                   name="metaDescription"
//                   value={formData.metaDescription}
//                   onChange={handleInputChange}
//                   rows={3}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                   placeholder="Enter meta description"
//                   required
//                 />
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
//             <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
//               <h2 className="text-lg font-semibold text-white">SEO Content</h2>
//             </div>
//             <div className="p-6">
//               <div className="space-y-2">
//                 <label className="block text-sm font-medium text-gray-700">
//                   SEO Content <span className="text-red-500">*</span>
//                 </label>

//                 {/* Template Selection */}
//                 {contentTemplates.length > 0 && (
//                   <div className="mb-4 flex flex-wrap gap-2">
//                     <select
//                       value={selectedTemplate}
//                       onChange={(e) => setSelectedTemplate(e.target.value)}
//                       className="px-3 py-2 border border-gray-300 rounded"
//                     >
//                       <option value="">Select a template</option>
//                       {contentTemplates.map(template => (
//                         <option key={template.id} value={template.id}>{template.name}</option>
//                       ))}
//                     </select>
//                     <button
//                       type="button"
//                       onClick={insertTemplate}
//                       disabled={!selectedTemplate}
//                       className="flex items-center px-3 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
//                     >
//                       <FileText className="h-4 w-4 mr-1" />
//                       Insert Template
//                     </button>
//                   </div>
//                 )}

//                 <ReactQuill
//                   theme="snow"
//                   value={formData.seoContent}
//                   onChange={handleQuillChange}
//                   modules={modules}
//                   formats={formats}
//                   className="h-96 mb-12"
//                 />
//               </div>
//             </div>
//           </div>

//           <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
//             <div className="flex gap-3 w-full sm:w-auto">
//               <button
//                 type="button"
//                 onClick={handleReset}
//                 className="w-full sm:w-auto flex items-center gap-2 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
//               >
//                 <RefreshCw className="h-5 w-5" />
//                 Reset
//               </button>
//             </div>
//             <button
//               type="submit"
//               className="w-full sm:w-auto flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
//             >
//               Add
//             </button>
//           </div>
//         </form>
//       </div>

//       {/* Image Modal */}
//       {isImageModalOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-lg w-96">
//             <h3 className="text-lg font-semibold mb-4">Insert Image</h3>
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
//                 <input
//                   type="text"
//                   value={imageUrl}
//                   onChange={(e) => setImageUrl(e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded"
//                   placeholder="https://example.com/image.jpg"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Alt Text</label>
//                 <input
//                   type="text"
//                   value={imageAlt}
//                   onChange={(e) => setImageAlt(e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded"
//                   placeholder="Image description"
//                 />
//               </div>
//               <div className="flex justify-end gap-2">
//                 <button
//                   onClick={() => setIsImageModalOpen(false)}
//                   className="px-4 py-2 text-gray-600 hover:text-gray-800"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={insertImage}
//                   className="px-4 py-2 bg-blue-500 text-white rounded"
//                 >
//                   Insert
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Link Modal */}
//       {isLinkModalOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-lg w-96">
//             <h3 className="text-lg font-semibold mb-4">Insert Link</h3>
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
//                 <input
//                   type="text"
//                   value={linkUrl}
//                   onChange={(e) => setLinkUrl(e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded"
//                   placeholder="https://example.com"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Link Text (optional)</label>
//                 <input
//                   type="text"
//                   value={linkText}
//                   onChange={(e) => setLinkText(e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded"
//                   placeholder="Click here"
//                 />
//               </div>
//               <div className="flex justify-end gap-2">
//                 <button
//                   onClick={() => setIsLinkModalOpen(false)}
//                   className="px-4 py-2 text-gray-600 hover:text-gray-800"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={insertLink}
//                   className="px-4 py-2 bg-blue-500 text-white rounded"
//                 >
//                   Insert
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* YouTube Modal */}
//       {isYoutubeModalOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-lg w-96">
//             <h3 className="text-lg font-semibold mb-4">Insert YouTube Video</h3>
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">YouTube URL</label>
//                 <input
//                   type="text"
//                   value={youtubeUrl}
//                   onChange={(e) => setYoutubeUrl(e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded"
//                   placeholder="https://www.youtube.com/watch?v=..."
//                 />
//               </div>
//               <div className="flex justify-end gap-2">
//                 <button
//                   onClick={() => setIsYoutubeModalOpen(false)}
//                   className="px-4 py-2 text-gray-600 hover:text-gray-800"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={insertYoutubeVideo}
//                   className="px-4 py-2 bg-blue-500 text-white rounded"
//                 >
//                   Insert
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AddMetaInfo;
// import React, { useState, useEffect, useMemo } from "react";
// import { ArrowLeft, BookOpen, MapPin, RefreshCw } from "lucide-react";
// import { BiSolidCategory } from "react-icons/bi";
// import { getAllCategories, getAllPincodes, createSeoContent } from "../../api/apiMethods";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css"; // Import Quill's default stylesheet
// import { useNavigate } from "react-router-dom";

// const AddMetaInfo: React.FC = () => {
//   const [categories, setCategories] = useState([]);
//   const [pincodeData, setPincodeData] = useState([]);
//   const [areaOptions, setAreaOptions] = useState([]);
//   const [subAreaOptions, setSubAreaOptions] = useState([]);
//   const [selectedCity, setSelectedCity] = useState("Hyderabad");
//   const [selectedState, setSelectedState] = useState("Telangana");
//   const [selectedCategory, setSelectedCategory] = useState({
//     name: "",
//     slug: "",
//     id: "",
//   });
//   const [selectedArea, setSelectedArea] = useState("");
//   const [selectedPincode, setSelectedPincode] = useState("");
//   const [selectedSubArea, setSelectedSubArea] = useState("");
//   const [formData, setFormData] = useState({
//     categoryId: "",
//     areaName: "",
//     city: "",
//     state: "",
//     pincode: "",
//     metaTitle: "",
//     metaDescription: "",
//     seoContent: "",
//   });
//   const [error, setError] = useState<string | null>(null);
//   const cityOptions = ["Hyderabad"];
//   const navigate = useNavigate();

//   // Quill modules configuration
//   const modules = useMemo(
//     () => ({
//       toolbar: [
//         [{ header: [1, 2, false] }],
//         ["bold", "underline", "link"],
//         [{ list: "ordered" }, { list: "bullet" }],
//         [{ color: [] }, { background: [] }], // Text and background color
//         ["table"], // Table support
//         ["clean"], // Remove formatting
//       ],
//       table: true, // Enable table module
//     }),
//     []
//   );

//   // Quill formats configuration
//   const formats = [
//     "header",
//     "bold",
//     "underline",
//     "link",
//     "list",
//     "bullet",
//     "color",
//     "background",
//     "table",
//     "table-cell",
//     "table-row",
//   ];

//   // Handle Quill content change
//   const handleQuillChange = (content: string) => {
//     setFormData((prev) => ({ ...prev, seoContent: content }));
//   };

//   // Insert custom price chart
//   const insertPriceChart = () => {
//     const priceChartHtml = `
//       <h1>PRNV Services Best Plumbing Services in India</h1>
//       <table style="border-collapse: collapse; width: 100%; margin: 1rem 0;">
//         <tr>
//           <th style="border: 1px solid #d1d5db; padding: 0.5rem; background-color: #f3f4f6; font-weight: bold; text-decoration: underline;">Plumbing Works</th>
//           <th style="border: 1px solid #d1d5db; padding: 0.5rem; background-color: #f3f4f6; font-weight: bold; text-decoration: underline;">Prices</th>
//           <th style="border: 1px solid #d1d5db; padding: 0.5rem; background-color: #f3f4f6; font-weight: bold; text-decoration: underline;">Location</th>
//         </tr>
//         <tr>
//           <td style="border: 1px solid #d1d5db; padding: 0.5rem;">Tap Repair</td>
//           <td style="border: 1px solid #d1d5db; padding: 0.5rem;">Rs. 119</td>
//           <td style="border: 1px solid #d1d5db; padding: 0.5rem;">Hyderabad</td>
//         </tr>
//         <tr>
//           <td style="border: 1px solid #d1d5db; padding: 0.5rem;">Flush Tank Repair</td>
//           <td style="border: 1px solid #d1d5db; padding: 0.5rem;">Rs. 149</td>
//           <td style="border: 1px solid #d1d5db; padding: 0.5rem;">Hyderabad</td>
//         </tr>
//         <tr>
//           <td style="border: 1px solid #d1d5db; padding: 0.5rem;">Wash Basin Installation</td>
//           <td style="border: 1px solid #d1d5db; padding: 0.5rem;">Rs. 469</td>
//           <td style="border: 1px solid #d1d5db; padding: 0.5rem;">Hyderabad</td>
//         </tr>
//         <tr>
//           <td style="border: 1px solid #d1d5db; padding: 0.5rem;">Waste Pipe Leakage</td>
//           <td style="border: 1px solid #d1d5db; padding: 0.5rem;">Rs. 129</td>
//           <td style="border: 1px solid #d1d5db; padding: 0.5rem;">Hyderabad</td>
//         </tr>
//         <tr>
//           <td style="border: 1px solid #d1d5db; padding: 0.5rem;">Shower Installation</td>
//           <td style="border: 1px solid #d1d5db; padding: 0.5rem;">Rs. 133</td>
//           <td style="border: 1px solid #d1d5db; padding: 0.5rem;">Hyderabad</td>
//         </tr>
//       </table>
//       <p>For more details, visit our <a href="https://prnvservices.com" target="_blank" rel="noopener noreferrer"><strong>website</strong></a>.</p>
//     `;
//     const quill = document.querySelector(".ql-editor") as HTMLElement;
//     if (quill) {
//       quill.innerHTML += priceChartHtml;
//       handleQuillChange(quill.innerHTML); // Update formData with new content
//     }
//   };

//   // Fetch categories
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const res = await getAllCategories();
//         if (res.success && Array.isArray(res.data)) {
//           setCategories(res.data.filter((cat) => cat?.status === 1));
//         } else {
//           setError("Failed to fetch categories");
//         }
//       } catch (err) {
//         setError("Error fetching categories");
//       }
//     };
//     fetchCategories();
//   }, []);

//   // Fetch pincode and area data
//   useEffect(() => {
//     const fetchPincodeInfo = async () => {
//       try {
//         const res = await getAllPincodes();
//         if (res.success && Array.isArray(res.data)) {
//           setPincodeData(res.data);
//         } else {
//           setError("Failed to fetch pincodes");
//         }
//       } catch (err) {
//         setError("Error fetching pincodes");
//       }
//     };
//     fetchPincodeInfo();
//   }, []);

//   // Update area options
//   useEffect(() => {
//     const flattenedAreas = pincodeData.flatMap((p) =>
//       p.areas.map((area) => ({
//         ...area,
//         pincode: p.code,
//         state: p.state,
//         city: p.city,
//       }))
//     );
//     setAreaOptions(flattenedAreas);
//   }, [pincodeData]);

//   // Handle area selection
//   const handleAreaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const areaName = e.target.value;
//     setSelectedArea(areaName);

//     const matchedPincodeObj = pincodeData.find((p) =>
//       p.areas.some((a) => a.name === areaName)
//     );

//     if (matchedPincodeObj) {
//       setSelectedPincode(matchedPincodeObj.code);
//       setSelectedState(matchedPincodeObj.state);
//       setSelectedCity(matchedPincodeObj.city);

//       const matchedArea = matchedPincodeObj.areas.find(
//         (a) => a.name === areaName
//       );
//       const subAreas = matchedArea?.subAreas || [];
//       setSubAreaOptions([...subAreas].sort((a, b) => a.name.localeCompare(b.name)));
//       setSelectedSubArea("");
//     } else {
//       setSelectedPincode("");
//       setSubAreaOptions([]);
//       setSelectedSubArea("");
//     }
//   };

//   // Handle category selection
//   const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const index = e.target.selectedIndex - 1;
//     if (index >= 0) {
//       const cat = categories[index];
//       setSelectedCategory({
//         name: cat.category_name,
//         slug: cat.category_slug,
//         id: cat._id,
//       });
//       setFormData((prev) => ({
//         ...prev,
//         categoryId: cat._id,
//       }));
//     } else {
//       setSelectedCategory({ name: "", slug: "", id: "" });
//       setFormData((prev) => ({
//         ...prev,
//         categoryId: "",
//       }));
//     }
//   };

//   // Handle input changes
//   const handleInputChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   // Handle form submission
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");

//     try {
//       if (
//         !formData.categoryId ||
//         !selectedArea ||
//         !selectedPincode ||
//         !formData.metaTitle ||
//         !formData.metaDescription ||
//         !formData.seoContent
//       ) {
//         setError("Please fill all required fields");
//         return;
//       }

//       const requestData = {
//         categoryId: formData.categoryId,
//         areaName: selectedArea,
//         city: selectedCity,
//         state: selectedState,
//         pincode: selectedPincode,
//         meta_title: formData.metaTitle,
//         meta_description: formData.metaDescription,
//         seo_content: formData.seoContent,
//       };

//       console.log("Submitting SEO Content as HTML:", formData.seoContent); // Debug HTML output
//       const response = await createSeoContent(requestData);
//       if (response?.success) {
//         alert("Meta Info added Successfully!");
//         setFormData({
//           categoryId: "",
//           areaName: "",
//           city: "",
//           state: "",
//           pincode: "",
//           metaTitle: "",
//           metaDescription: "",
//           seoContent: "",
//         });
//         // Clear Quill editor
//         const quill = document.querySelector(".ql-editor") as HTMLElement;
//         if (quill) quill.innerHTML = "";
//       } else {
//         throw new Error(response?.message || "Failed to submit review");
//       }
//     } catch (error: any) {
//       const errorMessage =
//         error?.response?.data?.message ||
//         error?.message ||
//         "An error occurred. Please try again later.";
//       setError(errorMessage);
//       alert(errorMessage);
//     }
//   };

//   // Handle form reset
//   const handleReset = () => {
//     setSelectedCategory({ name: "", slug: "", id: "" });
//     setSelectedCity("Hyderabad");
//     setSelectedState("Telangana");
//     setSelectedPincode("");
//     setSelectedArea("");
//     setSelectedSubArea("");
//     setSubAreaOptions([]);
//     setFormData({
//       categoryId: "",
//       areaName: "",
//       city: "",
//       state: "",
//       pincode: "",
//       metaTitle: "",
//       metaDescription: "",
//       seoContent: "",
//     });
//     setError(null);
//     const quill = document.querySelector(".ql-editor") as HTMLElement;
//     if (quill) quill.innerHTML = "";
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
//       <div className="max-w-4xl mx-auto">
//         <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
//           <div className="flex items-center gap-3">
//             <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
//               <BookOpen className="h-6 w-6 text-white" />
//             </div>
//             <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
//               Add Meta Info
//             </h1>
//           </div>
//           <button
//             onClick={() => { navigate(-1); }}
//             className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
//           >
//             <ArrowLeft className="h-4 w-4 mr-2" />
//             Back
//           </button>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-8">
//           <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
//             <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
//               <h2 className="text-lg font-semibold text-white">Search Selection</h2>
//             </div>
//             <div className="p-6 space-y-6">
//               {error && <div className="text-red-500 mb-4">{error}</div>}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="relative">
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Category <span className="text-red-500">*</span>
//                   </label>
//                   <select
//                     className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
//                     value={selectedCategory.name}
//                     onChange={handleCategoryChange}
//                     required
//                   >
//                     <option value="" disabled>Select Category</option>
//                     {categories
//                       .sort((a, b) => a.category_name.toLowerCase().localeCompare(b.category_name.toLowerCase()))
//                       .map((cat, idx) => (
//                         <option key={idx} value={cat.category_name}>
//                           {cat.category_name}
//                         </option>
//                       ))}
//                   </select>
//                   <BiSolidCategory className="absolute left-3 top-[38px] text-blue-400" size={20} />
//                 </div>
//                 <div className="relative">
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     City <span className="text-red-500">*</span>
//                   </label>
//                   <select
//                     className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
//                     value={selectedCity}
//                     onChange={(e) => setSelectedCity(e.target.value)}
//                     required
//                   >
//                     <option value="" disabled>Select City</option>
//                     {cityOptions.map((city, idx) => (
//                       <option key={idx} value={city}>{city}</option>
//                     ))}
//                   </select>
//                   <MapPin className="absolute left-3 top-[38px] text-blue-400" size={20} />
//                 </div>
//                 <div className="relative">
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Area <span className="text-red-500">*</span>
//                   </label>
//                   <select
//                     className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
//                     value={selectedArea}
//                     onChange={handleAreaChange}
//                     required
//                   >
//                     <option value="" disabled>Select Area</option>
//                     {areaOptions
//                       ?.slice()
//                       .sort((a, b) => Number(a.pincode) - Number(b.pincode))
//                       .map((area, idx) => (
//                         <option key={`${area.pincode}-${idx}`} value={area.name}>
//                           {area.name} - {area.pincode}
//                         </option>
//                       ))}
//                   </select>
//                   <MapPin className="absolute left-3 top-[38px] text-blue-400" size={20} />
//                 </div>
//                 <div className="relative">
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Subarea</label>
//                   <select
//                     className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
//                     value={selectedSubArea}
//                     onChange={(e) => setSelectedSubArea(e.target.value)}
//                     disabled={!subAreaOptions.length}
//                   >
//                     <option value="" disabled>Select Subarea</option>
//                     {subAreaOptions.map((sub, idx) => (
//                       <option key={sub._id || idx} value={sub.name}>
//                         {sub.name}
//                       </option>
//                     ))}
//                   </select>
//                   <MapPin className="absolute left-3 top-[38px] text-blue-400" size={20} />
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
//             <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
//               <h2 className="text-lg font-semibold text-white">Meta Information</h2>
//             </div>
//             <div className="p-6 space-y-6">
//               <div className="space-y-2">
//                 <label className="block text-sm font-medium text-gray-700">
//                   Meta Title <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   name="metaTitle"
//                   value={formData.metaTitle}
//                   onChange={handleInputChange}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                   placeholder="Enter meta title"
//                   required
//                 />
//               </div>
//               <div className="space-y-2">
//                 <label className="block text-sm font-medium text-gray-700">
//                   Meta Description <span className="text-red-500">*</span>
//                 </label>
//                 <textarea
//                   name="metaDescription"
//                   value={formData.metaDescription}
//                   onChange={handleInputChange}
//                   rows={3}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                   placeholder="Enter meta description"
//                   required
//                 />
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
//             <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
//               <h2 className="text-lg font-semibold text-white">SEO Content</h2>
//             </div>
//             <div className="p-6">
//               <div className="space-y-2">
//                 <label className="block text-sm font-medium text-gray-700">
//                   SEO Content <span className="text-red-500">*</span>
//                 </label>
//                 <div className="mb-4">
//                   <button
//                     type="button"
//                     onClick={insertPriceChart}
//                     className="px-3 py-1 bg-blue-500 text-white rounded"
//                   >
//                     Insert Price Chart
//                   </button>
//                 </div>
//                 <ReactQuill
//                   theme="snow"
//                   value={formData.seoContent}
//                   onChange={handleQuillChange}
//                   modules={modules}
//                   formats={formats}
//                   className="h-64"
//                 />
//               </div>
//             </div>
//           </div>

//           <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
//             <div className="flex gap-3 w-full sm:w-auto">
//               <button
//                 type="button"
//                 onClick={handleReset}
//                 className="w-full sm:w-auto flex items-center gap-2 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
//               >
//                 <RefreshCw className="h-5 w-5" />
//                 Reset
//               </button>
//             </div>
//             <button
//               type="submit"
//               className="w-full sm:w-auto flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
//             >
//               Add
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddMetaInfo;
// import React, { useState, useEffect } from "react";
// import { ArrowLeft, BookOpen, MapPin, RefreshCw } from "lucide-react";
// import { BiSolidCategory } from "react-icons/bi";
// import { getAllCategories, getAllPincodes, createSeoContent } from "../../api/apiMethods";
// import { useEditor, EditorContent } from "@tiptap/react";
// import StarterKit from "@tiptap/starter-kit";
// import {Table} from "@tiptap/extension-table";
// import TableCell from "@tiptap/extension-table-cell";
// import TableHeader from "@tiptap/extension-table-header";
// import TableRow from "@tiptap/extension-table-row";
// import Link from "@tiptap/extension-link";
// import Color from "@tiptap/extension-color";
// import{ TextStyle }from "@tiptap/extension-text-style";
// import "./tiptap.css"; // Custom CSS for Tiptap styling
// import { useNavigate } from "react-router-dom";

// const AddMetaInfo: React.FC = () => {
//   const [categories, setCategories] = useState([]);
//   const [pincodeData, setPincodeData] = useState([]);
//   const [areaOptions, setAreaOptions] = useState([]);
//   const [subAreaOptions, setSubAreaOptions] = useState([]);
//   const [selectedCity, setSelectedCity] = useState("Hyderabad");
//   const [selectedState, setSelectedState] = useState("Telangana");
//   const [selectedCategory, setSelectedCategory] = useState({
//     name: "",
//     slug: "",
//     id: "",
//   });
//   const [selectedArea, setSelectedArea] = useState("");
//   const [selectedPincode, setSelectedPincode] = useState("");
//   const [selectedSubArea, setSelectedSubArea] = useState("");
//   const [formData, setFormData] = useState({
//     categoryId: "",
//     areaName: "",
//     city: "",
//     state: "",
//     pincode: "",
//     metaTitle: "",
//     metaDescription: "",
//     seoContent: "",
//   });
//   const [error, setError] = useState<string | null>(null);
//   const cityOptions = ["Hyderabad"];
//   const navigate = useNavigate();

//   // Initialize Tiptap editor
//   const editor = useEditor({
//     extensions: [
//       StarterKit,
//       Table.configure({ resizable: true }),
//       TableRow,
//       TableHeader,
//       TableCell,
//       Link.configure({
//         openOnClick: false,
//         HTMLAttributes: { target: "_blank", rel: "noopener noreferrer" },
//       }),
//       Color,
//       TextStyle,
//     ],
//     content: formData.seoContent,
//     onUpdate: ({ editor }) => {
//       setFormData((prev) => ({
//         ...prev,
//         seoContent: editor.getHTML(),
//       }));
//     },
//   });

//   // Toolbar commands
//   const setLink = () => {
//     const url = prompt("Enter the URL");
//     if (url) {
//       editor?.chain().focus().setLink({ href: url }).run();
//     }
//   };

//   const setColor = (color: string) => {
//     editor?.chain().focus().setColor(color).run();
//   };

//   const setBgColor = (color: string) => {
//     editor?.chain().focus().setTextStyle({ backgroundColor: color }).run();
//   };

//   const insertTable = () => {
//     editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
//   };

//   // Insert custom price chart
//   const insertPriceChart = () => {
//     if (!editor) return;

//     editor
//       .chain()
//       .focus()
//       .insertContent([
//         {
//           type: "heading",
//           attrs: { level: 1 },
//           content: [{ type: "text", text: "PRNV Services Best Plumbing Services in India" }],
//         },
//         { type: "paragraph" },
//         {
//           type: "table",
//           content: [
//             {
//               type: "tableRow",
//               content: [
//                 { type: "tableHeader", content: [{ type: "text", text: "Plumbing Works", marks: [{ type: "bold" }, { type: "underline" }] }] },
//                 { type: "tableHeader", content: [{ type: "text", text: "Prices", marks: [{ type: "bold" }, { type: "underline" }] }] },
//                 { type: "tableHeader", content: [{ type: "text", text: "Location", marks: [{ type: "bold" }, { type: "underline" }] }] },
//               ],
//             },
//             {
//               type: "tableRow",
//               content: [
//                 { type: "tableCell", content: [{ type: "text", text: "Tap Repair" }] },
//                 { type: "tableCell", content: [{ type: "text", text: "Rs. 119" }] },
//                 { type: "tableCell", content: [{ type: "text", text: "Hyderabad" }] },
//               ],
//             },
//             {
//               type: "tableRow",
//               content: [
//                 { type: "tableCell", content: [{ type: "text", text: "Flush Tank Repair" }] },
//                 { type: "tableCell", content: [{ type: "text", text: "Rs. 149" }] },
//                 { type: "tableCell", content: [{ type: "text", text: "Hyderabad" }] },
//               ],
//             },
//             {
//               type: "tableRow",
//               content: [
//                 { type: "tableCell", content: [{ type: "text", text: "Wash Basin Installation" }] },
//                 { type: "tableCell", content: [{ type: "text", text: "Rs. 469" }] },
//                 { type: "tableCell", content: [{ type: "text", text: "Hyderabad" }] },
//               ],
//             },
//             {
//               type: "tableRow",
//               content: [
//                 { type: "tableCell", content: [{ type: "text", text: "Waste Pipe Leakage" }] },
//                 { type: "tableCell", content: [{ type: "text", text: "Rs. 129" }] },
//                 { type: "tableCell", content: [{ type: "text", text: "Hyderabad" }] },
//               ],
//             },
//             {
//               type: "tableRow",
//               content: [
//                 { type: "tableCell", content: [{ type: "text", text: "Shower Installation" }] },
//                 { type: "tableCell", content: [{ type: "text", text: "Rs. 133" }] },
//                 { type: "tableCell", content: [{ type: "text", text: "Hyderabad" }] },
//               ],
//             },
//           ],
//         },
//         {
//           type: "paragraph",
//           content: [
//             { type: "text", text: "For more details, visit our " },
//             {
//               type: "text",
//               text: "website",
//               marks: [
//                 { type: "link", attrs: { href: "https://prnvservices.com" } },
//                 { type: "bold" },
//               ],
//             },
//             { type: "text", text: "." },
//           ],
//         },
//       ])
//       .run();
//   };

//   // Fetch categories
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const res = await getAllCategories();
//         if (res.success && Array.isArray(res.data)) {
//           setCategories(res.data.filter((cat) => cat?.status === 1));
//         } else {
//           setError("Failed to fetch categories");
//         }
//       } catch (err) {
//         setError("Error fetching categories");
//       }
//     };
//     fetchCategories();
//   }, []);

//   // Fetch pincode and area data
//   useEffect(() => {
//     const fetchPincodeInfo = async () => {
//       try {
//         const res = await getAllPincodes();
//         if (res.success && Array.isArray(res.data)) {
//           setPincodeData(res.data);
//         } else {
//           setError("Failed to fetch pincodes");
//         }
//       } catch (err) {
//         setError("Error fetching pincodes");
//       }
//     };
//     fetchPincodeInfo();
//   }, []);

//   // Update area options
//   useEffect(() => {
//     const flattenedAreas = pincodeData.flatMap((p) =>
//       p.areas.map((area) => ({
//         ...area,
//         pincode: p.code,
//         state: p.state,
//         city: p.city,
//       }))
//     );
//     setAreaOptions(flattenedAreas);
//   }, [pincodeData]);

//   // Handle area selection
//   const handleAreaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const areaName = e.target.value;
//     setSelectedArea(areaName);

//     const matchedPincodeObj = pincodeData.find((p) =>
//       p.areas.some((a) => a.name === areaName)
//     );

//     if (matchedPincodeObj) {
//       setSelectedPincode(matchedPincodeObj.code);
//       setSelectedState(matchedPincodeObj.state);
//       setSelectedCity(matchedPincodeObj.city);

//       const matchedArea = matchedPincodeObj.areas.find(
//         (a) => a.name === areaName
//       );
//       const subAreas = matchedArea?.subAreas || [];
//       setSubAreaOptions([...subAreas].sort((a, b) => a.name.localeCompare(b.name)));
//       setSelectedSubArea("");
//     } else {
//       setSelectedPincode("");
//       setSubAreaOptions([]);
//       setSelectedSubArea("");
//     }
//   };

//   // Handle category selection
//   const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const index = e.target.selectedIndex - 1;
//     if (index >= 0) {
//       const cat = categories[index];
//       setSelectedCategory({
//         name: cat.category_name,
//         slug: cat.category_slug,
//         id: cat._id,
//       });
//       setFormData((prev) => ({
//         ...prev,
//         categoryId: cat._id,
//       }));
//     } else {
//       setSelectedCategory({ name: "", slug: "", id: "" });
//       setFormData((prev) => ({
//         ...prev,
//         categoryId: "",
//       }));
//     }
//   };

//   // Handle input changes
//   const handleInputChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   // Handle form submission
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");

//     try {
//       if (
//         !formData.categoryId ||
//         !selectedArea ||
//         !selectedPincode ||
//         !formData.metaTitle ||
//         !formData.metaDescription ||
//         !formData.seoContent
//       ) {
//         setError("Please fill all required fields");
//         return;
//       }

//       const requestData = {
//         categoryId: formData.categoryId,
//         areaName: selectedArea,
//         city: selectedCity,
//         state: selectedState,
//         pincode: selectedPincode,
//         meta_title: formData.metaTitle,
//         meta_description: formData.metaDescription,
//         seo_content: formData.seoContent,
//       };

//       console.log("Submitting SEO Content as HTML:", formData.seoContent); // Debug HTML output
//       const response = await createSeoContent(requestData);
//       if (response?.success) {
//         alert("Meta Info added Successfully!");
//         setFormData({
//           categoryId: "",
//           areaName: "",
//           city: "",
//           state: "",
//           pincode: "",
//           metaTitle: "",
//           metaDescription: "",
//           seoContent: "",
//         });
//         if (editor) editor.commands.clearContent();
//       } else {
//         throw new Error(response?.message || "Failed to submit review");
//       }
//     } catch (error: any) {
//       const errorMessage =
//         error?.response?.data?.message ||
//         error?.message ||
//         "An error occurred. Please try again later.";
//       setError(errorMessage);
//       alert(errorMessage);
//     }
//   };

//   // Handle form reset
//   const handleReset = () => {
//     setSelectedCategory({ name: "", slug: "", id: "" });
//     setSelectedCity("Hyderabad");
//     setSelectedState("Telangana");
//     setSelectedPincode("");
//     setSelectedArea("");
//     setSelectedSubArea("");
//     setSubAreaOptions([]);
//     setFormData({
//       categoryId: "",
//       areaName: "",
//       city: "",
//       state: "",
//       pincode: "",
//       metaTitle: "",
//       metaDescription: "",
//       seoContent: "",
//     });
//     setError(null);
//     if (editor) editor.commands.clearContent();
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
//       <div className="max-w-4xl mx-auto">
//         <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
//           <div className="flex items-center gap-3">
//             <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
//               <BookOpen className="h-6 w-6 text-white" />
//             </div>
//             <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
//               Add Meta Info
//             </h1>
//           </div>
//           <button
//             onClick={() => { navigate(-1); }}
//             className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
//           >
//             <ArrowLeft className="h-4 w-4 mr-2" />
//             Back
//           </button>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-8">
//           <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
//             <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
//               <h2 className="text-lg font-semibold text-white">Search Selection</h2>
//             </div>
//             <div className="p-6 space-y-6">
//               {error && <div className="text-red-500 mb-4">{error}</div>}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="relative">
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Category <span className="text-red-500">*</span>
//                   </label>
//                   <select
//                     className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
//                     value={selectedCategory.name}
//                     onChange={handleCategoryChange}
//                     required
//                   >
//                     <option value="" disabled>Select Category</option>
//                     {categories
//                       .sort((a, b) => a.category_name.toLowerCase().localeCompare(b.category_name.toLowerCase()))
//                       .map((cat, idx) => (
//                         <option key={idx} value={cat.category_name}>
//                           {cat.category_name}
//                         </option>
//                       ))}
//                   </select>
//                   <BiSolidCategory className="absolute left-3 top-[38px] text-blue-400" size={20} />
//                 </div>
//                 <div className="relative">
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     City <span className="text-red-500">*</span>
//                   </label>
//                   <select
//                     className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
//                     value={selectedCity}
//                     onChange={(e) => setSelectedCity(e.target.value)}
//                     required
//                   >
//                     <option value="" disabled>Select City</option>
//                     {cityOptions.map((city, idx) => (
//                       <option key={idx} value={city}>{city}</option>
//                     ))}
//                   </select>
//                   <MapPin className="absolute left-3 top-[38px] text-blue-400" size={20} />
//                 </div>
//                 <div className="relative">
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Area <span className="text-red-500">*</span>
//                   </label>
//                   <select
//                     className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
//                     value={selectedArea}
//                     onChange={handleAreaChange}
//                     required
//                   >
//                     <option value="" disabled>Select Area</option>
//                     {areaOptions
//                       ?.slice()
//                       .sort((a, b) => Number(a.pincode) - Number(b.pincode))
//                       .map((area, idx) => (
//                         <option key={`${area.pincode}-${idx}`} value={area.name}>
//                           {area.name} - {area.pincode}
//                         </option>
//                       ))}
//                   </select>
//                   <MapPin className="absolute left-3 top-[38px] text-blue-400" size={20} />
//                 </div>
//                 <div className="relative">
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Subarea</label>
//                   <select
//                     className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
//                     value={selectedSubArea}
//                     onChange={(e) => setSelectedSubArea(e.target.value)}
//                     disabled={!subAreaOptions.length}
//                   >
//                     <option value="" disabled>Select Subarea</option>
//                     {subAreaOptions.map((sub, idx) => (
//                       <option key={sub._id || idx} value={sub.name}>
//                         {sub.name}
//                       </option>
//                     ))}
//                   </select>
//                   <MapPin className="absolute left-3 top-[38px] text-blue-400" size={20} />
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
//             <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
//               <h2 className="text-lg font-semibold text-white">Meta Information</h2>
//             </div>
//             <div className="p-6 space-y-6">
//               <div className="space-y-2">
//                 <label className="block text-sm font-medium text-gray-700">
//                   Meta Title <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   name="metaTitle"
//                   value={formData.metaTitle}
//                   onChange={handleInputChange}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                   placeholder="Enter meta title"
//                   required
//                 />
//               </div>
//               <div className="space-y-2">
//                 <label className="block text-sm font-medium text-gray-700">
//                   Meta Description <span className="text-red-500">*</span>
//                 </label>
//                 <textarea
//                   name="metaDescription"
//                   value={formData.metaDescription}
//                   onChange={handleInputChange}
//                   rows={3}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                   placeholder="Enter meta description"
//                   required
//                 />
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
//             <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
//               <h2 className="text-lg font-semibold text-white">SEO Content</h2>
//             </div>
//             <div className="p-6">
//               <div className="space-y-2">
//                 <label className="block text-sm font-medium text-gray-700">
//                   SEO Content <span className="text-red-500">*</span>
//                 </label>
//                 <div className="flex gap-2 mb-4 flex-wrap">
//                   <button
//                     type="button"
//                     onClick={() => editor?.chain().focus().toggleBold().run()}
//                     className="px-3 py-1 bg-gray-200 rounded"
//                     disabled={!editor?.isActive("bold")}
//                   >
//                     B
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => editor?.chain().focus().toggleUnderline().run()}
//                     className="px-3 py-1 bg-gray-200 rounded"
//                     disabled={!editor?.isActive("underline")}
//                   >
//                     U
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => editor?.chain().focus().toggleOrderedList().run()}
//                     className="px-3 py-1 bg-gray-200 rounded"
//                     disabled={!editor?.isActive("orderedList")}
//                   >
//                     1.
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => editor?.chain().focus().toggleBulletList().run()}
//                     className="px-3 py-1 bg-gray-200 rounded"
//                     disabled={!editor?.isActive("bulletList")}
//                   >
//                     •
//                   </button>
//                   <button
//                     type="button"
//                     onClick={setLink}
//                     className="px-3 py-1 bg-gray-200 rounded"
//                   >
//                     Link
//                   </button>
//                   <button
//                     type="button"
//                     onClick={insertTable}
//                     className="px-3 py-1 bg-gray-200 rounded"
//                   >
//                     Table
//                   </button>
//                   <button
//                     type="button"
//                     onClick={insertPriceChart}
//                     className="px-3 py-1 bg-blue-500 text-white rounded"
//                   >
//                     Price Chart
//                   </button>
//                   <select
//                     onChange={(e) => setColor(e.target.value)}
//                     className="px-2 py-1 border border-gray-300 rounded"
//                     defaultValue=""
//                   >
//                     <option value="" disabled>Select Text Color</option>
//                     <option value="#000000">Black</option>
//                     <option value="#FF0000">Red</option>
//                     <option value="#00FF00">Green</option>
//                     <option value="#0000FF">Blue</option>
//                   </select>
//                   <select
//                     onChange={(e) => setBgColor(e.target.value)}
//                     className="px-2 py-1 border border-gray-300 rounded"
//                     defaultValue=""
//                   >
//                     <option value="" disabled>Select Background Color</option>
//                     <option value="#FFFF00">Yellow</option>
//                     <option value="#FF9999">Light Red</option>
//                     <option value="#99FF99">Light Green</option>
//                     <option value="#9999FF">Light Blue</option>
//                   </select>
//                 </div>
//                 <EditorContent editor={editor} className="tiptap-editor" />
//               </div>
//             </div>
//           </div>

//           <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
//             <div className="flex gap-3 w-full sm:w-auto">
//               <button
//                 type="button"
//                 onClick={handleReset}
//                 className="w-full sm:w-auto flex items-center gap-2 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
//               >
//                 <RefreshCw className="h-5 w-5" />
//                 Reset
//               </button>
//             </div>
//             <button
//               type="submit"
//               className="w-full sm:w-auto flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
//             >
//               Add
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddMetaInfo;
// import React, { useState, useEffect } from "react";
// import { ArrowLeft, BookOpen, MapPin, RefreshCw } from "lucide-react";
// import { BiSolidCategory } from "react-icons/bi";
// import { getAllCategories, getAllPincodes, createSeoContent } from "../../api/apiMethods";
// import { useEditor, EditorContent } from "@tiptap/react";
// import StarterKit from "@tiptap/starter-kit";
// // import Table from "@tiptap/extension-table";
// import TableCell from "@tiptap/extension-table-cell";
// import TableHeader from "@tiptap/extension-table-header";
// import TableRow from "@tiptap/extension-table-row";
// import Link from "@tiptap/extension-link";
// import "./tiptap.css"; // Custom CSS for Tiptap styling
// import { Table } from "@tiptap/extension-table";
// import { useNavigate } from "react-router-dom";

// const AddMetaInfo: React.FC = () => {
//   const [categories, setCategories] = useState([]);
//   const [pincodeData, setPincodeData] = useState([]);
//   const [areaOptions, setAreaOptions] = useState([]);
//   const [subAreaOptions, setSubAreaOptions] = useState([]);
//   const [selectedCity, setSelectedCity] = useState("Hyderabad");
//   const [selectedState, setSelectedState] = useState("Telangana");
//   const [selectedCategory, setSelectedCategory] = useState({
//     name: "",
//     slug: "",
//     id: "",
//   });
//   const [selectedArea, setSelectedArea] = useState("");
//   const [selectedPincode, setSelectedPincode] = useState("");
//   const [selectedSubArea, setSelectedSubArea] = useState("");
//   const [formData, setFormData] = useState({
//     categoryId: "",
//     areaName: "",
//     city: "",
//     state: "",
//     pincode: "",
//     metaTitle: "",
//     metaDescription: "",
//     seoContent: "",
//   });
//   const [error, setError] = useState<string | null>(null);
//   const cityOptions = ["Hyderabad"];
//   const navigate = useNavigate();

//   // Initialize Tiptap editor
//   const editor = useEditor({
//     extensions: [
//       StarterKit,
//       Table.configure({ resizable: true }),
//       TableRow,
//       TableHeader,
//       TableCell,
//       Link.configure({
//         openOnClick: false,
//         HTMLAttributes: { target: "_blank", rel: "noopener noreferrer" },
//       }),
//     ],
//     content: formData.seoContent,
//     onUpdate: ({ editor }) => {
//       setFormData((prev) => ({
//         ...prev,
//         seoContent: editor.getHTML(),
//       }));
//     },
//   });

//   // Toolbar commands
//   const setLink = () => {
//     const url = prompt("Enter the URL");
//     if (url) {
//       editor?.chain().focus().setLink({ href: url }).run();
//     }
//   };

//   const insertTable = () => {
//     editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
//   };

//   // Insert custom price chart
//   const insertPriceChart = () => {
//     if (!editor) return;

//     editor
//       .chain()
//       .focus()
//       .insertContent([
//         {
//           type: "heading",
//           attrs: { level: 1 },
//           content: [{ type: "text", text: "PRNV Services Best Plumbing Services in India" }],
//         },
//         { type: "paragraph" },
//         {
//           type: "table",
//           content: [
//             {
//               type: "tableRow",
//               content: [
//                 { type: "tableHeader", content: [{ type: "text", text: "Plumbing Works", marks: [{ type: "bold" }] }] },
//                 { type: "tableHeader", content: [{ type: "text", text: "Prices", marks: [{ type: "bold" }] }] },
//                 { type: "tableHeader", content: [{ type: "text", text: "Location", marks: [{ type: "bold" }] }] },
//               ],
//             },
//             {
//               type: "tableRow",
//               content: [
//                 { type: "tableCell", content: [{ type: "text", text: "Tap Repair" }] },
//                 { type: "tableCell", content: [{ type: "text", text: "Rs. 119" }] },
//                 { type: "tableCell", content: [{ type: "text", text: "Hyderabad" }] },
//               ],
//             },
//             {
//               type: "tableRow",
//               content: [
//                 { type: "tableCell", content: [{ type: "text", text: "Flush Tank Repair" }] },
//                 { type: "tableCell", content: [{ type: "text", text: "Rs. 149" }] },
//                 { type: "tableCell", content: [{ type: "text", text: "Hyderabad" }] },
//               ],
//             },
//             {
//               type: "tableRow",
//               content: [
//                 { type: "tableCell", content: [{ type: "text", text: "Wash Basin Installation" }] },
//                 { type: "tableCell", content: [{ type: "text", text: "Rs. 469" }] },
//                 { type: "tableCell", content: [{ type: "text", text: "Hyderabad" }] },
//               ],
//             },
//             {
//               type: "tableRow",
//               content: [
//                 { type: "tableCell", content: [{ type: "text", text: "Waste Pipe Leakage" }] },
//                 { type: "tableCell", content: [{ type: "text", text: "Rs. 129" }] },
//                 { type: "tableCell", content: [{ type: "text", text: "Hyderabad" }] },
//               ],
//             },
//             {
//               type: "tableRow",
//               content: [
//                 { type: "tableCell", content: [{ type: "text", text: "Shower Installation" }] },
//                 { type: "tableCell", content: [{ type: "text", text: "Rs. 133" }] },
//                 { type: "tableCell", content: [{ type: "text", text: "Hyderabad" }] },
//               ],
//             },
//           ],
//         },
//         {
//           type: "paragraph",
//           content: [
//             { type: "text", text: "For more details, visit our " },
//             {
//               type: "text",
//               text: "website",
//               marks: [
//                 { type: "link", attrs: { href: "https://prnvservices.com" } },
//                 { type: "bold" },
//               ],
//             },
//             { type: "text", text: "." },
//           ],
//         },
//       ])
//       .run();
//   };

//   // Fetch categories
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const res = await getAllCategories();
//         if (res.success && Array.isArray(res.data)) {
//           setCategories(res.data.filter((cat) => cat?.status === 1));
//         } else {
//           setError("Failed to fetch categories");
//         }
//       } catch (err) {
//         setError("Error fetching categories");
//       }
//     };
//     fetchCategories();
//   }, []);

//   // Fetch pincode and area data
//   useEffect(() => {
//     const fetchPincodeInfo = async () => {
//       try {
//         const res = await getAllPincodes();
//         if (res.success && Array.isArray(res.data)) {
//           setPincodeData(res.data);
//         } else {
//           setError("Failed to fetch pincodes");
//         }
//       } catch (err) {
//         setError("Error fetching pincodes");
//       }
//     };
//     fetchPincodeInfo();
//   }, []);

//   // Update area options
//   useEffect(() => {
//     const flattenedAreas = pincodeData.flatMap((p) =>
//       p.areas.map((area) => ({
//         ...area,
//         pincode: p.code,
//         state: p.state,
//         city: p.city,
//       }))
//     );
//     setAreaOptions(flattenedAreas);
//   }, [pincodeData]);

//   // Handle area selection
//   const handleAreaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const areaName = e.target.value;
//     setSelectedArea(areaName);

//     const matchedPincodeObj = pincodeData.find((p) =>
//       p.areas.some((a) => a.name === areaName)
//     );

//     if (matchedPincodeObj) {
//       setSelectedPincode(matchedPincodeObj.code);
//       setSelectedState(matchedPincodeObj.state);
//       setSelectedCity(matchedPincodeObj.city);

//       const matchedArea = matchedPincodeObj.areas.find(
//         (a) => a.name === areaName
//       );
//       const subAreas = matchedArea?.subAreas || [];
//       setSubAreaOptions([...subAreas].sort((a, b) => a.name.localeCompare(b.name)));
//       setSelectedSubArea("");
//     } else {
//       setSelectedPincode("");
//       setSubAreaOptions([]);
//       setSelectedSubArea("");
//     }
//   };

//   // Handle category selection
//   const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const index = e.target.selectedIndex - 1;
//     if (index >= 0) {
//       const cat = categories[index];
//       setSelectedCategory({
//         name: cat.category_name,
//         slug: cat.category_slug,
//         id: cat._id,
//       });
//       setFormData((prev) => ({
//         ...prev,
//         categoryId: cat._id,
//       }));
//     } else {
//       setSelectedCategory({ name: "", slug: "", id: "" });
//       setFormData((prev) => ({
//         ...prev,
//         categoryId: "",
//       }));
//     }
//   };

//   // Handle input changes
//   const handleInputChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   // Handle form submission
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");

//     try {
//       if (
//         !formData.categoryId ||
//         !selectedArea ||
//         !selectedPincode ||
//         !formData.metaTitle ||
//         !formData.metaDescription ||
//         !formData.seoContent
//       ) {
//         setError("Please fill all required fields");
//         return;
//       }

//       const requestData = {
//         categoryId: formData.categoryId,
//         areaName: selectedArea,
//         city: selectedCity,
//         state: selectedState,
//         pincode: selectedPincode,
//         meta_title: formData.metaTitle,
//         meta_description: formData.metaDescription,
//         seo_content: formData.seoContent,
//       };

//       console.log("Submitting SEO Content as HTML:", formData.seoContent); // Debug HTML output
//       const response = await createSeoContent(requestData);
//       if (response?.success) {
//         alert("Meta Info added Successfully!");
//         setFormData({
//           categoryId: "",
//           areaName: "",
//           city: "",
//           state: "",
//           pincode: "",
//           metaTitle: "",
//           metaDescription: "",
//           seoContent: "",
//         });
//         if (editor) editor.commands.clearContent();
//       } else {
//         throw new Error(response?.message || "Failed to submit review");
//       }
//     } catch (error: any) {
//       const errorMessage =
//         error?.response?.data?.message ||
//         error?.message ||
//         "An error occurred. Please try again later.";
//       setError(errorMessage);
//       alert(errorMessage);
//     }
//   };

//   // Handle form reset
//   const handleReset = () => {
//     setSelectedCategory({ name: "", slug: "", id: "" });
//     setSelectedCity("Hyderabad");
//     setSelectedState("Telangana");
//     setSelectedPincode("");
//     setSelectedArea("");
//     setSelectedSubArea("");
//     setSubAreaOptions([]);
//     setFormData({
//       categoryId: "",
//       areaName: "",
//       city: "",
//       state: "",
//       pincode: "",
//       metaTitle: "",
//       metaDescription: "",
//       seoContent: "",
//     });
//     setError(null);
//     if (editor) editor.commands.clearContent();
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
//       <div className="max-w-4xl mx-auto">
//         <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
//           <div className="flex items-center gap-3">
//             <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
//               <BookOpen className="h-6 w-6 text-white" />
//             </div>
//             <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
//               Add Meta Info
//             </h1>
//           </div>
//           <button
//             onClick={() => { navigate(-1); }}
//             className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
//           >
//             <ArrowLeft className="h-4 w-4 mr-2" />
//             Back
//           </button>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-8">
//           <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
//             <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
//               <h2 className="text-lg font-semibold text-white">Search Selection</h2>
//             </div>
//             <div className="p-6 space-y-6">
//               {error && <div className="text-red-500 mb-4">{error}</div>}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="relative">
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Category <span className="text-red-500">*</span>
//                   </label>
//                   <select
//                     className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
//                     value={selectedCategory.name}
//                     onChange={handleCategoryChange}
//                     required
//                   >
//                     <option value="" disabled>Select Category</option>
//                     {categories
//                       .sort((a, b) => a.category_name.toLowerCase().localeCompare(b.category_name.toLowerCase()))
//                       .map((cat, idx) => (
//                         <option key={idx} value={cat.category_name}>
//                           {cat.category_name}
//                         </option>
//                       ))}
//                   </select>
//                   <BiSolidCategory className="absolute left-3 top-[38px] text-blue-400" size={20} />
//                 </div>
//                 <div className="relative">
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     City <span className="text-red-500">*</span>
//                   </label>
//                   <select
//                     className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
//                     value={selectedCity}
//                     onChange={(e) => setSelectedCity(e.target.value)}
//                     required
//                   >
//                     <option value="" disabled>Select City</option>
//                     {cityOptions.map((city, idx) => (
//                       <option key={idx} value={city}>{city}</option>
//                     ))}
//                   </select>
//                   <MapPin className="absolute left-3 top-[38px] text-blue-400" size={20} />
//                 </div>
//                 <div className="relative">
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Area <span className="text-red-500">*</span>
//                   </label>
//                   <select
//                     className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
//                     value={selectedArea}
//                     onChange={handleAreaChange}
//                     required
//                   >
//                     <option value="" disabled>Select Area</option>
//                     {areaOptions
//                       ?.slice()
//                       .sort((a, b) => Number(a.pincode) - Number(b.pincode))
//                       .map((area, idx) => (
//                         <option key={`${area.pincode}-${idx}`} value={area.name}>
//                           {area.name} - {area.pincode}
//                         </option>
//                       ))}
//                   </select>
//                   <MapPin className="absolute left-3 top-[38px] text-blue-400" size={20} />
//                 </div>
//                 <div className="relative">
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Subarea</label>
//                   <select
//                     className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
//                     value={selectedSubArea}
//                     onChange={(e) => setSelectedSubArea(e.target.value)}
//                     disabled={!subAreaOptions.length}
//                   >
//                     <option value="" disabled>Select Subarea</option>
//                     {subAreaOptions.map((sub, idx) => (
//                       <option key={sub._id || idx} value={sub.name}>
//                         {sub.name}
//                       </option>
//                     ))}
//                   </select>
//                   <MapPin className="absolute left-3 top-[38px] text-blue-400" size={20} />
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
//             <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
//               <h2 className="text-lg font-semibold text-white">Meta Information</h2>
//             </div>
//             <div className="p-6 space-y-6">
//               <div className="space-y-2">
//                 <label className="block text-sm font-medium text-gray-700">
//                   Meta Title <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   name="metaTitle"
//                   value={formData.metaTitle}
//                   onChange={handleInputChange}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                   placeholder="Enter meta title"
//                   required
//                 />
//               </div>
//               <div className="space-y-2">
//                 <label className="block text-sm font-medium text-gray-700">
//                   Meta Description <span className="text-red-500">*</span>
//                 </label>
//                 <textarea
//                   name="metaDescription"
//                   value={formData.metaDescription}
//                   onChange={handleInputChange}
//                   rows={3}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                   placeholder="Enter meta description"
//                   required
//                 />
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
//             <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
//               <h2 className="text-lg font-semibold text-white">SEO Content</h2>
//             </div>
//             <div className="p-6">
//               <div className="space-y-2">
//                 <label className="block text-sm font-medium text-gray-700">
//                   SEO Content <span className="text-red-500">*</span>
//                 </label>
//                 <div className="flex gap-2 mb-4">
//                   <button
//                     type="button"
//                     onClick={() => editor?.chain().focus().toggleBold().run()}
//                     className="px-3 py-1 bg-gray-200 rounded"
//                     disabled={!editor?.isActive("bold")}
//                   >
//                     B
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => editor?.chain().focus().toggleItalic().run()}
//                     className="px-3 py-1 bg-gray-200 rounded"
//                     disabled={!editor?.isActive("italic")}
//                   >
//                     I
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => editor?.chain().focus().toggleUnderline().run()}
//                     className="px-3 py-1 bg-gray-200 rounded"
//                     disabled={!editor?.isActive("underline")}
//                   >
//                     U
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => editor?.chain().focus().toggleOrderedList().run()}
//                     className="px-3 py-1 bg-gray-200 rounded"
//                     disabled={!editor?.isActive("orderedList")}
//                   >
//                     OL
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => editor?.chain().focus().toggleBulletList().run()}
//                     className="px-3 py-1 bg-gray-200 rounded"
//                     disabled={!editor?.isActive("bulletList")}
//                   >
//                     UL
//                   </button>
//                   <button
//                     type="button"
//                     onClick={setLink}
//                     className="px-3 py-1 bg-gray-200 rounded"
//                   >
//                     Link
//                   </button>
//                   <button
//                     type="button"
//                     onClick={insertTable}
//                     className="px-3 py-1 bg-gray-200 rounded"
//                   >
//                     Table
//                   </button>
//                   <button
//                     type="button"
//                     onClick={insertPriceChart}
//                     className="px-3 py-1 bg-blue-500 text-white rounded"
//                   >
//                     Price Chart
//                   </button>
//                 </div>
//                 <EditorContent editor={editor} className="tiptap-editor" />
//               </div>
//             </div>
//           </div>

//           <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
//             <div className="flex gap-3 w-full sm:w-auto">
//               <button
//                 type="button"
//                 onClick={handleReset}
//                 className="w-full sm:w-auto flex items-center gap-2 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
//               >
//                 <RefreshCw className="h-5 w-5" />
//                 Reset
//               </button>
//             </div>
//             <button
//               type="submit"
//               className="w-full sm:w-auto flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
//             >
//               Add
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddMetaInfo;
// import React, { useState, useEffect } from "react";
// import { ArrowLeft, BookOpen, MapPin, RefreshCw } from "lucide-react";
// import { BiSolidCategory } from "react-icons/bi";
// import { getAllCategories, getAllPincodes, createSeoContent } from "../../api/apiMethods";
// import { useQuill } from "react-quilljs";
// import "quill/dist/quill.snow.css";
// import "quill-better-table/dist/quill-better-table.css";
// import Quill from "quill";
// import QuillBetterTable from "quill-better-table";

// // Register Quill better-table module
// Quill.register({
//   "modules/better-table": QuillBetterTable,
// }, true);

// interface AddCategoryProps {
//   onBack: () => void;
//   isEdit?: boolean;
//   categoryId?: number | null;
// }

// const AddMetaInfo: React.FC<AddCategoryProps> = ({
//   onBack,
//   isEdit = false,
//   categoryId,
// }) => {
//   const [categories, setCategories] = useState([]);
//   const [pincodeData, setPincodeData] = useState([]);
//   const [areaOptions, setAreaOptions] = useState([]);
//   const [subAreaOptions, setSubAreaOptions] = useState([]);
//   const [selectedCity, setSelectedCity] = useState("Hyderabad");
//   const [selectedState, setSelectedState] = useState("Telangana");
//   const [selectedCategory, setSelectedCategory] = useState({
//     name: "",
//     slug: "",
//     id: "",
//   });
//   const [selectedArea, setSelectedArea] = useState("");
//   const [selectedPincode, setSelectedPincode] = useState("");
//   const [selectedSubArea, setSelectedSubArea] = useState("");
//   const [formData, setFormData] = useState({
//     categoryId: "",
//     areaName: "",
//     city: "",
//     state: "",
//     pincode: "",
//     metaTitle: "",
//     metaDescription: "",
//     seoContent: "",
//   });
//   const [error, setError] = useState<string | null>(null);
//   const cityOptions = ["Hyderabad"];

//   // Initialize Quill editor
//   const { quill, quillRef } = useQuill({
//     theme: "snow",
//     modules: {
//       toolbar: {
//         container: [
//           [{ header: [1, 2, 3, false] }],
//           ["bold", "italic", "underline"],
//           [{ list: "ordered" }, { list: "bullet" }],
//           ["link"],
//           ["clean"],
//           [{ table: "insert-table" }, { table: "insert-price-chart" }],
//         ],
//         handlers: {
//           table: function (value: string) {
//             if (quill && value === "insert-table") {
//               const tableModule = quill.getModule("better-table");
//               if (tableModule) {
//                 tableModule.insertTable(3, 3); // Default 3x3 table
//               }
//             } else if (quill && value === "insert-price-chart") {
//               insertPriceChart();
//             }
//           },
//         },
//       },
//       "better-table": {
//         operationMenu: {
//           items: {
//             insertColumnRight: { text: "Insert column right" },
//             insertColumnLeft: { text: "Insert column left" },
//             insertRowUp: { text: "Insert row above" },
//             insertRowDown: { text: "Insert row below" },
//             mergeCells: { text: "Merge cells" },
//             unmergeCells: { text: "Unmerge cells" },
//             deleteRow: { text: "Delete row" },
//             deleteColumn: { text: "Delete column" },
//             deleteTable: { text: "Delete table" },
//           },
//         },
//       },
//       keyboard: {
//         bindings: QuillBetterTable.keyboardBindings,
//       },
//     },
//     formats: [
//       "header",
//       "bold",
//       "italic",
//       "underline",
//       "list",
//       "bullet",
//       "link",
//       "table",
//     ],
//   });

//   // Sync Quill content with formData
//   useEffect(() => {
//     if (quill) {
//       quill.on("text-change", () => {
//         setFormData((prev) => ({
//           ...prev,
//           seoContent: quill.root.innerHTML,
//         }));
//       });
//     }
//   }, [quill]);

//   // Fetch categories
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const res = await getAllCategories();
//         if (res.success && Array.isArray(res.data)) {
//           setCategories(res.data.filter((cat) => cat?.status === 1));
//         } else {
//           setError("Failed to fetch categories");
//         }
//       } catch (err) {
//         setError("Error fetching categories");
//       }
//     };
//     fetchCategories();
//   }, []);

//   // Fetch pincode and area data
//   useEffect(() => {
//     const fetchPincodeInfo = async () => {
//       try {
//         const res = await getAllPincodes();
//         if (res.success && Array.isArray(res.data)) {
//           setPincodeData(res.data);
//         } else {
//           setError("Failed to fetch pincodes");
//         }
//       } catch (err) {
//         setError("Error fetching pincodes");
//       }
//     };
//     fetchPincodeInfo();
//   }, []);

//   // Update area options
//   useEffect(() => {
//     const flattenedAreas = pincodeData.flatMap((p) =>
//       p.areas.map((area) => ({
//         ...area,
//         pincode: p.code,
//         state: p.state,
//         city: p.city,
//       }))
//     );
//     setAreaOptions(flattenedAreas);
//   }, [pincodeData]);

//   // Handle area selection
//   const handleAreaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const areaName = e.target.value;
//     setSelectedArea(areaName);

//     const matchedPincodeObj = pincodeData.find((p) =>
//       p.areas.some((a) => a.name === areaName)
//     );

//     if (matchedPincodeObj) {
//       setSelectedPincode(matchedPincodeObj.code);
//       setSelectedState(matchedPincodeObj.state);
//       setSelectedCity(matchedPincodeObj.city);

//       const matchedArea = matchedPincodeObj.areas.find(
//         (a) => a.name === areaName
//       );
//       const subAreas = matchedArea?.subAreas || [];
//       setSubAreaOptions([...subAreas].sort((a, b) => a.name.localeCompare(b.name)));
//       setSelectedSubArea("");
//     } else {
//       setSelectedPincode("");
//       setSubAreaOptions([]);
//       setSelectedSubArea("");
//     }
//   };

//   // Handle category selection
//   const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const index = e.target.selectedIndex - 1;
//     if (index >= 0) {
//       const cat = categories[index];
//       setSelectedCategory({
//         name: cat.category_name,
//         slug: cat.category_slug,
//         id: cat._id,
//       });
//       setFormData((prev) => ({
//         ...prev,
//         categoryId: cat._id,
//       }));
//     } else {
//       setSelectedCategory({ name: "", slug: "", id: "" });
//       setFormData((prev) => ({
//         ...prev,
//         categoryId: "",
//       }));
//     }
//   };

//   // Handle input changes
//   const handleInputChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   // Insert custom price chart
//   const insertPriceChart = () => {
//     if (!quill) return;

//     const tableModule = quill.getModule("better-table");
//     if (!tableModule) return;

//     const table = tableModule.insertTable(6, 3);
//     const range = quill.getSelection() || { index: 0, length: 0 };

//     // Insert heading
//     quill.insertText(
//       range.index,
//       "PRNV Services Best Plumbing Services in India\n",
//       { header: 1 },
//       "user"
//     );

//     // Populate table
//     const data = [
//       ["Plumbing Works", "Prices", "Location"],
//       ["Tap Repair", "Rs. 119", "Hyderabad"],
//       ["Flush Tank Repair", "Rs. 149", "Hyderabad"],
//       ["Wash Basin Installation", "Rs. 469", "Hyderabad"],
//       ["Waste Pipe Leakage", "Rs. 129", "Hyderabad"],
//       ["Shower Installation", "Rs. 133", "Hyderabad"],
//     ];

//     const tableElement = quill.root.querySelector("table:last-child");
//     if (tableElement) {
//       const rows = tableElement.querySelectorAll("tr");
//       data.forEach((rowData, rowIndex) => {
//         const cells = rows[rowIndex].querySelectorAll("td");
//         rowData.forEach((cellText, cellIndex) => {
//           cells[cellIndex].innerHTML = rowIndex === 0 ? `<strong>${cellText}</strong>` : cellText;
//         });
//       });
//     }

//     // Add link
//     quill.insertText(
//       quill.getLength() - 1,
//       "\nFor more details, visit our ",
//       "user"
//     );
//     quill.insertText(quill.getLength() - 1, "website", {
//       link: "https://prnvservices.com",
//       bold: true,
//     });
//     quill.insertText(quill.getLength() - 1, ".\n", "user");
//   };

//   // Handle form submission
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");

//     try {
//       if (
//         !formData.categoryId ||
//         !selectedArea ||
//         !selectedPincode ||
//         !formData.metaTitle ||
//         !formData.metaDescription ||
//         !formData.seoContent
//       ) {
//         setError("Please fill all required fields");
//         return;
//       }

//       const requestData = {
//         categoryId: formData.categoryId,
//         areaName: selectedArea,
//         city: selectedCity,
//         state: selectedState,
//         pincode: selectedPincode,
//         meta_title: formData.metaTitle,
//         meta_description: formData.metaDescription,
//         seo_content: formData.seoContent,
//       };

//       const response = await createSeoContent(requestData);
//       if (response?.success) {
//         alert("Meta Info added Successfully!");
//         setFormData({
//           categoryId: "",
//           areaName: "",
//           city: "",
//           state: "",
//           pincode: "",
//           metaTitle: "",
//           metaDescription: "",
//           seoContent: "",
//         });
//         if (quill) quill.setText("");
//       } else {
//         throw new Error(response?.message || "Failed to submit review");
//       }
//     } catch (error: any) {
//       const errorMessage =
//         error?.response?.data?.message ||
//         error?.message ||
//         "An error occurred. Please try again later.";
//       setError(errorMessage);
//       alert(errorMessage);
//     }
//   };

//   // Handle form reset
//   const handleReset = () => {
//     setSelectedCategory({ name: "", slug: "", id: "" });
//     setSelectedCity("Hyderabad");
//     setSelectedState("Telangana");
//     setSelectedPincode("");
//     setSelectedArea("");
//     setSelectedSubArea("");
//     setSubAreaOptions([]);
//     setFormData({
//       categoryId: "",
//       areaName: "",
//       city: "",
//       state: "",
//       pincode: "",
//       metaTitle: "",
//       metaDescription: "",
//       seoContent: "",
//     });
//     setError(null);
//     if (quill) quill.setText("");
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
//       <div className="max-w-4xl mx-auto">
//         <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
//           <div className="flex items-center gap-3">
//             <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
//               <BookOpen className="h-6 w-6 text-white" />
//             </div>
//             <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
//               {isEdit ? "Edit Meta Info" : "Add Meta Info"}
//             </h1>
//           </div>
//           <button
//             onClick={onBack}
//             className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
//           >
//             <ArrowLeft className="h-4 w-4 mr-2" />
//             Back
//           </button>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-8">
//           <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
//             <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
//               <h2 className="text-lg font-semibold text-white">Search Selection</h2>
//             </div>
//             <div className="p-6 space-y-6">
//               {error && <div className="text-red-500 mb-4">{error}</div>}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="relative">
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Category <span className="text-red-500">*</span>
//                   </label>
//                   <select
//                     className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
//                     value={selectedCategory.name}
//                     onChange={handleCategoryChange}
//                     required
//                   >
//                     <option value="" disabled>Select Category</option>
//                     {categories
//                       .sort((a, b) => a.category_name.toLowerCase().localeCompare(b.category_name.toLowerCase()))
//                       .map((cat, idx) => (
//                         <option key={idx} value={cat.category_name}>
//                           {cat.category_name}
//                         </option>
//                       ))}
//                   </select>
//                   <BiSolidCategory className="absolute left-3 top-[38px] text-blue-400" size={20} />
//                 </div>
//                 <div className="relative">
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     City <span className="text-red-500">*</span>
//                   </label>
//                   <select
//                     className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
//                     value={selectedCity}
//                     onChange={(e) => setSelectedCity(e.target.value)}
//                     required
//                   >
//                     <option value="" disabled>Select City</option>
//                     {cityOptions.map((city, idx) => (
//                       <option key={idx} value={city}>{city}</option>
//                     ))}
//                   </select>
//                   <MapPin className="absolute left-3 top-[38px] text-blue-400" size={20} />
//                 </div>
//                 <div className="relative">
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Area <span className="text-red-500">*</span>
//                   </label>
//                   <select
//                     className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
//                     value={selectedArea}
//                     onChange={handleAreaChange}
//                     required
//                   >
//                     <option value="" disabled>Select Area</option>
//                     {areaOptions
//                       ?.slice()
//                       .sort((a, b) => Number(a.pincode) - Number(b.pincode))
//                       .map((area, idx) => (
//                         <option key={`${area.pincode}-${idx}`} value={area.name}>
//                           {area.name} - {area.pincode}
//                         </option>
//                       ))}
//                   </select>
//                   <MapPin className="absolute left-3 top-[38px] text-blue-400" size={20} />
//                 </div>
//                 <div className="relative">
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Subarea</label>
//                   <select
//                     className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
//                     value={selectedSubArea}
//                     onChange={(e) => setSelectedSubArea(e.target.value)}
//                     disabled={!subAreaOptions.length}
//                   >
//                     <option value="" disabled>Select Subarea</option>
//                     {subAreaOptions.map((sub, idx) => (
//                       <option key={sub._id || idx} value={sub.name}>
//                         {sub.name}
//                       </option>
//                     ))}
//                   </select>
//                   <MapPin className="absolute left-3 top-[38px] text-blue-400" size={20} />
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
//             <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
//               <h2 className="text-lg font-semibold text-white">Meta Information</h2>
//             </div>
//             <div className="p-6 space-y-6">
//               <div className="space-y-2">
//                 <label className="block text-sm font-medium text-gray-700">
//                   Meta Title <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   name="metaTitle"
//                   value={formData.metaTitle}
//                   onChange={handleInputChange}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                   placeholder="Enter meta title"
//                   required
//                 />
//               </div>
//               <div className="space-y-2">
//                 <label className="block text-sm font-medium text-gray-700">
//                   Meta Description <span className="text-red-500">*</span>
//                 </label>
//                 <textarea
//                   name="metaDescription"
//                   value={formData.metaDescription}
//                   onChange={handleInputChange}
//                   rows={3}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                   placeholder="Enter meta description"
//                   required
//                 />
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
//             <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
//               <h2 className="text-lg font-semibold text-white">SEO Content</h2>
//             </div>
//             <div className="p-6">
//               <div className="space-y-2">
//                 <label className="block text-sm font-medium text-gray-700">
//                   SEO Content <span className="text-red-500">*</span>
//                 </label>
//                 <div ref={quillRef} style={{ height: "300px", marginBottom: "20px" }} />
//               </div>
//             </div>
//           </div>

//           <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
//             <div className="flex gap-3 w-full sm:w-auto">
//               <button
//                 type="button"
//                 onClick={handleReset}
//                 className="w-full sm:w-auto flex items-center gap-2 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
//               >
//                 <RefreshCw className="h-5 w-5" />
//                 Reset
//               </button>
//             </div>
//             <button
//               type="submit"
//               className="w-full sm:w-auto flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
//             >
//               {isEdit ? "Update" : "Add"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddMetaInfo;
// import React, { useState, useEffect } from "react";
// import { ArrowLeft, BookOpen, MapPin, RefreshCw } from "lucide-react";
// import { BiSolidCategory } from "react-icons/bi";
// import {
//   getAllCategories,
//   getAllPincodes as fetchPincodes,
//   createSeoContent,
// } from "../../api/apiMethods";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";

// import Quill from "quill";
// import QuillBetterTable from "quill-better-table";
// import "quill-better-table/dist/quill-better-table.css";

// // Register table module
// Quill.register(
//   {
//     "modules/better-table": QuillBetterTable,
//   },
//   true
// );

// interface AddCategoryProps {
//   onBack: () => void;
//   isEdit?: boolean;
//   categoryId?: number | null;
// }

// const AddMetaInfo: React.FC<AddCategoryProps> = ({
//   onBack,
//   isEdit = false,
//   categoryId,
// }) => {
//   // States for dropdowns
//   const [categories, setCategories] = useState([]);
//   const [pincodeData, setPincodeData] = useState([]);
//   const [areaOptions, setAreaOptions] = useState([]);
//   const [subAreaOptions, setSubAreaOptions] = useState([]);

//   // Selected values
//   const [selectedCity, setSelectedCity] = useState("Hyderabad");
//   const [selectedState, setSelectedState] = useState("Telangana");
//   const [selectedCategory, setSelectedCategory] = useState({
//     name: "",
//     slug: "",
//     id: "",
//   });
//   const [selectedArea, setSelectedArea] = useState("");
//   const [selectedPincode, setSelectedPincode] = useState("");
//   const [selectedSubArea, setSelectedSubArea] = useState("");

//   const [formData, setFormData] = useState({
//     categoryId: "",
//     areaName: "",
//     city: "",
//     state: "",
//     pincode: "",
//     metaTitle: "",
//     metaDescription: "",
//     seoContent: "",
//   });

//   const [error, setError] = useState<string | null>(null);
//   const cityOptions = ["Hyderabad"];

//   // Quill ref for programmatic insertion
//   const quillRef = React.useRef<ReactQuill>(null);

//   // Fetch categories
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const res = await getAllCategories();
//         if (res.success && Array.isArray(res.data)) {
//           setCategories(res.data.filter((cat) => cat?.status === 1));
//         } else {
//           setError("Failed to fetch categories");
//         }
//       } catch (err) {
//         setError("Error fetching categories");
//       }
//     };
//     fetchCategories();
//   }, []);

//   // Fetch pincode and area data
//   useEffect(() => {
//     const fetchPincodeInfo = async () => {
//       try {
//         const res = await fetchPincodes();
//         if (res.success && Array.isArray(res.data)) {
//           setPincodeData(res.data);
//         } else {
//           setError("Failed to fetch pincodes");
//         }
//       } catch (err) {
//         setError("Error fetching pincodes");
//       }
//     };
//     fetchPincodeInfo();
//   }, []);

//   // Update area options when pincodeData is available
//   useEffect(() => {
//     const flattenedAreas = pincodeData.flatMap((p) =>
//       p.areas.map((area) => ({
//         ...area,
//         pincode: p.code,
//         state: p.state,
//         city: p.city,
//       }))
//     );
//     setAreaOptions(flattenedAreas);
//   }, [pincodeData]);

//   // Handle area selection and update subareas
//   const handleAreaChange = (e) => {
//     const areaName = e.target.value;
//     setSelectedArea(areaName);

//     // Find area and related pincode
//     const matchedPincodeObj = pincodeData.find((p) =>
//       p.areas.some((a) => a.name === areaName)
//     );

//     if (matchedPincodeObj) {
//       setSelectedPincode(matchedPincodeObj.code);
//       setSelectedState(matchedPincodeObj.state);
//       setSelectedCity(matchedPincodeObj.city);

//       const matchedArea = matchedPincodeObj.areas.find(
//         (a) => a.name === areaName
//       );
//       const subAreas = matchedArea?.subAreas || [];

//       setSubAreaOptions(
//         [...subAreas].sort((a, b) => a.name.localeCompare(b.name))
//       );
//       setSelectedSubArea("");
//     } else {
//       setSelectedPincode("");
//       setSubAreaOptions([]);
//       setSelectedSubArea("");
//     }
//   };

//   const handleCategoryChange = (e) => {
//     const index = e.target.selectedIndex - 1;
//     if (index >= 0) {
//       const cat = categories[index];
//       setSelectedCategory({
//         name: cat.category_name,
//         slug: cat.category_slug,
//         id: cat._id,
//       });
//       setFormData((prev) => ({
//         ...prev,
//         categoryId: cat._id,
//       }));
//     } else {
//       setSelectedCategory({ name: "", slug: "", id: "" });
//       setFormData((prev) => ({
//         ...prev,
//         categoryId: "",
//       }));
//     }
//   };

//   const handleInputChange = (
//     e: React.ChangeEvent<
//       HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
//     >
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSeoContentChange = (value: string) => {
//     setFormData((prev) => ({
//       ...prev,
//       seoContent: value,
//     }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");

//     try {
//       if (
//         !formData.categoryId ||
//         !selectedArea ||
//         !selectedPincode ||
//         !formData.metaTitle ||
//         !formData.metaDescription ||
//         !formData.seoContent
//       ) {
//         setError("Please fill all required fields");
//         return;
//       }

//       const requestData = {
//         categoryId: formData.categoryId,
//         areaName: selectedArea,
//         city: selectedCity,
//         state: selectedState,
//         pincode: selectedPincode,
//         meta_title: formData.metaTitle,
//         meta_description: formData.metaDescription,
//         seo_content: formData.seoContent, // This is the raw HTML string with tags, tables, etc.
//       };

//       const response = await createSeoContent(requestData);

//       if (response?.success) {
//         alert("Meta Info added Successfully!");
//         setFormData({
//           categoryId: "",
//           areaName: "",
//           city: "",
//           state: "",
//           pincode: "",
//           metaTitle: "",
//           metaDescription: "",
//           seoContent: "",
//         });

//       } else {
//         throw new Error(response?.message || "Failed to submit review");
//       }
//     } catch (error: any) {
//       console.error("Error submitting review:", error);
//       const errorMessage =
//         error?.response?.data?.message ||
//         error?.message ||
//         "An error occurred. Please try again later.";
//       setError(errorMessage);
//       alert(errorMessage);
//     }
//   };

//   const handleReset = () => {
//     setSelectedCategory({ name: "", slug: "", id: "" });
//     setSelectedCity("Hyderabad");
//     setSelectedState("Telangana");
//     setSelectedPincode("");
//     setSelectedArea("");
//     setSelectedSubArea("");
//     setSubAreaOptions([]);
//     setFormData({
//       categoryId: "",
//       areaName: "",
//       city: "",
//       state: "",
//       pincode: "",
//       metaTitle: "",
//       metaDescription: "",
//       seoContent: "",
//     });
//     setError(null);
//   };

//   // Custom handler to insert the specific price chart table like in the image
//   const insertPriceChart = () => {
//     const quill = quillRef.current?.getEditor();
//     if (!quill) return;

//     const tableModule = quill.getModule("better-table");
//     if (!tableModule) return;

//     // Insert a 6x3 table (1 header row + 5 data rows)
//     const table = tableModule.insertTable(6, 3);

//     // Get the table element and rows
//     const tableBody = table.querySelector('tbody');
//     if (!tableBody) return;

//     const rows = tableBody.querySelectorAll('tr');

//     // Set header row with bold text
//     const headerCells = rows[0].querySelectorAll('td');
//     headerCells[0].innerHTML = '<strong>Plumbing Works</strong>';
//     headerCells[1].innerHTML = '<strong>Prices</strong>';
//     headerCells[2].innerHTML = '<strong>Location</strong>';

//     // Set data rows based on the image
//     const data = [
//       ["Tap Repair", "Rs. 119", "Hyderabad"],
//       ["Flush Tank Repair", "Rs. 149", "Hyderabad"],
//       ["Wash Basin Installation", "Rs. 469", "Hyderabad"],
//       ["Waste Pipe Leakage", "Rs. 129", "Hyderabad"],
//       ["Shower Installation", "Rs. 133", "Hyderabad"],
//     ];

//     data.forEach((rowData, index) => {
//       const cells = rows[index + 1].querySelectorAll('td');
//       rowData.forEach((cellText, cellIndex) => {
//         cells[cellIndex].innerHTML = cellText;
//       });
//     });

//     // Insert heading above the table (H1 or similar)
//     const range = quill.getSelection();
//     const delta = quill.insertText(
//       range ? range.index : 0,
//       "PRNV Services Best Plumbing Services in India\n",
//       "header",
//       1,
//       "user"
//     );
//     quill.insertText(range ? range.index + delta.ops.length : delta.ops.length, "\n", "user");

//     // Optionally, add a link example (e.g., a fake link below the table)
//     quill.insertText(
//       quill.getLength() - 1,
//       "\nFor more details, visit our ",
//       "user"
//     );
//     quill.insertText(quill.getLength() - 1, "website", {
//       link: "https://prnvservices.com",
//       bold: true,
//     });
//     quill.insertText(quill.getLength() - 1, ".\n", "user");
//   };

//   // Quill editor modules and formats
// const modules = {
//     toolbar: {
//       container: [
//         [{ header: [1, 2, 3, false] }],
//         ["bold", "italic", "underline"],
//         [{ list: "ordered" }, { list: "bullet" }],
//         ["link"],
//         ["clean"],
//         ["insertTable"], // ✅ our custom button
//       ],
//       handlers: {
//         insertTable: function () {
//           const table = this.quill.getModule("better-table");
//           if (table) {
//             table.insertTable(3, 3); // default 3x3 table
//           }
//         },
//       },
//     },
//     "better-table": {
//       operationMenu: {
//         items: {
//           insertColumnRight: { text: "Insert column right" },
//           insertColumnLeft: { text: "Insert column left" },
//           insertRowUp: { text: "Insert row above" },
//           insertRowDown: { text: "Insert row below" },
//           mergeCells: { text: "Merge cells" },
//           unmergeCells: { text: "Unmerge cells" },
//           deleteRow: { text: "Delete row" },
//           deleteColumn: { text: "Delete column" },
//           deleteTable: { text: "Delete table" },
//         },
//       },
//     },
//     keyboard: {
//       bindings: QuillBetterTable.keyboardBindings,
//     },
//   };

//   const formats = [
//     "header",
//     "bold",
//     "italic",
//     "underline",
//     "list",
//     "bullet",
//     "link",
//     "table", // ✅ this allows Quill to render <table>
//   ];
//   // const modules = {
//   //   toolbar: {
//   //     container: [
//   //       [{ header: [1, 2, 3, 4, 5, 6, false] }],
//   //       ["bold", "italic", "underline", "strike"],
//   //       [{ list: "ordered" }, { list: "bullet" }],
//   //       ["link"],
//   //       ["clean"],
//   //       ["insertTable"], // Standard table insert (3x3)
//   //       ["insertPriceChart"], // Custom button for price chart
//   //     ],
//   //     handlers: {
//   //       insertTable: function () {
//   //         const tableModule = this.quill.getModule("better-table");
//   //         if (tableModule) {
//   //           tableModule.insertTable(3, 3); // Default 3x3 table
//   //         }
//   //       },
//   //       insertPriceChart: insertPriceChart, // Custom handler for specific table
//   //     },
//   //   },
//   //   "better-table": {
//   //     operationMenu: {
//   //       items: {
//   //         insertColumnRight: { text: "Insert column right" },
//   //         insertColumnLeft: { text: "Insert column left" },
//   //         insertRowUp: { text: "Insert row above" },
//   //         insertRowDown: { text: "Insert row below" },
//   //         mergeCells: { text: "Merge cells" },
//   //         unmergeCells: { text: "Unmerge cells" },
//   //         deleteRow: { text: "Delete row" },
//   //         deleteColumn: { text: "Delete column" },
//   //         deleteTable: { text: "Delete table" },
//   //       },
//   //     },
//   //   },
//   //   keyboard: {
//   //     bindings: QuillBetterTable.keyboardBindings,
//   //   },
//   // };

//   // const formats = [
//   //   "header",
//   //   "bold",
//   //   "italic",
//   //   "underline",
//   //   "strike",
//   //   "list",
//   //   "bullet",
//   //   "link",
//   //   "table",
//   // ];

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
//       <div className="max-w-4xl mx-auto">
//         {/* Header */}
//         <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
//           <div className="flex items-center gap-3">
//             <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
//               <BookOpen className="h-6 w-6 text-white" />
//             </div>
//             <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
//               {isEdit ? "Edit Meta Info" : "Add Meta Info"}
//             </h1>
//           </div>
//           <button
//             onClick={onBack}
//             className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
//           >
//             <ArrowLeft className="h-4 w-4 mr-2" />
//             Back
//           </button>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-8">
//           {/* Search Selection Section */}
//           <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
//             <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
//               <h2 className="text-lg font-semibold text-white">
//                 Search Selection
//               </h2>
//             </div>

//             <div className="p-6 space-y-6">
//               {error && <div className="text-red-500 mb-4">{error}</div>}

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {/* Category Dropdown */}
//                 <div className="relative">
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Category <span className="text-red-500">*</span>
//                   </label>
//                   <select
//                     className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
//                     value={selectedCategory.name}
//                     onChange={handleCategoryChange}
//                     required
//                   >
//                     <option value="" disabled>
//                       Select Category
//                     </option>
//                     {categories
//                       .sort((a, b) => a.category_name.toLowerCase().localeCompare(b.category_name.toLowerCase()))
//                       .map((cat, idx) => (
//                         <option key={idx} value={cat.category_name}>
//                           {cat.category_name}
//                         </option>
//                       ))}
//                   </select>
//                   <BiSolidCategory
//                     className="absolute left-3 top-[38px] text-blue-400"
//                     size={20}
//                   />
//                 </div>

//                 {/* City Dropdown */}
//                 <div className="relative">
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     City <span className="text-red-500">*</span>
//                   </label>
//                   <select
//                     className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
//                     value={selectedCity}
//                     onChange={(e) => setSelectedCity(e.target.value)}
//                     required
//                   >
//                     <option value="" disabled>
//                       Select City
//                     </option>
//                     {cityOptions.map((city, idx) => (
//                       <option key={idx} value={city}>
//                         {city}
//                       </option>
//                     ))}
//                   </select>
//                   <MapPin
//                     className="absolute left-3 top-[38px] text-blue-400"
//                     size={20}
//                   />
//                 </div>

//                 {/* Area Dropdown */}
//                 <div className="relative">
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Area <span className="text-red-500">*</span>
//                   </label>
//                   <select
//                     className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
//                     value={selectedArea}
//                     onChange={handleAreaChange}
//                     required
//                   >
//                     <option value="" disabled>
//                       Select Area
//                     </option>

//                     {areaOptions
//                       ?.slice()
//                       .sort((a, b) => Number(a.pincode) - Number(b.pincode))
//                       .map((area, idx) => (
//                         <option key={`${area.pincode}-${idx}`} value={area.name}>
//                           {area.name} - {area.pincode}
//                         </option>
//                       ))}
//                   </select>

//                   <MapPin
//                     className="absolute left-3 top-[38px] text-blue-400"
//                     size={20}
//                   />
//                 </div>
//                 {/* Subarea Dropdown */}
//                 <div className="relative">
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Subarea
//                   </label>
//                   <select
//                     className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
//                     value={selectedSubArea}
//                     onChange={(e) => setSelectedSubArea(e.target.value)}
//                     disabled={!subAreaOptions.length}
//                   >
//                     <option value="" disabled>
//                       Select Subarea
//                     </option>
//                     {subAreaOptions.map((sub, idx) => (
//                       <option key={sub._id || idx} value={sub.name}>
//                         {sub.name}
//                       </option>
//                     ))}
//                   </select>
//                   <MapPin
//                     className="absolute left-3 top-[38px] text-blue-400"
//                     size={20}
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Meta Information */}
//           <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
//             <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
//               <h2 className="text-lg font-semibold text-white">
//                 Meta Information
//               </h2>
//             </div>

//             <div className="p-6 space-y-6">
//               <div className="space-y-2">
//                 <label className="block text-sm font-medium text-gray-700">
//                   Meta Title <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   name="metaTitle"
//                   value={formData.metaTitle}
//                   onChange={handleInputChange}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                   placeholder="Enter meta title"
//                   required
//                 />
//               </div>

//               <div className="space-y-2">
//                 <label className="block text-sm font-medium text-gray-700">
//                   Meta Description <span className="text-red-500">*</span>
//                 </label>
//                 <textarea
//                   name="metaDescription"
//                   value={formData.metaDescription}
//                   onChange={handleInputChange}
//                   rows={3}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                   placeholder="Enter meta description"
//                   required
//                 />
//               </div>
//             </div>
//           </div>

//           {/* SEO Content */}
//           <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
//             <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
//               <h2 className="text-lg font-semibold text-white">SEO Content</h2>
//             </div>

//             <div className="p-6">
//               <div className="space-y-2">
//                 <label className="block text-sm font-medium text-gray-700">
//                   SEO Content <span className="text-red-500">*</span>
//                 </label>
//                 <ReactQuill
//                   ref={quillRef}
//                   value={formData.seoContent}
//                   onChange={handleSeoContentChange}
//                   modules={modules}
//                   formats={formats}
//                   theme="snow"
//                   style={{ height: "300px", marginBottom: "20px" }}
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Action Buttons */}
//           <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
//             <div className="flex gap-3 w-full sm:w-auto">
//               <button
//                 type="button"
//                 onClick={handleReset}
//                 className="w-full sm:w-auto flex items-center gap-2 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
//               >
//                 <RefreshCw className="h-5 w-5" />
//                 Reset
//               </button>
//             </div>
//             <button
//               type="submit"
//               className="w-full sm:w-auto flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
//             >
//               {isEdit ? "Update" : "Add"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddMetaInfo;

// import { useState, useEffect } from "react";
// import { ArrowLeft, BookOpen, MapPin, RefreshCw } from "lucide-react";
// import { BiSolidCategory } from "react-icons/bi";
// import { getAllCategories, getAllPincodes as fetchPincodes, createSeoContent } from "../../api/apiMethods";
// import ReactQuill from "react-quill";
// import Quill from "quill";
// import BetterTable from "quill-better-table";
// import "react-quill/dist/quill.snow.css";
// import "quill-better-table/dist/quill-better-table.css";

// // Register quill-better-table module
// Quill.register("modules/better-table", BetterTable);

// interface AddCategoryProps {
//   onBack: () => void;
//   isEdit?: boolean;
//   categoryId?: number | null;
// }

// const AddMetaInfo: React.FC<AddCategoryProps> = ({ onBack, isEdit = false, categoryId }) => {
//   // States for dropdowns
//   const [categories, setCategories] = useState([]);
//   const [pincodeData, setPincodeData] = useState([]);
//   const [areaOptions, setAreaOptions] = useState([]);
//   const [subAreaOptions, setSubAreaOptions] = useState([]);

//   // Selected values
//   const [selectedCity, setSelectedCity] = useState("Hyderabad");
//   const [selectedState, setSelectedState] = useState("Telangana");
//   const [selectedCategory, setSelectedCategory] = useState({ name: "", slug: "", id: "" });
//   const [selectedArea, setSelectedArea] = useState("");
//   const [selectedPincode, setSelectedPincode] = useState("");
//   const [selectedSubArea, setSelectedSubArea] = useState("");

//   const [formData, setFormData] = useState({
//     categoryId: "",
//     areaName: "",
//     city: "",
//     state: "",
//     pincode: "",
//     metaTitle: "",
//     metaDescription: "",
//     seoContent: "",
//   });

//   const [error, setError] = useState<string | null>(null);
//   const cityOptions = ["Hyderabad"];

//   // Fetch categories
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const res = await getAllCategories();
//         if (res.success && Array.isArray(res.data)) {
//           setCategories(res.data.filter((cat) => cat?.status === 1));
//         } else {
//           setError("Failed to fetch categories");
//         }
//       } catch (err) {
//         setError("Error fetching categories");
//       }
//     };
//     fetchCategories();
//   }, []);

//   // Fetch pincode and area data
//   useEffect(() => {
//     const fetchPincodeInfo = async () => {
//       try {
//         const res = await fetchPincodes();
//         if (res.success && Array.isArray(res.data)) {
//           setPincodeData(res.data);
//         } else {
//           setError("Failed to fetch pincodes");
//         }
//       } catch (err) {
//         setError("Error fetching pincodes");
//       }
//     };
//     fetchPincodeInfo();
//   }, []);

//   // Update area options when pincodeData is available
//   useEffect(() => {
//     const flattenedAreas = pincodeData.flatMap((p) =>
//       p.areas.map((area) => ({
//         ...area,
//         pincode: p.code,
//         state: p.state,
//         city: p.city,
//       }))
//     );
//     setAreaOptions(flattenedAreas);
//   }, [pincodeData]);

//   // Handle area selection and update subareas
//   const handleAreaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const areaName = e.target.value;
//     setSelectedArea(areaName);

//     const matchedPincodeObj = pincodeData.find((p) => p.areas.some((a) => a.name === areaName));

//     if (matchedPincodeObj) {
//       setSelectedPincode(matchedPincodeObj.code);
//       setSelectedState(matchedPincodeObj.state);
//       setSelectedCity(matchedPincodeObj.city);

//       const matchedArea = matchedPincodeObj.areas.find((a) => a.name === areaName);
//       const subAreas = matchedArea?.subAreas || [];

//       setSubAreaOptions([...subAreas].sort((a, b) => a.name.localeCompare(b.name)));
//       setSelectedSubArea("");
//     } else {
//       setSelectedPincode("");
//       setSubAreaOptions([]);
//       setSelectedSubArea("");
//     }
//   };

//   const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const index = e.target.selectedIndex - 1;
//     if (index >= 0) {
//       const cat = categories[index];
//       setSelectedCategory({
//         name: cat.category_name,
//         slug: cat.category_slug,
//         id: cat._id,
//       });
//       setFormData((prev) => ({
//         ...prev,
//         categoryId: cat._id,
//       }));
//     } else {
//       setSelectedCategory({ name: "", slug: "", id: "" });
//       setFormData((prev) => ({
//         ...prev,
//         categoryId: "",
//       }));
//     }
//   };

//   const handleInputChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSeoContentChange = (value: string) => {
//     setFormData((prev) => ({
//       ...prev,
//       seoContent: value,
//     }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");

//     try {
//       if (
//         !formData.categoryId ||
//         !selectedArea ||
//         !selectedPincode ||
//         !formData.metaTitle ||
//         !formData.metaDescription ||
//         !formData.seoContent
//       ) {
//         setError("Please fill all required fields");
//         return;
//       }

//       const requestData = {
//         categoryId: formData.categoryId,
//         areaName: selectedArea,
//         city: selectedCity,
//         state: selectedState,
//         pincode: selectedPincode,
//         meta_title: formData.metaTitle,
//         meta_description: formData.metaDescription,
//         seo_content: formData.seoContent,
//       };

//       const response = await createSeoContent(requestData);

//       if (response?.success) {
//         alert("Meta Info added Successfully!");
//         setFormData({
//           categoryId: "",
//           areaName: "",
//           city: "",
//           state: "",
//           pincode: "",
//           metaTitle: "",
//           metaDescription: "",
//           seoContent: "",
//         });
//       } else {
//         throw new Error(response?.message || "Failed to submit review");
//       }
//     } catch (error: any) {
//       console.error("Error submitting review:", error);
//       const errorMessage =
//         error?.response?.data?.message ||
//         error?.message ||
//         "An error occurred. Please try again later.";
//       setError(errorMessage);
//       alert(errorMessage);
//     }
//   };

//   const handleReset = () => {
//     setSelectedCategory({ name: "", slug: "", id: "" });
//     setSelectedCity("Hyderabad");
//     setSelectedState("Telangana");
//     setSelectedPincode("");
//     setSelectedArea("");
//     setSelectedSubArea("");
//     setSubAreaOptions([]);
//     setFormData({
//       categoryId: "",
//       areaName: "",
//       city: "",
//       state: "",
//       pincode: "",
//       metaTitle: "",
//       metaDescription: "",
//       seoContent: "",
//     });
//     setError(null);
//   };

//   // Quill editor modules with table support
//   const modules = {
//     toolbar: [
//       [{ header: [1, 2, 3, false] }],
//       ["bold", "italic", "underline", "strike"],
//       [{ list: "ordered" }, { list: "bullet" }],
//       ["link"],
//       [
//         { table: "insert-table" },
//         { table: "insert-row-above" },
//         { table: "insert-row-below" },
//         { table: "insert-column-left" },
//         { table: "insert-column-right" },
//         { table: "delete-table" },
//       ],
//       ["clean"],
//     ],
//     table: false, // Disable default table module
//     "better-table": {
//       operationMenu: {
//         items: {
//           unmergeCells: {
//             text: "Unmerge cells",
//           },
//         },
//         color: {
//           colors: ["#000000", "#e60000", "#ff9900", "#ffff00", "#008a00"],
//           text: "Background Color",
//         },
//       },
//     },
//   };

//   // Formats including table support
//   const formats = [
//     "header",
//     "bold",
//     "italic",
//     "underline",
//     "strike",
//     "list",
//     "bullet",
//     "link",
//     "table", // Required for quill-better-table
//   ];

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
//       <div className="max-w-4xl mx-auto">
//         {/* Header */}
//         <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
//           <div className="flex items-center gap-3">
//             <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
//               <BookOpen className="h-6 w-6 text-white" />
//             </div>
//             <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
//               {isEdit ? "Edit Meta Info" : "Add Meta Info"}
//             </h1>
//           </div>
//           <button
//             onClick={onBack}
//             className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
//           >
//             <ArrowLeft className="h-4 w-4 mr-2" />
//             Back
//           </button>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-8">
//           {/* Search Selection Section */}
//           <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
//             <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
//               <h2 className="text-lg font-semibold text-white">Search Selection</h2>
//             </div>

//             <div className="p-6 space-y-6">
//               {error && <div className="text-red-500 mb-4">{error}</div>}

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {/* Category Dropdown */}
//                 <div className="relative">
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Category <span className="text-red-500">*</span>
//                   </label>
//                   <select
//                     className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
//                     value={selectedCategory.name}
//                     onChange={handleCategoryChange}
//                     required
//                   >
//                     <option value="" disabled>
//                       Select Category
//                     </option>
//                     {categories
//                       .sort((a, b) => a.category_name.toLowerCase().localeCompare(b.category_name.toLowerCase()))
//                       .map((cat, idx) => (
//                         <option key={idx} value={cat.category_name}>
//                           {cat.category_name}
//                         </option>
//                       ))}
//                   </select>
//                   <BiSolidCategory
//                     className="absolute left-3 top-[38px] text-blue-400"
//                     size={20}
//                   />
//                 </div>

//                 {/* City Dropdown */}
//                 <div className="relative">
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     City <span className="text-red-500">*</span>
//                   </label>
//                   <select
//                     className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
//                     value={selectedCity}
//                     onChange={(e) => setSelectedCity(e.target.value)}
//                     required
//                   >
//                     <option value="" disabled>
//                       Select City
//                     </option>
//                     {cityOptions.map((city, idx) => (
//                       <option key={idx} value={city}>
//                         {city}
//                       </option>
//                     ))}
//                   </select>
//                   <MapPin
//                     className="absolute left-3 top-[38px] text-blue-400"
//                     size={20}
//                   />
//                 </div>

//                 {/* Area Dropdown */}
//                 <div className="relative">
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Area <span className="text-red-500">*</span>
//                   </label>
//                   <select
//                     className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
//                     value={selectedArea}
//                     onChange={handleAreaChange}
//                     required
//                   >
//                     <option value="" disabled>
//                       Select Area
//                     </option>
//                     {areaOptions
//                       .sort((a, b) => a.name.localeCompare(b.name))
//                       .map((area, idx) => (
//                         <option key={idx} value={area.name}>
//                           {area.name} - {area.pincode}
//                         </option>
//                       ))}
//                   </select>
//                   <MapPin
//                     className="absolute left-3 top-[38px] text-blue-400"
//                     size={20}
//                   />
//                 </div>

//                 {/* Subarea Dropdown */}
//                 <div className="relative">
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Subarea
//                   </label>
//                   <select
//                     className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
//                     value={selectedSubArea}
//                     onChange={(e) => setSelectedSubArea(e.target.value)}
//                     disabled={!subAreaOptions.length}
//                   >
//                     <option value="" disabled>
//                       Select Subarea
//                     </option>
//                     {subAreaOptions.map((sub, idx) => (
//                       <option key={sub._id || idx} value={sub.name}>
//                         {sub.name}
//                       </option>
//                     ))}
//                   </select>
//                   <MapPin
//                     className="absolute left-3 top-[38px] text-blue-400"
//                     size={20}
//                   />
//                 </div>
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
//                 <label className="block text-sm font-medium text-gray-700">
//                   Meta Title <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   name="metaTitle"
//                   value={formData.metaTitle}
//                   onChange={handleInputChange}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                   placeholder="Enter meta title"
//                   required
//                 />
//               </div>

//               <div className="space-y-2">
//                 <label className="block text-sm font-medium text-gray-700">
//                   Meta Description <span className="text-red-500">*</span>
//                 </label>
//                 <textarea
//                   name="metaDescription"
//                   value={formData.metaDescription}
//                   onChange={handleInputChange}
//                   rows={3}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                   placeholder="Enter meta description"
//                   required
//                 />
//               </div>
//             </div>
//           </div>

//           {/* SEO Content */}
//           <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
//             <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
//               <h2 className="text-lg font-semibold text-white">SEO Content</h2>
//             </div>

//             <div className="p-6">
//               <div className="space-y-2">
//                 <label className="block text-sm font-medium text-gray-700">
//                   SEO Content <span className="text-red-500">*</span>
//                 </label>
//                 <ReactQuill
//                   value={formData.seoContent}
//                   onChange={handleSeoContentChange}
//                   modules={modules}
//                   formats={formats}
//                   placeholder="Write your SEO content here..."
//                   className="bg-white rounded-lg"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Action Buttons */}
//           <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
//             <div className="flex gap-3 w-full sm:w-auto">
//               <button
//                 type="button"
//                 onClick={handleReset}
//                 className="w-full sm:w-auto flex items-center gap-2 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
//               >
//                 <RefreshCw className="h-5 w-5" />
//                 Reset
//               </button>
//             </div>
//             <button
//               type="submit"
//               className="w-full sm:w-auto flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
//             >
//               {isEdit ? "Update" : "Add"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddMetaInfo;

// import React, { useState } from 'react';
// import { ArrowLeft, BookOpen, Upload, Wrench } from 'lucide-react';

// interface AddCategoryProps {
//   onBack: () => void;
//   isEdit?: boolean;
//   categoryId?: number | null;
// }

// const AddMetaInfo: React.FC<AddCategoryProps> = ({ onBack, isEdit = false, categoryId }) => {
//   const [formData, setFormData] = useState({
//     categoryName: '',
//     categoryDescription: '',
//     status: 'active',
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
//               <BookOpen className="h-6 w-6 text-white" />
//             </div>
//             <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
//               {isEdit ? 'Edit Meta Info' : 'Add Meta Info'}
//             </h1>
//           </div>
//           <button
//             onClick={onBack}
//             className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
//           >
//             <ArrowLeft className="h-4 w-4 mr-2" />
//             Back to MetaInfo
//           </button>
//         </div>

//  <form onSubmit={handleSubmit} className="space-y-8">

//              {/* Meta Information */}
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
//               {isEdit ? 'Update' : 'Create'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddMetaInfo;

// // import React from 'react'

// // const AddMetaInfo = () => {
// //   return (
// //     <div>AddMetaInfo</div>
// //   )
// // }

// // export default AddMetaInfo
