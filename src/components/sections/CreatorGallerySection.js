import React from "react";
import CreatorCard from "../CreatorCard";
import { featuredCreators } from "../../mocks/creators";
import { useIntersectionObserver } from "../../hooks/useIntersectionObserver";

const CreatorGallerySection = () => {
  const [ref, isIntersecting] = useIntersectionObserver();

  return (
    <section ref={ref} className="py-20 bg-white dark:bg-dark-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2
            className={`text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 transition-all duration-700 ${isIntersecting ? "animate-in opacity-100" : "opacity-0 translate-y-8"}`}
          >
            Featured Creators
          </h2>
          <p
            className={`text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto transition-all duration-700 delay-200 ${isIntersecting ? "animate-in opacity-100" : "opacity-0 translate-y-8"}`}
          >
            Discover talented creators across various niches
          </p>
        </div>

        {/* Horizontal scroll on mobile, grid on desktop */}
        <div className="overflow-x-auto pb-4">
          <div className="flex lg:grid lg:grid-cols-3 gap-6 lg:gap-8">
            {featuredCreators.map((creator, index) => (
              <div
                key={creator.id}
                className={`flex-shrink-0 lg:flex-shrink transition-all duration-500 ${
                  isIntersecting
                    ? "animate-in opacity-100"
                    : "opacity-0 translate-y-8"
                }`}
                style={{ animationDelay: `${(index + 3) * 150}ms` }}
              >
                <CreatorCard creator={creator} />
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div
          className={`text-center mt-12 transition-all duration-700 delay-700 ${isIntersecting ? "animate-in opacity-100" : "opacity-0 translate-y-8"}`}
        >
          <button className="btn-primary bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg font-semibold">
            Discover More Creators
          </button>
        </div>
      </div>
    </section>
  );
};

export default CreatorGallerySection;
