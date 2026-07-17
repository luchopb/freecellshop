import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Import our 4 banners
import banner1 from '../assets/images/banner1.jpg';
import banner2 from '../assets/images/banner2.jpg';
import banner3 from '../assets/images/banner3.jpg';
import banner4 from '../assets/images/banner4.png';

const BANNER_IMAGES = [
  banner1,
  banner2,
  banner3,
  banner4
];

export default function PromoSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);

  // Auto-advance slide every 5 seconds
  useEffect(() => {
    if (!isAutoplay) return;
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % BANNER_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isAutoplay]);

  const handlePrev = () => {
    setIsAutoplay(false);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + BANNER_IMAGES.length) % BANNER_IMAGES.length);
  };

  const handleNext = () => {
    setIsAutoplay(false);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % BANNER_IMAGES.length);
  };

  return (
    <section className="w-full bg-[#050507] pt-20 pb-4 relative" id="home">
      <div className="w-full">
        
        {/* Main Slider Panel Container */}
        <div 
          className="relative overflow-hidden shadow-2xl border-b border-zinc-950 select-none aspect-[21/9] sm:aspect-[24/10] md:aspect-[21/8] lg:aspect-[21/7]"
          onMouseEnter={() => setIsAutoplay(false)}
          onMouseLeave={() => setIsAutoplay(true)}
        >
          
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full"
            >
              <img
                src={BANNER_IMAGES[currentIndex]}
                alt={`Banner Promocional ${currentIndex + 1}`}
                className="w-full h-full object-cover select-none pointer-events-none"
                referrerPolicy="no-referrer"
              />
              
              {/* Subtle top/bottom shadow gradients to integrate beautifully with dark layout */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30 pointer-events-none" />
            </motion.div>
          </AnimatePresence>

          {/* Slider Navigation Arrows - Hidden on mobile, shown on hover/sm screens */}
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/60 hover:bg-[#9EFF00] border border-zinc-800 text-white hover:text-black shadow-lg flex items-center justify-center transition-all cursor-pointer backdrop-blur-sm"
            aria-label="Anterior banner"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/60 hover:bg-[#9EFF00] border border-zinc-800 text-white hover:text-black shadow-lg flex items-center justify-center transition-all cursor-pointer backdrop-blur-sm"
            aria-label="Siguiente banner"
          >
            <ChevronRight className="w-5 h-5 stroke-[2.5]" />
          </button>

          {/* Dots Indicator in bottom-center */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2.5 bg-black/40 px-3.5 py-1.5 rounded-full backdrop-blur-md border border-white/5">
            {BANNER_IMAGES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setIsAutoplay(false);
                  setCurrentIndex(idx);
                }}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-350 cursor-pointer ${
                  currentIndex === idx 
                    ? 'bg-[#9EFF00] scale-110 shadow-sm' 
                    : 'bg-zinc-650 hover:bg-zinc-400'
                }`}
                title={`Ver banner ${idx + 1}`}
              />
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
