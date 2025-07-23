// OAuth configuration for different social media platforms
export const OAUTH_CONFIG = {
  instagram: {
    clientId: process.env.REACT_APP_INSTAGRAM_CLIENT_ID || 'YOUR_INSTAGRAM_CLIENT_ID',
    redirectUri: process.env.REACT_APP_INSTAGRAM_REDIRECT_URI || `${window.location.origin}/oauth/instagram/callback`,
    scope: 'user_profile,user_media',
    authUrl: 'https://api.instagram.com/oauth/authorize',
  },
  youtube: {
    clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID',
    redirectUri: process.env.REACT_APP_YOUTUBE_REDIRECT_URI || `${window.location.origin}/oauth/youtube/callback`,
    scope: 'https://www.googleapis.com/auth/youtube.readonly',
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
  },
  twitter: {
    clientId: process.env.REACT_APP_TWITTER_CLIENT_ID || 'YOUR_TWITTER_CLIENT_ID',
    redirectUri: process.env.REACT_APP_TWITTER_REDIRECT_URI || `${window.location.origin}/oauth/twitter/callback`,
    scope: 'tweet.read users.read',
    authUrl: 'https://twitter.com/i/oauth2/authorize',
  }
};

/**
 * Generate OAuth authorization URL for a platform
 * @param {string} platform - The platform ID (instagram, youtube, twitter)
 * @param {string} state - CSRF protection state parameter
 * @returns {string} Authorization URL
 */
export const generateAuthUrl = (platform, state) => {
  const config = OAUTH_CONFIG[platform];
  if (!config) {
    throw new Error(`OAuth not supported for platform: ${platform}`);
  }

  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    scope: config.scope,
    response_type: 'code',
    state: state,
  });

  // Platform-specific parameters
  if (platform === 'twitter') {
    params.append('code_challenge', generateCodeChallenge());
    params.append('code_challenge_method', 'S256');
  }

  return `${config.authUrl}?${params.toString()}`;
};

/**
 * Generate a random state parameter for CSRF protection
 * @returns {string} Random state string
 */
export const generateState = () => {
  return `state_${Date.now()}_${Math.random().toString(36).substr(2, 16)}`;
};

/**
 * Generate code challenge for PKCE (Twitter OAuth 2.0)
 * @returns {string} Code challenge
 */
export const generateCodeChallenge = () => {
  const codeVerifier = Math.random().toString(36).substring(2, 15) + 
                       Math.random().toString(36).substring(2, 15);
  
  // In a real implementation, you would use crypto.subtle.digest
  // For demo purposes, we'll return a simple hash
  return btoa(codeVerifier).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
};

/**
 * Parse OAuth callback URL parameters
 * @param {string} callbackUrl - The callback URL with parameters
 * @returns {Object} Parsed parameters
 */
export const parseCallbackParams = (callbackUrl) => {
  const url = new URL(callbackUrl);
  const params = new URLSearchParams(url.search);
  
  return {
    code: params.get('code'),
    state: params.get('state'),
    error: params.get('error'),
    errorDescription: params.get('error_description'),
  };
};

/**
 * Validate OAuth state parameter
 * @param {string} receivedState - State received from OAuth callback
 * @param {string} originalState - Original state sent with request
 * @returns {boolean} Whether state is valid
 */
export const validateState = (receivedState, originalState) => {
  return receivedState === originalState;
};

/**
 * Open OAuth popup window
 * @param {string} authUrl - OAuth authorization URL
 * @param {string} platform - Platform name for window title
 * @returns {Promise} Promise that resolves with callback parameters
 */
export const openOAuthPopup = (authUrl, platform) => {
  return new Promise((resolve, reject) => {
    const popup = window.open(
      authUrl,
      `oauth_${platform}`,
      'width=500,height=600,scrollbars=yes,resizable=yes'
    );

    if (!popup) {
      reject(new Error('Popup blocked. Please allow popups for this site.'));
      return;
    }

    // Check popup status periodically
    const checkClosed = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkClosed);
        reject(new Error('OAuth popup was closed by user'));
      }
    }, 1000);

    // Listen for callback message from popup
    const handleMessage = (event) => {
      if (event.origin !== window.location.origin) {
        return;
      }

      if (event.data.type === 'oauth_callback') {
        clearInterval(checkClosed);
        popup.close();
        window.removeEventListener('message', handleMessage);
        
        const params = parseCallbackParams(event.data.url);
        if (params.error) {
          reject(new Error(`OAuth error: ${params.error} - ${params.errorDescription}`));
        } else {
          resolve(params);
        }
      }
    };

    window.addEventListener('message', handleMessage);
  });
};

/**
 * Handle OAuth flow for a platform
 * @param {string} platform - Platform ID
 * @param {Function} onSuccess - Success callback
 * @param {Function} onError - Error callback
 */
export const handleOAuthFlow = async (platform, onSuccess, onError) => {
  try {
    const state = generateState();
    const authUrl = generateAuthUrl(platform, state);
    
    console.log(`🔄 Starting OAuth flow for ${platform}`);
    console.log(`🔗 Auth URL: ${authUrl}`);
    
    const params = await openOAuthPopup(authUrl, platform);
    
    // Validate state parameter
    if (!validateState(params.state, state)) {
      throw new Error('Invalid state parameter - possible CSRF attack');
    }
    
    console.log(`✅ OAuth successful for ${platform}:`, {
      code: params.code ? 'received' : 'missing',
      state: 'validated'
    });
    
    onSuccess({
      code: params.code,
      state: params.state,
      platform: platform
    });
    
  } catch (error) {
    console.error(`❌ OAuth failed for ${platform}:`, error);
    onError(error);
  }
};

/**
 * Get platform-specific OAuth scopes
 * @param {string} platform - Platform ID
 * @returns {Array} Array of scope strings
 */
export const getPlatformScopes = (platform) => {
  const config = OAUTH_CONFIG[platform];
  return config ? config.scope.split(',').map(s => s.trim()) : [];
};

/**
 * Check if OAuth is supported for a platform
 * @param {string} platform - Platform ID
 * @returns {boolean} Whether OAuth is supported
 */
export const isOAuthSupported = (platform) => {
  return platform in OAUTH_CONFIG && OAUTH_CONFIG[platform].clientId !== 'YOUR_' + platform.toUpperCase() + '_CLIENT_ID';
};

// Demo function for development
export const simulateOAuthFlow = async (platform, handle) => {
  console.log(`🎭 Simulating OAuth flow for ${platform} with handle: ${handle}`);
  
  // Simulate OAuth process delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Simulate different outcomes based on platform
  const outcomes = {
    instagram: { success: true, verified: true },
    youtube: { success: true, verified: true },
    twitter: { success: true, verified: false },
    tiktok: { success: false, error: 'OAuth not supported' },
    linkedin: { success: false, error: 'OAuth not supported' }
  };
  
  const outcome = outcomes[platform] || { success: false, error: 'Unknown platform' };
  
  if (!outcome.success) {
    throw new Error(outcome.error);
  }
  
  return {
    code: `mock_oauth_code_${Date.now()}`,
    state: `mock_state_${Date.now()}`,
    verified: outcome.verified
  };
};
