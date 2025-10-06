import React, { useState, useEffect } from 'react';
import AdminSidebar from './AdminSidebar';
import ProjectsGrid from './ProjectsGrid';
import AddProject from './AddProject';
import axios from 'axios';
import { Plus, Menu } from 'lucide-react';
import ProfileSection from './ProfileSection';
import Lottie from 'lottie-react';
import animationData from '../assets/Hello.json';
import { motion } from 'framer-motion';

const Admin = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const API_URL = import.meta.env.VITE_BACKEND_URL;
  // Check screen size for responsive behavior
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsSidebarCollapsed(true);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    if (activeSection === 'projects') {
      fetchProjects();
    }
  }, [activeSection]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/projects`);
      setProjects(response.data.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProjectAdded = (newProject) => {
    setProjects(prev => [newProject, ...prev]);
    setIsAddProjectOpen(false);
  };

  const handleProjectUpdate = (updatedProject) => {
    setProjects(prev => prev.map(project => 
      project.id === updatedProject.id ? updatedProject : project
    ));
  };

  const handleProjectDelete = (projectId) => {
    setProjects(prev => prev.filter(project => project.id !== projectId));
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return <ProfileSection />;
      
      case 'projects':
        return (
          <div className="p-4 md:p-6">
            {/* Header for Projects */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Projects Management</h2>
                <p className="text-gray-400">Create and manage your projects</p>
              </div>
              <button
                onClick={() => setIsAddProjectOpen(true)}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-3 md:px-6 md:py-3 rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl w-full sm:w-auto justify-center"
              >
                <Plus className="w-5 h-5" />
                Add New Project
              </button>
            </div>
            
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-500"></div>
              </div>
            ) : (
              <ProjectsGrid 
                projects={projects}
                onProjectUpdate={handleProjectUpdate}
                onProjectDelete={handleProjectDelete}
              />
            )}
          </div>
        );
      
      default:
        return (
          <div className="flex items-center justify-center min-h-screen p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-md md:max-w-lg bg-black border border-cyan-400/20 rounded-lg p-4 md:p-6"
            >
              <Lottie animationData={animationData} loop={true} />
              <div className="text-center mt-4">
                <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
                  Welcome to Admin Panel
                </h2>
                <p className="text-gray-400 text-sm md:text-base">
                  Select a section from the sidebar to get started
                </p>
              </div>
            </motion.div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black">
      {/* Sidebar - Now fully responsive */}
      <AdminSidebar
        isCollapsed={isSidebarCollapsed}
        onToggle={toggleSidebar}
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
      />

      {/* Main content area */}
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${
        isMobile ? 'ml-0' : isSidebarCollapsed ? 'md:ml-20' : 'md:ml-64'
      }`}>
        
        {/* Mobile Header */}
        {isMobile && (
          <div className="bg-black/40 backdrop-blur-lg border-b border-white/10 p-4 flex items-center justify-between lg:hidden">
            <button
              onClick={toggleSidebar}
              className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="text-white font-semibold">
              {activeSection === 'projects' && 'Projects'}
              {activeSection === 'profile' && 'Profile'}
              {activeSection === 'dashboard' && 'Dashboard'}
            </div>
            <div className="w-10"></div> {/* Spacer for balance */}
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          {renderContent()}
        </main>
      </div>

      {/* Add Project Modal */}
      {isAddProjectOpen && (
        <AddProject
          onProjectAdded={handleProjectAdded}
          onClose={() => setIsAddProjectOpen(false)}
        />
      )}
    </div>
  );
};

export default Admin;