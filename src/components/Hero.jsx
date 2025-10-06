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
import profile from "../assets/images/hhghg.png"
import Lottie from 'lottie-react';
import animationData from '../assets/Loading.json'
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
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
        <div className="absolute inset-0 z-0">
          <DarkVeil />
        </div>
        <motion.div
          className='w-24 h-24'
        >
          <Lottie animationData={animationData} loop={true} />
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 text-white text-xl font-light"
        >
          Loading Portfolio...
        </motion.p>

      </div>
    );
  }

  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      {/* Prism background */}
      <div className="absolute inset-0 z-0">
        <DarkVeil />
      </div>
      <Helmet>
        <title>EL Hachimi | Home</title>
      </Helmet>
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
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: [1, 1.005, 1] // Breathing animation
            }}
            transition={{
              duration: 0.8,
              scale: {
                duration: 4,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }
            }}
          >
            {/* Text Content Column */}
            <motion.div
              className="order-2 md:order-1 sm:bg-center  mt-14 ml-12 text-center md:text-left"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-4xl md:text-6xl  font-extrabold tracking-tight"
              >
                <span className="block text-white tet">Creative </span>
                <span className="block tet bg-white sm:hidden bg-clip-text text-transparent">
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
                <Link to={"/projects"}>
                  <FlipButton
                    className={'px-6 py-3 bg-transparent text-white border border-white hover:border-t-white  hover:bg-gradient-to-r from-purple-600/50 to-blue-600/50  rounded-md font-medium shadow-sm hover:shadow-md transition-all duration-300'}>

                    <FlipButtonFront>
                      My Works
                    </FlipButtonFront>

                    <FlipButtonBack>
                      <AnimateIcon animateOnHover>
                        <ArrowRight className={'text-white h'} />
                      </AnimateIcon>
                    </FlipButtonBack>

                  </FlipButton>
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.0 }}
                className="mt-16 flex justify-center md:justify-start space-x-6"
              >
                <a href="#" className="text-gray-800 hover:text-purple-600 transition-colors duration-300">
                  <Github className="h-6 w-6 text-white hover:text-yellow-400 transition-all duration-300" />
                </a>
                <a href="#" className="text-gray-800 hover:text-purple-600 transition-colors duration-300">
                  <Linkedin className="h-6 w-6 text-white hover:text-yellow-400 transition-all duratio3-700" />
                </a>
                <a href="#" className="text-gray-800 hover:text-purple-600 transition-colors duration-300">
                  <Instagram className="h-6 w-6 text-white hover:text-yellow-400 transition-all durati3n-700" />
                </a>
              </motion.div>
            </motion.div>

            {/* Profile Image Column - Removed circle and added gradient overlay */}
            <motion.div
              className="order-1 md:order-2 flex justify-center relative"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="relative w-full max-w-md">
                {/* Main image container */}
                <motion.div
                  className="relative mt-10 overflow-hidden border-0 rounded-lg shadow-2xl"
                  whileHover={{
                    scale: 1.03,
                    translateY: -5

                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 15,
                    duration: 0.3
                  }}
                >
                  {/* Replace with your actual profile image */}
                  <div className="w-full h-80 md:h-96 bg-transparent flex items-center justify-center">
                    <span className="text-2xl font-bold">
                      <img src={profile} alt="" className='w-full h-auto mt-10' />
                    </span>
                  </div>

                  {/* Gradient overlay at the bottom */}
                  <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black to-transparent"></div>
                </motion.div>

                {/* Optional decorative elements */}

              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.5 }}
            className="mt-20 flex justify-center"
          >
            {/*    <button
              onClick={() => scrollToSection('#about')}
              className="text-gray-700 hover:text-purple-600 transition-colors duration-300"
            >
              <ArrowDown className="h-8 w-8 mx-auto text-yellow-500" />
            </button> */}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Hero;