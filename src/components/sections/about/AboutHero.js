import React from "react";
import { useIntersectionObserver } from "../../../hooks/useIntersectionObserver";
import { aboutContent } from "../../../mocks/about";

const AboutHero = () => {
  const [ref, isIntersecting] = useIntersectionObserver();

  return (
    <section
      ref={ref}
      className="relative py-20 md:py-32 overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-dark-bg dark:to-purple-900/20"
    >
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-300 dark:bg-orange-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-70 animate-float"></div>
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-300 dark:bg-green-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-70 animate-float"
          style={{ animationDelay: "2s" }}
        ></div>

        {/* India Map-like SVG */}
        <div className="absolute top-1/2 right-10 transform -translate-y-1/2 opacity-10 dark:opacity-20">
          <svg
            width="200"
            height="300"
            viewBox="0 0 200 300"
            className="text-indigo-600 dark:text-indigo-400"
          >
            <path
              fill="currentColor"
              d="M100 50C120 30 140 40 160 60C180 80 170 120 150 140C140 160 130 180 120 200C110 220 100 240 90 220C80 200 70 180 60 160C40 140 30 120 50 100C70 80 80 60 100 50Z"
            />
            {/* Creator pins */}
            <circle
              cx="80"
              cy="120"
              r="3"
              className="text-red-500 animate-pulse"
              fill="currentColor"
            />
            <circle
              cx="120"
              cy="140"
              r="3"
              className="text-red-500 animate-pulse"
              fill="currentColor"
              style={{ animationDelay: "0.5s" }}
            />
            <circle
              cx="100"
              cy="100"
              r="3"
              className="text-red-500 animate-pulse"
              fill="currentColor"
              style={{ animationDelay: "1s" }}
            />
            <circle
              cx="140"
              cy="120"
              r="3"
              className="text-red-500 animate-pulse"
              fill="currentColor"
              style={{ animationDelay: "1.5s" }}
            />
            <circle
              cx="90"
              cy="180"
              r="3"
              className="text-red-500 animate-pulse"
              fill="currentColor"
              style={{ animationDelay: "2s" }}
            />
          </svg>
        </div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1
                className={`text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight transition-all duration-700 ${isIntersecting ? "animate-in opacity-100" : "opacity-0 translate-y-8"}`}
              >
                {aboutContent.mission}
              </h1>
              <p
                className={`text-xl text-gray-600 dark:text-gray-300 transition-all duration-700 delay-200 ${isIntersecting ? "animate-in opacity-100" : "opacity-0 translate-y-8"}`}
              >
                {aboutContent.description}
              </p>
            </div>

            <div
              className={`space-y-4 transition-all duration-700 delay-400 ${isIntersecting ? "animate-in opacity-100" : "opacity-0 translate-y-8"}`}
            >
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Our Values
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {aboutContent.values.map((value, index) => (
                  <div key={index} className="flex items-center gap-3">
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
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div
              className={`transition-all duration-700 delay-600 ${isIntersecting ? "animate-in opacity-100" : "opacity-0 translate-y-8"}`}
            >
              <button className="group btn-primary bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-8 py-4 text-lg font-semibold">
                <span className="flex items-center justify-center gap-2">
                  Join Our Mission
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

          <div
            className={`relative transition-all duration-700 delay-800 ${isIntersecting ? "animate-in opacity-100" : "opacity-0 translate-y-8"}`}
          >
            <div className="bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/20 dark:border-white/10">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                {aboutContent.vision}
              </h3>

              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-4xl mb-2">🎯</div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Our Mission
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Connect authentic creators with meaningful brand
                    partnerships
                  </p>
                </div>

                <div className="text-center">
                  <div className="text-4xl mb-2">🌟</div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Our Vision
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Become India's most trusted creator economy platform
                  </p>
                </div>

                <div className="text-center">
                  <div className="text-4xl mb-2">🚀</div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Our Impact
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Empowering creators from every corner of India
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutHero;
