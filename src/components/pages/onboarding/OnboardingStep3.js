import React, { useState, useEffect } from "react";
import Button from "../../common/Button";
import useCreatorOnboarding from "../../../hooks/useCreatorOnboarding";

const NICHE_OPTIONS = [
  {
    value: "LIFESTYLE",
    label: "Lifestyle",
    icon: "✨",
    description: "Daily life, routines, and experiences",
  },
  {
    value: "FITNESS",
    label: "Fitness & Health",
    icon: "💪",
    description: "Workout routines, nutrition, wellness",
  },
  {
    value: "BEAUTY",
    label: "Beauty & Skincare",
    icon: "💄",
    description: "Makeup tutorials, skincare tips",
  },
  {
    value: "FASHION",
    label: "Fashion & Style",
    icon: "👗",
    description: "Outfit ideas, fashion trends",
  },
  {
    value: "FOOD",
    label: "Food & Cooking",
    icon: "🍳",
    description: "Recipes, restaurant reviews, cooking",
  },
  {
    value: "TRAVEL",
    label: "Travel & Adventure",
    icon: "✈️",
    description: "Travel guides, destinations, culture",
  },
  {
    value: "TECHNOLOGY",
    label: "Technology",
    icon: "📱",
    description: "Tech reviews, gadgets, innovation",
  },
  {
    value: "GAMING",
    label: "Gaming",
    icon: "🎮",
    description: "Game reviews, streaming, esports",
  },
  {
    value: "EDUCATION",
    label: "Education",
    icon: "📚",
    description: "Learning, tutorials, skill development",
  },
  {
    value: "COMEDY",
    label: "Comedy & Entertainment",
    icon: "😂",
    description: "Humor, skits, entertainment",
  },
  {
    value: "MUSIC",
    label: "Music & Audio",
    icon: "🎵",
    description: "Music creation, covers, reviews",
  },
  {
    value: "ART",
    label: "Art & Creativity",
    icon: "🎨",
    description: "Visual arts, crafts, creative content",
  },
  {
    value: "SPORTS",
    label: "Sports",
    icon: "⚽",
    description: "Sports content, fitness, athletics",
  },
  {
    value: "BUSINESS",
    label: "Business & Entrepreneurship",
    icon: "💼",
    description: "Business tips, entrepreneurship",
  },
  {
    value: "FINANCE",
    label: "Finance & Investment",
    icon: "💰",
    description: "Personal finance, investment tips",
  },
  {
    value: "HEALTH",
    label: "Health & Wellness",
    icon: "🏥",
    description: "Mental health, medical awareness",
  },
  {
    value: "PARENTING",
    label: "Parenting & Family",
    icon: "👶",
    description: "Parenting tips, family content",
  },
  {
    value: "AUTOMOTIVE",
    label: "Automotive",
    icon: "🚗",
    description: "Car reviews, automotive content",
  },
  {
    value: "HOME_DECOR",
    label: "Home & Decor",
    icon: "🏠",
    description: "Interior design, home improvement",
  },
  {
    value: "PHOTOGRAPHY",
    label: "Photography",
    icon: "📸",
    description: "Photo techniques, visual storytelling",
  },
];

const COLLABORATION_TYPES = [
  {
    value: "SPONSORED_POSTS",
    label: "Sponsored Posts",
    icon: "📝",
    description: "Brand-sponsored social media posts",
  },
  {
    value: "PRODUCT_REVIEWS",
    label: "Product Reviews",
    icon: "⭐",
    description: "Honest product reviews and unboxing",
  },
  {
    value: "BRAND_AMBASSADORSHIP",
    label: "Brand Ambassadorship",
    icon: "👑",
    description: "Long-term brand partnerships",
  },
  {
    value: "EVENT_COVERAGE",
    label: "Event Coverage",
    icon: "📸",
    description: "Live event coverage and reporting",
  },
  {
    value: "CONTENT_CREATION",
    label: "Content Creation",
    icon: "🎨",
    description: "Custom content for brands",
  },
  {
    value: "LIVE_STREAMS",
    label: "Live Streams",
    icon: "🔴",
    description: "Live streaming collaborations",
  },
  {
    value: "GIVEAWAYS",
    label: "Giveaways & Contests",
    icon: "🎁",
    description: "Product giveaways and contests",
  },
  {
    value: "TUTORIALS",
    label: "Tutorials",
    icon: "📚",
    description: "How-to and educational content",
  },
  {
    value: "UNBOXING",
    label: "Unboxing Videos",
    icon: "📦",
    description: "Product unboxing and first impressions",
  },
];

