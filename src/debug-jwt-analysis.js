/**
 * JWT Token Analysis Debug Tool
 * 
 * This tool helps diagnose JWT token issues between Step 1 and Step 2 onboarding.
 * It checks token validity, user ID consistency, and provides detailed analysis.
 */

export const analyzeJWTToken = () => {
  console.log("🔍 Starting JWT Token Analysis...");
  
  // Get tokens and user data from localStorage
  const accessToken = localStorage.getItem("access_token");
  const userData = localStorage.getItem("user");
  const onboardingStatus = localStorage.getItem("onboarding_status");
  
  const analysis = {
    timestamp: new Date().toISOString(),
    tokenPresent: !!accessToken,
    userDataPresent: !!userData,
    onboardingStatusPresent: !!onboardingStatus,
    issues: [],
    recommendations: []
  };

  console.log("📋 Raw Data Check:", {
    hasAccessToken: analysis.tokenPresent,
    hasUserData: analysis.userDataPresent,
    hasOnboardingStatus: analysis.onboardingStatusPresent
  });

  if (!accessToken) {
    analysis.issues.push("JWT access token is missing from localStorage");
    analysis.recommendations.push("User needs to log in again");
    console.error("❌ No JWT token found");
    return analysis;
  }

  try {
    // Parse JWT token
    const tokenParts = accessToken.split(".");
    if (tokenParts.length !== 3) {
      analysis.issues.push("JWT token has invalid format (should have 3 parts separated by dots)");
      console.error("❌ Invalid JWT format");
      return analysis;
    }

    const header = JSON.parse(atob(tokenParts[0]));
    const payload = JSON.parse(atob(tokenParts[1]));
    
    analysis.tokenHeader = header;
    analysis.tokenPayload = payload;

    // Check token expiration
    const now = Math.floor(Date.now() / 1000);
    const isExpired = payload.exp <= now;
    const timeToExpiry = payload.exp - now;
    
    analysis.isExpired = isExpired;
    analysis.timeToExpiry = timeToExpiry;
    analysis.expiresAt = new Date(payload.exp * 1000).toISOString();

    if (isExpired) {
      analysis.issues.push(`JWT token has expired at ${analysis.expiresAt}`);
      analysis.recommendations.push("User needs to log in again to get a fresh token");
    } else {
      console.log(`✅ Token is valid for ${Math.floor(timeToExpiry / 60)} minutes`);
    }

    // Extract user ID from JWT
    const jwtUserId = payload.sub || payload.user_id || payload.id;
    analysis.jwtUserId = jwtUserId;

    if (!jwtUserId) {
      analysis.issues.push("JWT token does not contain a user ID (checked 'sub', 'user_id', 'id' fields)");
      analysis.recommendations.push("JWT token format may be incorrect or user ID is missing");
    }

    // Parse stored user data
    if (userData) {
      try {
        const userObject = JSON.parse(userData);
        analysis.storedUser = userObject;
        
        const storedUserId = userObject.id || userObject.user_id || userObject.uuid;
        analysis.storedUserId = storedUserId;

        // Check consistency between JWT and stored user data
        if (jwtUserId && storedUserId) {
          const idsMatch = String(jwtUserId) === String(storedUserId);
          analysis.userIdConsistency = idsMatch;
          
          if (!idsMatch) {
            analysis.issues.push(`User ID mismatch: JWT contains '${jwtUserId}' but stored user has '${storedUserId}'`);
            analysis.recommendations.push("Clear localStorage and have user log in again");
          } else {
            console.log(`✅ User ID consistency check passed: ${jwtUserId}`);
          }
        }
      } catch (error) {
        analysis.issues.push(`Failed to parse stored user data: ${error.message}`);
        analysis.recommendations.push("Clear corrupted user data from localStorage");
      }
    }

    // Additional JWT claims analysis
    analysis.jwtClaims = {
      issuer: payload.iss,
      audience: payload.aud,
      issuedAt: payload.iat ? new Date(payload.iat * 1000).toISOString() : null,
      email: payload.email,
      emailVerified: payload.email_verified,
      roles: payload.roles || payload.authorities || [],
      scope: payload.scope
    };

    // Check for common JWT issues
    if (!payload.iss) {
      analysis.issues.push("JWT token missing 'iss' (issuer) claim");
    }
    
    if (!payload.aud) {
      analysis.issues.push("JWT token missing 'aud' (audience) claim");
    }

    if (!payload.iat) {
      analysis.issues.push("JWT token missing 'iat' (issued at) claim");
    }

    // Parse onboarding status if available
    if (onboardingStatus) {
      try {
        const onboardingObject = JSON.parse(onboardingStatus);
        analysis.onboardingData = onboardingObject;
        console.log("📋 Onboarding Status:", onboardingObject);
      } catch (error) {
        analysis.issues.push(`Failed to parse onboarding status: ${error.message}`);
      }
    }

  } catch (error) {
    analysis.issues.push(`Failed to parse JWT token: ${error.message}`);
    analysis.recommendations.push("Token may be corrupted, user should log in again");
    console.error("❌ JWT parsing error:", error);
  }

  return analysis;
};

