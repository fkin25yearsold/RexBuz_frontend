import React, { useState, useEffect, useCallback } from "react";
import { useTheme } from "../../../contexts/ThemeContext";
import Button from "../../common/Button";
import useCreatorOnboarding from "../../../hooks/useCreatorOnboarding";

// Platform configuration with OAuth support
const PLATFORM_CONFIG = {
  instagram: {
    id: "instagram",
    name: "Instagram",
    icon: "📷",
    color: "from-purple-500 to-pink-500",
    description: "Connect your Instagram account",
    handlePattern: /^[A-Za-z0-9._]{1,50}$/,
    placeholder: "your_username",
    oauthSupported: true,
    minFollowers: 1000,
  },
  youtube: {
    id: "youtube", 
    name: "YouTube",
    icon: "📹",
    color: "from-red-500 to-red-600",
    description: "Connect your YouTube channel",
    handlePattern: /^[A-Za-z0-9._-]{3,50}$/,
    placeholder: "YourChannelName",
    oauthSupported: true,
    minFollowers: 100,
  },
  tiktok: {
    id: "tiktok",
    name: "TikTok", 
    icon: "🎵",
    color: "from-black to-gray-800",
    description: "Connect your TikTok account",
    handlePattern: /^[A-Za-z0-9._]{2,50}$/,
    placeholder: "your_username",
    oauthSupported: false,
    minFollowers: 500,
  },
  twitter: {
    id: "twitter",
    name: "Twitter/X",
    icon: "𝕏",
    color: "from-blue-400 to-blue-600", 
    description: "Connect your Twitter/X account",
    handlePattern: /^[A-Za-z0-9_]{1,50}$/,
    placeholder: "your_handle",
    oauthSupported: true,
    minFollowers: 500,
  },
  linkedin: {
    id: "linkedin",
    name: "LinkedIn",
    icon: "💼",
    color: "from-blue-600 to-blue-700",
    description: "Connect your LinkedIn profile",
    handlePattern: /^[A-Za-z0-9.-]{3,50}$/,
    placeholder: "your-profile",
    oauthSupported: false,
    minFollowers: 200,
  },
};

