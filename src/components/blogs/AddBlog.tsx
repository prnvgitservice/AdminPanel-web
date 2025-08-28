import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Bold, Italic, Underline, Link as LinkIcon, Image } from 'lucide-react';
import { BlogPost } from './types';

const AddBlog: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    category: '',
    tags: '',
    image: '',
    heroImage: '',
    content: ['']
  });
  const [activeContentIndex, setActiveContentIndex] = useState<number | null>(null);
  const contentRefs = useRef<(HTMLTextAreaElement | null)[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleContentChange = (index: number, value: string) => {
    const newContent = [...formData.content];
    newContent[index] = value;
    setFormData(prev => ({
      ...prev,
      content: newContent
    }));
  };

  const addContentParagraph = () => {
    setFormData(prev => ({
      ...prev,
      content: [...prev.content, '']
    }));
  };

  const removeContentParagraph = (index: number) => {
    if (formData.content.length > 1) {
      const newContent = formData.content.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        content: newContent
      }));
    }
  };

  const insertTextFormat = (format: 'bold' | 'italic' | 'underline', index: number) => {
    const textarea = contentRefs.current[index];
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    
    let formattedText = '';
    switch (format) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        break;
      case 'italic':
        formattedText = `*${selectedText}*`;
        break;
      case 'underline':
        formattedText = `__${selectedText}__`;
        break;
    }

    const newContent = [...formData.content];
    newContent[index] = textarea.value.substring(0, start) + formattedText + textarea.value.substring(end);
    
    setFormData(prev => ({
      ...prev,
      content: newContent
    }));

    // Set cursor position after formatting
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + formattedText.length, start + formattedText.length);
    }, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create new blog post
    const newBlog: BlogPost = {
      id: Date.now().toString(),
      title: formData.title,
      excerpt: formData.excerpt,
      category: formData.category,
      tags: formData.tags.split(',').map(tag => tag.trim()),
      image: formData.image,
      heroImage: formData.heroImage,
      content: formData.content.filter(paragraph => paragraph.trim() !== ''),
      date: new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      })
    };

    // Here you would typically save to your data store
    console.log('New blog post:', newBlog);
    
    // Navigate back to all blogs
    navigate('/blogs/all');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center mb-8">
        <button
          onClick={() => navigate('/blogs/all')}
          className="flex items-center text-blue-600 hover:text-blue-800 transition-colors mr-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to All Blogs
        </button>
        <div className="flex items-center">
          <span className="w-1 h-12 bg-gradient-to-b from-blue-500 to-purple-500 mr-4"></span>
          <h1 className="text-4xl font-bold text-gray-900">Add Blog</h1>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="space-y-6">
         
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Blog Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter blog title"
                  required
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Service *
                </label>
                <input
                  type="text"
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="e.g., PLUMBING SERVICES"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                Tags *
              </label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter tags separated by commas (e.g., plumbing, maintenance, home)"
                required
              />
            </div>

               <div>
              <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                id="excerpt"
                name="excerpt"
                value={formData.excerpt}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Brief description of the blog post"
                required
              />
            </div>

        
          </div>

        
          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-4 pt-8 border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/blogs/all')}
              className="px-6 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Create Blog Post
            </button>
          </div>
        </form>
      </div>

    
    </div>
  );
};

export default AddBlog;