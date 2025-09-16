import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowDown, Github, Linkedin, Instagram, ArrowBigRightDash } from 'lucide-react';
import Prism from './Prism';
import { LiquidButton } from '@/components/animate-ui/primitives/buttons/liquid';
import { FlipButton, FlipButtonFront, FlipButtonBack } from '../components/animate-ui/primitives/buttons/flip';
import SplashCursor from './SplashCursor'
import DarkVeil from './DarkVeil';
import { ArrowRight } from '@/components/animate-ui/icons/arrow-right';
import { AnimateIcon } from '@/components/animate-ui/icons/icon';
import profile from '../assets/images/profile.png';
const Hero = () => {
  const [scrollDirection, setScrollDirection] = useState('down');
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const y = useTransform(scrollY, [0, 300], [0, -100]);
  
  const scrollToSection = (sectionId) => {
    const element = document.querySelector(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY) {
        setScrollDirection('down');
      } else {
        setScrollDirection('up');
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Loading animation component
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 to-blue-900">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 1.2, opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center"
        >
          <motion.div
            animate={{ 
              rotate: 360,
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              rotate: { duration: 2, repeat: Infinity, ease: "linear" },
              scale: { duration: 1, repeat: Infinity }
            }}
            className="w-20 h-20 rounded-full border-4 border-yellow-400 border-t-transparent"
          />
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6 text-white text-xl font-light"
          >
            Loading Portfolio...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      {/* Prism background */}
      <div className="absolute inset-0 z-0">
        <DarkVeil />
      </div>

      {/* Content overlay */}
      <section id="home" className="min-h-screen flex items-center justify-center relative pt-16 z-10">
        {/* Optional animated background elements with reduced opacity to not compete with prism */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-100 rounded-full mix-blend-overlay filter blur-xl opacity-30 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-100 rounded-full mix-blend-overlay filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute top-40 left-40 w-80 h-80 bg-pink-100 rounded-full mix-blend-overlay filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 w-full">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center"
            style={{ opacity, y }}
            animate={{ 
              opacity: scrollDirection === 'down' ? 0 : 1,
              y: scrollDirection === 'down' ? -100 : 0,
              // Smooth breathing animation for the entire grid
              scale: [1, 1.01, 1],
            }}
            transition={{ 
              duration: 0.5,
              scale: {
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
                times: [0, 0.5, 1]
              }
            }}
          >
            {/* Text Content Column */}
            <motion.div 
              className="order-2 md:order-1 text-center md:text-left"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-4xl md:text-6xl font-extrabold tracking-tight"
              >
                <span className="block text-yellow-500">Creative </span>
                <span className="block bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                  Graphic Designer
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="mt-6 text-xl text-white max-w-3xl"
              >
                I create visually stunning designs that tell your brand's story and captivate your audience.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="mt-10 flex flex-wrap justify-center md:justify-start space-x-4"
              >
                <FlipButton className={'px-6 py-3 bg-transparent text-purple-600 border border-white hover:border-t-white border-t-0  hover:bg-gradient-to-r from-purple-600/50 to-blue-600/50  rounded-md font-medium shadow-sm hover:shadow-md transition-all duration-300'}>
                  <FlipButtonFront>
                    My Works
                  </FlipButtonFront>
                  <FlipButtonBack>
                    <AnimateIcon animateOnHover>
                      <ArrowRight className={'text-white'} />
                    </AnimateIcon>
                  </FlipButtonBack>
                </FlipButton>
                <LiquidButton className={'hover:border hover:text-black rounded-sm w-32 backdrop-blur-md text-white border border-b-0 border-yellow-500'}>
                  Contact
                </LiquidButton>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.0 }}
                className="mt-16 flex justify-center md:justify-start space-x-6"
              >
                <a href="#" className="text-gray-800 hover:text-purple-600 transition-colors duration-300">
                  <Github className="h-6 w-6 text-yellow-400/50 hover:text-yellow-400 transition-all duration-300" />
                </a>
                <a href="#" className="text-gray-800 hover:text-purple-600 transition-colors duration-300">
                  <Linkedin className="h-6 w-6 text-yellow-400/50 hover:text-yellow-400 transition-all duratio3-700" />
                </a>
                <a href="#" className="text-gray-800 hover:text-purple-600 transition-colors duration-300">
                  <Instagram className="h-6 w-6 text-yellow-400/50 hover:text-yellow-400 transition-all durati3n-700" />
                </a>
              </motion.div>
            </motion.div>

            {/* Profile Image Column */}
            <motion.div 
              className="order-1 md:order-2 flex justify-center"
              initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.3, type: "spring", stiffness: 100 }}
            >
              <motion.div 
                className="relative"
                whileHover={{ 
                  scale: 1.05,
                  rotate: 2,
                  transition: { duration: 0.3 }
                }}
              >
                <div className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-yellow-500/30 shadow-2xl shadow-purple-500/30">
                  {/* Replace with your actual profile image */}
                  <div className="w-full h-full bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center">
                    <img src={profile} alt="" srcset="" />
                  </div>
                </div>
                <motion.div 
                  className="absolute -inset-4 rounded-full border-2 border-yellow-500/20"
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity
                  }}
                />
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.5 }}
            className="mt-20 flex justify-center"
          >
            <button
              onClick={() => scrollToSection('#about')}
              className="text-gray-700 hover:text-purple-600 transition-colors duration-300"
            >
              <ArrowDown className="h-8 w-8 mx-auto text-yellow-500" />
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Hero;