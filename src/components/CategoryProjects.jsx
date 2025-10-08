import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import logo from "../assets/images/logo.png"
import { 
  Search, 
  Filter, 
  X, 
  Calendar, 
  Code, 
  Eye, 
  ArrowRight,
  Sparkles,
  Zap,
  ExternalLink,
  Grid3X3,
  List,
  Trophy,
  Target,
  Pin,
  PinOff
} from 'lucide-react';
import { motion } from 'framer-motion';
import Navbar from './Navbar';
import DarkVeil from './DarkVeil';

function CategoryProjects() {
  const category = useParams();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');
  
  const API_URL = import.meta.env.VITE_BACKEND_URL;

  // Check if current category is logo
  const isLogoCategory = category.category?.toLowerCase() === 'logo';

  // Calculate pin ranking for pinned projects within each section
  const getPinnedProjectsWithRanking = (projectsList) => {
    const pinnedProjects = projectsList.filter(project => project.is_pinned);
    
    // Sort pinned projects by pin_order if available, otherwise by creation date
    return pinnedProjects.sort((a, b) => {
      if (a.pin_order !== undefined && b.pin_order !== undefined) {
        return a.pin_order - b.pin_order;
      }
      return new Date(a.created_at) - new Date(b.created_at);
    }).map((project, index) => ({
      ...project,
      pinNumber: index + 1
    }));
  };

  // Organize projects by type with pinned projects integrated
  const getOrganizedProjects = (projectsList) => {
    // Separate by type first
    const regularProjects = projectsList.filter(project => project.is_sport != 1);
    const sportsProjects = projectsList.filter(project => project.is_sport == 1);
    
    // Get pinned projects for each section
    const pinnedRegular = getPinnedProjectsWithRanking(regularProjects);
    const pinnedSports = getPinnedProjectsWithRanking(sportsProjects);
    
    // Get non-pinned projects for each section
    const nonPinnedRegular = regularProjects.filter(project => !project.is_pinned);
    const nonPinnedSports = sportsProjects.filter(project => !project.is_pinned);
    
    // Combine pinned first, then non-pinned for each section
    return {
      regular: [...pinnedRegular, ...nonPinnedRegular],
      sports: [...pinnedSports, ...nonPinnedSports]
    };
  };

  // Filter and sort projects
  useEffect(() => {
    let filtered = [...projects];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.technologies?.some(tech => 
          typeof tech === 'string' && tech.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    setFilteredProjects(filtered);
  }, [searchTerm, projects]);

  // Get organized projects for display
  const organizedProjects = getOrganizedProjects(filteredProjects);
  const hasRegularProjects = organizedProjects.regular.length > 0;
  const hasSportsProjects = organizedProjects.sports.length > 0;

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/api/projects/category/${category.category}`);
        const projectsData = response.data.data;
        
        setProjects(projectsData);
        setFilteredProjects(projectsData);
      } catch (error) {
        console.log("the error is: " + error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [category.category]);

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

  // Get project accent color based on category
  const getCategoryColor = (category) => {
    const colors = {
      'social-media': 'from-blue-500 to-cyan-500',
      'logo': 'from-green-500 to-emerald-500',
      'default': 'from-cyan-500 to-blue-500'
    };
    return colors[category] || colors.default;
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
  };

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Project Card Component (Grid View)
  const ProjectCard = ({ project, index, isSports = false }) => {
    const projectTechnologies = getTechnologies(project);
    const categoryColor = getCategoryColor(project.category);
    const [loaded, setLoaded] = useState(false);
    
    return (
  <motion.div
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, delay: index * 0.1 }}
  className="group relative bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-lg transition-all duration-500 overflow-hidden h-full flex flex-col"
  style={{
    borderWidth: '2px',
    borderStyle: 'solid',
    borderImage: 'linear-gradient(to bottom, rgba(255,255,255,0.8), rgba(128,128,128,0.3), transparent) 1',
    borderImageSlice: 1
  }}
>

    

    

        {/* Project Image Container */}
        <Link
          to={`/projects/project/${project.id}`}
          className="relative overflow-hidden bg-gray-800 block flex-1"
          style={{
            width: "100%",
            height: "400px",
            aspectRatio: "1080/1440",
          }}
        >
          {/* Placeholder (cover) while image loading */}
          {!loaded && (
            <div className="absolute inset-0 bg-gray-700 animate-pulse flex items-center justify-center text-gray-400 text-sm">
              <img src={logo} alt="" />
            </div>
          )}

          {/* Actual image */}
          <img
            src={project.image_url}
            alt={project.title}
            loading="lazy"
            onLoad={() => setLoaded(true)}
            onError={(e) => {
              e.target.src = `https://via.placeholder.com/1080x1440/0f172a/1e293b?text=${encodeURIComponent(
                project.title
              )}`;
            }}
            className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${
              loaded ? "opacity-100" : "opacity-0"
            }`}
          />

        </Link>

      

     
      </motion.div>
    );
  };

  // Project List Item Component (List View)
  const ProjectListItem = ({ project, index, isSports = false }) => {
    const projectTechnologies = getTechnologies(project);
    const categoryColor = getCategoryColor(project.category);
    
    return (
      <motion.div
        key={project.id}
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        className={`group bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-lg border transition-all duration-500 overflow-hidden `}
        style={{
          borderWidth: '2px',
          borderStyle: 'solid',
          borderImage: 'linear-gradient(to bottom, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 90%, rgba(255,255,255,0) 100%) 1'
        }}
      >
        <div className="flex flex-col md:flex-row">
          {/* Image - Direct Link */}
          <Link 
            to={`/projects/project/${project.id}`}
            className="md:w-80 relative flex-shrink-0 block"
            style={{ 
              width: '100%', 
              height: '300px',
              aspectRatio: '1080/1440'
            }}
          >
            <img
              src={project.image_url}
              alt={project.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = `https://via.placeholder.com/1080x1440/0f172a/1e293b?text=${encodeURIComponent(project.title)}`;
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent md:bg-gradient-to-l" />
            
         

          

            {/* Date Badge */}
            <div className="absolute bottom-4 left-4">
              <span className="px-2 py-1 bg-black/50 backdrop-blur-sm text-gray-300 text-xs border border-white/10">
                {formatDate(project.created_at)}
              </span>
            </div>

            {/* Hover Overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40">
              <div className="bg-black/60 backdrop-blur-sm rounded-full p-4">
                <ExternalLink className="w-6 h-6 text-white" />
              </div>
            </div>
          </Link>

     
        </div>
      </motion.div>
    );
  };

  // Loading animation component
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 to-blue-900">
        <div className="absolute inset-0 z-0">
          <DarkVeil />
        </div>
        <motion.div
          className='w-24 h-24'
          animate={{
            rotateY: 360,
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            transformStyle: "preserve-3d",
          }}
        >
          <img src={logo} alt="Loading..." className="w-full h-full" />
        </motion.div>
      </div>
    );
  }

  // Special render for logo category
  if (isLogoCategory) {
    return (
      <div className="min-h-screen bg-black">
        <Navbar />
        
        <div className="p-4 pt-24">
          {/* Header */}
          <div className="max-w-7xl mx-auto mb-8">
            <div className="text-center mb-8">
              <h1 className="text-6xl font-black text-white mb-4 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent uppercase">
                Logo Designs
              </h1>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Explore our collection of professionally crafted logos with their original dimensions
              </p>
            </div>

            {/* Control Panel - Simplified for logos */}
            <div className="bg-black/40 backdrop-blur-lg border border-white/10 p-6 mb-8">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-cyan-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search logos..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-80 pl-12 pr-4 py-4 bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:bg-white/10 transition-all duration-300"
                    />
                  </div>
                </div>

                {/* Results Count */}
                <div className="text-cyan-400 font-medium">
                  {filteredProjects.length} LOGOS DISPLAYED
                </div>
              </div>
            </div>
          </div>

          {/* Logo Grid Layout */}
          <div className="max-w-7xl mx-auto">
            {filteredProjects.length === 0 ? (
              <div className="text-center py-24">
                <div className="text-cyan-400 mb-6">
                  <Search className="w-20 h-20 mx-auto opacity-50" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">NO LOGOS FOUND</h3>
                <p className="text-gray-400 max-w-md mx-auto">
                  {searchTerm ? 'Try adjusting your search criteria' : 'No logos found in this category'}
                </p>
                {searchTerm && (
                  <button 
                    onClick={clearFilters}
                    className="mt-6 px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold uppercase tracking-wider hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105"
                  >
                    CLEAR SEARCH
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-3 gap-8">
                {filteredProjects.map((logo, index) => (
                  <motion.div
                    key={logo.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ 
                      duration: 0.6, 
                      delay: index * 0.1,
                      type: "spring",
                      stiffness: 100
                    }}
                    whileHover={{ 
                      scale: 1.05,
                      transition: { duration: 0.2 }
                    }}
                    className="group relative"
                  >
                    {/* Logo Container */}
                    <Link 
                      to={`/projects/project/${logo.id}`}
                      className={`block backdrop-blur-lg border transition-all duration-500 overflow-hidden rounded-lg p-6 hover:bg-white/10 ${
                        logo.is_pinned
                          ? 'bg-white/5 border-yellow-400/30 hover:border-yellow-400/50'
                          : 'bg-white/5 border-white/10 hover:border-cyan-400/30'
                      }`}
                    >
                      {/* Logo Image - Maintains original dimensions */}
                      <div className="relative flex items-center justify-center min-h-[120px]">
                        <img
                          src={logo.image_url}
                          alt={logo.title}
                          className="max-w-full max-h-32 object-contain transition-all duration-500 group-hover:scale-110"
                          style={{
                            width: 'auto',
                            height: 'auto'
                          }}
                          onError={(e) => {
                            e.target.src = logo;
                          }}
                        />
                        
                        {/* Hover Overlay */}
                        <div className={`absolute inset-0 transition-all duration-300 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 ${
                          logo.is_pinned ? 'bg-yellow-400/5' : 'bg-cyan-400/5'
                        }`}>
                        </div>
                      </div>
                    </Link>

                    {/* Logo Title - Minimal */}
                    <div className="mt-3 text-center">
                      <h3 className="text-sm font-medium text-white truncate">
                        {logo.title}
                      </h3>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Main render for social media category with two sections
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black">
      <Navbar />
      
      <div className="p-4 pt-24">
        {/* Header */}
        <div className="max-w-7xl mx-auto mb-8">
          <div className="text-center mb-8">
            <h1 className="text-6xl font-black text-white mb-4 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent uppercase">
              {category.category} Projects
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Explore our curated collection of {category.category.toLowerCase()} projects built with cutting-edge technologies
            </p>
          </div>

          {/* Control Panel */}
          <div className="bg-black/40 backdrop-blur-lg border border-white/10 p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
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

              {/* Sort */}
              <div className="relative">
                <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-cyan-400 w-5 h-5" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-400 focus:bg-white/10 appearance-none"
                >
                  <option className='bg-slate-800' value="newest">Newest First</option>
                  <option className='bg-slate-800' value="oldest">Oldest First</option>
                  <option className='bg-slate-800' value="title">Sort by Title</option>
                </select>
              </div>

              {/* View Mode Toggle */}
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`flex-1 px-4 py-4 border transition-all duration-300 flex items-center justify-center gap-2 ${
                    viewMode === 'grid' 
                      ? 'border-cyan-400 bg-cyan-400/10 text-cyan-400' 
                      : 'border-white/10 bg-white/5 text-gray-400 hover:border-cyan-400/50'
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`flex-1 px-4 py-4 border transition-all duration-300 flex items-center justify-center gap-2 ${
                    viewMode === 'list' 
                      ? 'border-cyan-400 bg-cyan-400/10 text-cyan-400' 
                      : 'border-white/10 bg-white/5 text-gray-400 hover:border-cyan-400/50'
                  }`}
                >
                  <List className="w-4 h-4" />
                  List
                </button>
              </div>
            </div>

            {/* Results Count */}
            <div className="mt-4 flex justify-between items-center">
              <span className="text-white texts font-medium">
                {filteredProjects.length} PROJECTS DISPLAYED • Sorted by {
                  sortBy === 'newest' ? 'Newest First' : 
                  sortBy === 'oldest' ? 'Oldest First' : 
                  'Title'
                } • View: {viewMode === 'grid' ? 'Grid' : 'List'}
              </span>
              {(searchTerm) && (
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

        {/* Two Main Sections: Regular Projects and Sports Projects */}
        <div className="max-w-7xl mx-auto">
          {filteredProjects.length === 0 ? (
            <div className="text-center py-24">
              <div className="text-cyan-400 mb-6">
                <Search className="w-20 h-20 mx-auto opacity-50" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">NO PROJECTS FOUND</h3>
              <p className="text-gray-400 max-w-md mx-auto">
                {searchTerm ? 'Try adjusting your search criteria' : `No projects found in ${category.category} category`}
              </p>
              {searchTerm && (
                <button 
                  onClick={clearFilters}
                  className="mt-6 px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold uppercase tracking-wider hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105"
                >
                  CLEAR SEARCH
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-16">
              
              {/* SPORTS DESIGN PROJECTS SECTION */}
              {hasSportsProjects && (
                <motion.section
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="space-y-8"
                >
                 

                  {/* Projects Display - Grid or List based on viewMode */}
                  {viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                      {organizedProjects.sports.map((project, index) => (
                        <ProjectCard 
                          key={project.id} 
                          project={project} 
                          index={index} 
                          isSports={true}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {organizedProjects.sports.map((project, index) => (
                        <ProjectListItem 
                          key={project.id} 
                          project={project} 
                          index={index} 
                          isSports={true}
                        />
                      ))}
                    </div>
                  )}
                </motion.section>
              )}
              {/* REGULAR SOCIAL MEDIA PROJECTS SECTION */}
              {hasRegularProjects && (
                <motion.section
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="space-y-8"
                >
               

                  {/* Projects Display - Grid or List based on viewMode */}
                  {viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                      {organizedProjects.regular.map((project, index) => (
                        <ProjectCard 
                          key={project.id} 
                          project={project} 
                          index={index} 
                          isSports={false}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {organizedProjects.regular.map((project, index) => (
                        <ProjectListItem 
                          key={project.id} 
                          project={project} 
                          index={index} 
                          isSports={false}
                        />
                      ))}
                    </div>
                  )}
                </motion.section>
              )}

            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CategoryProjects;