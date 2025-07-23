import React, { useState, useEffect, useRef } from 'react';

const CreatorCard = ({ creator, onReadMore }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="w-80 bg-white dark:bg-dark-card rounded-3xl p-6 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer flex-shrink-0"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onReadMore(creator)}
    >
      {/* Creator Avatar and Name */}
      <div className="flex items-center gap-4 mb-4">
        <div className="relative">
          <img 
            src={creator.avatar} 
            alt={creator.name}
            className="w-14 h-14 rounded-full ring-2 ring-[#7C3AED] object-cover"
          />
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-[#1F1B2E]" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{creator.name}</h3>
          <p className="text-purple-600 dark:text-purple-300 text-sm">{creator.niche}</p>
        </div>
      </div>

      {/* Quote */}
      <blockquote className="text-gray-700 dark:text-white/80 italic mb-6 line-clamp-3 leading-relaxed">
        "{creator.quote}"
      </blockquote>

      {/* Metrics */}
      <div className="flex flex-wrap gap-2 mb-4">
        <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full text-sm">
          <svg className="w-4 h-4 text-green-500 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 0h10a2 2 0 002-2v-2a2 2 0 00-2-2H9a2 2 0 00-2 2v2z" />
          </svg>
          <span className="text-gray-900 dark:text-white font-medium">₹{creator.earnings_total}</span>
        </div>

        <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full text-sm">
          <svg className="w-4 h-4 text-blue-500 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12 9-12 3z" />
          </svg>
          <span className="text-gray-900 dark:text-white font-medium">{creator.campaign_count}</span>
        </div>

        <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full text-sm">
          <svg className="w-4 h-4 text-yellow-500 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span className="text-gray-900 dark:text-white font-medium">{creator.avg_engagement}%</span>
        </div>
      </div>

      {/* Read More Button */}
      <button
        className={`w-full text-purple-600 dark:text-purple-300 hover:text-purple-800 dark:hover:text-white transition-colors duration-200 flex items-center justify-center gap-2 py-2 ${
          isHovered ? 'text-purple-800 dark:text-white' : ''
        }`}
      >
        Read full case study
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </button>
    </div>
  );
};

const CreatorStoriesCarousel = ({ creators, onCreatorStoryClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const scrollRef = useRef(null);
  const intervalRef = useRef(null);

  // Auto-scroll functionality
  useEffect(() => {
    if (isAutoScrolling && creators.length > 0) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => 
          prevIndex >= creators.length - 1 ? 0 : prevIndex + 1
        );
      }, 6000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isAutoScrolling, creators.length]);

  // Handle manual scroll
  const handleScroll = () => {
    if (!scrollRef.current) return;
    
    const scrollLeft = scrollRef.current.scrollLeft;
    const cardWidth = 320 + 24; // Card width + gap
    const newIndex = Math.round(scrollLeft / cardWidth);
    setCurrentIndex(newIndex);
  };

  // Scroll to specific index
  const scrollToIndex = (index) => {
    if (!scrollRef.current) return;
    
    const cardWidth = 320 + 24; // Card width + gap
    scrollRef.current.scrollTo({
      left: index * cardWidth,
      behavior: 'smooth'
    });
  };

  // Auto-scroll effect
  useEffect(() => {
    scrollToIndex(currentIndex);
  }, [currentIndex]);

  const handleMouseEnter = () => {
    setIsAutoScrolling(false);
  };

  const handleMouseLeave = () => {
    setIsAutoScrolling(true);
  };

  const handleCreatorClick = (creator) => {
    setIsAutoScrolling(false);
    onCreatorStoryClick(creator);
  };

  if (!creators || creators.length === 0) {
    return (
      <section className="py-24 bg-gray-50 dark:bg-dark-bg transition-colors duration-300">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-white/80">Loading creator stories...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-gray-50 dark:bg-dark-bg transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Success from the Creator's Seat
          </h2>
          <p className="text-lg text-gray-600 dark:text-white/70 max-w-2xl mx-auto">
            Real stories from creators who transformed their passion into profitable careers
          </p>
        </div>

        {/* Carousel Container */}
        <div 
          className="relative"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Cards Container */}
          <div 
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory pb-4"
            onScroll={handleScroll}
            style={{ 
              scrollSnapType: 'x mandatory',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}
          >
            {creators.map((creator) => (
              <div key={creator.id} className="snap-center">
                <CreatorCard 
                  creator={creator} 
                  onReadMore={handleCreatorClick}
                />
              </div>
            ))}
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {creators.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentIndex(index);
                  setIsAutoScrolling(false);
                  setTimeout(() => setIsAutoScrolling(true), 3000);
                }}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  currentIndex === index 
                    ? 'bg-purple-500 w-8' 
                    : 'bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>

          {/* Auto-scroll indicator */}
          {isAutoScrolling && (
            <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/30 backdrop-blur-sm rounded-full px-3 py-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-white/70 text-sm">Auto-scroll</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CreatorStoriesCarousel;
