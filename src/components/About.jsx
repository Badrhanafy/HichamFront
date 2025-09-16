import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import CountUp from './CountUp';
import image from '../assets/images/profile.png';
import ProfileCard from './ProfileCard';
import ElectricBorder from './BorderElectric'
const About = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const contentScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.05]);

  const fadeIn = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };
  const slideInLeft = { hidden: { opacity: 0, x: -100, scale: 0.9 }, visible: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.8, ease: 'easeOut' } } };
  const slideInRight = { hidden: { opacity: 0, x: 100 }, visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: 'easeOut', delay: 0.3 } } };

  const stats = [
    { to: 100, label: 'Projects Completed' },
    { to: 5, label: 'Years Experience' },
    { to: 50, label: 'Happy Clients' },
    { to: 15, label: 'Awards Received' },
  ];

  return (
    <section id="about" ref={sectionRef} className="py-20 md:py-32 bg-[rgb(1,0,0)] relative overflow-hidden">
      {/* subtle animated background orbs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-700/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-700/20 rounded-full blur-3xl animate-pulse delay-2000" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div ref={ref} initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeIn} className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-100 tracking-tight">About Me</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto mt-4 rounded-full" />
          <p className="mt-4 max-w-2xl mx-auto text-gray-400">A short story about my journey, skills and passion.</p>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-10 items-stretch">
          {/* Left: ProfileCard */}
          <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={slideInLeft} style={{ y: imageY }} className="md:w-auto">
            <ElectricBorder
            className={'py-5'}
              color="#7df9ff"
              speed={1}
              chaos={0.5}
              thickness={2}
              style={{ borderRadius: 16 }}
            >
              <div>
                <p className= 'mt-4 text-white text-center' style={{ margin: '6px 0 0', opacity: 0.8 }}>
                  A glowing, animated border wrapper.
                </p>
                <div className="bg-gradient-to-t from black via-black/30 to-transparent relative"></div>
                <img src={image} className='mb-4 z-10'  alt="" srcset="" style={{width:"54vh",height:"68vh"}} />
              </div>
            </ElectricBorder>
          </motion.div>

          {/* Right: Content */}
          <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={slideInRight} style={{ scale: contentScale }} className="md:w-3/5 relative">
            {/* blurred gradient backdrop (same colors as old border) */}
            <div className="absolute inset-0 -z-10 rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-500 opacity-20 blur-3xl" />
            </div>

            {/* glass card */}
            <div className="relative z-10 p-8 md:p-10 bg-gray-900/60 backdrop-blur-lg rounded-2xl border border-white/10 shadow-2xl">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-100 mb-4">Crafting Beautiful Experiences</h3>
              <p className="text-gray-300 mb-6 leading-relaxed">
                With over 5 years of experience in graphic & UI design, I specialize in creating visually compelling
                designs that communicate your brand's message effectively. My approach combines artistic creativity
                with strategic thinking to deliver designs that not only look great but also achieve business goals.
              </p>
              <p className="text-gray-300 mb-8 leading-relaxed">
                I'm passionate about typography, color theory, and user-centered design principles. My work spans
                various mediums including digital platforms, print materials, and branding systems.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                {stats.map((s, idx) => (
                  <motion.div
                    key={idx}
                    className="bg-white/5 backdrop-blur-sm p-5 rounded-xl border border-white/10 shadow-md"
                    whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(139,92,246,0.3)' }}
                    transition={{ type: 'spring', stiffness: 300, delay: idx * 0.1 }}
                  >
                    <h4 className="text-purple-400 font-bold text-2xl">
                      <CountUp from={0} to={s.to} separator="," direction="up" duration={2} />+
                    </h4>
                    <p className="text-gray-400 text-sm mt-1">{s.label}</p>
                  </motion.div>
                ))}
              </div>

              {/* CTA */}
              <div className="mt-8 flex gap-4">
                <button className="px-5 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold hover:scale-105 transition-transform">
                  Download CV
                </button>
                <button className="px-5 py-2 rounded-lg border border-purple-500 text-purple-400 font-semibold hover:bg-purple-500/10 transition-colors">
                  View Portfolio
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;