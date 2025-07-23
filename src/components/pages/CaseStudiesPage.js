import React, { useState, useEffect } from 'react';
import { caseStudiesAPI } from '../../mocks/caseStudies';
import CaseStudiesHero from '../sections/case-studies/CaseStudiesHero';
import FilterBar from '../sections/case-studies/FilterBar';
import CaseStudyGrid from '../sections/case-studies/CaseStudyGrid';
import CaseStudyModal from '../sections/case-studies/CaseStudyModal';
import CaseStudiesCTA from '../sections/case-studies/CaseStudiesCTA';

const CaseStudiesPage = () => {
  const [caseStudies, setCaseStudies] = useState([]);
  const [filteredStudies, setFilteredStudies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [activeFilters, setActiveFilters] = useState({ size: [], category: [] });
  const [selectedStudy, setSelectedStudy] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load initial data
  useEffect(() => {
    loadCaseStudies();
  }, []);

  // Apply filters when they change
  useEffect(() => {
    applyFilters();
  }, [activeFilters, caseStudies]);

  const loadCaseStudies = async (page = 0, append = false) => {
    try {
      setLoading(true);
      
      const params = {
        limit: 8,
        offset: page * 8,
        size: activeFilters.size.length > 0 ? activeFilters.size : undefined,
        category: activeFilters.category.length > 0 ? activeFilters.category : undefined
      };

      const response = await caseStudiesAPI.getAllCaseStudies(params);
      
      if (append) {
        setCaseStudies(prev => [...prev, ...response.data]);
      } else {
        setCaseStudies(response.data);
      }
      
      setHasMore(response.hasMore);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error loading case studies:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = async () => {
    try {
      setLoading(true);
      setCurrentPage(0);
      
      const params = {
        limit: 8,
        offset: 0,
        size: activeFilters.size.length > 0 ? activeFilters.size : undefined,
        category: activeFilters.category.length > 0 ? activeFilters.category : undefined
      };

      const response = await caseStudiesAPI.getAllCaseStudies(params);
      setCaseStudies(response.data);
      setHasMore(response.hasMore);
    } catch (error) {
      console.error('Error applying filters:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFiltersChange = (filters) => {
    setActiveFilters(filters);
    
    // Update URL query parameters for sharable views
    const searchParams = new URLSearchParams();
    if (filters.size.length > 0) {
      searchParams.set('size', filters.size.join(','));
    }
    if (filters.category.length > 0) {
      searchParams.set('category', filters.category.join(','));
    }
    
    const newUrl = `${window.location.pathname}${window.location.hash}${searchParams.toString() ? '?' + searchParams.toString() : ''}`;
    window.history.replaceState({}, '', newUrl);
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      loadCaseStudies(currentPage + 1, true);
    }
  };

  const handleCardClick = (study) => {
    setSelectedStudy(study);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedStudy(null);
  };

  // Load filters from URL on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sizeParam = urlParams.get('size');
    const categoryParam = urlParams.get('category');
    
    const initialFilters = {
      size: sizeParam ? sizeParam.split(',') : [],
      category: categoryParam ? categoryParam.split(',') : []
    };
    
    if (sizeParam || categoryParam) {
      setActiveFilters(initialFilters);
    }
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg transition-colors duration-300">
      {/* Hero Section */}
      <CaseStudiesHero />

      {/* Filter Bar */}
      <FilterBar 
        onFiltersChange={handleFiltersChange}
        initialFilters={activeFilters}
      />

      {/* Case Study Grid */}
      <CaseStudyGrid 
        caseStudies={caseStudies}
        loading={loading}
        onLoadMore={handleLoadMore}
        hasMore={hasMore}
        onCardClick={handleCardClick}
      />

      {/* Case Study Modal */}
      <CaseStudyModal 
        study={selectedStudy}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />

      {/* CTA Section */}
      <CaseStudiesCTA />
    </div>
  );
};

export default CaseStudiesPage;
