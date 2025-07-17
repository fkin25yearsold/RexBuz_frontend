import React, { useEffect } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";
import Button from "../common/Button";

const LoginSuccessPage = () => {
  const { isDark } = useTheme();
  const { user, logout } = useAuth();

  useEffect(() => {
    // Auto-redirect to dashboard after 5 seconds (you can customize this)
    const timer = setTimeout(() => {
      // For now, just redirect to home since dashboard doesn't exist yet
      window.location.hash = "#home";
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleContinue = () => {
    // Redirect to dashboard or home page
    window.location.hash = "#home";
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${
        isDark
          ? "bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900"
          : "bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50"
      }`}
    >
      <div className="max-w-md w-full space-y-8">
        {/* Success Animation */}
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6">
            <svg
              className="h-10 w-10 text-green-600 animate-pulse"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h2
            className={`text-3xl font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}
          >
            Welcome Back!
          </h2>

          <p
            className={`text-lg mb-4 ${isDark ? "text-gray-300" : "text-gray-600"}`}
          >
            You have successfully signed in to Influbazzar
          </p>
        </div>

        {/* User Info Card */}
        {user && (
          <div
            className={`rounded-lg shadow-lg p-6 ${
              isDark
                ? "bg-gray-800 border border-gray-700"
                : "bg-white border border-gray-200"
            }`}
          >
            <div className="text-center">
              <div
                className={`text-2xl font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}
              >
                {user.full_name}
              </div>

              <div
                className={`text-sm mb-4 ${isDark ? "text-gray-400" : "text-gray-600"}`}
              >
                {user.email}
              </div>

              <div className="flex items-center justify-center space-x-4 mb-4">
                <div
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    user.role === "creator"
                      ? "bg-purple-100 text-purple-800"
                      : user.role === "brand"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-green-100 text-green-800"
                  }`}
                >
                  {user.role === "creator" && "🎨"}
                  {user.role === "brand" && "🏢"}
                  {user.role === "agency" && "🤝"}{" "}
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </div>

                {user.is_verified && (
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    ✅ Verified
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-4">
          <Button
            onClick={handleContinue}
            variant="primary"
            size="lg"
            className="w-full"
          >
            Continue to Dashboard
          </Button>

          <Button
            onClick={handleLogout}
            variant="secondary"
            size="lg"
            className="w-full"
          >
            Sign Out
          </Button>
        </div>

        {/* Auto-redirect notice */}
        <div
          className={`text-center text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
        >
          <p>You will be automatically redirected in 5 seconds...</p>
        </div>

        {/* Verification Status */}
        {user && !user.is_verified && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="text-yellow-400 mr-3">⚠️</div>
              <div>
                <h3 className="text-sm font-medium text-yellow-800">
                  Account Verification Required
                </h3>
                <p className="text-sm text-yellow-700">
                  Please verify your email and phone number to access all
                  features.
                </p>
                <button
                  onClick={() => window.navigateToOtp && window.navigateToOtp()}
                  className="mt-2 text-sm text-yellow-600 hover:text-yellow-500 underline font-medium"
                >
                  Complete Verification
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Onboarding Status */}
        {user && user.is_verified && !user.has_completed_onboarding && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="text-blue-400 mr-3">📋</div>
              <div>
                <h3 className="text-sm font-medium text-blue-800">
                  Complete Your Profile
                </h3>
                <p className="text-sm text-blue-700">
                  Finish setting up your profile to start using all platform
                  features.
                </p>
                <button
                  onClick={() => {
                    // Navigate to onboarding when it's implemented
                    alert("Onboarding flow coming soon!");
                  }}
                  className="mt-2 text-sm text-blue-600 hover:text-blue-500 underline font-medium"
                >
                  Complete Setup
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginSuccessPage;
