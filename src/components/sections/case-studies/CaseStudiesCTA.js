import React, { useEffect, useState } from 'react';

const CaseStudiesCTA = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const handleBrandLoginClick = () => {
    // Navigate to brand login (could be a separate route or modal)
    window.location.hash = 'login';
  };

  const handlePartnershipsClick = () => {
    window.location.hash = 'contact';
  };

  return (
    <section className="my-24 text-center bg-gray-100 dark:bg-gray-900 py-16 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-6">
        <h2
          className={`text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white mb-8 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          Want Your Story Featured?
        </h2>

        <p
          className={`text-lg text-gray-600 dark:text-white/70 mb-8 max-w-2xl mx-auto transition-all duration-700 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          Join the brands and creators who are driving real results with Influbazzar.
          Start your success story today.
        </p>

        <div 
          className={`flex flex-col sm:flex-row justify-center gap-6 transition-all duration-700 delay-400 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <button
            onClick={handleBrandLoginClick}
            className="px-8 py-4 bg-[#7C3AED] text-white rounded-2xl shadow-lg hover:scale-105 hover:bg-[#8B5CF6] transition-all duration-300 font-semibold flex items-center justify-center gap-2"
            data-analytics="cta_brand_login"
          >
            Log In as Brand
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
          </button>

          <button
            onClick={handlePartnershipsClick}
            className="px-8 py-4 border border-gray-300 dark:border-white/20 text-gray-700 dark:text-white/80 rounded-2xl hover:bg-gray-200 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white hover:border-gray-400 dark:hover:border-white/40 transition-all duration-300 font-semibold flex items-center justify-center gap-2"
            data-analytics="cta_partnerships"
          >
            Talk to Partnerships
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </button>
        </div>

        {/* Additional info */}
        <div 
          className={`mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 border-t border-white/10 transition-all duration-700 delay-600 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-[#7C3AED] mb-2">500+</div>
            <div className="text-gray-600 dark:text-white/70 text-sm">Successful Campaigns</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-500 dark:text-green-400 mb-2">3.2x</div>
            <div className="text-gray-600 dark:text-white/70 text-sm">Average ROI</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-500 dark:text-blue-400 mb-2">12.5M+</div>
            <div className="text-gray-600 dark:text-white/70 text-sm">Total Reach</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CaseStudiesCTA;
