// Quick ngrok URL verification script
// Run this in browser console to test different scenarios

const NGROK_URL = "https://4ebdfc4bcd4a.ngrok-free.app";

console.log("🧪 Testing ngrok URL:", NGROK_URL);

// Test 1: Basic connectivity with ngrok headers
async function testBasicConnectivity() {
  console.log("\n🔍 Test 1: Basic connectivity...");
  try {
    const response = await fetch(NGROK_URL, {
      method: "GET",
      headers: {
        "ngrok-skip-browser-warning": "true",
        "User-Agent": "Mozilla/5.0 (compatible; Test/1.0)",
      },
    });
    console.log("✅ Basic connectivity successful");
    console.log("Response status:", response.status);
    console.log(
      "Response headers:",
      Object.fromEntries(response.headers.entries()),
    );
    return true;
  } catch (error) {
    console.log("❌ Basic connectivity failed:", error.message);
    return false;
  }
}

// Test 2: CORS preflight test
async function testCORS() {
  console.log("\n🔍 Test 2: CORS preflight test...");
  try {
    const response = await fetch(
      `${NGROK_URL}/api/v1/creator/onboarding/step1/basic-profile`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({ test: true }),
      },
    );
    console.log("✅ CORS test passed");
    console.log("Response status:", response.status);
    return true;
  } catch (error) {
    console.log("❌ CORS test failed:", error.message);
    if (error.message.includes("CORS")) {
      console.log("🚨 CORS Error Detected - Backend needs CORS configuration");
    }
    return false;
  }
}

// Test 3: Try with different headers
async function testWithDifferentHeaders() {
  console.log("\n🔍 Test 3: Testing with different headers...");

  const headerSets = [
    { "ngrok-skip-browser-warning": "true" },
    { "ngrok-skip-browser-warning": "any" },
    { "User-Agent": "ngrok" },
    { Accept: "*/*" },
    {},
  ];

  for (let i = 0; i < headerSets.length; i++) {
    const headers = headerSets[i];
    console.log(`Testing header set ${i + 1}:`, headers);

    try {
      const response = await fetch(NGROK_URL, {
        method: "HEAD",
        headers,
      });
      console.log(`✅ Header set ${i + 1} worked - Status:`, response.status);
      return headers;
    } catch (error) {
      console.log(`❌ Header set ${i + 1} failed:`, error.message);
    }
  }

  return null;
}

// Run all tests
async function runAllTests() {
  console.log("Starting comprehensive ngrok tests...\n");

  const basicTest = await testBasicConnectivity();
  const corsTest = await testCORS();
  const headerTest = await testWithDifferentHeaders();

  console.log("\n📋 Summary:");
  console.log("Basic connectivity:", basicTest ? "✅" : "❌");
  console.log("CORS support:", corsTest ? "✅" : "❌");
  console.log("Alternative headers work:", headerTest ? "✅" : "❌");

  if (!corsTest) {
    console.log("\n💡 Recommendations:");
    console.log("1. Ask backend developer to add CORS headers");
    console.log(
      "2. Verify ngrok tunnel is active and pointing to correct service",
    );
    console.log("3. Check if backend service is running properly");
    console.log("4. Consider using ngrok auth token if required");
  }
}

// Auto-run if this script is executed
if (typeof window !== "undefined") {
  runAllTests();
} else {
  console.log("Run this script in the browser console");
}
