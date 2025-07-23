/**
 * Authentication Flow Debug and Analysis
 * 
 * This tool provides comprehensive debugging for authentication flow issues,
 * specifically focusing on the JWT token consistency between Step 1 and Step 2.
 */

import { JWTDebugger } from './debug-jwt-analysis.js';

export const runFullAuthenticationDiagnostic = async () => {
  console.log("🔍 === COMPREHENSIVE AUTHENTICATION DIAGNOSTIC ===");
  console.log("Starting comprehensive analysis of authentication flow...");
  
  const report = {
    timestamp: new Date().toISOString(),
    sections: {
      localStorage: null,
      jwtToken: null,
      userConsistency: null,
      apiConnectivity: null,
      backendValidation: null
    },
    issues: [],
    recommendations: [],
    severity: "unknown"
  };

  // Section 1: Local Storage Analysis
  console.log("\n📦 1. LOCAL STORAGE ANALYSIS");
  const localStorageAnalysis = analyzeLocalStorage();
  report.sections.localStorage = localStorageAnalysis;
  
  // Section 2: JWT Token Analysis
  console.log("\n🔑 2. JWT TOKEN ANALYSIS");
  const jwtAnalysis = await JWTDebugger.analyzeJWTToken();
  report.sections.jwtToken = jwtAnalysis;
  
  // Section 3: User Data Consistency
  console.log("\n👤 3. USER DATA CONSISTENCY");
  const userConsistency = analyzeUserDataConsistency();
  report.sections.userConsistency = userConsistency;
  
  // Section 4: API Connectivity
  console.log("\n🌐 4. API CONNECTIVITY TEST");
  const apiTest = await testAPIConnectivity();
  report.sections.apiConnectivity = apiTest;
  
  // Section 5: Backend Validation Test
  console.log("\n🔐 5. BACKEND JWT VALIDATION");
  const backendTest = await JWTDebugger.testJWTWithAPIRequest();
  report.sections.backendValidation = backendTest;
  
  // Compile issues and recommendations
  compileIssuesAndRecommendations(report);
  
  // Determine severity
  report.severity = determineSeverity(report);
  
  // Print final report
  printFinalReport(report);
  
  return report;
};

const analyzeLocalStorage = () => {
  console.log("Analyzing localStorage authentication data...");
  
  const keys = ['access_token', 'token_type', 'user', 'onboarding_status'];
  const analysis = {
    itemsPresent: {},
    itemsSizes: {},
    corruptedItems: [],
    missingCriticalItems: []
  };
  
  keys.forEach(key => {
    const value = localStorage.getItem(key);
    analysis.itemsPresent[key] = !!value;
    
    if (value) {
      analysis.itemsSizes[key] = value.length;
      
      // Try to parse JSON items
      if (key === 'user' || key === 'onboarding_status') {
        try {
          JSON.parse(value);
          console.log(`✅ ${key}: Valid JSON (${value.length} chars)`);
        } catch (error) {
          analysis.corruptedItems.push(key);
          console.log(`❌ ${key}: Corrupted JSON - ${error.message}`);
        }
      } else {
        console.log(`✅ ${key}: Present (${value.length} chars)`);
      }
    } else {
      console.log(`❌ ${key}: Missing`);
      if (key === 'access_token' || key === 'user') {
        analysis.missingCriticalItems.push(key);
      }
    }
  });
  
  return analysis;
};

const analyzeUserDataConsistency = () => {
  console.log("Analyzing user data consistency across storage...");
  
  const analysis = {
    jwtUserId: null,
    storedUserId: null,
    userDataComplete: false,
    inconsistencies: []
  };
  
  // Extract user ID from JWT
  const token = localStorage.getItem('access_token');
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      analysis.jwtUserId = payload.sub || payload.user_id || payload.id;
      console.log(`JWT User ID: ${analysis.jwtUserId}`);
    } catch (error) {
      analysis.inconsistencies.push('Failed to extract user ID from JWT');
      console.log(`❌ JWT parsing failed: ${error.message}`);
    }
  }
  
  // Extract user ID from stored user data
  const userData = localStorage.getItem('user');
  if (userData) {
    try {
      const user = JSON.parse(userData);
      analysis.storedUserId = user.id || user.user_id || user.uuid;
      analysis.userDataComplete = !!(user.email && user.id);
      console.log(`Stored User ID: ${analysis.storedUserId}`);
      console.log(`User data complete: ${analysis.userDataComplete}`);
      
      // Check for required fields
      const requiredFields = ['id', 'email'];
      const missingFields = requiredFields.filter(field => !user[field]);
      if (missingFields.length > 0) {
        analysis.inconsistencies.push(`Missing required user fields: ${missingFields.join(', ')}`);
      }
      
    } catch (error) {
      analysis.inconsistencies.push('Failed to parse stored user data');
      console.log(`❌ User data parsing failed: ${error.message}`);
    }
  }
  
  // Check consistency
  if (analysis.jwtUserId && analysis.storedUserId) {
    if (String(analysis.jwtUserId) !== String(analysis.storedUserId)) {
      analysis.inconsistencies.push(`User ID mismatch: JWT(${analysis.jwtUserId}) vs Stored(${analysis.storedUserId})`);
      console.log(`❌ User ID mismatch detected`);
    } else {
      console.log(`✅ User ID consistency verified`);
    }
  }
  
  return analysis;
};

