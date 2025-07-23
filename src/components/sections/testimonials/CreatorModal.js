import React, { useEffect, useState } from 'react';

const CountUpNumber = ({ target, duration = 800, prefix = '', suffix = '' }) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!target) return;
    
    let startTime;
    const targetValue = typeof target === 'string' ? parseFloat(target.replace(/,/g, '')) : target;
    
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = (timestamp - startTime) / duration;
      
      if (progress < 1) {
        setCurrent(Math.floor(targetValue * progress));
        requestAnimationFrame(animate);
      } else {
        setCurrent(targetValue);
      }
    };
    
    requestAnimationFrame(animate);
  }, [target, duration]);

  const formatNumber = (num) => {
    return num.toLocaleString('en-IN');
  };

  return (
    <span>
      {prefix}{formatNumber(current)}{suffix}
    </span>
  );
};

const CreatorModal = ({ creator, isOpen, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      document.body.style.overflow = 'hidden';
    } else {
      setIsVisible(false);
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !creator) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
        isVisible ? 'bg-black/80 backdrop-blur-sm' : 'bg-transparent'
      }`}
      onClick={handleBackdropClick}
    >
      <div 
        className={`relative w-full max-w-6xl max-h-[90vh] bg-[#1F1B2E] rounded-3xl overflow-hidden transition-all duration-500 ${
          isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-10 w-10 h-10 bg-black/30 hover:bg-black/50 rounded-full flex items-center justify-center transition-colors duration-200"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="overflow-y-auto max-h-[90vh]">
          {/* Main Content Grid */}
          <div className="lg:grid lg:grid-cols-[380px_1fr] min-h-[500px]">
            {/* Left Side - Hero Image */}
            <div className="relative bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center p-8">
              <div className="text-center text-white">
                <img 
                  src={creator.avatar} 
                  alt={creator.name}
                  className="w-32 h-32 rounded-full mx-auto mb-6 ring-4 ring-white/30 object-cover"
                />
                <h2 className="text-3xl font-bold mb-2">{creator.name}</h2>
                <p className="text-purple-100 mb-4">{creator.niche} Creator</p>
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                  <p className="text-2xl font-bold">₹{creator.earnings_total}</p>
                  <p className="text-sm text-purple-100">Total Earnings</p>
                </div>
              </div>
              
              {/* Decorative Elements */}
              <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl" />
              <div className="absolute bottom-10 right-10 w-32 h-32 bg-pink-400/20 rounded-full blur-2xl" />
            </div>

            {/* Right Side - Content */}
            <div className="p-8 lg:p-12">
              {/* Story Header */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-white mb-4">Creator Success Story</h3>
                <div className="flex items-center gap-4 text-sm text-white/70 mb-6">
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {creator.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {creator.followers} Followers
                  </span>
                </div>
              </div>

              {/* Long Story */}
              <div className="mb-8">
                <p className="text-white/80 leading-relaxed text-lg">
                  {creator.story_long}
                </p>
              </div>

              {/* KPI Strip with Count-up Animation */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#2A2438] rounded-2xl p-6 text-center">
                  <div className="text-3xl font-bold text-green-400 mb-2">
                    <CountUpNumber 
                      target={creator.roi_metrics.current_monthly} 
                      prefix="₹" 
                    />
                  </div>
                  <p className="text-white/70 text-sm">Monthly Earnings</p>
                  <p className="text-xs text-green-400 mt-1">
                    +{Math.round(((creator.roi_metrics.current_monthly - creator.roi_metrics.before_joining) / creator.roi_metrics.before_joining) * 100)}% growth
                  </p>
                </div>

                <div className="bg-[#2A2438] rounded-2xl p-6 text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-2">
                    <CountUpNumber 
                      target={creator.roi_metrics.avg_cpm} 
                      prefix="₹" 
                    />
                  </div>
                  <p className="text-white/70 text-sm">Average CPM</p>
                  <p className="text-xs text-blue-400 mt-1">Per 1000 views</p>
                </div>

                <div className="bg-[#2A2438] rounded-2xl p-6 text-center">
                  <div className="text-3xl font-bold text-purple-400 mb-2">
                    {creator.roi_metrics.follower_growth}
                  </div>
                  <p className="text-white/70 text-sm">Follower Growth</p>
                  <p className="text-xs text-purple-400 mt-1">Since joining</p>
                </div>
              </div>

              {/* Additional Metrics */}
              <div className="mt-8 pt-8 border-t border-white/10">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-white">
                      <CountUpNumber target={creator.campaign_count} />
                    </p>
                    <p className="text-white/70 text-sm">Campaigns Completed</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">
                      <CountUpNumber target={creator.avg_engagement} suffix="%" />
                    </p>
                    <p className="text-white/70 text-sm">Avg Engagement Rate</p>
                  </div>
                </div>
              </div>

              {/* Call to Action */}
              <div className="mt-8 pt-8 border-t border-white/10">
                <button 
                  onClick={() => window.location.hash = 'signup'}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 px-6 rounded-2xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  Start Your Success Story
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatorModal;
