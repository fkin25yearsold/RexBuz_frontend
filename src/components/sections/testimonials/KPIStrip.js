import React, { useEffect, useState, useRef } from 'react';

const CountUpStat = ({ target, prefix = '', suffix = '', duration = 2000 }) => {
  const [current, setCurrent] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible || !target) return;
    
    let startTime;
    // Extract numeric value from string (e.g., "82,40,00,000" -> 824000000)
    const targetValue = typeof target === 'string' 
      ? parseFloat(target.replace(/[^0-9.]/g, '')) 
      : target;
    
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      setCurrent(Math.floor(targetValue * progress));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [isVisible, target, duration]);

  const formatNumber = (num) => {
    if (num >= 10000000) { // 1 crore
      return `${(num / 10000000).toFixed(1)} Cr`;
    } else if (num >= 100000) { // 1 lakh
      return `${(num / 100000).toFixed(1)} L`;
    } else if (num >= 1000) { // 1 thousand
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toLocaleString('en-IN');
  };

  return (
    <span ref={elementRef}>
      {prefix}{formatNumber(current)}{suffix}
    </span>
  );
};

const StatItem = ({ icon, value, label, prefix = '', suffix = '' }) => (
  <div className="flex flex-col items-center gap-2 min-w-[200px] px-6 py-4">
    <div className="flex items-center gap-3">
      {icon}
      <div className="text-center">
        <p className="text-2xl lg:text-3xl font-bold text-white">
          <CountUpStat target={value} prefix={prefix} suffix={suffix} />
        </p>
        <p className="text-sm lg:text-base text-white/70 font-medium whitespace-nowrap">
          {label}
        </p>
      </div>
    </div>
  </div>
);

const KPIStrip = ({ stats }) => {
  if (!stats || Object.keys(stats).length === 0) {
    return null;
  }

  const kpiItems = [
    {
      icon: (
        <svg className="w-8 h-8 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 0h10a2 2 0 002-2v-2a2 2 0 00-2-2H9a2 2 0 00-2 2v2z" />
        </svg>
      ),
      value: stats.total_creator_earnings,
      label: 'creator earnings',
      prefix: '₹'
    },
    {
      icon: (
        <svg className="w-8 h-8 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12 9-12 3z" />
        </svg>
      ),
      value: stats.campaigns_launched,
      label: 'campaigns launched'
    },
    {
      icon: (
        <svg className="w-8 h-8 text-yellow-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      value: stats.average_brand_roi,
      label: 'avg brand ROI',
      suffix: ''
    },
    {
      icon: (
        <svg className="w-8 h-8 text-purple-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      value: stats.agency_delivery_improvement,
      label: 'faster delivery via agencies',
      suffix: ''
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 overflow-hidden transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">
        {/* Desktop Layout */}
        <div className="hidden lg:flex justify-center items-center gap-8">
          <div className="flex gap-8 text-center text-gray-800 dark:text-white/90 text-lg font-medium py-10 backdrop-blur-md bg-white/20 dark:bg-white/5 rounded-full shadow-inner px-12">
            {kpiItems.map((item, index) => (
              <StatItem key={index} {...item} />
            ))}
          </div>
        </div>

        {/* Mobile Layout - Horizontal Scroll */}
        <div className="lg:hidden">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">
            Platform Impact
          </h3>
          <div className="flex overflow-x-auto scrollbar-hide gap-6 pb-4 snap-x snap-mandatory">
            {kpiItems.map((item, index) => (
              <div key={index} className="snap-center flex-shrink-0">
                <div className="bg-white/20 dark:bg-white/5 backdrop-blur-md rounded-2xl shadow-inner p-6 min-w-[250px]">
                  <StatItem {...item} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Floating Elements */}
        <div className="hidden lg:block absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '0s' }} />
          <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl animate-float" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-1/3 left-1/3 w-20 h-20 bg-green-500/10 rounded-full blur-xl animate-float" style={{ animationDelay: '2s' }} />
        </div>
      </div>
    </section>
  );
};

export default KPIStrip;
