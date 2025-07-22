import React, { useEffect, useState } from 'react';

const FloatingConfetti = ({ delay = 0 }) => {
  const [position, setPosition] = useState({ x: Math.random() * 100, y: Math.random() * 100 });
  
  useEffect(() => {
    const interval = setInterval(() => {
      setPosition({ x: Math.random() * 100, y: Math.random() * 100 });
    }, 3000 + delay * 500);
    
    return () => clearInterval(interval);
  }, [delay]);

  return (
    <div 
      className="absolute w-3 h-3 bg-white/8 rotate-45 transition-all duration-[3000ms] ease-in-out"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        animationDelay: `${delay * 0.2}s`
      }}
    />
  );
};

const ParallaxStars = () => {
  const stars = Array.from({ length: 50 }, (_, i) => (
    <div
      key={i}
      className="absolute w-1 h-1 bg-white rounded-full opacity-20 animate-float"
      style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 3}s`,
        animationDuration: `${3 + Math.random() * 2}s`
      }}
    />
  ));

  return <div className="absolute inset-0 overflow-hidden">{stars}</div>;
};

const TestimonialsHero = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleJoinClick = () => {
    window.location.hash = 'signup';
  };

  return (
    <section className="relative flex flex-col items-center justify-center py-28 px-6 text-center overflow-hidden bg-gradient-to-br from-[#6F4BFF] to-[#9E00FF]">
      {/* Parallax background stars */}
      <ParallaxStars />
      
      {/* Floating confetti */}
      {Array.from({ length: 20 }, (_, i) => (
        <FloatingConfetti key={i} delay={i} />
      ))}

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto">
        <h1 
          className={`text-4xl lg:text-6xl font-extrabold tracking-tight text-white mb-4 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ animationDelay: '0.1s' }}
        >
          Real Results. Real Creators.
        </h1>
        
        <p 
          className={`text-lg lg:text-2xl text-white/80 max-w-2xl mx-auto mb-10 transition-all duration-700 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          See how Influbazzar unlocks earnings, ROI and rapid growth across our creator, brand and agency community.
        </p>
        
        <button
          onClick={handleJoinClick}
          className={`px-8 py-4 bg-white text-[#6F4BFF] font-semibold rounded-2xl shadow-lg hover:scale-105 transition-all duration-300 inline-flex items-center gap-2 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ animationDelay: '0.5s' }}
        >
          Join the Success
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

export default TestimonialsHero;