const testAPIConnectivity = async () => {
  console.log("Testing API connectivity...");
  
  const analysis = {
    baseUrlReachable: false,
    endpointAccessible: false,
    corsConfigured: false,
    networkError: null
  };
  
  try {
    // Import API config
    const { API_ENDPOINTS } = await import('./config/api.js');
    const baseUrl = API_ENDPOINTS.CREATOR_ONBOARDING.STATUS.split('/api/')[0];
    
    console.log(`Testing base URL: ${baseUrl}`);
    
    // Test 1: Basic connectivity
    try {
      const response = await fetch(baseUrl, {
        method: 'HEAD',
        mode: 'no-cors',
        headers: { 'ngrok-skip-browser-warning': 'true' }
      });
      analysis.baseUrlReachable = true;
      console.log(`✅ Base URL reachable`);
    } catch (error) {
      console.log(`❌ Base URL not reachable: ${error.message}`);
    }
    
    // Test 2: API endpoint accessibility
    try {
      const testResponse = await fetch(API_ENDPOINTS.CREATOR_ONBOARDING.STATUS, {
        method: 'GET',
        headers: {
          'ngrok-skip-browser-warning': 'true',
          'Content-Type': 'application/json'
        }
      });
      
      analysis.endpointAccessible = true;
      analysis.corsConfigured = true;
      console.log(`✅ API endpoint accessible (status: ${testResponse.status})`);
      
    } catch (error) {
      if (error.message.includes('CORS')) {
        analysis.corsConfigured = false;
        console.log(`❌ CORS configuration issue`);
      } else {
        console.log(`❌ API endpoint not accessible: ${error.message}`);
      }
    }
    
  } catch (error) {
    analysis.networkError = error.message;
    console.log(`❌ Network error: ${error.message}`);
  }
  
  return analysis;
};

const compileIssuesAndRecommendations = (report) => {
  const { sections } = report;
  
  // Critical issues
  if (sections.localStorage?.missingCriticalItems.length > 0) {
    report.issues.push({
      type: 'critical',
      message: `Missing critical localStorage items: ${sections.localStorage.missingCriticalItems.join(', ')}`,
      section: 'localStorage'
    });
    report.recommendations.push('User needs to log in again');
  }
  
  if (sections.localStorage?.corruptedItems.length > 0) {
    report.issues.push({
      type: 'critical',
      message: `Corrupted localStorage items: ${sections.localStorage.corruptedItems.join(', ')}`,
      section: 'localStorage'
    });
    report.recommendations.push('Clear localStorage and have user log in again');
  }
  
  if (sections.jwtToken?.isExpired) {
    report.issues.push({
      type: 'critical',
      message: 'JWT token has expired',
      section: 'jwtToken'
    });
    report.recommendations.push('User needs to log in again to get a fresh token');
  }
  
  if (sections.userConsistency?.inconsistencies.length > 0) {
    sections.userConsistency.inconsistencies.forEach(inconsistency => {
      report.issues.push({
        type: 'high',
        message: inconsistency,
        section: 'userConsistency'
      });
    });
    report.recommendations.push('Clear authentication data and have user log in again');
  }
  
  if (sections.backendValidation?.status === 401) {
    report.issues.push({
      type: 'critical',
      message: 'Backend rejected JWT token - user ID not found in database',
      section: 'backendValidation'
    });
    report.recommendations.push('Backend team: Check if user record exists in database for the JWT user ID');
    report.recommendations.push('Frontend team: Clear authentication and force re-login');
  }
  
  if (!sections.apiConnectivity?.endpointAccessible) {
    report.issues.push({
      type: 'medium',
      message: 'API endpoints are not accessible',
      section: 'apiConnectivity'
    });
    report.recommendations.push('Backend team: Check if server is running and ngrok tunnel is active');
  }
  
  if (!sections.apiConnectivity?.corsConfigured) {
    report.issues.push({
      type: 'medium',
      message: 'CORS is not properly configured',
      section: 'apiConnectivity'
    });
    report.recommendations.push('Backend team: Configure CORS headers for frontend domain');
  }
};

const determineSeverity = (report) => {
  const criticalIssues = report.issues.filter(issue => issue.type === 'critical');
  const highIssues = report.issues.filter(issue => issue.type === 'high');
  
  if (criticalIssues.length > 0) return 'critical';
  if (highIssues.length > 0) return 'high';
  if (report.issues.length > 0) return 'medium';
  return 'healthy';
};

