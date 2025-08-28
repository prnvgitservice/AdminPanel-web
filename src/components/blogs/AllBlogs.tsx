import React, { useState, useEffect } from "react";
import { Calendar, Edit, Eye, Trash2, Plus, Tag, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { deleteBlog, getAllBlogs } from "../../api/apiMethods";

interface BlogPost {
  _id: string;
  name: string;
  image: string;
  title: string;
  description: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

const AllBlogs: React.FC = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState<BlogPost[]>([]);

  // Fetch blogs on component mount
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await getAllBlogs();
        if (response.success) {
          setBlogs(response.data);
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };
    fetchBlogs();
  }, []);

  const handleView = (post: BlogPost) => {
    navigate(`/blogs/view/${post._id}`, { state: post });
  };
  const handleEdit = (post: BlogPost) => {
    navigate(`/blogs/edit/${post._id}`, { state: post });
  };

  const handleDelete = async (postId: string) => {
    if (window.confirm("Are you sure you want to delete this blog post?")) {
        const response = await deleteBlog(postId);
        if (response.success) {
          const updatedBlogs = await getAllBlogs();
          setBlogs(updatedBlogs.data);
        }
        else{
          alert("Failed to delete the blog post.");
        }
      // Note: You might want to add an API call here to delete the blog from the backend
    }
  };


  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
            <FileText className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            All Blogs
          </h1>
        </div>
        <button
          onClick={() => navigate("/blogs/add")}
          className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Blog
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogs.map((post) => (
          <div
            key={post._id}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="relative">
              {post.image ? (
                <img
                  src={post.image}
                  alt={post.title}
                  className="h-48 mx-auto object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">No Image</span>
                </div>
              )}
              <div className="absolute top-4 left-4">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                  {post.name}
                </span>
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 hover:text-blue-600 cursor-pointer mb-3 line-clamp-2" onClick={() => handleView(post)}>
                {post.title}
              </h3>

              <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                <div className="flex items-center">
                  <Calendar size={14} className="mr-2" />
                  <span className="font-medium">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1 items-center">
                  <Tag size={14} className="" />
                  {post.tags.slice(0, 1).map((tag, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <button
                  onClick={() => handleView(post)}
                  className="text-sm flex items-center px-3 py-2 text-green-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </button>
                <button
                  onClick={() => handleEdit(post)}
                  className="text-sm flex items-center px-3 py-2 text-blue-600 hover:bg-green-50 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(post._id)}
                  className="text-sm flex items-center px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllBlogs;
// import React, { useState } from "react";
// import { blogPosts } from "./blogData";
// import { Calendar, Edit, Eye, Trash2, Plus, Tag, Wrench, FileText } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { BlogPost } from "./types";

// const AllBlogs: React.FC = () => {
//   const navigate = useNavigate();
//   const [blogs, setBlogs] = useState<BlogPost[]>(blogPosts);
//   const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);
//   const [isEditMode, setIsEditMode] = useState(false);

//   const handleView = (post: BlogPost) => {
//     navigate(`/blog/${post.id}`, { state: post });
//   };

//   const handleEdit = (post: BlogPost) => {
//     setSelectedBlog(post);
//     setIsEditMode(true);
//   };

//   const handleDelete = (postId: string) => {
//     if (window.confirm("Are you sure you want to delete this blog post?")) {
//       setBlogs(blogs.filter(blog => blog.id !== postId));
//     }
//   };

//   const handleSave = (updatedBlog: BlogPost) => {
//     setBlogs(blogs.map(blog =>
//       blog.id === updatedBlog.id ? updatedBlog : blog
//     ));
//     setIsEditMode(false);
//     setSelectedBlog(null);
//   };

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//       <div className="flex items-center justify-between mb-8">
//         <div className="flex items-center gap-3">
//          <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
//               <FileText className="h-5 w-5 text-white" />
//             </div>
//           <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">All Blogs</h1>
//         </div>
//        <button
//                     onClick={() => navigate("/categories/add")}
//                     className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
//                   >
//                     <Plus className="h-4 w-4 mr-2" />
//                     Add Blog
//                   </button>
//       </div>

//       {isEditMode && selectedBlog ? (
//         <EditBlogForm
//           blog={selectedBlog}
//           onSave={handleSave}
//           onCancel={() => {
//             setIsEditMode(false);
//             setSelectedBlog(null);
//           }}
//         />
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//           {blogs.map((post) => (
//             <div
//               key={post.id}
//               className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
//             >
//               <div className="relative">
//                 <img
//                   src={post.image}
//                   alt={post.title}
//                   className="w-full h-48 object-cover"
//                 />
//                 <div className="absolute top-4 left-4">
//                   <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
//                     {post.category}
//                   </span>
//                 </div>
//               </div>

//               <div className="p-6">
//                 <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
//                   {post.title}
//                 </h3>

//                 {/* <p className="text-gray-600 text-sm mb-4 line-clamp-3">
//                   {post.excerpt}
//                 </p> */}

//                 <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
//                   <div className="flex items-center">
//                     <Calendar size={14} className="mr-2" />
//                     <span className="font-medium">{post.date}</span>
//                   </div>
//                   <div className="flex flex-wrap gap-1 items-center">
//                      <Tag size={14} className="" />
//                     {post.tags.slice(0, 1).map((tag, index) => (

//                       <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
//                         {tag}
//                       </span>
//                     ))}
//                   </div>
//                 </div>

//                 <div className="flex items-center justify-between pt-4 border-t border-gray-200">
//                   <button
//                     onClick={() => handleView(post)}
//                     className="text-sm flex items-center px-3 py-2 text-green-600 hover:bg-blue-50 rounded-lg transition-colors"
//                   >
//                     <Eye className="w-4 h-4 mr-1" />
//                     View
//                   </button>
//                   <button
//                     onClick={() => handleEdit(post)}
//                     className="text-sm flex items-center px-3 py-2 text-blue-600 hover:bg-green-50 rounded-lg transition-colors"
//                   >
//                     <Edit className="w-4 h-4 mr-1" />
//                     Edit
//                   </button>
//                   <button
//                     onClick={() => handleDelete(post.id)}
//                     className="text-sm flex items-center px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
//                   >
//                     <Trash2 className="w-4 h-4 mr-1" />
//                     Delete
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// const EditBlogForm: React.FC<{
//   blog: BlogPost;
//   onSave: (blog: BlogPost) => void;
//   onCancel: () => void;
// }> = ({ blog, onSave, onCancel }) => {
//   const [formData, setFormData] = useState<BlogPost>(blog);

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     onSave(formData);
//   };

//   const handleContentChange = (index: number, value: string) => {
//     const newContent = [...formData.content];
//     newContent[index] = value;
//     setFormData({ ...formData, content: newContent });
//   };

//   const addContentParagraph = () => {
//     setFormData({
//       ...formData,
//       content: [...formData.content, ""]
//     });
//   };

//   const removeContentParagraph = (index: number) => {
//     const newContent = formData.content.filter((_, i) => i !== index);
//     setFormData({ ...formData, content: newContent });
//   };

//   return (
//     <div className="bg-white rounded-xl shadow-lg p-8">

//       <form onSubmit={handleSubmit} className="space-y-6">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Blog Title
//             </label>
//             <input
//               type="text"
//               value={formData.title}
//               onChange={(e) => setFormData({ ...formData, title: e.target.value })}
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               required
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Service
//             </label>
//             <input
//               type="text"
//               value={formData.category}
//               onChange={(e) => setFormData({ ...formData, category: e.target.value })}
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               required
//             />
//           </div>
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Tags
//           </label>
//           <input
//             type="text"
//             value={formData.tags.join(', ')}
//             onChange={(e) => setFormData({
//               ...formData,
//               tags: e.target.value.split(',').map(tag => tag.trim())
//             })}
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             required
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Description
//           </label>
//           <textarea
//             value={formData.excerpt}
//             onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             rows={3}
//             required
//           />
//         </div>

//         <div className="flex items-center justify-end space-x-4 pt-6 border-gray-200">
//           <button
//             type="button"
//             onClick={onCancel}
//             className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
//           >
//             Save Changes
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default AllBlogs;
