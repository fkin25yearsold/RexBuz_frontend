// API URL configuration and switcher
// This makes it easy to switch between different deployment environments

export const API_URLS = {
  PRODUCTION: "https://buz-production.up.railway.app",
  STAGING: "https://9fe0fbbfff8d.ngrok-free.app", // Keep old ngrok as staging
  LOCAL_DEV: "https://4ebdfc4bcd4a.ngrok-free.app", // Keep for local dev testing
  LEGACY: "https://986f68cc5cd6.ngrok-free.app",
  // Add more URLs here as needed
};

// Current active URL - change this to switch environments quickly
export const ACTIVE_API_URL = API_URLS.PRODUCTION;

// Test function to check URL accessibility
export const testApiUrl = async (url = ACTIVE_API_URL) => {
  console.log("🧪 Testing API URL:", url);

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.log("⏰ Test timeout after 5 seconds");
      controller.abort();
    }, 5000);

    const response = await fetch(url, {
      method: "HEAD",
      mode: "no-cors",
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    console.log("✅ URL is accessible");
    return true;
  } catch (error) {
    console.log("❌ URL test failed:", error.name, error.message);
    return false;
  }
};

// Quick function to switch URLs if needed
export const switchToStagingUrl = () => {
  console.log("🔄 Switching to staging URL for testing...");
  return API_URLS.STAGING;
};

export const switchToProductionUrl = () => {
  console.log("🔄 Switching to production URL...");
  return API_URLS.PRODUCTION;
};

export const switchToLocalDevUrl = () => {
  console.log("🔄 Switching to local dev URL for testing...");
  return API_URLS.LOCAL_DEV;
};
