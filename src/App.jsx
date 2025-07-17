import React, { useState } from "react";
import { ThemeProvider } from "./contexts/ThemeContext";
import SignupPage from "./components/pages/SignupPage";
import OtpVerificationPage from "./components/pages/OtpVerificationPage";
import "./App.css";

function App() {
  const [currentPage, setCurrentPage] = useState("signup");

  const navigate = (page) => {
    setCurrentPage(page);
  };

  // Add navigation to window for SignupPage to use
  React.useEffect(() => {
    window.navigateToOtp = () => navigate("otp-verification");
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case "otp-verification":
        return <OtpVerificationPage />;
      case "signup":
      default:
        return <SignupPage />;
    }
  };

  return (
    <ThemeProvider>
      <div className="App">{renderPage()}</div>
    </ThemeProvider>
  );
}

export default App;
