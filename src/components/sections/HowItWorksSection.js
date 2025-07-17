import React, { useState } from "react";
import { useIntersectionObserver } from "../../hooks/useIntersectionObserver";

const HowItWorksSection = () => {
  const [activeTab, setActiveTab] = useState("Creator");
  const [ref, isIntersecting] = useIntersectionObserver();

  const tabs = {
    Creator: {
      steps: [
        {
          icon: "📝",
          title: "Sign Up",
          description: "Create your profile and showcase your content style",
        },
        {
          icon: "🔍",
          title: "Browse Campaigns",
          description: "Discover campaigns that match your niche and audience",
        },
        {
          icon: "✋",
          title: "Apply and Submit",
          description: "Apply to campaigns and submit your creative content",
        },
        {
          icon: "💰",
          title: "Track Payout",
          description: "Monitor deliverables and receive prompt payments",
        },
      ],
      cta: "Start as Creator →",
    },
    Brand: {
      steps: [
        {
          icon: "🎯",
          title: "Create Campaign Brief",
          description: "Define your campaign goals, budget, and requirements",
        },
        {
          icon: "👥",
          title: "Discover Creators",
          description: "Filter and find creators that align with your brand",
        },
        {
          icon: "📊",
          title: "Track Deliverables",
          description: "Monitor content creation and campaign performance",
        },
        {
          icon: "🔒",
          title: "Pay via Escrow",
          description: "Secure payments released upon delivery confirmation",
        },
      ],
      cta: "Explore Campaign Tools →",
    },
    Agency: {
      steps: [
        {
          icon: "🏢",
          title: "Manage Multiple Brands",
          description:
            "Handle campaigns for multiple clients from one dashboard",
        },
        {
          icon: "👨‍💼",
          title: "Oversee Creator Pools",
          description: "Build and manage your network of preferred creators",
        },
        {
          icon: "🤝",
          title: "Co-manage Campaigns",
          description:
            "Collaborate with brands on campaign strategy and execution",
        },
        {
          icon: "📈",
          title: "Unified Analytics",
          description:
            "Access comprehensive reporting across all your campaigns",
        },
      ],
      cta: "Agency Solutions →",
    },
  };

  return (
    <section ref={ref} className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2
            className={`text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 transition-all duration-700 ${isIntersecting ? "animate-in opacity-100" : "opacity-0 translate-y-8"}`}
          >
            How It Works
          </h2>
          <p
            className={`text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto transition-all duration-700 delay-200 ${isIntersecting ? "animate-in opacity-100" : "opacity-0 translate-y-8"}`}
          >
            Simple steps to start your journey on Influbazzar
          </p>
        </div>

        {/* Tabs */}
        <div
          className={`flex flex-wrap justify-center gap-2 mb-12 transition-all duration-700 delay-300 ${isIntersecting ? "animate-in opacity-100" : "opacity-0 translate-y-8"}`}
        >
          {Object.keys(tabs).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                activeTab === tab
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {tabs[activeTab].steps.map((step, index) => (
            <div
              key={index}
              className={`bg-white dark:bg-dark-card p-6 rounded-xl border border-gray-200 dark:border-gray-700 text-center hover:shadow-lg dark:hover:shadow-2xl transition-all duration-500 ${
                isIntersecting
                  ? "animate-in opacity-100"
                  : "opacity-0 translate-y-8"
              }`}
              style={{ animationDelay: `${(index + 4) * 150}ms` }}
            >
              <div className="text-4xl mb-4">{step.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {step.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div
          className={`text-center transition-all duration-700 delay-700 ${isIntersecting ? "animate-in opacity-100" : "opacity-0 translate-y-8"}`}
        >
          <button className="btn-primary bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg font-semibold">
            {tabs[activeTab].cta}
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
