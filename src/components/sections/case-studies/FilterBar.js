import React, { useState, useEffect } from 'react';

const FilterPill = ({ label, isActive, onClick, dataAnalytics }) => (
  <button
    onClick={onClick}
    data-analytics={dataAnalytics}
    className={`px-4 py-1.5 rounded-full text-sm transition-all duration-200 ${
      isActive
        ? 'bg-[#7C3AED] text-white shadow-lg'
        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white/70 hover:bg-gray-300 dark:hover:bg-gray-600 hover:text-gray-900 dark:hover:text-white/90'
    }`}
  >
    {label}
  </button>
);

const FilterBar = ({ onFiltersChange, initialFilters = {} }) => {
  const [activeFilters, setActiveFilters] = useState({
    size: initialFilters.size || [],
    category: initialFilters.category || []
  });
  
  const [isSticky, setIsSticky] = useState(false);

  // Handle scroll for sticky behavior
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const heroHeight = 600; // Approximate hero section height
      setIsSticky(scrollTop > heroHeight);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleFilter = (type, value) => {
    const newFilters = { ...activeFilters };
    
    if (newFilters[type].includes(value)) {
      newFilters[type] = newFilters[type].filter(item => item !== value);
    } else {
      newFilters[type] = [...newFilters[type], value];
    }
    
    setActiveFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
    const clearedFilters = { size: [], category: [] };
    setActiveFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters = activeFilters.size.length > 0 || activeFilters.category.length > 0;

  return (
    <div className={`bg-white/90 dark:bg-dark-card/60 backdrop-blur-md w-full z-30 shadow-inner transition-all duration-300 ${
      isSticky ? 'fixed top-0' : 'relative'
    }`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-center gap-4 flex-wrap py-3 px-4">
          {/* Size Filters */}
          <div className="flex items-center gap-2">
            <span className="text-gray-600 dark:text-white/60 text-sm font-medium hidden sm:block">Size:</span>
            <FilterPill
              label="Micro"
              isActive={activeFilters.size.includes('micro')}
              onClick={() => toggleFilter('size', 'micro')}
              dataAnalytics="filter_size_micro"
            />
            <FilterPill
              label="Macro"
              isActive={activeFilters.size.includes('macro')}
              onClick={() => toggleFilter('size', 'macro')}
              dataAnalytics="filter_size_macro"
            />
          </div>

          {/* Vertical divider */}
          <div className="w-px h-6 bg-gray-300 dark:bg-white/20 hidden sm:block" />

          {/* Category Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-gray-600 dark:text-white/60 text-sm font-medium hidden sm:block">Category:</span>
            <FilterPill
              label="Fashion"
              isActive={activeFilters.category.includes('fashion')}
              onClick={() => toggleFilter('category', 'fashion')}
              dataAnalytics="filter_category_fashion"
            />
            <FilterPill
              label="Skincare"
              isActive={activeFilters.category.includes('skincare')}
              onClick={() => toggleFilter('category', 'skincare')}
              dataAnalytics="filter_category_skincare"
            />
            <FilterPill
              label="Fitness"
              isActive={activeFilters.category.includes('fitness')}
              onClick={() => toggleFilter('category', 'fitness')}
              dataAnalytics="filter_category_fitness"
            />
            <FilterPill
              label="Food"
              isActive={activeFilters.category.includes('food')}
              onClick={() => toggleFilter('category', 'food')}
              dataAnalytics="filter_category_food"
            />
          </div>

          {/* Clear filters button */}
          {hasActiveFilters && (
            <>
              <div className="w-px h-6 bg-gray-300 dark:bg-white/20 hidden sm:block" />
              <button
                onClick={clearAllFilters}
                className="px-3 py-1.5 text-sm text-gray-600 dark:text-white/60 hover:text-gray-900 dark:hover:text-white/90 transition-colors duration-200 flex items-center gap-1"
                data-analytics="filter_clear_all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Clear all
              </button>
            </>
          )}
        </div>

        {/* Active filters count indicator */}
        {hasActiveFilters && (
          <div className="text-center pb-2">
            <span className="text-xs text-gray-500 dark:text-white/50">
              {activeFilters.size.length + activeFilters.category.length} filter{activeFilters.size.length + activeFilters.category.length !== 1 ? 's' : ''} active
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterBar;