const CONTENT_FORMATS = [
  {
    value: "REELS",
    label: "Instagram Reels",
    icon: "📹",
    platform: "Instagram",
  },
  {
    value: "STORIES",
    label: "Stories",
    icon: "📱",
    platform: "Instagram/Facebook",
  },
  {
    value: "POSTS",
    label: "Feed Posts",
    icon: "📄",
    platform: "Instagram/Facebook",
  },
  { value: "IGTV", label: "IGTV", icon: "📺", platform: "Instagram" },
  {
    value: "YOUTUBE_VIDEOS",
    label: "YouTube Videos",
    icon: "🎬",
    platform: "YouTube",
  },
  {
    value: "YOUTUBE_SHORTS",
    label: "YouTube Shorts",
    icon: "⚡",
    platform: "YouTube",
  },
  {
    value: "TIKTOK_VIDEOS",
    label: "TikTok Videos",
    icon: "🎵",
    platform: "TikTok",
  },
  {
    value: "LIVE_STREAMS",
    label: "Live Streams",
    icon: "🔴",
    platform: "Multi-platform",
  },
  {
    value: "PODCASTS",
    label: "Podcasts",
    icon: "🎙️",
    platform: "Audio platforms",
  },
  {
    value: "BLOGS",
    label: "Blog Posts",
    icon: "✍️",
    platform: "Website/Medium",
  },
  {
    value: "CAROUSELS",
    label: "Carousel Posts",
    icon: "🎠",
    platform: "Instagram/LinkedIn",
  },
  {
    value: "USER_GENERATED_CONTENT",
    label: "UGC",
    icon: "👥",
    platform: "Multi-platform",
  },
];

const AVAILABILITY_OPTIONS = [
  {
    value: "FULL_TIME",
    label: "Full Time",
    icon: "⏰",
    description: "Available for collaborations full-time",
  },
  {
    value: "PART_TIME",
    label: "Part Time",
    icon: "🕐",
    description: "Available part-time on specific days",
  },
  {
    value: "WEEKENDS_ONLY",
    label: "Weekends Only",
    icon: "📅",
    description: "Only available on weekends",
  },
  {
    value: "FLEXIBLE",
    label: "Flexible",
    icon: "🔄",
    description: "Flexible schedule based on projects",
  },
  {
    value: "PROJECT_BASED",
    label: "Project Based",
    icon: "📋",
    description: "Availability varies per project",
  },
];

const CURRENCIES = [
  { code: "INR", symbol: "₹", label: "Indian Rupee", popular: true },
  { code: "USD", symbol: "$", label: "US Dollar", popular: true },
  { code: "EUR", symbol: "€", label: "Euro", popular: false },
  { code: "GBP", symbol: "£", label: "British Pound", popular: false },
  { code: "CAD", symbol: "C$", label: "Canadian Dollar", popular: false },
  { code: "AUD", symbol: "A$", label: "Australian Dollar", popular: false },
];

const BRAND_CATEGORIES = [
  { value: "SKINCARE", label: "Skincare", icon: "🧴" },
  { value: "MAKEUP", label: "Makeup", icon: "💄" },
  { value: "FASHION", label: "Fashion", icon: "👕" },
  { value: "ELECTRONICS", label: "Electronics", icon: "📱" },
  { value: "FITNESS", label: "Fitness", icon: "🏋️" },
  { value: "FOOD_BEVERAGE", label: "Food & Beverage", icon: "🍽️" },
  { value: "TRAVEL", label: "Travel", icon: "🧳" },
  { value: "AUTOMOTIVE", label: "Automotive", icon: "🚙" },
  { value: "HOME_LIFESTYLE", label: "Home & Lifestyle", icon: "🏡" },
  { value: "HEALTH_WELLNESS", label: "Health & Wellness", icon: "💊" },
];

