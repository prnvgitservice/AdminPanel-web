import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, BookOpen, Edit, Trash2 } from 'lucide-react';
import 'react-quill/dist/quill.snow.css';

interface SearchContent {
  id: string;
  categoryId: string;
  categoryName: string;
  areaName: string;
  city: string;
  state: string;
  pincode: string;
  meta_title: string;
  meta_description: string;
  seo_content: string;
  createdAt: string;
  updatedAt: string;
}

const ViewMetaInfo = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const content = location.state?.content as SearchContent;


  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!content) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            Content data not found. Please go back and try again.
            <button
              onClick={() => navigate('/meta-info/all')}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header with actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {content.categoryName} - {content.areaName.trim()}
            </h1>
          </div>
          <div className="flex gap-2">
            {/* <button
              onClick={() => navigate(`/edit-meta-info/${content.id}`, { state: { content } })}
              className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-lg"
            >
              <Edit size={18} /> Edit
            </button> */}
            <button
              onClick={() => navigate('/meta-info/all')}
              className="py-2 px-3 rounded-lg shadow-sm hover:shadow-md place-items-center bg-blue-600 transition-all duration-200 text-white flex"
            >
              <ArrowLeft className="h-5 w-5 me-1 " /> Back
            </button>
            {/* <button
              // onClick={handleDelete}
              className="flex items-center gap-1 px-3 py-2 bg-red-600 text-white rounded-lg"
            >
              <Trash2 size={18} /> Delete
            </button> */}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-medium text-gray-500">Category</p>
                <p className="mt-1 text-lg text-gray-900">{content.categoryName}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">City</p>
                <p className="mt-1 text-lg text-gray-900">{content.city}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Area - Pincode</p>
                <p className="mt-1 text-lg text-gray-900">{content.areaName.trim()} - {content.pincode}</p>
              </div>
              {/* <div>
                <p className="text-sm font-medium text-gray-500">SubArea</p>
                <p className="mt-1 text-lg text-gray-900">
                  {content.subArea}
                </p>
              </div> */}
              {/* <div>
                <p className="text-sm font-medium text-gray-500">Created</p>
                <p className="mt-1 text-gray-900">{formatDate(content.createdAt)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Last Updated</p>
                <p className="mt-1 text-gray-900">{formatDate(content.updatedAt)}</p>
              </div> */}
            </div>
          </div>

          {/* Meta Information Section */}
          <div className="border-b border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Meta Info</h2>
            <div className="space-y-6">
              <div>
                <p className="text-sm font-medium text-gray-500">Meta Title</p>
                <p className="mt-1 text-lg text-gray-900">{content.meta_title}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Meta Description</p>
                <p className="mt-1 text-gray-900 whitespace-pre-line">
                  {content.meta_description}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">SEO Content</h2>
            <div className="ql-snow">
              <div 
                className="ql-editor" 
                dangerouslySetInnerHTML={{ __html: content.seo_content }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewMetaInfo;
// import React from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css';

// interface SearchContent {
//   id: string;
//   categoryId: string;
//   categoryName: string;
//   areaName: string;
//   city: string;
//   state: string;
//   pincode: string;
//   meta_title: string;
//   meta_description: string;
//   seo_content: string;
//   createdAt: string;
//   updatedAt: string;
// }

// const ViewMetaInfo = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const content = location.state?.content as SearchContent;

//   const handleDelete = async () => {
//     if (window.confirm('Are you sure you want to delete this content?')) {
//       try {
//         const response = await fetch(
//           `http://localhost:5000/api/searchContentData/deleteCategorySearchDetails/${content.id}`,
//           { method: 'DELETE' }
//         );
        
//         if (!response.ok) {
//           throw new Error('Failed to delete content');
//         }
        
//         navigate('/all-meta-info');
//       } catch (err) {
//         alert(err.message);
//       }
//     }
//   };

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit',
//     });
//   };

//   if (!content) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
//         <div className="max-w-4xl mx-auto">
//           <div className="bg-white rounded-xl shadow-lg p-6 text-center">
//             Content data not found. Please go back and try again.
//             <button
//               onClick={() => navigate('/all-meta-info')}
//               className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
//             >
//               Back to List
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
//       <div className="max-w-4xl mx-auto">
//         {/* Header with actions */}
//         <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
//           <div className="flex items-center gap-3">
//             <button
//               onClick={() => navigate('/all-meta-info')}
//               className="p-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
//             >
//               <ArrowLeft className="h-6 w-6 text-gray-600" />
//             </button>
//             <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
//               {content.categoryName} - {content.areaName.trim()}
//             </h1>
//           </div>
//           <div className="flex gap-2">
//             <button
//               onClick={() => navigate(`/edit-meta-info/${content.id}`, { state: { content } })}
//               className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-lg"
//             >
//               <Edit size={18} /> Edit
//             </button>
//             <button
//               onClick={handleDelete}
//               className="flex items-center gap-1 px-3 py-2 bg-red-600 text-white rounded-lg"
//             >
//               <Trash2 size={18} /> Delete
//             </button>
//           </div>
//         </div>

//         {/* Content Card */}
//         <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
//           {/* Basic Information Section */}
//           <div className="border-b border-gray-200 p-6">
//             <h2 className="text-lg font-semibold text-gray-900 mb-4">Location Details</h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <p className="text-sm font-medium text-gray-500">Category</p>
//                 <p className="mt-1 text-lg text-gray-900">{content.categoryName}</p>
//               </div>
//               <div>
//                 <p className="text-sm font-medium text-gray-500">Area</p>
//                 <p className="mt-1 text-lg text-gray-900">{content.areaName.trim()}</p>
//               </div>
//               <div>
//                 <p className="text-sm font-medium text-gray-500">City</p>
//                 <p className="mt-1 text-lg text-gray-900">{content.city}</p>
//               </div>
//               <div>
//                 <p className="text-sm font-medium text-gray-500">State & Pincode</p>
//                 <p className="mt-1 text-lg text-gray-900">
//                   {content.state} - {content.pincode}
//                 </p>
//               </div>
//               <div>
//                 <p className="text-sm font-medium text-gray-500">Created</p>
//                 <p className="mt-1 text-gray-900">{formatDate(content.createdAt)}</p>
//               </div>
//               <div>
//                 <p className="text-sm font-medium text-gray-500">Last Updated</p>
//                 <p className="mt-1 text-gray-900">{formatDate(content.updatedAt)}</p>
//               </div>
//             </div>
//           </div>

//           {/* Meta Information Section */}
//           <div className="border-b border-gray-200 p-6">
//             <h2 className="text-lg font-semibold text-gray-900 mb-4">SEO Meta Data</h2>
//             <div className="space-y-6">
//               <div>
//                 <p className="text-sm font-medium text-gray-500">Meta Title</p>
//                 <p className="mt-1 text-lg text-gray-900">{content.meta_title}</p>
//               </div>
//               <div>
//                 <p className="text-sm font-medium text-gray-500">Meta Description</p>
//                 <p className="mt-1 text-gray-900 whitespace-pre-line">
//                   {content.meta_description}
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* SEO Content Section */}
//           <div className="p-6">
//             <h2 className="text-lg font-semibold text-gray-900 mb-4">Content</h2>
//             <div className="ql-snow">
//               <div 
//                 className="ql-editor" 
//                 dangerouslySetInnerHTML={{ __html: content.seo_content }}
//               />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ViewMetaInfo;