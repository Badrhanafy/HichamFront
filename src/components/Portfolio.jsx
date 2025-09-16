import React, { useState, useRef, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { ExternalLink, Github, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { useInView } from 'react-intersection-observer';

const Portfolio = () => {
    const [activeFilter, setActiveFilter] = useState('all');

    const [isHovering, setIsHovering] = useState(false);
    const controls = useAnimation();
    const carouselRef = useRef(null);
    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

    const portfolioItems = [
        {
            id: 1, title: 'Brand Identity Design', category: 'branding',
            description: 'Complete brand identity for a tech startup including logo, color palette, and guidelines.',
            image: 'https://images.unsplash.com/photo-1567446537738-74804ee3a9bd?auto=format&fit=crop&w=800&q=80',
            technologies: ['Illustrator', 'Photoshop', 'InDesign'], projectUrl: '#', githubUrl: '#'
        },
        {
            id: 2, title: 'E-commerce Website UI', category: 'web',
            description: 'Modern e-commerce interface design with focus on user experience and conversions.',
            image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=800&q=80',
            technologies: ['Figma', 'React', 'Tailwind CSS'], projectUrl: '#', githubUrl: '#'
        },
        {
            id: 3, title: 'Mobile App Design', category: 'mobile',
            description: 'Fitness tracking app with intuitive UI and engaging user experience.',
            image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?auto=format&fit=crop&w=800&q=80',
            technologies: ['Sketch', 'Adobe XD', 'Illustrator'], projectUrl: '#', githubUrl: '#'
        },
        {
            id: 4, title: 'Packaging Design', category: 'print',
            description: 'Eco-friendly packaging design for a sustainable product line.',
            image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80',
            technologies: ['Illustrator', 'Photoshop', 'InDesign'], projectUrl: '#', githubUrl: '#'
        },
        {
            id: 5, title: 'Social Media Campaign', category: 'branding',
            description: 'Complete social media visual campaign for a lifestyle brand.',
            image: 'https://images.unsplash.com/photo-1611605698335-8b1569810432?auto=format&fit=crop&w=800&q=80',
            technologies: ['Photoshop', 'After Effects', 'Illustrator'], projectUrl: '#', githubUrl: '#'
        },
        {
            id: 6, title: 'Analytics Dashboard', category: 'web',
            description: 'Analytics dashboard with clean data visualization and intuitive navigation.',
            image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
            technologies: ['Figma', 'React', 'Chart.js'], projectUrl: '#', githubUrl: '#'
        }
    ];

    const filters = [
        { id: 'all', name: 'All' },
        { id: 'branding', name: 'Branding' },
        { id: 'web', name: 'Web' },
        { id: 'mobile', name: 'Mobile' },
        { id: 'print', name: 'Print' }
    ];

    const filtered = activeFilter === 'all' ? portfolioItems : portfolioItems.filter(item => item.category === activeFilter);
    
    /* ------------- carousel logic ------------- */
    const slideWidth = 340; // card + gap
    const totalSlides = filtered.length;

    // Create extended slides with clones for infinite effect
    const extendedSlides = [
        ...filtered,
        ...filtered,
        ...filtered
    ];

    const [currentIndex, setCurrentIndex] = useState(totalSlides); // Start in the middle section
    const [isTransitioning, setIsTransitioning] = useState(true);

    useEffect(() => {
        // Reset to middle section when filter changes
        setCurrentIndex(totalSlides);
    }, [activeFilter, totalSlides]);

    useEffect(() => {
        if (!isHovering && totalSlides > 0) {
            const interval = setInterval(() => {
                nextSlide();
            }, 4000);
            return () => clearInterval(interval);
        }
    }, [isHovering, totalSlides]);

    const prevSlide = () => {
        setIsTransitioning(true);
        setCurrentIndex(prev => prev - 1);
    };

    const nextSlide = () => {
        setIsTransitioning(true);
        setCurrentIndex(prev => prev + 1);
    };

    // Handle seamless transition when reaching the end
    useEffect(() => {
        // If we're at the beginning of the extended slides, jump to the middle section
        if (currentIndex === 0) {
            // Set without transition for instant jump
            setIsTransitioning(false);
            setCurrentIndex(totalSlides);
        }
        // If we're at the end of the extended slides, jump to the middle section
        else if (currentIndex >= totalSlides * 2) {
            setIsTransitioning(false);
            setCurrentIndex(totalSlides);
        }
    }, [currentIndex, totalSlides]);

    // Calculate the real index for dots display
    const realIndex = currentIndex % totalSlides;

    /* ------------- animations ------------- */
    const fadeIn = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7 } } };
    const stagger = { visible: { transition: { staggerChildren: 0.12 } } };

    return (
        <section id="portfolio" className="py-12 px-10 bg-gradient-to-b from-black via-[#0d1117] to-black text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* heading */}
                <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeIn} className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-white">
                        Selected Works
                    </h2>
                    <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
                        Swipe or drag through recent projects. Click any card to view details.
                    </p>
                </motion.div>

                {/* filter pills */}
                <motion.div
                    initial="hidden"
                    animate={inView ? 'visible' : 'hidden'}
                    variants={fadeIn}
                    className="flex flex-wrap justify-center gap-3 mb-10"
                >
                    {filters.map(f => (
                        <button
                            key={f.id}
                            onClick={() => setActiveFilter(f.id)}
                            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${activeFilter === f.id ? 'bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-lg' : 'bg-white/10 hover:bg-white/20 text-gray-300'}`}
                        >
                            {f.name}
                        </button>
                    ))}
                </motion.div>

                {/* carousel wrapper */}
                <div
                    className="relative"
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                >
                    {/* track */}
                    <div ref={carouselRef} className="overflow-hidden">
                        <motion.div
                            animate={{ x: -currentIndex * slideWidth }}
                            transition={isTransitioning ? { type: "tween", ease: "easeInOut", duration: 0.5 } : { duration: 0 }}
                            className="flex gap-6"
                        >
                            {extendedSlides.map((item, idx) => (
                                <div key={`${item.id}-${idx}`} className="flex-shrink-0 w-80">
                                    <PortfolioCard item={item} />
                                </div>
                            ))}
                        </motion.div>
                    </div>

                    {/* arrows */}
                    {filtered.length > 0 && (
                        <>
                            <button
                                onClick={prevSlide}
                                aria-label="Previous"
                                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            <button
                                onClick={nextSlide}
                                aria-label="Next"
                                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        </>
                    )}

                    {/* dots */}
                    {filtered.length > 0 && (
                        <div className="flex justify-center mt-6 gap-2">
                            {filtered.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentIndex(i + totalSlides)}
                                    className={`w-2 h-2 rounded-full transition-all ${i === realIndex ? 'bg-cyan-400 w-6' : 'bg-gray-600 hover:bg-gray-400'}`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

/* ----------  single card component ---------- */
const PortfolioCard = ({ item }) => (
    <motion.div
        whileHover={{ scale: 1.03, rotateY: 5 }}
        className="group relative bg-gray-900/40 border border-white/10 rounded-2xl overflow-hidden shadow-lg hover:shadow-cyan-500/20 transition-shadow duration-300"
    >
        <div className="relative h-56 overflow-hidden">
            <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <div className="flex gap-3">
                    <a href={item.projectUrl} className="p-2 rounded-full bg-white/20 backdrop-blur hover:bg-white/30"><Eye className="w-5 h-5" /></a>
                    <a href={item.githubUrl} className="p-2 rounded-full bg-white/20 backdrop-blur hover:bg-white/30"><Github className="w-5 h-5" /></a>
                </div>
            </div>
        </div>
        <div className="p-5">
            <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
            <p className="text-gray-400 text-sm mb-3">{item.description}</p>
            <div className="flex flex-wrap gap-2">
                {item.technologies.map(t => (
                    <span key={t} className="px-2 py-1 bg-white/10 text-gray-300 text-xs rounded-full">{t}</span>
                ))}
            </div>
        </div>
    </motion.div>
);

export default Portfolio;