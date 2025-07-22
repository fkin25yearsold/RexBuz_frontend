import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import ThemeToggle from "../ThemeToggle";

const OnboardingNavbar = ({
  showContinueFormButton = false,
  onContinueForm,
}) => {
  const { user, logout } = useAuth();
  const { isDark } = useTheme();

  const handleLogout = () => {
    logout();
    window.location.hash = "login";
  };

  return (
    <nav className="bg-white dark:bg-dark-card shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Non-clickable during onboarding */}
          <div className="flex items-center">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent cursor-default">
              RexBuz
            </div>
          </div>

          {/* Right side buttons */}
          <div className="flex items-center space-x-4">
            {/* Continue Form Button - shown when user navigates away from onboarding */}
            {showContinueFormButton && onContinueForm && (
              <button
                onClick={onContinueForm}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 text-sm"
              >
                Continue Filling Form
              </button>
            )}

            {/* User greeting */}
            <span className="text-sm text-gray-600 dark:text-gray-400 hidden sm:block">
              Welcome, {user?.full_name || "Creator"}!
            </span>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Signout Button */}
            <button
              onClick={handleLogout}
              className="bg-red-100 hover:bg-red-200 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-700 dark:text-red-300 px-4 py-2 rounded-lg font-medium transition-colors duration-200 text-sm"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default OnboardingNavbar;
