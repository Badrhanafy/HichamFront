import React, { useState, useEffect } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import DashboardContent from './DashboardContent';
import ProjectsGrid from './ProjectsGrid';
import AddProject from './AddProject';
import axios from 'axios';
import { Plus } from 'lucide-react';

const Admin = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);

  // Page titles and descriptions
  const pageConfig = {
    dashboard: {
      title: 'Dashboard',
      description: 'Overview of your portfolio statistics'
    },
    projects: {
      title: 'Projects Management',
      description: 'Manage your project portfolio'
    },
    users: {
      title: 'User Management',
      description: 'Manage system users and permissions'
    },
    settings: {
      title: 'Settings',
      description: 'Configure your portfolio settings'
    }
  };

  useEffect(() => {
    if (activeSection === 'projects') {
      fetchProjects();
    }
  }, [activeSection]);

  const fetchProjects = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/projects');
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

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);
    if (window.innerWidth < 1024) {
      setIsMobileMenuOpen(false);
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardContent />;
      
      case 'projects':
        return (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Projects Management</h2>
                <p className="text-gray-600">Create and manage your projects</p>
              </div>
              <button
                onClick={() => setIsAddProjectOpen(true)}
                className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
              >
                <Plus className="w-5 h-5" />
                Add New Project
              </button>
            </div>
            
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <ProjectsGrid projects={projects} />
            )}
          </div>
        );
      
      case 'users':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">User Management</h2>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <p className="text-gray-600">User management content coming soon...</p>
            </div>
          </div>
        );
      
      case 'settings':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Settings</h2>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <p className="text-gray-600">Settings content coming soon...</p>
            </div>
          </div>
        );
      
      default:
        return <DashboardContent />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar for desktop */}
      <div className="hidden lg:block">
        <AdminSidebar
          isCollapsed={isSidebarCollapsed}
          onToggle={toggleSidebar}
          activeSection={activeSection}
          onSectionChange={handleSectionChange}
        />
      </div>

      {/* Mobile sidebar overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div 
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          <div className="fixed inset-y-0 left-0 z-50">
            <AdminSidebar
              isCollapsed={false}
              onToggle={() => setIsMobileMenuOpen(false)}
              activeSection={activeSection}
              onSectionChange={handleSectionChange}
            />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
       
        
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