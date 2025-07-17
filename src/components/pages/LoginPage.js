import React, { useState, useEffect } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { useUser } from "../../contexts/UserContext";
import { useAuth } from "../../contexts/AuthContext";
import Button from "../common/Button";
import {
  API_ENDPOINTS,
  apiRequest,
  tokenManager,
  rateLimitTracker,
  testApiConnectivity,
} from "../../config/api";

const LoginPage = () => {
  const { isDark } = useTheme();
  const { updateUserData } = useUser();
  const { login } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTab, setSelectedTab] = useState("creator");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Form data state
  const [formData, setFormData] = useState({
    emailOrPhone: "",
    password: "",
  });

  // Field-level errors
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [apiError, setApiError] = useState("");

  // Security states
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [rateLimitTimeLeft, setRateLimitTimeLeft] = useState(0);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isAccountLocked, setIsAccountLocked] = useState(false);
  const [lockTimeLeft, setLockTimeLeft] = useState(0);

  // Device fingerprint for security
  const [deviceFingerprint, setDeviceFingerprint] = useState("");

  useEffect(() => {
    generateDeviceFingerprint();
    checkRateLimit();
  }, []);

  // Generate device fingerprint for security tracking
  const generateDeviceFingerprint = () => {
    try {
      // Create a lightweight fingerprint without large canvas data
      const fingerprint = {
        userAgent: navigator.userAgent.substring(0, 100), // Truncate to avoid huge headers
        language: navigator.language,
        platform: navigator.platform,
        screenResolution: `${screen.width}x${screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        // Removed large canvas data to reduce header size
        browserFeatures: {
          cookieEnabled: navigator.cookieEnabled,
          doNotTrack: navigator.doNotTrack,
          hardwareConcurrency: navigator.hardwareConcurrency || "unknown",
        },
      };

      setDeviceFingerprint(btoa(JSON.stringify(fingerprint)));
    } catch (error) {
      console.log("Fingerprinting not available");
      setDeviceFingerprint("fallback-fingerprint");
    }
  };

  // Check rate limiting status
  const checkRateLimit = () => {
    const isLimited = rateLimitTracker.isRateLimited("login", 10);
    setIsRateLimited(isLimited);

    if (isLimited) {
      // Start countdown timer
      setRateLimitTimeLeft(15 * 60); // 15 minutes
      const timer = setInterval(() => {
        setRateLimitTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsRateLimited(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  // Real-time validation
  const validateField = (name, value) => {
    switch (name) {
      case "emailOrPhone":
        if (!value.trim()) return "Email or phone number is required";

        // Check if it's an email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        // Check if it's a phone (E.164 format)
        const phoneRegex = /^\+?[1-9]\d{9,14}$/;
        const cleanPhone = value.replace(/[^\d+]/g, "");

        if (!emailRegex.test(value) && !phoneRegex.test(cleanPhone)) {
          return "Please enter a valid email address or phone number";
        }

        return "";

      case "password":
        if (!value) return "Password is required";
        if (value.length < 1) return "Password cannot be empty";
        return "";

      default:
        return "";
    }
  };

  // Handle input changes with real-time validation
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    // Clear API error when user starts typing
    if (apiError) setApiError("");

    // Real-time validation for critical fields
    if (name === "emailOrPhone" || name === "password") {
      const error = validateField(name, newValue);
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));

    const error = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  // Format time for display
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  // Normalize email or phone for API
  const normalizeEmailOrPhone = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailRegex.test(value)) {
      return value.toLowerCase().trim();
    } else {
      // It's a phone number - normalize to E.164 format
      let phone = value.replace(/[^\d+]/g, "");
      if (!phone.startsWith("+")) {
        // Assume it's a US number if no country code
        phone = "+1" + phone;
      }
      return phone;
    }
  };

  // Check if form is valid
  const isFormValid = () => {
    // Re-validate all fields
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check rate limiting
    if (isRateLimited) {
      setApiError(
        `Too many login attempts. Please wait ${formatTime(rateLimitTimeLeft)} before trying again.`,
      );
      return;
    }

    if (!isFormValid()) {
      // Focus on first error field
      const firstErrorField = Object.keys(errors)[0];
      if (firstErrorField) {
        const element = document.querySelector(`[name="${firstErrorField}"]`);
        if (element) {
          element.focus();
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
      return;
    }

    // Only proceed if Creator tab is selected (others are preview mode)
    if (selectedTab !== "creator") {
      setApiError(
        "Login is currently only available for Creators. Brand and Agency access coming soon!",
      );
      return;
    }

    setIsSubmitting(true);
    setApiError("");

    try {
      // Record rate limit attempt
      rateLimitTracker.recordAttempt("login");

      const normalizedEmailOrPhone = normalizeEmailOrPhone(
        formData.emailOrPhone,
      );

      const requestBody = {
        email_or_phone: normalizedEmailOrPhone,
        password: formData.password,
        remember_me: rememberMe,
      };

      console.log("🚀 Making login request to:", API_ENDPOINTS.AUTH.LOGIN);
      console.log("📦 Request body:", requestBody);

      // Get user IP first to avoid async issues in headers
      const userIP = await getUserIP();
      console.log("🌐 User IP:", userIP);

      const response = await apiRequest(API_ENDPOINTS.AUTH.LOGIN, {
        method: "POST",
        headers: {
          "X-Device-Fingerprint": deviceFingerprint,
          "X-Real-IP": userIP,
        },
        body: JSON.stringify(requestBody),
      });

      console.log("📡 Response received:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.log("❌ Error response:", errorData);

        // Handle new API error response format
        const errorMessage =
          errorData.error?.message ||
          errorData.detail ||
          errorData.message ||
          "Login failed";

        // Handle specific error cases
        if (response.status === 401) {
          setFailedAttempts((prev) => prev + 1);
          if (failedAttempts >= 4) {
            // 5th attempt triggers lockout
            setIsAccountLocked(true);
            setLockTimeLeft(30 * 60); // 30 minutes
            setApiError(
              "Account locked due to multiple failed attempts. Please try again in 30 minutes.",
            );
          } else {
            setApiError(errorMessage);
          }
        } else if (response.status === 422) {
          // Validation error - extract field details
          const validationErrors = errorData.error?.details || [];
          if (validationErrors.length > 0) {
            const fieldErrors = validationErrors
              .map((err) => err.message)
              .join(", ");
            setApiError(`Validation error: ${fieldErrors}`);
          } else {
            setApiError(errorMessage);
          }
        } else if (response.status === 403) {
          if (errorData.error?.code === "VERIFICATION_REQUIRED") {
            setApiError(
              "Account verification required. Please verify your email and phone number.",
            );
            // Could redirect to verification page here
          } else {
            setApiError(errorMessage);
          }
        } else if (response.status === 423) {
          setIsAccountLocked(true);
          setApiError(errorMessage);
        } else if (response.status === 429) {
          setIsRateLimited(true);
          checkRateLimit();
          setApiError(errorMessage);
        } else {
          setApiError(errorMessage);
        }
        return;
      }

      const responseData = await response.json();
      console.log("📦 Login response data:", responseData);

      // Handle the new API response structure with nested data
      const user = responseData.data?.user || responseData.user;
      const tokens = responseData.data?.tokens || {
        access_token: responseData.access_token,
        refresh_token: responseData.refresh_token,
      };

      if (!user || !tokens.access_token) {
        console.error("❌ Invalid response structure:", responseData);
        setApiError("Invalid server response. Please try again.");
        return;
      }

      console.log("👤 User data:", user);
      console.log("🔑 Tokens:", {
        access_token: tokens.access_token ? "present" : "missing",
      });

      // Use AuthContext to manage authentication state
      const loginSuccess = login(user, {
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
      });

      if (!loginSuccess) {
        setApiError("Failed to save login session. Please try again.");
        return;
      }

      // Also update UserContext for backward compatibility
      updateUserData(user);

      // Reset failed attempts on successful login
      setFailedAttempts(0);
      setIsAccountLocked(false);

      // Redirect based on user verification status
      if (!user.is_verified) {
        // Redirect to verification page
        window.navigateToOtp && window.navigateToOtp();
      } else {
        // Redirect to login success page
        window.navigateToLoginSuccess && window.navigateToLoginSuccess();
      }
    } catch (error) {
      console.error("Login error:", error);

      // Provide specific error messages based on error type
      if (error.message.includes("timeout")) {
        setApiError(
          "Request timeout - the server is taking too long to respond. Please try again.",
        );
      } else if (error.message.includes("Network error")) {
        setApiError(
          "Cannot connect to the server. Please check your internet connection or try again later.",
        );
      } else if (error.message.includes("Failed to fetch")) {
        setApiError(
          "Unable to reach the login server. The service may be temporarily unavailable.",
        );
      } else {
        setApiError(
          error.message || "An unexpected error occurred. Please try again.",
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get user's IP address (reliable version with timeout)
  const getUserIP = async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout

      const response = await fetch("https://api.ipify.org?format=json", {
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error("IP service unavailable");
      }

      const data = await response.json();
      console.log("📍 Retrieved user IP:", data.ip);
      return data.ip;
    } catch (error) {
      console.warn("⚠️ Failed to get user IP:", error.message);
      return "unknown";
    }
  };

  // Validate ngrok URL format
  const validateNgrokUrl = (url) => {
    try {
      const urlObj = new URL(url);
      const isNgrok =
        urlObj.hostname.includes("ngrok") ||
        urlObj.hostname.includes("ngrok-free.app");
      const isHttps = urlObj.protocol === "https:";

      return {
        valid: isNgrok && isHttps,
        hostname: urlObj.hostname,
        protocol: urlObj.protocol,
        isNgrok: isNgrok,
        isHttps: isHttps,
      };
    } catch {
      return { valid: false, error: "Invalid URL format" };
    }
  };

  // Test API connectivity for debugging
  const handleTestConnectivity = async () => {
    setApiError("🔍 Running connectivity diagnostics...");

    // First, try a direct fetch to bypass our API wrapper
    console.log("🧪 Direct fetch test to login endpoint...");
    try {
      const directResponse = await fetch(
        "https://b2ff7ff9d63e.ngrok-free.app/api/v1/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
          body: JSON.stringify({
            email_or_phone: "test@test.com",
            password: "test123",
            remember_me: false,
          }),
        },
      );

      console.log("✅ Direct fetch successful! Status:", directResponse.status);
      setApiError(
        `✅ Direct fetch test passed! Status: ${directResponse.status}\n\nThe API is accessible, issue might be in our wrapper.`,
      );
      return;
    } catch (directError) {
      console.error("❌ Direct fetch failed:", directError);
      setApiError(
        `❌ Direct fetch failed: ${directError.message}\n\nThis confirms the ngrok URL is not accessible.\n\n💡 Solutions:\n1. Check if ngrok tunnel is running\n2. Get a new ngrok URL from backend team\n3. Verify backend server is running\n\nCurrent URL: https://b2ff7ff9d63e.ngrok-free.app`,
      );
      return;
    }

    try {
      const results = await testApiConnectivity();

      // Additional test: Try the actual login endpoint with a test request
      console.log("🧪 Testing login endpoint specifically...");
      try {
        const testResponse = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
          method: "POST",
          mode: "cors",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
            Accept: "application/json",
          },
          body: JSON.stringify({
            email_or_phone: "test@test.com",
            password: "test123",
          }),
        });

        console.log("🔗 Login endpoint response:", testResponse.status);
        results.tests.push({
          name: "Login Endpoint Test",
          success: testResponse.status !== 0, // Status 0 means network error
          details: `Login endpoint responded with status ${testResponse.status} (${testResponse.status === 400 || testResponse.status === 401 ? "Expected for test credentials" : "Unexpected"})`,
        });

        if (testResponse.status === 400 || testResponse.status === 401) {
          results.overallSuccess = true; // These are expected responses for bad credentials
        }
      } catch (loginError) {
        console.error("❌ Login endpoint test failed:", loginError);
        results.tests.push({
          name: "Login Endpoint Test",
          success: false,
          details: `Login endpoint failed: ${loginError.message}`,
        });
        results.recommendations.push(
          "Login endpoint is not accessible - check ngrok URL",
        );
      }

      let message = "📋 Connectivity Test Results:\n\n";

      results.tests.forEach((test, index) => {
        const status = test.success ? "✅" : "❌";
        message += `${index + 1}. ${test.name}: ${status} ${test.details}\n`;
      });

      if (results.overallSuccess) {
        message += "\n🎉 Overall Status: API is accessible!";
      } else {
        message += "\n❌ Overall Status: Connection issues detected";

        if (results.recommendations.length > 0) {
          message += "\n\n💡 Recommendations:";
          results.recommendations.forEach((rec, index) => {
            message += `\n${index + 1}. ${rec}`;
          });
        }
      }

      setApiError(message);
    } catch (error) {
      setApiError(`❌ Connectivity test failed: ${error.message}`);
    }
  };

  // Tab configuration
  const tabs = [
    {
      id: "creator",
      label: "Creator",
      icon: "🎨",
      description: "Content creators and influencers",
    },
    {
      id: "brand",
      label: "Brand",
      icon: "🏢",
      description: "Brands and businesses (Preview)",
    },
    {
      id: "agency",
      label: "Agency",
      icon: "🤝",
      description: "Marketing agencies (Preview)",
    },
  ];

  // Get dynamic labels based on selected tab
  const getFieldLabel = (field) => {
    const labels = {
      creator: {
        emailOrPhone: "Email or Phone Number",
      },
      brand: {
        emailOrPhone: "Business Email or Phone",
      },
      agency: {
        emailOrPhone: "Agency Email or Phone",
      },
    };

    return labels[selectedTab]?.[field] || labels.creator[field];
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
        {/* Header */}
        <div className="text-center">
          <h2
            className={`text-3xl font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}
          >
            Welcome Back to Influbazzar
          </h2>
          <p
            className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}
          >
            Sign in to your account to continue
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="w-full">
          <div
            className={`flex rounded-lg p-1 ${isDark ? "bg-gray-800" : "bg-gray-100"}`}
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`flex-1 flex flex-col items-center py-3 px-2 rounded-md text-xs font-medium transition-all duration-200 ${
                  selectedTab === tab.id
                    ? isDark
                      ? "bg-purple-600 text-white shadow-lg"
                      : "bg-white text-purple-600 shadow-lg"
                    : isDark
                      ? "text-gray-300 hover:text-white hover:bg-gray-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
                }`}
              >
                <span className="text-lg mb-1">{tab.icon}</span>
                <span className="font-semibold">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Description */}
          <div className="mt-3 text-center">
            <p
              className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
            >
              {tabs.find((tab) => tab.id === selectedTab)?.description}
            </p>
            {selectedTab !== "creator" && (
              <p
                className={`text-xs mt-1 ${isDark ? "text-yellow-400" : "text-orange-600"} font-medium`}
              >
                🚀 Preview mode - Full access coming soon!
              </p>
            )}
          </div>
        </div>

        {/* Security Warnings */}
        {isRateLimited && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="text-red-400 mr-3">⚠️</div>
              <div>
                <h3 className="text-sm font-medium text-red-800">
                  Too Many Attempts
                </h3>
                <p className="text-sm text-red-700">
                  Please wait {formatTime(rateLimitTimeLeft)} before trying
                  again.
                </p>
              </div>
            </div>
          </div>
        )}

        {isAccountLocked && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="text-yellow-400 mr-3">🔒</div>
              <div>
                <h3 className="text-sm font-medium text-yellow-800">
                  Account Locked
                </h3>
                <p className="text-sm text-yellow-700">
                  Your account is temporarily locked due to security reasons.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Login Form */}
        <form
          onSubmit={handleSubmit}
          className={`space-y-6 p-8 rounded-lg shadow-lg ${
            isDark
              ? "bg-gray-800 border border-gray-700"
              : "bg-white border border-gray-200"
          }`}
        >
          {/* API Error Display */}
          {apiError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="text-sm text-red-700">{apiError}</div>
            </div>
          )}

          {/* Email/Phone Field */}
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}
            >
              {getFieldLabel("emailOrPhone")} *
            </label>
            <input
              type="text"
              name="emailOrPhone"
              value={formData.emailOrPhone}
              onChange={handleInputChange}
              onBlur={handleBlur}
              placeholder="Enter your email or phone number"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                errors.emailOrPhone && touched.emailOrPhone
                  ? "border-red-500 focus:ring-red-200 bg-red-50"
                  : isDark
                    ? "border-gray-600 bg-gray-700 text-white focus:ring-purple-200 focus:border-purple-500"
                    : "border-gray-300 bg-white text-gray-900 focus:ring-purple-200 focus:border-purple-500"
              }`}
              disabled={isSubmitting || isRateLimited || isAccountLocked}
              autoComplete="username"
            />
            {errors.emailOrPhone && touched.emailOrPhone && (
              <p className="text-sm text-red-600 mt-1">{errors.emailOrPhone}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}
            >
              Password *
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                onBlur={handleBlur}
                placeholder="Enter your password"
                className={`w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                  errors.password && touched.password
                    ? "border-red-500 focus:ring-red-200 bg-red-50"
                    : isDark
                      ? "border-gray-600 bg-gray-700 text-white focus:ring-purple-200 focus:border-purple-500"
                      : "border-gray-300 bg-white text-gray-900 focus:ring-purple-200 focus:border-purple-500"
                }`}
                disabled={isSubmitting || isRateLimited || isAccountLocked}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute inset-y-0 right-0 pr-3 flex items-center ${
                  isDark
                    ? "text-gray-400 hover:text-gray-300"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                disabled={isSubmitting}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
            {errors.password && touched.password && (
              <p className="text-sm text-red-600 mt-1">{errors.password}</p>
            )}
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                disabled={isSubmitting || isRateLimited || isAccountLocked}
              />
              <label
                className={`ml-2 block text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}
              >
                Remember me
              </label>
            </div>
            <button
              type="button"
              className={`text-sm font-medium hover:underline ${
                isDark
                  ? "text-purple-400 hover:text-purple-300"
                  : "text-purple-600 hover:text-purple-500"
              }`}
              onClick={() => {
                // TODO: Implement forgot password
                alert("Forgot password feature coming soon!");
              }}
            >
              Forgot password?
            </button>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={
              isSubmitting ||
              isRateLimited ||
              isAccountLocked ||
              selectedTab !== "creator"
            }
            className="w-full"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Signing In...
              </div>
            ) : selectedTab === "creator" ? (
              "Sign In"
            ) : (
              `Sign In (${tabs.find((t) => t.id === selectedTab)?.label} Preview)`
            )}
          </Button>

          {/* Sign Up Link */}
          <div className="text-center">
            <p
              className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
            >
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() =>
                  window.navigateToSignup && window.navigateToSignup()
                }
                className={`font-medium hover:underline ${
                  isDark
                    ? "text-purple-400 hover:text-purple-300"
                    : "text-purple-600 hover:text-purple-500"
                }`}
              >
                Sign up here
              </button>
            </p>

            {/* Connectivity Test Button for Debugging */}
            <div className="mt-4 space-y-2">
              <button
                type="button"
                onClick={handleTestConnectivity}
                className={`text-xs px-3 py-1 rounded border ${
                  isDark
                    ? "border-gray-600 text-gray-400 hover:text-gray-300 hover:border-gray-500"
                    : "border-gray-300 text-gray-600 hover:text-gray-700 hover:border-gray-400"
                } transition-colors duration-200`}
              >
                🌐 Test Login API
              </button>

              <button
                type="button"
                onClick={async () => {
                  console.log("🧪 Testing signup endpoint...");
                  try {
                    const signupResponse = await fetch(
                      "https://b2ff7ff9d63e.ngrok-free.app/api/v1/auth/signup",
                      {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                          "ngrok-skip-browser-warning": "true",
                        },
                        body: JSON.stringify({
                          email: "test@test.com",
                          password: "test123",
                          full_name: "Test User",
                        }),
                      },
                    );
                    console.log(
                      "📝 Signup test status:",
                      signupResponse.status,
                    );
                    setApiError(
                      `📝 Signup endpoint test: Status ${signupResponse.status}\n\nSignup endpoint ${signupResponse.status !== 0 ? "is accessible" : "failed"}`,
                    );
                  } catch (error) {
                    console.error("❌ Signup test failed:", error);
                    setApiError(`❌ Signup test failed: ${error.message}`);
                  }
                }}
                className={`text-xs px-3 py-1 rounded border ml-2 ${
                  isDark
                    ? "border-gray-600 text-gray-400 hover:text-gray-300 hover:border-gray-500"
                    : "border-gray-300 text-gray-600 hover:text-gray-700 hover:border-gray-400"
                } transition-colors duration-200`}
              >
                📝 Test Signup API
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