const INDIAN_LANGUAGES = [
  "English",
  "Hindi",
  "Tamil",
  "Telugu",
  "Bengali",
  "Marathi",
  "Gujarati",
  "Kannada",
  "Malayalam",
  "Odia",
  "Punjabi",
  "Assamese",
  "Urdu",
  "Sanskrit",
];

const OnboardingStep3 = ({ onComplete, onBack, existingData }) => {
  const { submitStep3, loading } = useCreatorOnboarding();

  const [formData, setFormData] = useState({
    primary_niche: "",
    secondary_niche: "",
    collaboration_types: [],
    content_formats: [],
    availability_schedule: "",
    is_affiliate_interested: false,
    minimum_rate: 1000,
    rate_currency: "INR",
    preferred_brands: [],
    content_languages: [],
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load existing data if available
  useEffect(() => {
    if (existingData) {
      setFormData((prev) => ({ ...prev, ...existingData }));
    }
  }, [existingData]);

  const validateField = (name, value) => {
    switch (name) {
      case "primary_niche":
        if (!value) return "Primary niche is required";
        return "";

      case "collaboration_types":
        if (!value || value.length === 0)
          return "At least one collaboration type is required";
        if (value.length > 5) return "Maximum 5 collaboration types allowed";
        return "";

      case "content_formats":
        if (!value || value.length === 0)
          return "At least one content format is required";
        if (value.length > 8) return "Maximum 8 content formats allowed";
        return "";

      case "availability_schedule":
        if (!value) return "Availability schedule is required";
        return "";

      case "minimum_rate":
        if (!value || value <= 0) return "Minimum rate must be greater than 0";
        if (value > 1000000) return "Minimum rate cannot exceed ₹10,00,000";
        return "";

      case "content_languages":
        if (!value || value.length === 0)
          return "At least one content language is required";
        if (value.length > 5) return "Maximum 5 content languages allowed";
        return "";

      case "secondary_niche":
        if (value && value === formData.primary_niche) {
          return "Secondary niche must be different from primary niche";
        }
        return "";

      default:
        return "";
    }
  };

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleArrayToggle = (name, value, maxLimit = null) => {
    const currentArray = formData[name] || [];
    let newArray;

    if (currentArray.includes(value)) {
      newArray = currentArray.filter((item) => item !== value);
    } else {
      if (maxLimit && currentArray.length >= maxLimit) {
        return; // Don't add if limit reached
      }
      newArray = [...currentArray, value];
    }

    handleInputChange(name, newArray);
  };

  const handleFieldBlur = (name) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, formData[name]);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const formatCurrency = (amount, currency) => {
    const currencyInfo = CURRENCIES.find((c) => c.code === currency);
    return `${currencyInfo?.symbol || "₹"}${new Intl.NumberFormat("en-IN").format(amount)}`;
  };

  const isFormValid = () => {
    const requiredFields = [
      "primary_niche",
      "collaboration_types",
      "content_formats",
      "availability_schedule",
      "minimum_rate",
      "content_languages",
    ];

    const allFieldsFilled = requiredFields.every((field) => {
      if (Array.isArray(formData[field])) {
        return formData[field].length > 0;
      }
      return formData[field];
    });

    const hasErrors = Object.values(errors).some((error) => error !== "");
    return allFieldsFilled && !hasErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark all fields as touched
    const allFields = Object.keys(formData);
    setTouched(Object.fromEntries(allFields.map((field) => [field, true])));

    // Validate all fields
    const newErrors = {};
    allFields.forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) newErrors[field] = error;
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await submitStep3(formData);

      if (result.success) {
        onComplete(formData);
      }
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        submit: error.message || "Failed to submit. Please try again.",
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Define Your Creator Niche
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Help us understand your content specialization and collaboration
          preferences
        </p>
      </div>

      {/* Error Display */}
      {errors.submit && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 text-red-500 mr-3"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-red-800 dark:text-red-200">
              {errors.submit}
            </span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Primary & Secondary Niche */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Primary Niche */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Primary Niche *
            </label>
            <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-xl p-4">
              {NICHE_OPTIONS.map((niche) => (
                <label
                  key={niche.value}
                  className="flex items-start space-x-3 cursor-pointer group"
                >
                  <input
                    type="radio"
                    name="primary_niche"
                    value={niche.value}
                    checked={formData.primary_niche === niche.value}
                    onChange={(e) =>
                      handleInputChange("primary_niche", e.target.value)
                    }
                    onBlur={() => handleFieldBlur("primary_niche")}
                    className="mt-1 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-purple-500 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{niche.icon}</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {niche.label}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {niche.description}
                    </p>
                  </div>
                </label>
              ))}
            </div>
            {errors.primary_niche && touched.primary_niche && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                {errors.primary_niche}
              </p>
            )}
          </div>

          {/* Secondary Niche */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Secondary Niche (Optional)
            </label>
            <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-xl p-4">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="secondary_niche"
                  value=""
                  checked={formData.secondary_niche === ""}
                  onChange={(e) =>
                    handleInputChange("secondary_niche", e.target.value)
                  }
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-purple-500 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  None
                </span>
              </label>
              {NICHE_OPTIONS.filter(
                (niche) => niche.value !== formData.primary_niche,
              ).map((niche) => (
                <label
                  key={niche.value}
                  className="flex items-start space-x-3 cursor-pointer group"
                >
                  <input
                    type="radio"
                    name="secondary_niche"
                    value={niche.value}
                    checked={formData.secondary_niche === niche.value}
                    onChange={(e) =>
                      handleInputChange("secondary_niche", e.target.value)
                    }
                    onBlur={() => handleFieldBlur("secondary_niche")}
                    className="mt-1 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-purple-500 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{niche.icon}</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {niche.label}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {niche.description}
                    </p>
                  </div>
                </label>
              ))}
            </div>
            {errors.secondary_niche && touched.secondary_niche && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                {errors.secondary_niche}
              </p>
            )}
          </div>
        </div>

        {/* Collaboration Types */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Collaboration Types * (Select 1-5)
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {COLLABORATION_TYPES.map((type) => (
              <div
                key={type.value}
                className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 ${
                  formData.collaboration_types.includes(type.value)
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400"
                    : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
                onClick={() =>
                  handleArrayToggle("collaboration_types", type.value, 5)
                }
              >
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">{type.icon}</span>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                      {type.label}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {type.description}
                    </p>
                  </div>
                  {formData.collaboration_types.includes(type.value) && (
                    <svg
                      className="w-5 h-5 text-blue-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
              </div>
            ))}
          </div>
          {formData.collaboration_types.length > 0 && (
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Selected: {formData.collaboration_types.length}/5
            </p>
          )}
          {errors.collaboration_types && touched.collaboration_types && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
              {errors.collaboration_types}
            </p>
          )}
        </div>

        {/* Content Formats */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Content Formats * (Select 1-8)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {CONTENT_FORMATS.map((format) => (
              <div
                key={format.value}
                className={`border-2 rounded-lg p-3 cursor-pointer transition-all duration-200 ${
                  formData.content_formats.includes(format.value)
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400"
                    : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
                onClick={() =>
                  handleArrayToggle("content_formats", format.value, 8)
                }
              >
                <div className="text-center">
                  <span className="text-xl block mb-1">{format.icon}</span>
                  <span className="text-xs font-medium text-gray-900 dark:text-white block">
                    {format.label}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 block mt-1">
                    {format.platform}
                  </span>
                </div>
              </div>
            ))}
          </div>
          {formData.content_formats.length > 0 && (
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Selected: {formData.content_formats.length}/8
            </p>
          )}
          {errors.content_formats && touched.content_formats && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
              {errors.content_formats}
            </p>
          )}
        </div>

        {/* Availability & Rate */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Availability Schedule */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Availability Schedule *
            </label>
            <div className="space-y-3">
              {AVAILABILITY_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className="flex items-start space-x-3 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="availability_schedule"
                    value={option.value}
                    checked={formData.availability_schedule === option.value}
                    onChange={(e) =>
                      handleInputChange("availability_schedule", e.target.value)
                    }
                    onBlur={() => handleFieldBlur("availability_schedule")}
                    className="mt-1 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-purple-500 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{option.icon}</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {option.label}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {option.description}
                    </p>
                  </div>
                </label>
              ))}
            </div>
            {errors.availability_schedule && touched.availability_schedule && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                {errors.availability_schedule}
              </p>
            )}
          </div>

          {/* Minimum Rate */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Minimum Collaboration Rate *
            </label>
            <div className="space-y-4">
              <div className="flex space-x-3">
                <select
                  value={formData.rate_currency}
                  onChange={(e) =>
                    handleInputChange("rate_currency", e.target.value)
                  }
                  className="w-24 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:border-transparent focus:ring-blue-500 dark:focus:ring-purple-500"
                >
                  {CURRENCIES.filter((curr) => curr.popular).map((currency) => (
                    <option key={currency.code} value={currency.code}>
                      {currency.symbol} {currency.code}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  min="1"
                  max="1000000"
                  value={formData.minimum_rate}
                  onChange={(e) =>
                    handleInputChange(
                      "minimum_rate",
                      parseInt(e.target.value) || 0,
                    )
                  }
                  onBlur={() => handleFieldBlur("minimum_rate")}
                  className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:border-transparent focus:ring-blue-500 dark:focus:ring-purple-500"
                  placeholder="Enter minimum rate"
                />
              </div>

              {formData.minimum_rate > 0 && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <span className="font-medium">Formatted Rate:</span>{" "}
                    {formatCurrency(
                      formData.minimum_rate,
                      formData.rate_currency,
                    )}
                  </p>
                  <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">
                    This is your minimum rate per collaboration. You can
                    negotiate higher rates based on project scope.
                  </p>
                </div>
              )}

              {/* Affiliate Marketing Interest */}
              <div>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_affiliate_interested}
                    onChange={(e) =>
                      handleInputChange(
                        "is_affiliate_interested",
                        e.target.checked,
                      )
                    }
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-purple-500 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    I'm interested in affiliate marketing opportunities
                  </span>
                </label>
              </div>
            </div>
            {errors.minimum_rate && touched.minimum_rate && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                {errors.minimum_rate}
              </p>
            )}
          </div>
        </div>

        {/* Content Languages */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Content Languages * (Select 1-5)
          </label>
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {INDIAN_LANGUAGES.map((language) => (
              <label
                key={language}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={formData.content_languages.includes(language)}
                  onChange={() =>
                    handleArrayToggle("content_languages", language, 5)
                  }
                  onBlur={() => handleFieldBlur("content_languages")}
                  disabled={
                    !formData.content_languages.includes(language) &&
                    formData.content_languages.length >= 5
                  }
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-purple-500 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {language}
                </span>
              </label>
            ))}
          </div>
          {formData.content_languages.length > 0 && (
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Selected: {formData.content_languages.join(", ")} (
              {formData.content_languages.length}/5)
            </p>
          )}
          {errors.content_languages && touched.content_languages && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
              {errors.content_languages}
            </p>
          )}
        </div>

        {/* Preferred Brand Categories */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Preferred Brand Categories (Optional - Select up to 10)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {BRAND_CATEGORIES.map((category) => (
              <div
                key={category.value}
                className={`border rounded-lg p-3 cursor-pointer transition-all duration-200 text-center ${
                  formData.preferred_brands.includes(category.value)
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400"
                    : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
                onClick={() =>
                  handleArrayToggle("preferred_brands", category.value, 10)
                }
              >
                <span className="text-2xl block mb-1">{category.icon}</span>
                <span className="text-xs font-medium text-gray-900 dark:text-white">
                  {category.label}
                </span>
              </div>
            ))}
          </div>
          {formData.preferred_brands.length > 0 && (
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Selected: {formData.preferred_brands.length}/10
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-6">
          {onBack && (
            <Button
              type="button"
              onClick={onBack}
              variant="outline"
              className="px-6 py-3"
            >
              Back
            </Button>
          )}

          <div className="flex-1" />

          <Button
            type="submit"
            disabled={!isFormValid() || isSubmitting || loading}
            loading={isSubmitting}
            className="px-8 py-3 min-w-[160px]"
          >
            {isSubmitting ? "Saving..." : "Save & Continue"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default OnboardingStep3;
