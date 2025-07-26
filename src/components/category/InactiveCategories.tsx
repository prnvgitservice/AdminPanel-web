import React, { useMemo, useState } from "react";
import {
  Plus,
  RotateCcw,
  Filter,
  Edit,
  Eye,
  Trash2,
  Wrench,
} from "lucide-react";
import { useCategoryContext } from "../Context/CategoryContext";
import { useNavigate } from "react-router-dom";
import { deleteCategory } from "../../api/apiMethods";

interface Category {
  _id: string;
  category_name: string;
  category_image: string;
  status: number;
  meta_title: string;
  meta_description: string;
  servicesCount: number;
  createdAt: string;
}

interface AllCategoriesProps {
  onAddCategory: () => void;
  onEdit: (id: string) => void;
}

const InactiveCategories: React.FC<AllCategoriesProps> = ({
  onAddCategory,
  onEdit,
}) => {
  const { categories, setCategories, loading, error } = useCategoryContext();
  const navigate = useNavigate();
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState({
    categoryName: "",
    status: "inactive",
  });

  const filteredCategories = useMemo(() => {
    return categories?.filter((category) => {
      const matchesName = filters.categoryName
        ? category.category_name
            .toLowerCase()
            .includes(filters.categoryName.toLowerCase())
        : true;
      const matchesStatus = filters.status
        ? category.status === 0
        : true;
      return matchesName && matchesStatus;
    });
  }, [categories, filters]);

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleRefresh = () => {
    setShowFilter(false);
    setFilters({
      categoryName: "",
      status: "inactive",
    });
  };

  const handleFilterSubmit = () => {
    console.log("Applying filters:", filters);
  };

  const handleStatusToggle = async (id: string) => {
    try {
      await updateCategoryStatus(
        id,
        !categories.find((c) => c._id === id)?.status
      );
      setCategories((prev) =>
        prev.map((c) => (c._id === id ? { ...c, status: c.status ? 0 : 1 } : c))
      );
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await deleteCategory(id);
        setCategories((prev) => prev.filter((c) => c._id !== id));
      } catch (error) {
        console.error("Failed to delete category", error);
      }
    }
  };

  const handleEdit = (category: Category) => {
    navigate(`/categories/edit`, { state: { category } });
  };

  const handleView = (category: Category) => {
    navigate(`/category/${category._id}`, { state: { category } });
  };

  if (loading) {
    return <div className="text-center py-8">Loading categories...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
              <Wrench className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Inactive Categories
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleRefresh}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Refresh
            </button>
            <button
              onClick={() => setShowFilter(!showFilter)}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </button>
            <button
              onClick={onAddCategory}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </button>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilter && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8 animate-in slide-in-from-top duration-300 flex">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Name
                </label>
                <select
                  value={filters.categoryName}
                  onChange={(e) =>
                    handleFilterChange("categoryName", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select category</option>
                  {categories
                    .filter((c) => c.status === 0)
                    .map((category) => (
                      <option key={category._id} value={category.category_name}>
                        {category.category_name}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <div className="flex justify-center items-center">
              <button
                onClick={handleFilterSubmit}
                className="px-8 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Search
              </button>
            </div>
          </div>
        )}

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredCategories?.map((category) => (
            <div
              key={category._id}
              className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="relative">
                <div className="flex justify-center items-center p-2">
                  <img
                    src={category.category_image}
                    alt={category.category_name}
                    className="h-32"
                  />
                </div>
                <div className="absolute top-4 right-4">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={category.status === 1}
                      onChange={() => handleStatusToggle(category._id)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                  </label>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                    {category.category_name}
                  </h3>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      category.status === 1
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {category.status ? "Active" : "Inactive"}
                  </span>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {category.meta_title}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm text-gray-500">
                    <span className="font-medium">
                      {category?.servicesCount || 5}
                    </span>{" "}
                    Technicians
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(category?.createdAt).toLocaleDateString("en-GB")}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEdit(category)}
                      className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleView(category)}
                      className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-all duration-200"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(category._id)}
                      className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg">
                    View Technicians
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InactiveCategories;
// import React, { useMemo, useState } from "react";
// import {
//   Plus,
//   RotateCcw,
//   Filter,
//   Edit,
//   Eye,
//   Trash2,
//   Calendar,
//   Wrench,
// } from "lucide-react";
// import { useCategoryContext } from "../Context/CategoryContext";

// interface AllCategoriesProps {
//   onAddCategory: () => void;
//   onEdit: (id: number) => void;
// }

// const InactiveCategories: React.FC<AllCategoriesProps> = ({
//   onAddCategory,
//   onEdit,
// }) => {
//   const { categories, setCategories, loading, error } = useCategoryContext();
//   const [showFilter, setShowFilter] = useState(false);
//   const [filters, setFilters] = useState({
//     categoryName: "",
//     status: "inactive",
//   });

//   const filteredCategories = useMemo(() => {
//         return categories?.filter((category)=>{
//         const matchesName = filters.categoryName ? category.category_name.toLowerCase().includes(filters.categoryName.toLowerCase()) : true;
//         const matchesStatus = filters.status ? category.status === 0 === (filters.status === 'inactive') : true;
//         return matchesName && matchesStatus;
            
//         })
//     }, [categories, filters]);

//   const handleFilterChange = (field: string, value: string) => {
//     setFilters((prev) => ({
//       ...prev,
//       [field]: value,
//     }));
//   };

//   const handleRefresh = () => {
//     setShowFilter(false);
//     setFilters({
//       categoryName: "",
//       status: "inactive",
//     });
//   };

//   const handleFilterSubmit = () => {
//     console.log("Applying filters:", filters);
//   };

//   const handleStatusToggle = (id: number) => {
//     console.log("Toggle status for category:", id);
//   };

//   const handleDelete = (id: number) => {
//     if (window.confirm("Are you sure you want to delete this category?")) {
//       console.log("Delete category:", id);
//     }
//   };

//   if (loading) {
//     return <div className="text-center py-8">Loading categories...</div>;
//   }

//   if (error) {
//     return <div className="text-center py-8 text-red-600">{error}</div>;
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
//           <div className="flex items-center gap-3">
//             <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
//               <Wrench className="h-6 w-6 text-white" />
//             </div>
//             <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
//               Inactive Categories
//             </h1>
//           </div>
//           <div className="flex flex-wrap items-center gap-2">
//             <button
//               onClick={handleRefresh}
//               className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
//             >
//               <RotateCcw className="h-4 w-4 mr-2" />
//               Refresh
//             </button>
//             <button
//               onClick={() => setShowFilter(!showFilter)}
//               className="flex items-center px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
//             >
//               <Filter className="h-4 w-4 mr-2" />
//               Filter
//             </button>
//           </div>
//         </div>

//         {/* Filter Panel */}
//         {showFilter && (
//           <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8 animate-in slide-in-from-top duration-300 flex">
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Category Name
//                 </label>
//                 <select
//                   value={filters.categoryName}
//                   onChange={(e) =>
//                     handleFilterChange("categoryName", e.target.value)
//                   }
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 >
//                   <option value="">Select category</option>
//                   {categories
//                   .filter(c => c.status === 0).map((category) => (
//                     <option key={category?._id} value={category.category_name}>
//                       {category.category_name}
//                     </option>
//                   ))}{" "}
//                 </select>
//               </div>
//             </div>

//             <div className="flex justify-center items-center">
//               <button
//                 onClick={handleFilterSubmit}
//                 className="px-8 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
//               >
//                 Search
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Categories Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
//           {filteredCategories
//             .map((category) => (
//               <div
//                 key={category._id}
//                 className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
//               >
//                 <div className="relative">
//                   <img
//                     src={category.category_image}
//                     alt={category.category_name}
//                     className="w-full h-48 object-cover"
//                   />
//                   <div className="absolute top-4 right-4">
//                     <label className="relative inline-flex items-center cursor-pointer">
//                       <input
//                         type="checkbox"
//                         className="sr-only peer"
//                         checked={category.status === 1}
//                         onChange={() => handleStatusToggle(category._id)}
//                       />
//                       <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
//                     </label>
//                   </div>
//                 </div>

//                 <div className="p-6">
//                   <div className="flex items-start justify-between mb-3">
//                     <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
//                       {category.category_name}
//                     </h3>
//                     <span
//                       className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
//                         category.status === 1
//                           ? "bg-green-100 text-green-800"
//                           : "bg-red-100 text-red-800"
//                       }`}
//                     >
//                       {category.status ? "Active" : "Inactive"}
//                     </span>
//                   </div>

//                   <p className="text-gray-600 text-sm mb-4 line-clamp-2">
//                     {category.meta_title}
//                   </p>

//                   <div className="flex items-center justify-between mb-4">
//                     <div className="text-sm text-gray-500">
//                       <span className="font-medium">
//                         {category.servicesCount}
//                       </span>{" "}
//                       Technicians
//                     </div>
//                     <div className="text-sm text-gray-500">{category.date}</div>
//                   </div>

//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center space-x-2">
//                       <button
//                         onClick={() => onEdit(category._id)}
//                         className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200"
//                       >
//                         <Edit className="h-4 w-4" />
//                       </button>
//                       <button className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-all duration-200">
//                         <Eye className="h-4 w-4" />
//                       </button>
//                       <button
//                         onClick={() => handleDelete(category._id)}
//                         className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200"
//                       >
//                         <Trash2 className="h-4 w-4" />
//                       </button>
//                     </div>
//                     <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg">
//                       View Technicians
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default InactiveCategories;

// import React, { useState } from 'react';
// import { RotateCcw, Filter, Eye, Calendar } from 'lucide-react';

// const InactiveCategories: React.FC = () => {
//   const [showFilter, setShowFilter] = useState(false);
//   const [filters, setFilters] = useState({
//     category: '',
//     subCategory: '',
//     serviceTitle: '',
//     fromDate: '',
//     toDate: ''
//   });

//   const inactiveServices = [
//     {
//       id: 1,
//       name: 'bed room cleaning',
//       category: 'Dishwasher Repair & Services',
//       subCategory: 'Maintenance',
//       amount: '₹500',
//       date: '17 Aug 2023',
//       status: false,
//       image: 'https://images.pexels.com/photos/3768911/pexels-photo-3768911.jpeg?auto=compress&cs=tinysrgb&w=400'
//     },
//   ];

//   const handleFilterChange = (field: string, value: string) => {
//     setFilters(prev => ({
//       ...prev,
//       [field]: value
//     }));
//   };

//   const handleRefresh = () => {
//     setShowFilter(false);
//     setFilters({
//       category: '',
//       subCategory: '',
//       serviceTitle: '',
//       fromDate: '',
//       toDate: ''
//     });
//   };

//   const handleFilterSubmit = () => {
//     console.log('Applying filters:', filters);
//   };

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <h1 className="text-2xl font-bold text-gray-900">Inactive Service</h1>
//         <div className="flex items-center space-x-2">
//           <button
//             onClick={handleRefresh}
//             className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
//           >
//             <RotateCcw className="h-4 w-4 mr-2" />
//             Refresh
//           </button>
//           <button
//             onClick={() => setShowFilter(!showFilter)}
//             className="flex items-center px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl"
//           >
//             <Filter className="h-4 w-4 mr-2" />
//             Filter
//           </button>
//         </div>
//       </div>

//       {/* Filter Panel */}
//       {showFilter && (
//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
//               <select
//                 value={filters.category}
//                 onChange={(e) => handleFilterChange('category', e.target.value)}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
//               >
//                 <option value="">Select category</option>
//                 <option value="dishwasher">Dishwasher Repair & Services</option>
//                 <option value="electrician">Electrician Services</option>
//                 <option value="photography">Photography & Videography Services</option>
//                 <option value="plumber">Plumber Services</option>
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Sub Category</label>
//               <select
//                 value={filters.subCategory}
//                 onChange={(e) => handleFilterChange('subCategory', e.target.value)}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
//               >
//                 <option value="">Select subcategory</option>
//                 <option value="maintenance">Maintenance</option>
//                 <option value="switch-socket">Switch and Socket</option>
//                 <option value="fan-repair">Fan Installation and Repair</option>
//                 <option value="wedding-photography">Wedding Photography & Videography</option>
//                 <option value="event-photography">Event Photography</option>
//                 <option value="basin-sink">Basin and Sink</option>
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Service Title</label>
//               <select
//                 value={filters.serviceTitle}
//                 onChange={(e) => handleFilterChange('serviceTitle', e.target.value)}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
//               >
//                 <option value="">Select service</option>
//                 <option value="bedroom-cleaning">Bed Room Cleaning</option>
//                 <option value="switch-repair">Switch Board Repair</option>
//                 <option value="fan-regulator">Fan Regulator Replacement</option>
//                 <option value="fan-replacement">Fan Replacement</option>
//                 <option value="photography">Photography</option>
//                 <option value="ac-repair">AC Repair</option>
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
//               <div className="relative">
//                 <input
//                   type="date"
//                   value={filters.fromDate}
//                   onChange={(e) => handleFilterChange('fromDate', e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
//                 />
//                 <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
//               </div>
//             </div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
//               <div className="relative">
//                 <input
//                   type="date"
//                   value={filters.toDate}
//                   onChange={(e) => handleFilterChange('toDate', e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
//                 />
//                 <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
//               </div>
//             </div>
//           </div>

//           <div className="flex justify-center">
//             <button
//               onClick={handleFilterSubmit}
//               className="px-8 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
//             >
//               Submit
//             </button>
//           </div>
//         </div>
//       )}

//       <div className="bg-white rounded-lg shadow-sm border border-gray-200">
//         <div className="px-6 py-4 border-b border-gray-200">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-2">
//               <span className="text-sm text-gray-600">Show</span>
//               <select className="border border-gray-300 rounded px-2 py-1 text-sm">
//                 <option>10</option>
//                 <option>25</option>
//                 <option>50</option>
//               </select>
//               <span className="text-sm text-gray-600">entries</span>
//             </div>
//             <div className="flex items-center space-x-2">
//               <span className="text-sm text-gray-600">Search:</span>
//               <input
//                 type="text"
//                 className="border border-gray-300 rounded px-3 py-1 text-sm"
//                 placeholder="Search services..."
//               />
//             </div>
//           </div>
//         </div>

//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Services</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sub Category</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {inactiveServices.map((service, index) => (
//                 <tr key={service.id} className="hover:bg-gray-50">
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="flex items-center">
//                       <img
//                         src={service.image}
//                         alt={service.name}
//                         className="h-10 w-10 rounded-lg object-cover mr-3"
//                       />
//                       <span className="text-sm font-medium text-gray-900">{service.name}</span>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{service.category}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{service.subCategory}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{service.amount}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{service.date}</td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <label className="relative inline-flex items-center cursor-pointer">
//                       <input type="checkbox" className="sr-only peer" defaultChecked={service.status} />
//                       <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
//                     </label>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <button className="text-green-600 hover:text-green-800">
//                       <Eye className="h-4 w-4" />
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default InactiveCategories;
