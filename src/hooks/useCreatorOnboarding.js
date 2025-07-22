import { useState, useCallback } from "react";
import { API_ENDPOINTS, apiRequest, safeJsonParse, tokenManager } from "../config/api";

export const useCreatorOnboarding = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [checkingDisplayName, setCheckingDisplayName] = useState(false);

  // Get current onboarding status
  const getOnboardingStatus = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiRequest(
        API_ENDPOINTS.CREATOR_ONBOARDING.STATUS,
        {
          method: "GET",
        },
      );

      const data = await safeJsonParse(response);

      if (!response.ok) {
        throw new Error(
          data?.message ||
            data?.error?.message ||
            "Failed to get onboarding status",
        );
      }

      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Check display name availability
  const checkDisplayName = useCallback(
    async (displayName) => {
      // Prevent concurrent requests
      if (checkingDisplayName) {
        return;
      }

      try {
        setCheckingDisplayName(true);
        setError(null);

        const response = await apiRequest(
          `${API_ENDPOINTS.CREATOR_ONBOARDING.CHECK_DISPLAY_NAME}/${encodeURIComponent(displayName)}`,
          {
            method: "GET",
          },
        );

        const data = await safeJsonParse(response);

        if (!response.ok) {
          // Handle different error types based on status code
          if (response.status === 400) {
            const errorMessage =
              data?.error?.message?.message ||
              data?.error?.message ||
              "Invalid display name format";
            throw new Error(errorMessage);
          } else if (response.status === 403) {
            throw new Error("Authentication required");
          } else {
            const errorMessage =
              data?.error?.message?.error ||
              data?.error?.message ||
              "Failed to check display name";
            throw new Error(errorMessage);
          }
        }

        return data;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setCheckingDisplayName(false);
      }
    },
    [checkingDisplayName],
  );

  // Submit Step 1: Basic Profile
  const submitStep1 = useCallback(async (formData) => {
    try {
      setLoading(true);
      setError(null);

      // Create FormData for multipart/form-data as expected by API
      const apiFormData = new FormData();

      // Add required fields
      apiFormData.append("display_name", formData.get("display_name"));
      apiFormData.append("gender", formData.get("gender"));
      apiFormData.append("country", formData.get("country"));
      apiFormData.append("timezone", formData.get("timezone"));

      // Convert languages array to proper field name and format
      const languages = JSON.parse(formData.get("languages") || "[]");
      apiFormData.append("languages_spoken", JSON.stringify(languages));

      // Add optional fields if they exist
      const city = formData.get("city");
      if (city && city.trim()) {
        apiFormData.append("city", city.trim());
      }

      const bio = formData.get("bio");
      if (bio && bio.trim()) {
        apiFormData.append("bio", bio.trim());
      }

      // Add profile picture if it exists
      const profilePicture = formData.get("profile_picture");
      if (profilePicture && profilePicture.size > 0) {
        apiFormData.append("profile_picture", profilePicture);
      }

      const response = await apiRequest(
        API_ENDPOINTS.CREATOR_ONBOARDING.STEP1_BASIC_PROFILE,
        {
          method: "POST",
          body: apiFormData, // Let fetch handle multipart/form-data headers
        },
      );

      // Read the response body once and handle both success and error cases
      const data = await safeJsonParse(response);

      if (!response.ok) {
        console.error("❌ Submit Step 1 failed:", {
          status: response.status,
          statusText: response.statusText,
          data: data,
        });

        // Handle 422 validation errors specifically
        if (response.status === 422) {
          const validationErrors =
            data?.error?.details ||
            data?.details ||
            data?.errors ||
            [];
          console.error("🔍 Validation errors:", validationErrors);

          if (validationErrors.length > 0) {
            const errorMessages = validationErrors
              .map(
                (err) =>
                  err?.message || err?.msg || err?.error || JSON.stringify(err),
              )
              .join(", ");
            throw new Error(`Validation failed: ${errorMessages}`);
          } else {
            throw new Error(
              data?.message ||
                data?.error?.message ||
                "Request validation failed",
            );
          }
        }

        throw new Error(
          data?.message ||
            data?.error?.message ||
            "Failed to submit basic profile",
        );
      }

      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Submit Step 2: Social Media (Legacy - keeping for backward compatibility)
  const submitStep2 = useCallback(async (socialMediaData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiRequest(
        API_ENDPOINTS.CREATOR_ONBOARDING.STEP2_SOCIAL_MEDIA,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(socialMediaData),
        },
      );

      // Read the response body once and handle both success and error cases
      const data = await safeJsonParse(response);

      if (!response.ok) {
        const errorMessage =
          data?.message ||
          data?.error?.message ||
          "Failed to submit social media";

        // Handle 422 validation errors specifically
        if (response.status === 422) {
          const validationErrors =
            data?.error?.details || data?.details || data?.errors || [];

          console.error("🔍 Step 2 Validation Error Details:", {
            status: response.status,
            responseData: data,
            validationErrors: validationErrors,
            sentData: socialMediaData
          });

          if (validationErrors.length > 0) {
            const errorMessages = validationErrors
              .map(
                (err) =>
                  err?.message || err?.msg || err?.error || JSON.stringify(err),
              )
              .join(", ");
            throw new Error(`Validation failed: ${errorMessages}`);
          } else {
            throw new Error(errorMessage);
          }
        }

        throw new Error(errorMessage);
      }

      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Submit Single Platform (New API Contract)
  const submitSinglePlatform = useCallback(async (platformData) => {
    try {
      setLoading(true);
      setError(null);

      console.log("📤 Submitting single platform:", {
        platform: platformData.platform,
        handle: platformData.handle,
        hasOauthCode: !!platformData.oauthCode,
        source: platformData.source
      });

      // First check if the API endpoint URL is properly formed
      const apiUrl = API_ENDPOINTS.CREATOR_ONBOARDING.STEP2_SOCIAL_MEDIA;
      console.log("🔗 API Endpoint:", apiUrl);

      const response = await apiRequest(
        apiUrl,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "X-Request-ID": `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          },
          body: JSON.stringify(platformData),
        },
      );

      // Read the response body once and handle both success and error cases
      const data = await safeJsonParse(response);

      if (!response.ok) {
        // Create error object with detailed information for specific error handling
        const apiError = new Error(data?.message || "Failed to connect platform");
        apiError.response = { data };
        apiError.status = response.status;

        // Special handling for 401 authentication errors
        if (response.status === 401) {
          console.error("🔑 Authentication Error: Invalid JWT token or user not found in database", {
            status: response.status,
            statusText: response.statusText,
            errorCode: data?.error,
            message: data?.message,
            sentData: platformData
          });

          apiError.isAuthError = true;
          apiError.message = "Authentication failed: Your session has expired or your account is invalid";
        } else {
          console.error("🔍 Single Platform API Error:", {
            status: response.status,
            statusText: response.statusText,
            errorCode: data?.error,
            message: data?.message,
            traceId: data?.traceId,
            sentData: platformData,
            apiUrl: apiUrl
          });
        }

        throw apiError;
      }

      console.log("✅ Platform connected successfully:", {
        platform: platformData.platform,
        handle: platformData.handle,
        verified: data?.data?.verified,
        traceId: data?.traceId,
        status: data?.status
      });

      return data;
    } catch (err) {
      // Enhanced error logging for debugging (only log once per error type)
      if (!window._loggedErrors) window._loggedErrors = new Set();

      const errorKey = `${err.constructor.name}:${err.message}`;
      if (!window._loggedErrors.has(errorKey)) {
        window._loggedErrors.add(errorKey);
        console.error("❌ submitSinglePlatform error:", {
          errorMessage: err.message,
          errorType: err.constructor.name,
          platform: platformData?.platform
        });
      }

      // Check for specific error types
      if (err.message.includes("Failed to fetch")) {
        const networkError = new Error("Network Error: Cannot connect to backend server. Please check if the backend is running and accessible.");
        networkError.response = err.response;
        networkError.status = err.status;
        setError(networkError.message);
        throw networkError;
      }

      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);


  // Submit Step 3: Niche & Preferences
  const submitStep3 = useCallback(async (formData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiRequest(
        API_ENDPOINTS.CREATOR_ONBOARDING.STEP3_NICHE_PREFERENCES,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        },
      );

      // Read the response body once and handle both success and error cases
      const data = await safeJsonParse(response);

      if (!response.ok) {
        throw new Error(data?.message || "Failed to submit niche & preferences");
      }

      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Submit Step 4: Portfolio
  const submitStep4 = useCallback(async (formData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiRequest(
        API_ENDPOINTS.CREATOR_ONBOARDING.STEP4_PORTFOLIO,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        },
      );

      // Read the response body once and handle both success and error cases
      const data = await safeJsonParse(response);

      if (!response.ok) {
        throw new Error(data?.message || "Failed to submit portfolio");
      }

      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Submit Step 5: Verification
  const submitStep5 = useCallback(async (formData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiRequest(
        API_ENDPOINTS.CREATOR_ONBOARDING.STEP5_VERIFICATION,
        {
          method: "POST",
          body: formData, // FormData object for file upload
        },
      );

      // Read the response body once and handle both success and error cases
      const data = await safeJsonParse(response);

      if (!response.ok) {
        throw new Error(data?.message || "Failed to submit verification");
      }

      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Submit Step 6: Platform Preferences
  const submitStep6 = useCallback(async (formData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiRequest(
        API_ENDPOINTS.CREATOR_ONBOARDING.STEP6_PLATFORM_PREFERENCES,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        },
      );

      // Read the response body once and handle both success and error cases
      const data = await safeJsonParse(response);

      if (!response.ok) {
        throw new Error(
          data?.message || "Failed to submit platform preferences",
        );
      }

      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    checkingDisplayName,
    getOnboardingStatus,
    checkDisplayName,
    submitStep1,
    submitStep2,
    submitSinglePlatform,
    submitStep3,
    submitStep4,
    submitStep5,
    submitStep6,
  };
};

export default useCreatorOnboarding;
