import {
  testApiConnectivity,
  checkApiHealth,
  ACTIVE_NGROK_URL,
} from "./src/config/api.js";

console.log("🧪 Testing ngrok connectivity for URL:", ACTIVE_NGROK_URL);
console.log("================================\n");

async function runConnectivityTests() {
  console.log("Starting comprehensive connectivity tests...\n");

  const results = await testApiConnectivity();

  console.log("\n📋 Test Results Summary:");
  console.log("========================");

  results.tests.forEach((test, index) => {
    const status = test.success ? "✅" : "❌";
    console.log(`${index + 1}. ${test.name}: ${status}`);
    console.log(`   Details: ${test.details}\n`);
  });

  console.log(
    "🎯 Overall Success:",
    results.overallSuccess ? "✅ Yes" : "❌ No",
  );

  if (results.recommendations.length > 0) {
    console.log("\n💡 Recommendations:");
    results.recommendations.forEach((rec, index) => {
      console.log(`${index + 1}. ${rec}`);
    });
  }

  console.log("\n🔍 Additional CORS-specific test...");

  // Test specific endpoint that's failing
  try {
    const response = await fetch(
      `${ACTIVE_NGROK_URL}/api/v1/creator/onboarding/step1/basic-profile`,
      {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({ test: true }),
      },
    );

    console.log(
      "✅ CORS test passed - got response with status:",
      response.status,
    );
  } catch (error) {
    console.log("❌ CORS test failed:", error.message);

    if (error.message.includes("CORS")) {
      console.log("\n🔧 CORS Issue Detected:");
      console.log("- The backend server needs to include proper CORS headers");
      console.log("- Access-Control-Allow-Origin header is missing");
      console.log("- This is a backend configuration issue, not frontend");
    }
  }
}

runConnectivityTests().catch(console.error);
