import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Linkedin, Github, Instagram, User, MessageSquare, HeartPlus, Wallpaper } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import DomeGallery from './DomeGallery';
import { FiFileText, FiBook, FiHeart, FiCloud, FiEdit, FiBarChart2 } from 'react-icons/fi';
import  GlassIcons  from './GlassIcons';
import socials from '../assets/images/social-media.png';
import ProjectDomeGallery from './ProjectDomeGallery';
import Navbar from './Navbar';
import { Helmet } from 'react-helmet-async';
const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [focusedField, setFocusedField] = useState(null);

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFocus = (fieldName) => {
    setFocusedField(fieldName);
  };

  const handleBlur = () => {
    setFocusedField(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });

      // Reset status after 5 seconds
      setTimeout(() => setSubmitStatus(null), 5000);
    }, 2000);
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerChildren = {
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  const items = [
    { category:"social-media", icon: <Instagram />, color: 'blue', label: 'Social media' },
    { category:"logo", icon: <Wallpaper />, color: 'purple', label: 'Logo' },
   
  
  ];
  return (
    <section
      id="contact"
      className="py-20 bg-black"
    >
       <Helmet>
        <title>el-hacimi | projects</title>
      </Helmet>
      <div className="absolute top-0">
          <Navbar/>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 relative">
        {/* Left column - DomeGallery */}

        <div className="w-full h-[60vh] md:h-screen">
          <ProjectDomeGallery />
        </div>

        {/* Right column - Text content with gradient overlay */}
        <div className="relative flex items-center bg-black">
          {/* Gradient overlay that spans the entire height and creates a smooth transition */}
          <div className="absolute inset-y-0 -left-24 w-48 bg-gradient-to-l from-black via-black/90  to-transparent z-0"></div>

          {/* Additional gradient for a more dramatic fade effect */}
          <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-l from-black to-transparent z-0"></div>

          {/* Text content */}
          <motion.div
            className="relative z-10 text-white px-6 md:px-12 py-12 md:py-24"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.h2
              className="text-3xl md:text-4xl font-bold heads mb-6"
              style={{color:"#3179f4"}}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Browse My Works 
            </motion.h2>

            <motion.p
              className="text-lg md:text-xl mb-8 leading-relaxed texts text-gray-200"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              Choose work category you want to explore more.
             
            </motion.p>

          
            <div style={{ height: '600px', position: 'relative' }}>
              <GlassIcons items={items} className="custom-class" />
            </div>
              {/* <motion.div
              className="flex space-x-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <a href="#" className="text-yellow-400 hover:text-yellow-300 transition-colors duration-300">
                <Linkedin className="h-6 w-6" />
              </a>
              <a href="#" className="text-yellow-400 hover:text-yellow-300 transition-colors duration-300">
                <Github className="h-6 w-6" />
              </a>
              <a href="#" className="text-yellow-400 hover:text-yellow-300 transition-colors duration-300">
                <Instagram className="h-6 w-6" />
              </a>
            </motion.div> */}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;