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
          <h1 className="text-4xl font-bold text-gray-900">Add New Blog</h1>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-4">
              Blog Information
            </h2>
            
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
                  Service Category *
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
              <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-2">
                Blog Excerpt *
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
                  Card Image URL *
                </label>
                <input
                  type="url"
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="https://example.com/image.jpg"
                  required
                />
              </div>

              <div>
                <label htmlFor="heroImage" className="block text-sm font-medium text-gray-700 mb-2">
                  Hero Image URL *
                </label>
                <input
                  type="url"
                  id="heroImage"
                  name="heroImage"
                  value={formData.heroImage}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="https://example.com/hero-image.jpg"
                  required
                />
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Blog Content
              </h2>
              <button
                type="button"
                onClick={addContentParagraph}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Paragraph
              </button>
            </div>

            <div className="space-y-6">
              {formData.content.map((paragraph, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-700">
                      Paragraph {index + 1}
                    </h3>
                    {formData.content.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeContentParagraph(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Rich Text Toolbar */}
                  <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                    <button
                      type="button"
                      onClick={() => insertTextFormat('bold', index)}
                      className="p-2 text-gray-600 hover:bg-white hover:shadow-sm rounded transition-all"
                      title="Bold"
                    >
                      <Bold className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertTextFormat('italic', index)}
                      className="p-2 text-gray-600 hover:bg-white hover:shadow-sm rounded transition-all"
                      title="Italic"
                    >
                      <Italic className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertTextFormat('underline', index)}
                      className="p-2 text-gray-600 hover:bg-white hover:shadow-sm rounded transition-all"
                      title="Underline"
                    >
                      <Underline className="w-4 h-4" />
                    </button>
                    <div className="w-px h-6 bg-gray-300 mx-2"></div>
                    <span className="text-xs text-gray-500">
                      Select text and click formatting buttons
                    </span>
                  </div>

                  {/* Content Textarea */}
                  <textarea
                    ref={el => contentRefs.current[index] = el}
                    value={paragraph}
                    onChange={(e) => handleContentChange(index, e.target.value)}
                    onFocus={() => setActiveContentIndex(index)}
                    onBlur={() => setActiveContentIndex(null)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    rows={6}
                    placeholder="Enter paragraph content... Use **text** for bold, *text* for italic, __text__ for underline"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-4 pt-8 border-t border-gray-200">
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

      {/* Help Section */}
      <div className="mt-8 bg-blue-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">
          Content Formatting Tips
        </h3>
        <div className="space-y-2 text-sm text-blue-800">
          <p><strong>**Bold Text**</strong> - Use double asterisks for bold formatting</p>
          <p><em>*Italic Text*</em> - Use single asterisks for italic formatting</p>
          <p><u>__Underlined Text__</u> - Use double underscores for underlined text</p>
          <p>💡 <strong>Tip:</strong> Select text in the editor and use the toolbar buttons for easy formatting</p>
        </div>
      </div>
    </div>
  );
};

export default AddBlog;