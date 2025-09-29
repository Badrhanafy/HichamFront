import React from 'react';
import { motion } from 'framer-motion';
import { Palette, Heart, ArrowUp } from 'lucide-react';
import DarkVeil from './DarkVeil';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-black  text-white py-12 relative  overflow-hidden">
      {/* DarkVeil background */}
      <div className="absolute inset-0 z-0">
        <DarkVeil />
      </div>

      {/* Content فوق DarkVeil */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center mb-4">
              <Palette className="h-8 w-8 text-purple-400" />
              <span className="ml-2 text-xl font-bold">DesignStudio</span>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              Creating beautiful, functional designs that tell your brand's story and captivate your audience.
            </p>
            <div className="flex space-x-4">
              {/* Social icons ... */}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#home" className="text-gray-400 hover:text-white">Home</a></li>
              <li><a href="#about" className="text-gray-400 hover:text-white">About</a></li>
              <li><a href="#portfolio" className="text-gray-400 hover:text-white">Portfolio</a></li>
              <li><a href="#skills" className="text-gray-400 hover:text-white">Skills</a></li>
              <li><a href="#contact" className="text-gray-400 hover:text-white">Contact</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-gray-400">
              <li>UI/UX Design</li>
              <li>Brand Identity</li>
              <li>Web Design</li>
              <li>Graphic Design</li>
              <li>Illustration</li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm flex items-center">
            © {currentYear} DesignStudio. Made with <Heart className="h-4 w-4 mx-1 text-red-400" /> by Creative Designer
          </p>
          <button
            onClick={scrollToTop}
            className="mt-4 md:mt-0 flex items-center text-gray-400 hover:text-white"
          >
            Back to top
            <ArrowUp className="h-4 w-4 ml-1" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
