import React, { useState, useEffect } from "react";
import Button from "../../common/Button";
import useCreatorOnboarding from "../../../hooks/useCreatorOnboarding";

const SKILL_CATEGORIES = {
  "Content Creation": [
    { value: "PHOTOGRAPHY", label: "Photography", icon: "📸" },
    { value: "VIDEOGRAPHY", label: "Videography", icon: "🎥" },
    { value: "EDITING", label: "Video/Photo Editing", icon: "✂️" },
    { value: "COPYWRITING", label: "Copywriting", icon: "✍️" },
    { value: "STORYTELLING", label: "Storytelling", icon: "📚" },
    { value: "GRAPHIC_DESIGN", label: "Graphic Design", icon: "🎨" },
    { value: "ANIMATION", label: "Animation", icon: "🎬" },
  ],
  Performance: [
    { value: "ACTING", label: "Acting", icon: "🎭" },
    { value: "COMEDY", label: "Comedy", icon: "😂" },
    { value: "MUSIC_PRODUCTION", label: "Music Production", icon: "🎵" },
    { value: "DANCE", label: "Dance", icon: "💃" },
    { value: "VOICE_OVER", label: "Voice Over", icon: "🎙️" },
  ],
  "Beauty & Fashion": [
    { value: "MAKEUP_ARTISTRY", label: "Makeup Artistry", icon: "💄" },
    { value: "FASHION_STYLING", label: "Fashion Styling", icon: "👗" },
    { value: "PRODUCT_STYLING", label: "Product Styling", icon: "📦" },
  ],
  "Specialized Skills": [
    { value: "COOKING", label: "Cooking", icon: "👨‍🍳" },
    { value: "FITNESS_TRAINING", label: "Fitness Training", icon: "💪" },
    { value: "TECH_REVIEWS", label: "Tech Reviews", icon: "📱" },
    { value: "GAMING", label: "Gaming", icon: "🎮" },
  ],
  "Business & Marketing": [
    { value: "BRAND_COLLABORATION", label: "Brand Collaboration", icon: "🤝" },
    { value: "CONTENT_STRATEGY", label: "Content Strategy", icon: "📊" },
    {
      value: "SOCIAL_MEDIA_MANAGEMENT",
      label: "Social Media Management",
      icon: "📱",
    },
    {
      value: "INFLUENCER_MARKETING",
      label: "Influencer Marketing",
      icon: "📈",
    },
    { value: "TREND_ANALYSIS", label: "Trend Analysis", icon: "📈" },
    { value: "AUDIENCE_ENGAGEMENT", label: "Audience Engagement", icon: "👥" },
  ],
};

const CAMPAIGN_TYPES = [
  { value: "SPONSORED_POST", label: "Sponsored Post" },
  { value: "PRODUCT_REVIEW", label: "Product Review" },
  { value: "BRAND_AMBASSADORSHIP", label: "Brand Ambassadorship" },
  { value: "EVENT_COVERAGE", label: "Event Coverage" },
  { value: "CONTENT_COLLABORATION", label: "Content Collaboration" },
  { value: "AFFILIATE_MARKETING", label: "Affiliate Marketing" },
  { value: "GIVEAWAY", label: "Giveaway" },
  { value: "TUTORIAL", label: "Tutorial" },
  { value: "UNBOXING", label: "Unboxing" },
  { value: "LIVE_STREAM", label: "Live Stream" },
];

const PLATFORMS = [
  { value: "INSTAGRAM", label: "Instagram", icon: "📷" },
  { value: "YOUTUBE", label: "YouTube", icon: "📹" },
  { value: "TIKTOK", label: "TikTok", icon: "🎵" },
  { value: "TWITTER", label: "Twitter", icon: "🐦" },
  { value: "LINKEDIN", label: "LinkedIn", icon: "💼" },
  { value: "FACEBOOK", label: "Facebook", icon: "👥" },
];

const URL_PATTERNS = {
  INSTAGRAM: /^https:\/\/(www\.)?instagram\.com\/(p|reel)\/[A-Za-z0-9_-]+/,
  YOUTUBE: /^https:\/\/(www\.)?youtube\.com\/watch\?v=[A-Za-z0-9_-]+/,
  TIKTOK: /^https:\/\/(www\.)?tiktok\.com\/@[A-Za-z0-9_.]+\/video\/[0-9]+/,
  TWITTER: /^https:\/\/(www\.)?twitter\.com\/[A-Za-z0-9_]+\/status\/[0-9]+/,
  LINKEDIN: /^https:\/\/(www\.)?linkedin\.com\/posts\/[A-Za-z0-9_-]+/,
  PERSONAL: /^https?:\/\/[A-Za-z0-9.-]+\.[A-Za-z]{2,}/,
};

