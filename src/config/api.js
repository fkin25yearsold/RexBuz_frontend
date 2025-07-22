// API Configuration
// Centralized API configuration that can be easily changed via environment variables
import { ACTIVE_NGROK_URL } from "./ngrok-urls.js";

const API_CONFIG = {
  // Base URL - can be overridden by environment variable
  BASE_URL: import.meta.env.VITE_API_BASE_URL || ACTIVE_NGROK_URL,

  // API Version
  VERSION: "v1",

  // Timeout settings
  TIMEOUT: 60000, // 60 seconds

  // Request headers
  DEFAULT_HEADERS: {
    "Content-Type": "application/json",
    "User-Agent": "Influbazzar-Frontend/1.0.0",
  },
};

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication endpoints
  AUTH: {
    SIGNUP: `${API_CONFIG.BASE_URL}/api/${API_CONFIG.VERSION}/auth/signup`,
    LOGIN: `${API_CONFIG.BASE_URL}/api/${API_CONFIG.VERSION}/auth/login`,
    LOGOUT: `${API_CONFIG.BASE_URL}/api/${API_CONFIG.VERSION}/auth/logout`,
    REFRESH_TOKEN: `${API_CONFIG.BASE_URL}/api/${API_CONFIG.VERSION}/auth/token/refresh`,
    REQUEST_OTP: `${API_CONFIG.BASE_URL}/api/${API_CONFIG.VERSION}/auth/request-otp`,
    VERIFY_OTP_EMAIL: `${API_CONFIG.BASE_URL}/api/${API_CONFIG.VERSION}/auth/verify-otp/email`,
    VERIFY_OTP_PHONE: `${API_CONFIG.BASE_URL}/api/${API_CONFIG.VERSION}/auth/verify-otp/phone`,
    FORGOT_PASSWORD: `${API_CONFIG.BASE_URL}/api/${API_CONFIG.VERSION}/auth/forgot-password`,
    RESET_PASSWORD: `${API_CONFIG.BASE_URL}/api/${API_CONFIG.VERSION}/auth/reset-password`,
  },

  // User endpoints
  USER: {
    PROFILE: `${API_CONFIG.BASE_URL}/api/${API_CONFIG.VERSION}/user/profile`,
    UPDATE_PROFILE: `${API_CONFIG.BASE_URL}/api/${API_CONFIG.VERSION}/user/profile`,
    CHANGE_PASSWORD: `${API_CONFIG.BASE_URL}/api/${API_CONFIG.VERSION}/user/change-password`,
  },

  // Creator Onboarding endpoints
  CREATOR_ONBOARDING: {
    STATUS: `${API_CONFIG.BASE_URL}/api/${API_CONFIG.VERSION}/creator/onboarding/status`,
    CHECK_DISPLAY_NAME: `${API_CONFIG.BASE_URL}/api/${API_CONFIG.VERSION}/creator/onboarding/display-name/check`,
    STEP1_BASIC_PROFILE: `${API_CONFIG.BASE_URL}/api/${API_CONFIG.VERSION}/creator/onboarding/step1/basic-profile`,
    STEP2_SOCIAL_MEDIA: `${API_CONFIG.BASE_URL}/api/${API_CONFIG.VERSION}/creator/onboarding/step2/social-media`,
    STEP3_NICHE_PREFERENCES: `${API_CONFIG.BASE_URL}/api/${API_CONFIG.VERSION}/creator/onboarding/step3/niche-preferences`,
    STEP4_PORTFOLIO: `${API_CONFIG.BASE_URL}/api/${API_CONFIG.VERSION}/creator/onboarding/step4/portfolio`,
    STEP5_VERIFICATION: `${API_CONFIG.BASE_URL}/api/${API_CONFIG.VERSION}/creator/onboarding/step5/verification`,
    STEP6_PLATFORM_PREFERENCES: `${API_CONFIG.BASE_URL}/api/${API_CONFIG.VERSION}/creator/onboarding/step6/platform-preferences`,


  },
};

