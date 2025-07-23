import React, { useState, useEffect, useRef } from 'react';

const CaseStudyCardSkeleton = () => (
  <div className="bg-white dark:bg-dark-card rounded-3xl overflow-hidden shadow-xl animate-pulse" style={{ height: '260px' }}>
    <div className="h-40 bg-gray-300 dark:bg-gray-700" />
    <div className="p-5 space-y-3">
      <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded w-3/4" />
      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2" />
      <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-full" />
      <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-4/5" />
      <div className="flex justify-between mt-4">
        <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/3" />
        <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-4" />
      </div>
    </div>
  </div>
);

const CaseStudyCard = ({ study, onCardClick }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleCardClick = () => {
    onCardClick(study);
  };

  return (
    <div 
      ref={cardRef}
      data-case-card="true"
      data-size={study.size}
      data-category={study.category}
      className={`relative group bg-white dark:bg-dark-card rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer ripple-hover ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
      onClick={handleCardClick}
      style={{ minHeight: '260px' }}
    >
      {/* Creator Photo */}
      <div className="h-40 w-full relative overflow-hidden">
        {isVisible && (
          <img 
            src={study.creator_photo} 
            alt={study.creator_name}
            className={`h-40 w-full object-cover transition-all duration-500 group-hover:scale-105 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
            loading="lazy"
          />
        )}
        {!imageLoaded && (
          <div className="h-40 w-full bg-gray-300 dark:bg-gray-700 animate-pulse flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
          </div>
        )}
        
        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            study.size === 'micro' 
              ? 'bg-green-500/90 text-white' 
              : 'bg-purple-500/90 text-white'
          }`}>
            {study.size === 'micro' ? 'Micro' : 'Macro'}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="flex flex-col gap-3 p-5">
        {/* Brand Logo */}
        <div className="h-10 flex items-center">
          <img 
            src={study.brand_logo} 
            alt={study.brand_name}
            className="h-8 w-auto object-contain"
            loading="lazy"
          />
        </div>

        {/* Hashtag */}
        <div className="text-[#7C3AED] text-sm font-medium">
          {study.hashtag}
        </div>

        {/* Quote */}
        <div className="text-gray-700 dark:text-white/90 text-sm line-clamp-2 italic flex-grow">
          "{study.short_quote}"
        </div>

        {/* Creator info and arrow */}
        <div className="flex justify-between items-center text-gray-500 dark:text-white/70 text-xs mt-auto">
          <span>{study.creator_name} ({study.creator_followers})</span>
          <svg 
            className="w-4 h-4 opacity-0 group-hover:opacity-80 transition-opacity duration-300" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>

      {/* Ripple effect overlay */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
    </div>
  );
};

const CaseStudyGrid = ({ caseStudies, loading, onLoadMore, hasMore, onCardClick }) => {
  const [visibleStudies, setVisibleStudies] = useState([]);

  useEffect(() => {
    setVisibleStudies(caseStudies);
  }, [caseStudies]);

  // Respect reduced motion preferences
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <section className="py-16 px-6 bg-gray-50 dark:bg-dark-bg transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Grid */}
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4 auto-rows-fr">
          {/* Case Study Cards */}
          {visibleStudies.map((study, index) => (
            <CaseStudyCard 
              key={study.id} 
              study={study} 
              onCardClick={onCardClick}
            />
          ))}
          
          {/* Loading Skeletons */}
          {loading && Array.from({ length: 4 }, (_, index) => (
            <CaseStudyCardSkeleton key={`skeleton-${index}`} />
          ))}
        </div>

        {/* Load More Button */}
        {hasMore && !loading && (
          <div className="text-center mt-12">
            <button
              onClick={onLoadMore}
              className="mx-auto px-8 py-3 rounded-2xl bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white/80 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-40 transition-all duration-300 font-medium"
              data-analytics="load_more_case_studies"
            >
              Load more
            </button>
          </div>
        )}

        {/* No results message */}
        {!loading && visibleStudies.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-600 dark:text-white/60 text-lg mb-4">
              No case studies found for the selected filters.
            </div>
            <p className="text-gray-500 dark:text-white/40 text-sm">
              Try adjusting your filters or clearing all filters to see more results.
            </p>
          </div>
        )}

        {/* End of results message */}
        {!hasMore && !loading && visibleStudies.length > 0 && (
          <div className="text-center mt-12 py-8 border-t border-gray-200 dark:border-white/10">
            <p className="text-gray-600 dark:text-white/60 text-sm">
              You've seen all {visibleStudies.length} case studies.
              <button
                onClick={() => window.location.hash = 'contact'}
                className="text-[#7C3AED] hover:text-[#8B5CF6] ml-1 underline"
              >
                Want to be featured?
              </button>
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default CaseStudyGrid;
