import React from "react";

const CreatorCard = ({ creator }) => {
  const getPlatformIcon = (platform) => {
    const icons = {
      Instagram: "📷",
      YouTube: "📺",
      TikTok: "🎵",
      Twitter: "🐦",
    };
    return icons[platform] || "📱";
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={i < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"}
      >
        ⭐
      </span>
    ));
  };

  return (
    <div className="group ripple-hover bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-xl dark:hover:shadow-2xl transition-all duration-300 min-w-[280px]">
      <div className="flex items-center gap-3 mb-4">
        <img
          src={creator.avatar}
          alt={creator.name}
          className="w-16 h-16 rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-600 group-hover:ring-blue-400 dark:group-hover:ring-purple-400 transition-all duration-300"
        />
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 dark:text-white">
            {creator.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {creator.username}
          </p>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-sm">{getPlatformIcon(creator.platform)}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {creator.platform}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="text-center">
          <div className="text-lg font-bold text-gray-900 dark:text-white">
            {creator.followers}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            Followers
          </div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-green-600 dark:text-green-400">
            {creator.engagement}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            Engagement
          </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Rating
          </span>
          <div className="flex items-center gap-1">
            {renderStars(creator.rating)}
            <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
              ({creator.rating})
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Campaigns
          </span>
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            {creator.completedCampaigns}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <span
          className={`text-xs px-2 py-1 rounded-full font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300`}
        >
          {creator.category}
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          📍 {creator.location}
        </span>
      </div>

      <button className="w-full btn-primary bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
        View Profile
      </button>
    </div>
  );
};

export default CreatorCard;
