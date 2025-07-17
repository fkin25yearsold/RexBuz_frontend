import React from "react";
import { caseStudies } from "../../mocks/testimonials";
import { useIntersectionObserver } from "../../hooks/useIntersectionObserver";

const CaseStudySection = () => {
  const [ref, isIntersecting] = useIntersectionObserver();

  return (
    <section ref={ref} className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2
            className={`text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 transition-all duration-700 ${isIntersecting ? "animate-in opacity-100" : "opacity-0 translate-y-8"}`}
          >
            Success Stories
          </h2>
          <p
            className={`text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto transition-all duration-700 delay-200 ${isIntersecting ? "animate-in opacity-100" : "opacity-0 translate-y-8"}`}
          >
            Real results from campaigns that made an impact
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {caseStudies.map((study, index) => (
            <div
              key={study.id}
              className={`bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl dark:hover:shadow-2xl transition-all duration-500 ${
                isIntersecting
                  ? "animate-in opacity-100"
                  : "opacity-0 translate-y-8"
              }`}
              style={{ animationDelay: `${(index + 3) * 200}ms` }}
            >
              <img
                src={study.thumbnail}
                alt={study.title}
                className="w-full h-48 object-cover"
              />

              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {study.title}
                </h3>

                <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {study.brand} • {study.campaignType}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {study.reach}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      Total Reach
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {study.roi}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      ROI
                    </div>
                  </div>
                </div>

                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-4">
                  <span>{study.creators} creators</span>
                  <span>{study.engagement} engagement</span>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Sales:
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {study.results.sales}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Brand Awareness:
                    </span>
                    <span className="font-semibold text-green-600 dark:text-green-400">
                      {study.results.brandAwareness}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      New Customers:
                    </span>
                    <span className="font-semibold text-blue-600 dark:text-blue-400">
                      {study.results.newCustomers}
                    </span>
                  </div>
                </div>

                <button className="w-full mt-6 btn-primary bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                  Read Full Case Study
                </button>
              </div>
            </div>
          ))}
        </div>

        <div
          className={`text-center mt-12 transition-all duration-700 delay-700 ${isIntersecting ? "animate-in opacity-100" : "opacity-0 translate-y-8"}`}
        >
          <button className="btn-primary bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg font-semibold">
            View All Case Studies
          </button>
        </div>
      </div>
    </section>
  );
};

export default CaseStudySection;
