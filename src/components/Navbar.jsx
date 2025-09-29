import React, { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { NavLink } from 'react-router-dom'
import logo from '../assets/images/logo.png'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const navItems = [
    { name: 'Home', to: '/' },
    { name: 'About', to: '/about' },
    /* { name: 'Portfolio', to: '/portfolio' }, */
    { name: 'Skills', to: '/skills' },
    { name: 'Projects', to: '/projects' },
  ]

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const linkVariants = {
    rest: { width: 0, opacity: 0 },
    active: { width: '100%', opacity: 1 },
  }

  const NavItem = ({ item }) => (
    <NavLink
      to={item.to}
      end
      className={({ isActive }) =>
        `relative tet px-3 py-2 text-sm font-medium transition-colors duration-300 ${
          isActive ? 'text-white' : 'text-gray-300 hover:text-white'
        }`
      }
      onClick={() => setIsOpen(false)}
    >
      {({ isActive }) => (
        <>
          {item.name}
          <motion.div
            className="absolute left-0 bottom-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500"
            variants={linkVariants}
            initial="rest"
            animate={isActive ? 'active' : 'rest'}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          />
        </>
      )}
    </NavLink>
  )

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed w-full z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-black/60 backdrop-blur-xl shadow-lg py-2'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <NavLink to="/" className="flex  items-center cursor-pointer">
            <img
              src={logo}
              alt="Logo"
              style={{ width: '14vh', height: '14vh' }}
            />
            <span
              style={{ marginLeft: '-15px' }}
              className="text-xl font-bold bg-white bg-clip-text text-transparent"
            >
              EL Hachimi Bayi
            </span>
          </NavLink>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <NavItem key={item.name} item={item} />
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
                <NavLink
                  key={item.name}
                  to={item.to}
                  end
                  className={({ isActive }) =>
                    `block w-full tet px-3 py-3 rounded-md text-base font-medium transition ${
                      isActive
                        ? 'text-white bg-white/10'
                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }`
                  }
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </NavLink>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

export default Navbar