// Safe JSON parsing utility to prevent "body stream already read" errors
// This reads the response as text first, then parses JSON manually
export const safeJsonParse = async (response) => {
  try {
    // Check if the response body has already been consumed
    if (response.bodyUsed) {
      // Try to extract cached data if available
      if (response._parsedJSON !== undefined) {
        return response._parsedJSON;
      }

      // For backend 4xx/5xx errors, return a generic error object instead of throwing
      if (response.status >= 400) {
        console.warn(`Backend error ${response.status}, returning generic error object`);
        const genericError = { error: { message: `${response.status >= 500 ? 'Server' : 'Client'} error (${response.status})` } };
        response._parsedJSON = genericError;
        return genericError;
      }

      throw new Error(`Response body was already consumed. Status: ${response.status}`);
    }

    // Read the response as text first to avoid "body stream already read" errors
    const textContent = await response.text();

    // Cache the parsed result on the response object for potential reuse
    let parsedJSON;

    // If the response is empty, return null
    if (!textContent.trim()) {
      console.warn("Empty response received from server");
      parsedJSON = null;
      response._parsedJSON = parsedJSON;
      return parsedJSON;
    }

    // Try to parse as JSON
    try {
      parsedJSON = JSON.parse(textContent);
      response._parsedJSON = parsedJSON;
      return parsedJSON;
    } catch (parseError) {
      console.error("Failed to parse response as JSON:", parseError);
      console.error("Response status:", response.status, response.statusText);
      console.error("Response text content:", textContent.substring(0, 500) + (textContent.length > 500 ? "..." : ""));

      // Check if it's an HTML error page
      if (textContent.includes('<html>') || textContent.includes('<!DOCTYPE')) {
        throw new Error(`Server error (${response.status}): The server returned an HTML error page instead of JSON. This typically indicates a server-side issue.`);
      }

      // Cache the error information
      response._parsedJSON = null;
      response._parseError = parseError;

      // For 4xx/5xx errors, return a generic error object - don't throw
      if (response.status >= 400) {
        console.warn(`Backend error ${response.status}, invalid JSON response`);
        const genericError = { error: { message: `${response.status >= 500 ? 'Server' : 'Client'} error (${response.status})` } };
        response._parsedJSON = genericError;
        return genericError;
      } else {
        throw new Error(`Invalid JSON response from server (${response.status}): ${parseError.message}`);
      }
    }
  } catch (textError) {
    console.error("Failed to read response as text:", textError);
    console.error("Response status:", response.status, response.statusText);

    // This could happen if the body stream was already consumed
    if (textError.message && textError.message.includes('body stream already read')) {
      // For backend 4xx/5xx errors, return a generic error object instead of throwing
      if (response.status >= 400) {
        console.warn(`Backend error ${response.status}, body already consumed`);
        const genericError = { error: { message: `${response.status >= 500 ? 'Server' : 'Client'} error (${response.status})` } };
        response._parsedJSON = genericError;
        return genericError;
      }

      throw new Error(`Response body was already consumed. Status: ${response.status}`);
    }

    // For other text reading errors on 4xx/5xx, also return generic error
    if (response.status >= 400) {
      console.warn(`Backend error ${response.status}, failed to read response`);
      const genericError = { error: { message: `${response.status >= 500 ? 'Server' : 'Client'} error (${response.status})` } };
      response._parsedJSON = genericError;
      return genericError;
    }

    throw new Error(`Failed to read response from server (${response.status}): ${textError.message}`);
  }
};

