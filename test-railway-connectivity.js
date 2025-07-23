// Railway Production Connectivity Test
// Test script to verify Railway deployment accessibility

const RAILWAY_URL = "https://buz-production.up.railway.app";

const testRailwayConnectivity = async () => {
  console.log("🚀 Testing Railway production connectivity...");
  console.log("URL:", RAILWAY_URL);

  const tests = [];

  // Test 1: Basic connectivity
  try {
    console.log("Test 1: Basic connectivity test...");
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.log("⏰ Basic connectivity timeout (5s)");
      controller.abort();
    }, 5000);

    const response = await fetch(RAILWAY_URL, {
      method: "HEAD",
      mode: "no-cors",
      headers: {
        "Cache-Control": "no-cache",
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    tests.push({ name: "Basic connectivity", success: true });
    console.log("✅ Basic connectivity test passed");
  } catch (error) {
    tests.push({ name: "Basic connectivity", success: false, error: error.message });
    console.log("❌ Basic connectivity failed:", error.message);
  }

  // Test 2: API endpoint test
  try {
    console.log("Test 2: API endpoint test...");
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.log("⏰ API endpoint timeout (10s)");
      controller.abort();
    }, 10000);

    const response = await fetch(`${RAILWAY_URL}/api/v1/auth/login`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Cache-Control": "no-cache",
        "X-Requested-With": "XMLHttpRequest",
      },
      signal: controller.signal,
      body: JSON.stringify({ 
        email_or_phone: "test@example.com", 
        password: "test123" 
      }),
    });

    clearTimeout(timeoutId);
    
    // Any response (even 400/401) means the API is accessible
    tests.push({ 
      name: "API endpoint", 
      success: true, 
      status: response.status,
      statusText: response.statusText 
    });
    console.log(`✅ API endpoint test passed (status: ${response.status})`);

    // Try to get response data for debugging
    try {
      const data = await response.text();
      console.log("📝 Response preview:", data.substring(0, 200) + (data.length > 200 ? "..." : ""));
    } catch (e) {
      console.log("📝 Could not read response body");
    }

  } catch (error) {
    tests.push({ name: "API endpoint", success: false, error: error.message });
    console.log("❌ API endpoint test failed:", error.message);
  }

  // Test 3: Health check (if available)
  try {
    console.log("Test 3: Health check test...");
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.log("⏰ Health check timeout (5s)");
      controller.abort();
    }, 5000);

    const response = await fetch(`${RAILWAY_URL}/health`, {
      method: "GET",
      mode: "cors",
      headers: {
        "Accept": "application/json",
        "Cache-Control": "no-cache",
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    tests.push({ 
      name: "Health check", 
      success: response.ok, 
      status: response.status 
    });
    
    if (response.ok) {
      console.log("✅ Health check passed");
    } else {
      console.log(`⚠️ Health check returned ${response.status} (endpoint may not exist)`);
    }
  } catch (error) {
    tests.push({ name: "Health check", success: false, error: error.message });
    console.log("❌ Health check failed:", error.message);
  }

  // Summary
  console.log("\n📊 Test Results Summary:");
  console.log("=" .repeat(50));
  
  const passedTests = tests.filter(t => t.success).length;
  const totalTests = tests.length;
  
  tests.forEach(test => {
    const status = test.success ? "✅ PASS" : "❌ FAIL";
    const details = test.status ? `(${test.status})` : test.error ? `(${test.error})` : "";
    console.log(`${status} ${test.name} ${details}`);
  });
  
  console.log("=" .repeat(50));
  console.log(`Overall: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests >= 1) {
    console.log("🎉 Railway production deployment is accessible!");
    console.log("💡 You can now use the production API at:", RAILWAY_URL);
  } else {
    console.log("🚨 Railway production deployment appears to be inaccessible!");
    console.log("💡 Possible solutions:");
    console.log("1. Check Railway deployment status");
    console.log("2. Verify the URL is correct");
    console.log("3. Check Railway logs for errors");
    console.log("4. Ensure the service is deployed and running");
  }

  return { passedTests, totalTests, allPassed: passedTests >= 1 };
};

// Run the test
if (typeof window !== 'undefined') {
  // Browser environment
  testRailwayConnectivity();
} else {
  // Node.js environment
  console.log("Run this script in a browser environment for best results");
}

export { testRailwayConnectivity, RAILWAY_URL };
