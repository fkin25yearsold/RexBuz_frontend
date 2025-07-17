import React from "react";
import { featuredBrands } from "../../mocks/brands";
import { useIntersectionObserver } from "../../hooks/useIntersectionObserver";

const BrandGallerySection = () => {
  const [ref, isIntersecting] = useIntersectionObserver();

  return (
    <section ref={ref} className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2
            className={`text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 transition-all duration-700 ${isIntersecting ? "animate-in opacity-100" : "opacity-0 translate-y-8"}`}
          >
            Trusted by Leading Brands
          </h2>
          <p
            className={`text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto transition-all duration-700 delay-200 ${isIntersecting ? "animate-in opacity-100" : "opacity-0 translate-y-8"}`}
          >
            Join hundreds of successful brands already using our platform
          </p>
        </div>

        {/* Brand logos grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-12">
          {featuredBrands.map((brand, index) => (
            <div
              key={brand.id}
              className={`group bg-white dark:bg-dark-card p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg dark:hover:shadow-2xl transition-all duration-500 cursor-pointer ${
                isIntersecting
                  ? "animate-in opacity-100"
                  : "opacity-0 translate-y-8"
              }`}
              style={{ animationDelay: `${(index + 3) * 100}ms` }}
            >
              <div className="text-center">
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="w-full h-16 object-contain mb-3 group-hover:scale-105 transition-transform"
                />
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
                  {brand.name}
                </h3>
                <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                  <p>{brand.campaignCount} campaigns</p>
                  <p className="text-green-600 dark:text-green-400 font-medium">
                    {brand.avgBudget} avg
                  </p>
                </div>

                {/* Hidden on mobile, shown on hover on desktop */}
                <div className="hidden group-hover:block absolute inset-0 bg-black/80 text-white p-4 rounded-xl">
                  <div className="flex flex-col justify-center h-full text-center">
                    <div className="text-sm font-semibold mb-2">
                      {brand.name}
                    </div>
                    <div className="text-xs space-y-1">
                      <p>{brand.campaignCount} Campaigns</p>
                      <p>{brand.avgBudget} Avg Budget</p>
                      <p>⭐ {brand.rating} Rating</p>
                      <p className="text-blue-300">{brand.category}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div
          className={`text-center transition-all duration-700 delay-700 ${isIntersecting ? "animate-in opacity-100" : "opacity-0 translate-y-8"}`}
        >
          <button className="btn-primary bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg font-semibold">
            Explore Campaigns
          </button>
        </div>
      </div>
    </section>
  );
};

export default BrandGallerySection;
