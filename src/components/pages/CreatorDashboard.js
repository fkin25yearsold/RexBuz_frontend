import React, { useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import ThemeToggle from "../ThemeToggle";

const CreatorDashboard = () => {
  const { user, logout, isAuthenticated, needsOnboarding, isLoading } =
    useAuth();
  const { isDark } = useTheme();

  // Route guard - ensure user is authenticated and has completed onboarding
  useEffect(() => {
    if (isLoading) return; // Wait for auth check to complete

    if (!isAuthenticated) {
      console.log("🚫 User not authenticated, redirecting to login");
      window.location.hash = "login";
      return;
    }

    if (needsOnboarding()) {
      console.log("🚫 User needs onboarding, redirecting to onboarding");
      window.location.hash = "creator-onboarding";
      return;
    }

    console.log(
      "✅ User authenticated and onboarding complete, showing dashboard",
    );
  }, [isAuthenticated, needsOnboarding, isLoading]);

  // Show loading while checking auth status
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-light-bg to-gray-50 dark:from-dark-bg dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  // Show loading if user data is not available yet
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-light-bg to-gray-50 dark:from-dark-bg dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Preparing your dashboard...
          </p>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-light-bg to-gray-50 dark:from-dark-bg dark:to-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-dark-card shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                RexBuz Creator Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Welcome, {user?.full_name || "Creator"}!
              </span>
              <ThemeToggle />
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-white dark:bg-dark-card rounded-2xl shadow-xl p-8 mb-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">🎉</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Welcome to Your Creator Dashboard!
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              Congratulations! You've successfully completed your onboarding and
              can now access all creator features.
            </p>
            <div className="inline-flex items-center px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 rounded-full text-sm font-medium">
              ✅ Onboarding Complete
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-dark-card rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30">
                <span className="text-blue-600 dark:text-blue-400 text-xl">
                  📊
                </span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Profile Views
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  1,234
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-dark-card rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/30">
                <span className="text-purple-600 dark:text-purple-400 text-xl">
                  🤝
                </span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Collaborations
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  12
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-dark-card rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30">
                <span className="text-green-600 dark:text-green-400 text-xl">
                  💰
                </span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Earnings
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  ₹45,678
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Find Campaigns */}
          <div className="bg-white dark:bg-dark-card rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg mb-4">
              <span className="text-blue-600 dark:text-blue-400 text-2xl">
                🔍
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Find Campaigns
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
              Browse and apply to brand collaboration opportunities that match
              your niche.
            </p>
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
              Browse Campaigns
            </button>
          </div>

          {/* Manage Portfolio */}
          <div className="bg-white dark:bg-dark-card rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-center w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg mb-4">
              <span className="text-purple-600 dark:text-purple-400 text-2xl">
                🎨
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Manage Portfolio
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
              Update your portfolio, add new work, and showcase your best
              content.
            </p>
            <button className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
              Edit Portfolio
            </button>
          </div>

          {/* Analytics */}
          <div className="bg-white dark:bg-dark-card rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg mb-4">
              <span className="text-green-600 dark:text-green-400 text-2xl">
                📈
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Analytics
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
              Track your performance, engagement rates, and campaign results.
            </p>
            <button className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
              View Analytics
            </button>
          </div>

          {/* Messages */}
          <div className="bg-white dark:bg-dark-card rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg mb-4">
              <span className="text-yellow-600 dark:text-yellow-400 text-2xl">
                💬
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Messages
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
              Communicate with brands, agencies, and other creators directly.
            </p>
            <button className="w-full bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
              Open Messages
            </button>
          </div>

          {/* Settings */}
          <div className="bg-white dark:bg-dark-card rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-center w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg mb-4">
              <span className="text-gray-600 dark:text-gray-400 text-2xl">
                ⚙️
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Settings
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
              Manage your account settings, preferences, and privacy options.
            </p>
            <button className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
              Open Settings
            </button>
          </div>

          {/* Help & Support */}
          <div className="bg-white dark:bg-dark-card rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-center w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg mb-4">
              <span className="text-red-600 dark:text-red-400 text-2xl">
                🆘
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Help & Support
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
              Get help, access tutorials, and contact our support team.
            </p>
            <button className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
              Get Help
            </button>
          </div>
        </div>

        {/* User Info Section */}
        <div className="bg-white dark:bg-dark-card rounded-lg shadow p-6 mt-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Your Profile Summary
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-600 dark:text-gray-400">
                Name:
              </span>
              <span className="ml-2 text-gray-900 dark:text-white">
                {user?.full_name}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-600 dark:text-gray-400">
                Email:
              </span>
              <span className="ml-2 text-gray-900 dark:text-white">
                {user?.email}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-600 dark:text-gray-400">
                Role:
              </span>
              <span className="ml-2 text-gray-900 dark:text-white capitalize">
                {user?.role}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-600 dark:text-gray-400">
                Verified:
              </span>
              <span className="ml-2 text-gray-900 dark:text-white">
                {user?.is_verified ? "✅ Yes" : "❌ No"}
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-dark-card border-t border-gray-200 dark:border-gray-700 mt-12 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            © 2025 RexBuz. All rights reserved. | Need help? Contact
            support@rexbuz.com
          </p>
        </div>
      </footer>
    </div>
  );
};

export default CreatorDashboard;
