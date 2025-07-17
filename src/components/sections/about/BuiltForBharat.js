import React, { useState, useEffect } from "react";
import { useIntersectionObserver } from "../../../hooks/useIntersectionObserver";
import { supportedLanguages } from "../../../mocks/about";

const BuiltForBharat = () => {
  const [ref, isIntersecting] = useIntersectionObserver();
  const [currentLanguageIndex, setCurrentLanguageIndex] = useState(0);

  useEffect(() => {
    if (isIntersecting) {
      const interval = setInterval(() => {
        setCurrentLanguageIndex(
          (prev) => (prev + 1) % supportedLanguages.length,
        );
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [isIntersecting]);

  return (
    <section
      ref={ref}
      className="py-20 bg-gradient-to-br from-orange-50 via-white to-red-50 dark:from-gray-900 dark:via-dark-bg dark:to-orange-900/20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2
            className={`text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 transition-all duration-700 ${isIntersecting ? "animate-in opacity-100" : "opacity-0 translate-y-8"}`}
          >
            Built for Bharat
          </h2>
          <p
            className={`text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto transition-all duration-700 delay-200 ${isIntersecting ? "animate-in opacity-100" : "opacity-0 translate-y-8"}`}
          >
            Local-first platform supporting India's linguistic and cultural
            diversity
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Language animation */}
          <div
            className={`transition-all duration-700 delay-400 ${isIntersecting ? "animate-in opacity-100" : "opacity-0 translate-x-8"}`}
          >
            <div className="relative bg-white dark:bg-dark-card rounded-3xl p-8 border border-gray-200 dark:border-gray-700 shadow-xl">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                Supported Languages
              </h3>

              {/* Animated language display */}
              <div className="text-center mb-8">
                <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600 h-16 flex items-center justify-center transition-all duration-500">
                  {supportedLanguages[currentLanguageIndex]}
                </div>
              </div>

              {/* Language grid */}
              <div className="grid grid-cols-2 gap-3">
                {supportedLanguages.map((language, index) => (
                  <div
                    key={language}
                    className={`p-3 rounded-lg text-center text-sm font-medium transition-all duration-300 ${
                      index === currentLanguageIndex
                        ? "bg-gradient-to-r from-orange-600 to-red-600 text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {language}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right side - Content */}
          <div
            className={`space-y-8 transition-all duration-700 delay-600 ${isIntersecting ? "animate-in opacity-100" : "opacity-0 translate-x-8"}`}
          >
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Empowering Regional Talent
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                We believe every creator deserves a platform, regardless of
                their language or location. Our multilingual support ensures
                authentic content creation in India's native languages.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div className="bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 p-6 rounded-xl border border-orange-200 dark:border-orange-700">
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-3xl">🌏</div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      Tier 2 & 3 Cities
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      70% of our creators are from non-metro areas
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 p-6 rounded-xl border border-blue-200 dark:border-blue-700">
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-3xl">🗣️</div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      Multilingual Support
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Content creation in 10+ Indian languages
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-100 to-teal-100 dark:from-green-900/30 dark:to-teal-900/30 p-6 rounded-xl border border-green-200 dark:border-green-700">
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-3xl">🤝</div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      Cultural Authenticity
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Celebrating India's diverse cultural heritage
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button className="group btn-primary bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-8 py-4 text-lg font-semibold">
                <span className="flex items-center justify-center gap-2">
                  Join the Movement
                  <svg
                    className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BuiltForBharat;
