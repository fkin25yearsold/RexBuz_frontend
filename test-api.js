// Simple API test script
const testSignupAPI = async () => {
  const testData = {
    email: "test@example.com",
    phone_number: "+919876543210",
    password: "StrongPass123!",
    full_name: "Test User",
    date_of_birth: "1990-01-01",
    role: "creator",
    terms_accepted: true,
    is_above_18: true,
  };

  try {
    console.log("Testing signup API...");
    const response = await fetch(
      "https://986f68cc5cd6.ngrok-free.app/api/v1/auth/signup",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify(testData),
      },
    );

    const data = await response.json();

    console.log("Response status:", response.status);
    console.log("Response data:", data);

    if (response.ok) {
      console.log("✅ API test successful!");
    } else {
      console.log("❌ API test failed:", data.detail || data.message);
    }
  } catch (error) {
    console.log("❌ Network error:", error.message);
  }
};

// Test if we're running in Node.js environment
if (typeof fetch === "undefined") {
  // For Node.js, we need to import fetch
  import("node-fetch")
    .then(({ default: fetch }) => {
      global.fetch = fetch;
      testSignupAPI();
    })
    .catch(() => {
      console.log(
        "Please run this in a browser environment or install node-fetch",
      );
    });
} else {
  // Browser environment
  testSignupAPI();
}
