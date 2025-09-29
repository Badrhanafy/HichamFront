import axios from 'axios';
import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Masonry from './Masonry';
import { gsap } from 'gsap';
import DarkVeil from './DarkVeil';
import Navbar from './Navbar';
import Lottie from 'lottie-react';
import animationData from '../assets/Error404.json'
import { motion } from 'framer-motion'
function CategoryProjects() {
  const category = useParams();
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Refs for animation
  const modalRef = useRef(null);
  const overlayRef = useRef(null);
  const contentRef = useRef(null);
  const imageRef = useRef(null);

  // Transform projects to masonry items
  const masonryItems = projects.map((project, index) => ({
    id: project.id.toString(),
    img: project.image_url,
    url: `#project-${project.id}`,
    height: getRandomHeight(300, 600),
    projectData: project
  }));

  function getRandomHeight(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8000/api/projects/category/${category.category}`);
        setProjects(response.data.data);
      } catch (error) {
        console.log("the error is: " + error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [category.category]);

  // Open modal with animation
  const openModal = (project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';

    // Use setTimeout to ensure DOM is updated
    setTimeout(() => {
      if (modalRef.current && overlayRef.current && contentRef.current && imageRef.current) {
        const tl = gsap.timeline();

        // Reset initial states
        gsap.set(overlayRef.current, { opacity: 0 });
        gsap.set(modalRef.current, {
          scale: 0.8,
          opacity: 0,
          rotationY: 10
        });
        gsap.set(imageRef.current, { scale: 1.1, opacity: 0 });
        gsap.set(contentRef.current, { y: 50, opacity: 0 });

        // Animation sequence
        tl.to(overlayRef.current, {
          opacity: 1,
          duration: 0.3,
          ease: "power2.out"
        })
          .to(modalRef.current, {
            scale: 1,
            opacity: 1,
            rotationY: 0,
            duration: 0.6,
            ease: "back.out(1.7)",
          }, "-=0.2")
          .to(imageRef.current, {
            scale: 1,
            opacity: 1,
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
        y: 50,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in"
      })
        .to(imageRef.current, {
          scale: 1.1,
          opacity: 0,
          duration: 0.3,
          ease: "power2.in"
        }, "-=0.2")
        .to(modalRef.current, {
          scale: 0.8,
          opacity: 0,
          rotationY: -10,
          duration: 0.4,
          ease: "power2.in"
        }, "-=0.2")
        .to(overlayRef.current, {
          opacity: 0,
          duration: 0.3,
          ease: "power2.out",
          onComplete: () => {
            setIsModalOpen(false);
            setSelectedProject(null);
            document.body.style.overflow = 'unset';
          }
        }, "-=0.2");
    } else {
      // Fallback if refs aren't available
      setIsModalOpen(false);
      setSelectedProject(null);
      document.body.style.overflow = 'unset';
    }
  };

  const handleProjectClick = (projectId) => {
    const project = projects.find(p => p.id.toString() === projectId);
    if (project) {
      openModal(project);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.keyCode === 27 && isModalOpen) {
        closeModal();
      }
    };

    if (isModalOpen) {
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isModalOpen]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-xl">Loading projects...</div>
      </div>
    );
  }

  return (
    <div className=' h-96 '>
      <Navbar />

      <div className="min-h-screen bg-gray-900 py-8 px-4 relative">

        <div className="max-w-7xl mx-auto bg-gray-900 ">
          <h1 className="text-4xl font-bold text-white text-center mb-2 capitalize">
            {category.category} Projects
          </h1>
          <p className="text-gray-400 text-center mb-12">
            {projects.length} projects found
          </p>
          <div className="absolute inset-0 z-0">
            <DarkVeil />
            <DarkVeil />
          </div>
          {projects.length > 0 ? (
            <Masonry
              items={masonryItems}
              ease="power3.out"
              duration={0.6}
              stagger={0.05}
              animateFrom="bottom"
              scaleOnHover={true}
              hoverScale={0.95}
              blurToFocus={true}
              colorShiftOnHover={false}
              onItemClick={handleProjectClick}
            />
          ) : (
            <div className="text-center text-white z-50 bg-center text-xl  " style={{
              position: "relative",
              left: "70vh",

            }}>

              <motion.div
                className='w-96 h-56 bg-center '

              >
                <Lottie animationData={animationData} loop={true} />
                <p className='text-white b-yellow-300'>seems like ther is no projects yet  on this category !!</p>
              </motion.div>
            </div>
          )}
        </div>

        {/* Project Modal */}
        {isModalOpen && selectedProject && (
          <div
            ref={overlayRef}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={handleOverlayClick}
            style={{ opacity: 0 }} // Initial state for GSAP
          >
            <div
              ref={modalRef}
              className="relative max-w-6xl w-full max-h-[90vh] overflow-hidden rounded-2xl bg-gray-800 shadow-2xl"
              style={{
                transform: 'scale(0.8) rotateY(10deg)',
                opacity: 0
              }}
            >
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 z-20 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white text-xl transition-all duration-200 hover:scale-110"
              >
                ×
              </button>

              <div className="flex flex-col lg:flex-row h-full">
                {/* Image Section */}
                <div className="lg:w-1/2 relative">
                  <div
                    ref={imageRef}
                    className="h-64 lg:h-full bg-cover bg-center relative"
                    style={{
                      backgroundImage: `url(${selectedProject.image_url})`,
                      transform: 'scale(1.1)',
                      opacity: 0
                    }}
                  >
                    {/* Dark/Light Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent lg:bg-gradient-to-r lg:from-black/70 lg:via-transparent lg:to-transparent" />

                    {/* Project Title on Image */}
                    <div className="absolute bottom-4 left-4 lg:bottom-8 lg:left-8 text-white">
                      <h2 className="text-2xl lg:text-4xl font-bold mb-2">
                        {selectedProject.title}
                      </h2>
                      <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm">
                        {selectedProject.category}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div
                  ref={contentRef}
                  className="lg:w-1/2 p-6 lg:p-8 overflow-y-auto"
                  style={{
                    transform: 'translateY(50px)',
                    opacity: 0
                  }}
                >
                  <div className="space-y-6">
                    {/* Category */}
                    <div className="transform transition-all duration-300 hover:translate-x-2">
                      <span className="text-sm text-gray-400 uppercase tracking-wider">Category</span>
                      <p className="text-white text-lg">{selectedProject.category}</p>
                    </div>

                    {/* Description */}
                    <div className="transform transition-all duration-300 hover:translate-x-2">
                      <span className="text-sm text-gray-400 uppercase tracking-wider">Description</span>
                      <p className="text-white text-lg leading-relaxed">
                        {selectedProject.description}
                      </p>
                    </div>

                    {/* Technologies */}
                    {selectedProject.technologies && selectedProject.technologies.length > 0 && (
                      <div className="transform transition-all duration-300 hover:translate-x-2">
                        <span className="text-sm text-gray-400 uppercase tracking-wider">Technologies</span>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {selectedProject.technologies.map((tech, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm transform transition-all duration-300 hover:scale-105 hover:bg-blue-500/30"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="transform transition-all duration-300 hover:translate-x-2">
                        <span className="text-sm text-gray-400 uppercase tracking-wider">Created</span>
                        <p className="text-white">
                          {new Date(selectedProject.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="transform transition-all duration-300 hover:translate-x-2">
                        <span className="text-sm text-gray-400 uppercase tracking-wider">Updated</span>
                        <p className="text-white">
                          {new Date(selectedProject.updated_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 pt-4">
                      <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg">
                        View Live Demo
                      </button>
                      <button className="px-6 py-3 border border-gray-600 hover:border-gray-400 text-white rounded-lg transition-all duration-200 transform hover:scale-105">
                        Source Code
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CategoryProjects;