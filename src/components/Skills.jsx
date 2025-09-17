import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import ilustrator from "../assets/images/illustator.png"
import primerepro from "../assets/images/primerepro.png"
import indesign from "../assets/images/indesign.png"
import aftereffect from "../assets/images/aftereffect.png"
const Skills = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.15 });

  /* ----------  DATA  ---------- */
  const skillCategories = [
    {
      title: 'Design',
      color: 'from-fuchsia-500 to-cyan-500',
      items: [
        { name: 'UI/UX Design', lvl: 95 },
        { name: 'Graphic Design', lvl: 90 },
        { name: 'Brand Identity', lvl: 85 },
        { name: 'Motion Graphics', lvl: 75 },
      ],
    },
    {
      title: 'Front-End',
      color: 'from-lime-400 to-emerald-600',
      items: [
        { name: 'React / Next', lvl: 90 },
        { name: 'Tailwind CSS', lvl: 95 },
        { name: 'TypeScript', lvl: 80 },
        { name: 'Framer-Motion', lvl: 85 },
      ],
    },
  ];

  const tools = [
    { name: 'Illustrator', icon: ilustrator, color: '#ff5e00' },
    { name: 'primere Pro', icon: primerepro, color: '#31a8ff' },
    { name: 'InDesign', icon: indesign, color: '#ff9a00' },
    { name: 'After-Effects', icon: aftereffect, color: '#d291ff' },
    { name: 'VS Code', icon: '💻', color: '#007acc' },
    { name: 'GitHub', icon: '🐙', color: '#171515' },
  ];

  /* ----------  UTILS  ---------- */
  const fadeIn = (y = 30, delay = 0) => ({
    hidden: { opacity: 0, y },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, delay, ease: 'easeOut' } },
  });

  const scaleIn = (delay = 0) => ({
    hidden: { scale: 0.8, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { duration: 0.5, delay, ease: 'backOut' } },
  });

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
    <motion.div
      variants={scaleIn(idx * 0.08)}
      whileHover={{ scale: 1.08, rotate: -3 }}
      className="group relative p-4 bg-gray-900/40 border border-white/10 rounded-2xl backdrop-blur-sm
                 hover:border-white/20 transition-all duration-300 cursor-pointer"
    >
      <div
        className="absolute inset-0 -z-10 rounded-2xl blur-lg opacity-0 group-hover:opacity-40 transition-opacity"
        style={{ background: tool.color }}
      />
      <div className="text-3xl mb-2"><img src={tool.icon} alt="" /></div>
      <p className="text-gray-200 text-sm font-medium">{tool.name}</p>
    </motion.div>
  );

  /* ----------  RENDER  ---------- */
  return (
    <section
      id="skills"
      ref={ref}
      className="py-24 md:py-32 bg-black relative overflow-hidden"
    >
      {/* decorative orbs */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-700/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-cyan-700/20 rounded-full blur-3xl animate-pulse delay-2000" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* header */}
        <motion.div
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={fadeIn()}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
            Skills & Tooling
          </h2>
          <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
            A quick glance at the technologies I use to craft memorable digital experiences.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* skill categories */}
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

        {/* tools grid */}
        <motion.div
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={fadeIn(30, 0.4)}
          className="mt-16"
        >
          <h3 className="text-2xl font-bold text-gray-100 mb-6">Favourite Tools</h3>
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-4">
            {tools.map((t, i) => (
              <ToolCard key={t.name} tool={t} idx={i} />
            ))}
          </div>
        </motion.div>

        {/* philosophy card */}
        <motion.div
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={fadeIn(30, 0.6)}
          className="mt-16 p-8 rounded-2xl bg-gradient-to-br from-purple-900/30 to-cyan-900/30 border border-white/10 backdrop-blur-md"
        >
          <h4 className="text-xl font-semibold text-gray-100 mb-3">Design Philosophy</h4>
          <p className="text-gray-300 leading-relaxed">
            Every pixel has a purpose. I strive for interfaces that are not only beautiful but also
            accessible, performant and delightful to interact with—bridging aesthetics with usability.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;