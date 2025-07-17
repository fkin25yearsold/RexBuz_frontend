import React, { useState, useEffect } from "react";
import { useCountUp } from "../hooks/useIntersectionObserver";

const EarningsCalculator = () => {
  const [platform, setPlatform] = useState("Instagram");
  const [followers, setFollowers] = useState(50000);
  const [engagement, setEngagement] = useState(4.5);
  const [contentType, setContentType] = useState("Post");

  const [perPost, startPerPostAnimation] = useCountUp(0, 1000);
  const [monthly, startMonthlyAnimation] = useCountUp(0, 1000);
  const [yearly, startYearlyAnimation] = useCountUp(0, 1000);

  useEffect(() => {
    const calculateEarnings = () => {
      let baseRate = 0;

      // Platform multiplier
      const platformMultipliers = {
        Instagram: 1.0,
        YouTube: 1.5,
        TikTok: 0.8,
        Twitter: 0.6,
      };

      // Content type multiplier
      const contentMultipliers = {
        Post: 1.0,
        Reels: 1.3,
        Story: 0.5,
        Video: 1.8,
      };

      // Base calculation: followers * engagement rate * platform factor
      baseRate =
        (followers / 1000) *
        engagement *
        platformMultipliers[platform] *
        contentMultipliers[contentType] *
        2;

      const perPostEarning = Math.max(baseRate, 500); // Minimum ₹500
      const monthlyEarning = perPostEarning * 8; // 8 posts per month
      const yearlyEarning = monthlyEarning * 12;

      return {
        perPost: Math.round(perPostEarning),
        monthly: Math.round(monthlyEarning),
        yearly: Math.round(yearlyEarning),
      };
    };

    const earnings = calculateEarnings();

    startPerPostAnimation(earnings.perPost);
    startMonthlyAnimation(earnings.monthly);
    startYearlyAnimation(earnings.yearly);
  }, [
    platform,
    followers,
    engagement,
    contentType,
    startPerPostAnimation,
    startMonthlyAnimation,
    startYearlyAnimation,
  ]);

  const formatCurrency = (amount) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    }
    if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(1)}K`;
    }
    return `₹${amount}`;
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8 items-center">
      {/* Left side - Calculator */}
      <div className="space-y-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Calculate Your Earnings Potential
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Get an estimate of how much you can earn as a creator on our
            platform
          </p>
        </div>

        <div className="space-y-4">
          {/* Platform Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Platform
            </label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-purple-500 focus:border-transparent"
            >
              <option value="Instagram">Instagram</option>
              <option value="YouTube">YouTube</option>
              <option value="TikTok">TikTok</option>
              <option value="Twitter">Twitter</option>
            </select>
          </div>

          {/* Follower Count Slider */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Follower Count: {followers.toLocaleString()}
            </label>
            <input
              type="range"
              min="1000"
              max="1000000"
              step="1000"
              value={followers}
              onChange={(e) => setFollowers(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>1K</span>
              <span>1M</span>
            </div>
          </div>

          {/* Engagement Rate Slider */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Engagement Rate: {engagement}%
            </label>
            <input
              type="range"
              min="1"
              max="15"
              step="0.1"
              value={engagement}
              onChange={(e) => setEngagement(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>1%</span>
              <span>15%</span>
            </div>
          </div>

          {/* Content Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Content Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              {["Post", "Reels", "Story", "Video"].map((type) => (
                <button
                  key={type}
                  onClick={() => setContentType(type)}
                  className={`p-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    contentType === type
                      ? "bg-blue-600 dark:bg-purple-600 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Results */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
        <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          Your Earning Potential
        </h4>

        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-600">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Per Post
            </div>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {formatCurrency(perPost)}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-600">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Monthly (8 posts)
            </div>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {formatCurrency(monthly)}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-600">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Yearly
            </div>
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {formatCurrency(yearly)}
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button className="btn-primary bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white w-full">
            Start Earning Now
          </button>
        </div>

        <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center">
          * Estimates based on industry averages and platform data
        </div>
      </div>
    </div>
  );
};

export default EarningsCalculator;
