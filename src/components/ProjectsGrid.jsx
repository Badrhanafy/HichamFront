import React, { useState, useRef, useEffect } from 'react';
import { 
  ExternalLink, 
  Code, 
  Calendar, 
  Tag, 
  ChevronDown, 
  ChevronUp,
  Search,
  Filter,
  X,
  Eye,
  GitBranch,
  Sparkles,
  Zap,
  Layers,
  ArrowRight,
  Edit3,
  Trash2
} from 'lucide-react';
import { gsap } from 'gsap';
import UpdateProject from './UpdateProject';

const ProjectsGrid = ({ projects, onProjectUpdate, onProjectDelete }) => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [updateProject, setUpdateProject] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const [viewMode, setViewMode] = useState('grid');

  // Refs for animation
  const modalRef = useRef(null);
  const overlayRef = useRef(null);
  const imageRef = useRef(null);
  const contentRef = useRef(null);

  // Get current user from localStorage
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = currentUser.role === 'admin';

  // Helper function to safely parse technologies
  const getTechnologies = (project) => {
    if (!project.technologies) return [];
    
    if (Array.isArray(project.technologies)) {
      return project.technologies;
    }
    
    if (typeof project.technologies === 'string') {
      try {
        return JSON.parse(project.technologies);
      } catch (error) {
        console.error('Error parsing technologies:', error);
        return [];
      }
    }
    
    return [];
  };

  // Extract unique categories
  const categories = ['all', ...new Set(projects.map(project => project.category))];

  // Filter and sort projects
  const filteredProjects = projects
    .filter(project => {
      const projectTechnologies = getTechnologies(project);
      const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           projectTechnologies.some(tech => 
                             tech.toLowerCase().includes(searchTerm.toLowerCase())
                           );
      const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at) - new Date(a.created_at);
        case 'oldest':
          return new Date(a.created_at) - new Date(b.created_at);
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

  // Toggle description expansion
  const toggleDescription = (projectId) => {
    setExpandedDescriptions(prev => ({
      ...prev,
      [projectId]: !prev[projectId]
    }));
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
  };

  // Get project accent color based on category
  const getCategoryColor = (category) => {
    const colors = {
      'Web Development': 'from-blue-500 to-cyan-500',
      'Mobile App': 'from-green-500 to-emerald-500',
      'Design': 'from-purple-500 to-pink-500',
      'AI/ML': 'from-orange-500 to-red-500',
      'Blockchain': 'from-indigo-500 to-purple-500',
      'default': 'from-gray-500 to-slate-500'
    };
    return colors[category] || colors.default;
  };

  // Handle project deletion
  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/api/projects/${projectId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        onProjectDelete(projectId);
        // Show success message
        alert('Project deleted successfully!');
      } else {
        throw new Error('Failed to delete project');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Failed to delete project');
    }
  };

  // Open modal with animation
  const openModal = (project) => {
    setSelectedProject(project);
    
    setTimeout(() => {
      if (modalRef.current && overlayRef.current && imageRef.current && contentRef.current) {
        const tl = gsap.timeline();
        
        // Reset initial states
        gsap.set(overlayRef.current, { opacity: 0 });
        gsap.set(modalRef.current, { 
          scale: 0.8, 
          opacity: 0,
          rotationY: 15,
          transformOrigin: "center center"
        });
        gsap.set(imageRef.current, { scale: 1.2, opacity: 0, y: 50 });
        gsap.set(contentRef.current, { y: 100, opacity: 0 });
        
        // Animation sequence
        tl.to(overlayRef.current, {
          opacity: 1,
          duration: 0.4,
          ease: "power2.out"
        })
        .to(modalRef.current, {
          scale: 1,
          opacity: 1,
          rotationY: 0,
          duration: 0.6,
          ease: "back.out(1.4)",
        }, "-=0.3")
        .to(imageRef.current, {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out"
        }, "-=0.4")
        .to(contentRef.current, {
          y: 0,
          opacity: 1,
          duration: 0.5,
          ease: "power2.out",
          stagger: 0.1
        }, "-=0.3");
      }
    }, 10);
  };

  // Close modal with animation
  const closeModal = () => {
    if (modalRef.current && overlayRef.current) {
      const tl = gsap.timeline();
      
      tl.to(contentRef.current, {
        y: 100,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in"
      })
      .to(imageRef.current, {
        scale: 1.2,
        opacity: 0,
        y: 50,
        duration: 0.3,
        ease: "power2.in"
      }, "-=0.2")
      .to(modalRef.current, {
        scale: 0.8,
        opacity: 0,
        rotationY: -15,
        duration: 0.4,
        ease: "power2.in"
      }, "-=0.2")
      .to(overlayRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: "power2.out",
        onComplete: () => {
          setSelectedProject(null);
        }
      }, "-=0.2");
    } else {
      setSelectedProject(null);
    }
  };

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.keyCode === 27 && selectedProject) {
        closeModal();
      }
    };

    if (selectedProject) {
      document.addEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'unset';
    };
  }, [selectedProject]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black p-4">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4 px-6 py-3 bg-white/5 backdrop-blur-lg border border-white/10">
            <Sparkles className="w-6 h-6 text-cyan-400" />
            <span className="text-cyan-400 font-medium text-sm uppercase tracking-wider">Project Portfolio</span>
            {isAdmin && (
              <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs font-bold uppercase tracking-wider border border-red-500/30">
                ADMIN MODE
              </span>
            )}
          </div>
          <h1 className="text-6xl font-black text-white mb-4 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            DIGITAL CREATIONS
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Cutting-edge projects built with modern technologies and innovative solutions
          </p>
        </div>

        {/* Control Panel */}
        <div className="bg-black/40 backdrop-blur-lg border border-white/10 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Search */}
            <div className="md:col-span-2 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-cyan-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search projects, technologies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:bg-white/10 transition-all duration-300"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-cyan-400 w-5 h-5" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-400 focus:bg-white/10 appearance-none"
              >
                {categories.map(category => (
                  <option className='bg-slate-800' key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-4 bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-400 focus:bg-white/10"
            >
              <option className='bg-slate-800' value="newest">Newest First</option>
              <option className='bg-slate-800' value="oldest">Oldest First</option>
              <option className='bg-slate-800' value="title">Sort by Title</option>
            </select>
          </div>

          {/* Results Count */}
          <div className="mt-4 flex justify-between items-center">
            <span className="text-cyan-400 font-medium">
              {filteredProjects.length} PROJECTS DISPLAYED
            </span>
            {(searchTerm || selectedCategory !== 'all') && (
              <button
                onClick={clearFilters}
                className="text-gray-400 hover:text-white text-sm font-medium flex items-center gap-2 transition-colors duration-200"
              >
                <X className="w-4 h-4" />
                CLEAR FILTERS
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="max-w-7xl mx-auto">
        {filteredProjects.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-cyan-400 mb-6">
              <Search className="w-20 h-20 mx-auto opacity-50" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">NO PROJECTS FOUND</h3>
            <p className="text-gray-400 max-w-md mx-auto">
              Try adjusting your search criteria or browse all categories
            </p>
          </div>
        ) : (
          <div className={`grid gap-6 ${
            viewMode === 'masonry' 
              ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3 auto-rows-[400px]' 
              : 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3'
          }`}>
            {filteredProjects.map((project, index) => {
              const projectTechnologies = getTechnologies(project);
              const categoryColor = getCategoryColor(project.category);
              
              return (
                <div
                  key={project.id}
                  className="group relative bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-lg border border-white/10 hover:border-cyan-400/30 transition-all duration-500 overflow-hidden"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: 'fadeInUp 0.6s ease-out forwards'
                  }}
                >
                  {/* Background Glow Effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${categoryColor} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                  
                  {/* Project Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={project.image_url}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      onError={(e) => {
                        e.target.src = `https://via.placeholder.com/800x400/0f172a/1e293b?text=${encodeURIComponent(project.title)}`;
                      }}
                    />
                    
                    {/* Image Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                    
                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1 bg-gradient-to-r ${categoryColor} text-white text-xs font-bold uppercase tracking-wider`}>
                        {project.category}
                      </span>
                    </div>

                    {/* Quick Actions */}
                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                      <button
                        onClick={() => openModal(project)}
                        className="p-2 bg-black/50 backdrop-blur-sm text-white hover:bg-cyan-500 transition-colors duration-200"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {isAdmin && (
                        <>
                          <button
                            onClick={() => setUpdateProject(project)}
                            className="p-2 bg-black/50 backdrop-blur-sm text-white hover:bg-blue-500 transition-colors duration-200"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProject(project.id)}
                            className="p-2 bg-black/50 backdrop-blur-sm text-white hover:bg-red-500 transition-colors duration-200"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>

                    {/* Project Title Overlay */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-xl font-black text-white mb-2 line-clamp-2">
                        {project.title}
                      </h3>
                      <div className="flex items-center gap-3 text-xs text-gray-300">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(project.created_at).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Code className="w-3 h-3" />
                          {projectTechnologies.length} tech
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Project Content */}
                  <div className="p-6">
                    {/* Description */}
                    <div className="mb-4">
                      <p className={`text-gray-400 text-sm leading-relaxed ${
                        expandedDescriptions[project.id] ? '' : 'line-clamp-2'
                      }`}>
                        {project.description}
                      </p>
                      {project.description.length > 100 && (
                        <button
                          onClick={() => toggleDescription(project.id)}
                          className="text-cyan-400 hover:text-cyan-300 text-xs font-medium mt-2 flex items-center gap-1 transition-colors duration-200"
                        >
                          {expandedDescriptions[project.id] ? (
                            <>
                              SHOW LESS <ChevronUp className="w-3 h-3" />
                            </>
                          ) : (
                            <>
                              READ MORE <ChevronDown className="w-3 h-3" />
                            </>
                          )}
                        </button>
                      )}
                    </div>

                    {/* Technologies */}
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Zap className="w-4 h-4 text-cyan-400" />
                        <span className="text-sm font-bold text-cyan-400 uppercase tracking-wider">Tech Stack</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {projectTechnologies.slice(0, 3).map((tech, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-white/5 text-cyan-300 text-xs font-medium border border-cyan-400/20 backdrop-blur-sm"
                          >
                            {tech}
                          </span>
                        ))}
                        {projectTechnologies.length > 3 && (
                          <span className="px-3 py-1 bg-white/5 text-gray-400 text-xs border border-white/10">
                            +{projectTechnologies.length - 3}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => openModal(project)}
                        className="flex-1 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold text-sm uppercase tracking-wider hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-2 group/btn"
                      >
                        EXPLORE PROJECT
                        <ArrowRight className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform duration-200" />
                      </button>
                      {isAdmin && (
                        <button
                          onClick={() => setUpdateProject(project)}
                          className="px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold text-sm uppercase tracking-wider hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 transform hover:scale-[1.02]"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Hover Border Effect */}
                  <div className="absolute inset-0 border-2 border-transparent group-hover:border-cyan-400/20 transition-all duration-500 pointer-events-none" />
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Project Modal */}
      {selectedProject && (
        <div 
          ref={overlayRef}
          className="fixed inset-0 bg-black/80 backdrop-blur-lg flex items-center justify-center p-4 z-50"
          style={{ opacity: 0 }}
          onClick={(e) => e.target === e.currentTarget && closeModal()}
        >
          <div 
            ref={modalRef}
            className="bg-gradient-to-br from-slate-900 to-black border border-cyan-400/20 max-w-6xl w-full max-h-[95vh] overflow-hidden relative"
            style={{ 
              transform: 'scale(0.8) rotateY(15deg)',
              opacity: 0 
            }}
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 p-3 bg-black/50 backdrop-blur-lg text-white hover:bg-cyan-500 transition-colors duration-200 border border-cyan-400/20 hover:scale-110 transform transition-transform duration-200"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
              {/* Image Section */}
              <div className="relative h-80 lg:h-full">
                <div 
                  ref={imageRef}
                  className="w-full h-full relative"
                  style={{
                    transform: 'scale(1.2) translateY(50px)',
                    opacity: 0
                  }}
                >
                  <img
                    src={selectedProject.image_url}
                    alt={selectedProject.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = `https://via.placeholder.com/1200x800/0f172a/1e293b?text=${encodeURIComponent(selectedProject.title)}`;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                  
                  {/* Project Info Overlay */}
                  <div className="absolute bottom-6 left-6 right-6">
                    <h2 className="text-4xl font-black text-white mb-3">
                      {selectedProject.title}
                    </h2>
                    <div className="flex items-center gap-4">
                      <span className={`px-4 py-2 bg-gradient-to-r ${getCategoryColor(selectedProject.category)} text-white font-bold text-sm uppercase tracking-wider`}>
                        {selectedProject.category}
                      </span>
                      <span className="text-cyan-400 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date(selectedProject.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content Section */}
              <div 
                ref={contentRef}
                className="p-8 overflow-y-auto"
                style={{
                  transform: 'translateY(100px)',
                  opacity: 0
                }}
              >
                <div className="space-y-6">
                  {/* Description */}
                  <div>
                    <h3 className="text-xl font-bold text-cyan-400 mb-3 uppercase tracking-wider">PROJECT OVERVIEW</h3>
                    <p className="text-gray-300 leading-relaxed text-lg">
                      {selectedProject.description}
                    </p>
                  </div>

                  {/* Technologies */}
                  <div>
                    <h3 className="text-xl font-bold text-cyan-400 mb-4 uppercase tracking-wider">TECHNOLOGY STACK</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {getTechnologies(selectedProject).map((tech, index) => (
                        <div
                          key={index}
                          className="p-4 bg-white/5 border border-cyan-400/20 text-cyan-300 text-center font-medium hover:bg-cyan-500/10 transition-colors duration-200 transform hover:scale-105"
                          style={{
                            animationDelay: `${index * 100}ms`
                          }}
                        >
                          {tech}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 pt-6">
                    <button className="flex-1 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold uppercase tracking-wider hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105">
                      VIEW LIVE DEMO
                    </button>
                    <button className="px-6 py-4 border border-cyan-400 text-cyan-400 font-bold uppercase tracking-wider hover:bg-cyan-400 hover:text-black transition-all duration-300 transform hover:scale-105">
                      SOURCE CODE
                    </button>
                    {isAdmin && (
                      <button 
                        onClick={() => {
                          setUpdateProject(selectedProject);
                          closeModal();
                        }}
                        className="px-6 py-4 border border-blue-400 text-blue-400 font-bold uppercase tracking-wider hover:bg-blue-400 hover:text-black transition-all duration-300 transform hover:scale-105"
                      >
                        EDIT PROJECT
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Update Project Modal */}
      {updateProject && (
        <UpdateProject
          project={updateProject}
          onClose={() => setUpdateProject(null)}
          onUpdate={onProjectUpdate}
        />
      )}

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default ProjectsGrid;