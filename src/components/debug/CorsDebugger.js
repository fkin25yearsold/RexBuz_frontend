import React, { useState } from "react";
import { testApiConnectivity } from "../../config/api.js";
import { ACTIVE_NGROK_URL } from "../../config/ngrok-urls.js";

const CorsDebugger = () => {
  const [results, setResults] = useState(null);
  const [testing, setTesting] = useState(false);

  const runTests = async () => {
    setTesting(true);
    console.log("🧪 Testing ngrok connectivity for URL:", ACTIVE_NGROK_URL);

    try {
      // Run the comprehensive connectivity test
      const testResults = await testApiConnectivity();

      // Additional specific CORS test for the failing endpoint
      let corsTest = { success: false, error: null };
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

        corsTest = {
          success: true,
          status: response.status,
          statusText: response.statusText,
        };
      } catch (error) {
        corsTest = {
          success: false,
          error: error.message,
          isCorsError: error.message.includes("CORS"),
        };
      }

      setResults({
        ...testResults,
        corsSpecificTest: corsTest,
      });
    } catch (error) {
      setResults({
        tests: [],
        overallSuccess: false,
        recommendations: [`Test failed: ${error.message}`],
        corsSpecificTest: { success: false, error: error.message },
      });
    }

    setTesting(false);
  };

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-800 rounded-lg">
      <h2 className="text-xl font-bold mb-4">CORS & Connectivity Debugger</h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Testing URL:{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
          {ACTIVE_NGROK_URL}
        </code>
      </p>

      <button
        onClick={runTests}
        disabled={testing}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
      >
        {testing ? "Testing..." : "Run Connectivity Tests"}
      </button>

      {results && (
        <div className="mt-6">
          <h3 className="font-semibold mb-3">Test Results:</h3>

          {/* General Tests */}
          <div className="space-y-2 mb-4">
            {results.tests.map((test, index) => (
              <div
                key={index}
                className={`p-3 rounded ${test.success ? "bg-green-100 dark:bg-green-900" : "bg-red-100 dark:bg-red-900"}`}
              >
                <div className="font-medium">
                  {test.success ? "✅" : "❌"} {test.name}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {test.details}
                </div>
              </div>
            ))}
          </div>

          {/* CORS Specific Test */}
          <div className="mb-4">
            <h4 className="font-medium mb-2">CORS Specific Test:</h4>
            <div
              className={`p-3 rounded ${results.corsSpecificTest.success ? "bg-green-100 dark:bg-green-900" : "bg-red-100 dark:bg-red-900"}`}
            >
              <div className="font-medium">
                {results.corsSpecificTest.success ? "✅" : "❌"} Step 1 Endpoint
                Test
              </div>
              {results.corsSpecificTest.success ? (
                <div className="text-sm">
                  Status: {results.corsSpecificTest.status} -{" "}
                  {results.corsSpecificTest.statusText}
                </div>
              ) : (
                <>
                  <div className="text-sm">
                    Error: {results.corsSpecificTest.error}
                  </div>
                  {results.corsSpecificTest.isCorsError && (
                    <div className="text-sm mt-2 p-2 bg-yellow-200 dark:bg-yellow-700 rounded">
                      🔧 <strong>CORS Issue Detected:</strong> The backend
                      server needs to include proper CORS headers. This is a
                      backend configuration issue, not frontend.
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Recommendations */}
          {results.recommendations.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Recommendations:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                {results.recommendations.map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Overall Status */}
          <div
            className={`mt-4 p-3 rounded font-medium ${results.overallSuccess ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200" : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"}`}
          >
            Overall Success: {results.overallSuccess ? "✅ Yes" : "❌ No"}
          </div>
        </div>
      )}
    </div>
  );
};

export default CorsDebugger;