// API Helper functions
export const apiRequest = async (url, options = {}) => {
  console.log("🚀 API Request starting:", { url, method: options.method });

  // Extract timeout from options or use default
  const timeoutMs = options.timeout || API_CONFIG.TIMEOUT;

  // Add validation for URL
  if (!url || typeof url !== "string") {
    throw new Error(`Invalid URL provided: ${url}`);
  }

  console.log("⚙️ Request config:", { timeoutMs, url });

  // Handle async header values first (like getUserIP)
  const resolvedHeaders = {};
  if (options.headers) {
    for (const [key, value] of Object.entries(options.headers)) {
      try {
        // If value is a promise or async function result, await it
        resolvedHeaders[key] = await Promise.resolve(value);
      } catch (error) {
        console.warn(`Failed to resolve header ${key}:`, error);
        resolvedHeaders[key] = "unknown";
      }
    }
  }

  // Build proper fetch configuration with enhanced ngrok headers
  const config = {
    method: options.method || "GET",
    mode: "cors",
    credentials: "include",
    headers: {
      Accept: "application/json",
      "ngrok-skip-browser-warning": "true",
      "User-Agent": "Influbazzar-Frontend/1.0.0",
      // Additional headers that might help with ngrok
      "X-Requested-With": "XMLHttpRequest",
      ...resolvedHeaders,
    },
    ...(options.body && { body: options.body }),
  };

  // Only set Content-Type for non-FormData requests
  if (options.body && !(options.body instanceof FormData)) {
    config.headers["Content-Type"] = "application/json";
  }

  // Add authorization header if token exists and is valid
  const token = localStorage.getItem("access_token");
  if (token) {
    // Check if token is still valid before sending it
    if (tokenManager.isTokenValid(token)) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("🔑 Using valid JWT token");
    } else {
      console.warn("⚠️ JWT token is expired, clearing invalid token");
      tokenManager.clearTokens();
      throw new Error("Authentication token has expired. Please log in again.");
    }
  } else {
    console.warn("⚠️ No JWT token found for authenticated request");
  }

  console.log("📋 Final request config:", {
    url,
    method: config.method,
    headers: config.headers,
    hasBody: !!config.body,
  });

  // Use AbortController for timeout
  const controller = new AbortController();
  let isTimedOut = false;
  let timeoutId;

  // Add listener to debug abort events
  controller.signal.addEventListener("abort", () => {
    console.log("🚫 AbortController triggered:", {
      isTimedOut,
      url,
      timeoutMs,
      signal: controller.signal,
      reason: controller.signal.reason || "Unknown reason",
    });
  });

  try {
    timeoutId = setTimeout(() => {
      if (!controller.signal.aborted) {
        console.log(
          "⏰ Request timeout triggered after",
          timeoutMs,
          "ms for URL:",
          url,
        );
        isTimedOut = true;
        controller.abort();
      }
    }, timeoutMs);

    const response = await fetch(url, {
      ...config,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    console.log("📡 Response received:", {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
    });

    // Handle 401 Unauthorized responses (invalid/expired tokens)
    if (response.status === 401) {
      console.warn("🔑 401 Unauthorized - JWT token is invalid or user doesn't exist in database");

      // Clear invalid tokens
      tokenManager.clearTokens();

      // Dispatch a custom event to notify components about invalid authentication
      window.dispatchEvent(new CustomEvent('auth:invalid', {
        detail: {
          message: 'Authentication token is invalid. Please log in again.',
          status: 401,
          url: url
        }
      }));

      // Create a custom error with authentication context
      const authError = new Error("Authentication failed: Invalid or expired token");
      authError.status = 401;
      authError.isAuthError = true;
      throw authError;
    }

    return response;
  } catch (error) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    console.error("❌ API request failed:", error);

    if (error.name === "AbortError") {
      if (isTimedOut) {
        console.error("⏰ Request timed out:", {
          url,
          timeoutSeconds: timeoutMs / 1000,
          error: error.message,
        });
        throw new Error(
          `Request timeout - the server took longer than ${timeoutMs / 1000} seconds to respond. Please check your internet connection or try again later. URL: ${url}`,
        );
      } else {
        console.warn("🚫 Request aborted without timeout - possible causes:", {
          url,
          timeoutMs,
          error: error.message,
          possibleCauses: [
            "Component unmounted before request completed",
            "Navigation away from page",
            "Network connectivity issues",
            "Server not responding",
          ],
        });
        throw new Error(
          `Request was cancelled. This might be due to navigation, network issues, or server problems. Please try again. URL: ${url}`,
        );
      }
    }
    if (error.message.includes("Failed to fetch")) {
      throw new Error(
        "Network error - please check your internet connection or the API server may be down",
      );
    }

    // Enhanced CORS error detection and messaging
    if (
      error.message.includes("CORS") ||
      error.message.includes("Access-Control-Allow-Origin")
    ) {
      console.error("🚨 CORS Error Detected:", {
        url,
        error: error.message,
        possibleCauses: [
          "Backend server not configured for CORS",
          "ngrok tunnel not properly configured",
          "Backend service is down or misconfigured",
        ],
        solutions: [
          "Ask backend developer to add CORS headers",
          "Verify ngrok tunnel is active",
          "Check backend service status",
        ],
      });

      throw new Error(
        "Server configuration error (CORS). The backend needs to allow requests from this domain. Please contact the backend developer to configure CORS headers.",
      );
    }

    throw error;
  }
};

// Token management
export const tokenManager = {
  setTokens: (accessToken, refreshToken) => {
    localStorage.setItem("access_token", accessToken);
    localStorage.setItem("token_type", "bearer");
    // Refresh token is handled via HttpOnly cookies
  },

  getAccessToken: () => {
    return localStorage.getItem("access_token");
  },

  clearTokens: () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("token_type");
    localStorage.removeItem("user");
  },

  isTokenValid: (token) => {
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const now = Math.floor(Date.now() / 1000);
      return payload.exp > now;
    } catch {
      return false;
    }
  },
};

// Rate limiting utilities
// Rate limiting utilities - using class to maintain proper context
class RateLimitTracker {
  constructor() {
    this.attempts = new Map();
  }

  recordAttempt(endpoint) {
    const now = Date.now();
    const key = endpoint;

    if (!this.attempts.has(key)) {
      this.attempts.set(key, []);
    }

    const attempts = this.attempts.get(key);
    attempts.push(now);

    // Keep only attempts from last 15 minutes
    const fifteenMinutesAgo = now - 15 * 60 * 1000;
    this.attempts.set(
      key,
      attempts.filter((time) => time > fifteenMinutesAgo),
    );
  }

