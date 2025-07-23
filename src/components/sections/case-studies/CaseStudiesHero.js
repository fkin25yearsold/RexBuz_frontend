import React, { useEffect, useState } from 'react';

const FloatingTriangle = ({ delay = 0 }) => {
  const [position, setPosition] = useState({ 
    x: Math.random() * 100, 
    y: Math.random() * 100,
    rotation: Math.random() * 360 
  });
  
  useEffect(() => {
    const interval = setInterval(() => {
      setPosition({ 
        x: Math.random() * 100, 
        y: Math.random() * 100,
        rotation: Math.random() * 360 
      });
    }, 4000 + delay * 500);
    
    return () => clearInterval(interval);
  }, [delay]);

  return (
    <div 
      className="absolute w-4 h-4 opacity-7 transition-all duration-[4000ms] ease-in-out"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: `rotate(${position.rotation}deg)`,
        animationDelay: `${delay * 0.3}s`
      }}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" className="text-white">
        <polygon points="8,2 14,12 2,12" fill="currentColor" fillOpacity="0.07" />
      </svg>
    </div>
  );
};

const StarBurst = () => (
  <div className="absolute top-8 right-8 opacity-10">
    <svg width="80" height="80" viewBox="0 0 80 80" className="text-white animate-pulse">
      <g fill="currentColor">
        <path d="M40 0 L42 38 L80 40 L42 42 L40 80 L38 42 L0 40 L38 38 Z" />
        <circle cx="40" cy="40" r="3" />
      </g>
    </svg>
  </div>
);

const CaseStudiesHero = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleStartStoryClick = () => {
    window.location.hash = 'signup';
  };

  return (
    <section className="relative flex flex-col items-center justify-center py-24 md:py-32 px-6 text-center overflow-hidden bg-gradient-to-br from-[#6F4BFF] to-[#A100FF]">
      {/* Parallax floating triangles */}
      {Array.from({ length: 25 }, (_, i) => (
        <FloatingTriangle key={i} delay={i} />
      ))}
      
      {/* Star-burst SVG */}
      <StarBurst />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto">
        <h1 
          className={`text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-4 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          Campaigns That Move Markets
        </h1>
        
        <p 
          className={`text-lg md:text-2xl text-white/80 max-w-2xl mx-auto mb-8 transition-all duration-700 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          See proven playbooks from creators and brands who used Influbazzar to drive real revenue and reach.
        </p>
        
        <button
          onClick={handleStartStoryClick}
          className={`mt-8 px-8 py-4 bg-white text-[#6F4BFF] rounded-2xl font-semibold shadow-lg hover:scale-105 transition-all duration-300 inline-flex items-center gap-2 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ animationDelay: '0.4s' }}
        >
          Start Your Success Story
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </button>
      </div>

      {/* Bottom gradient overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white dark:from-dark-bg to-transparent" />
    </section>
  );
};

export default CaseStudiesHero;
