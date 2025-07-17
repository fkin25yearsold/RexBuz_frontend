import React, { useState } from "react";
import CampaignCard from "../CampaignCard";
import { trendingCampaigns, campaignFilters } from "../../mocks/campaigns";
import { useIntersectionObserver } from "../../hooks/useIntersectionObserver";

const TrendingCampaignsSection = () => {
  const [selectedPlatform, setSelectedPlatform] = useState("All");
  const [selectedBudget, setSelectedBudget] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [ref, isIntersecting] = useIntersectionObserver();

  const filteredCampaigns = trendingCampaigns.filter((campaign) => {
    return (
      (selectedPlatform === "All" || campaign.platform === selectedPlatform) &&
      (selectedBudget === "All" ||
        campaign.budget.includes(selectedBudget.split("-")[0])) &&
      (selectedCategory === "All" || campaign.category === selectedCategory)
    );
  });

  return (
    <section ref={ref} className="py-20 bg-white dark:bg-dark-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2
            className={`text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 transition-all duration-700 ${isIntersecting ? "animate-in opacity-100" : "opacity-0 translate-y-8"}`}
          >
            Trending Campaigns
          </h2>
          <p
            className={`text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto transition-all duration-700 delay-200 ${isIntersecting ? "animate-in opacity-100" : "opacity-0 translate-y-8"}`}
          >
            Discover high-paying campaigns from top brands
          </p>
        </div>

        {/* Filters */}
        <div
          className={`flex flex-wrap gap-4 mb-12 justify-center transition-all duration-700 delay-300 ${isIntersecting ? "animate-in opacity-100" : "opacity-0 translate-y-8"}`}
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Platform
            </label>
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-purple-500"
            >
              {campaignFilters.platforms.map((platform) => (
                <option key={platform} value={platform}>
                  {platform}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Budget
            </label>
            <select
              value={selectedBudget}
              onChange={(e) => setSelectedBudget(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-purple-500"
            >
              {campaignFilters.budgets.map((budget) => (
                <option key={budget} value={budget}>
                  {budget}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-purple-500"
            >
              {campaignFilters.categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Campaigns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredCampaigns.map((campaign, index) => (
            <div
              key={campaign.id}
              className={`transition-all duration-500 ${
                isIntersecting
                  ? "animate-in opacity-100"
                  : "opacity-0 translate-y-8"
              }`}
              style={{ animationDelay: `${(index + 4) * 100}ms` }}
            >
              <CampaignCard campaign={campaign} />
            </div>
          ))}
        </div>

        {/* View All CTA */}
        <div
          className={`text-center transition-all duration-700 delay-700 ${isIntersecting ? "animate-in opacity-100" : "opacity-0 translate-y-8"}`}
        >
          <button className="btn-primary bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg font-semibold">
            View All Campaigns
          </button>
        </div>
      </div>
    </section>
  );
};

export default TrendingCampaignsSection;
