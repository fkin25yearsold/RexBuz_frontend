import React, { useEffect, useState } from 'react';

const FloatingPolygon = ({ delay = 0, duration = 4000 }) => {
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
    }, duration);

    return () => clearInterval(interval);
  }, [duration]);

  return (
    <div 
      className="absolute opacity-10 transition-all ease-in-out pointer-events-none"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: `rotate(${position.rotation}deg)`,
        transitionDuration: `${duration}ms`,
        animationDelay: `${delay}ms`
      }}
    >
      <svg width="40" height="40" viewBox="0 0 40 40" className="text-purple-400">
        <polygon 
          points="20,5 35,15 35,25 20,35 5,25 5,15" 
          fill="currentColor" 
          fillOpacity="0.3"
          stroke="currentColor"
          strokeWidth="1"
        />
      </svg>
    </div>
  );
};

const CheckItem = ({ children, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div className={`flex items-start gap-3 transition-all duration-500 ${
      isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
    }`}>
      <div className="flex-shrink-0 mt-1">
        <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      </div>
      <p className="text-white/90 leading-relaxed">{children}</p>
    </div>
  );
};

const MetricCard = ({ title, value, subtitle, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div className={`bg-[#2A2438] rounded-xl p-4 text-center transition-all duration-500 ${
      isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'
    }`}>
      <h4 className="text-2xl font-bold text-white mb-1">{value}</h4>
      <p className="text-purple-300 text-sm font-medium">{title}</p>
      {subtitle && <p className="text-white/60 text-xs mt-1">{subtitle}</p>}
    </div>
  );
};

const AgencySpotlight = ({ agency }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  if (!agency) return null;

  const handleLearnMoreClick = () => {
    // In a real app, this would navigate to agency tools page
    window.location.hash = 'contact';
  };

  return (
    <section className="relative py-24 bg-gradient-to-r from-[#0F0C1A] to-[#182042] overflow-hidden">
      {/* Floating polygons background */}
      <div className="absolute inset-0">
        {Array.from({ length: 12 }, (_, i) => (
          <FloatingPolygon 
            key={i} 
            delay={i * 500} 
            duration={4000 + (i * 200)}
          />
        ))}
      </div>

      {/* Radial gradient mask */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(15, 12, 26, 0.3) 70%, rgba(15, 12, 26, 0.8) 100%)'
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="lg:grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Team Photo */}
          <div className="mb-12 lg:mb-0">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-2xl blur-xl transform group-hover:scale-105 transition-transform duration-500" />
              <img 
                src={agency.team_photo} 
                alt={`${agency.agency_name} team`}
                className={`relative z-10 w-full rounded-2xl shadow-xl transition-all duration-700 ${
                  imageLoaded ? 'opacity-100 hover:rotate-1' : 'opacity-0'
                }`}
                onLoad={() => setImageLoaded(true)}
              />
              
              {/* Loading placeholder */}
              {!imageLoaded && (
                <div className="absolute inset-0 bg-[#2A2438] rounded-2xl animate-pulse flex items-center justify-center">
                  <div className="text-white/50">Loading...</div>
                </div>
              )}

              {/* Agency logo overlay */}
              <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm rounded-lg p-3">
                <img 
                  src={agency.logo} 
                  alt={agency.agency_name}
                  className="w-12 h-12 rounded-lg object-cover"
                />
              </div>
            </div>
          </div>

          {/* Right Side - Content */}
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-8">
              Agencies scale faster with Influbazzar
            </h2>

            <div className="space-y-4 mb-8">
              {agency.achievements.map((achievement, index) => (
                <CheckItem key={index} delay={index * 200}>
                  {achievement}
                </CheckItem>
              ))}
            </div>

            {/* Agency Metrics */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <MetricCard 
                title="Creators"
                value={agency.metrics.creators_managed}
                subtitle="Under management"
                delay={0}
              />
              <MetricCard 
                title="Campaigns"
                value={agency.metrics.campaigns_executed}
                subtitle="Successfully executed"
                delay={200}
              />
              <MetricCard 
                title="Satisfaction"
                value={agency.metrics.client_satisfaction}
                subtitle="Client satisfaction rate"
                delay={400}
              />
              <MetricCard 
                title="Growth"
                value={agency.metrics.revenue_growth}
                subtitle="Revenue increase"
                delay={600}
              />
            </div>

            {/* Testimonial Quote */}
            <blockquote className="border-l-4 border-purple-500 pl-6 mb-8">
              <p className="text-lg italic text-white/90 mb-3">
                "{agency.quote}"
              </p>
              <footer className="text-purple-300">
                — {agency.contact_person}, {agency.designation}
              </footer>
            </blockquote>

            {/* CTA Button */}
            <button 
              onClick={handleLearnMoreClick}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 px-8 rounded-2xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 flex items-center gap-3 group"
            >
              Learn about Agency Tools
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AgencySpotlight;
