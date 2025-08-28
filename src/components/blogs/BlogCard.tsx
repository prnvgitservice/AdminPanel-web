import React from 'react';
import { BlogCardProps } from './types';
import { Calendar, Tag } from 'lucide-react';

const BlogCard: React.FC<BlogCardProps> = ({ post, onClick }) => {
  return (
    <div 
      className="blog-card bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer w-[350px] flex-shrink-0 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
      onClick={() => onClick(post)}
    >
      <div className="relative">
        <img 
          src={post.image} 
          alt={post.title}
          className="w-full h-52 object-cover transition-transform duration-300 ease-in-out hover:scale-105"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
            {post.category}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 hover:text-blue-600 transition-colors">
          {post.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
          {post.excerpt}
        </p>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center">
            <Calendar size={14} className="mr-2" />
            <span className="font-medium text-gray-500">{post.date}</span>
          </div>
          <div className="flex items-center">
            <Tag size={14} className="mr-2" />
            <span className="font-medium text-blue-600">{post.tags[0]}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;