import React, { useState, useEffect } from 'react';
import { testimonialsAPI } from '../../mocks/testimonials';
import TestimonialsHero from '../sections/testimonials/TestimonialsHero';
import CreatorStoriesCarousel from '../sections/testimonials/CreatorStoriesCarousel';
import CreatorModal from '../sections/testimonials/CreatorModal';
import BrandTestimonial from '../sections/testimonials/BrandTestimonial';
import KPIStrip from '../sections/testimonials/KPIStrip';
import AgencySpotlight from '../sections/testimonials/AgencySpotlight';
import WallOfLove from '../sections/testimonials/WallOfLove';
import TestimonialsCTA from '../sections/testimonials/TestimonialsCTA';

const TestimonialsPage = () => {
  const [creators, setCreators] = useState([]);
  const [brands, setBrands] = useState([]);
  const [agencies, setAgencies] = useState([]);
  const [platformStats, setPlatformStats] = useState({});
  const [quickTestimonials, setQuickTestimonials] = useState([]);
  const [selectedCreator, setSelectedCreator] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTestimonialsData = async () => {
      try {
        setLoading(true);
        
        // Load all testimonials data
        const [
          creatorsData,
          brandsData,
          agenciesData,
          statsData,
          quickData
        ] = await Promise.all([
          testimonialsAPI.getCreatorTestimonials(),
          testimonialsAPI.getBrandTestimonials(),
          testimonialsAPI.getAgencyTestimonials(),
          testimonialsAPI.getPlatformStats(),
          testimonialsAPI.getQuickTestimonials(50)
        ]);

        setCreators(creatorsData);
        setBrands(brandsData);
        setAgencies(agenciesData);
        setPlatformStats(statsData);
        setQuickTestimonials(quickData);
      } catch (error) {
        console.error('Error loading testimonials data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTestimonialsData();
  }, []);

  const handleCreatorStoryClick = (creator) => {
    setSelectedCreator(creator);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCreator(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-dark-bg transition-colors duration-300 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-white/80">Loading testimonials...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg transition-colors duration-300">
      {/* Hero Section */}
      <TestimonialsHero />

      {/* Creator Stories Carousel */}
      <CreatorStoriesCarousel 
        creators={creators}
        onCreatorStoryClick={handleCreatorStoryClick}
      />

      {/* Creator Deep-dive Modal */}
      <CreatorModal 
        creator={selectedCreator}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />

      {/* Brand Success Testimonial */}
      {brands.length > 0 && (
        <BrandTestimonial brand={brands[0]} />
      )}

      {/* KPI Strip */}
      <KPIStrip stats={platformStats} />

      {/* Agency Spotlight */}
      {agencies.length > 0 && (
        <AgencySpotlight agency={agencies[0]} />
      )}

      {/* Wall of Love */}
      <WallOfLove testimonials={quickTestimonials} />

      {/* Call-to-Action Footer */}
      <TestimonialsCTA />
    </div>
  );
};

export default TestimonialsPage;
