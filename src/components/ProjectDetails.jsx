import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Share2, 
  Copy, 
  Check, 
  Calendar, 
  Tag, 
  ExternalLink, 
  ZoomIn, 
  X, 
  Sparkles,
  Code,
  Palette,
  Globe,
  Smartphone,
  Database,
  Cpu
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [isImageHovered, setIsImageHovered] = useState(false);
  const [isImageZoomed, setIsImageZoomed] = useState(false);
  const [activeTech, setActiveTech] = useState(null);
   const API_URL = import.meta.env.VITE_BACKEND_URL;
  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/api/projects/${id}`);
        if (response.data.success) {
          setProject(response.data.data);
        } else {
          setError('Project not found');
        }
      } catch (err) {
        setError('Failed to load project');
        console.error('Error fetching project:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isImageZoomed) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isImageZoomed]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.keyCode === 27) setIsImageZoomed(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: project?.title,
          text: project?.description,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      handleCopyLink();
    }
  };

  const getTechnologies = (tech) => {
    if (!tech) return [];
    if (Array.isArray(tech)) return tech;
    if (typeof tech === 'string') {
      try {
        return JSON.parse(tech);
      } catch {
        return tech.split(',').map(t => t.trim());
      }
    }
    return [];
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Web Development': <Globe className="w-5 h-5" />,
      'Mobile App': <Smartphone className="w-5 h-5" />,
      'Design': <Palette className="w-5 h-5" />,
      'AI/ML': <Cpu className="w-5 h-5" />,
      'Database': <Database className="w-5 h-5" />,
      'default': <Code className="w-5 h-5" />
    };
    return icons[category] || icons.default;
  };

  const getSectionBorderColor = (section) => {
    const colors = {
      overview: 'border-white/30',
      technologies: 'border-white/30',
      details: 'border-white/30',
      actions: 'border-white/30'
    };
    return colors[section] || 'border-gray-400';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-200 via-black to-purple-900/30 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <div className="absolute inset-0 w-20 h-20 bg-cyan-500 rounded-full animate-ping opacity-20 mx-auto"></div>
          </div>
          <h3 className="text-xl font-bold text-white mt-6">LOADING PROJECT</h3>
          <p className="text-gray-400 mt-2">Unleashing creativity...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-purple-900/30 flex items-center justify-center">
        <div className="text-center">
          <div className="w-32 h-32 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <X className="w-16 h-16 text-red-400" />
          </div>
          <h1 className="text-4xl font-black text-white mb-4 bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
            Project Not Found
          </h1>
          <button
            onClick={() => navigate(-1)}
            className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold  hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105"
          >
            Return to Safety
          </button>
        </div>
      </div>
    );
  }

  const technologies = getTechnologies(project.technologies);

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <Helmet>
        <title>{project.title} | EL HACHIMI</title>
        <meta name="description" content={project.description} />
      </Helmet>

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-40 bg-black/60 backdrop-blur-xl border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:border-cyan-400/30  transition-all duration-300 group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="hidden sm:inline">Back to Projects</span>
            </button>

            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleShare}
                className="flex items-center gap-2 p-2 sm:px-4 sm:py-2 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400  hover:bg-cyan-500/20 transition-all duration-300"
              >
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">Share</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCopyLink}
                className="flex items-center gap-2 p-2 sm:px-4 sm:py-2 bg-cyan-400/10 border border-purple-500/20 text-cyan-400 hover:bg-purple-500/20 transition-all duration-300"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy Link'}</span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 relative z-10">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden mb-6 sm:mb-8 border rounded-3xl border-white/30 bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm"
        >
          <div 
            className={`relative w-full h-64 sm:h-96 md:h-[600px] transition-all duration-500 ${
              isImageHovered ? 'cursor-zoom-in' : 'cursor-default'
            }`}
            onMouseEnter={() => setIsImageHovered(true)}
            onMouseLeave={() => setIsImageHovered(false)}
            onClick={() => setIsImageZoomed(true)}
          >
            <img
              src={project.image_url}
              alt={project.title}
              className="w-full h-full object-contain bg-gradient-to-br from-gray-900 to-black"
              onError={(e) => {
                e.target.src = `https://via.placeholder.com/1200x600/1f2937/9ca3af?text=${encodeURIComponent(project.title)}`;
              }}
            />
            
            {/* Mobile-optimized Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
            
            {/* Project Name Overlay - Mobile Optimized */}
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
           {/*    <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl sm:text-4xl md:text-6xl font-black text-white text-center leading-tight"
              >
                {project.title}
              </motion.h1> */}
            </div>

            {/* Hover Overlay - Hidden on mobile */}
            {isImageHovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-black/40 hidden sm:flex items-center justify-center"
              >
                <div className="bg-black/70 backdrop-blur-sm rounded-2xl p-4 sm:p-6 flex items-center gap-3 border border-indigo-500">
                  <ZoomIn className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
                  <span className="text-white font-semibold text-sm sm:text-base">Click to explore</span>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Content Grid - Mobile First */}
        <div className="space-y-6 sm:space-y-8 lg:grid  lg:grid-cols-3 lg:gap-8 lg:space-y-0">
          {/* Main Content */}
          <div className="lg:col-span-2  space-y-6 sm:space-y-8">
            {/* Project Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className={`bg-black/40 backdrop-blur-lg rounded-3xl border ${getSectionBorderColor('overview')}   p-4 sm:p-6 md:p-8`}
            >
              <div className="flex items-center  gap-3 mb-4 sm:mb-6">
                <div className="p-2 bg-cyan-400/20 rounded-lg sm:">
                  <Code className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
                </div>
                <h2 className="text-xl sm:text-2xl md:text-3xl  font-black text-white heads">Project Overview</h2>
              </div>
              <p className="text-gray-300 texts text-base sm:text-lg leading-relaxed">
                {project.description}
              </p>
            </motion.div>

            {/* Technologies */}
            {technologies.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className={`bg-black/40 backdrop-blur-lg rounded-3xl border ${getSectionBorderColor('technologies')}   p-4 sm:p-6 md:p-8`}
              >
                <div className="flex items-center gap-3 mb-4 sm:mb-6">
                  <div className="p-2 bg-cyan-500/20 rounded-lg sm:">
                    <Tag className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
                  </div>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white heads">Technology Stack</h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                  {technologies.map((tech, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.05, y: -2 }}
                      className={`p-3 sm:p-4 texts  sm:rounded-2xl  backdrop-blur-sm cursor-pointer transition-all duration-300 ${
                        activeTech === index 
                          ? 'bg-cyan-500/20 border-cyan-400 shadow-lg shadow-cyan-500/20' 
                          : 'bg-white/5 border-cyan-400/30 hover:border-cyan-400'
                      }`}
                      onMouseEnter={() => setActiveTech(index)}
                      onMouseLeave={() => setActiveTech(null)}
                    >
                      <div className="text-center">
                        <div className={`text-xs sm:text-sm font-bold ${
                          activeTech === index ? 'text-cyan-300' : 'text-gray-300'
                        }`}>
                          {tech}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar - Mobile Optimized */}
          <div className="space-y-4 sm:space-y-6">
            {/* Project Details Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className={`bg-black/40 backdrop-blur-lg rounded-3xl border ${getSectionBorderColor('details')}   p-4 sm:p-6`}
            >
              <h3 className="text-lg sm:text-xl font-black text-white mb-4 sm:mb-6 flex items-center gap-2">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
                Project Details
              </h3>
              <div className="space-y-3 sm:space-y-4">
                <div className="p-3 sm:p-4 bg-white/5  sm:rounded-2xl border border-white/10">
                  <p className="text-white text-xs sm:text-sm font-bold uppercase tracking-wider mb-1 heads">Category</p>
                  <p className="text-white   text-sm sm:text-base flex items-center texts gap-2" style={{fontSize:"2vh",marginTop:"-6px"}}>
                    {getCategoryIcon(project.category)}
                    {project.category}
                  </p>
                </div>
                <div className="p-3 sm:p-4 bg-white/5  sm:rounded-2xl border border-white/10">
                  <p className="text-white text-xs sm:text-sm font-bold uppercase tracking-wider heads mb-1" >Created</p>
                  <p className="text-white  font-light sm:text-base" style={{fontSize:"2vh",marginTop:"-6px"}}>
                    {new Date(project.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="p-3 sm:p-4 bg-white/5  sm:rounded-2xl border border-white/10">
                  <p className="text-white text-xs sm:text-sm font-bold uppercase tracking-wider mb-1 heads">Last Updated</p>
                  <p className="text-white  texts text-sm sm:text-base " style={{fontSize:"2vh",marginTop:"-6px"}}>
                    {new Date(project.updated_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Action Buttons - Removed Download */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 }}
              className={`bg-black/40 backdrop-blur-lg rounded-3xl border ${getSectionBorderColor('actions')}   p-4 sm:p-6`}
            >
              <h3 className="text-lg sm:text-xl font-black text-white mb-4 sm:mb-6 heads">Quick Actions</h3>
              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleShare}
                  className="w-full flex heads items-center justify-center gap-3 px-4 py-3 sm:px-6 sm:py-4 bg-cyan-400  sm:rounded-2xl hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 shadow-lg shadow-cyan-500/25 text-sm sm:text-base"
                >
                  <Share2 className="w-4 h-4 sm:w-5 sm:h-5 heads" />
                  Share Project
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCopyLink}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 sm:px-6 sm:py-4 bg-white/5 border border-white/10 text-white font-bold  sm:rounded-2xl hover:bg-white/10 transition-all duration-300 text-sm sm:text-base"
                >
                  {copied ? <Check className="w-4 h-4 sm:w-5 sm:h-5" /> : <Copy className="w-4 h-4 sm:w-5 sm:h-5" />}
                  {copied ? 'Link Copied!' : 'Copy Project Link'}
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Zoomed Image Modal - Mobile Optimized */}
      <AnimatePresence>
        {isImageZoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl p-2 sm:p-4"
            onClick={() => setIsImageZoomed(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative max-w-full max-h-full w-full h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsImageZoomed(false)}
                className="absolute top-4 right-4 z-10 p-3 bg-black/70 backdrop-blur-sm   border-white/20 text-white hover:text-cyan-400 transition-colors"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              
              <div className="max-h-[90vh] max-w-[90vw] overflow-auto   border-1 border-gray-500 bg-black/50 backdrop-blur-sm">
                <img
                  src={project.image_url}
                  alt={project.title}
                  className="w-full h-auto object-contain"
                  onError={(e) => {
                    e.target.src = `https://via.placeholder.com/1200x600/1f2937/9ca3af?text=${encodeURIComponent(project.title)}`;
                  }}
                />
              </div>
              
              <div className="absolute bottom-4 left-4 right-4 flex flex-col sm:flex-row justify-between items-center gap-2">
                <span className="text-white text-sm bg-black/70 backdrop-blur-sm px-3 py-2 rounded-full border border-white/20 text-center w-full sm:w-auto">
                  {project.title}
                </span>
                <span className="text-white text-xs bg-black/70 backdrop-blur-sm px-3 py-2 rounded-full border border-white/20 text-center w-full sm:w-auto">
                  Press ESC or tap outside to close
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectDetails