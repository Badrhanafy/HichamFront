import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
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
  Target
} from 'lucide-react';
import { motion } from 'framer-motion';
import Navbar from './Navbar';

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

  // Separate sports projects from regular projects
  const sportsProjects = projects.filter(project => project.is_sport === 1);
  const regularProjects = projects.filter(project => project.is_sport !== 1);
  
  // Filter sports and regular projects separately
  const filteredSportsProjects = sportsProjects.filter(project =>
    project.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.technologies?.some(tech => 
      typeof tech === 'string' && tech.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const filteredRegularProjects = regularProjects.filter(project =>
    project.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.technologies?.some(tech => 
      typeof tech === 'string' && tech.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

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

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at) - new Date(a.created_at);
        case 'oldest':
          return new Date(a.created_at) - new Date(b.created_at);
        case 'title':
          return a.title?.localeCompare(b.title);
        default:
          return 0;
      }
    });

    setFilteredProjects(filtered);
  }, [searchTerm, projects, sortBy]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/api/projects/category/${category.category}`);
        const projectsData = response.data.data;
        
        // Sort by newest first by default
        const sortedProjects = projectsData.sort((a, b) => 
          new Date(b.created_at) - new Date(a.created_at)
        );
        
        setProjects(sortedProjects);
        setFilteredProjects(sortedProjects);
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
      'Web Development': 'from-blue-500 to-cyan-500',
      'Mobile App': 'from-green-500 to-emerald-500',
      'Design': 'from-purple-500 to-pink-500',
      'AI/ML': 'from-orange-500 to-red-500',
      'Blockchain': 'from-indigo-500 to-purple-500',
      'default': 'from-gray-500 to-slate-500'
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

  // Project Card Component
  const ProjectCard = ({ project, index, isSports = false }) => {
    const projectTechnologies = getTechnologies(project);
    const categoryColor = getCategoryColor(project.category);
    
    return (
      <motion.div
        key={project.id}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        className={`group relative heads bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-lg border transition-all duration-500 overflow-hidden h-full flex flex-col ${
          isSports 
            ? 'border-cyan-400/30 hover:border-cyan-400/50' 
            : 'border-white/10 hover:border-cyan-400/30'
        }`}
      >
        {/* Sports Project Badge */}
        {isSports && (
          <div className="absolute top-4 left-4 z-10">
          
          </div>
        )}

        {/* Background Glow Effect */}
        <div className={`absolute inset-0 bg-gradient-to-br ${
          isSports ? 'from-orange-500 to-red-500' : categoryColor
        } opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
        
        {/* Project Image Container - Direct Link */}
        <Link 
          to={`/projects/project/${project.id}`}
          className="relative overflow-hidden bg-gray-800 block flex-1"
          style={{ 
            width: '100%', 
            height: '400px',
            aspectRatio: '1080/1440'
          }}
        >
          <img
            src={project.image_url}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            onError={(e) => {
              e.target.src = `https://via.placeholder.com/1080x1440/0f172a/1e293b?text=${encodeURIComponent(project.title)}`;
            }}
          />
        </Link>

   

        {/* Hover Border Effect */}
        <div className={`absolute inset-0 border-2 border-transparent group-hover:border-${
          isSports ? 'orange-400/20' : 'cyan-400/20'
        } transition-all duration-500 pointer-events-none`} />
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            {/* Animated Spinner */}
            <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            {/* Pulsing Glow Effect */}
            <div className="absolute inset-0 w-16 h-16 bg-cyan-500 rounded-full animate-ping opacity-20 mx-auto"></div>
          </div>
          <h3 className="text-xl font-bold text-white mt-6">LOADING PROJECTS</h3>
          <p className="text-gray-400 mt-2">Preparing amazing content for you</p>
        </div>
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
              <div className="inline-flex items-center gap-3 mb-4 px-6 py-3 bg-white/5 backdrop-blur-lg border border-white/10">
                <Sparkles className="w-6 h-6 text-cyan-400" />
                <span className="text-cyan-400 font-medium text-sm uppercase tracking-wider">
                  Logo Portfolio
                </span>
              </div>
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
                      className="w-80 texts pl-12 pr-4 py-4 bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:bg-white/10 transition-all duration-300"
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
              /* Logo Grid - Images only with real dimensions */
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
                      className="block bg-white/5 backdrop-blur-lg border border-white/10 hover:border-cyan-400/30 transition-all duration-500 overflow-hidden rounded-lg p-6 hover:bg-white/10"
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
                            e.target.src = `https://via.placeholder.com/200x100/0f172a/1e293b?text=${encodeURIComponent(logo.title || 'Logo')}`;
                          }}
                        />
                        
                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-cyan-400/0 group-hover:bg-cyan-400/5 transition-all duration-300 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                        {/*   <div className="bg-black/60 backdrop-blur-sm rounded-full p-3 transform scale-0 group-hover:scale-100 transition-transform duration-300">
                            <Eye className="w-5 h-5 text-white" />
                          </div> */}
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

  // Original render for other categories
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black">
      <Navbar />
      
      <div className="p-4 pt-24">
        {/* Header */}
        <div className="max-w-7xl mx-auto mb-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center  text-center  mb-4 px-6 py-3 bg-transparent backdrop-blur-lg border border-white/10">
              
              <span className="text-white heads text-center font-medium text-sm uppercase tracking-wider">
                <center>
                    {category.category} Projects
                </center>
              </span>
            </div>
            <h1 className="text-6xl font-black heads text-white mb-4 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent uppercase">
              {category.category} Projects
            </h1>
            <p className="text-xl texts text-gray-400 max-w-3xl mx-auto">
              Explore our curated collection of {category.category.toLowerCase()} projects built with cutting-edge technologies
            </p>
          </div>

          {/* Control Panel */}
          <div className="bg-black/40 backdrop-blur-lg border focus:border-white/10 border-white/10 p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              {/* Search */}
              <div className="md:col-span-2 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-cyan-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search projects, technologies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full texts pl-12 pr-4 py-4 bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-white/10 focus:bg-white/10 transition-all duration-300"
                />
              </div>

              {/* Sort */}
              <div className="relative">
                <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white w-5 h-5" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full pl-12 texts pr-4 py-4 bg-white/5 border border-white/10 text-white focus:outline-none focus:border-white/10 focus:bg-white/10 appearance-none"
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
                  className={`flex-1 texts px-4 py-4 border transition-all duration-300 flex items-center justify-center gap-2 ${
                    viewMode === 'grid' 
                      ? 'border-white/10 bg-cyan-400/10 text-white' 
                      : 'border-white/10 bg-white/5 text-gray-400 '
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`flex-1 px-4 texts py-4 border transition-all duration-300 flex items-center justify-center gap-2 ${
                    viewMode === 'list' 
                      ? 'border-white/10   bg-cyan-400/10 text-white' 
                      : 'border-white/10 bg-white/5 text-gray-400 '
                  }`}
                >
                  <List className="w-4 h-4" />
                  List
                </button>
              </div>
            </div>

            {/* Results Count */}
            <div className="mt-4 flex justify-between items-center">
            
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

        {/* Projects Layout */}
        <div className="max-w-7xl mx-auto">
          {filteredProjects.length === 0 ? (
            <div className="text heads-center py-24">
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
            <>
              {/* Regular Projects Section */}
              {filteredRegularProjects.length > 0 && (
                <div>
                  {/* Regular Projects Header - Only show if there are sports projects above */}
                  {filteredSportsProjects.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      className="bg-transparent heads backdrop-blur-lg border border-white/30 p-6 mb-8 rounded-xl"
                    >
                      <div className="">
                        <div className="">
                          <center>
                            <div className=" ">
                            
                            <div>
                              <h2 className="text-3xl font-black text-white bg-transparent  text-transparent">
                                {category.category} PROJECTS
                              </h2>
                              <p className="text-white/80 texts text-sm font-medium">
                                Professional {category.category.toLowerCase()} designs and solutions
                              </p>
                            </div>
                          </div>
                          </center>
                        </div>
                        
                       
                      </div>
                    </motion.div>
                  )}

                  {/* Regular Projects Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredRegularProjects.map((project, index) => (
                      <ProjectCard 
                        key={project.id} 
                        project={project} 
                        index={index} 
                        isSports={false}
                      />
                    ))}
                  </div>
                </div>
              )}
              {/* Sports Projects Section */}
              {filteredSportsProjects.length > 0 && (
                <div className="mb-12">
                  {/* Sports Header */}
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="bg-transparent text-center items-center mt-12 backdrop-blur-lg border border-white/30 p-6 mb-8 rounded-xl"
                  >
                    <div className=" ">
                      <div className="">
                        <div className="">
                          
                         <center>
                              <div className='text-center'>
                           <center>
                                <h2 className="text-3xl heads font-black center text-white bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                              SPORTS DESIGNS
                            </h2>
                           </center>
                            <p className="text-white/60 texts text-sm font-medium">
                              Championship-level social media designs for sports brands
                            </p>
                          </div>
                         </center>
                        </div>
                      </div>
                      
                     
                    </div>
                  </motion.div>

                  {/* Sports Projects Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredSportsProjects.map((project, index) => (
                      <ProjectCard 
                        key={project.id} 
                        project={project} 
                        index={index} 
                        isSports={true}
                      />
                    ))}
                  </div>
                </div>
              )}

            
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default CategoryProjects;