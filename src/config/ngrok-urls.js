// Ngrok URL configuration and switcher
// This makes it easy to switch between URLs for testing

export const NGROK_URLS = {
  CURRENT: "https://9fe0fbbfff8d.ngrok-free.app",
  OLD: "https://4ebdfc4bcd4a.ngrok-free.app",
  LEGACY: "https://986f68cc5cd6.ngrok-free.app",
  // Add more URLs here as needed
};

// Current active URL - change this to switch URLs quickly
export const ACTIVE_NGROK_URL = NGROK_URLS.CURRENT;

// Test function to check URL accessibility
export const testNgrokUrl = async (url = ACTIVE_NGROK_URL) => {
  console.log("🧪 Testing ngrok URL:", url);

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
export const switchToOldUrl = () => {
  console.log("🔄 Switching to old ngrok URL for testing...");
  return NGROK_URLS.OLD;
};

export const switchToNewUrl = () => {
  console.log("🔄 Switching to new ngrok URL...");
  return NGROK_URLS.NEW;
};
