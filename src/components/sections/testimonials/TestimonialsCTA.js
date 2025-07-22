import React, { useEffect, useState } from 'react';

const SparkleAnimation = ({ delay = 0 }) => {
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setOpacity(1);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div 
      className="absolute transition-opacity duration-1000"
      style={{ 
        opacity,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDelay: `${delay}ms`
      }}
    >
      <svg 
        className="w-4 h-4 text-white/30 animate-pulse" 
        fill="currentColor" 
        viewBox="0 0 20 20"
        style={{ animationDuration: `${2 + Math.random() * 2}s` }}
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    </div>
  );
};

const PulseButton = ({ onClick, children, className = '', isPrimary = true }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        relative font-semibold py-4 px-8 rounded-2xl transition-all duration-300 flex items-center gap-3 group
        ${isPrimary 
          ? 'bg-white text-[#7C3AED] hover:bg-gray-100 hover:scale-105 shadow-lg hover:shadow-xl animate-pulse-glow' 
          : 'bg-transparent text-white border-2 border-white/30 hover:border-white/60 hover:bg-white/10'
        }
        ${className}
      `}
    >
      {children}
      
      {isPrimary && isHovered && (
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-400/20 to-pink-400/20 animate-pulse" />
      )}
    </button>
  );
};

const TestimonialsCTA = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const handleSignupClick = () => {
    window.location.hash = 'signup';
  };

  const handleTalkToSalesClick = () => {
    window.location.hash = 'contact';
  };

  return (
    <section className="relative py-20 bg-[#7C3AED] text-center text-white overflow-hidden">
      {/* Background sparkles */}
      <div className="absolute inset-0">
        {Array.from({ length: 30 }, (_, i) => (
          <SparkleAnimation key={i} delay={i * 200} />
        ))}
      </div>

      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#7C3AED] via-[#8B5CF6] to-[#A855F7]" />

      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '0s' }} />
        <div className="absolute top-1/2 -right-10 w-32 h-32 bg-pink-300/20 rounded-full blur-2xl animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute -bottom-10 left-1/3 w-36 h-36 bg-blue-300/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6">
        {/* Main Heading */}
        <h2 
          className={`text-4xl lg:text-5xl font-bold mb-8 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          Start writing your own success story today.
        </h2>

        {/* Subheading */}
        <p 
          className={`text-lg lg:text-xl text-white/90 mb-12 max-w-2xl mx-auto transition-all duration-700 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          Join thousands of creators, brands, and agencies who are already transforming their businesses with Influbazzar.
        </p>

        {/* CTA Buttons */}
        <div 
          className={`flex flex-col sm:flex-row gap-4 justify-center items-center transition-all duration-700 delay-400 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <PulseButton onClick={handleSignupClick} isPrimary={true}>
            Create Your Free Account
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </PulseButton>

          <PulseButton onClick={handleTalkToSalesClick} isPrimary={false}>
            Talk to Sales
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </PulseButton>
        </div>

        {/* Trust indicators */}
        <div 
          className={`mt-12 pt-8 border-t border-white/20 transition-all duration-700 delay-600 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <p className="text-white/70 text-sm mb-4">Trusted by</p>
          <div className="flex flex-wrap justify-center items-center gap-8 text-white/80">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>8,500+ Creators</span>
            </div>
            
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>1,200+ Brands</span>
            </div>
            
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>150+ Agencies</span>
            </div>
          </div>
        </div>

        {/* Security badge */}
        <div 
          className={`mt-8 transition-all duration-700 delay-800 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm">
            <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-white/90">Secure & Trusted Platform</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsCTA;
