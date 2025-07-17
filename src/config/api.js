// API Configuration
// Centralized API configuration that can be easily changed via environment variables

const API_CONFIG = {
  // Base URL - can be overridden by environment variable
  BASE_URL:
    import.meta.env.VITE_API_BASE_URL || "https://b2ff7ff9d63e.ngrok-free.app",

  // API Version
  VERSION: "v1",

  // Timeout settings
  TIMEOUT: 30000, // 30 seconds

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
};

// API Helper functions
export const apiRequest = async (url, options = {}) => {
  console.log("🚀 API Request starting:", { url, method: options.method });

  // Extract timeout from options or use default
  const timeoutMs = options.timeout || API_CONFIG.TIMEOUT;

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

  // Build proper fetch configuration
  const config = {
    method: options.method || "GET",
    mode: "cors",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "ngrok-skip-browser-warning": "true",
      ...resolvedHeaders,
    },
    ...(options.body && { body: options.body }),
  };

  // Add authorization header if token exists
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  console.log("📋 Final request config:", {
    url,
    method: config.method,
    headers: config.headers,
    hasBody: !!config.body,
  });

  try {
    // Use AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.log("⏰ Request timeout triggered");
      controller.abort();
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
      headers: Object.fromEntries(response.headers.entries()),
    });

    return response;
  } catch (error) {
    console.error("❌ API request failed:", error);

    if (error.name === "AbortError") {
      throw new Error("Request timeout - the server took too long to respond");
    }
    if (error.message.includes("Failed to fetch")) {
      throw new Error(
        "Network error - please check your internet connection or the API server may be down",
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
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

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
    const timeoutId = setTimeout(() => controller.abort(), 5000);

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
    const timeoutId = setTimeout(() => controller.abort(), 5000);

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
