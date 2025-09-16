import React, { useState, useEffect } from 'react';
import { Menu, X, Palette } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('#home');          // 1. track active section

  const navItems = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Portfolio', href: '#portfolio' },
    { name: 'Skills', href: '#skills' },
    { name: 'Contact', href: '#contact' },
  ];

  /* 2. creative active-link logic -------------------- */
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);

      // find the section in viewport
      const inView = navItems.find(({ href }) => {
        const el = document.querySelector(href);
        if (!el) return false;
        const { top, bottom } = el.getBoundingClientRect();
        return top <= 80 && bottom >= 80;   // 80px offset for navbar height
      });
      if (inView) setActive(inView.href);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (href) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setIsOpen(false);
  };

  /* 3. underline animation variants ------------------ */
  const linkVariants = {
    rest: { width: 0, opacity: 0 },
    active: { width: '100%', opacity: 1 },
  };

  /* 4. reusable link ------------------------------- */
  const NavLink = ({ item }) => (
    <button
      onClick={() => scrollToSection(item.href)}
      className="relative px-3 py-2 text-sm font-medium transition-colors duration-300
                 text-gray-300 hover:text-white"
    >
      {item.name}
      <motion.div
        className="absolute left-0 bottom-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500"
        variants={linkVariants}
        initial="rest"
        animate={active === item.href ? 'active' : 'rest'}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      />
    </button>
  );

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed w-full z-40 transition-all duration-300
        ${scrolled ? 'bg-black/60 backdrop-blur-xl shadow-lg py-2' : 'bg-transparent py-4'}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => scrollToSection('#home')}>
            <Palette className="h-8 w-8 text-purple-500" />
            <span className="text-xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
              EL Hachimi Bay
            </span>
          </div>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink key={item.name} item={item} />
            ))}
          </div>

          {/* Mobile hamburger */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-gray-300 hover:text-white focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu with animation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-black/70 backdrop-blur-xl"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.href)}
                  className={`block w-full text-left px-3 py-3 rounded-md text-base font-medium transition
                    ${active === item.href
                      ? 'text-white bg-white/10'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'}`}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;