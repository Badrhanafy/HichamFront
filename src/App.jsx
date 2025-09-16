import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Portfolio from './components/Portfolio';
import Skills from './components/Skills';
import Contact from './components/Contact';
import Footer from './components/Footer';
import { ScrollProgress, ScrollProgressProvider } from '@/components/animate-ui/primitives/animate/scroll-progress';
function App() {
  return (
    <div className="App bg-gradient-to-br from-white to-gray-50 text-gray-800 min-h-screen">
      
      <ScrollProgressProvider global>
        <ScrollProgress className="fixed top-0 left-0 w-full h-1 bg-purple-600 z-50" />
      <Navbar />
      <Hero />
      <About />
      <Portfolio />
      <Skills />
      <Contact />
      <Footer />
      </ScrollProgressProvider>
    </div>
  );
}

export default App;