import React, { useState, useEffect } from 'react';
import ProjectsGrid from './ProjectsGrid';
import AddProject from './AddProject';
import axios from 'axios';
import { Plus } from 'lucide-react';

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);
const API_URL = import.meta.env.VITE_BACKEND_URL;
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
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
    setIsAddProjectOpen(false); // Close modal after successful addition
  };

  const handleCloseAddProject = () => {
    setIsAddProjectOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Add Button */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Projects</h1>
              <p className="text-gray-600 mt-2">Manage your project portfolio</p>
            </div>
            <button
              onClick={() => setIsAddProjectOpen(true)}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5" />
              Add New Project
            </button>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="max-w-7xl mx-auto py-8">
        <ProjectsGrid projects={projects} />
      </div>

      {/* Add Project Modal */}
      {isAddProjectOpen && (
        <AddProject
          onProjectAdded={handleProjectAdded}
          onClose={handleCloseAddProject}
        />
      )}
    </div>
  );
};

export default ProjectsPage;