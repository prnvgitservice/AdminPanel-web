import { useState, useEffect } from "react";
import { ArrowLeft, BookOpen, MapPin, RefreshCw } from "lucide-react";
import { BiSolidCategory } from "react-icons/bi";
import { getAllCategories, getAllPincodes as fetchPincodes, createSeoContent } from "../../api/apiMethods";
import ReactQuill from "react-quill";
import Quill from "quill";
import BetterTable from "quill-better-table";
import "react-quill/dist/quill.snow.css";
import "quill-better-table/dist/quill-better-table.css";

// Register quill-better-table module
Quill.register("modules/better-table", BetterTable);

interface AddCategoryProps {
  onBack: () => void;
  isEdit?: boolean;
  categoryId?: number | null;
}

const AddMetaInfo: React.FC<AddCategoryProps> = ({ onBack, isEdit = false, categoryId }) => {
  // States for dropdowns
  const [categories, setCategories] = useState([]);
  const [pincodeData, setPincodeData] = useState([]);
  const [areaOptions, setAreaOptions] = useState([]);
  const [subAreaOptions, setSubAreaOptions] = useState([]);

  // Selected values
  const [selectedCity, setSelectedCity] = useState("Hyderabad");
  const [selectedState, setSelectedState] = useState("Telangana");
  const [selectedCategory, setSelectedCategory] = useState({ name: "", slug: "", id: "" });
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

  // Fetch pincode and area data
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

  // Update area options when pincodeData is available
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

    const matchedPincodeObj = pincodeData.find((p) => p.areas.some((a) => a.name === areaName));

    if (matchedPincodeObj) {
      setSelectedPincode(matchedPincodeObj.code);
      setSelectedState(matchedPincodeObj.state);
      setSelectedCity(matchedPincodeObj.city);

      const matchedArea = matchedPincodeObj.areas.find((a) => a.name === areaName);
      const subAreas = matchedArea?.subAreas || [];

      setSubAreaOptions([...subAreas].sort((a, b) => a.name.localeCompare(b.name)));
      setSelectedSubArea("");
    } else {
      setSelectedPincode("");
      setSubAreaOptions([]);
      setSelectedSubArea("");
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
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
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
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
        alert("Meta Info added Successfully!");
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

  // Quill editor modules with table support
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link"],
      [
        { table: "insert-table" },
        { table: "insert-row-above" },
        { table: "insert-row-below" },
        { table: "insert-column-left" },
        { table: "insert-column-right" },
        { table: "delete-table" },
      ],
      ["clean"],
    ],
    table: false, // Disable default table module
    "better-table": {
      operationMenu: {
        items: {
          unmergeCells: {
            text: "Unmerge cells",
          },
        },
        color: {
          colors: ["#000000", "#e60000", "#ff9900", "#ffff00", "#008a00"],
          text: "Background Color",
        },
      },
    },
  };

  // Formats including table support
  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "link",
    "table", // Required for quill-better-table
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
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
          {/* Search Selection Section */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
              <h2 className="text-lg font-semibold text-white">Search Selection</h2>
            </div>

            <div className="p-6 space-y-6">
              {error && <div className="text-red-500 mb-4">{error}</div>}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Category Dropdown */}
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

                {/* City Dropdown */}
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

                {/* Area Dropdown */}
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
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map((area, idx) => (
                        <option key={idx} value={area.name}>
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

          {/* Meta Information */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
              <h2 className="text-lg font-semibold text-white">Meta Information</h2>
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
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
              <h2 className="text-lg font-semibold text-white">SEO Content</h2>
            </div>

            <div className="p-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  SEO Content <span className="text-red-500">*</span>
                </label>
                <ReactQuill
                  value={formData.seoContent}
                  onChange={handleSeoContentChange}
                  modules={modules}
                  formats={formats}
                  placeholder="Write your SEO content here..."
                  className="bg-white rounded-lg"
                />
              </div>
            </div>
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
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {isEdit ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMetaInfo;
// import React, { useState, useEffect } from "react";
// import { ArrowLeft, BookOpen, MapPin, RefreshCw, Search } from "lucide-react";
// import { BiSolidCategory } from "react-icons/bi";
// import {
//   getAllCategories,
//   getAllPincodes as fetchPincodes,
//   createSeoContent,
// } from "../../api/apiMethods";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";

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
//      setError("");

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
//       categoryId: "",
//       areaName: "",
//       city: "",
//       state: "",
//       pincode: "",
//       metaTitle: "",
//       metaDescription: "",
//       seoContent: "",
//     });

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

//   // Quill editor modules and formats
//   const modules = {
//     toolbar: [
//       [{ header: [1, 2, 3, false] }],
//       ["bold", "italic", "underline", "strike"],
//       [{ list: "ordered" }, { list: "bullet" }],
//       ["link"],
//       ["clean"],
//     ],
//   };

//   const formats = [
//     "header",
//     "bold",
//     "italic",
//     "underline",
//     "strike",
//     "list",
//     "bullet",
//     "link",
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
//                     .sort((a, b) => a.category_name.toLowerCase().localeCompare(b.category_name.toLowerCase()))
//                     .map((cat, idx) => (
//                       <option key={idx} value={cat.category_name}>
//                         {cat.category_name}
//                       </option>
//                     ))}
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
//               {/* <button
//                 type="button"
//                 onClick={onBack}
//                 className="w-full sm:w-auto px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
//               >
//                 Cancel
//               </button> */}
//             </div>
//             <button
//               type="submit"
//               className="w-full sm:w-auto flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
//             >
//               {/* <Search className="h-5 w-5" /> */}
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