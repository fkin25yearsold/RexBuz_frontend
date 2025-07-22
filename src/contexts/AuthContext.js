import React, { createContext, useContext, useState, useEffect } from "react";
import { tokenManager } from "../config/api";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [onboardingStatus, setOnboardingStatus] = useState(null);

  // Check if user is authenticated on app load
  useEffect(() => {
    checkAuthStatus().catch(console.error);

    // Listen for invalid authentication events from API requests
    const handleAuthInvalid = (event) => {
      console.warn("🔑 Received auth:invalid event:", event.detail);
      logout(true); // Force logout and redirect to login
    };

    window.addEventListener('auth:invalid', handleAuthInvalid);

    // Cleanup event listener
    return () => {
      window.removeEventListener('auth:invalid', handleAuthInvalid);
    };
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = tokenManager.getAccessToken();
      const storedUser = localStorage.getItem("user");

      if (token && tokenManager.isTokenValid(token) && storedUser) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setIsAuthenticated(true);

        // Always fetch fresh onboarding status from API when user logs in
        await fetchOnboardingStatus();
      } else {
        // Clear invalid data
        logout(false); // Don't redirect on initial check
      }
    } catch (error) {
      console.error("Auth check error:", error);
      logout(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch onboarding status from API
  const fetchOnboardingStatus = async () => {
    try {
      const { apiRequest, API_ENDPOINTS, safeJsonParse } = await import("../config/api");

      const response = await apiRequest(
        API_ENDPOINTS.CREATOR_ONBOARDING.STATUS,
        {
          method: "GET",
        },
      );

      // Read the response body once and handle both success and error cases
      const data = await safeJsonParse(response);

      if (response.ok) {
        console.log("📋 Fetched onboarding status from API:", data);

        if (data.success && data.data) {
          // Handle different possible response formats
          const apiData = data.data;

          const statusData = {
            onboarding_required: apiData.onboarding_required !== false, // Default to true if not specified
            is_completed: apiData.is_completed || false,
            completion_percentage: apiData.completion_percentage || apiData.progress_percentage || 0,
            current_step: apiData.current_step || 1,
            next_step: apiData.next_step,
            completed_steps: apiData.completed_steps || [],
            message: data.message || apiData.message || '',
          };

          // Validate and fix data consistency
          if (statusData.completion_percentage > 0 && statusData.current_step === 1) {
            // Calculate correct step from progress
            statusData.current_step = Math.min(Math.floor(statusData.completion_percentage / 16.67) + 1, 6);
            console.log(`📋 Corrected current_step from ${apiData.current_step} to ${statusData.current_step} based on progress ${statusData.completion_percentage}%`);
          }

          localStorage.setItem("onboarding_status", JSON.stringify(statusData));
          setOnboardingStatus(statusData);
          return statusData;
        } else {
          console.warn("API returned success=false or missing data:", data);
        }
      } else {
        console.warn("API response not ok:", response.status, response.statusText, data);
      }
    } catch (error) {
      console.warn("Failed to fetch onboarding status from API:", error);

      // Fallback to localStorage if API fails
      const storedOnboarding = localStorage.getItem("onboarding_status");
      if (storedOnboarding) {
        try {
          const onboardingData = JSON.parse(storedOnboarding);
          setOnboardingStatus(onboardingData);
        } catch (parseError) {
          console.warn("Failed to parse stored onboarding status:", parseError);
        }
      }
    }
  };

  const login = async (userData, tokens, onboardingData = null) => {
    try {
      // Store tokens
      if (tokens.access_token) {
        tokenManager.setTokens(tokens.access_token, tokens.refresh_token);
      }

      // Store user data
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      setIsAuthenticated(true);

      // Always fetch fresh onboarding status from API after login
      try {
        await fetchOnboardingStatus();
      } catch (statusError) {
        console.warn(
          "Failed to fetch onboarding status after login:",
          statusError,
        );

        // Fallback to provided onboarding data
        if (onboardingData) {
          localStorage.setItem(
            "onboarding_status",
            JSON.stringify(onboardingData),
          );
          setOnboardingStatus(onboardingData);
        }
      }

      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const logout = (redirect = true) => {
    try {
      // Clear tokens and user data
      tokenManager.clearTokens();
      localStorage.removeItem("user");
      localStorage.removeItem("onboarding_status");
      setUser(null);
      setIsAuthenticated(false);
      setOnboardingStatus(null);

      // Redirect to home page
      if (redirect) {
        window.location.hash = "#home";
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const updateUser = (updatedUserData) => {
    try {
      const newUserData = { ...user, ...updatedUserData };
      localStorage.setItem("user", JSON.stringify(newUserData));
      setUser(newUserData);
    } catch (error) {
      console.error("Update user error:", error);
    }
  };

  // Check if user needs verification
  const needsVerification = () => {
    return user && (!user.is_email_verified || !user.is_phone_verified);
  };

  // Check if user has completed onboarding using onboarding status
  const needsOnboarding = () => {
    if (onboardingStatus) {
      return onboardingStatus.onboarding_required;
    }
    // Fallback to user data if onboarding status not available
    return user && !user.has_completed_onboarding;
  };

  // Get current onboarding step
  const getCurrentOnboardingStep = () => {
    if (onboardingStatus?.current_step) {
      return onboardingStatus.current_step;
    }

    // Fallback: calculate step from progress if current_step is missing or invalid
    const progress = onboardingStatus?.completion_percentage || 0;
    if (progress > 0) {
      // Calculate step based on progress (6 steps total, so each step is ~16.67%)
      const calculatedStep = Math.min(Math.floor(progress / 16.67) + 1, 6);
      console.log(`📋 Calculated step from progress: ${progress}% -> Step ${calculatedStep}`);
      return calculatedStep;
    }

    return 1;
  };

  // Get onboarding completion percentage
  const getOnboardingProgress = () => {
    return onboardingStatus?.completion_percentage || 0;
  };

  // Get onboarding guidance message
  const getOnboardingMessage = () => {
    return (
      onboardingStatus?.next_step?.description ||
      onboardingStatus?.message ||
      ""
    );
  };

  // Update onboarding status (useful for step completion)
  const updateOnboardingStatus = (newStatus) => {
    try {
      localStorage.setItem("onboarding_status", JSON.stringify(newStatus));
      setOnboardingStatus(newStatus);
    } catch (error) {
      console.error("Update onboarding status error:", error);
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    onboardingStatus,
    login,
    logout,
    updateUser,
    checkAuthStatus,
    needsVerification,
    needsOnboarding,
    getCurrentOnboardingStep,
    getOnboardingProgress,
    getOnboardingMessage,
    updateOnboardingStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
