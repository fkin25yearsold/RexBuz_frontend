import React from "react";
import { useTheme } from "../../contexts/ThemeContext";
import Button from "../common/Button";
import ThemeToggle from "../ThemeToggle";

const OnboardingDemo = () => {
  const { isDark } = useTheme();

  const handleStartOnboarding = () => {
    // Simulate being logged in for demo
    localStorage.setItem("access_token", "demo_token_12345");
    localStorage.setItem(
      "user",
      JSON.stringify({
        id: "demo_user_123",
        full_name: "Demo Creator",
        email: "demo@example.com",
        has_completed_onboarding: false,
      }),
    );

    // Navigate to onboarding
    window.navigateToCreatorOnboarding();
  };

  const features = [
    {
      icon: "👤",
      title: "Basic Profile Setup",
      description:
        "Upload profile picture, set display name, and personal details",
      step: "Step 1",
    },
    {
      icon: "📱",
      title: "Social Media Integration",
      description:
        "Connect your Instagram, YouTube, TikTok and other platforms",
      step: "Step 2",
    },
    {
      icon: "🎯",
      title: "Niche & Preferences",
      description:
        "Define your content categories and collaboration preferences",
      step: "Step 3",
      comingSoon: true,
    },
    {
      icon: "📂",
      title: "Portfolio Showcase",
      description: "Upload your best work and showcase your creativity",
      step: "Step 4",
      comingSoon: true,
    },
    {
      icon: "✅",
      title: "Identity Verification",
      description: "Verify your identity and setup payment information",
      step: "Step 5",
      comingSoon: true,
    },
    {
      icon: "⚙️",
      title: "Platform Settings",
      description: "Configure notifications and platform preferences",
      step: "Step 6",
      comingSoon: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-light-bg to-gray-50 dark:from-dark-bg dark:to-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-dark-card shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                RexBuz Creator Onboarding Demo
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => (window.location.hash = "home")}
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                ← Back to Home
              </button>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">🚀</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Creator Onboarding Experience
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Experience our comprehensive 6-step onboarding process designed to
            help creators build their profile and connect with brands on RexBuz.
          </p>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 mb-8 max-w-2xl mx-auto">
            <div className="flex items-start">
              <svg
                className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-3 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="text-left">
                <p className="text-yellow-800 dark:text-yellow-200 font-medium mb-1">
                  Demo Mode
                </p>
                <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                  This is a demonstration of the onboarding flow. Steps 1-2 are
                  fully functional. API calls will use mock data for demo
                  purposes.
                </p>
              </div>
            </div>
          </div>

          <Button
            onClick={handleStartOnboarding}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold min-w-[200px]"
          >
            Start Onboarding Demo
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`bg-white dark:bg-dark-card rounded-2xl p-6 shadow-lg border transition-all duration-300 hover:shadow-xl ${
                feature.comingSoon
                  ? "border-gray-200 dark:border-gray-700 opacity-75"
                  : "border-blue-200 dark:border-blue-800 hover:border-blue-300 dark:hover:border-blue-700"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="text-3xl">{feature.icon}</div>
                <div className="flex items-center space-x-2">
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${
                      feature.comingSoon
                        ? "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                        : "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                    }`}
                  >
                    {feature.step}
                  </span>
                  {feature.comingSoon && (
                    <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 font-medium">
                      Coming Soon
                    </span>
                  )}
                </div>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>

              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Key Features */}
        <div className="bg-white dark:bg-dark-card rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Key Features of Our Onboarding
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg
                    className="w-4 h-4 text-green-600 dark:text-green-400"
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
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    Real-time Validation
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Instant feedback on form fields with comprehensive
                    validation
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg
                    className="w-4 h-4 text-green-600 dark:text-green-400"
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
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    Progress Tracking
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Visual progress indicator showing completion status
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg
                    className="w-4 h-4 text-green-600 dark:text-green-400"
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
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    File Upload
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Drag & drop profile picture upload with validation
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg
                    className="w-4 h-4 text-green-600 dark:text-green-400"
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
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    Display Name Check
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Live availability checking with suggestions
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg
                    className="w-4 h-4 text-green-600 dark:text-green-400"
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
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    Multi-Platform Support
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Connect up to 8 social media platforms
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg
                    className="w-4 h-4 text-green-600 dark:text-green-400"
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
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    Dark Mode Support
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Fully responsive with dark/light theme support
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 py-8 text-center text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
        <p>
          RexBuz Creator Onboarding Demo - Built with React, Tailwind CSS, and
          modern web standards
        </p>
      </footer>
    </div>
  );
};

export default OnboardingDemo;
