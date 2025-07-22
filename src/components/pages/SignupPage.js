import React, { useState, useEffect } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { useUser } from "../../contexts/UserContext";
import Button from "../common/Button";
import ThemeToggle from "../ThemeToggle";
import PasswordStrengthMeter from "../common/PasswordStrengthMeter";
import { API_ENDPOINTS, apiRequest, safeJsonParse } from "../../config/api";

// Mock API - replace with actual API call
const mockCreatorsList = [];

const SignupPage = () => {
  const { isDark } = useTheme();
  const { updateUserData } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [apiError, setApiError] = useState("");
  const [selectedTab, setSelectedTab] = useState("creator");

  // OTP Generation States
  const [isGeneratingOTP, setIsGeneratingOTP] = useState(false);
  const [otpGenerationStep, setOtpGenerationStep] = useState("");
  const [otpGenerationError, setOtpGenerationError] = useState("");
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [phoneOtpSent, setPhoneOtpSent] = useState(false);

  // Form data state
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    dateOfBirth: "",
    email: "",
    password: "",
    repeatPassword: "",
    termsAccepted: false,
  });

  // Field-level errors
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Real-time validation
  const validateField = (name, value) => {
    switch (name) {
      case "fullName":
        if (!value.trim()) return "Full name is required";
        if (value.length < 2) return "Full name must be at least 2 characters";
        if (value.length > 100)
          return "Full name must be less than 100 characters";
        if (!/^[a-zA-Z\s\-\.]+$/.test(value))
          return "Full name can only contain letters, spaces, hyphens, and dots";
        return "";

      case "phoneNumber":
        if (!value.trim()) return "Phone number is required";
        // Remove all non-digit characters for validation
        const digitsOnly = value.replace(/\D/g, "");
        if (digitsOnly.length !== 10)
          return "Phone number must be exactly 10 digits";
        if (!/^[6-9]\d{9}$/.test(digitsOnly))
          return "Please enter a valid Indian mobile number";
        return "";

      case "dateOfBirth":
        if (!value) return "Date of birth is required";
        const birthDate = new Date(value);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (
          monthDiff < 0 ||
          (monthDiff === 0 && today.getDate() < birthDate.getDate())
        ) {
          age--;
        }

        if (age < 18) return "You must be at least 18 years old";
        if (birthDate > today) return "Date of birth cannot be in the future";
        return "";

      case "email":
        if (!value.trim()) return "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          return "Please enter a valid email address";
        return "";

      case "password":
        if (!value) return "Password is required";
        if (value.length < 8) return "Password must be at least 8 characters";
        if (!/(?=.*[a-z])/.test(value))
          return "Password must contain at least one lowercase letter";
        if (!/(?=.*[A-Z])/.test(value))
          return "Password must contain at least one uppercase letter";
        if (!/(?=.*\d)/.test(value))
          return "Password must contain at least one number";
        if (!/(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(value))
          return "Password must contain at least one special character";
        return "";

      case "repeatPassword":
        if (!value) return "Please repeat your password";
        if (value !== formData.password) return "Passwords do not match";
        return "";

      case "termsAccepted":
        if (!value) return "You must accept the Terms and Conditions";
        return "";

      default:
        return "";
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === "checkbox" ? checked : value;

    // Format phone number with spaces
    let formattedValue = fieldValue;
    if (name === "phoneNumber" && typeof fieldValue === "string") {
      const digitsOnly = fieldValue.replace(/\D/g, "");
      if (digitsOnly.length <= 10) {
        formattedValue = digitsOnly.replace(/(\d{5})(\d{5})/, "$1 $2").trim();
      } else {
        return; // Don't allow more than 10 digits
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));

    // Immediate validation for critical fields or if field was already touched
    if (touched[name] || ["email", "phoneNumber"].includes(name)) {
      const error = validateField(name, fieldValue);
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }));

      // Mark field as touched for immediate feedback
      if (!touched[name]) {
        setTouched((prev) => ({
          ...prev,
          [name]: true,
        }));
      }
    }

    // Special case: re-validate repeatPassword when password changes
    if (name === "password" && touched.repeatPassword) {
      const repeatPasswordError = validateField(
        "repeatPassword",
        formData.repeatPassword,
      );
      setErrors((prev) => ({
        ...prev,
        repeatPassword: repeatPasswordError,
      }));
    }
  };

  // Handle field blur (mark as touched and validate)
  const handleFieldBlur = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === "checkbox" ? checked : value;

    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    const error = validateField(name, fieldValue);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  // Check if form is valid
  const isFormValid = () => {
    // Check for any current errors in state
    const hasCurrentErrors = Object.values(errors).some(
      (error) => error !== "",
    );
    if (hasCurrentErrors) return false;

    // Re-validate all fields to be sure
    const allFieldsValid = Object.keys(formData).every((key) => {
      const error = validateField(key, formData[key]);
      return !error;
    });

    const allRequiredFieldsFilled =
      formData.fullName.trim() &&
      formData.phoneNumber.trim() &&
      formData.dateOfBirth &&
      formData.email.trim() &&
      formData.password &&
      formData.repeatPassword &&
      formData.termsAccepted;

    return allFieldsValid && allRequiredFieldsFilled;
  };

  // API call to signup
  const signupAPI = async (userData) => {
    try {
      const apiData = {
        email: userData.email,
        phone_number: `+91${userData.phoneNumber.replace(/\s/g, "")}`, // Format for API
        password: userData.password,
        full_name: userData.fullName,
        date_of_birth: userData.dateOfBirth,
        role: selectedTab,
        terms_accepted: userData.termsAccepted,
        is_above_18: true,
      };

      const response = await apiRequest(API_ENDPOINTS.AUTH.SIGNUP, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify(apiData),
      });

      const data = await safeJsonParse(response);

      if (!response.ok) {
        // Handle specific API errors
        if (
          response.status === 400 &&
          data?.detail?.includes("Email already registered")
        ) {
          throw new Error(
            "This email is already registered. Please try signing in instead.",
          );
        }
        if (
          response.status === 400 &&
          data.detail?.includes("Phone number already registered")
        ) {
          throw new Error(
            "This phone number is already registered. Please try a different number.",
          );
        }
        if (response.status === 429) {
          throw new Error("Too many signup attempts. Please try again later.");
        }
        if (response.status === 422) {
          throw new Error("Please check your information and try again.");
        }
        throw new Error(
          data.detail || data.message || "Signup failed. Please try again.",
        );
      }

      return { success: true, data };
    } catch (error) {
      if (error.name === "TypeError" || error.message.includes("fetch")) {
        throw new Error(
          "Network error. Please check your connection and try again.",
        );
      }
      throw error;
    }
  };

  // API call to request OTP
  const requestOTP = async (emailOrPhone, otpType) => {
    try {
      const response = await apiRequest(API_ENDPOINTS.AUTH.REQUEST_OTP, {
        method: "POST",
        headers: {
          Accept: "application/json",
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
          data?.error?.message ||
            data?.detail ||
            `Failed to send ${otpType} OTP. Please try again.`,
        );
      }

      return { success: true, data };
    } catch (error) {
      console.error(`${otpType} OTP Request Error:`, error);
      if (error.name === "TypeError" || error.message.includes("fetch")) {
        throw new Error(
          `Network error while sending ${otpType} OTP. Please check your connection.`,
        );
      }
      throw error;
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark all fields as touched
    const allFields = Object.keys(formData);
    setTouched(Object.fromEntries(allFields.map((field) => [field, true])));

    // Validate all fields
    const newErrors = {};
    allFields.forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) newErrors[field] = error;
    });

    setErrors(newErrors);

    // If there are errors, don't submit and scroll to first error
    if (Object.keys(newErrors).length > 0) {
      console.log("Form validation failed. Errors:", newErrors);

      // Focus on first field with error
      const firstErrorField = Object.keys(newErrors)[0];
      const errorElement = document.getElementById(firstErrorField);
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
        errorElement.focus();
      }

      // Show validation error message
      setApiError("Please fix the errors below before continuing.");
      return;
    }

    setIsSubmitting(true);
    setApiError("");

    try {
      if (selectedTab === "creator") {
        // Only creators get full API integration
        const result = await signupAPI(formData);

        if (result.success) {
          // Store user data in context for OTP verification
          const userEmail = formData.email;
          const userPhone = `+91${formData.phoneNumber.replace(/\s/g, "")}`;

          updateUserData({
            email: userEmail,
            phone: userPhone,
            fullName: formData.fullName,
            role: selectedTab,
          });

          // Also add to mock list for local storage
          mockCreatorsList.push({
            fullName: formData.fullName,
            phone: formData.phoneNumber.replace(/\s/g, ""),
            dob: formData.dateOfBirth,
            email: formData.email,
            password: formData.password,
            verified: false,
          });

          // Start OTP generation process
          setIsGeneratingOTP(true);
          setOtpGenerationError("");
          setEmailOtpSent(false);
          setPhoneOtpSent(false);

          let emailSuccess = false;
          let phoneSuccess = false;

          // Request Email OTP
          try {
            setOtpGenerationStep("Sending email verification code...");
            await requestOTP(userEmail, "email");
            setEmailOtpSent(true);
            emailSuccess = true;
          } catch (emailError) {
            console.error("Email OTP failed:", emailError);
            setOtpGenerationError(
              (prev) =>
                prev + `Email verification failed: ${emailError.message}. `,
            );
          }

          // Request Phone OTP
          try {
            setOtpGenerationStep("Sending phone verification code...");
            await requestOTP(userPhone, "phone");
            setPhoneOtpSent(true);
            phoneSuccess = true;
          } catch (phoneError) {
            console.error("Phone OTP failed:", phoneError);
            setOtpGenerationError(
              (prev) =>
                prev + `Phone verification failed: ${phoneError.message}. `,
            );
          }

          setIsGeneratingOTP(false);

          // Check if at least one OTP was sent successfully
          if (emailSuccess || phoneSuccess) {
            setOtpGenerationStep("Verification codes sent successfully!");

            // Show success message
            setShowSuccessMessage(true);

            // Redirect after delay
            setTimeout(() => {
              if (window.navigateToOtp) {
                window.navigateToOtp();
              } else {
                console.log("Redirecting to /otp-verification");
              }
            }, 2000);
          } else {
            // Both OTP requests failed
            setApiError(
              "⚠️ Account created but verification codes failed to send. Please try requesting verification codes again or contact support.",
            );
          }
        }
      } else {
        // For brands and agencies, show coming soon message
        setTimeout(() => {
          setApiError(
            `${selectedTab.charAt(0).toUpperCase() + selectedTab.slice(1)} registration will be available soon! Please check back later.`,
          );
        }, 1000);
      }
    } catch (error) {
      setApiError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success message component
  const SuccessMessage = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-600 dark:text-green-400"
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
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Account Created Successfully!
          </h3>
          <div className="mb-4">
            <p className="text-gray-600 dark:text-gray-300 mb-2">
              Verification codes status:
            </p>
            <div className="space-y-1 text-sm">
              <div className="flex items-center">
                {emailOtpSent ? (
                  <svg
                    className="w-4 h-4 text-green-500 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-4 h-4 text-red-500 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                <span
                  className={
                    emailOtpSent
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }
                >
                  Email verification code {emailOtpSent ? "sent" : "failed"}
                </span>
              </div>
              <div className="flex items-center">
                {phoneOtpSent ? (
                  <svg
                    className="w-4 h-4 text-green-500 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-4 h-4 text-red-500 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                <span
                  className={
                    phoneOtpSent
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }
                >
                  Phone verification code {phoneOtpSent ? "sent" : "failed"}
                </span>
              </div>
            </div>
          </div>
          <div className="animate-pulse text-blue-600 dark:text-blue-400">
            Redirecting to verification page...
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-light-bg to-gray-50 dark:from-dark-bg dark:to-gray-900 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {showSuccessMessage && <SuccessMessage />}

      <div className="w-full max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4 sm:mb-6">
            Join Influbazzar
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg px-4">
            Connect, Collaborate, and Grow with Us
          </p>
        </div>

        {/* Main Form Card */}
        <div className="bg-white dark:bg-dark-card rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl p-4 sm:p-6 md:p-8 lg:p-12">
          {/* Error Messages Display */}
          {(apiError ||
            Object.values(errors).some((error) => error !== "")) && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
              <div className="flex items-start">
                <svg
                  className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <div className="flex-1">
                  {apiError && (
                    <p className="text-red-800 dark:text-red-200 font-medium mb-2">
                      {apiError}
                    </p>
                  )}
                  {Object.values(errors).some((error) => error !== "") && (
                    <div>
                      <p className="text-red-800 dark:text-red-200 font-medium mb-2">
                        Please fix the following errors:
                      </p>
                      <ul className="list-disc list-inside text-red-700 dark:text-red-300 text-sm space-y-1">
                        {Object.entries(errors).map(([field, error]) =>
                          error ? (
                            <li key={field}>
                              <span className="font-medium">
                                {field === "fullName"
                                  ? "Full Name"
                                  : field === "phoneNumber"
                                    ? "Phone Number"
                                    : field === "dateOfBirth"
                                      ? "Date of Birth"
                                      : field === "repeatPassword"
                                        ? "Repeat Password"
                                        : field === "termsAccepted"
                                          ? "Terms & Conditions"
                                          : field.charAt(0).toUpperCase() +
                                            field.slice(1)}
                                :
                              </span>{" "}
                              {error}
                            </li>
                          ) : null,
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* OTP Generation Progress */}
          {isGeneratingOTP && (
            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
              <div className="flex items-center">
                <div className="flex-shrink-0 mr-3">
                  <svg
                    className="animate-spin w-5 h-5 text-blue-500"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-blue-800 dark:text-blue-200 font-medium">
                    Generating Verification Codes
                  </p>
                  <p className="text-blue-700 dark:text-blue-300 text-sm">
                    {otpGenerationStep}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* OTP Generation Error with Retry */}
          {otpGenerationError && !isGeneratingOTP && (
            <div className="mb-6 p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl">
              <div className="flex items-start">
                <svg
                  className="w-5 h-5 text-orange-500 mr-3 mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <div className="flex-1">
                  <p className="text-orange-800 dark:text-orange-200 font-medium mb-2">
                    Verification Code Generation Issues
                  </p>
                  <p className="text-orange-700 dark:text-orange-300 text-sm mb-3">
                    {otpGenerationError}
                  </p>
                  <button
                    onClick={async () => {
                      setOtpGenerationError("");
                      const userEmail = formData.email;
                      const userPhone = `+91${formData.phoneNumber.replace(/\s/g, "")}`;

                      setIsGeneratingOTP(true);

                      // Retry OTP generation
                      try {
                        if (!emailOtpSent) {
                          setOtpGenerationStep(
                            "Retrying email verification code...",
                          );
                          await requestOTP(userEmail, "email");
                          setEmailOtpSent(true);
                        }

                        if (!phoneOtpSent) {
                          setOtpGenerationStep(
                            "Retrying phone verification code...",
                          );
                          await requestOTP(userPhone, "phone");
                          setPhoneOtpSent(true);
                        }

                        setOtpGenerationStep(
                          "Verification codes sent successfully!",
                        );

                        // Navigate to OTP page if at least one succeeded
                        if (emailOtpSent || phoneOtpSent) {
                          setTimeout(() => {
                            if (window.navigateToOtp) {
                              window.navigateToOtp();
                            }
                          }, 1500);
                        }
                      } catch (error) {
                        setOtpGenerationError(`Retry failed: ${error.message}`);
                      } finally {
                        setIsGeneratingOTP(false);
                      }
                    }}
                    disabled={isGeneratingOTP}
                    className="text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 font-medium text-sm underline transition-colors duration-200"
                  >
                    {isGeneratingOTP ? "Retrying..." : "Try Again"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Role Selection Tabs */}
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
              {[
                { id: "creator", label: "Creator", icon: "🎨" },
                { id: "brand", label: "Brand", icon: "🏢" },
                { id: "agency", label: "Agency", icon: "🤝" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedTab(tab.id)}
                  className={`flex-1 flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 sm:py-3 rounded-lg font-medium transition-all duration-200 text-sm sm:text-base ${
                    selectedTab === tab.id
                      ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-purple-400 shadow-sm"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                  }`}
                >
                  <span className="text-base sm:text-lg">{tab.icon}</span>
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden text-xs">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Tab Content Description */}
            <div className="mt-3 sm:mt-4 text-center px-2">
              {selectedTab === "creator" && (
                <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                  Join as a content creator and start monetizing your audience
                </p>
              )}
              {selectedTab === "brand" && (
                <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                  Connect with creators to amplify your brand's reach
                </p>
              )}
              {selectedTab === "agency" && (
                <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                  Manage influencer campaigns for multiple clients
                </p>
              )}
            </div>
          </div>

          {/* Sample Form Notice for Brand/Agency */}
          {selectedTab !== "creator" && (
            <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <p className="text-yellow-800 dark:text-yellow-200 font-medium">
                    Preview Mode
                  </p>
                  <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                    {selectedTab.charAt(0).toUpperCase() + selectedTab.slice(1)}{" "}
                    registration is coming soon. This is a preview of the form.
                  </p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Two-column layout on desktop, stacked on mobile */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {/* Full Name */}
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  {selectedTab === "creator"
                    ? "Creator Name"
                    : selectedTab === "brand"
                      ? "Contact Person Name"
                      : "Representative Name"}{" "}
                  *
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  onBlur={handleFieldBlur}
                  className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl border-2 transition-all duration-200 focus:ring-2 focus:border-transparent text-sm sm:text-base ${
                    errors.fullName && touched.fullName
                      ? "border-red-500 focus:ring-red-500 bg-red-50 dark:bg-red-900/10"
                      : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-purple-500 bg-white dark:bg-gray-800"
                  } text-gray-900 dark:text-white`}
                  placeholder={
                    selectedTab === "creator"
                      ? "Enter your creator name"
                      : selectedTab === "brand"
                        ? "Enter contact person name"
                        : "Enter representative name"
                  }
                />
                {errors.fullName && touched.fullName && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                    {errors.fullName}
                  </p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <label
                  htmlFor="phoneNumber"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Phone Number *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-2 sm:pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
                      +91
                    </span>
                  </div>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    onBlur={handleFieldBlur}
                    className={`w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2 sm:py-3 rounded-lg sm:rounded-xl border-2 transition-all duration-200 focus:ring-2 focus:border-transparent ${
                      errors.phoneNumber && touched.phoneNumber
                        ? "border-red-500 focus:ring-red-500 bg-red-50 dark:bg-red-900/10"
                        : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-purple-500 bg-white dark:bg-gray-800"
                    } text-gray-900 dark:text-white`}
                    placeholder="98765 43210"
                  />
                </div>
                {errors.phoneNumber && touched.phoneNumber && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                    {errors.phoneNumber}
                  </p>
                )}
              </div>

              {/* Date of Birth */}
              <div>
                <label
                  htmlFor="dateOfBirth"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Date of Birth *
                </label>
                <input
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  onBlur={handleFieldBlur}
                  max={
                    new Date(
                      new Date().setFullYear(new Date().getFullYear() - 18),
                    )
                      .toISOString()
                      .split("T")[0]
                  }
                  className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl border text-sm sm:text-base ${
                    errors.dateOfBirth && touched.dateOfBirth
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-purple-500"
                  } bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:border-transparent transition-all duration-200`}
                />
                {errors.dateOfBirth && touched.dateOfBirth && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                    {errors.dateOfBirth}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  onBlur={handleFieldBlur}
                  className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl border text-sm sm:text-base ${
                    errors.email && touched.email
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-purple-500"
                  } bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:border-transparent transition-all duration-200`}
                  placeholder="your.email@example.com"
                />
                {errors.email && touched.email && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Password *
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  onBlur={handleFieldBlur}
                  className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl border text-sm sm:text-base ${
                    errors.password && touched.password
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-purple-500"
                  } bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:border-transparent transition-all duration-200`}
                  placeholder="Create a strong password"
                />
                {errors.password && touched.password && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                    {errors.password}
                  </p>
                )}
                <PasswordStrengthMeter password={formData.password} />
              </div>

              {/* Repeat Password */}
              <div>
                <label
                  htmlFor="repeatPassword"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Repeat Password *
                </label>
                <input
                  type="password"
                  id="repeatPassword"
                  name="repeatPassword"
                  value={formData.repeatPassword}
                  onChange={handleInputChange}
                  onBlur={handleFieldBlur}
                  className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl border text-sm sm:text-base ${
                    errors.repeatPassword && touched.repeatPassword
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-purple-500"
                  } bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:border-transparent transition-all duration-200`}
                  placeholder="Repeat your password"
                />
                {errors.repeatPassword && touched.repeatPassword && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                    {errors.repeatPassword}
                  </p>
                )}
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="termsAccepted"
                name="termsAccepted"
                checked={formData.termsAccepted}
                onChange={handleInputChange}
                onBlur={handleFieldBlur}
                className="mt-1 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-purple-500 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label
                htmlFor="termsAccepted"
                className="text-sm text-gray-700 dark:text-gray-300"
              >
                I agree to the{" "}
                <a
                  href="#"
                  className="text-blue-600 dark:text-purple-400 hover:underline"
                >
                  Terms and Conditions
                </a>{" "}
                and{" "}
                <a
                  href="#"
                  className="text-blue-600 dark:text-purple-400 hover:underline"
                >
                  Privacy Policy
                </a>
                *
              </label>
            </div>
            {errors.termsAccepted && touched.termsAccepted && (
              <p className="text-sm text-red-600 dark:text-red-400">
                {errors.termsAccepted}
              </p>
            )}

            {/* Submit Button */}
            <div className="pt-4 sm:pt-6">
              <Button
                type="submit"
                disabled={!isFormValid() || isSubmitting || isGeneratingOTP}
                loading={isSubmitting || isGeneratingOTP}
                className="w-full py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-lg sm:rounded-xl"
              >
                {isSubmitting
                  ? "Creating Account..."
                  : isGeneratingOTP
                    ? "Sending Verification Codes..."
                    : selectedTab === "creator"
                      ? "Create Creator Account"
                      : selectedTab === "brand"
                        ? "Create Brand Account"
                        : "Create Agency Account"}
              </Button>
            </div>

            {/* Sign In Link */}
            <div className="text-center pt-4">
              <p className="text-gray-600 dark:text-gray-400">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() =>
                    window.navigateToLogin && window.navigateToLogin()
                  }
                  className="text-blue-600 dark:text-purple-400 hover:underline font-medium"
                >
                  Sign In
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
