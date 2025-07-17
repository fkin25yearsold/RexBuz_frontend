import React, { useState } from "react";
import OTPInput from "./OTPInput";
import Button from "./Button";
import LoadingSpinner from "./LoadingSpinner";

const VerificationSection = ({
  type, // "email" or "phone"
  title,
  subtitle,
  destination, // masked email or phone
  onVerify,
  onResendOTP,
  isVerified = false,
  isLoading = false,
  error = "",
  disabled = false,
}) => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [resendLoading, setResendLoading] = useState(false);

  const isOtpComplete = otp.every((digit) => digit !== "");

  const handleVerify = async () => {
    if (isOtpComplete) {
      await onVerify(otp.join(""));
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    setOtp(new Array(6).fill(""));
    try {
      await onResendOTP();
    } finally {
      setResendLoading(false);
    }
  };

  const getIcon = () => {
    if (type === "email") {
      return (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 8l7.89 3.26a2 2 0 001.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      );
    } else {
      return (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
          />
        </svg>
      );
    }
  };

  return (
    <div
      className={`
      relative p-6 rounded-2xl border-2 transition-all duration-300
      ${
        isVerified
          ? "border-green-500 bg-green-50 dark:bg-green-900/20"
          : error
            ? "border-red-300 bg-red-50 dark:bg-red-900/20"
            : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
      }
    `}
    >
      {/* Verification Status Icon */}
      {isVerified && (
        <div className="absolute -top-3 -right-3 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
          <svg
            className="w-5 h-5 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center space-x-3 mb-4">
        <div
          className={`
          p-2 rounded-lg 
          ${
            isVerified
              ? "bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-400"
              : "bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-400"
          }
        `}
        >
          {getIcon()}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{subtitle}</p>
        </div>
      </div>

      {/* Destination */}
      <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Code sent to:
        </p>
        <p className="font-mono text-gray-900 dark:text-white">{destination}</p>
      </div>

      {/* OTP Input */}
      <div className="mb-6">
        <OTPInput
          value={otp}
          onChange={setOtp}
          disabled={disabled || isVerified}
          error={!!error}
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400 flex items-center">
            <svg
              className="w-4 h-4 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </p>
        </div>
      )}

      {/* Success Message */}
      {isVerified && (
        <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="text-sm text-green-600 dark:text-green-400 flex items-center">
            <svg
              className="w-4 h-4 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            {type === "email" ? "Email" : "Phone"} verified successfully!
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-3">
        {/* Verify Button */}
        <Button
          onClick={handleVerify}
          disabled={!isOtpComplete || isLoading || isVerified || disabled}
          loading={isLoading}
          className="w-full"
          variant={isVerified ? "secondary" : "primary"}
        >
          {isVerified
            ? `${type === "email" ? "Email" : "Phone"} Verified`
            : `Check ${type === "email" ? "Email" : "Phone"} OTP`}
        </Button>

        {/* Resend Button */}
        {!isVerified && (
          <button
            onClick={handleResend}
            disabled={resendLoading || disabled}
            className="w-full text-sm text-blue-600 dark:text-purple-400 hover:text-blue-700 dark:hover:text-purple-300 transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            {resendLoading ? (
              <>
                <LoadingSpinner size="small" />
                <span>Resending...</span>
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                <span>Resend {type === "email" ? "Email" : "Phone"} OTP</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default VerificationSection;
