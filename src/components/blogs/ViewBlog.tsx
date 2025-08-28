import React from 'react';
import { useLocation } from 'react-router-dom';
import { Calendar, Tag, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ViewBlog: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const post = location.state;

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Blog Post Not Found</h1>
          <p className="text-gray-600 text-lg">The blog post you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Back Button */}
      <div className="max-w-4xl mx-auto px-4 pt-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 hover:text-blue-800 transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Blogs
        </button>
      </div>

      {/* Hero Image Section */}
      <div className="relative w-full h-[500px] mb-8">
        <img 
          src={post.heroImage} 
          alt={post.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-end">
          <div className="w-full p-8 md:p-12">
            <div className="max-w-4xl mx-auto text-white">
              <span className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                {post.category}
              </span>
              <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
                {post.title}
              </h1>
              <p className="text-xl opacity-90 max-w-3xl leading-relaxed">
                {post.excerpt}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-4 pb-16">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 mb-8 pb-6 border-b border-gray-200">
            <div className="flex items-center text-gray-600">
              <Calendar size={20} className="mr-3" />
              <span className="font-semibold text-lg">{post.date}</span>
            </div>
            <div className="flex items-center">
              <Tag size={20} className="mr-3 text-gray-600" />
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag: string, index: number) => (
                  <span 
                    key={index}
                    className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Article Content */}
          <article className="prose prose-xl max-w-none">
            {post.content.map((paragraph: string, index: number) => (
              <div key={index} className="mb-6">
                {paragraph.includes(':') && paragraph.length < 100 && !paragraph.includes('https://') ? (
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8 border-l-4 border-gradient-to-b from-blue-500 to-purple-500 pl-6">
                    {paragraph}
                  </h3>
                ) : (
                  <p className="text-gray-700 leading-relaxed text-lg mb-4">
                    {paragraph}
                  </p>
                )}
              </div>
            ))}
          </article>

          {/* Call to Action */}
          <div className="mt-16 pt-8 border-t border-gray-200">
            <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-blue-50 p-8 rounded-2xl">
              <h4 className="text-3xl font-bold text-gray-900 mb-4">
                Need Professional Help?
              </h4>
              <p className="text-gray-700 text-xl mb-6 leading-relaxed">
                PRNV Services provides expert solutions for all your home maintenance needs. 
                Contact our professional team for reliable and affordable services.
              </p>
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
                Contact PRNV Services
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewBlog;