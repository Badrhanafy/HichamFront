import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import DomeGallery from './DomeGallery'; // Your existing DomeGallery component

const ProjectDomeGallery = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch projects from your API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/projects');
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
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
      <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white p-3 rounded-lg">
        <p className="text-sm">
          {projects.length} project{projects.length !== 1 ? 's' : ''} loaded
        </p>
      </div>
    </div>
  );
};

// Alternative simplified version if you want a basic gallery:
const SimpleProjectGallery = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/api/projects')
      .then(response => setProjects(response.data.data))
      .catch(console.error);
  }, []);

  const galleryImages = projects.map(project => ({
    src: project.image_url,
    alt: project.title,
  }));

  return (
    <DomeGallery 
      images={galleryImages}
      // Customize based on your needs
      segments={30}
      fit={0.7}
    />
  );
};

export default ProjectDomeGallery;