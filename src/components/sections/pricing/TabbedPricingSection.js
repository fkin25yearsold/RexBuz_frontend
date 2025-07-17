import React, { useState } from "react";
import { useIntersectionObserver } from "../../../hooks/useIntersectionObserver";
import {
  brandPlans,
  creatorFeatures,
  agencyFeatures,
} from "../../../mocks/pricing";

const TabbedPricingSection = () => {
  const [activeTab, setActiveTab] = useState("creator");
  const [ref, isIntersecting] = useIntersectionObserver();

  const tabs = [
    { id: "creator", label: "Creator", icon: "🧑" },
    { id: "brand", label: "Brand", icon: "🏢" },
    { id: "agency", label: "Agency", icon: "🧬" },
  ];

  const renderCreatorTab = () => (
    <div className="flex justify-center">
      <div className="max-w-md w-full bg-white dark:bg-dark-card rounded-2xl p-8 border-2 border-green-200 dark:border-green-700 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-500">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-4 py-2 rounded-full text-sm font-medium mb-4">
            🔖 Creator Access
          </div>
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Free Forever
          </h3>
          <div className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            ₹0
            <span className="text-lg text-gray-600 dark:text-gray-400">
              /month
            </span>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          {creatorFeatures.map((feature, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="flex-shrink-0 w-5 h-5 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <svg
                  className="w-3 h-3 text-green-600 dark:text-green-400"
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

        <div className="space-y-3">
          <button className="w-full btn-primary bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-8 py-3 text-lg font-semibold ripple-hover">
            Sign Up as Creator
          </button>
          <div className="flex items-center justify-center gap-2 text-sm text-green-600 dark:text-green-400">
            🎉 No Credit Card Needed
          </div>
        </div>
      </div>
    </div>
  );

  const renderBrandTab = () => (
    <div className="grid lg:grid-cols-3 gap-8">
      {brandPlans.map((plan) => (
        <div
          key={plan.id}
          className={`relative bg-white dark:bg-dark-card rounded-2xl p-8 border-2 transition-all duration-500 hover:scale-105 hover:shadow-2xl ${
            plan.popular
              ? "border-purple-500 dark:border-purple-400 shadow-xl ring-4 ring-purple-100 dark:ring-purple-900/50"
              : "border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 hover:shadow-xl"
          }`}
        >
          {plan.popular && (
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                🌟 Most Popular
              </div>
            </div>
          )}

          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {plan.name}
            </h3>
            <div className="mb-4">
              <span className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
                {plan.currency}
                {plan.price.toLocaleString()}
              </span>
              <span className="text-gray-600 dark:text-gray-400">
                /{plan.period}
              </span>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            {plan.features.map((feature, featureIndex) => (
              <div key={featureIndex} className="flex items-center gap-3">
                <div className="flex-shrink-0 w-5 h-5 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <svg
                    className="w-3 h-3 text-green-600 dark:text-green-400"
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
                <span className="text-gray-700 dark:text-gray-300 text-sm">
                  {feature}
                </span>
              </div>
            ))}
          </div>

          <button
            className={`w-full btn-primary px-6 py-3 font-semibold transition-all duration-300 ripple-hover ${
              plan.popular
                ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            {plan.cta}
          </button>
        </div>
      ))}
    </div>
  );

  const renderAgencyTab = () => (
    <div className="max-w-5xl mx-auto">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden hover:shadow-2xl transition-all duration-500">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 animate-pulse"></div>
        <div
          className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24 animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>

        <div className="relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-6">
                🧬 Agency Suite
              </div>

              <h3 className="text-3xl md:text-4xl font-bold mb-4">
                Custom Pricing
              </h3>

              <p className="text-xl text-white/90 mb-8">
                For agencies managing multiple brands or creators with advanced
                workflow needs
              </p>

              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                {agencyFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
                      <svg
                        className="w-3 h-3 text-white"
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
                    <span className="text-white/90 text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              <button className="bg-white text-indigo-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 ripple-hover text-lg">
                Contact Sales
              </button>
            </div>

            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <h4 className="text-2xl font-bold mb-6">What's Included</h4>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h5 className="font-semibold mb-1">
                        Unlimited Everything
                      </h5>
                      <p className="text-white/80 text-sm">
                        Brands, creators, campaigns, and team members
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <h5 className="font-semibold mb-1">Custom Branding</h5>
                      <p className="text-white/80 text-sm">
                        White-label solution with your agency branding
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <h5 className="font-semibold mb-1">Dedicated Support</h5>
                      <p className="text-white/80 text-sm">
                        Priority support with dedicated account manager
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "creator":
        return renderCreatorTab();
      case "brand":
        return renderBrandTab();
      case "agency":
        return renderAgencyTab();
      default:
        return renderCreatorTab();
    }
  };

  return (
    <section ref={ref} className="py-20 bg-white dark:bg-dark-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2
            className={`text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 transition-all duration-700 ${isIntersecting ? "animate-in opacity-100" : "opacity-0 translate-y-8"}`}
          >
            Choose Your Plan
          </h2>
          <p
            className={`text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto transition-all duration-700 delay-200 ${isIntersecting ? "animate-in opacity-100" : "opacity-0 translate-y-8"}`}
          >
            Select the perfect plan for your role in the creator economy
          </p>
        </div>

        {/* Tab Controls */}
        <div
          className={`flex justify-center mb-12 transition-all duration-700 delay-300 ${isIntersecting ? "animate-in opacity-100" : "opacity-0 translate-y-8"}`}
        >
          <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-2xl">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 min-w-[120px] justify-center ${
                  activeTab === tab.id
                    ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-lg"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div
          key={activeTab}
          className={`transition-all duration-500 ${isIntersecting ? "animate-in opacity-100" : "opacity-0 translate-y-8"}`}
        >
          {renderTabContent()}
        </div>
      </div>
    </section>
  );
};

export default TabbedPricingSection;