const OnboardingStep4 = ({ onComplete, onBack, existingData }) => {
  const { submitStep4, loading } = useCreatorOnboarding();

  const [formData, setFormData] = useState({
    media_urls: [],
    past_collaborations: [],
    achievements: [],
    skill_tags: [],
    portfolio_description: "",
    best_performing_content: [],
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newMediaUrl, setNewMediaUrl] = useState("");
  const [newAchievement, setNewAchievement] = useState("");

  // Load existing data if available
  useEffect(() => {
    if (existingData) {
      setFormData((prev) => ({ ...prev, ...existingData }));
    }
  }, [existingData]);

  const validateUrl = (url) => {
    if (!url) return false;
    return Object.values(URL_PATTERNS).some((pattern) => pattern.test(url));
  };

  const validateField = (name, value) => {
    switch (name) {
      case "media_urls":
        if (!value || value.length === 0)
          return "At least one media URL is required";
        if (value.length > 20) return "Maximum 20 media URLs allowed";
        return "";

      case "skill_tags":
        if (!value || value.length < 3) return "Minimum 3 skill tags required";
        if (value.length > 15) return "Maximum 15 skill tags allowed";
        return "";

      case "portfolio_description":
        if (!value || value.length < 50)
          return "Portfolio description must be at least 50 characters";
        if (value.length > 1000)
          return "Portfolio description cannot exceed 1000 characters";
        return "";

      case "past_collaborations":
        if (value && value.length > 10)
          return "Maximum 10 past collaborations allowed";
        return "";

      case "achievements":
        if (value && value.length > 10)
          return "Maximum 10 achievements allowed";
        return "";

      case "best_performing_content":
        if (value && value.length > 5)
          return "Maximum 5 best performing content items allowed";
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

  const handleFieldBlur = (name) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, formData[name]);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const addMediaUrl = () => {
    if (!newMediaUrl.trim()) return;

    if (!validateUrl(newMediaUrl)) {
      setErrors((prev) => ({
        ...prev,
        media_url_input: "Invalid URL format or unsupported platform",
      }));
      return;
    }

    if (formData.media_urls.includes(newMediaUrl)) {
      setErrors((prev) => ({ ...prev, media_url_input: "URL already added" }));
      return;
    }

    if (formData.media_urls.length >= 20) {
      setErrors((prev) => ({
        ...prev,
        media_url_input: "Maximum 20 URLs allowed",
      }));
      return;
    }

    handleInputChange("media_urls", [...formData.media_urls, newMediaUrl]);
    setNewMediaUrl("");
    setErrors((prev) => ({ ...prev, media_url_input: "" }));
  };

  const removeMediaUrl = (index) => {
    handleInputChange(
      "media_urls",
      formData.media_urls.filter((_, i) => i !== index),
    );
  };

  const addAchievement = () => {
    if (!newAchievement.trim()) return;

    if (newAchievement.length < 2 || newAchievement.length > 100) {
      setErrors((prev) => ({
        ...prev,
        achievement_input: "Achievement must be 2-100 characters",
      }));
      return;
    }

    if (formData.achievements.length >= 10) {
      setErrors((prev) => ({
        ...prev,
        achievement_input: "Maximum 10 achievements allowed",
      }));
      return;
    }

    handleInputChange("achievements", [
      ...formData.achievements,
      newAchievement,
    ]);
    setNewAchievement("");
    setErrors((prev) => ({ ...prev, achievement_input: "" }));
  };

  const removeAchievement = (index) => {
    handleInputChange(
      "achievements",
      formData.achievements.filter((_, i) => i !== index),
    );
  };

  const toggleSkillTag = (skill) => {
    const currentTags = formData.skill_tags;
    if (currentTags.includes(skill)) {
      handleInputChange(
        "skill_tags",
        currentTags.filter((tag) => tag !== skill),
      );
    } else if (currentTags.length < 15) {
      handleInputChange("skill_tags", [...currentTags, skill]);
    }
  };

  const addCollaboration = () => {
    if (formData.past_collaborations.length >= 10) return;

    const newCollab = {
      brand_name: "",
      campaign_type: "",
      collaboration_date: "",
      campaign_reach: 0,
      campaign_url: "",
    };

    handleInputChange("past_collaborations", [
      ...formData.past_collaborations,
      newCollab,
    ]);
  };

  const updateCollaboration = (index, field, value) => {
    const updated = [...formData.past_collaborations];
    updated[index][field] = value;
    handleInputChange("past_collaborations", updated);
  };

  const removeCollaboration = (index) => {
    handleInputChange(
      "past_collaborations",
      formData.past_collaborations.filter((_, i) => i !== index),
    );
  };

  const addBestPerformingContent = () => {
    if (formData.best_performing_content.length >= 5) return;

    const newContent = {
      content_url: "",
      platform: "",
      performance_metrics: {
        views: 0,
        likes: 0,
        comments: 0,
        shares: 0,
      },
    };

    handleInputChange("best_performing_content", [
      ...formData.best_performing_content,
      newContent,
    ]);
  };

  const updateBestPerformingContent = (index, field, value) => {
    const updated = [...formData.best_performing_content];
    if (field.startsWith("performance_metrics.")) {
      const metricField = field.split(".")[1];
      updated[index].performance_metrics[metricField] = value;
    } else {
      updated[index][field] = value;
    }
    handleInputChange("best_performing_content", updated);
  };

  const removeBestPerformingContent = (index) => {
    handleInputChange(
      "best_performing_content",
      formData.best_performing_content.filter((_, i) => i !== index),
    );
  };

  const isFormValid = () => {
    const requiredFields = [
      "media_urls",
      "skill_tags",
      "portfolio_description",
    ];

    const allFieldsFilled = requiredFields.every((field) => {
      if (Array.isArray(formData[field])) {
        return formData[field].length > 0;
      }
      return (
        formData[field] &&
        formData[field].length >= (field === "portfolio_description" ? 50 : 1)
      );
    });

    const hasErrors = Object.values(errors).some((error) => error !== "");
    return allFieldsFilled && !hasErrors && formData.skill_tags.length >= 3;
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
      const result = await submitStep4(formData);

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
          Showcase Your Portfolio
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Display your best work, skills, and collaboration experience to
          attract brands
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
        {/* Portfolio Media URLs */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Portfolio Media URLs * ({formData.media_urls.length}/20)
          </label>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Add links to your best content from Instagram, YouTube, TikTok,
            Twitter, LinkedIn, or your personal website
          </p>

          <div className="flex space-x-3 mb-4">
            <input
              type="url"
              value={newMediaUrl}
              onChange={(e) => {
                setNewMediaUrl(e.target.value);
                setErrors((prev) => ({ ...prev, media_url_input: "" }));
              }}
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:border-transparent focus:ring-blue-500 dark:focus:ring-purple-500"
              placeholder="https://instagram.com/p/your-post or https://youtube.com/watch?v=..."
            />
            <Button
              type="button"
              onClick={addMediaUrl}
              disabled={formData.media_urls.length >= 20}
              variant="outline"
              className="px-4 py-2"
            >
              Add URL
            </Button>
          </div>

          {errors.media_url_input && (
            <p className="text-sm text-red-600 dark:text-red-400 mb-4">
              {errors.media_url_input}
            </p>
          )}

          {formData.media_urls.length > 0 && (
            <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              {formData.media_urls.map((url, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 rounded-lg p-3"
                >
                  <span className="text-sm text-gray-700 dark:text-gray-300 truncate flex-1">
                    {url}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeMediaUrl(index)}
                    className="ml-3 text-red-500 hover:text-red-700 transition-colors"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}

          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Supported platforms: Instagram, YouTube, TikTok, Twitter, LinkedIn,
            Personal websites
          </p>

          {errors.media_urls && touched.media_urls && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
              {errors.media_urls}
            </p>
          )}
        </div>

        {/* Skill Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Skill Tags * ({formData.skill_tags.length}/15) - Select 3-15
          </label>

          {Object.entries(SKILL_CATEGORIES).map(([category, skills]) => (
            <div key={category} className="mb-6">
              <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-3">
                {category}
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {skills.map((skill) => (
                  <div
                    key={skill.value}
                    className={`border-2 rounded-lg p-3 cursor-pointer transition-all duration-200 ${
                      formData.skill_tags.includes(skill.value)
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                    }`}
                    onClick={() => toggleSkillTag(skill.value)}
                  >
                    <div className="text-center">
                      <span className="text-xl block mb-1">{skill.icon}</span>
                      <span className="text-xs font-medium text-gray-900 dark:text-white">
                        {skill.label}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {formData.skill_tags.length > 0 && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Selected: {formData.skill_tags.length} skills
            </p>
          )}

          {errors.skill_tags && touched.skill_tags && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
              {errors.skill_tags}
            </p>
          )}
        </div>

        {/* Portfolio Description */}
        <div>
          <label
            htmlFor="portfolio_description"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3"
          >
            Portfolio Description * (50-1000 characters)
          </label>
          <textarea
            id="portfolio_description"
            value={formData.portfolio_description}
            onChange={(e) =>
              handleInputChange("portfolio_description", e.target.value)
            }
            onBlur={() => handleFieldBlur("portfolio_description")}
            rows={6}
            className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:ring-2 focus:border-transparent resize-none ${
              errors.portfolio_description && touched.portfolio_description
                ? "border-red-500 focus:ring-red-500 bg-red-50 dark:bg-red-900/10"
                : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-purple-500 bg-white dark:bg-gray-800"
            } text-gray-900 dark:text-white`}
            placeholder="Describe your experience as a creator, your expertise, achievements, and what makes you unique. Include your content style, audience engagement, and collaboration experience..."
            maxLength={1000}
          />
          <div className="flex justify-between mt-2">
            <div>
              {errors.portfolio_description &&
                touched.portfolio_description && (
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {errors.portfolio_description}
                  </p>
                )}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {formData.portfolio_description.length}/1000 characters
            </p>
          </div>
        </div>

        {/* Past Collaborations (Optional) */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Past Collaborations (Optional -{" "}
              {formData.past_collaborations.length}/10)
            </label>
            <Button
              type="button"
              onClick={addCollaboration}
              disabled={formData.past_collaborations.length >= 10}
              variant="outline"
              size="sm"
            >
              Add Collaboration
            </Button>
          </div>

          {formData.past_collaborations.length > 0 && (
            <div className="space-y-4">
              {formData.past_collaborations.map((collab, index) => (
                <div
                  key={index}
                  className="border border-gray-200 dark:border-gray-700 rounded-xl p-4"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                      Collaboration #{index + 1}
                    </h4>
                    <button
                      type="button"
                      onClick={() => removeCollaboration(index)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Brand Name"
                      value={collab.brand_name}
                      onChange={(e) =>
                        updateCollaboration(index, "brand_name", e.target.value)
                      }
                      className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:border-transparent focus:ring-blue-500 dark:focus:ring-purple-500"
                    />

                    <select
                      value={collab.campaign_type}
                      onChange={(e) =>
                        updateCollaboration(
                          index,
                          "campaign_type",
                          e.target.value,
                        )
                      }
                      className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:border-transparent focus:ring-blue-500 dark:focus:ring-purple-500"
                    >
                      <option value="">Select Campaign Type</option>
                      {CAMPAIGN_TYPES.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>

                    <input
                      type="date"
                      value={collab.collaboration_date}
                      onChange={(e) =>
                        updateCollaboration(
                          index,
                          "collaboration_date",
                          e.target.value,
                        )
                      }
                      className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:border-transparent focus:ring-blue-500 dark:focus:ring-purple-500"
                    />

                    <input
                      type="number"
                      placeholder="Campaign Reach"
                      value={collab.campaign_reach}
                      onChange={(e) =>
                        updateCollaboration(
                          index,
                          "campaign_reach",
                          Number(e.target.value),
                        )
                      }
                      min="0"
                      className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:border-transparent focus:ring-blue-500 dark:focus:ring-purple-500"
                    />

                    <input
                      type="url"
                      placeholder="Campaign URL"
                      value={collab.campaign_url}
                      onChange={(e) =>
                        updateCollaboration(
                          index,
                          "campaign_url",
                          e.target.value,
                        )
                      }
                      className="md:col-span-2 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:border-transparent focus:ring-blue-500 dark:focus:ring-purple-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Achievements (Optional) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Achievements & Awards (Optional - {formData.achievements.length}/10)
          </label>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Add your achievements, awards, recognitions, or notable milestones
          </p>

          <div className="flex space-x-3 mb-4">
            <input
              type="text"
              value={newAchievement}
              onChange={(e) => {
                setNewAchievement(e.target.value);
                setErrors((prev) => ({ ...prev, achievement_input: "" }));
              }}
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:border-transparent focus:ring-blue-500 dark:focus:ring-purple-500"
              placeholder="e.g., Featured in Top 100 Beauty Creators 2023"
              maxLength={100}
            />
            <Button
              type="button"
              onClick={addAchievement}
              disabled={formData.achievements.length >= 10}
              variant="outline"
              className="px-4 py-2"
            >
              Add Achievement
            </Button>
          </div>

          {errors.achievement_input && (
            <p className="text-sm text-red-600 dark:text-red-400 mb-4">
              {errors.achievement_input}
            </p>
          )}

          {formData.achievements.length > 0 && (
            <div className="space-y-2">
              {formData.achievements.map((achievement, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 rounded-lg p-3"
                >
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {achievement}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeAchievement(index)}
                    className="ml-3 text-red-500 hover:text-red-700 transition-colors"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Best Performing Content (Optional) */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Best Performing Content (Optional -{" "}
              {formData.best_performing_content.length}/5)
            </label>
            <Button
              type="button"
              onClick={addBestPerformingContent}
              disabled={formData.best_performing_content.length >= 5}
              variant="outline"
              size="sm"
            >
              Add Content
            </Button>
          </div>

          {formData.best_performing_content.length > 0 && (
            <div className="space-y-4">
              {formData.best_performing_content.map((content, index) => (
                <div
                  key={index}
                  className="border border-gray-200 dark:border-gray-700 rounded-xl p-4"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                      Content #{index + 1}
                    </h4>
                    <button
                      type="button"
                      onClick={() => removeBestPerformingContent(index)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <input
                      type="url"
                      placeholder="Content URL"
                      value={content.content_url}
                      onChange={(e) =>
                        updateBestPerformingContent(
                          index,
                          "content_url",
                          e.target.value,
                        )
                      }
                      className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:border-transparent focus:ring-blue-500 dark:focus:ring-purple-500"
                    />

                    <select
                      value={content.platform}
                      onChange={(e) =>
                        updateBestPerformingContent(
                          index,
                          "platform",
                          e.target.value,
                        )
                      }
                      className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:border-transparent focus:ring-blue-500 dark:focus:ring-purple-500"
                    >
                      <option value="">Select Platform</option>
                      {PLATFORMS.map((platform) => (
                        <option key={platform.value} value={platform.value}>
                          {platform.icon} {platform.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <input
                      type="number"
                      placeholder="Views"
                      value={content.performance_metrics.views}
                      onChange={(e) =>
                        updateBestPerformingContent(
                          index,
                          "performance_metrics.views",
                          Number(e.target.value),
                        )
                      }
                      min="0"
                      className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:border-transparent focus:ring-blue-500 dark:focus:ring-purple-500"
                    />

                    <input
                      type="number"
                      placeholder="Likes"
                      value={content.performance_metrics.likes}
                      onChange={(e) =>
                        updateBestPerformingContent(
                          index,
                          "performance_metrics.likes",
                          Number(e.target.value),
                        )
                      }
                      min="0"
                      className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:border-transparent focus:ring-blue-500 dark:focus:ring-purple-500"
                    />

                    <input
                      type="number"
                      placeholder="Comments"
                      value={content.performance_metrics.comments}
                      onChange={(e) =>
                        updateBestPerformingContent(
                          index,
                          "performance_metrics.comments",
                          Number(e.target.value),
                        )
                      }
                      min="0"
                      className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:border-transparent focus:ring-blue-500 dark:focus:ring-purple-500"
                    />

                    <input
                      type="number"
                      placeholder="Shares"
                      value={content.performance_metrics.shares}
                      onChange={(e) =>
                        updateBestPerformingContent(
                          index,
                          "performance_metrics.shares",
                          Number(e.target.value),
                        )
                      }
                      min="0"
                      className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:border-transparent focus:ring-blue-500 dark:focus:ring-purple-500"
                    />
                  </div>
                </div>
              ))}
            </div>
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

export default OnboardingStep4;
