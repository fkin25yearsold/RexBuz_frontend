// Simple test to check if the new ngrok URL is accessible
const testNgrokConnectivity = async () => {
  console.log("Testing ngrok connectivity...");

  const url = "https://buz-production.up.railway.app";

  try {
    console.log("Testing basic connectivity to:", url);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.log("Request timeout triggered");
      controller.abort();
    }, 5000); // 5 second timeout

    const response = await fetch(url, {
      method: "GET",
      mode: "no-cors", // Use no-cors to avoid CORS preflight issues
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    console.log("✅ Basic connectivity test passed");
    return true;
  } catch (error) {
    console.error("❌ Connectivity test failed:", error.name, error.message);
    return false;
  }
};

// Test API endpoint
const testApiEndpoint = async () => {
  console.log("Testing API endpoint...");

  const url = "https://buz-production.up.railway.app/api/v1/auth/login";

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.log("API request timeout triggered");
      controller.abort();
    }, 5000);

    const response = await fetch(url, {
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
    console.log("✅ API endpoint test passed (status:", response.status, ")");
    return true;
  } catch (error) {
    console.error("❌ API endpoint test failed:", error.name, error.message);
    return false;
  }
};

// Run tests
const runTests = async () => {
  console.log("🚀 Starting ngrok connectivity tests...");

  const basicTest = await testNgrokConnectivity();
  const apiTest = await testApiEndpoint();

  console.log("📊 Test Results:");
  console.log("- Basic connectivity:", basicTest ? "✅ PASS" : "❌ FAIL");
  console.log("- API endpoint:", apiTest ? "✅ PASS" : "❌ FAIL");

  if (!basicTest && !apiTest) {
    console.log("🚨 The new ngrok URL appears to be inaccessible!");
    console.log("💡 Possible solutions:");
    console.log("1. Check if the ngrok tunnel is still running");
    console.log(
      "2. Verify the URL is correct: https://986f68cc5cd6.ngrok-free.app",
    );
    console.log("3. Get a fresh ngrok URL from the backend team");
  }
};

// Run the tests
runTests();
