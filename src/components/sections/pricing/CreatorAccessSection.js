import React from "react";
import { useIntersectionObserver } from "../../../hooks/useIntersectionObserver";
import { creatorFeatures } from "../../../mocks/pricing";

const CreatorAccessSection = () => {
  const [ref, isIntersecting] = useIntersectionObserver();

  return (
    <section ref={ref} className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`bg-white dark:bg-dark-card rounded-2xl p-8 md:p-12 border border-gray-200 dark:border-gray-700 shadow-xl hover:shadow-2xl transition-all duration-500 ${isIntersecting ? "animate-in opacity-100" : "opacity-0 translate-y-8"}`}
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-4 py-2 rounded-full text-sm font-medium mb-4">
              🎨 Creator Access
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Free Forever
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Join thousands of creators earning through authentic brand
              partnerships
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              {creatorFeatures.map((feature, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-3 transition-all duration-500 ${isIntersecting ? "animate-in opacity-100" : "opacity-0 translate-x-8"}`}
                  style={{ animationDelay: `${(index + 2) * 100}ms` }}
                >
                  <div className="flex-shrink-0 w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-green-600 dark:text-green-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            <div className="text-center md:text-left">
              <div className="mb-6">
                <div className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-2">
                  ₹0
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  No platform fees, ever
                </div>
              </div>

              <div className="space-y-3">
                <button className="w-full btn-primary bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-8 py-3 text-lg font-semibold">
                  Sign Up as Creator
                </button>
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  No Credit Card Needed
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CreatorAccessSection;
