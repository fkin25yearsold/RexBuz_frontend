// Ngrok connectivity diagnostic tool
// Can be imported and used in browser console

export const debugNgrokConnectivity = async () => {
  console.log("🔍 Starting ngrok connectivity diagnostics...");

  // Import from config instead of hardcoding

  const { API_URLS } = await import("./config/api-urls.js");
  const ngrokUrl = API_URLS.PRODUCTION;
  const oldNgrokUrl = API_URLS.LEGACY;


  const testUrl = async (url, description) => {
    console.log(`\n🧪 Testing ${description}: ${url}`);

    try {
      // Test 1: Basic fetch without timeout
      console.log("   → Basic fetch test...");
      const response = await fetch(url, {
        method: "HEAD",
        mode: "no-cors",
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      });
      console.log("   ✅ Basic fetch succeeded");
      return { basic: true };
    } catch (error) {
      console.log("   ❌ Basic fetch failed:", error.message);

      // Test 2: Try with AbortController (to replicate our setup)
      try {
        console.log("   → Testing with AbortController...");
        const controller = new AbortController();

        // Very generous timeout
        const timeoutId = setTimeout(() => {
          console.log("   ⏰ Manual timeout triggered");
          controller.abort();
        }, 10000);

        const response2 = await fetch(url, {
          method: "HEAD",
          mode: "no-cors",
          headers: {
            "ngrok-skip-browser-warning": "true",
          },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);
        console.log("   ✅ AbortController test succeeded");
        return { basic: false, withTimeout: true };
      } catch (error2) {
        console.log(
          "   ❌ AbortController test failed:",
          error2.name,
          error2.message,
        );
        return { basic: false, withTimeout: false, error: error2 };
      }
    }
  };

  // Test both URLs
  const newUrlResult = await testUrl(ngrokUrl, "NEW ngrok URL");
  const oldUrlResult = await testUrl(oldNgrokUrl, "OLD ngrok URL");

  console.log("\n📊 DIAGNOSTIC RESULTS:");
  console.log("New URL:", newUrlResult);
  console.log("Old URL:", oldUrlResult);

  // Provide recommendations
  console.log("\n💡 RECOMMENDATIONS:");

  if (!newUrlResult.basic && !newUrlResult.withTimeout) {
    console.log("🚨 NEW ngrok URL is completely inaccessible!");
    console.log("   - The URL might be wrong or the tunnel might be down");
    console.log("   - Check with the backend team for the correct URL");
  }

  if (oldUrlResult.basic || oldUrlResult.withTimeout) {
    console.log("ℹ️  OLD ngrok URL is still accessible");
    console.log("   - Consider reverting to the old URL temporarily");
  }

  if (newUrlResult.error && newUrlResult.error.name === "AbortError") {
    console.log("🔍 AbortError detected - this confirms the issue");
    console.log("   - The URL is likely not accessible");
    console.log("   - DNS resolution might be failing immediately");
  }

  return {
    newUrl: newUrlResult,
    oldUrl: oldUrlResult,
    recommendation:
      !newUrlResult.basic && !newUrlResult.withTimeout
        ? "REVERT_TO_OLD_URL"
        : "URL_OK",
  };
};

// Auto-run if in browser environment
if (typeof window !== "undefined") {
  window.debugNgrokConnectivity = debugNgrokConnectivity;
  console.log("🔧 Ngrok diagnostic tool loaded. Run: debugNgrokConnectivity()");
}
