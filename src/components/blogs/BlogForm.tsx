import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, FileText, Upload, X, Loader2 } from 'lucide-react';
import JoditEditor from 'jodit-react';
import { createBlog, updateBlog } from '../../api/apiMethods';

interface BlogPost {
  _id?: string;
  name: string;
  image: string;
  title: string;
  description: string;
  tags: string[];
  createdAt?: string;
  updatedAt?: string;
}

interface BlogFormProps {
  isEdit?: boolean;
}

const BlogForm: React.FC<BlogFormProps> = ({ isEdit = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize form data with blog data from location.state if editing
  const initialBlog = isEdit ? (location.state as BlogPost) : null;
  const [formData, setFormData] = useState({
    title: initialBlog?.title || '',
    description: initialBlog?.description || '',
    name: initialBlog?.name || '',
    tags: initialBlog?.tags || [],
    image: initialBlog?.image || '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string>(initialBlog?.image || '');
  const [tagInput, setTagInput] = useState('');
  const [imageError, setImageError] = useState<string | null>(null);
  const [editingTagIndex, setEditingTagIndex] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    title: '',
    name: '',
    description: '',
    tags: '',
  });
  const [isDragging, setIsDragging] = useState(false);


  // JoditEditor configuration
  const config = useMemo(
    () => ({
      height: 400,
      buttons: [
        'bold',
        'italic',
        'underline',
        '|',
        'ul',
        'ol',
        '|',
        'link',
        'table',
        '|',
        'font',
        'fontsize',
        'brush',
        '|',
        { name: 'heading', list: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] },
        '|',
        'undo',
        'redo',
      ],
      toolbarAdaptive: false,
      placeholder: 'Enter blog description here...',
      style: {
        font: '16px Arial',
      },
      colors: {
        text: ['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'],
        background: ['#FFFFFF', '#FFCCCC', '#CCFFCC', '#CCCCFF', '#FFFFCC', '#FFCCFF', '#CCFFFF'],
      },
      fonts: ['Arial', 'Helvetica', 'Times New Roman', 'Courier New', 'Verdana', 'Georgia', 'Trebuchet MS'],
      fontSize: ['8', '10', '12', '14', '16', '18', '24', '30', '36'],
      iframe: false,
      styleValues: {
        'jodit-container': 'border border-gray-300 rounded-lg shadow-sm',
        'jodit-toolbar__box': 'bg-gray-50 border-b border-gray-300 rounded-t-lg p-2',
        'jodit-toolbar-button': 'text-gray-700 hover:bg-blue-100 hover:text-blue-600 px-2 py-1 rounded transition',
        'jodit-toolbar-button_active': 'bg-blue-500 text-white',
        'jodit-wysiwyg': 'p-4 min-h-[400px] focus:outline-none focus:ring-2 focus:ring-blue-500',
      },
    }),
    []
  );

  // Update preview when image file changes
  useEffect(() => {
    if (imageFile) {
      const objectUrl = URL.createObjectURL(imageFile);
      setPreviewImage(objectUrl);
      return () => URL.revokeObjectURL(objectUrl); // Cleanup
    } else {
      setPreviewImage(formData.image);
    }
  }, [imageFile, formData.image]);

  // Real-time validation
  useEffect(() => {
    
  }, [formData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (file: File | null) => {
    if (file) {
      // Validate file type
      const validTypes = ['image/png', 'image/jpeg', 'image/svg+xml'];
      if (!validTypes.includes(file.type)) {
        setImageError('Please upload a PNG, JPG, or SVG image');
        setImageFile(null);
        setPreviewImage(formData.image);
        return;
      }
      // Validate file size (250KB limit)
      if (file.size > 250 * 1024) {
        setImageError('Image size must be less than 250KB');
        setImageFile(null);
        setPreviewImage(formData.image);
        return;
      }
      setImageError(null);
      setImageFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    handleFileChange(file);
  };

  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.target.value);
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (editingTagIndex !== null) {
        // Update existing tag
        setFormData(prev => ({
          ...prev,
          tags: prev.tags.map((tag, i) => (i === editingTagIndex ? tagInput.trim() : tag)),
        }));
        setEditingTagIndex(null);
      } else {
        // Add new tag
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, tagInput.trim()],
        }));
      }
      setTagInput('');
    }
  };

  const addSuggestedTag = (tag: string) => {
    if (!formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag],
      }));
    }
    setTagInput('');
  };

  const removeTag = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }));
    if (editingTagIndex === index) {
      setEditingTagIndex(null);
      setTagInput('');
    }
  };

  const editTag = (index: number) => {
    setEditingTagIndex(index);
    setTagInput(formData.tags[index]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.title || !formData.name || !formData.description || formData.tags.length === 0) {
      setError('Please fill in all required fields');
      return;
    }

    const errors = {
      title: formData.title ? '' : 'Blog title is required',
      name: formData.name ? '' : 'Service name is required',
      description: formData.description ? '' : 'Description is required',
      tags: formData.tags.length > 0 ? '' : 'At least one tag is required',
    };
    setFieldErrors(errors);

    setIsSubmitting(true);
    setError(null);

    // Prepare FormData for API request
    const formDataPayload = new FormData();
    formDataPayload.append('name', formData.name);
    formDataPayload.append('title', formData.title);
    formDataPayload.append('description', formData.description);
    formData.tags.forEach(tag => formDataPayload.append('tags[]', tag)); // Append each tag as tags[]
    if (imageFile) {
      formDataPayload.append('blog_image', imageFile);
    }
    if (isEdit && initialBlog?._id) {
      formDataPayload.append('blogId', initialBlog._id);
    }

    try {
      let response;
      if (isEdit && initialBlog?._id) {
        // Update existing blog
        response = await updateBlog(formDataPayload);
      } else {
        // Create new blog
        response = await createBlog(formDataPayload);
      }

      if (response.success) {
        navigate('/blogs/all');
      } else {
        setError(isEdit ? 'Failed to update blog post' : 'Failed to create blog post');
      }
    } catch (err) {
      setError(isEdit ? 'Error updating blog post. Please try again.' : 'Error creating blog post. Please try again.');
      console.error(`Error ${isEdit ? 'updating' : 'adding'} blog:`, err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg transform transition-transform hover:scale-110">
            <FileText className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            {isEdit ? 'Edit Blog' : 'Add Blog'}
          </h1>
        </div>
        <button
          onClick={() => navigate('/blogs/all')}
          className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
          disabled={isSubmitting}
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to All Blogs
        </button>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg animate-slide-in">
            {error}
          </div>
        )}
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
                  className={`w-full px-4 py-3 border ${
                    fieldErrors.title ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                  placeholder="Enter blog title"
                  required
                />
                {fieldErrors.title && (
                  <p className="text-red-500 text-sm mt-1 animate-slide-in">{fieldErrors.title}</p>
                )}
              </div>

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Service *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border ${
                    fieldErrors.name ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                  placeholder="e.g., AC Services"
                  required
                />
                {fieldErrors.name && (
                  <p className="text-red-500 text-sm mt-1 animate-slide-in">{fieldErrors.name}</p>
                )}
              </div>
            </div>

            {/* Tags Input */}
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                Tags *
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className={`inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full cursor-pointer transition-transform duration-200 hover:scale-105 ${
                      editingTagIndex === index ? 'ring-2 ring-blue-500' : ''
                    }`}
                    onClick={() => editTag(index)}
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeTag(index);
                      }}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                id="tags"
                value={tagInput}
                onChange={handleTagInputChange}
                onKeyDown={handleTagKeyDown}
                className={`w-full px-4 py-3 border ${
                  fieldErrors.tags ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                placeholder={editingTagIndex !== null ? 'Edit tag and press Enter' : 'Type a tag and press Enter'}
                required={formData.tags.length === 0}
              />
              {fieldErrors.tags && (
                <p className="text-red-500 text-sm mt-1 animate-slide-in">{fieldErrors.tags}</p>
              )}
            </div>

            {/* Image Upload */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
                <h2 className="text-lg font-semibold text-white">Blog Image</h2>
              </div>
              <div className="p-6 space-y-6">
                <div
                  className={`border-2 border-dashed ${
                    isDragging ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
                  } rounded-lg p-8 text-center hover:border-blue-400 transition-all duration-200`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Upload or drag and drop blog image</p>
                  <p className="text-sm text-gray-500 mb-4">PNG, JPG, SVG up to 250KB</p>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/svg+xml"
                    className="hidden"
                    id="imageFile"
                    ref={fileInputRef}
                    onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                    aria-describedby={imageError ? 'imageFile-error' : undefined}
                  />
                  <label
                    htmlFor="imageFile"
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 cursor-pointer transition-colors duration-200 shadow-lg hover:shadow-xl"
                  >
                    Choose File
                  </label>
                  {previewImage && (
                    <div className="mt-4">
                      <img
                        src={previewImage}
                        alt="Blog preview"
                        className="max-w-xs mx-auto rounded-lg"
                        onError={() => setPreviewImage('')}
                      />
                      <p className="text-sm text-gray-600 mt-2">
                        Selected: {imageFile ? imageFile.name : 'Existing image'}
                      </p>
                    </div>
                  )}
                  {imageError && (
                    <p id="imageFile-error" className="text-red-500 text-sm mt-2 animate-slide-in">
                      {imageError}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Description Editor */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">Blog Description *</h2>
              <div
                // className={`${fieldErrors.description ? 'border border-red-500 rounded-lg' : ''}`}
              >
                <JoditEditor
                  value={formData.description}
                  config={config}
                  onChange={newContent => setFormData(prev => ({ ...prev, description: newContent }))}
                />
              </div>
              {fieldErrors.description && (
                <p className="text-red-500 text-sm mt-1 animate-slide-in">{fieldErrors.description}</p>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-between space-x-4 pt-8 border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/blogs/all')}
              className="px-6 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  {isEdit ? 'Updating...' : 'Creating...'}
                </span>
              ) : (
                <>{isEdit ? 'Update Blog' : 'Create Blog'}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BlogForm;
// import React, { useState, useEffect, useMemo, useRef } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { ArrowLeft, FileText, Upload, X, Loader2 } from 'lucide-react';
// import JoditEditor from 'jodit-react';
// import { createBlog, updateBlog } from '../../api/apiMethods';

// interface BlogPost {
//   _id?: string;
//   name: string;
//   image: string;
//   title: string;
//   description: string;
//   tags: string[];
//   createdAt?: string;
//   updatedAt?: string;
// }

// interface BlogFormProps {
//   isEdit?: boolean;
// }

// const BlogForm: React.FC<BlogFormProps> = ({ isEdit = false }) => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   // Initialize form data with blog data from location.state if editing
//   const initialBlog = isEdit ? (location.state as BlogPost) : null;
//   const [formData, setFormData] = useState({
//     title: initialBlog?.title || '',
//     description: initialBlog?.description || '',
//     name: initialBlog?.name || '',
//     tags: initialBlog?.tags || [],
//     image: initialBlog?.image || '',
//   });
//   const [imageFile, setImageFile] = useState<File | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [previewImage, setPreviewImage] = useState<string>(initialBlog?.image || '');
//   const [tagInput, setTagInput] = useState('');
//   const [imageError, setImageError] = useState<string | null>(null);
//   const [editingTagIndex, setEditingTagIndex] = useState<number | null>(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [fieldErrors, setFieldErrors] = useState({
//     title: '',
//     name: '',
//     description: '',
//     tags: '',
//   });
//   const [isDragging, setIsDragging] = useState(false);

//   // Suggested tags for autocomplete
//   const suggestedTags = [
//     'Technology',
//     'Programming',
//     'Web Development',
//     'React',
//     'JavaScript',
//     'Blogging',
//     'SEO',
//     'Tutorial',
//     'Tips',
//     'Guide',
//   ];

//   // JoditEditor configuration
//   const config = useMemo(
//     () => ({
//       height: 400,
//       buttons: [
//         'bold',
//         'italic',
//         'underline',
//         '|',
//         'ul',
//         'ol',
//         '|',
//         'link',
//         'table',
//         '|',
//         'font',
//         'fontsize',
//         'brush',
//         '|',
//         { name: 'heading', list: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] },
//         '|',
//         'undo',
//         'redo',
//       ],
//       toolbarAdaptive: false,
//       placeholder: 'Enter blog description here...',
//       style: {
//         font: '16px Arial',
//       },
//       colors: {
//         text: ['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'],
//         background: ['#FFFFFF', '#FFCCCC', '#CCFFCC', '#CCCCFF', '#FFFFCC', '#FFCCFF', '#CCFFFF'],
//       },
//       fonts: ['Arial', 'Helvetica', 'Times New Roman', 'Courier New', 'Verdana', 'Georgia', 'Trebuchet MS'],
//       fontSize: ['8', '10', '12', '14', '16', '18', '24', '30', '36'],
//       iframe: false,
//       styleValues: {
//         'jodit-container': 'border border-gray-300 rounded-lg shadow-sm',
//         'jodit-toolbar__box': 'bg-gray-50 border-b border-gray-300 rounded-t-lg p-2',
//         'jodit-toolbar-button': 'text-gray-700 hover:bg-blue-100 hover:text-blue-600 px-2 py-1 rounded transition',
//         'jodit-toolbar-button_active': 'bg-blue-500 text-white',
//         'jodit-wysiwyg': 'p-4 min-h-[400px] focus:outline-none focus:ring-2 focus:ring-blue-500',
//       },
//     }),
//     []
//   );

//   // Update preview when image file changes
//   useEffect(() => {
//     if (imageFile) {
//       const objectUrl = URL.createObjectURL(imageFile);
//       setPreviewImage(objectUrl);
//       return () => URL.revokeObjectURL(objectUrl); // Cleanup
//     } else {
//       setPreviewImage(formData.image);
//     }
//   }, [imageFile, formData.image]);

//   // Real-time validation
//   useEffect(() => {
//     const errors = {
//       title: formData.title ? '' : 'Blog title is required',
//       name: formData.name ? '' : 'Service name is required',
//       description: formData.description ? '' : 'Description is required',
//       tags: formData.tags.length > 0 ? '' : 'At least one tag is required',
//     };
//     setFieldErrors(errors);
//   }, [formData]);

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleFileChange = (file: File | null) => {
//     if (file) {
//       // Validate file type
//       const validTypes = ['image/png', 'image/jpeg', 'image/svg+xml'];
//       if (!validTypes.includes(file.type)) {
//         setImageError('Please upload a PNG, JPG, or SVG image');
//         setImageFile(null);
//         setPreviewImage(formData.image);
//         return;
//       }
//       // Validate file size (250KB limit)
//       if (file.size > 250 * 1024) {
//         setImageError('Image size must be less than 250KB');
//         setImageFile(null);
//         setPreviewImage(formData.image);
//         return;
//       }
//       setImageError(null);
//       setImageFile(file);
//     }
//   };

//   const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     setIsDragging(true);
//   };

//   const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     setIsDragging(false);
//   };

//   const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     setIsDragging(false);
//     const file = e.dataTransfer.files?.[0];
//     handleFileChange(file);
//   };

//   const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setTagInput(e.target.value);
//   };

//   const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === 'Enter' && tagInput.trim()) {
//       e.preventDefault();
//       if (editingTagIndex !== null) {
//         // Update existing tag
//         setFormData(prev => ({
//           ...prev,
//           tags: prev.tags.map((tag, i) => (i === editingTagIndex ? tagInput.trim() : tag)),
//         }));
//         setEditingTagIndex(null);
//       } else {
//         // Add new tag
//         setFormData(prev => ({
//           ...prev,
//           tags: [...prev.tags, tagInput.trim()],
//         }));
//       }
//       setTagInput('');
//     }
//   };

//   const addSuggestedTag = (tag: string) => {
//     if (!formData.tags.includes(tag)) {
//       setFormData(prev => ({
//         ...prev,
//         tags: [...prev.tags, tag],
//       }));
//     }
//     setTagInput('');
//   };

//   const removeTag = (index: number) => {
//     setFormData(prev => ({
//       ...prev,
//       tags: prev.tags.filter((_, i) => i !== index),
//     }));
//     if (editingTagIndex === index) {
//       setEditingTagIndex(null);
//       setTagInput('');
//     }
//   };

//   const editTag = (index: number) => {
//     setEditingTagIndex(index);
//     setTagInput(formData.tags[index]);
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     // Validate required fields
//     if (!formData.title || !formData.name || !formData.description || formData.tags.length === 0) {
//       setError('Please fill in all required fields');
//       return;
//     }

//     setIsSubmitting(true);
//     setError(null);

//     // Prepare FormData for API request
//     const formDataPayload = new FormData();
//     formDataPayload.append('name', formData.name);
//     formDataPayload.append('title', formData.title);
//     formDataPayload.append('description', formData.description);
//     formDataPayload.append('tags', JSON.stringify(formData.tags));
//     if (imageFile) {
//       formDataPayload.append('blog_image', imageFile);
//     }
//     if (isEdit && initialBlog?._id) {
//       formDataPayload.append('blogId', initialBlog._id);
//     }

//     try {
//       let response;
//       if (isEdit && initialBlog?._id) {
//         // Update existing blog
//         response = await updateBlog(formDataPayload);
//       } else {
//         // Create new blog
//         response = await createBlog(formDataPayload);
//       }

//       if (response.success) {
//         navigate('/blogs/all');
//       } else {
//         setError(isEdit ? 'Failed to update blog post' : 'Failed to create blog post');
//       }
//     } catch (err) {
//       setError(isEdit ? 'Error updating blog post. Please try again.' : 'Error creating blog post. Please try again.');
//       console.error(`Error ${isEdit ? 'updating' : 'adding'} blog:`, err);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-8">
//         <div className="flex items-center gap-3">
//           <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg transform transition-transform hover:scale-110">
//             <FileText className="h-5 w-5 text-white" />
//           </div>
//           <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
//             {isEdit ? 'Edit Blog' : 'Add Blog'}
//           </h1>
//         </div>
//         <button
//           onClick={() => navigate('/blogs/all')}
//           className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
//           disabled={isSubmitting}
//         >
//           <ArrowLeft className="w-5 h-5 mr-2" />
//           Back to All Blogs
//         </button>
//       </div>

//       {/* Form */}
//       <div className="bg-white rounded-xl shadow-lg p-8">
//         {error && (
//           <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg animate-slide-in">
//             {error}
//           </div>
//         )}
//         <form onSubmit={handleSubmit} className="space-y-8">
//           {/* Basic Information */}
//           <div className="space-y-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
//                   Blog Title *
//                 </label>
//                 <input
//                   type="text"
//                   id="title"
//                   name="title"
//                   value={formData.title}
//                   onChange={handleInputChange}
//                   className={`w-full px-4 py-3 border ${
//                     fieldErrors.title ? 'border-red-500' : 'border-gray-300'
//                   } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
//                   placeholder="Enter blog title"
//                   required
//                 />
//                 {fieldErrors.title && (
//                   <p className="text-red-500 text-sm mt-1 animate-slide-in">{fieldErrors.title}</p>
//                 )}
//               </div>

//               <div>
//                 <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
//                   Service *
//                 </label>
//                 <input
//                   type="text"
//                   id="name"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleInputChange}
//                   className={`w-full px-4 py-3 border ${
//                     fieldErrors.name ? 'border-red-500' : 'border-gray-300'
//                   } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
//                   placeholder="e.g., AC Services"
//                   required
//                 />
//                 {fieldErrors.name && (
//                   <p className="text-red-500 text-sm mt-1 animate-slide-in">{fieldErrors.name}</p>
//                 )}
//               </div>
//             </div>

//             {/* Tags Input */}
//             <div>
//               <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
//                 Tags *
//               </label>
//               <div className="flex flex-wrap gap-2 mb-2">
//                 {formData.tags.map((tag, index) => (
//                   <span
//                     key={index}
//                     className={`inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full cursor-pointer transition-transform duration-200 hover:scale-105 ${
//                       editingTagIndex === index ? 'ring-2 ring-blue-500' : ''
//                     }`}
//                     onClick={() => editTag(index)}
//                   >
//                     {tag}
//                     <button
//                       type="button"
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         removeTag(index);
//                       }}
//                       className="ml-2 text-blue-600 hover:text-blue-800"
//                     >
//                       <X className="w-4 h-4" />
//                     </button>
//                   </span>
//                 ))}
//               </div>
//               <input
//                 type="text"
//                 id="tags"
//                 value={tagInput}
//                 onChange={handleTagInputChange}
//                 onKeyDown={handleTagKeyDown}
//                 className={`w-full px-4 py-3 border ${
//                   fieldErrors.tags ? 'border-red-500' : 'border-gray-300'
//                 } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
//                 placeholder={editingTagIndex !== null ? 'Edit tag and press Enter' : 'Type a tag and press Enter'}
//                 required={formData.tags.length === 0}
//               />
//               {fieldErrors.tags && (
//                 <p className="text-red-500 text-sm mt-1 animate-slide-in">{fieldErrors.tags}</p>
//               )}
//               <div className="mt-2 flex flex-wrap gap-2">
//                 {suggestedTags
//                   .filter(tag => !formData.tags.includes(tag) && tag.toLowerCase().includes(tagInput.toLowerCase()))
//                   .map(tag => (
//                     <button
//                       key={tag}
//                       type="button"
//                       onClick={() => addSuggestedTag(tag)}
//                       className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-full hover:bg-blue-200 hover:text-blue-800 transition-all duration-200"
//                     >
//                       {tag}
//                     </button>
//                   ))}
//               </div>
//             </div>

//             {/* Image Upload */}
//             <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
//               <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
//                 <h2 className="text-lg font-semibold text-white">Blog Image</h2>
//               </div>
//               <div className="p-6 space-y-6">
//                 <div
//                   className={`border-2 border-dashed ${
//                     isDragging ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
//                   } rounded-lg p-8 text-center hover:border-blue-400 transition-all duration-200`}
//                   onDragOver={handleDragOver}
//                   onDragLeave={handleDragLeave}
//                   onDrop={handleDrop}
//                 >
//                   <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//                   <p className="text-gray-600 mb-2">Upload or drag and drop blog image</p>
//                   <p className="text-sm text-gray-500 mb-4">PNG, JPG, SVG up to 250KB</p>
//                   <input
//                     type="file"
//                     accept="image/png,image/jpeg,image/svg+xml"
//                     className="hidden"
//                     id="imageFile"
//                     ref={fileInputRef}
//                     onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
//                     aria-describedby={imageError ? 'imageFile-error' : undefined}
//                   />
//                   <label
//                     htmlFor="imageFile"
//                     className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 cursor-pointer transition-colors duration-200 shadow-lg hover:shadow-xl"
//                   >
//                     Choose File
//                   </label>
//                   {previewImage && (
//                     <div className="mt-4">
//                       <img
//                         src={previewImage}
//                         alt="Blog preview"
//                         className="max-w-xs mx-auto rounded-lg"
//                         onError={() => setPreviewImage('')}
//                       />
//                       <p className="text-sm text-gray-600 mt-2">
//                         Selected: {imageFile ? imageFile.name : 'Existing image'}
//                       </p>
//                     </div>
//                   )}
//                   {imageError && (
//                     <p id="imageFile-error" className="text-red-500 text-sm mt-2 animate-slide-in">
//                       {imageError}
//                     </p>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Description Editor */}
//             <div className="bg-white rounded-xl shadow-lg p-6">
//               <h2 className="text-lg font-semibold text-black mb-4">Blog Description</h2>
//               <div className={`${fieldErrors.description ? 'border border-red-500 rounded-lg' : ''}`}>
//                 <JoditEditor
//                   value={formData.description}
//                   config={config}
//                   onChange={newContent => setFormData(prev => ({ ...prev, description: newContent }))}
//                 />
//               </div>
//               {fieldErrors.description && (
//                 <p className="text-red-500 text-sm mt-1 animate-slide-in">{fieldErrors.description}</p>
//               )}
//             </div>
//           </div>

//           {/* Form Actions */}
//           <div className="flex items-center justify-between space-x-4 pt-8 border-gray-200">
//             <button
//               type="button"
//               onClick={() => navigate('/blogs/all')}
//               className="px-6 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
//               disabled={isSubmitting}
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
//               disabled={isSubmitting}
//             >
//               {isSubmitting ? (
//                 <span className="flex items-center">
//                   <Loader2 className="w-5 h-5 mr-2 animate-spin" />
//                   {isEdit ? 'Updating...' : 'Creating...'}
//                 </span>
//               ) : (
//                 <>{isEdit ? 'Update Blog' : 'Create Blog'}</>
//               )}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default BlogForm;
// import React, { useState, useEffect, useMemo } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { ArrowLeft, FileText, Upload, X } from 'lucide-react';
// import JoditEditor from 'jodit-react';
// import { createBlog, updateBlog } from '../../api/apiMethods';

// interface BlogPost {
//   _id?: string;
//   name: string;
//   image: string;
//   title: string;
//   description: string;
//   tags: string[];
//   createdAt?: string;
//   updatedAt?: string;
// }

// interface BlogFormProps {
//   isEdit?: boolean;
// }

// const BlogForm: React.FC<BlogFormProps> = ({ isEdit = false }) => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   // Initialize form data with blog data from location.state if editing
//   const initialBlog = isEdit ? (location.state as BlogPost) : null;
//   const [formData, setFormData] = useState({
//     title: initialBlog?.title || '',
//     description: initialBlog?.description || '',
//     name: initialBlog?.name || '',
//     tags: initialBlog?.tags || [],
//     image: initialBlog?.image || '',
//   });
//   const [imageFile, setImageFile] = useState<File | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [previewImage, setPreviewImage] = useState<string>(initialBlog?.image || '');
//   const [tagInput, setTagInput] = useState('');
//   const [imageError, setImageError] = useState<string | null>(null);
//   const [editingTagIndex, setEditingTagIndex] = useState<number | null>(null);

//   // JoditEditor configuration
//   const config = useMemo(
//     () => ({
//       height: 400,
//       buttons: [
//         'bold',
//         'italic',
//         'underline',
//         '|',
//         'ul',
//         'ol',
//         '|',
//         'link',
//         'table',
//         '|',
//         'font',
//         'fontsize',
//         'brush',
//         '|',
//         { name: 'heading', list: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] },
//         '|',
//         'undo',
//         'redo',
//       ],
//       toolbarAdaptive: false,
//       placeholder: 'Enter blog description here...',
//       style: {
//         font: '16px Arial',
//       },
//       colors: {
//         text: ['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'],
//         background: ['#FFFFFF', '#FFCCCC', '#CCFFCC', '#CCCCFF', '#FFFFCC', '#FFCCFF', '#CCFFFF'],
//       },
//       fonts: ['Arial', 'Helvetica', 'Times New Roman', 'Courier New', 'Verdana', 'Georgia', 'Trebuchet MS'],
//       fontSize: ['8', '10', '12', '14', '16', '18', '24', '30', '36'],
//       iframe: false,
//       styleValues: {
//         'jodit-container': 'border border-gray-300 rounded-lg shadow-sm',
//         'jodit-toolbar__box': 'bg-gray-50 border-b border-gray-300 rounded-t-lg p-2',
//         'jodit-toolbar-button': 'text-gray-700 hover:bg-blue-100 hover:text-blue-600 px-2 py-1 rounded transition',
//         'jodit-toolbar-button_active': 'bg-blue-500 text-white',
//         'jodit-wysiwyg': 'p-4 min-h-[400px] focus:outline-none focus:ring-2 focus:ring-blue-500',
//       },
//     }),
//     []
//   );

//   // Update preview when image URL or file changes
//   useEffect(() => {
//     if (imageFile) {
//       const objectUrl = URL.createObjectURL(imageFile);
//       setPreviewImage(objectUrl);
//       return () => URL.revokeObjectURL(objectUrl); // Cleanup
//     } else {
//       setPreviewImage(formData.image);
//     }
//   }, [imageFile, formData.image]);

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value,
//     }));
//     // Clear preview if image URL is changed
//     if (name === 'image' && !imageFile) {
//       setPreviewImage(value);
//     }
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       // Validate file type
//       const validTypes = ['image/png', 'image/jpeg', 'image/svg+xml'];
//       if (!validTypes.includes(file.type)) {
//         setImageError('Please upload a PNG, JPG, or SVG image');
//         setImageFile(null);
//         setPreviewImage(formData.image);
//         return;
//       }
//       // Validate file size (250KB limit)
//       if (file.size > 250 * 1024) {
//         setImageError('Image size must be less than 250KB');
//         setImageFile(null);
//         setPreviewImage(formData.image);
//         return;
//       }
//       setImageError(null);
//       setImageFile(file);
//       setFormData(prev => ({ ...prev, image: '' })); // Clear URL when file is selected
//     }
//   };

//   const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setTagInput(e.target.value);
//   };

//   const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === 'Enter' && tagInput.trim()) {
//       e.preventDefault();
//       if (editingTagIndex !== null) {
//         // Update existing tag
//         setFormData(prev => ({
//           ...prev,
//           tags: prev.tags.map((tag, i) => (i === editingTagIndex ? tagInput.trim() : tag)),
//         }));
//         setEditingTagIndex(null);
//       } else {
//         // Add new tag
//         setFormData(prev => ({
//           ...prev,
//           tags: [...prev.tags, tagInput.trim()],
//         }));
//       }
//       setTagInput('');
//     }
//   };

//   const removeTag = (index: number) => {
//     setFormData(prev => ({
//       ...prev,
//       tags: prev.tags.filter((_, i) => i !== index),
//     }));
//     if (editingTagIndex === index) {
//       setEditingTagIndex(null);
//       setTagInput('');
//     }
//   };

//   const editTag = (index: number) => {
//     setEditingTagIndex(index);
//     setTagInput(formData.tags[index]);
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     // Validate required fields
//     if (!formData.title || !formData.name || !formData.description || formData.tags.length === 0) {
//       setError('Please fill in all required fields');
//       return;
//     }

//     // Prepare blog post data
//     const payload: {
//       name: string;
//       title: string;
//       description: string;
//       tags: string[];
//       blog_image?: File | string;
//       blogId?: string;
//     } = {
//       name: formData.name,
//       title: formData.title,
//       description: formData.description,
//       tags: formData.tags,
//     };

//     try {
//       let response;
//       if (isEdit && initialBlog?._id) {
//         // Handle file upload or URL for edit
//         if (imageFile) {
//           payload.blog_image = imageFile;
//         } else if (formData.image) {
//           payload.blog_image = formData.image;
//         }
//         payload.blogId = initialBlog._id;
//         // Update existing blog
//         response = await updateBlog(payload);
//       } else {
//         // Handle file upload for new blog
//         if (imageFile) {
//           payload.blog_image = imageFile;
//         }
//         // Create new blog
//         response = await createBlog(payload);
//       }

//       if (response.success) {
//         navigate('/blogs/all');
//       } else {
//         setError(isEdit ? 'Failed to update blog post' : 'Failed to create blog post');
//       }
//     } catch (err) {
//       setError(isEdit ? 'Error updating blog post. Please try again.' : 'Error creating blog post. Please try again.');
//       console.error(`Error ${isEdit ? 'updating' : 'adding'} blog:`, err);
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-8">
//         <div className="flex items-center gap-3">
//           <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
//             <FileText className="h-5 w-5 text-white" />
//           </div>
//           <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
//             {isEdit ? 'Edit Blog' : 'Add Blog'}
//           </h1>
//         </div>
//         <button
//           onClick={() => navigate('/blogs/all')}
//           className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
//         >
//           <ArrowLeft className="w-5 h-5 mr-2" />
//           Back to All Blogs
//         </button>
//       </div>

//       {/* Form */}
//       <div className="bg-white rounded-xl shadow-lg p-8">
//         {error && (
//           <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
//             {error}
//           </div>
//         )}
//         <form onSubmit={handleSubmit} className="space-y-8">
//           {/* Basic Information */}
//           <div className="space-y-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
//                   Blog Title *
//                 </label>
//                 <input
//                   type="text"
//                   id="title"
//                   name="title"
//                   value={formData.title}
//                   onChange={handleInputChange}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                   placeholder="Enter blog title"
//                   required
//                 />
//               </div>

//               <div>
//                 <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
//                   Service *
//                 </label>
//                 <input
//                   type="text"
//                   id="name"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleInputChange}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                   placeholder="e.g., AC Services"
//                   required
//                 />
//               </div>
//             </div>

//             {/* Tags Input */}
//             <div>
//               <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
//                 Tags *
//               </label>
//               <div className="flex flex-wrap gap-2 mb-2">
//                 {formData.tags.map((tag, index) => (
//                   <span
//                     key={index}
//                     className={`inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full cursor-pointer ${
//                       editingTagIndex === index ? 'ring-2 ring-blue-500' : ''
//                     }`}
//                     onClick={() => editTag(index)}
//                   >
//                     {tag}
//                     <button
//                       type="button"
//                       onClick={(e) => {
//                         e.stopPropagation(); // Prevent editTag from being triggered
//                         removeTag(index);
//                       }}
//                       className="ml-2 text-blue-600 hover:text-blue-800"
//                     >
//                       <X className="w-4 h-4" />
//                     </button>
//                   </span>
//                 ))}
//               </div>
//               <input
//                 type="text"
//                 id="tags"
//                 value={tagInput}
//                 onChange={handleTagInputChange}
//                 onKeyDown={handleTagKeyDown}
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                 placeholder={editingTagIndex !== null ? 'Edit tag and press Enter' : 'Type a tag and press Enter'}
//                 required={formData.tags.length === 0}
//               />
//             </div>

//             {/* Image Upload */}
//             <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
//               <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
//                 <h2 className="text-lg font-semibold text-white">Blog Image</h2>
//               </div>
//               <div className="p-6 space-y-6">
//                 <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors duration-200">
//                   <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//                   <p className="text-gray-600 mb-2">Upload blog image</p>
//                   <p className="text-sm text-gray-500 mb-4">PNG, JPG, SVG up to 250KB</p>
//                   <input
//                     type="file"
//                     accept="image/png,image/jpeg,image/svg+xml"
//                     className="hidden"
//                     id="imageFile"
//                     onChange={handleFileChange}
//                     aria-describedby={imageError ? 'imageFile-error' : undefined}
//                   />
//                   <label
//                     htmlFor="imageFile"
//                     className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 cursor-pointer transition-colors duration-200 shadow-lg hover:shadow-xl"
//                   >
//                     Choose File
//                   </label>
//                   {previewImage && (
//                     <div className="mt-4">
//                       <img
//                         src={previewImage}
//                         alt="Blog preview"
//                         className="max-w-xs mx-auto rounded-lg"
//                         onError={() => setPreviewImage('')}
//                       />
//                       <p className="text-sm text-gray-600 mt-2">
//                         Selected: {imageFile ? imageFile.name : 'Image from URL'}
//                       </p>
//                     </div>
//                   )}
//                   {imageError && (
//                     <p id="imageFile-error" className="text-red-500 text-sm mt-2">
//                       {imageError}
//                     </p>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Description Editor */}
//             <div className="bg-white rounded-xl shadow-lg p-6">
//               <h2 className="text-lg font-semibold text-black mb-4">Blog Description</h2>
//               <JoditEditor
//                 value={formData.description}
//                 config={config}
//                 onChange={newContent => setFormData(prev => ({ ...prev, description: newContent }))}
//               />
//             </div>
//           </div>

//           {/* Form Actions */}
//           <div className="flex items-center justify-between space-x-4 pt-8 border-gray-200">
//             <button
//               type="button"
//               onClick={() => navigate('/blogs/all')}
//               className="px-6 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
//             >
//               {isEdit ? 'Update Blog' : 'Create Blog'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default BlogForm;
// import React, { useState, useEffect, useMemo } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { ArrowLeft, FileText, Upload, X } from 'lucide-react';
// import JoditEditor from 'jodit-react';

// interface BlogPost {
//   _id?: string;
//   name: string;
//   image: string;
//   title: string;
//   description: string;
//   tags: string[];
//   createdAt?: string;
//   updatedAt?: string;
// }

// interface BlogFormProps {
//   isEdit?: boolean;
// }

// const BlogForm: React.FC<BlogFormProps> = ({ isEdit = false }) => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   // Initialize form data with blog data from location.state if editing
//   const initialBlog = isEdit ? (location.state as BlogPost) : null;
//   const [formData, setFormData] = useState({
//     title: initialBlog?.title || '',
//     description: initialBlog?.description || '',
//     name: initialBlog?.name || '',
//     tags: initialBlog?.tags || [],
//     image: initialBlog?.image || '',
//   });
//   const [imageFile, setImageFile] = useState<File | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [previewImage, setPreviewImage] = useState<string>(initialBlog?.image || '');
//   const [tagInput, setTagInput] = useState('');
//   const [imageError, setImageError] = useState<string | null>(null);
//   const [editingTagIndex, setEditingTagIndex] = useState<number | null>(null);

//   // JoditEditor configuration
//   const config = useMemo(
//     () => ({
//       height: 400,
//       buttons: [
//         'bold',
//         'italic',
//         'underline',
//         '|',
//         'ul',
//         'ol',
//         '|',
//         'link',
//         'table',
//         '|',
//         'font',
//         'fontsize',
//         'brush',
//         '|',
//         { name: 'heading', list: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] },
//         '|',
//         'undo',
//         'redo',
//       ],
//       toolbarAdaptive: false,
//       placeholder: 'Enter blog description here...',
//       style: {
//         font: '16px Arial',
//       },
//       colors: {
//         text: [
//           '#000000',
//           '#FF0000',
//           '#00FF00',
//           '#0000FF',
//           '#FFFF00',
//           '#FF00FF',
//           '#00FFFF',
//         ],
//         background: [
//           '#FFFFFF',
//           '#FFCCCC',
//           '#CCFFCC',
//           '#CCCCFF',
//           '#FFFFCC',
//           '#FFCCFF',
//           '#CCFFFF',
//         ],
//       },
//       fonts: [
//         'Arial',
//         'Helvetica',
//         'Times New Roman',
//         'Courier New',
//         'Verdana',
//         'Georgia',
//         'Trebuchet MS',
//       ],
//       fontSize: ['8', '10', '12', '14', '16', '18', '24', '30', '36'],
//       iframe: false,
//       styleValues: {
//         'jodit-container': 'border border-gray-300 rounded-lg shadow-sm',
//         'jodit-toolbar__box': 'bg-gray-50 border-b border-gray-300 rounded-t-lg p-2',
//         'jodit-toolbar-button': 'text-gray-700 hover:bg-blue-100 hover:text-blue-600 px-2 py-1 rounded transition',
//         'jodit-toolbar-button_active': 'bg-blue-500 text-white',
//         'jodit-wysiwyg': 'p-4 min-h-[400px] focus:outline-none focus:ring-2 focus:ring-blue-500',
//       },
//     }),
//     []
//   );

//   // Update preview when image URL or file changes
//   useEffect(() => {
//     if (imageFile) {
//       const objectUrl = URL.createObjectURL(imageFile);
//       setPreviewImage(objectUrl);
//       return () => URL.revokeObjectURL(objectUrl); // Cleanup
//     } else {
//       setPreviewImage(formData.image);
//     }
//   }, [imageFile, formData.image]);

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//     // Clear preview if image URL is changed
//     if (name === 'image' && !imageFile) {
//       setPreviewImage(value);
//     }
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       // Validate file type
//       const validTypes = ['image/png', 'image/jpeg', 'image/svg+xml'];
//       if (!validTypes.includes(file.type)) {
//         setImageError('Please upload a PNG, JPG, or SVG image');
//         setImageFile(null);
//         setPreviewImage(formData.image);
//         return;
//       }
//       // Validate file size (2MB limit)
//       if (file.size > 2 * 1024 * 1024) {
//         setImageError('Image size must be less than 2MB');
//         setImageFile(null);
//         setPreviewImage(formData.image);
//         return;
//       }
//       setImageError(null);
//       setImageFile(file);
//       setFormData(prev => ({ ...prev, image: '' })); // Clear URL when file is selected
//     }
//   };

//   const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setTagInput(e.target.value);
//   };

//   const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === 'Enter' && tagInput.trim()) {
//       e.preventDefault();
//       if (editingTagIndex !== null) {
//         // Update existing tag
//         setFormData(prev => ({
//           ...prev,
//           tags: prev.tags.map((tag, i) => (i === editingTagIndex ? tagInput.trim() : tag)),
//         }));
//         setEditingTagIndex(null);
//       } else {
//         // Add new tag
//         setFormData(prev => ({
//           ...prev,
//           tags: [...prev.tags, tagInput.trim()],
//         }));
//       }
//       setTagInput('');
//     }
//   };

//   const removeTag = (index: number) => {
//     setFormData(prev => ({
//       ...prev,
//       tags: prev.tags.filter((_, i) => i !== index),
//     }));
//     if (editingTagIndex === index) {
//       setEditingTagIndex(null);
//       setTagInput('');
//     }
//   };

//   const editTag = (index: number) => {
//     setEditingTagIndex(index);
//     setTagInput(formData.tags[index]);
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     // Validate required fields
//     if (!formData.title || !formData.name || !formData.description || formData.tags.length === 0) {
//       setError('Please fill in all required fields');
//       return;
//     }

//     // Prepare blog post data
//     const newBlog: BlogPost = {
//       title: formData.title,
//       description: formData.description,
//       name: formData.name,
//       tags: formData.tags,
//       image: formData.image,
//     };

//     try {
//       let response;
//       if (isEdit && initialBlog?._id) {
//         // Handle file upload for edit
//         if (imageFile) {
//           const imageUrl = await uploadImage(imageFile);
//           newBlog.image = imageUrl;
//         }
//         // Update existing blog
//         response = await updateBlog(initialBlog._id, newBlog);
//       } else {
//         // Handle file upload for new blog
//         if (imageFile) {
//           const imageUrl = await uploadImage(imageFile);
//           newBlog.image = imageUrl;
//         }
//         // Create new blog
//         response = await addBlog(newBlog);
//       }

//       if (response.success) {
//         navigate('/blogs/all');
//       } else {
//         setError(isEdit ? 'Failed to update blog post' : 'Failed to create blog post');
//       }
//     } catch (err) {
//       setError(isEdit ? 'Error updating blog post. Please try again.' : 'Error creating blog post. Please try again.');
//       console.error(`Error ${isEdit ? 'updating' : 'adding'} blog:`, err);
//     }
//   };

//   // Mock uploadImage function (replace with your actual implementation)
//   const uploadImage = async (file: File): Promise<string> => {
//     const formData = new FormData();
//     formData.append('file', file);
//     // Replace with your actual Cloudinary upload endpoint and preset
//     const response = await fetch('https://api.cloudinary.com/v1_1/your-cloud-name/image/upload', {
//       method: 'POST',
//       body: formData,
//     });
//     const data = await response.json();
//     return data.secure_url; // Adjust based on your API response
//   };

//   return (
//     <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-8">
//        <div className="flex items-center gap-3">
//           <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
//             <FileText className="h-5 w-5 text-white" />
//           </div>
//           <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
//             {isEdit ? 'Edit Blog' : 'Add Blog'}
//           </h1>
//         </div>
//         <button
//           onClick={() => navigate('/blogs/all')}
//           className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
//         >
//           <ArrowLeft className="w-5 h-5 mr-2" />
//           Back to All Blogs
//         </button>
//       </div>

//       {/* Form */}
//       <div className="bg-white rounded-xl shadow-lg p-8">
//         {error && (
//           <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
//             {error}
//           </div>
//         )}
//         <form onSubmit={handleSubmit} className="space-y-8">
//           {/* Basic Information */}
//           <div className="space-y-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
//                   Blog Title *
//                 </label>
//                 <input
//                   type="text"
//                   id="title"
//                   name="title"
//                   value={formData.title}
//                   onChange={handleInputChange}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                   placeholder="Enter blog title"
//                   required
//                 />
//               </div>

//               <div>
//                 <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
//                   Service *
//                 </label>
//                 <input
//                   type="text"
//                   id="name"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleInputChange}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                   placeholder="e.g., AC Services"
//                   required
//                 />
//               </div>
//             </div>

//             {/* Tags Input */}
//             <div>
//               <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
//                 Tags *
//               </label>
//               <div className="flex flex-wrap gap-2 mb-2">
//                 {formData.tags.map((tag, index) => (
//                   <span
//                     key={index}
//                     className={`inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full cursor-pointer ${
//                       editingTagIndex === index ? 'ring-2 ring-blue-500' : ''
//                     }`}
//                     onClick={() => editTag(index)}
//                   >
//                     {tag}
//                     <button
//                       type="button"
//                       onClick={(e) => {
//                         e.stopPropagation(); // Prevent editTag from being triggered
//                         removeTag(index);
//                       }}
//                       className="ml-2 text-blue-600 hover:text-blue-800"
//                     >
//                       <X className="w-4 h-4" />
//                     </button>
//                   </span>
//                 ))}
//               </div>
//               <input
//                 type="text"
//                 id="tags"
//                 value={tagInput}
//                 onChange={handleTagInputChange}
//                 onKeyDown={handleTagKeyDown}
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                 placeholder={editingTagIndex !== null ? 'Edit tag and press Enter' : 'Type a tag and press Enter'}
//                 required={formData.tags.length === 0}
//               />
//             </div>

//             {/* Image Upload */}
//             <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
//               <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
//                 <h2 className="text-lg font-semibold text-white">Blog Image</h2>
//               </div>
//               <div className="p-6 space-y-6">
//                 <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors duration-200">
//                   <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//                   <p className="text-gray-600 mb-2">Upload blog image</p>
//                   <p className="text-sm text-gray-500 mb-4">PNG, JPG, SVG up to 2MB</p>
//                   <input
//                     type="file"
//                     accept="image/png,image/jpeg,image/svg+xml"
//                     className="hidden"
//                     id="imageFile"
//                     onChange={handleFileChange}
//                     aria-describedby={imageError ? 'imageFile-error' : undefined}
//                   />
//                   <label
//                     htmlFor="imageFile"
//                     className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 cursor-pointer transition-colors duration-200 shadow-lg hover:shadow-xl"
//                   >
//                     Choose File
//                   </label>
//                   {previewImage && (
//                     <div className="mt-4">
//                       <img
//                         src={previewImage}
//                         alt="Blog preview"
//                         className="max-w-xs mx-auto rounded-lg"
//                         onError={() => setPreviewImage('')}
//                       />
//                       <p className="text-sm text-gray-600 mt-2">
//                         Selected: {imageFile ? imageFile.name : 'Image from URL'}
//                       </p>
//                     </div>
//                   )}
//                   {imageError && (
//                     <p id="imageFile-error" className="text-red-500 text-sm mt-2">
//                       {imageError}
//                     </p>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Description Editor */}
//             <div className="bg-white rounded-xl shadow-lg p-6">
//               <h2 className="text-lg font-semibold text-black mb-4">Blog Description</h2>
//               <JoditEditor
//                 value={formData.description}
//                 config={config}
//                 onChange={newContent => setFormData(prev => ({ ...prev, description: newContent }))}
//               />
//             </div>
//           </div>

//           {/* Form Actions */}
//           <div className="flex items-center justify-between space-x-4 pt-8 border-gray-200">
//             <button
//               type="button"
//               onClick={() => navigate('/blogs/all')}
//               className="px-6 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
//             >
//               {isEdit ? 'Update Blog' : 'Create Blog'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default BlogForm;

// import React, { useState, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { ArrowLeft, Plus, Trash2, Bold, Italic, Underline, Link as LinkIcon, Image } from 'lucide-react';
// import { BlogPost } from './types';

// const AddBlog: React.FC = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     title: '',
//     excerpt: '',
//     category: '',
//     tags: '',
//     image: '',
//     heroImage: '',
//     content: ['']
//   });
//   const [activeContentIndex, setActiveContentIndex] = useState<number | null>(null);
//   const contentRefs = useRef<(HTMLTextAreaElement | null)[]>([]);

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleContentChange = (index: number, value: string) => {
//     const newContent = [...formData.content];
//     newContent[index] = value;
//     setFormData(prev => ({
//       ...prev,
//       content: newContent
//     }));
//   };

//   const addContentParagraph = () => {
//     setFormData(prev => ({
//       ...prev,
//       content: [...prev.content, '']
//     }));
//   };

//   const removeContentParagraph = (index: number) => {
//     if (formData.content.length > 1) {
//       const newContent = formData.content.filter((_, i) => i !== index);
//       setFormData(prev => ({
//         ...prev,
//         content: newContent
//       }));
//     }
//   };

//   const insertTextFormat = (format: 'bold' | 'italic' | 'underline', index: number) => {
//     const textarea = contentRefs.current[index];
//     if (!textarea) return;

//     const start = textarea.selectionStart;
//     const end = textarea.selectionEnd;
//     const selectedText = textarea.value.substring(start, end);
    
//     let formattedText = '';
//     switch (format) {
//       case 'bold':
//         formattedText = `**${selectedText}**`;
//         break;
//       case 'italic':
//         formattedText = `*${selectedText}*`;
//         break;
//       case 'underline':
//         formattedText = `__${selectedText}__`;
//         break;
//     }

//     const newContent = [...formData.content];
//     newContent[index] = textarea.value.substring(0, start) + formattedText + textarea.value.substring(end);
    
//     setFormData(prev => ({
//       ...prev,
//       content: newContent
//     }));

//     // Set cursor position after formatting
//     setTimeout(() => {
//       textarea.focus();
//       textarea.setSelectionRange(start + formattedText.length, start + formattedText.length);
//     }, 0);
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
    
//     // Create new blog post
//     const newBlog: BlogPost = {
//       id: Date.now().toString(),
//       title: formData.title,
//       excerpt: formData.excerpt,
//       category: formData.category,
//       tags: formData.tags.split(',').map(tag => tag.trim()),
//       image: formData.image,
//       heroImage: formData.heroImage,
//       content: formData.content.filter(paragraph => paragraph.trim() !== ''),
//       date: new Date().toLocaleDateString('en-US', { 
//         year: 'numeric', 
//         month: 'short', 
//         day: 'numeric' 
//       })
//     };

//     // Here you would typically save to your data store
//     console.log('New blog post:', newBlog);
    
//     // Navigate back to all blogs
//     navigate('/blogs/all');
//   };

//   return (
//     <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//       {/* Header */}
//       <div className="flex items-center mb-8">
//         <button
//           onClick={() => navigate('/blogs/all')}
//           className="flex items-center text-blue-600 hover:text-blue-800 transition-colors mr-6"
//         >
//           <ArrowLeft className="w-5 h-5 mr-2" />
//           Back to All Blogs
//         </button>
//         <div className="flex items-center">
//           <span className="w-1 h-12 bg-gradient-to-b from-blue-500 to-purple-500 mr-4"></span>
//           <h1 className="text-4xl font-bold text-gray-900">Add Blog</h1>
//         </div>
//       </div>

//       {/* Form */}
//       <div className="bg-white rounded-xl shadow-lg p-8">
//         <form onSubmit={handleSubmit} className="space-y-8">
//           {/* Basic Information */}
//           <div className="space-y-6">
         
            
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
//                   Blog Title *
//                 </label>
//                 <input
//                   type="text"
//                   id="title"
//                   name="title"
//                   value={formData.title}
//                   onChange={handleInputChange}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                   placeholder="Enter blog title"
//                   required
//                 />
//               </div>

//               <div>
//                 <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
//                   Service *
//                 </label>
//                 <input
//                   type="text"
//                   id="category"
//                   name="category"
//                   value={formData.category}
//                   onChange={handleInputChange}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                   placeholder="e.g., PLUMBING SERVICES"
//                   required
//                 />
//               </div>
//             </div>

//             <div>
//               <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
//                 Tags *
//               </label>
//               <input
//                 type="text"
//                 id="tags"
//                 name="tags"
//                 value={formData.tags}
//                 onChange={handleInputChange}
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                 placeholder="Enter tags separated by commas (e.g., plumbing, maintenance, home)"
//                 required
//               />
//             </div>

//                <div>
//               <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-2">
//                 Description *
//               </label>
//               <textarea
//                 id="excerpt"
//                 name="excerpt"
//                 value={formData.excerpt}
//                 onChange={handleInputChange}
//                 rows={3}
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                 placeholder="Brief description of the blog post"
//                 required
//               />
//             </div>

        
//           </div>

        
//           {/* Form Actions */}
//           <div className="flex items-center justify-end space-x-4 pt-8 border-gray-200">
//             <button
//               type="button"
//               onClick={() => navigate('/blogs/all')}
//               className="px-6 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
//             >
//               Create Blog Post
//             </button>
//           </div>
//         </form>
//       </div>

    
//     </div>
//   );
// };

// export default AddBlog;