  getAttemptCount(endpoint) {
    const key = endpoint;
    if (!this.attempts.has(key)) return 0;

    const now = Date.now();
    const fifteenMinutesAgo = now - 15 * 60 * 1000;
    const recentAttempts = this.attempts
      .get(key)
      .filter((time) => time > fifteenMinutesAgo);

    return recentAttempts.length;
  }

  isRateLimited(endpoint, limit = 10) {
    return this.getAttemptCount(endpoint) >= limit;
  }
}

export const rateLimitTracker = new RateLimitTracker();

// Enhanced connectivity test for debugging
export const testApiConnectivity = async () => {
  const results = {
    tests: [],
    overallSuccess: false,
    recommendations: [],
  };

  // Test 1: Basic URL accessibility
  try {
    console.log("Test 1: Testing basic connectivity to:", API_CONFIG.BASE_URL);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.log("⏰ Connectivity test timeout for:", API_CONFIG.BASE_URL);
      controller.abort();
    }, 5000); // 5 second timeout

    const response = await fetch(API_CONFIG.BASE_URL, {
      method: "GET",
      mode: "no-cors", // Use no-cors to avoid CORS preflight issues
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    results.tests.push({
      name: "Basic Connectivity",
      success: true,
      details: "Server is accessible",
    });
    console.log("✅ Basic connectivity test passed");
  } catch (error) {
    results.tests.push({
      name: "Basic Connectivity",
      success: false,
      details: error.message,
    });
    console.error("❌ Basic connectivity failed:", error.message);

    if (error.name === "AbortError") {
      results.recommendations.push(
        "Server is taking too long to respond (timeout)",
      );
    } else if (error.message.includes("Failed to fetch")) {
      results.recommendations.push(
        "Network connectivity issue or server is down",
      );
    }
  }

  // Test 2: Try API endpoint with CORS
  try {
    console.log("Test 2: Testing API endpoint with CORS");

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.log("⏰ API endpoint test timeout");
      controller.abort();
    }, 5000);

    const response = await fetch(`${API_CONFIG.BASE_URL}/api/v1/auth/login`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
      signal: controller.signal,
      body: JSON.stringify({ test: true }),
    });

    clearTimeout(timeoutId);

    // Even if we get a 400/500 error, it means the endpoint is accessible
    results.tests.push({
      name: "API Endpoint",
      success: true,
      details: `API responding with status ${response.status}`,
    });
    console.log(`✅ API endpoint test passed (status: ${response.status})`);
    results.overallSuccess = true;
  } catch (error) {
    results.tests.push({
      name: "API Endpoint",
      success: false,
      details: error.message,
    });
    console.error("❌ API endpoint test failed:", error.message);
  }

  // Test 3: Internet connectivity check
  try {
    console.log("Test 3: Testing general internet connectivity");

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    await fetch("https://httpbin.org/get", {
      method: "GET",
      mode: "cors",
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    results.tests.push({
      name: "Internet Connectivity",
      success: true,
      details: "Internet connection is working",
    });
    console.log("✅ Internet connectivity test passed");
  } catch (error) {
    results.tests.push({
      name: "Internet Connectivity",
      success: false,
      details: "No internet connection or blocked by firewall",
    });
    console.error("❌ Internet connectivity failed:", error.message);
    results.recommendations.push("Check your internet connection");
  }

  // Add recommendations based on test results
  if (!results.overallSuccess) {
    if (results.tests[0]?.success === false) {
      results.recommendations.push("The ngrok URL might be expired or invalid");
      results.recommendations.push(
        "Ask the backend developer for a new ngrok URL",
      );
    }
    if (results.tests[2]?.success === false) {
      results.recommendations.push("Check your internet connection");
    }
  }

  return results;
};

// API Health Check
export const checkApiHealth = async () => {
  try {
    // For now, just test a simple connectivity to the base URL
    // Since we don't know if /health endpoint exists, we'll just test basic connectivity
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.log("⏰ Health check timeout");
      controller.abort();
    }, 5000);

    const response = await fetch(API_CONFIG.BASE_URL, {
      method: "HEAD", // Use HEAD instead of GET to avoid CORS issues
      mode: "no-cors", // Use no-cors mode to avoid CORS preflight
      signal: controller.signal,
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
    });

    clearTimeout(timeoutId);

    // With no-cors mode, we can't read the response status
    // So we'll just assume it's working if no error was thrown
    return true;
  } catch (error) {
    console.warn(
      "API connectivity test failed (this is normal if API is offline):",
      error.message,
    );
    return false;
  }
};

export default API_CONFIG;
