import React, { useState, useEffect } from "react";
import { ThemeProvider } from "./contexts/ThemeContext";
import { UserProvider } from "./contexts/UserContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Navbar from "./components/navigation/Navbar";
import OnboardingNavbar from "./components/navigation/OnboardingNavbar";

import PricingPage from "./components/pages/PricingPage";
import AboutPage from "./components/pages/AboutPage";
import ContactPage from "./components/pages/ContactPage";
import TestimonialsPage from "./components/pages/TestimonialsPage";
import CaseStudiesPage from "./components/pages/CaseStudiesPage";
import SignupPage from "./components/pages/SignupPage";
import LoginPage from "./components/pages/LoginPage";
import LoginSuccessPage from "./components/pages/LoginSuccessPage";
import OtpVerificationPage from "./components/pages/OtpVerificationPage";
import CreatorOnboardingPage from "./components/pages/CreatorOnboardingPage";
import CreatorDashboard from "./components/pages/CreatorDashboard";
import OnboardingDemo from "./components/pages/OnboardingDemo";
import HeroSection from "./components/sections/HeroSection";
import StatsSection from "./components/sections/StatsSection";
import HowItWorksSection from "./components/sections/HowItWorksSection";
import TrendingCampaignsSection from "./components/sections/TrendingCampaignsSection";
import EarningsCalculatorSection from "./components/sections/EarningsCalculatorSection";
import CreatorGallerySection from "./components/sections/CreatorGallerySection";
import BrandGallerySection from "./components/sections/BrandGallerySection";
import CaseStudySection from "./components/sections/CaseStudySection";
import CampaignFunnelSection from "./components/sections/CampaignFunnelSection";
import TestimonialsSection from "./components/sections/TestimonialsSection";
import FooterSection from "./components/sections/FooterSection";
import "./App.css";

// Inner component that has access to AuthContext
const AppContent = () => {
  const [currentPage, setCurrentPage] = useState("home");
  const { isAuthenticated, needsOnboarding, isLoading } = useAuth();

  useEffect(() => {
    // Simple routing based on URL hash
    const handleHashChange = () => {
      const hash = window.location.hash.substring(1);
      setCurrentPage(hash || "home");
    };

    window.addEventListener("hashchange", handleHashChange);
    handleHashChange(); // Initial load

    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Add navigation helpers for signup flow
  useEffect(() => {
    window.navigateToSignup = () => {
      window.location.hash = "signup";
      setCurrentPage("signup");
    };

    window.navigateToOtp = () => {
      window.location.hash = "otp-verification";
      setCurrentPage("otp-verification");
    };

    window.navigateToLogin = () => {
      window.location.hash = "login";
      setCurrentPage("login");
    };

    window.navigateToLoginSuccess = () => {
      window.location.hash = "login-success";
      setCurrentPage("login-success");
    };

    window.navigateToCreatorOnboarding = () => {
      window.location.hash = "creator-onboarding";
      setCurrentPage("creator-onboarding");
    };

    window.navigateToOnboardingDemo = () => {
      window.location.hash = "onboarding-demo";
      setCurrentPage("onboarding-demo");
    };
  }, []);

  // Determine if user is in onboarding process
  const isInOnboardingProcess = () => {
    return isAuthenticated && needsOnboarding && needsOnboarding();
  };

  // Auto-redirect to onboarding if user needs it and isn't already there
  useEffect(() => {
    if (isInOnboardingProcess() && currentPage !== "creator-onboarding") {
      // Don't redirect from certain pages like login, signup, etc.
      const excludedPages = ["login", "signup", "otp-verification"];
      if (!excludedPages.includes(currentPage)) {
        window.location.hash = "creator-onboarding";
        setCurrentPage("creator-onboarding");
      }
    }
  }, [isAuthenticated, currentPage]);

  // Determine if we should show the continue form button
  const shouldShowContinueFormButton = () => {
    return isInOnboardingProcess() && currentPage !== "creator-onboarding";
  };

  // Handle continue form button click
  const handleContinueForm = () => {
    window.location.hash = "creator-onboarding";
    setCurrentPage("creator-onboarding");
  };

  // Render appropriate navbar
  const renderNavbar = () => {
    // Don't render navbar while auth is loading
    if (isLoading) {
      return null;
    }

    const inOnboarding = isInOnboardingProcess();

    if (inOnboarding) {
      return (
        <OnboardingNavbar
          showContinueFormButton={shouldShowContinueFormButton()}
          onContinueForm={handleContinueForm}
        />
      );
    }
    return <Navbar />;
  };

  const renderPage = () => {
    switch (currentPage) {
      case "pricing":
        return <PricingPage />;
      case "about":
        return <AboutPage />;
      case "contact":
        return <ContactPage />;
      case "testimonials":
        return <TestimonialsPage />;
      case "case-studies":
        return <CaseStudiesPage />;
      case "signup":
        return <SignupPage />;
      case "login":
        return <LoginPage />;
      case "login-success":
        return <LoginSuccessPage />;
      case "otp-verification":
        return <OtpVerificationPage />;
      case "creator-onboarding":
        return <CreatorOnboardingPage />;
      case "dashboard":
        return <CreatorDashboard />;
      case "onboarding-demo":
        return <OnboardingDemo />;
      default:
        return (
          <>
            <HeroSection />
            <StatsSection />
            <HowItWorksSection />
            <TrendingCampaignsSection />
            <EarningsCalculatorSection />
            <CreatorGallerySection />
            <BrandGallerySection />
            <CaseStudySection />
            <CampaignFunnelSection />
            <TestimonialsSection />
            <FooterSection />
          </>
        );
    }
  };

  // Show loading spinner while auth is being checked
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-dark-bg transition-colors duration-300 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg transition-colors duration-300">
      {renderNavbar()}
      {renderPage()}
    </div>
  );
};

// Main App component with providers
function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <UserProvider>
          <AppContent />
        </UserProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
