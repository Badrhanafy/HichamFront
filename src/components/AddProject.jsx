import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { 
  X, 
  Plus, 
  XCircle, 
  Upload, 
  Loader2, 
  CheckCircle2,
  AlertCircle,
  Image,
  Trash2
} from 'lucide-react';

const AddProject = ({ onProjectAdded, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    technologies: []
  });
  
  const [currentTech, setCurrentTech] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  // Predefined categories
  const categories = [
    'Web-Development',
    'social-media',
    'logo'
  ];

  // Common technologies
  const commonTechnologies = [
    'React', 'Vue.js', 'Angular', 'Laravel', 'Node.js', 'Express.js',
    'Python', 'Django', 'Flask', 'Java', 'Spring Boot', 'PHP',
    'MySQL', 'PostgreSQL', 'MongoDB', 'Firebase', 'AWS', 'Docker',
    'TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'Tailwind CSS', 'Bootstrap'
  ];

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle file selection
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setErrors({ image: ['Please select a valid image file (JPEG, PNG, GIF, WebP)'] });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ image: ['Image size should be less than 5MB'] });
        return;
      }

      setImageFile(file);
      setErrors(prev => ({ ...prev, image: '' }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle drag and drop
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      const event = {
        target: {
          files: [file]
        }
      };
      handleFileSelect(event);
    }
  };

  // Handle drag over
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Remove selected image
  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Add technology
  const addTechnology = () => {
    if (currentTech.trim() && !formData.technologies.includes(currentTech.trim())) {
      setFormData(prev => ({
        ...prev,
        technologies: [...prev.technologies, currentTech.trim()]
      }));
      setCurrentTech('');
    }
  };

  // Remove technology
  const removeTechnology = (techToRemove) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.filter(tech => tech !== techToRemove)
    }));
  };

  // Add technology from common list
  const addCommonTechnology = (tech) => {
    if (!formData.technologies.includes(tech)) {
      setFormData(prev => ({
        ...prev,
        technologies: [...prev.technologies, tech]
      }));
    }
  };

  // Handle form submission - UPDATED VERSION
