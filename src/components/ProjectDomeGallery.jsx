import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import DomeGallery from './DomeGallery'; // Your existing DomeGallery component
import DarkVeil from './DarkVeil';
import {motion} from "framer-motion"
import logo from "../assets/images/logo.png"
const ProjectDomeGallery = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
const API_URL = import.meta.env.VITE_BACKEND_URL;
  // Fetch projects from your API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/projects`);
        setProjects(response.data.data);
      } catch (err) {
        setError('Failed to load projects');
        console.error('Error fetching projects:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Transform projects data into the image format expected by DomeGallery
  const projectImages = useMemo(() => {
    return projects.map(project => ({
      src: project.image_url, // Use the actual project image URL
      alt: project.title, // Use project title as alt text
      projectId: project.id, // Keep reference to project ID
      title: project.title,
      description: project.description
    }));
  }, [projects]);

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

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-red-600">
        {error}
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        No projects found. Add some projects to see them in the gallery.
      </div>
    );
  }

  return (
    <div className="w-full h-screen">
      <DomeGallery 
        images={projectImages}
        // Pass any additional props you want to customize
        fit={0.6}
        grayscale={false}
        enlargeTransitionMs={400}
      />
      
      {/* Optional: Add a small info panel */}
      <div className="absolute  left-4 bg-black bg-opacity-50 text-white p-3 rounded-lg">
        <p className="text-sm">
          {projects.length} project{projects.length !== 1 ? 's' : ''} loaded
        </p>
      </div>
    </div>
  );
};

export default ProjectDomeGallery;