import React, { useEffect, useState } from 'react';

const CountUpKPI = ({ target, suffix = '', duration = 1000 }) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!target) return;
    
    let startTime;
    const targetValue = parseFloat(target.toString().replace(/[^0-9.]/g, ''));
    
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = (timestamp - startTime) / duration;
      
      if (progress < 1) {
        setCurrent(targetValue * progress);
        requestAnimationFrame(animate);
      } else {
        setCurrent(targetValue);
      }
    };
    
    requestAnimationFrame(animate);
  }, [target, duration]);

  const formatValue = () => {
    if (target.toString().includes('x')) {
      return `${current.toFixed(2)}x`;
    } else if (target.toString().includes('%')) {
      return `${current.toFixed(1)}%`;
    } else if (target.toString().includes('K')) {
      return `+${current.toFixed(1)}K`;
    }
    return current.toFixed(0);
  };

  return <span>{formatValue()}{suffix}</span>;
};

const CaseStudyModal = ({ study, isOpen, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      document.body.style.overflow = 'hidden';
    } else {
      setIsVisible(false);
      document.body.style.overflow = 'unset';
    }

    // Handle ESC key
    const handleEscKey = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !study) return null;

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
          <div className="lg:grid lg:grid-cols-[420px_1fr] gap-10 p-10">
            {/* Left Side - Hero Image */}
            <div className="mb-8 lg:mb-0">
              <img 
                src={study.hero_img} 
                alt={`${study.brand_name} campaign`}
                className="w-full rounded-2xl shadow-lg object-cover"
                style={{ aspectRatio: '4/3' }}
              />
            </div>

            {/* Right Side - Content */}
            <div>
              {/* Breadcrumb */}
              <div className="text-white/60 text-sm mb-4">
                Case Study / {study.brand_name}
              </div>

              {/* Heading */}
              <h2 className="text-3xl font-bold text-white mb-6">
                {study.brand_name}: {study.hashtag} Campaign
              </h2>

              {/* Tag pills */}
              <div className="flex gap-2 mb-6">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  study.size === 'micro' 
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                    : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                }`}>
                  {study.size === 'micro' ? 'Micro-Influencer' : 'Macro-Influencer'}
                </span>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30 capitalize">
                  {study.category}
                </span>
              </div>

              {/* Story */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-white mb-4">Campaign Story</h3>
                <p className="text-white/80 leading-relaxed">
                  {study.story_long}
                </p>
              </div>

              {/* Creator Info */}
              <div className="bg-[#2A2438] rounded-2xl p-6 mb-8">
                <h4 className="text-lg font-semibold text-white mb-4">Featured Creator</h4>
                <div className="flex items-center gap-4">
                  <img 
                    src={study.creator_photo} 
                    alt={study.creator_name}
                    className="w-16 h-16 rounded-full object-cover ring-2 ring-purple-500/30"
                  />
                  <div>
                    <p className="text-white font-medium">{study.creator_name}</p>
                    <p className="text-white/60 text-sm">{study.creator_followers} followers</p>
                    <p className="text-purple-400 text-sm italic">"{study.short_quote}"</p>
                  </div>
                </div>
              </div>

              {/* KPI Strip with Count-up Animation */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-[#2A2438] rounded-2xl p-4 text-center">
                  <div className="text-2xl font-bold text-green-400 mb-1">
                    <CountUpKPI target={study.kpi_sales_multiplier} />
                  </div>
                  <p className="text-white/70 text-sm">Sales Multiplier</p>
                </div>

                <div className="bg-[#2A2438] rounded-2xl p-4 text-center">
                  <div className="text-2xl font-bold text-blue-400 mb-1">
                    <CountUpKPI target={study.kpi_ctr} />
                  </div>
                  <p className="text-white/70 text-sm">CTR</p>
                </div>

                <div className="bg-[#2A2438] rounded-2xl p-4 text-center">
                  <div className="text-2xl font-bold text-purple-400 mb-1">
                    <CountUpKPI target={study.kpi_followers_gain} />
                  </div>
                  <p className="text-white/70 text-sm">Followers Gained</p>
                </div>
              </div>

              {/* Publication Date */}
              <div className="mt-8 pt-6 border-t border-white/10">
                <p className="text-white/60 text-sm">
                  Published: {new Date(study.publish_date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="border-t border-white/10 p-6 bg-[#242033] flex gap-4 justify-end">
            <button 
              onClick={() => window.location.hash = 'contact'}
              className="px-6 py-2 bg-[#7C3AED] text-white rounded-xl hover:bg-[#8B5CF6] transition-colors duration-200"
            >
              Start Similar Campaign
            </button>
            <button 
              onClick={onClose}
              className="px-6 py-2 bg-[#2A2640] text-white/80 rounded-xl hover:bg-[#363155] transition-colors duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseStudyModal;
