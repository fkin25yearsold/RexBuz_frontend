import React from "react";

const CampaignCard = ({ campaign }) => {
  const getPlatformIcon = (platform) => {
    const icons = {
      Instagram: "📷",
      YouTube: "📺",
      TikTok: "🎵",
      Twitter: "🐦",
    };
    return icons[platform] || "📱";
  };

  const getCategoryColor = (category) => {
    const colors = {
      Fashion:
        "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300",
      Technology:
        "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
      Beauty:
        "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
      Health:
        "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
      Travel:
        "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
      Food: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    };
    return (
      colors[category] ||
      "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
    );
  };

  return (
    <div className="group ripple-hover bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl dark:hover:shadow-2xl transition-all duration-300">
      <div className="relative overflow-hidden">
        <img
          src={campaign.image}
          alt={campaign.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className="text-lg">{getPlatformIcon(campaign.platform)}</span>
          <span className="text-xs bg-black bg-opacity-50 text-white px-2 py-1 rounded-full backdrop-blur-sm">
            {campaign.platform}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <span
            className={`text-xs px-2 py-1 rounded-full font-medium ${getCategoryColor(campaign.category)}`}
          >
            {campaign.category}
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
          {campaign.title}
        </h3>

        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            by {campaign.brand}
          </span>
          <span className="text-sm font-semibold text-green-600 dark:text-green-400">
            {campaign.budget}
          </span>
        </div>

        <div className="flex flex-wrap gap-1 mb-3">
          {campaign.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-4">
          <span>
            📅 Deadline: {new Date(campaign.deadline).toLocaleDateString()}
          </span>
          <span>👥 {campaign.applications} applied</span>
        </div>

        <button className="w-full btn-primary bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
          Apply Now
        </button>
      </div>
    </div>
  );
};

export default CampaignCard;
