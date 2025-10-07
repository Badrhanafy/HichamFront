import React, { useState, useRef, useEffect } from 'react';
import { X, Save, Upload, Image, Tag, FileText, Calendar } from 'lucide-react';
import { gsap } from 'gsap';

const UpdateProject = ({ project, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    title: project.title || '',
    description: project.description || '',
    category: project.category || '',
    technologies: Array.isArray(project.technologies) ? project.technologies.join(', ') : (project.technologies || ''),
    image_url: project.image_url || ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(project.image_url || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // Refs for animation
  const modalRef = useRef(null);
  const overlayRef = useRef(null);
  const fileInputRef = useRef(null);

  // Available categories
  const categories = [
    'Web Development',
    'Mobile App', 
    'Design',
    'AI/ML',
    'Blockchain',
    'Other'
  ];

  // Show message
  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Update image preview when URL changes
    if (name === 'image_url') {
      setImagePreview(value);
    }
  };

  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
      
      // Clear URL input when file is selected
      setFormData(prev => ({ ...prev, image_url: '' }));
    }
  };

  // Trigger file input
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      
      // Prepare form data for API
      const submitFormData = new FormData();
      
      // Add text fields
      submitFormData.append('title', formData.title);
      submitFormData.append('description', formData.description);
      submitFormData.append('category', formData.category);
      
      // Handle technologies - convert string to array
      const technologiesArray = formData.technologies
        .split(',')
        .map(tech => tech.trim())
        .filter(tech => tech);
      
      technologiesArray.forEach((tech, index) => {
        submitFormData.append(`technologies[${index}]`, tech);
      });

      // Add image file or URL
      if (imageFile) {
        submitFormData.append('image', imageFile);
      } else if (formData.image_url) {
        submitFormData.append('image_url', formData.image_url);
      }

      console.log('Updating project with ID:', project.id);
      
      const response = await fetch(`http://localhost:8000/api/projects/${project.id}`, {
        method: 'POST', // Use POST with _method for Laravel
        headers: {
          'Authorization': `Bearer ${token}`,
          // Don't set Content-Type for FormData - browser will set it with boundary
        },
        body: submitFormData
      });

      const result = await response.json();
      console.log('Update response:', result);

      if (response.ok && result.success) {
        onUpdate(result.data.project);
        showMessage('success', 'Project updated successfully!');
        setTimeout(() => onClose(), 1000);
      } else {
        throw new Error(result.message || `Failed to update project: ${response.status}`);
      }
    } catch (error) {
      console.error('Error updating project:', error);
      showMessage('error', error.message || 'Failed to update project');
    } finally {
      setLoading(false);
    }
  };

  // Alternative method using PUT with JSON
  const handleSubmitJSON = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      
      // Prepare data for API
      const submitData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        image_url: formData.image_url,
        technologies: formData.technologies
          .split(',')
          .map(tech => tech.trim())
          .filter(tech => tech)
      };

      console.log('Updating project with ID:', project.id, 'Data:', submitData);
      
      const response = await fetch(`http://localhost:8000/api/projects/${project.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(submitData)
      });

      const result = await response.json();
      console.log('Update response:', result);

      if (response.ok && result.success) {
        onUpdate(result.data.project);
        showMessage('success', 'Project updated successfully!');
        setTimeout(() => onClose(), 1000);
      } else {
        throw new Error(result.message || `Failed to update project: ${response.status}`);
      }
    } catch (error) {
      console.error('Error updating project:', error);
      showMessage('error', error.message || 'Failed to update project');
    } finally {
      setLoading(false);
    }
  };

  // Animation on mount
  useEffect(() => {
    if (modalRef.current && overlayRef.current) {
      const tl = gsap.timeline();
      
      gsap.set(overlayRef.current, { opacity: 0 });
      gsap.set(modalRef.current, { 
        scale: 0.8, 
        opacity: 0,
        y: 50
      });
      
      tl.to(overlayRef.current, {
        opacity: 1,
        duration: 0.4,
        ease: "power2.out"
      })
      .to(modalRef.current, {
        scale: 1,
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "back.out(1.4)"
      }, "-=0.3");
    }
  }, []);

  // Close animation
  const handleClose = () => {
    if (modalRef.current && overlayRef.current) {
      const tl = gsap.timeline();
      
      tl.to(modalRef.current, {
        scale: 0.8,
        opacity: 0,
        y: 50,
        duration: 0.4,
        ease: "power2.in"
      })
      .to(overlayRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: "power2.out",
        onComplete: onClose
      }, "-=0.2");
    } else {
      onClose();
    }
  };

  return (
    <div 
      ref={overlayRef}
      className="fixed inset-0 bg-black/80 backdrop-blur-lg flex items-center justify-center p-4 z-50"
      style={{ opacity: 0 }}
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div 
        ref={modalRef}
        className="bg-gradient-to-br from-slate-900 to-black border border-cyan-400/20 max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        style={{ 
          transform: 'scale(0.8) translateY(50px)',
          opacity: 0 
        }}
      >
        {/* Header - Fixed */}
        <div className="border-b border-white/10 p-6 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-black text-cyan-400 uppercase tracking-wider">UPDATE PROJECT</h2>
              <p className="text-gray-400 mt-2">Edit project details and information</p>
            </div>
            <button
              onClick={handleClose}
              className="p-3 bg-black/50 backdrop-blur-lg text-white hover:bg-cyan-500 transition-colors duration-200 border border-cyan-400/20"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Message Alert */}
        {message.text && (
          <div className={`mx-6 mt-6 p-4 border flex-shrink-0 ${
            message.type === 'success' 
              ? 'bg-green-500/10 border-green-400/20 text-green-400' 
              : 'bg-red-500/10 border-red-400/20 text-red-400'
          } backdrop-blur-lg`}>
            {message.text}
          </div>
        )}

        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />

        {/* Form - Scrollable */}
        <form onSubmit={handleSubmitJSON} className="flex-1 overflow-y-auto">
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Project Title */}
                <div>
                  <label className="block text-sm font-bold text-cyan-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    PROJECT TITLE
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 focus:outline-none focus:border-cyan-400 transition-colors duration-200"
                    placeholder="Enter project title"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-bold text-cyan-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    CATEGORY
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 focus:outline-none focus:border-cyan-400 appearance-none"
                  >
                    <option value="">Select a category</option>
                    {categories.map(category => (
                      <option key={category} value={category} className="bg-slate-800">
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Technologies */}
                <div>
                  <label className="block text-sm font-bold text-cyan-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    TECHNOLOGIES (comma separated)
                  </label>
                  <input
                    type="text"
                    name="technologies"
                    value={formData.technologies}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 focus:outline-none focus:border-cyan-400 transition-colors duration-200"
                    placeholder="React, Node.js, MongoDB, etc."
                  />
                  <p className="text-gray-400 text-xs mt-2">
                    Separate multiple technologies with commas
                  </p>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Image Section */}
                <div>
                  <label className="block text-sm font-bold text-cyan-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Image className="w-4 h-4" />
                    PROJECT IMAGE
                  </label>
                  
                 

                  {/* File Upload Button */}
                  <button
                    type="button"
                    onClick={triggerFileInput}
                    className="w-full py-3 border border-dashed border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/10 transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    UPLOAD IMAGE FILE
                  </button>

                  {/* Image Preview */}
                  {imagePreview && (
                    <div className="mt-4">
                      <p className="text-gray-400 text-sm mb-2">Image Preview:</p>
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-32 object-cover border border-white/10"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextElementSibling.style.display = 'block';
                          }}
                        />
                        <div className="absolute inset-0 bg-gray-800 flex items-center justify-center text-gray-400 border border-white/10 hidden">
                          Invalid Image URL
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-bold text-cyan-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    DESCRIPTION
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows="6"
                    className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 focus:outline-none focus:border-cyan-400 transition-colors duration-200 resize-none"
                    placeholder="Enter project description..."
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons - Fixed at bottom */}
            <div className="flex gap-4 mt-8 pt-6 border-t border-white/10">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold uppercase tracking-wider hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {loading ? 'UPDATING...' : 'UPDATE PROJECT'}
                <Save className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="px-8 py-4 border border-cyan-400 text-cyan-400 font-bold uppercase tracking-wider hover:bg-cyan-400 hover:text-black transition-all duration-300"
              >
                CANCEL
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProject;