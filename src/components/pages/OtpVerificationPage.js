import React, { useState, useEffect } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { useUser } from "../../contexts/UserContext";
import Button from "../common/Button";
import VerificationSection from "../common/VerificationSection";
import { API_ENDPOINTS, apiRequest, safeJsonParse } from "../../config/api";

const OtpVerificationPage = () => {
  const { isDark } = useTheme();
  const { userData, maskEmail, maskPhone } = useUser();

  // Get user data from context with safety checks
  const userEmail = userData.email || "";
  const userPhone = userData.phone || "";
  const maskedEmail = maskEmail(userEmail);
  const maskedPhone = maskPhone(userPhone);

  // Redirect back to signup if no user data
  useEffect(() => {
    if (!userEmail || !userPhone) {
      console.warn("No user data found, redirecting to signup");
      window.location.hash = "signup";
    }
  }, [userEmail, userPhone]);

  // Verification states
  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [phoneLoading, setPhoneLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [isCompleting, setIsCompleting] = useState(false);

  // Check if both verifications are complete
  const isBothVerified = emailVerified && phoneVerified;

  // API call to request OTP
  const requestOTP = async (emailOrPhone, otpType) => {
    try {
      const response = await apiRequest(API_ENDPOINTS.AUTH.REQUEST_OTP, {
        method: "POST",
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({
          email_or_phone: emailOrPhone,
          otp_type: otpType,
        }),
      });

      const data = await safeJsonParse(response);

      if (!response.ok) {
        throw new Error(
          data?.detail ||
            data?.message ||
            `Failed to send ${otpType} OTP`,
        );
      }

      return { success: true, data };
    } catch (error) {
      console.error(`${otpType} OTP Request Error:`, error);
      throw error;
    }
  };

  // API call to verify email OTP
  const verifyEmailOTP = async (emailOTP) => {
    setEmailLoading(true);
    setEmailError("");

    try {
      const response = await apiRequest(API_ENDPOINTS.AUTH.VERIFY_OTP_EMAIL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "RexBuz-Frontend/1.0",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({
          email: userEmail,
          email_otp: emailOTP,
        }),
      });

      const data = await safeJsonParse(response);

      if (!response.ok) {
        throw new Error(
          data?.detail || data?.message || "Invalid email OTP",
        );
      }

      setEmailVerified(true);
      return { success: true, data };
    } catch (error) {
      console.error("Email OTP Verification Error:", error);
      setEmailError(error.message);
      throw error;
    } finally {
      setEmailLoading(false);
    }
  };

  // API call to verify phone OTP
  const verifyPhoneOTP = async (phoneOTP) => {
    setPhoneLoading(true);
    setPhoneError("");

    try {
      const response = await apiRequest(API_ENDPOINTS.AUTH.VERIFY_OTP_PHONE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "RexBuz-Frontend/1.0",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({
          phone_number: userPhone,
          phone_otp: phoneOTP,
        }),
      });

      const data = await safeJsonParse(response);

      if (!response.ok) {
        throw new Error(
          data?.detail || data?.message || "Invalid phone OTP",
        );
      }

      setPhoneVerified(true);
      return { success: true, data };
    } catch (error) {
      console.error("Phone OTP Verification Error:", error);
      setPhoneError(error.message);
      throw error;
    } finally {
      setPhoneLoading(false);
    }
  };

  // Handle resend email OTP
  const handleResendEmailOTP = async () => {
    try {
      await requestOTP(userEmail, "email");
    } catch (error) {
      setEmailError("Failed to resend email OTP. Please try again.");
    }
  };

  // Handle resend phone OTP
  const handleResendPhoneOTP = async () => {
    try {
      await requestOTP(userPhone, "phone");
    } catch (error) {
      setPhoneError("Failed to resend phone OTP. Please try again.");
    }
  };

  // Handle continue after both verifications
  const handleContinue = async () => {
    setIsCompleting(true);

    try {
      // Simulate completion process
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Navigate to dashboard or success page
      alert("Verification complete! Welcome to Influbazzar!");
      // window.location.href = "/dashboard";
    } catch (error) {
      alert("Something went wrong. Please try again.");
    } finally {
      setIsCompleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-light-bg to-gray-50 dark:from-dark-bg dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Verify Your Account
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Complete verification to secure your account
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div
              className={`
              w-4 h-4 rounded-full transition-colors duration-300
              ${emailVerified ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"}
            `}
            />
            <div
              className={`
              h-1 w-8 transition-colors duration-300
              ${emailVerified ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"}
            `}
            />
            <div
              className={`
              w-4 h-4 rounded-full transition-colors duration-300
              ${phoneVerified ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"}
            `}
            />
            <div
              className={`
              h-1 w-8 transition-colors duration-300
              ${isBothVerified ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"}
            `}
            />
            <div
              className={`
              w-4 h-4 rounded-full transition-colors duration-300
              ${isBothVerified ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"}
            `}
            />
          </div>
        </div>

        {/* Verification Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Email Verification */}
          <VerificationSection
            type="email"
            title="Email Verification"
            subtitle="Verify your email address"
            destination={maskedEmail}
            onVerify={verifyEmailOTP}
            onResendOTP={handleResendEmailOTP}
            isVerified={emailVerified}
            isLoading={emailLoading}
            error={emailError}
          />

          {/* Phone Verification */}
          <VerificationSection
            type="phone"
            title="Phone Verification"
            subtitle="Verify your phone number"
            destination={maskedPhone}
            onVerify={verifyPhoneOTP}
            onResendOTP={handleResendPhoneOTP}
            isVerified={phoneVerified}
            isLoading={phoneLoading}
            error={phoneError}
          />
        </div>

        {/* Continue Button */}
        <div className="text-center">
          <Button
            onClick={handleContinue}
            disabled={!isBothVerified || isCompleting}
            loading={isCompleting}
            className="px-12 py-4 text-lg font-semibold rounded-xl"
            variant="primary"
          >
            {isCompleting ? "Completing Verification..." : "Continue"}
          </Button>

          {!isBothVerified && (
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              Complete both email and phone verification to continue
            </p>
          )}
        </div>

        {/* Back to Signup */}
        <div className="text-center mt-8">
          <button
            onClick={() => window.history.back()}
            className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-purple-400 font-medium transition-colors duration-200"
          >
            ← Back to Signup
          </button>
        </div>
      </div>
    </div>
  );
};

export default OtpVerificationPage;
