import React, { useState, useEffect } from 'react';

const StarRating = ({ rating = 5 }) => {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }, (_, i) => (
        <svg 
          key={i}
          className={`w-4 h-4 ${i < rating ? 'text-[#FBBF24] fill-current' : 'text-gray-600'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
};

const TestimonialCard = ({ testimonial, index }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), index * 100);
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <div
      className={`bg-white dark:bg-dark-card rounded-2xl p-5 shadow-lg hover:-translate-y-1 transition-all duration-300 group cursor-default ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
      style={{ 
        animationDelay: `${index * 100}ms`,
        breakInside: 'avoid',
        marginBottom: '20px'
      }}
    >
      {/* Header with avatar and info */}
      <div className="flex items-center gap-3 mb-3">
        <img 
          src={testimonial.avatar} 
          alt={testimonial.name}
          className="w-10 h-10 rounded-full object-cover ring-2 ring-purple-500/30"
        />
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 dark:text-white text-sm truncate">
            {testimonial.name}
          </h4>
          <p className="text-purple-600 dark:text-purple-300 text-xs truncate">
            {testimonial.handle}
          </p>
        </div>
      </div>

      {/* Star rating */}
      <div className="mb-3">
        <StarRating rating={testimonial.rating} />
      </div>

      {/* Testimonial text */}
      <p className="text-sm text-gray-700 dark:text-white/80 leading-relaxed">
        {testimonial.text}
      </p>

      {/* Hover effect overlay */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-600/0 to-pink-600/0 group-hover:from-purple-600/5 group-hover:to-pink-600/5 transition-all duration-300 pointer-events-none" />
    </div>
  );
};

const WallOfLove = ({ testimonials }) => {
  const [visibleCount, setVisibleCount] = useState(20);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const loadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount(prev => Math.min(prev + 20, testimonials.length));
      setIsLoadingMore(false);
    }, 500);
  };

  if (!testimonials || testimonials.length === 0) {
    return (
      <section className="py-24 bg-white dark:bg-dark-bg transition-colors duration-300">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-white/80">Loading testimonials...</p>
        </div>
      </section>
    );
  }

  const visibleTestimonials = testimonials.slice(0, visibleCount);

  return (
    <section className="py-24 bg-white dark:bg-dark-bg transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Wall of Love
          </h2>
          <p className="text-lg text-gray-600 dark:text-white/70 max-w-2xl mx-auto">
            Join thousands of creators, brands, and agencies who love working with Influbazzar
          </p>
        </div>

        {/* Masonry Grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-5 space-y-5">
          {visibleTestimonials.map((testimonial, index) => (
            <TestimonialCard 
              key={testimonial.id} 
              testimonial={testimonial} 
              index={index}
            />
          ))}
        </div>

        {/* Load More Button */}
        {visibleCount < testimonials.length && (
          <div className="text-center mt-12">
            <button
              onClick={loadMore}
              disabled={isLoadingMore}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 px-8 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 mx-auto"
            >
              {isLoadingMore ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  Load More Love
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </>
              )}
            </button>
          </div>
        )}

        {/* Statistics */}
        <div className="mt-16 pt-16 border-t border-white/10">
          <div className="text-center">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <p className="text-3xl font-bold text-white mb-2">
                  {testimonials.length}+
                </p>
                <p className="text-white/70">Happy Users</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-white mb-2">
                  4.9★
                </p>
                <p className="text-white/70">Average Rating</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-white mb-2">
                  98%
                </p>
                <p className="text-white/70">Would Recommend</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WallOfLove;
