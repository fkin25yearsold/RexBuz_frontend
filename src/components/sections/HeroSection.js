import React from "react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-dark-bg dark:to-purple-900/20 pt-16">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 dark:bg-purple-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-70 animate-float"></div>
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 dark:bg-blue-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-70 animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-40 left-1/2 transform -translate-x-1/2 w-80 h-80 bg-pink-300 dark:bg-pink-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-70 animate-float"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="space-y-8">
          {/* Main Heading */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white leading-tight animate-in stagger-1">
              Where <span className="gradient-text">Brands</span>,{" "}
              <span className="gradient-text">Creators</span>,
              <br />
              and <span className="gradient-text">Agencies</span> Thrive
              Together
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto animate-in stagger-2">
              Connect. Collaborate. Grow.
            </p>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto animate-in stagger-3">
              India's premier influencer marketing platform connecting authentic
              creators with visionary brands
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-in stagger-4">
            <button
              onClick={() => (window.location.hash = "signup")}
              className="group btn-primary bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold min-w-[200px] glow"
            >
              <span className="flex items-center justify-center gap-2">
                Join as Creator
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

            <button className="group btn-primary bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-purple-500 px-8 py-4 text-lg font-semibold min-w-[200px]">
              <span className="flex items-center justify-center gap-2">
                Post a Campaign
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

            <button className="group btn-primary bg-transparent text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-purple-400 px-8 py-4 text-lg font-semibold border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-purple-500 min-w-[200px]">
              <span className="flex items-center justify-center gap-2">
                Agency Dashboard
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

          {/* Platform Icons */}
          <div className="flex justify-center items-center gap-8 pt-8 animate-in stagger-5">
            <div
              className="text-2xl sm:text-3xl hover:scale-110 transition-transform cursor-pointer"
              title="Instagram"
            >
              📷
            </div>
            <div
              className="text-2xl sm:text-3xl hover:scale-110 transition-transform cursor-pointer"
              title="YouTube"
            >
              📺
            </div>
            <div
              className="text-2xl sm:text-3xl hover:scale-110 transition-transform cursor-pointer"
              title="TikTok"
            >
              🎵
            </div>
            <div
              className="text-2xl sm:text-3xl hover:scale-110 transition-transform cursor-pointer"
              title="Twitter"
            >
              🐦
            </div>
            <div
              className="text-2xl sm:text-3xl hover:scale-110 transition-transform cursor-pointer"
              title="LinkedIn"
            >
              💼
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg
          className="w-6 h-6 text-gray-400 dark:text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
