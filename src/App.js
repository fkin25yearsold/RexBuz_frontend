import React, { useState, useEffect } from "react";
import { ThemeProvider } from "./contexts/ThemeContext";
import { UserProvider } from "./contexts/UserContext";
import { AuthProvider } from "./contexts/AuthContext";
import Navbar from "./components/navigation/Navbar";
import PricingPage from "./components/pages/PricingPage";
import AboutPage from "./components/pages/AboutPage";
import ContactPage from "./components/pages/ContactPage";
import SignupPage from "./components/pages/SignupPage";
import LoginPage from "./components/pages/LoginPage";
import LoginSuccessPage from "./components/pages/LoginSuccessPage";
import OtpVerificationPage from "./components/pages/OtpVerificationPage";
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

function App() {
  const [currentPage, setCurrentPage] = useState("home");

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
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case "pricing":
        return <PricingPage />;
      case "about":
        return <AboutPage />;
      case "contact":
        return <ContactPage />;
      case "signup":
        return <SignupPage />;
      case "login":
        return <LoginPage />;
      case "login-success":
        return <LoginSuccessPage />;
      case "otp-verification":
        return <OtpVerificationPage />;
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

  return (
    <ThemeProvider>
      <AuthProvider>
        <UserProvider>
          <div className="min-h-screen bg-white dark:bg-dark-bg transition-colors duration-300">
            <Navbar />
            {renderPage()}
          </div>
        </UserProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
