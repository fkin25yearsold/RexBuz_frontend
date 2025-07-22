// Social Media Platform Configuration and API Helpers

export const PLATFORM_CONFIG = {
  instagram: {
    label: "Instagram",
    icon: "📷",
    color: "bg-gradient-to-r from-purple-500 to-pink-500",
    company: "Meta",
    urlPrefix: "https://instagram.com/",
    handlePattern: /^[a-zA-Z0-9._]{1,30}$/,
    placeholder: "your_username",
  },
  youtube: {
    label: "YouTube",
    icon: "📹",
    color: "bg-red-500",
    company: "Google",
    urlPrefix: "https://youtube.com/@",
    handlePattern: /^[a-zA-Z0-9._-]{3,30}$/,
    placeholder: "YourChannelName",
  },
  tiktok: {
    label: "TikTok",
    icon: "🎵",
    color: "bg-black",
    company: "ByteDance",
    urlPrefix: "https://tiktok.com/@",
    handlePattern: /^[a-zA-Z0-9._]{2,24}$/,
    placeholder: "your_username",
  },
  twitter: {
    label: "Twitter/X",
    icon: "🐦",
    color: "bg-blue-400",
    company: "X Corp",
    urlPrefix: "https://twitter.com/",
    handlePattern: /^[a-zA-Z0-9_]{1,15}$/,
    placeholder: "your_handle",
  },
  facebook: {
    label: "Facebook",
    icon: "👥",
    color: "bg-blue-600",
    company: "Meta",
    urlPrefix: "https://facebook.com/",
    handlePattern: /^[a-zA-Z0-9.]{5,50}$/,
    placeholder: "your.profile",
  },
  linkedin: {
    label: "LinkedIn",
    icon: "💼",
    color: "bg-blue-700",
    company: "Microsoft",
    urlPrefix: "https://linkedin.com/in/",
    handlePattern: /^[a-zA-Z0-9-]{3,100}$/,
    placeholder: "your-profile",
  },
};

export const PLATFORM_OPTIONS = Object.keys(PLATFORM_CONFIG).map((key) => ({
  value: key,
  ...PLATFORM_CONFIG[key],
}));

// Helper function to convert simple frontend format to complex API format
export function convertToApiFormat(simplePlatforms) {
  const apiData = {
    social_media_profiles: simplePlatforms
      .filter((platform) => platform.platform && platform.username) // Filter out empty platforms
      .map((platform) => {
        const cleanUsername = platform.username.replace(/^@/, ""); // Remove @ if present
        const platformKey = platform.platform.toLowerCase();
        const config = PLATFORM_CONFIG[platformKey];

        const apiPlatform = {
          platform: platformKey,
          username: cleanUsername,
          followers_count: parseInt(platform.followers) || 0,
          profile_url: config?.urlPrefix + cleanUsername,
          verified: Boolean(platform.verified),
        };

        return apiPlatform;
      }),
  };

  return apiData;
}

// Helper function to convert API format back to simple frontend format
export function convertFromApiFormat(apiPlatforms) {
  if (!apiPlatforms || !Array.isArray(apiPlatforms)) {
    return [];
  }

  const frontendData = apiPlatforms.map((platform) => {
    const frontendPlatform = {
      platform: platform.platform,
      username: platform.username || platform.handle_username || platform.handle,
      followers: platform.followers_count || platform.follower_count || 0,
      verified: platform.verified || platform.is_verified || false,
    };

    return frontendPlatform;
  });

  return frontendData;
}

// Validate platform data
export function validatePlatformData(platform) {
  const errors = {};

  if (!platform.platform) {
    errors.platform = "Platform is required";
  } else if (!PLATFORM_CONFIG[platform.platform.toLowerCase()]) {
    errors.platform = "Invalid platform selected";
  }

  if (!platform.username || platform.username.trim() === "") {
    errors.username = "Username is required";
  } else {
    const cleanUsername = platform.username.replace(/^@/, "");
    const platformKey = platform.platform.toLowerCase();
    const pattern = PLATFORM_CONFIG[platformKey]?.handlePattern;

    if (pattern && !pattern.test(cleanUsername)) {
      errors.username = `Invalid username format for ${PLATFORM_CONFIG[platformKey]?.label}`;
    }
  }

  if (
    platform.followers === null ||
    platform.followers === undefined ||
    platform.followers === ""
  ) {
    errors.followers = "Follower count is required";
  } else if (isNaN(platform.followers) || platform.followers < 0) {
    errors.followers = "Follower count must be a non-negative number";
  }

  return errors;
}

// Generate profile URL from platform and username
export function generateProfileUrl(platform, username) {
  const cleanUsername = username.replace(/^@/, "");
  const platformKey = platform.toLowerCase();
  const config = PLATFORM_CONFIG[platformKey];

  if (!config) return "";

  return config.urlPrefix + cleanUsername;
}

// Test function to verify exact format
export function testApiFormat() {
  const testPlatforms = [
    {
      platform: "instagram",
      username: "user_handle",
      followers: 100,
      verified: false,
    },
  ];

  const result = convertToApiFormat(testPlatforms);

  const expectedFormat = {
    platforms: [
      {
        company_name: "Meta",
        follower_count: 100,
        handle_username: "user_handle",
        is_oauth_connected: false,
        is_verified: false,
        oauth_provider_id: null,
        platform: "instagram",
        platform_category: "organic",
        profile_url: "https://instagram.com/user_handle",
      },
    ],
  };

  return result;
}
