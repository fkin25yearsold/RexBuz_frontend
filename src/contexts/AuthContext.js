import React, { createContext, useContext, useState, useEffect } from "react";
import { tokenManager } from "../config/api";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is authenticated on app load
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    try {
      const token = tokenManager.getAccessToken();
      const storedUser = localStorage.getItem("user");

      if (token && tokenManager.isTokenValid(token) && storedUser) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        // Clear invalid data
        logout(false); // Don't redirect on initial check
      }
    } catch (error) {
      console.error("Auth check error:", error);
      logout(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = (userData, tokens) => {
    try {
      // Store tokens
      if (tokens.access_token) {
        tokenManager.setTokens(tokens.access_token, tokens.refresh_token);
      }

      // Store user data
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      setIsAuthenticated(true);

      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const logout = (redirect = true) => {
    try {
      // Clear tokens and user data
      tokenManager.clearTokens();
      setUser(null);
      setIsAuthenticated(false);

      // Redirect to home page
      if (redirect) {
        window.location.hash = "#home";
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const updateUser = (updatedUserData) => {
    try {
      const newUserData = { ...user, ...updatedUserData };
      localStorage.setItem("user", JSON.stringify(newUserData));
      setUser(newUserData);
    } catch (error) {
      console.error("Update user error:", error);
    }
  };

  // Check if user needs verification
  const needsVerification = () => {
    return user && (!user.is_email_verified || !user.is_phone_verified);
  };

  // Check if user has completed onboarding
  const needsOnboarding = () => {
    return user && !user.has_completed_onboarding;
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    updateUser,
    checkAuthStatus,
    needsVerification,
    needsOnboarding,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