export const debugAuthenticationFlow = () => {
  console.log("🔍 === AUTHENTICATION FLOW DEBUG ===");
  
  const analysis = analyzeJWTToken();
  
  console.log("📊 Analysis Results:", analysis);
  
  // Summary
  if (analysis.issues.length === 0) {
    console.log("✅ No authentication issues detected");
  } else {
    console.log("❌ Authentication Issues Found:");
    analysis.issues.forEach((issue, index) => {
      console.log(`   ${index + 1}. ${issue}`);
    });
    
    console.log("💡 Recommendations:");
    analysis.recommendations.forEach((rec, index) => {
      console.log(`   ${index + 1}. ${rec}`);
    });
  }

  // Return analysis for programmatic use
  return analysis;
};

export const testJWTWithAPIRequest = async () => {
  console.log("🧪 Testing JWT Token with API Request...");
  
  const analysis = analyzeJWTToken();
  
  if (analysis.issues.length > 0) {
    console.log("❌ Cannot test API - JWT has issues:", analysis.issues);
    return { success: false, issues: analysis.issues };
  }

  try {
    // Import API functions dynamically
    const { API_ENDPOINTS, apiRequest } = await import("./config/api");
    
    console.log("📤 Testing JWT with onboarding status API...");
    
    const response = await apiRequest(
      API_ENDPOINTS.CREATOR_ONBOARDING.STATUS,
      {
        method: "GET",
      }
    );

    console.log("📡 API Response:", {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok
    });

    if (response.status === 401) {
      console.log("❌ JWT token was rejected by backend (401 Unauthorized)");
      console.log("🔍 This means the JWT contains a user ID that doesn't exist in the backend database");
      return { 
        success: false, 
        error: "JWT token contains invalid user ID",
        status: 401,
        recommendation: "Backend database may not have the user record, or JWT was issued for wrong user"
      };
    }

    if (response.ok) {
      console.log("✅ JWT token is valid and accepted by backend");
      return { success: true, status: response.status };
    } else {
      console.log(`⚠️ API returned ${response.status} status`);
      return { success: false, status: response.status };
    }

  } catch (error) {
    console.log("❌ API test failed:", error.message);
    return { success: false, error: error.message };
  }
};

// Utility to clear authentication data
export const clearAuthenticationData = () => {
  console.log("🧹 Clearing all authentication data...");
  
  const itemsToRemove = [
    "access_token", 
    "token_type", 
    "user", 
    "onboarding_status"
  ];
  
  itemsToRemove.forEach(item => {
    if (localStorage.getItem(item)) {
      localStorage.removeItem(item);
      console.log(`✅ Removed ${item}`);
    }
  });
  
  console.log("🧹 Authentication data cleared");
};

// Main diagnostic function
export const diagnoseStep1Step2Issue = async () => {
  console.log("🔍 === STEP 1 TO STEP 2 DIAGNOSTIC ===");
  
  // Step 1: Analyze current JWT token
  const jwtAnalysis = analyzeJWTToken();
  console.log("1️⃣ JWT Analysis Complete");
  
  // Step 2: Test JWT with backend API
  const apiTest = await testJWTWithAPIRequest();
  console.log("2️⃣ API Test Complete");
  
  // Step 3: Provide diagnosis
  const diagnosis = {
    timestamp: new Date().toISOString(),
    jwtAnalysis,
    apiTest,
    overallStatus: "unknown",
    rootCause: null,
    solution: null
  };

  if (jwtAnalysis.issues.length > 0) {
    diagnosis.overallStatus = "jwt_issues";
    diagnosis.rootCause = "JWT token has local validation issues";
    diagnosis.solution = "User needs to log in again to get a fresh token";
  } else if (apiTest.status === 401) {
    diagnosis.overallStatus = "user_not_in_database";
    diagnosis.rootCause = "JWT token contains a user ID that doesn't exist in the backend database";
    diagnosis.solution = "Backend team needs to check user creation process or database state";
  } else if (apiTest.success) {
    diagnosis.overallStatus = "healthy";
    diagnosis.rootCause = null;
    diagnosis.solution = "No issues detected - authentication should work properly";
  } else {
    diagnosis.overallStatus = "unknown_error";
    diagnosis.rootCause = "API test failed for unknown reasons";
    diagnosis.solution = "Check backend server status and network connectivity";
  }

  console.log("📊 === FINAL DIAGNOSIS ===");
  console.log(`Status: ${diagnosis.overallStatus}`);
  console.log(`Root Cause: ${diagnosis.rootCause || "None identified"}`);
  console.log(`Solution: ${diagnosis.solution}`);

  return diagnosis;
};

// Export everything as a single debug object for easy access
export const JWTDebugger = {
  analyzeJWTToken,
  debugAuthenticationFlow,
  testJWTWithAPIRequest,
  clearAuthenticationData,
  diagnoseStep1Step2Issue
};

// Make it available globally for console debugging
if (typeof window !== 'undefined') {
  window.JWTDebugger = JWTDebugger;
  console.log("🔧 JWT Debugger tools available globally as window.JWTDebugger");
}
