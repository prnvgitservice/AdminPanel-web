import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, FileText, Calendar, Tag } from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string[];
  category: string;
  date: string;
  image: string;
  heroImage: string;
  tags: string[];
}

const ViewBlog: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const blog = state as BlogPost | undefined;

  if (!blog) {
    return (
      <div className="text-center py-6 text-red-600">
        No blog data available. Please select a blog.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-md">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
              {blog.title}
            </h1>
          </div>
          <button
            onClick={() => {
              navigate("/blogs/all");
            }}
            className="flex items-center px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-md hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </button>
        </div>

        {/* Blog Details Card */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
          <div className="relative">
            <div className="flex justify-center items-center">
              <img
                src={blog.heroImage}
                alt={blog.title}
                className="max-w-full h-64 rounded-md mb-4 object-cover"
              />
            </div>
            <div className="absolute top-4 right-4">
              <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800">
                {blog.category}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-medium text-gray-700">
                  Blog Title
                </h2>
                <p className="text-gray-900 font-semibold text-lg">
                  {blog.title}
                </p>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="h-4 w-4 mr-1" />
                {blog.date}
              </div>
            </div>

            <div>
              <h2 className="text-sm font-bold text-gray-700">Category</h2>
              <p className="text-gray-900">{blog.category}</p>
            </div>

            <div>
              <h2 className="text-sm font-bold text-gray-700">Excerpt</h2>
              <p className="text-gray-600 text-sm">
                {blog.excerpt}
              </p>
            </div>

            <div>
              <h2 className="text-sm font-bold text-gray-700 mb-2">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                  >
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-sm font-bold text-gray-700 mb-3">Content</h2>
              <div className="prose prose-sm max-w-none">
                {blog.content.map((paragraph, index) => (
                  <div key={index} className="mb-4">
                    {paragraph.includes(':') && paragraph.length < 100 && !paragraph.includes('https://') ? (
                      <h3 className="text-lg font-bold text-gray-900 mb-2 border-l-4 border-blue-500 pl-4">
                        {paragraph}
                      </h3>
                    ) : (
                      <p className="text-gray-700 leading-relaxed text-sm mb-3">
                        {paragraph}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-sm font-bold text-gray-700">Card Image</h2>
              <div className="mt-2">
                <img
                  src={blog.image}
                  alt={`${blog.title} card`}
                  className="w-32 h-24 rounded-md object-cover border border-gray-200"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        {/* <div className="mt-6 bg-gradient-to-r from-blue-50 via-purple-50 to-blue-50 rounded-xl p-6">
          <h4 className="text-xl font-bold text-gray-900 mb-3">
            Need Professional Help?
          </h4>
          <p className="text-gray-700 mb-4 leading-relaxed">
            PRNV Services provides expert solutions for all your home maintenance needs. 
            Contact our professional team for reliable and affordable services.
          </p>
          <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
            Contact PRNV Services
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default ViewBlog;