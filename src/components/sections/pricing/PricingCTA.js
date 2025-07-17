import React from "react";
import { useIntersectionObserver } from "../../../hooks/useIntersectionObserver";

const PricingCTA = () => {
  const [ref, isIntersecting] = useIntersectionObserver();

  return (
    <section
      ref={ref}
      className="py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 relative overflow-hidden"
    >
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full animate-float"></div>
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-40 left-1/2 transform -translate-x-1/2 w-80 h-80 bg-white/5 rounded-full animate-float"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
        <div className="space-y-8">
          <div className="space-y-4">
            <h2
              className={`text-3xl md:text-5xl font-bold leading-tight transition-all duration-700 ${isIntersecting ? "animate-in opacity-100" : "opacity-0 translate-y-8"}`}
            >
              Ready to Get Started?
            </h2>
            <p
              className={`text-xl text-white/90 max-w-2xl mx-auto transition-all duration-700 delay-200 ${isIntersecting ? "animate-in opacity-100" : "opacity-0 translate-y-8"}`}
            >
              Whether you're a creator, brand, or agency – Influbazzar is built
              for you
            </p>
          </div>

          <div
            className={`flex flex-col sm:flex-row gap-4 justify-center items-center transition-all duration-700 delay-400 ${isIntersecting ? "animate-in opacity-100" : "opacity-0 translate-y-8"}`}
          >
            <button className="group bg-white text-indigo-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-xl">
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

            <button className="group bg-white/20 backdrop-blur-sm text-white border-2 border-white/30 px-8 py-4 rounded-xl font-semibold hover:bg-white/30 transition-all duration-300 transform hover:scale-105">
              <span className="flex items-center justify-center gap-2">
                Start Campaign
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

            <button className="group bg-transparent text-white border-2 border-white/50 px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-indigo-600 transition-all duration-300 transform hover:scale-105">
              <span className="flex items-center justify-center gap-2">
                Agency Access
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

          {/* Trust Indicators */}
          <div
            className={`grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 transition-all duration-700 delay-600 ${isIntersecting ? "animate-in opacity-100" : "opacity-0 translate-y-8"}`}
          >
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">28K+</div>
              <div className="text-white/80">Verified Creators</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">₹2.5Cr+</div>
              <div className="text-white/80">Creator Payouts</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">1950+</div>
              <div className="text-white/80">Campaigns Launched</div>
            </div>
          </div>

          {/* Security Badge */}
          <div
            className={`transition-all duration-700 delay-800 ${isIntersecting ? "animate-in opacity-100" : "opacity-0 translate-y-8"}`}
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Secure payments with escrow protection
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingCTA;
