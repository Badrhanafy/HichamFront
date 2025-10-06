import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Palette, Brush, Layers, Camera, CheckCircle, Users, Target, Lightbulb, TrendingUp } from 'lucide-react';
import ilustrator from "../assets/images/illustator.png";
import primerepro from "../assets/images/primerepro.png";
import indesign from "../assets/images/indesign.png";
import aftereffect from "../assets/images/aftereffect.png";
import photoshop from "../assets/images/photoshop.png";

import { Helmet } from 'react-helmet-async';

const Skills = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  /* ----------  DATA  ---------- */
  const skillCategories = [
    {
      title: 'Graphic Design',
      color: 'from-orange-500 to-pink-500',
      items: [
        { name: 'UI/UX Design', lvl: 95 },
        { name: 'Brand Identity', lvl: 90 },
        { name: 'Typography', lvl: 92 },
        { name: 'Print Design', lvl: 85 },
      ],
    },
    {
      title: 'Digital Art',
      color: 'from-purple-500 to-blue-500',
      items: [
        { name: 'Digital Illustration', lvl: 89 },
        { name: 'Vector Graphics', lvl: 93 },
        { name: 'Character Design', lvl: 85 },
        { name: 'Icon Design', lvl: 90 },
      ],
    },
    {
      title: 'Motion & Video',
      color: 'from-cyan-500 to-green-500',
      items: [
        { name: 'Motion Graphics', lvl: 88 },
        { name: 'Video Editing', lvl: 85 },
        { name: '2D Animation', lvl: 83 },
        { name: 'Visual Effects', lvl: 80 },
      ],
    },
  ];

  const softSkills = [
    {
      category: 'Communication',
      icon: <Users className="w-5 h-5" />,
      color: 'from-blue-500 to-cyan-500',
      items: [
        'Client Presentation',
        'Team Collaboration',
        'Creative Briefing',
        'Feedback Integration',
        'Visual Storytelling'
      ]
    },
    {
      category: 'Problem Solving',
      icon: <Target className="w-5 h-5" />,
      color: 'from-green-500 to-emerald-500',
      items: [
        'Creative Thinking',
        'Design Challenges',
        'Technical Issues',
        'Workflow Optimization',
        'Deadline Management'
      ]
    },
    {
      category: 'Professional',
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'from-purple-500 to-pink-500',
      items: [
        'Time Management',
        'Project Planning',
        'Quality Assurance',
        'Continuous Learning',
        'Industry Trends'
      ]
    },
    {
      category: 'Creative',
      icon: <Lightbulb className="w-5 h-5" />,
      color: 'from-orange-500 to-red-500',
      items: [
        'Concept Development',
        'Art Direction',
        'Style Exploration',
        'Trend Analysis',
        'Innovation'
      ]
    }
  ];

  const tools = [
    { name: 'Illustrator', icon: ilustrator, color: '#FF6B35', category: 'Vector' },
    { name: 'Photoshop', icon: photoshop, color: '#31A8FF', category: 'Raster' },
    { name: 'InDesign', icon: indesign, color: '#FF9A00', category: 'Layout' },
    { name: 'After Effects', icon: aftereffect, color: '#D291FF', category: 'Motion' },
    { name: 'Premiere Pro', icon: primerepro, color: '#EA77FF', category: 'Video' },
   /*  { name: 'Figma', icon: figma, color: '#F24E1E', category: 'UI/UX' }, */
    { name: 'Procreate', icon: '✏️', color: '#000000', category: 'Digital Art' },
    { name: 'Blender', icon: '🔄', color: '#FF6B35', category: '3D' },
  ];

  /* ----------  ANIMATIONS  ---------- */
  const fadeIn = (y = 30, delay = 0) => ({
    hidden: { opacity: 0, y },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, delay, ease: 'easeOut' } },
  });

  const scaleIn = (delay = 0) => ({
    hidden: { scale: 0.8, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { duration: 0.5, delay, ease: 'backOut' } },
  });

  const checklistVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (custom) => ({
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        delay: custom * 0.1
      }
    })
  };

  /* ----------  SUB-COMPONENTS  ---------- */
  const ProgressBar = ({ label, value, color }) => (
    <div className="mb-5">
      <div className="flex justify-between text-sm text-gray-300 mb-1">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="h-2 bg-gray-800/60 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={inView ? { width: `${value}%` } : {}}
          transition={{ duration: 1.2, ease: 'circOut' }}
          className={`h-full bg-gradient-to-r ${color} rounded-full`}
        />
      </div>
    </div>
  );

  const ToolCard = ({ tool, idx }) => (
    <center>
      
           <motion.div
      variants={scaleIn(idx * 0.08)}
      whileHover={{ scale: 1.08, rotate: -3 }}
      className="group center relative p-4 bg-gray-900/40 border border-white/10 rounded-2xl backdrop-blur-sm
                 hover:border-white/20 transition-all duration-300 cursor-pointer"
    >
      <div
        className="absolute center inset-0 -z-10 rounded-2xl blur-lg opacity-0 group-hover:opacity-40 transition-opacity"
        style={{ background: tool.color }}
      />
      <div className="text-3xl mb-2">
   
          <img src={`${tool.icon}`} alt={tool.name} className="w-8 h-8 object-contain mx-auto" />
       
      </div>
      <p className="text-gray-200 text-sm font-medium text-center">{tool.name}</p>
      <p className="text-gray-500 text-xs text-center mt-1">{tool.category}</p>
    </motion.div>
    </center>
  );

  const SoftSkillCategory = ({ category, index }) => (
    <motion.div
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={fadeIn(30, 0.3 + index * 0.1)}
      className="p-6 rounded-2xl border border-white/10 backdrop-blur-lg bg-gradient-to-br from-gray-900/40 to-black/40"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 rounded-xl bg-gradient-to-r ${category.color} text-white`}>
          {category.icon}
        </div>
        <h3 className="text-lg font-bold text-white">{category.category}</h3>
      </div>

      {/* Checklist Items */}
      <div className="space-y-2">
        {category.items.map((item, idx) => (
          <motion.div
            key={item}
            custom={idx}
            variants={checklistVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors duration-200"
          >
            <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
            <span className="text-gray-300 text-sm">{item}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  return (
    <section
      id="skills"
      ref={ref}
      className="py-24 md:py-32 bg-black relative overflow-hidden"
    >
      <Helmet>
        <title>EL HACHIMI | Design Skills</title>
      </Helmet>

      {/* decorative orbs */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-orange-700/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-700/20 rounded-full blur-3xl animate-pulse delay-2000" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* header */}
        <motion.div
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={fadeIn()}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-purple-400">
            Design Skills & Expertise
          </h2>
          <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
            Combining technical mastery with creative problem-solving to deliver exceptional visual experiences.
          </p>
        </motion.div>

        {/* Technical Skills Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {skillCategories.map((cat, idx) => (
            <motion.div
              key={cat.title}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              variants={fadeIn(idx === 0 ? -30 : 30, 0.15 + idx * 0.15)}
              className="bg-gray-900/30 border border-white/10 rounded-2xl p-6 backdrop-blur-md"
            >
              <h3 className={`text-2xl font-bold mb-6 bg-gradient-to-r ${cat.color} bg-clip-text text-transparent`}>
                {cat.title}
              </h3>
              {cat.items.map((s) => (
                <ProgressBar key={s.name} label={s.name} value={s.lvl} color={cat.color} />
              ))}
            </motion.div>
          ))}
        </div>

        {/* Soft Skills Grid */}
        <motion.div
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={fadeIn(30, 0.4)}
          className="mb-16"
        >
          <h3 className="text-2xl font-bold text-gray-100 mb-6 text-center">Professional Skills</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {softSkills.map((category, index) => (
              <SoftSkillCategory key={category.category} category={category} index={index} />
            ))}
          </div>
        </motion.div>

        {/* Tools Grid */}
        <motion.div
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={fadeIn(30, 0.5)}
          className="mb-16"
        >
          <h3 className="text-2xl font-bold text-gray-100 mb-6 text-center">Design Tools</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {tools.map((t, i) => (
              <ToolCard key={t.name} tool={t} idx={i} />
            ))}
          </div>
        </motion.div>

        {/* Philosophy Card */}
        <motion.div
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={fadeIn(30, 0.6)}
          className="p-8 rounded-2xl bg-gradient-to-br from-orange-900/30 to-purple-900/30 border border-white/10 backdrop-blur-md text-center"
        >
          <h4 className="text-xl font-semibold text-gray-100 mb-3">Design Philosophy</h4>
          <p className="text-gray-300 leading-relaxed">
            Every design decision is intentional. I combine aesthetic sensibility with strategic thinking 
            to create visuals that not only captivate but also communicate effectively and drive meaningful results.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;