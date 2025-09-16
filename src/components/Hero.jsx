import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, Github, Linkedin, Instagram, ArrowBigRightDash } from 'lucide-react';
import Prism from './Prism';
import { LiquidButton } from '@/components/animate-ui/primitives/buttons/liquid';
import { FlipButton, FlipButtonFront, FlipButtonBack } from '../components/animate-ui/primitives/buttons/flip';
import SplashCursor from './SplashCursor'
import DarkVeil from './DarkVeil';
import { ArrowRight } from '@/components/animate-ui/icons/arrow-right';
import { AnimateIcon } from '@/components/animate-ui/icons/icon';

const Hero = () => {
  const scrollToSection = (sectionId) => {
    const element = document.querySelector(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      {/* <SplashCursor  className={''}/>  */}
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

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-6xl font-extrabold tracking-tight"
            >
              <span className="block text-yellow-500">Creative </span>
              <span className="block  bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                Graphic Designer
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-6 text-xl text-white max-w-3xl mx-auto"
            >
              I create visually stunning designs that tell your brand's story and captivate your audience.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-10 flex justify-center space-x-4"
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
              <LiquidButton className={'hover:border hover:text-black  rounded-sm w-32 backdrop-blur-md text-white border border-b-0 border-yellow-500  '}>Contact</LiquidButton>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="mt-16 flex justify-center space-x-6"
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

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="mt-20 animate-bounce"
            >
              <button
                onClick={() => scrollToSection('#about')}
                className="text-gray-700 hover:text-purple-600 transition-colors duration-300"
              >
                <ArrowDown className="h-8 w-8 mx-auto text-yellow-500" />
              </button>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hero;