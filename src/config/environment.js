// Centralized Environment Configuration
// This file contains all environment-specific settings in one place

// Environment detection
const NODE_ENV = import.meta.env.MODE || 'development';
const IS_PRODUCTION = NODE_ENV === 'production';
const IS_DEVELOPMENT = NODE_ENV === 'development';

// API Configuration
export const API_ENVIRONMENT = {
  // Current environment settings
  CURRENT: {
    NAME: IS_PRODUCTION ? 'production' : 'development',
    BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://buz-production.up.railway.app',
    IS_PRODUCTION,
    IS_DEVELOPMENT,
  },

  // Available environments
  PRODUCTION: {
    NAME: 'production',
    BASE_URL: 'https://buz-production.up.railway.app',
    HEADERS: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Cache-Control': 'no-cache',
      'X-Requested-With': 'XMLHttpRequest',
      'User-Agent': 'Influbazzar-Frontend/1.0.0',
    }
  },

  STAGING: {
    NAME: 'staging',
    BASE_URL: 'https://9fe0fbbfff8d.ngrok-free.app',
    HEADERS: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'ngrok-skip-browser-warning': 'true',
      'X-Requested-With': 'XMLHttpRequest',
      'User-Agent': 'Influbazzar-Frontend/1.0.0',
    }
  },

  DEVELOPMENT: {
    NAME: 'development',
    BASE_URL: 'https://4ebdfc4bcd4a.ngrok-free.app',
    HEADERS: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'ngrok-skip-browser-warning': 'true',
      'X-Requested-With': 'XMLHttpRequest',
      'User-Agent': 'Influbazzar-Frontend/1.0.0',
    }
  }
};

// Get current environment configuration
export const getCurrentEnvironment = () => {
  return API_ENVIRONMENT.CURRENT;
};

// Get headers for current environment
export const getCurrentHeaders = () => {
  if (IS_PRODUCTION) {
    return API_ENVIRONMENT.PRODUCTION.HEADERS;
  }
  return API_ENVIRONMENT.STAGING.HEADERS;
};

// Get base URL for current environment
export const getCurrentBaseURL = () => {
  return API_ENVIRONMENT.CURRENT.BASE_URL;
};

// Environment switching helpers
export const switchEnvironment = (envName) => {
  const env = API_ENVIRONMENT[envName.toUpperCase()];
  if (!env) {
    throw new Error(`Environment ${envName} not found`);
  }
  
  console.log(`🔄 Switching to ${env.NAME} environment: ${env.BASE_URL}`);
  return env;
};

// Logging configuration
export const LOGGING = {
  ENABLED: IS_DEVELOPMENT || import.meta.env.VITE_ENABLE_LOGGING === 'true',
  LEVEL: import.meta.env.VITE_LOG_LEVEL || (IS_PRODUCTION ? 'error' : 'debug'),
};

// Feature flags
export const FEATURES = {
  ENABLE_OTP: true,
  ENABLE_SOCIAL_LOGIN: true,
  ENABLE_CREATOR_ONBOARDING: true,
  ENABLE_DEBUG_MODE: IS_DEVELOPMENT,
};

export default {
  API_ENVIRONMENT,
  getCurrentEnvironment,
  getCurrentHeaders,
  getCurrentBaseURL,
  switchEnvironment,
  LOGGING,
  FEATURES,
};
