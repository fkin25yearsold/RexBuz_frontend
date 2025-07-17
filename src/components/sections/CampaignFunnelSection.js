import React from "react";
import { useIntersectionObserver } from "../../hooks/useIntersectionObserver";

const CampaignFunnelSection = () => {
  const [ref, isIntersecting] = useIntersectionObserver();

  const steps = [
    {
      icon: "📢",
      title: "Brand Posts Campaign",
      description: "Brand creates a campaign with requirements and budget",
    },
    {
      icon: "✋",
      title: "Creators Apply",
      description: "Qualified creators submit applications with proposals",
    },
    {
      icon: "🎯",
      title: "Creator Selected",
      description: "Brand reviews and selects the best-fit creators",
    },
    {
      icon: "🎨",
      title: "Content Created",
      description: "Creators produce and submit content for approval",
    },
    {
      icon: "📱",
      title: "Content Published",
      description: "Approved content goes live across platforms",
    },
    {
      icon: "💰",
      title: "Payment Released",
      description: "Secure escrow payment released to creators",
    },
  ];

  return (
    <section ref={ref} className="py-20 bg-white dark:bg-dark-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2
            className={`text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 transition-all duration-700 ${isIntersecting ? "animate-in opacity-100" : "opacity-0 translate-y-8"}`}
          >
            How Campaigns Work
          </h2>
          <p
            className={`text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto transition-all duration-700 delay-200 ${isIntersecting ? "animate-in opacity-100" : "opacity-0 translate-y-8"}`}
          >
            From campaign creation to payout - a seamless journey
          </p>
        </div>

        <div className="relative">
          {/* Desktop Layout */}
          <div className="hidden lg:block">
            <div className="grid grid-cols-3 gap-8">
              {steps.map((step, index) => (
                <div key={index} className="relative">
                  <div
                    className={`bg-white dark:bg-dark-card p-6 rounded-xl border border-gray-200 dark:border-gray-700 text-center hover:shadow-lg dark:hover:shadow-2xl transition-all duration-500 ${
                      isIntersecting
                        ? "animate-in opacity-100"
                        : "opacity-0 translate-y-8"
                    }`}
                    style={{ animationDelay: `${(index + 3) * 150}ms` }}
                  >
                    <div className="text-4xl mb-4">{step.icon}</div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {step.description}
                    </p>
                  </div>

                  {/* Connecting Arrow */}
                  {index < steps.length - 1 && index % 3 !== 2 && (
                    <div className="absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                      <svg
                        className={`w-8 h-8 text-blue-500 dark:text-purple-500 transition-all duration-700 ${
                          isIntersecting ? "opacity-100" : "opacity-0"
                        }`}
                        style={{ animationDelay: `${(index + 4) * 150}ms` }}
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
                    </div>
                  )}

                  {/* Curved arrow for end of row */}
                  {index === 2 && (
                    <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 z-10">
                      <svg
                        className={`w-8 h-8 text-blue-500 dark:text-purple-500 transition-all duration-700 ${
                          isIntersecting ? "opacity-100" : "opacity-0"
                        }`}
                        style={{ animationDelay: `${(index + 4) * 150}ms` }}
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
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="lg:hidden space-y-6">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center gap-4">
                <div
                  className={`flex-shrink-0 w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold transition-all duration-500 ${
                    isIntersecting
                      ? "animate-in opacity-100"
                      : "opacity-0 translate-x-8"
                  }`}
                  style={{ animationDelay: `${(index + 3) * 150}ms` }}
                >
                  {index + 1}
                </div>

                <div
                  className={`flex-1 bg-white dark:bg-dark-card p-4 rounded-lg border border-gray-200 dark:border-gray-700 transition-all duration-500 ${
                    isIntersecting
                      ? "animate-in opacity-100"
                      : "opacity-0 translate-y-8"
                  }`}
                  style={{ animationDelay: `${(index + 3) * 150}ms` }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{step.icon}</span>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CampaignFunnelSection;
