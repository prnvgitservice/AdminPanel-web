import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Wrench } from "lucide-react";
import { useCategoryContext } from "../Context/CategoryContext";

interface Category {
  _id: string;
  category_name: string;
  category_image: string;
  status: number;
  meta_title: string;
  meta_description: string; // Added meta_description
  servicesCount: number;
  createdAt: string;
}

interface ViewCategoryProps {
  onBack: () => void;
}

const ViewCategory: React.FC<ViewCategoryProps> = ({ onBack }) => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { loading, error } = useCategoryContext();
  const category = state?.category as Category | undefined;

  if (loading) {
    return (
      <div className="text-center py-6 text-gray-600">Loading category...</div>
    );
  }

  if (error) {
    return <div className="text-center py-6 text-red-600">{error}</div>;
  }

  if (!category) {
    return (
      <div className="text-center py-6 text-red-600">
        No category data available. Please select a category.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-md">
              <Wrench className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
              {category.category_name}
            </h1>
          </div>
          <button
            onClick={() => {
              onBack();
              navigate("/categories/all");
            }}
            className="flex items-center px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-md hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </button>
        </div>

        {/* Category Details Card */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
          <div className="relative">
            <div className="flex justify-center items-center">
              <img
                src={category.category_image}
                alt={category.category_name}
                className="max-w-2xl h-40 rounded-md mb-4"
              />
            </div>
            <div className="absolute top-4 right-4">
              <span
                className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${
                  category.status === 1
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {category.status ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-medium text-gray-700">
                  Category Name
                </h2>
                <p className="text-gray-900 font-semibold">
                  {category.category_name}
                </p>
              </div>
              <div className="text-sm text-gray-500">
                {new Date(category?.createdAt).toLocaleDateString("en-GB")}
              </div>
            </div>

            <div>
              <h2 className="text-sm font-bold text-gray-700">Meta Title</h2>
              <p className="text-gray-900">{category.meta_title}</p>
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-700">
                Meta Description
              </h2>
              <p className="text-gray-600 text-sm line-clamp-2">
                {category.meta_description}
              </p>
            </div>
            {/* <div>
              <h2 className="text-sm font-medium text-gray-700">Status</h2>
              
            </div> */}
            <div>
              <h2 className="text-sm font-bold text-gray-700">Technicians</h2>
              <p className="text-gray-900">
                {category.servicesCount || 5} Technicians
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewCategory;
// import React from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { ArrowLeft, Wrench } from 'lucide-react';
// import { useCategoryContext } from '../Context/CategoryContext';

// interface Category {
//   _id: string;
//   category_name: string;
//   category_image: string;
//   status: number;
//   meta_title: string;
//   servicesCount: number;
//   createdAt: string;
// }

// interface ViewCategoryProps {
//   onBack: () => void;
// }

// const ViewCategory: React.FC<ViewCategoryProps> = ({ onBack }) => {
//   const navigate = useNavigate();
//   const { state } = useLocation();
//   const { loading, error } = useCategoryContext();
//   const category = state?.category as Category | undefined;

//   if (loading) {
//     return <div className="text-center py-8">Loading category...</div>;
//   }

//   if (error) {
//     return <div className="text-center py-8 text-red-600">{error}</div>;
//   }

//   if (!category) {
//     return (
//       <div className="text-center py-8 text-red-600">
//         No category data available. Please select a category.
//       </div>
//     );
//   }

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
//               {category.category_name}
//             </h1>
//           </div>
//           <button
//             onClick={() => {
//               onBack();
//               navigate('/categories/all');
//             }}
//             className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
//           >
//             <ArrowLeft className="h-4 w-4 mr-2" />
//             Back to Categories
//           </button>
//         </div>

//         {/* Category Details */}
//         <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//             {/* Image */}
//             <div>
//               <img
//                 src={category.category_image}
//                 alt={category.category_name}
//                 className="w-full h-64 object-cover rounded-lg"
//               />
//             </div>

//             {/* Details */}
//             <div className="space-y-4">
//               <div>
//                 <h2 className="text-lg font-semibold text-gray-900">Category Name</h2>
//                 <p className="text-gray-600">{category.category_name}</p>
//               </div>
//               <div>
//                 <h2 className="text-lg font-semibold text-gray-900">Meta Title</h2>
//                 <p className="text-gray-600">{category.meta_title}</p>
//               </div>
//               <div>
//                 <h2 className="text-lg font-semibold text-gray-900">Status</h2>
//                 <span
//                   className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
//                     category.status === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//                   }`}
//                 >
//                   {category.status ? 'Active' : 'Inactive'}
//                 </span>
//               </div>
//               <div>
//                 <h2 className="text-lg font-semibold text-gray-900">Technicians</h2>
//                 <p className="text-gray-600">{category.servicesCount} Technicians</p>
//               </div>
//               <div>
//                 <h2 className="text-lg font-semibold text-gray-900">Created At</h2>
//                 <p className="text-gray-600">
//                   {new Date(category.createdAt).toLocaleDateString('en-GB')}
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ViewCategory;