const OnboardingStep2 = ({
  onComplete,
  onBack,
  onNext,
  existingData,
  isCompleted,
  canProceed,
}) => {
  const { isDark } = useTheme();
  const { submitSinglePlatform, loading } = useCreatorOnboarding();

  // Main state
  const [connectedPlatforms, setConnectedPlatforms] = useState([]);
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [currentHandle, setCurrentHandle] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");

  // Rate limiting state
  const [rateLimitedUntil, setRateLimitedUntil] = useState(null);
  const [rateLimitCountdown, setRateLimitCountdown] = useState(0);

  // OAuth state
  const [oauthInProgress, setOauthInProgress] = useState(false);
  const [oauthPlatform, setOauthPlatform] = useState(null);

  // Demo mode state
  const [demoMode, setDemoMode] = useState(false);
  const [networkFailures, setNetworkFailures] = useState(0);

  // Load existing connected platforms
  useEffect(() => {
    if (existingData && existingData.platforms) {
      setConnectedPlatforms(existingData.platforms);
    }
  }, [existingData]);

  // Rate limit countdown timer
  useEffect(() => {
    let timer;
    if (rateLimitCountdown > 0) {
      timer = setInterval(() => {
        setRateLimitCountdown(prev => {
          if (prev <= 1) {
            setRateLimitedUntil(null);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [rateLimitCountdown]);

  // Handle platform selection
  const handlePlatformSelect = (platformId) => {
    setSelectedPlatform(platformId);
    setCurrentHandle("");
    setErrors({});
    setSuccess("");
  };

  // Validate handle input
  const validateHandle = (handle, platform) => {
    if (!handle.trim()) {
      return "Username/handle is required";
    }

    const config = PLATFORM_CONFIG[platform];
    if (!config.handlePattern.test(handle)) {
      return `Invalid ${config.name} username format`;
    }

    return "";
  };

  // Handle OAuth flow initiation
  const initiateOAuth = async (platform) => {
    setOauthInProgress(true);
    setOauthPlatform(platform);
    setErrors({});

    try {
      // In a real implementation, this would redirect to OAuth provider
      // For now, we'll simulate the OAuth flow
      console.log(`🔄 Initiating OAuth for ${platform}`);
      
      // Simulate OAuth redirect
      const redirectUrl = `https://api.instagram.com/oauth/authorize?client_id=YOUR_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URI&scope=user_profile&response_type=code&state=${Date.now()}`;
      
      // In production, you would:
      // window.location.href = redirectUrl;
      
      // For demo purposes, simulate receiving OAuth code
      setTimeout(() => {
        handleOAuthCallback(platform, "simulated_oauth_code", `state_${Date.now()}`);
      }, 2000);
      
    } catch (error) {
      setErrors({ oauth: `Failed to initiate OAuth: ${error.message}` });
      setOauthInProgress(false);
      setOauthPlatform(null);
    }
  };

  // Handle OAuth callback
  const handleOAuthCallback = async (platform, oauthCode, state) => {
    try {
      const result = await connectPlatformWithOAuth(platform, currentHandle, oauthCode, state);
      if (result.success) {
        setSuccess(`✅ ${PLATFORM_CONFIG[platform].name} connected successfully!`);
        setSelectedPlatform(null);
        setCurrentHandle("");
      }
    } catch (error) {
      setErrors({ oauth: error.message });
    } finally {
      setOauthInProgress(false);
      setOauthPlatform(null);
    }
  };

  // Connect platform with OAuth
  const connectPlatformWithOAuth = async (platform, handle, oauthCode, state) => {
    const requestData = {
      platform: platform.toLowerCase(),
      handle: handle.replace(/^@/, "").toLowerCase(),
      oauthCode: oauthCode,
      state: state,
      source: "onboarding"
    };

    try {
      // If demo mode is enabled, simulate OAuth connection
      if (demoMode) {
        console.log("🎭 Demo mode: Simulating OAuth connection...");
        await new Promise(resolve => setTimeout(resolve, 1500));

        const mockResult = {
          success: true,
          status: "created",
          data: {
            uuid: `oauth-demo-${Date.now()}`,
            platform: platform,
            handle: handle,
            verified: true, // OAuth connections are usually verified
            attemptedVerification: true,
            username: handle,
            platformUserId: `oauth_demo_${Math.floor(Math.random() * 1000000)}`,
            createdAt: new Date().toISOString()
          }
        };

        // Update connected platforms list
        setConnectedPlatforms(prev => {
          const updated = prev.filter(p => p.platform !== platform);
          updated.push({
            platform: platform,
            handle: handle,
            verified: mockResult.data.verified,
            uuid: mockResult.data.uuid,
            platformUserId: mockResult.data.platformUserId,
            connectedAt: mockResult.data.createdAt
          });
          return updated;
        });

        return { success: true, data: mockResult.data };
      }

      // Real OAuth connection
      const result = await submitSinglePlatform(requestData);

      // Update connected platforms list
      setConnectedPlatforms(prev => {
        const updated = prev.filter(p => p.platform !== platform);
        updated.push({
          platform: platform,
          handle: handle,
          verified: result.data.verified,
          uuid: result.data.uuid,
          platformUserId: result.data.platformUserId,
          connectedAt: result.data.createdAt
        });
        return updated;
      });

      return { success: true, data: result.data };
    } catch (error) {
      // Handle network errors for OAuth as well
      if (error.message.includes("Failed to fetch") || error.message.includes("Network error")) {
        const newFailureCount = networkFailures + 1;
        setNetworkFailures(newFailureCount);

        if (newFailureCount >= 2 && !demoMode) {
          setDemoMode(true);
          setSuccess("🎭 Demo mode enabled automatically. OAuth connections will be simulated!");
          // Retry the connection in demo mode
          return await connectPlatformWithOAuth(platform, handle, oauthCode, state);
        }
      }
      throw error;
    }
  };

  // Connect platform manually (without OAuth)
  const connectPlatformManually = async () => {
    if (!selectedPlatform || !currentHandle) return;

    const handleError = validateHandle(currentHandle, selectedPlatform);
    if (handleError) {
      setErrors({ handle: handleError });
      return;
    }

    setIsConnecting(true);
    setErrors({});

    const requestData = {
      platform: selectedPlatform.toLowerCase(),
      handle: currentHandle.replace(/^@/, "").toLowerCase(),
      source: "onboarding"
    };

    console.log(`📤 Manual connection for ${selectedPlatform}:`, requestData);

    try {
      // If demo mode is enabled, simulate connection
      if (demoMode) {
        console.log("🎭 Demo mode: Simulating platform connection...");
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay

        const mockResult = {
          success: true,
          status: "created",
          message: "Social-media profile saved (demo mode)",
          data: {
            uuid: `demo-${Date.now()}`,
            platform: selectedPlatform,
            handle: currentHandle,
            verified: Math.random() > 0.5, // Random verification for demo
            attemptedVerification: false,
            username: currentHandle,
            platformUserId: `demo_${Math.floor(Math.random() * 1000000)}`,
            createdAt: new Date().toISOString()
          }
        };

        // Update connected platforms with demo data
        setConnectedPlatforms(prev => {
          const updated = prev.filter(p => p.platform !== selectedPlatform);
          updated.push({
            platform: selectedPlatform,
            handle: currentHandle,
            verified: mockResult.data.verified,
            uuid: mockResult.data.uuid,
            platformUserId: mockResult.data.platformUserId,
            connectedAt: mockResult.data.createdAt
          });
          return updated;
        });

        setSuccess(`✅ ${PLATFORM_CONFIG[selectedPlatform].name} connected successfully! (Demo Mode)`);
        setSelectedPlatform(null);
        setCurrentHandle("");
        return;
      }

      // Real API connection
      console.log("🔍 Making real API request...");
      const result = await submitSinglePlatform(requestData);

      console.log(`✅ Platform connected successfully:`, result);

      // Update connected platforms
      setConnectedPlatforms(prev => {
        const updated = prev.filter(p => p.platform !== selectedPlatform);
        updated.push({
          platform: selectedPlatform,
          handle: currentHandle,
          verified: result.data?.verified || false,
          uuid: result.data?.uuid || `manual-${Date.now()}`,
          platformUserId: result.data?.platformUserId || null,
          connectedAt: result.data?.createdAt || new Date().toISOString()
        });
        return updated;
      });

      setSuccess(`✅ ${PLATFORM_CONFIG[selectedPlatform].name} connected successfully!`);
      setSelectedPlatform(null);
      setCurrentHandle("");

    } catch (error) {
      console.error(`❌ Manual connection failed:`, error.message);

      // Track network failures
      const isNetworkError = error.message.includes("Failed to fetch") ||
                            error.message.includes("Network error") ||
                            error.message.includes("Cannot connect to backend");

      if (isNetworkError) {
        const newFailureCount = networkFailures + 1;
        setNetworkFailures(newFailureCount);

        // Auto-enable demo mode after 2 failures
        if (newFailureCount >= 2 && !demoMode) {
          console.log("🎭 Auto-enabling demo mode after multiple network failures");
          setDemoMode(true);
          setSuccess("🎭 Demo mode enabled automatically due to network issues. You can now connect platforms offline!");
          setErrors({});
          return;
        }

        setErrors({
          general: (
            <div className="text-center">
              <p className="mb-3">⚠️ Cannot connect to backend server ({newFailureCount}/2 failures).</p>
              <p className="text-sm mb-3">The backend may be offline or ngrok URL may be outdated.</p>
              <div className="space-x-2">
                <button
                  onClick={() => setDemoMode(true)}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium"
                >
                  🎭 Enable Demo Mode
                </button>
                <button
                  onClick={() => {
                    setErrors({});
                    setNetworkFailures(0);
                  }}
                  className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-sm font-medium"
                >
                  🔄 Reset & Retry
                </button>
              </div>
            </div>
          )
        });
      } else {
        handleApiError(error);
      }
    } finally {
      setIsConnecting(false);
    }
  };

  // Test API connectivity
  const testConnectivity = async () => {
    setErrors({});
    console.log("🧪 Testing API connectivity...");

    try {
      // Import the test function
      const { testApiUrl } = await import("../../../config/api-urls");
      const isConnected = await testApiUrl();

      if (isConnected) {
        setSuccess("✅ API connectivity test passed!");
      } else {
        setErrors({
          general: "❌ API connectivity test failed. Backend may be offline or ngrok URL outdated."
        });
      }
    } catch (error) {
      setErrors({
        general: `❌ Connectivity test error: ${error.message}`
      });
    }
  };

  // Handle API errors with specific error codes
  const handleApiError = (error) => {
    const errorData = error.response?.data || {};
    const errorCode = errorData.error;
    const message = errorData.message || error.message;

    console.error("🔍 API Error Details:", {
      errorCode,
      message,
      status: error.status,
      isAuthError: error.isAuthError,
      fullError: error,
      responseData: errorData
    });

    // Handle authentication errors (401)
    if (error.status === 401 || error.isAuthError) {
      setErrors({
        general: (
          <div className="text-center">
            <p className="mb-3">🔑 Authentication Error</p>
            <p className="text-sm mb-3">Your session has expired or your account is invalid.</p>
            <p className="text-sm mb-3">You will be redirected to login automatically.</p>
            <div className="animate-pulse text-blue-600">Please wait...</div>
          </div>
        )
      });
      return;
    }

    switch (errorCode) {
      case "OAUTH_USERNAME_MISMATCH":
        setErrors({ handle: "The connected account username doesn't match the entered handle" });
        break;
      case "HANDLE_ALREADY_TAKEN":
        setErrors({ handle: "This handle is already connected to another account" });
        break;
      case "VALIDATION_ERROR":
        setErrors({ handle: message });
        break;
      case "RATE_LIMIT_EXCEEDED":
        const retryAfter = errorData.retryAfter || 60;
        setRateLimitedUntil(Date.now() + (retryAfter * 1000));
        setRateLimitCountdown(retryAfter);
        setErrors({ rate: `Rate limit exceeded. Try again in ${retryAfter} seconds.` });
        break;
      case "OAUTH_CODE_USED":
        setErrors({ oauth: "OAuth code has expired. Please try connecting again." });
        break;
      case "GRAPH_API_QUOTA_EXCEEDED":
        setErrors({ oauth: "Platform API is temporarily unavailable. Please try again later." });
        break;
      default:
        // Check for network errors
        if (message.includes("Failed to fetch") || message.includes("Network error")) {
          setErrors({
            general: "🌐 Network Error: Cannot connect to backend server. Please check if the backend is running and ngrok URL is correct."
          });
        } else {
          setErrors({ general: message || "An unexpected error occurred" });
        }
    }
  };

  // Remove connected platform
  const removePlatform = (platformId) => {
    setConnectedPlatforms(prev => prev.filter(p => p.platform !== platformId));
    setSuccess("");
  };

  // Handle form completion
  const handleComplete = () => {
    if (connectedPlatforms.length === 0) {
      setErrors({ general: "Please connect at least one social media platform" });
      return;
    }

    onComplete({ platforms: connectedPlatforms });
  };

  // Format countdown time
  const formatCountdown = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className={`text-3xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Connect Your Social Media
          {demoMode && (
            <span className="ml-3 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm font-medium rounded-full">
              🎭 Demo Mode
            </span>
          )}
        </h2>
        <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          Connect your social media accounts to verify your creator status and unlock collaboration opportunities.
        </p>
        {demoMode && (
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-blue-700 dark:text-blue-300 text-sm">
              🎭 Demo mode is active. Connections will be simulated without making real API calls.
              <button
                onClick={() => {
                  setDemoMode(false);
                  setNetworkFailures(0);
                  setErrors({});
                  setSuccess("");
                }}
                className="ml-2 text-blue-600 dark:text-blue-400 underline hover:no-underline"
              >
                Disable Demo Mode
              </button>
            </p>
          </div>
        )}
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="text-green-700 dark:text-green-300 text-center font-medium">{success}</p>
        </div>
      )}

      {/* Rate Limit Warning */}
      {rateLimitCountdown > 0 && (
        <div className="mb-6 p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
          <div className="flex items-center justify-center space-x-2">
            <span className="text-orange-600 dark:text-orange-400">⏱️</span>
            <p className="text-orange-700 dark:text-orange-300 font-medium">
              Rate limit active. Try again in {formatCountdown(rateLimitCountdown)}
            </p>
          </div>
        </div>
      )}

      {/* Connected Platforms */}
      {connectedPlatforms.length > 0 && (
        <div className="mb-8">
          <h3 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Connected Platforms ({connectedPlatforms.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {connectedPlatforms.map((platform) => {
              const config = PLATFORM_CONFIG[platform.platform];
              return (
                <div
                  key={platform.platform}
                  className={`p-4 rounded-lg border ${
                    isDark 
                      ? 'bg-gray-800 border-gray-700' 
                      : 'bg-white border-gray-200'
                  } shadow-sm`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${config.color} flex items-center justify-center text-white text-lg`}>
                        {config.icon}
                      </div>
                      <div>
                        <h4 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {config.name}
                        </h4>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          @{platform.handle}
                          {platform.verified && (
                            <span className="ml-2 text-green-500">✓ Verified</span>
                          )}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => removePlatform(platform.platform)}
                      className="text-red-500 hover:text-red-700 p-1"
                      title="Remove platform"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Platform Selection */}
      <div className="mb-8">
        <h3 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Add Social Media Platform
        </h3>
        
        {/* Platform Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
          {Object.values(PLATFORM_CONFIG).map((platform) => {
            const isConnected = connectedPlatforms.some(p => p.platform === platform.id);
            const isSelected = selectedPlatform === platform.id;
            
            return (
              <button
                key={platform.id}
                onClick={() => handlePlatformSelect(platform.id)}
                disabled={isConnected || rateLimitCountdown > 0}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : isConnected
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20 opacity-75'
                    : isDark
                    ? 'border-gray-700 bg-gray-800 hover:border-gray-600'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                } ${(isConnected || rateLimitCountdown > 0) ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div className={`w-12 h-12 mx-auto mb-2 rounded-lg bg-gradient-to-r ${platform.color} flex items-center justify-center text-white text-xl`}>
                  {platform.icon}
                </div>
                <h4 className={`font-medium text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {platform.name}
                </h4>
                <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  {isConnected ? 'Connected' : `Min ${platform.minFollowers}+ followers`}
                </p>
              </button>
            );
          })}
        </div>

        {/* Connection Form */}
        {selectedPlatform && (
          <div className={`p-6 rounded-lg border ${
            isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="flex items-center space-x-3 mb-4">
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${PLATFORM_CONFIG[selectedPlatform].color} flex items-center justify-center text-white`}>
                {PLATFORM_CONFIG[selectedPlatform].icon}
              </div>
              <div>
                <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Connect {PLATFORM_CONFIG[selectedPlatform].name}
                </h4>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {PLATFORM_CONFIG[selectedPlatform].description}
                </p>
              </div>
            </div>

            {/* Handle Input */}
            <div className="mb-4">
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Username/Handle
              </label>
              <input
                type="text"
                value={currentHandle}
                onChange={(e) => setCurrentHandle(e.target.value)}
                placeholder={PLATFORM_CONFIG[selectedPlatform].placeholder}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.handle
                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                    : isDark
                    ? 'border-gray-600 bg-gray-700 text-white'
                    : 'border-gray-300 bg-white'
                }`}
                disabled={isConnecting || oauthInProgress || rateLimitCountdown > 0}
              />
              {errors.handle && (
                <p className="text-red-500 text-sm mt-1">{errors.handle}</p>
              )}
            </div>

            {/* Connection Buttons */}
            <div className="flex space-x-3">
              {PLATFORM_CONFIG[selectedPlatform].oauthSupported && (
                <Button
                  onClick={() => initiateOAuth(selectedPlatform)}
                  disabled={!currentHandle || isConnecting || oauthInProgress || rateLimitCountdown > 0}
                  className="flex-1"
                  variant="primary"
                >
                  {oauthInProgress && oauthPlatform === selectedPlatform ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                      <span>Connecting...</span>
                    </div>
                  ) : (
                    `🔗 Connect with OAuth`
                  )}
                </Button>
              )}
              
              <Button
                onClick={connectPlatformManually}
                disabled={!currentHandle || isConnecting || oauthInProgress || rateLimitCountdown > 0}
                className="flex-1"
                variant="secondary"
              >
                {isConnecting ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full"></div>
                    <span>Adding...</span>
                  </div>
                ) : (
                  '➕ Add Manually'
                )}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Error Messages */}
      {(errors.general || errors.rate || errors.oauth) && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-700 dark:text-red-300 text-center">
            {errors.general || errors.rate || errors.oauth}
          </p>
        </div>
      )}

      {/* Development Tools (only show in development) */}
      {import.meta.env.DEV && (
        <div className="mb-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <h3 className={`text-lg font-semibold mb-3 ${isDark ? 'text-yellow-300' : 'text-yellow-800'}`}>
            🛠️ Development Tools
          </h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={testConnectivity}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors"
            >
              🧪 Test API Connectivity
            </button>
            <button
              onClick={() => {
                console.log("📋 Current API Configuration:", {
                  baseUrl: import.meta.env.VITE_API_BASE_URL || "from ngrok-urls.js",
                  endpoint: "/api/v1/creator/onboarding/step2/social-media",
                  isDev: import.meta.env.DEV,
                  mode: import.meta.env.MODE
                });
              }}
              className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors"
            >
              📋 Show API Config
            </button>
            <button
              onClick={() => {
                const token = localStorage.getItem("access_token");
                const user = localStorage.getItem("user");

                if (!token) {
                  console.log("🔑 No JWT token found");
                  return;
                }

                try {
                  const payload = JSON.parse(atob(token.split(".")[1]));
                  const now = Math.floor(Date.now() / 1000);
                  const isValid = payload.exp > now;

                  console.log("🔑 JWT Token Analysis:", {
                    tokenPresent: !!token,
                    tokenLength: token.length,
                    isValid: isValid,
                    expiresAt: new Date(payload.exp * 1000).toISOString(),
                    timeLeft: `${Math.max(0, payload.exp - now)} seconds`,
                    userId: payload.sub || payload.user_id,
                    userEmail: payload.email,
                    storedUser: user ? JSON.parse(user) : null
                  });
                } catch (error) {
                  console.error("🔑 Invalid JWT token format:", error);
                }
              }}
              className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-sm font-medium transition-colors"
            >
              🔑 Check JWT Token
            </button>
            <button
              onClick={() => {
                setDemoMode(!demoMode);
                if (!demoMode) {
                  setNetworkFailures(0);
                  setErrors({});
                  setSuccess("🎭 Demo mode enabled for testing!");
                }
              }}
              className={`px-4 py-2 ${demoMode ? 'bg-orange-500 hover:bg-orange-600' : 'bg-green-500 hover:bg-green-600'} text-white rounded-lg text-sm font-medium transition-colors`}
            >
              {demoMode ? '🔄 Disable Demo Mode' : '🎭 Enable Demo Mode'}
            </button>
            <button
              onClick={() => {
                setErrors({});
                setSuccess("");
                setNetworkFailures(0);
                if (window._loggedErrors) window._loggedErrors.clear();
                console.clear();
                console.log("🧹 Cleared all errors and logs");
              }}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors"
            >
              🧹 Clear Errors
            </button>
            <button
              onClick={() => {
                // Simulate successful connection for testing UI
                const mockPlatform = {
                  platform: "instagram",
                  handle: "test_user",
                  verified: true,
                  uuid: `mock-${Date.now()}`,
                  platformUserId: "12345",
                  connectedAt: new Date().toISOString()
                };
                setConnectedPlatforms(prev => [...prev, mockPlatform]);
                setSuccess("✅ Mock platform connected for testing!");
              }}
              className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-sm font-medium transition-colors"
            >
              ➕ Add Mock Platform
            </button>
          </div>
          <p className={`text-xs mt-2 ${isDark ? 'text-yellow-400' : 'text-yellow-700'}`}>
            These tools are only visible in development mode and help debug API connectivity issues.
          </p>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6">
        <Button
          onClick={onBack}
          variant="secondary"
          disabled={isConnecting || oauthInProgress}
        >
          ← Back
        </Button>
        
        <Button
          onClick={handleComplete}
          variant="primary"
          disabled={connectedPlatforms.length === 0 || isConnecting || oauthInProgress}
        >
          Continue →
        </Button>
      </div>

      {/* OAuth Status */}
      {oauthInProgress && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`p-6 rounded-lg max-w-md w-full mx-4 ${
            isDark ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="text-center">
              <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Connecting to {PLATFORM_CONFIG[oauthPlatform]?.name}
              </h3>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Please complete the authorization process in the popup window...
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OnboardingStep2;
