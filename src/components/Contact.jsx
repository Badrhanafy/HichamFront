import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Linkedin, Github, Instagram, User, MessageSquare } from 'lucide-react';
import { useInView } from 'react-intersection-observer';

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

  return (
    <section id="contact" className="py-20 bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          ref={ref}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={fadeIn}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white">Get In Touch</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-purple-600 to-blue-500 mx-auto mt-4 rounded-full"></div>
          <p className="mt-6 text-xl text-gray-300 max-w-3xl mx-auto">
            Have a project in mind or want to discuss design possibilities? I'd love to hear from you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <motion.div
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={staggerChildren}
            className="lg:col-span-1 space-y-8"
          >
            <motion.h3 variants={itemAnimation} className="text-2xl font-semibold text-white mb-8">Contact Information</motion.h3>
            
            <motion.div variants={itemAnimation} className="space-y-6">
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="flex items-start p-4 rounded-xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/30 hover:border-purple-500/30 transition-all duration-300"
              >
                <div className="bg-purple-600/20 p-3 rounded-full mr-4">
                  <Mail className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <h4 className="font-medium text-white">Email</h4>
                  <p className="text-gray-400">hello@designstudio.com</p>
                </div>
              </motion.div>
              
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="flex items-start p-4 rounded-xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/30 hover:border-blue-500/30 transition-all duration-300"
              >
                <div className="bg-blue-600/20 p-3 rounded-full mr-4">
                  <Phone className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <h4 className="font-medium text-white">Phone</h4>
                  <p className="text-gray-400">+1 (555) 123-4567</p>
                </div>
              </motion.div>
              
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="flex items-start p-4 rounded-xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/30 hover:border-cyan-500/30 transition-all duration-300"
              >
                <div className="bg-cyan-600/20 p-3 rounded-full mr-4">
                  <MapPin className="h-6 w-6 text-cyan-400" />
                </div>
                <div>
                  <h4 className="font-medium text-white">Location</h4>
                  <p className="text-gray-400">San Francisco, California</p>
                </div>
              </motion.div>
            </motion.div>

            {/* Social Links */}
            <motion.div variants={itemAnimation} className="mt-12">
              <h4 className="font-medium text-white mb-4">Follow Me</h4>
              <div className="flex space-x-4">
                <motion.a 
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  href="#" 
                  className="bg-gray-800 p-3 rounded-full text-gray-400 hover:text-purple-400 hover:bg-gray-700 transition-all duration-300 border border-gray-700/50"
                >
                  <Linkedin className="h-5 w-5" />
                </motion.a>
                <motion.a 
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  href="#" 
                  className="bg-gray-800 p-3 rounded-full text-gray-400 hover:text-purple-400 hover:bg-gray-700 transition-all duration-300 border border-gray-700/50"
                >
                  <Github className="h-5 w-5" />
                </motion.a>
                <motion.a 
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  href="#" 
                  className="bg-gray-800 p-3 rounded-full text-gray-400 hover:text-purple-400 hover:bg-gray-700 transition-all duration-300 border border-gray-700/50"
                >
                  <Instagram className="h-5 w-5" />
                </motion.a>
              </div>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-2"
          >
            <form onSubmit={handleSubmit} className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-gray-700/30">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="relative">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                    <User className="h-4 w-4 inline mr-1" />
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onFocus={() => handleFocus('name')}
                    onBlur={handleBlur}
                    required
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/30 rounded-lg focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-300 text-white placeholder-gray-500"
                    placeholder="John Doe"
                  />
                  {focusedField === 'name' && (
                    <motion.div 
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-500 to-blue-500"
                    />
                  )}
                </div>
                <div className="relative">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    <Mail className="h-4 w-4 inline mr-1" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => handleFocus('email')}
                    onBlur={handleBlur}
                    required
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/30 rounded-lg focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-300 text-white placeholder-gray-500"
                    placeholder="john@example.com"
                  />
                  {focusedField === 'email' && (
                    <motion.div 
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-500 to-blue-500"
                    />
                  )}
                </div>
              </div>
              
              <div className="mb-6 relative">
                <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  onFocus={() => handleFocus('subject')}
                  onBlur={handleBlur}
                  required
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/30 rounded-lg focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-300 text-white placeholder-gray-500"
                  placeholder="Project Discussion"
                />
                {focusedField === 'subject' && (
                  <motion.div 
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-500 to-blue-500"
                  />
                )}
              </div>
              
              <div className="mb-6 relative">
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                  <MessageSquare className="h-4 w-4 inline mr-1" />
                  Your Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  onFocus={() => handleFocus('message')}
                  onBlur={handleBlur}
                  required
                  rows="5"
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/30 rounded-lg focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-300 text-white placeholder-gray-500 resize-none"
                  placeholder="Tell me about your project..."
                ></textarea>
                {focusedField === 'message' && (
                  <motion.div 
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-500 to-blue-500"
                  />
                )}
              </div>
              
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center">
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5 mr-2" />
                      Send Message
                    </>
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </motion.button>
              
              {submitStatus === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 bg-green-900/30 text-green-400 rounded-lg border border-green-800/50 backdrop-blur-sm"
                >
                  Thank you for your message! I'll get back to you as soon as possible.
                </motion.div>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;