const printFinalReport = (report) => {
  console.log("\n📊 === FINAL DIAGNOSTIC REPORT ===");
  console.log(`Severity: ${report.severity.toUpperCase()}`);
  console.log(`Issues Found: ${report.issues.length}`);
  console.log(`Recommendations: ${report.recommendations.length}`);
  
  if (report.issues.length > 0) {
    console.log("\n❌ ISSUES IDENTIFIED:");
    report.issues.forEach((issue, index) => {
      console.log(`${index + 1}. [${issue.type.toUpperCase()}] ${issue.message} (${issue.section})`);
    });
  }
  
  if (report.recommendations.length > 0) {
    console.log("\n💡 RECOMMENDATIONS:");
    report.recommendations.forEach((rec, index) => {
      console.log(`${index + 1}. ${rec}`);
    });
  }
  
  // Specific diagnosis for Step 1 -> Step 2 issue
  if (report.sections.backendValidation?.status === 401) {
    console.log("\n🎯 === STEP 1 -> STEP 2 SPECIFIC DIAGNOSIS ===");
    console.log("ROOT CAUSE: JWT token contains a user ID that doesn't exist in the backend database");
    console.log("\nPOSSIBLE REASONS:");
    console.log("1. User signup/login process created JWT but failed to create user record in database");
    console.log("2. Database transaction rollback after JWT was issued");
    console.log("3. JWT was issued with incorrect user ID");
    console.log("4. Database connection issues during user creation");
    console.log("5. User record was deleted after JWT was issued");
    
    console.log("\nRECOMMENDED SOLUTION:");
    console.log("1. Backend team: Check user creation process and database transactions");
    console.log("2. Backend team: Verify user record exists for JWT user ID");
    console.log("3. Frontend team: Clear authentication data and force user to log in again");
    console.log("4. Consider adding user existence check in JWT validation middleware");
  }
  
  if (report.severity === 'healthy') {
    console.log("\n✅ Authentication flow appears healthy!");
  }
};

// Quick diagnostic functions for common issues
export const quickDiagnoseJWTIssue = async () => {
  console.log("🔍 Quick JWT Issue Diagnosis...");
  
  const token = localStorage.getItem('access_token');
  if (!token) {
    console.log("❌ No JWT token found - user needs to log in");
    return { issue: 'no_token', solution: 'login_required' };
  }
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const now = Math.floor(Date.now() / 1000);
    
    if (payload.exp <= now) {
      console.log("❌ JWT token has expired - user needs to log in");
      return { issue: 'expired_token', solution: 'login_required' };
    }
    
    const userId = payload.sub || payload.user_id || payload.id;
    if (!userId) {
      console.log("❌ JWT token missing user ID - invalid token format");
      return { issue: 'missing_user_id', solution: 'login_required' };
    }
    
    console.log(`✅ JWT token appears valid for user: ${userId}`);
    
    // Test with backend
    const backendTest = await JWTDebugger.testJWTWithAPIRequest();
    if (backendTest.status === 401) {
      console.log("❌ Backend rejected JWT - user not in database");
      return { 
        issue: 'user_not_in_database', 
        solution: 'backend_user_creation_issue',
        userId: userId
      };
    }
    
    console.log("✅ JWT token is valid and accepted by backend");
    return { issue: 'none', solution: 'healthy' };
    
  } catch (error) {
    console.log(`❌ JWT token parsing failed: ${error.message}`);
    return { issue: 'corrupted_token', solution: 'login_required' };
  }
};

export const fixAuthenticationIssue = async () => {
  console.log("🔧 Attempting to fix authentication issue...");
  
  const diagnosis = await quickDiagnoseJWTIssue();
  
  switch (diagnosis.solution) {
    case 'login_required':
      console.log("🧹 Clearing authentication data...");
      JWTDebugger.clearAuthenticationData();
      console.log("🔄 User should log in again");
      // Redirect to login
      if (typeof window !== 'undefined') {
        window.location.hash = '#login';
      }
      break;
      
    case 'backend_user_creation_issue':
      console.log("⚠️ Backend issue detected - cannot fix from frontend");
      console.log("📞 Contact backend team to check user record for ID:", diagnosis.userId);
      break;
      
    case 'healthy':
      console.log("�� No issues detected");
      break;
      
    default:
      console.log("❓ Unknown issue - manual investigation required");
  }
  
  return diagnosis;
};

// Make debugging tools available globally
if (typeof window !== 'undefined') {
  window.AuthFlowDebugger = {
    runFullDiagnostic: runFullAuthenticationDiagnostic,
    quickDiagnose: quickDiagnoseJWTIssue,
    fixIssue: fixAuthenticationIssue,
    JWTDebugger
  };
  
  console.log("🔧 Auth Flow Debugger available as window.AuthFlowDebugger");
  console.log("🔧 Try: window.AuthFlowDebugger.runFullDiagnostic()");
}

export default {
  runFullAuthenticationDiagnostic,
  quickDiagnoseJWTIssue,
  fixAuthenticationIssue
};