// Handle form submission - FIXED VERSION
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setErrors({});
  setSuccessMessage('');
  setUploadProgress(0);

  try {
    // Validate required fields
    if (!imageFile) {
      setErrors({ image: ['Project image is required'] });
      setLoading(false);
      return;
    }

    // Validate form fields
    if (!formData.title.trim()) {
      setErrors({ title: ['Project title is required'] });
      setLoading(false);
      return;
    }

    if (!formData.description.trim()) {
      setErrors({ description: ['Project description is required'] });
      setLoading(false);
      return;
    }

    if (!formData.category) {
      setErrors({ category: ['Project category is required'] });
      setLoading(false);
      return;
    }

    // Create FormData object to send both file and form data
    const submitData = new FormData();
    
    // Append the image file
    submitData.append('image', imageFile);
    
    // Append all form fields
    submitData.append('title', formData.title);
    submitData.append('description', formData.description);
    submitData.append('category', formData.category);
    
    // Append technologies as array items (NOT as JSON string)
    formData.technologies.forEach((tech, index) => {
      submitData.append(`technologies[${index}]`, tech);
    });

    // Alternative method: Append technologies as simple array
    // formData.technologies.forEach(tech => {
    //   submitData.append('technologies[]', tech);
    // });

    console.log('Sending technologies:', formData.technologies); // Debug log

    // Send all data to the API endpoint with credentials
    const response = await axios.post('http://localhost:8000/api/projects', submitData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      withCredentials: true,
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        }
      }
    });

    setSuccessMessage('Project created successfully!');
    
    // Reset form
    setFormData({
      title: '',
      description: '',
      category: '',
      technologies: []
    });
    setImageFile(null);
    setImagePreview('');
    setCurrentTech('');
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    // Notify parent component
    if (onProjectAdded) {
      onProjectAdded(response.data.data);
    }
    
    // Auto-close after success
    setTimeout(() => {
      if (onClose) onClose();
    }, 1500);
    
  } catch (error) {
    console.error('Error creating project:', error);
    
    if (error.response?.data?.errors) {
      setErrors(error.response.data.errors);
    } else if (error.response?.data?.message) {
      setErrors({ general: error.response.data.message });
    } else {
      setErrors({ general: 'Failed to create project. Please try again.' });
    }
  } finally {
    setLoading(false);
    setUploadProgress(0);
  }
};

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && onClose) {
        onClose();
      }
      if (e.key === 'Enter' && e.ctrlKey) {
        handleSubmit(e);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Add New Project</h2>
            <p className="text-sm text-gray-600 mt-1">Fill in the details below to create a new project</p>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 disabled:opacity-50"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="p-6 space-y-6">
            {/* Success Message */}
            {successMessage && (
              <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span className="text-green-800 font-medium">{successMessage}</span>
              </div>
            )}

            {/* General Error */}
            {errors.general && (
              <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <span className="text-red-800 font-medium">{errors.general}</span>
              </div>
            )}

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                disabled={loading}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 ${
                  errors.title ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Enter project title..."
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.title[0]}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                disabled={loading}
                rows={4}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 ${
                  errors.description ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Describe your project..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.description[0]}
                </p>
              )}
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Image *
              </label>
              
              {!imagePreview ? (
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-blue-400 transition-colors duration-200 cursor-pointer disabled:cursor-not-allowed"
                  onClick={() => !loading && fileInputRef.current?.click()}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept="image/*"
                    disabled={loading}
                    className="hidden"
                  />
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="p-4 bg-blue-50 rounded-full">
                      <Upload className="w-8 h-8 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-lg font-medium text-gray-700">
                        Drop your project image here
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        or <span className="text-blue-500 font-medium">browse files</span>
                      </p>
                    </div>
                    <p className="text-xs text-gray-400">
                      PNG, JPG, GIF, WebP up to 5MB
                    </p>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <div className="border-2 border-dashed border-green-300 rounded-2xl p-4 bg-green-50">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Image className="w-6 h-6 text-green-600" />
                        <div>
                          <p className="font-medium text-green-800">Image selected</p>
                          <p className="text-sm text-green-600">
                            {imageFile?.name} • {imageFile ? (imageFile.size / 1024 / 1024).toFixed(2) + 'MB' : ''}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={removeImage}
                        disabled={loading}
                        className="p-2 hover:bg-red-100 rounded-full transition-colors disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                    
                    {/* Image Preview */}
                    <div className="relative h-48 bg-white rounded-lg overflow-hidden border">
                      <img
                        src={imagePreview}
                        alt="Project preview"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Upload Progress */}
                    {uploadProgress > 0 && (
                      <div className="mt-4">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Uploading...</span>
                          <span>{uploadProgress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {errors.image && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.image[0]}
                </p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                disabled={loading}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 ${
                  errors.category ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
              >
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.category[0]}
                </p>
              )}
            </div>

            {/* Technologies */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Technologies
              </label>
              
              {/* Add Technology Input */}
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={currentTech}
                  onChange={(e) => setCurrentTech(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
                  disabled={loading}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                  placeholder="Add a technology..."
                />
                <button
                  type="button"
                  onClick={addTechnology}
                  disabled={loading || !currentTech.trim()}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 flex items-center gap-2 disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>

              {/* Common Technologies */}
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Quick add:</p>
                <div className="flex flex-wrap gap-2">
                  {commonTechnologies.slice(0, 8).map(tech => (
                    <button
                      key={tech}
                      type="button"
                      onClick={() => addCommonTechnology(tech)}
                      disabled={loading || formData.technologies.includes(tech)}
                      className={`px-3 py-1 text-sm rounded-full border transition-all duration-200 disabled:opacity-50 ${
                        formData.technologies.includes(tech)
                          ? 'bg-green-100 border-green-300 text-green-800'
                          : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {tech}
                    </button>
                  ))}
                </div>
              </div>

              {/* Selected Technologies */}
              <div className="flex flex-wrap gap-2">
                {formData.technologies.map(tech => (
                  <span
                    key={tech}
                    className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {tech}
                    <button
                      type="button"
                      onClick={() => removeTechnology(tech)}
                      disabled={loading}
                      className="hover:text-blue-900 transition-colors disabled:opacity-50"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </span>
                ))}
                {formData.technologies.length === 0 && (
                  <p className="text-gray-500 text-sm">No technologies added yet</p>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !imageFile}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 flex items-center gap-2 shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {uploadProgress > 0 ? `Uploading... ${uploadProgress}%` : 'Creating...'}
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Create Project
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProject;