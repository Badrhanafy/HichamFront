import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import DarkVeil from './DarkVeil';

const useMedia = (queries, values, defaultValue) => {
  const get = () => values[queries.findIndex(q => matchMedia(q).matches)] ?? defaultValue;

  const [value, setValue] = useState(get);

  useEffect(() => {
    const handler = () => setValue(get);
    queries.forEach(q => matchMedia(q).addEventListener('change', handler));
    return () => queries.forEach(q => matchMedia(q).removeEventListener('change', handler));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queries]);

  return value;
};

const useMeasure = () => {
  const ref = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);

  return [ref, size];
};

const preloadImages = async urls => {
  await Promise.all(
    urls.map(
      src =>
        new Promise(resolve => {
          const img = new Image();
          img.src = src;
          img.onload = img.onerror = () => resolve();
        })
    )
  );
};

const Masonry = ({
  items,
  ease = 'power3.out',
  duration = 0.6,
  stagger = 0.05,
  animateFrom = 'bottom',
  scaleOnHover = true,
  hoverScale = 0.95,
  blurToFocus = true,
  colorShiftOnHover = false,
  onItemClick,
  enableShadows = true,
  enableBorders = false,
  cornerRadius = 12,
  hoverElevation = true
}) => {
  const columns = useMedia(
    ['(min-width:1500px)', '(min-width:1000px)', '(min-width:600px)', '(min-width:400px)'],
    [5, 4, 3, 2],
    1
  );

  const [containerRef, { width }] = useMeasure();
  const [imagesReady, setImagesReady] = useState(false);
  const [hoveredId, setHoveredId] = useState(null);

  const getInitialPosition = item => {
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return { x: item.x, y: item.y };

    let direction = animateFrom;
    if (animateFrom === 'random') {
      const dirs = ['top', 'bottom', 'left', 'right'];
      direction = dirs[Math.floor(Math.random() * dirs.length)];
    }

    switch (direction) {
      case 'top':
        return { x: item.x, y: -200 };
      case 'bottom':
        return { x: item.x, y: window.innerHeight + 200 };
      case 'left':
        return { x: -200, y: item.y };
      case 'right':
        return { x: window.innerWidth + 200, y: item.y };
      case 'center':
        return {
          x: containerRect.width / 2 - item.w / 2,
          y: containerRect.height / 2 - item.h / 2
        };
      default:
        return { x: item.x, y: item.y + 100 };
    }
  };

  useEffect(() => {
    preloadImages(items.map(i => i.img)).then(() => setImagesReady(true));
  }, [items]);

  const grid = useMemo(() => {
    if (!width) return [];
    const colHeights = new Array(columns).fill(0);
    const gap = 20; // Slightly increased gap for better separation
    const totalGaps = (columns - 1) * gap;
    const columnWidth = (width - totalGaps) / columns;

    return items.map(child => {
      const col = colHeights.indexOf(Math.min(...colHeights));
      const x = col * (columnWidth + gap);
      const height = child.height / 2;
      const y = colHeights[col];

      colHeights[col] += height + gap;
      return { ...child, x, y, w: columnWidth, h: height };
    });
  }, [columns, items, width]);

  const hasMounted = useRef(false);

  useLayoutEffect(() => {
    if (!imagesReady) return;

    grid.forEach((item, index) => {
      const selector = `[data-key="${item.id}"]`;
      const animProps = { x: item.x, y: item.y, width: item.w, height: item.h };

      if (!hasMounted.current) {
        const start = getInitialPosition(item);
        gsap.fromTo(
          selector,
          {
            opacity: 0,
            x: start.x,
            y: start.y,
            width: item.w,
            height: item.h,
            ...(blurToFocus && { filter: 'blur(10px)' })
          },
          {
            opacity: 1,
            ...animProps,
            ...(blurToFocus && { filter: 'blur(0px)' }),
            duration: 0.8,
            ease: 'power3.out',
            delay: index * stagger
          }
        );
      } else {
        gsap.to(selector, {
          ...animProps,
          duration,
          ease,
          overwrite: 'auto'
        });
      }
    });

    hasMounted.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grid, imagesReady, stagger, animateFrom, blurToFocus, duration, ease]);

  const handleMouseEnter = (id, element) => {
    setHoveredId(id);
    if (scaleOnHover) {
      gsap.to(`[data-key="${id}"]`, {
        scale: hoverScale,
        duration: 0.3,
        ease: 'power2.out'
      });
    }
    if (colorShiftOnHover) {
      const overlay = element.querySelector('.color-overlay');
      if (overlay) gsap.to(overlay, { opacity: 0.3, duration: 0.3 });
    }
    if (hoverElevation) {
      gsap.to(`[data-key="${id}"]`, {
        y: -8,
        duration: 0.3,
        ease: 'power2.out'
      });
    }
  };

  const handleMouseLeave = (id, element) => {
    setHoveredId(null);
    if (scaleOnHover) {
      gsap.to(`[data-key="${id}"]`, {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out'
      });
    }
    if (colorShiftOnHover) {
      const overlay = element.querySelector('.color-overlay');
      if (overlay) gsap.to(overlay, { opacity: 0, duration: 0.3 });
    }
    if (hoverElevation) {
      gsap.to(`[data-key="${id}"]`, {
        y: 0,
        duration: 0.3,
        ease: 'power2.out'
      });
    }
  };

  const handleItemClick = (item) => {
    if (onItemClick) {
      onItemClick(item.id);
    }
  };

  const getShadowStyle = (isHovered) => {
    if (!enableShadows) return {};
    
    return {
      boxShadow: isHovered 
        ? '0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)'
        : '0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.05)'
    };
  };

  const getBorderStyle = () => {
    if (!enableBorders) return {};
    
    return {
      border: '1px solid rgba(255, 255, 255, 0.1)'
    };
  };

  return (
    <div ref={containerRef} className="relative w-full h-auto bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen p-4">
      {grid.map(item => {
        const isHovered = hoveredId === item.id;
        
        return (
          <div
            key={item.id}
            data-key={item.id}
            className="absolute transition-all duration-300 cursor-pointer transform-gpu"
            style={{ 
              willChange: 'transform, width, height, opacity',
              ...getShadowStyle(isHovered),
              borderRadius: cornerRadius
            }}
            onClick={() => handleItemClick(item)}
            onMouseEnter={e => handleMouseEnter(item.id, e.currentTarget)}
            onMouseLeave={e => handleMouseLeave(item.id, e.currentTarget)}
          >
            <div
              className="relative bg-cover bg-center overflow-hidden transform-gpu"
              style={{
                backgroundImage: `url(${item.img})`,
                aspectRatio: "3 / 4",
                width: "100%",
                height: "auto",
                borderRadius: cornerRadius - 2,
                ...getBorderStyle()
              }}
            >
              {/* Enhanced overlay with gradient and project info */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-6">
                <div className="transform translate-y-4 hover:translate-y-0 transition-transform duration-300">
                  <span className="text-white text-lg font-bold block mb-2 tracking-wide">
                    {item.projectData?.title || `Project ${item.id}`}
                  </span>
                  {item.projectData?.description && (
                    <p className="text-gray-300 text-sm font-light mb-3 line-clamp-2">
                      {item.projectData.description}
                    </p>
                  )}
                  {item.projectData?.tags && (
                    <div className="flex flex-wrap gap-1">
                      {item.projectData.tags.slice(0, 3).map((tag, index) => (
                        <span 
                          key={index}
                          className="text-xs bg-white/20 text-white px-2 py-1 rounded-full backdrop-blur-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Subtle corner accent */}
              <div className="absolute top-0 left-0 w-12 h-12 bg-gradient-to-br from-blue-500/20 to-transparent rounded-tl-[10px] pointer-events-none" />
              
              {colorShiftOnHover && (
                <div className="color-overlay absolute inset-0 bg-gradient-to-tr from-pink-500/30 via-purple-500/20 to-sky-500/30 opacity-0 pointer-events-none transition-opacity duration-300" />
              )}
              
              {/* Loading shimmer effect */}
              {!imagesReady && (
                <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse" />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Masonry;