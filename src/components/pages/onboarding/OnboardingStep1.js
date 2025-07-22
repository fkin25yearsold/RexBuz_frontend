import React, { useState, useEffect, useCallback } from "react";
import { useTheme } from "../../../contexts/ThemeContext";
import FileUpload from "../../common/FileUpload";
import Button from "../../common/Button";
import useCreatorOnboarding from "../../../hooks/useCreatorOnboarding";
import CorsDebugger from "../../debug/CorsDebugger";

const OnboardingStep1 = ({
  onComplete,
  onBack,
  onNext,
  existingData,
  isCompleted,
  canProceed,
}) => {
  const { isDark } = useTheme();
  const {
    checkDisplayName,
    submitStep1,
    loading,
    checkingDisplayName,
  } = useCreatorOnboarding();

  const [formData, setFormData] = useState({
    display_name: "",
    gender: "",
    country: "",
    city: "",
    languages: [],
    timezone: "",
    bio: "",
    profile_picture: null,
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [displayNameStatus, setDisplayNameStatus] = useState(null);
  const [displayNameCheckTimeout, setDisplayNameCheckTimeout] = useState(null);

  // Reference data
  const [countries, setCountries] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [timezones, setTimezones] = useState([]);

  // Load existing data if available
  useEffect(() => {
    if (existingData) {
      setFormData((prev) => ({ ...prev, ...existingData }));
    }
  }, [existingData]);

  // Load static reference data
  useEffect(() => {
    // Static countries data
    const staticCountries = [
      { code: "IN", name: "India" },
      { code: "US", name: "United States" },
      { code: "GB", name: "United Kingdom" },
      { code: "CA", name: "Canada" },
      { code: "AU", name: "Australia" },
      { code: "DE", name: "Germany" },
      { code: "FR", name: "France" },
      { code: "SG", name: "Singapore" },
      { code: "AE", name: "United Arab Emirates" },
      { code: "JP", name: "Japan" },
    ];

    // Static languages data
    const staticLanguages = [
      { code: "en", name: "English" },
      { code: "hi", name: "Hindi" },
      { code: "te", name: "Telugu" },
      { code: "ta", name: "Tamil" },
      { code: "bn", name: "Bengali" },
      { code: "mr", name: "Marathi" },
      { code: "gu", name: "Gujarati" },
      { code: "ur", name: "Urdu" },
      { code: "kn", name: "Kannada" },
      { code: "ml", name: "Malayalam" },
      { code: "pa", name: "Punjabi" },
      { code: "or", name: "Odia" },
      { code: "as", name: "Assamese" },
      { code: "ne", name: "Nepali" },
      { code: "es", name: "Spanish" },
      { code: "fr", name: "French" },
      { code: "de", name: "German" },
      { code: "it", name: "Italian" },
      { code: "pt", name: "Portuguese" },
      { code: "ru", name: "Russian" },
      { code: "ja", name: "Japanese" },
      { code: "ko", name: "Korean" },
      { code: "zh", name: "Chinese" },
      { code: "ar", name: "Arabic" },
    ];

    // Static timezones data
    const staticTimezones = [
      {
        value: "Asia/Kolkata",
        label: "(UTC+05:30) Mumbai, Kolkata, Chennai, New Delhi",
        offset: "+05:30",
      },
      {
        value: "America/New_York",
        label: "(UTC-05:00) Eastern Time (US & Canada)",
        offset: "-05:00",
      },
      {
        value: "America/Los_Angeles",
        label: "(UTC-08:00) Pacific Time (US & Canada)",
        offset: "-08:00",
      },
      {
        value: "Europe/London",
        label: "(UTC+00:00) Greenwich Mean Time",
        offset: "+00:00",
      },
      {
        value: "Europe/Berlin",
        label: "(UTC+01:00) Central European Time",
        offset: "+01:00",
      },
      {
        value: "Asia/Tokyo",
        label: "(UTC+09:00) Tokyo, Osaka, Sapporo",
        offset: "+09:00",
      },
      {
        value: "Asia/Shanghai",
        label: "(UTC+08:00) Beijing, Chongqing, Hong Kong",
        offset: "+08:00",
      },
      {
        value: "Asia/Dubai",
        label: "(UTC+04:00) Abu Dhabi, Muscat",
        offset: "+04:00",
      },
      {
        value: "Australia/Sydney",
        label: "(UTC+10:00) Canberra, Melbourne, Sydney",
        offset: "+10:00",
      },
      {
        value: "America/Chicago",
        label: "(UTC-06:00) Central Time (US & Canada)",
        offset: "-06:00",
      },
    ];

    setCountries(staticCountries);
    setLanguages(staticLanguages);
    setTimezones(staticTimezones);
  }, []); // Empty dependency array since it's static data

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (displayNameCheckTimeout) {
        clearTimeout(displayNameCheckTimeout);
      }
    };
  }, [displayNameCheckTimeout]);

  // Debounced display name check
  const checkDisplayNameAvailability = useCallback(
    async (displayName) => {
      if (!displayName || displayName.length < 2) {
        setDisplayNameStatus(null);
        return;
      }

      // Validate format before checking
      if (!/^[a-zA-Z0-9_\s\-\.]+$/.test(displayName)) {
        setDisplayNameStatus({
          type: "error",
          message:
            "Display name can only contain letters, numbers, spaces, underscores, hyphens, and dots",
        });
        return;
      }

      setDisplayNameStatus({
        type: "checking",
        message: "Checking availability...",
      });

      try {
        const result = await checkDisplayName(displayName);
        if (result.success) {
          if (result.data.available) {
            setDisplayNameStatus({
              type: "available",
              message: "✓ Display name is available!",
            });
          } else {
            setDisplayNameStatus({
              type: "taken",
              message: "Display name is already taken",
              suggestions: result.data.suggested_alternatives || [],
            });
          }
        }
      } catch (error) {
        setDisplayNameStatus({
          type: "error",
          message: error.message || "Could not check availability",
        });
      }
    },
    [checkDisplayName],
  );

  // Handle display name change with debouncing
  const handleDisplayNameChange = (value) => {
    setFormData((prev) => ({ ...prev, display_name: value }));

    // Clear previous timeout
    if (displayNameCheckTimeout) {
      clearTimeout(displayNameCheckTimeout);
    }

    // Set new timeout for checking
    const timeout = setTimeout(() => {
      checkDisplayNameAvailability(value);
    }, 500);

    setDisplayNameCheckTimeout(timeout);
  };

  // Form validation
  const validateField = (name, value) => {
    switch (name) {
      case "display_name":
        if (!value.trim()) return "Display name is required";
        if (value.length < 2)
          return "Display name must be at least 2 characters";
        if (value.length > 50)
          return "Display name must be less than 50 characters";
        if (!/^[a-zA-Z0-9_\s\-\.]+$/.test(value)) {
          return "Display name can only contain letters, numbers, spaces, underscores, hyphens, and dots";
        }
        return "";

      case "gender":
        if (!value) return "Gender is required";
        return "";

      case "country":
        if (!value) return "Country is required";
        return "";

      case "city":
        // City is optional, but if provided, validate it
        if (value && value.trim()) {
          if (value.length < 2) return "City must be at least 2 characters";
          if (value.length > 100)
            return "City must be less than 100 characters";
        }
        return "";

      case "languages":
        if (!value || value.length === 0)
          return "At least one language is required";
        if (value.length > 10) return "Maximum 10 languages allowed";
        return "";

      case "timezone":
        if (!value) return "Timezone is required";
        return "";

      case "bio":
        if (value && value.length > 500)
          return "Bio must be less than 500 characters";
        return "";

      case "profile_picture":
        // Profile picture is optional
        if (!value) return "";
        return "";

      default:
        return "";
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "display_name") {
      handleDisplayNameChange(value);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Validate field if it's been touched
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleLanguageChange = (selectedLanguages) => {
    setFormData((prev) => ({ ...prev, languages: selectedLanguages }));

    if (touched.languages) {
      const error = validateField("languages", selectedLanguages);
      setErrors((prev) => ({ ...prev, languages: error }));
    }
  };

  const handleFieldBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));

    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleFileSelect = (file, error) => {
    setFormData((prev) => ({ ...prev, profile_picture: file }));

    if (error) {
      setErrors((prev) => ({ ...prev, profile_picture: error }));
    } else {
      setErrors((prev) => ({ ...prev, profile_picture: "" }));
    }

    setTouched((prev) => ({ ...prev, profile_picture: true }));
  };

  const isFormValid = () => {
    // Check if all required fields are filled
    const requiredFields = [
      "display_name",
      "gender",
      "country",
      "languages",
      "timezone",
    ];
    const allFieldsFilled = requiredFields.every((field) => {
      if (field === "languages") {
        return formData[field] && formData[field].length > 0;
      }
      return formData[field];
    });

    // Check if there are no validation errors
    const hasErrors = Object.values(errors).some((error) => error !== "");

    // Check display name availability
    const displayNameValid = displayNameStatus?.type === "available";

    return allFieldsFilled && !hasErrors && displayNameValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear any previous submission errors
    setErrors((prev) => ({ ...prev, submit: "" }));

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

    // Check if form is valid
    if (!isFormValid() || Object.keys(newErrors).length > 0) {
      console.warn("⚠️ Form validation failed:", {
        isFormValid: isFormValid(),
        newErrors,
        displayNameStatus: displayNameStatus?.type,
        formData: {
          ...formData,
          profile_picture: formData.profile_picture
            ? "File selected"
            : "No file",
        },
      });
      return;
    }

    // Additional check for display name availability
    if (displayNameStatus?.type !== "available") {
      setErrors((prev) => ({
        ...prev,
        submit:
          "Please wait for display name availability check to complete or choose an available name.",
      }));
      return;
    }

    setIsSubmitting(true);

    try {
      // Log form data for debugging
      console.log("📝 Form data being submitted:", {
        display_name: formData.display_name,
        gender: formData.gender,
        country: formData.country,
        city: formData.city,
        languages: formData.languages,
        timezone: formData.timezone,
        bio: formData.bio,
        profile_picture: formData.profile_picture
          ? {
              name: formData.profile_picture.name,
              size: formData.profile_picture.size,
              type: formData.profile_picture.type,
            }
          : null,
      });

      // Validate required fields before sending
      const requiredFieldsCheck = {
        display_name: formData.display_name?.trim(),
        gender: formData.gender,
        country: formData.country,
        languages: formData.languages,
        timezone: formData.timezone,
      };

      // Check for missing required fields
      const missingFields = Object.entries(requiredFieldsCheck)
        .filter(([key, value]) => {
          if (key === "languages") return !value || value.length === 0;
          return !value;
        })
        .map(([key]) => key);

      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
      }

      // Prepare form data for API
      // Ensure languages is an array and not empty
      const languagesArray = Array.isArray(formData.languages)
        ? formData.languages
        : [];
      if (languagesArray.length === 0) {
        throw new Error("At least one language must be selected");
      }

      // Validate profile picture if provided
      if (formData.profile_picture) {
        const allowedTypes = [
          "image/jpeg",
          "image/jpg",
          "image/png",
          "image/webp",
        ];
        if (!allowedTypes.includes(formData.profile_picture.type)) {
          throw new Error("Profile picture must be a JPEG, PNG, or WebP image");
        }
        if (formData.profile_picture.size > 5 * 1024 * 1024) {
          // 5MB limit
          throw new Error("Profile picture must be less than 5MB");
        }
      }

      // Create FormData for the hook to process
      const apiFormData = new FormData();
      apiFormData.append("display_name", formData.display_name.trim());
      apiFormData.append("gender", formData.gender);
      apiFormData.append("country", formData.country);
      apiFormData.append("timezone", formData.timezone);
      apiFormData.append("languages", JSON.stringify(languagesArray));

      // Add optional city field only if provided
      if (formData.city && formData.city.trim()) {
        apiFormData.append("city", formData.city.trim());
      }

      // Add optional bio field only if provided
      if (formData.bio && formData.bio.trim()) {
        apiFormData.append("bio", formData.bio.trim());
      }

      // Add optional profile picture only if provided
      if (formData.profile_picture) {
        apiFormData.append("profile_picture", formData.profile_picture);
      }

      // Log form data being sent
      console.log("📦 Form data being sent:", {
        display_name: formData.display_name.trim(),
        gender: formData.gender,
        country: formData.country,
        city: formData.city.trim(),
        languages: languagesArray,
        timezone: formData.timezone,
        bio: formData.bio?.trim() || undefined,
        has_profile_picture: !!formData.profile_picture,
      });

      const result = await submitStep1(apiFormData);

      // Log the actual response structure for debugging
      console.log("✅ Step 1 submission successful:", result);

      // If we get here without an error, the submission was successful
      // The API returns 201 for successful creation
      onComplete(formData);
    } catch (error) {
      console.error("📋 Form submission error:", error);

      let errorMessage = error.message || "Failed to submit. Please try again.";

      // Parse validation errors for better user experience
      if (error.message && error.message.includes("Validation failed:")) {
        errorMessage = error.message.replace(
          "Validation failed: ",
          "Please fix the following issues: ",
        );
      }

      setErrors((prev) => ({
        ...prev,
        submit: errorMessage,
      }));
      // Ensure form remains interactive even after API errors
      setTimeout(() => {
        setErrors((prev) => ({ ...prev, submit: "" }));
      }, 5000); // Clear error after 5 seconds
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Let's Build Your Creator Profile
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Tell us about yourself to get started on RexBuz
        </p>
      </div>

      {/* CORS Debugger - Temporary for testing */}
      <CorsDebugger />

      {/* Error Display */}
      {errors.submit && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 text-red-500 mr-3"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-red-800 dark:text-red-200">
              {errors.submit}
            </span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Picture Upload */}
        <FileUpload
          onFileSelect={handleFileSelect}
          label="Profile Picture (Optional)"
          required={false}
          error={errors.profile_picture}
        />

        {/* Display Name */}
        <div>
          <label
            htmlFor="display_name"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Display Name *
          </label>
          <div className="relative">
            <input
              type="text"
              id="display_name"
              name="display_name"
              value={formData.display_name}
              onChange={handleInputChange}
              onBlur={handleFieldBlur}
              className={`w-full px-4 py-3 pr-10 rounded-xl border-2 transition-all duration-200 focus:ring-2 focus:border-transparent ${
                errors.display_name && touched.display_name
                  ? "border-red-500 focus:ring-red-500 bg-red-50 dark:bg-red-900/10"
                  : displayNameStatus?.type === "available"
                    ? "border-green-500 focus:ring-green-500 bg-green-50 dark:bg-green-900/10"
                    : displayNameStatus?.type === "taken"
                      ? "border-red-500 focus:ring-red-500 bg-red-50 dark:bg-red-900/10"
                      : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-purple-500 bg-white dark:bg-gray-800"
              } text-gray-900 dark:text-white`}
              placeholder="Enter your creator display name"
            />

            {/* Status Icon */}
            {displayNameStatus && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                {displayNameStatus.type === "checking" && (
                  <svg
                    className="animate-spin h-5 w-5 text-blue-500"
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
                )}
                {displayNameStatus.type === "available" && (
                  <svg
                    className="h-5 w-5 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                {displayNameStatus.type === "taken" && (
                  <svg
                    className="h-5 w-5 text-red-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                {displayNameStatus.type === "error" && (
                  <svg
                    className="h-5 w-5 text-orange-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
            )}
          </div>

          {/* Help Text */}
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Your unique creator name on RexBuz. Can contain letters, numbers,
            spaces, underscores, hyphens, and dots.
          </p>

          {/* Display Name Status */}
          {displayNameStatus && (
            <div
              className={`mt-2 p-2 rounded-md text-sm flex items-center ${
                displayNameStatus.type === "available"
                  ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800"
                  : displayNameStatus.type === "taken"
                    ? "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800"
                    : displayNameStatus.type === "checking"
                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                      : "bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800"
              }`}
            >
              {displayNameStatus.type === "checking" && (
                <svg
                  className="animate-spin w-4 h-4 mr-2 flex-shrink-0"
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
              )}
              {displayNameStatus.type === "available" && (
                <svg
                  className="w-4 h-4 mr-2 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              {displayNameStatus.type === "taken" && (
                <svg
                  className="w-4 h-4 mr-2 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              {displayNameStatus.type === "error" && (
                <svg
                  className="w-4 h-4 mr-2 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              <span className="font-medium">{displayNameStatus.message}</span>
            </div>
          )}

          {/* Display Name Suggestions */}
          {displayNameStatus?.suggestions &&
            displayNameStatus.suggestions.length > 0 && (
              <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm font-medium text-blue-900 dark:text-blue-200 mb-2">
                  ���� Try these available alternatives:
                </p>
                <div className="flex flex-wrap gap-2">
                  {displayNameStatus.suggestions
                    .slice(0, 3)
                    .map((suggestion, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleDisplayNameChange(suggestion)}
                        className="inline-flex items-center text-sm bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 px-3 py-1.5 rounded-full hover:bg-blue-200 dark:hover:bg-blue-900/60 transition-colors duration-200 font-medium"
                      >
                        {suggestion}
                        <svg
                          className="ml-1 h-3 w-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>
                    ))}
                </div>
              </div>
            )}

          {errors.display_name && touched.display_name && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
              {errors.display_name}
            </p>
          )}
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Gender */}
          <div>
            <label
              htmlFor="gender"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Gender *
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              onBlur={handleFieldBlur}
              className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:ring-2 focus:border-transparent ${
                errors.gender && touched.gender
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-purple-500"
              } bg-white dark:bg-gray-800 text-gray-900 dark:text-white`}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="non_binary">Non-binary</option>
              <option value="prefer_not_to_say">Prefer not to say</option>
            </select>
            {errors.gender && touched.gender && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                {errors.gender}
              </p>
            )}
          </div>

          {/* Country */}
          <div>
            <label
              htmlFor="country"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Country *
            </label>
            <select
              id="country"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              onBlur={handleFieldBlur}
              className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:ring-2 focus:border-transparent ${
                errors.country && touched.country
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-purple-500"
              } bg-white dark:bg-gray-800 text-gray-900 dark:text-white`}
            >
              <option value="">Select Country</option>
              {countries.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.name}
                </option>
              ))}
            </select>
            {errors.country && touched.country && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                {errors.country}
              </p>
            )}
          </div>

          {/* City */}
          <div>
            <label
              htmlFor="city"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              City (Optional)
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              onBlur={handleFieldBlur}
              className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:ring-2 focus:border-transparent ${
                errors.city && touched.city
                  ? "border-red-500 focus:ring-red-500 bg-red-50 dark:bg-red-900/10"
                  : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-purple-500 bg-white dark:bg-gray-800"
              } text-gray-900 dark:text-white`}
              placeholder="Enter your city"
            />
            {errors.city && touched.city && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                {errors.city}
              </p>
            )}
          </div>

          {/* Timezone */}
          <div>
            <label
              htmlFor="timezone"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Timezone *
            </label>
            <select
              id="timezone"
              name="timezone"
              value={formData.timezone}
              onChange={handleInputChange}
              onBlur={handleFieldBlur}
              className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:ring-2 focus:border-transparent ${
                errors.timezone && touched.timezone
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-purple-500"
              } bg-white dark:bg-gray-800 text-gray-900 dark:text-white`}
            >
              <option value="">Select Timezone</option>
              {timezones.map((tz) => (
                <option key={tz.value} value={tz.value}>
                  {tz.label}
                </option>
              ))}
            </select>
            {errors.timezone && touched.timezone && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                {errors.timezone}
              </p>
            )}
          </div>
        </div>

        {/* Languages */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Languages Spoken * (Select multiple)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-48 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-xl p-4">
            {languages.map((language) => {
              const languageCode =
                typeof language === "string" ? language : language.code;
              const languageName =
                typeof language === "string" ? language : language.name;

              return (
                <label
                  key={languageCode}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={formData.languages.includes(languageCode)}
                    onChange={(e) => {
                      const isChecked = e.target.checked;
                      const currentLanguages = formData.languages;

                      if (isChecked) {
                        if (currentLanguages.length < 10) {
                          handleLanguageChange([
                            ...currentLanguages,
                            languageCode,
                          ]);
                        }
                      } else {
                        handleLanguageChange(
                          currentLanguages.filter(
                            (lang) => lang !== languageCode,
                          ),
                        );
                      }
                    }}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-purple-500 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {languageName}
                  </span>
                </label>
              );
            })}
          </div>
          {formData.languages.length > 0 && (
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Selected:{" "}
              {formData.languages
                .map((code) => {
                  const language = languages.find(
                    (lang) =>
                      (typeof lang === "string" ? lang : lang.code) === code,
                  );
                  return typeof language === "string"
                    ? language
                    : language?.name || code;
                })
                .join(", ")}{" "}
              ({formData.languages.length}/10)
            </p>
          )}
          {errors.languages && touched.languages && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
              {errors.languages}
            </p>
          )}
        </div>

        {/* Bio */}
        <div>
          <label
            htmlFor="bio"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Bio (Optional)
          </label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
            onBlur={handleFieldBlur}
            rows={4}
            className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:ring-2 focus:border-transparent ${
              errors.bio && touched.bio
                ? "border-red-500 focus:ring-red-500 bg-red-50 dark:bg-red-900/10"
                : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-purple-500 bg-white dark:bg-gray-800"
            } text-gray-900 dark:text-white resize-none`}
            placeholder="Tell us about yourself, your interests, and what kind of content you create..."
            maxLength={500}
          />
          <div className="flex justify-between mt-2">
            <div>
              {errors.bio && touched.bio && (
                <p className="text-sm text-red-600 dark:text-red-400">
                  {errors.bio}
                </p>
              )}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {formData.bio.length}/500 characters
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-6">
          {onBack && (
            <Button
              type="button"
              onClick={onBack}
              variant="outline"
              className="px-6 py-3"
            >
              Back
            </Button>
          )}

          <div className="flex-1" />

          <div className="flex space-x-4">
            <Button
              type="button"
              onClick={async (e) => {
                e.preventDefault();

                // Clear any previous submission errors
                setErrors((prev) => ({ ...prev, submit: "" }));

                setIsSubmitting(true);
                try {
                  // Same validation and submission logic but don't call onComplete
                  const allFields = Object.keys(formData);
                  setTouched(
                    Object.fromEntries(allFields.map((field) => [field, true])),
                  );

                  const newErrors = {};
                  allFields.forEach((field) => {
                    const error = validateField(field, formData[field]);
                    if (error) newErrors[field] = error;
                  });

                  setErrors(newErrors);

                  if (!isFormValid() || Object.keys(newErrors).length > 0) {
                    return;
                  }

                  if (displayNameStatus?.type !== "available") {
                    setErrors((prev) => ({
                      ...prev,
                      submit:
                        "Please wait for display name availability check to complete or choose an available name.",
                    }));
                    return;
                  }

                  const languagesArray = Array.isArray(formData.languages)
                    ? formData.languages
                    : [];
                  if (languagesArray.length === 0) {
                    throw new Error("At least one language must be selected");
                  }

                  if (formData.profile_picture) {
                    const allowedTypes = [
                      "image/jpeg",
                      "image/jpg",
                      "image/png",
                      "image/webp",
                    ];
                    if (!allowedTypes.includes(formData.profile_picture.type)) {
                      throw new Error(
                        "Profile picture must be a JPEG, PNG, or WebP image",
                      );
                    }
                    if (formData.profile_picture.size > 5 * 1024 * 1024) {
                      throw new Error("Profile picture must be less than 5MB");
                    }
                  }

                  const apiFormData = new FormData();
                  apiFormData.append(
                    "display_name",
                    formData.display_name.trim(),
                  );
                  apiFormData.append("gender", formData.gender);
                  apiFormData.append("country", formData.country);
                  apiFormData.append("timezone", formData.timezone);
                  apiFormData.append(
                    "languages",
                    JSON.stringify(languagesArray),
                  );

                  if (formData.city && formData.city.trim()) {
                    apiFormData.append("city", formData.city.trim());
                  }

                  if (formData.bio && formData.bio.trim()) {
                    apiFormData.append("bio", formData.bio.trim());
                  }

                  if (formData.profile_picture) {
                    apiFormData.append(
                      "profile_picture",
                      formData.profile_picture,
                    );
                  }

                  await submitStep1(apiFormData);

                  // Show success message but don't proceed
                  setErrors((prev) => ({
                    ...prev,
                    submit: "",
                  }));

                  alert("Progress saved successfully!");
                } catch (error) {
                  console.error("Save error:", error);
                  setErrors((prev) => ({
                    ...prev,
                    submit:
                      error.message || "Failed to save. Please try again.",
                  }));
                  // Ensure form remains interactive even after API errors
                  setTimeout(() => {
                    setErrors((prev) => ({ ...prev, submit: "" }));
                  }, 5000); // Clear error after 5 seconds
                } finally {
                  setIsSubmitting(false);
                }
              }}
              disabled={!isFormValid() || isSubmitting}
              loading={isSubmitting}
              variant="outline"
              className="px-6 py-3"
            >
              {isSubmitting ? "Saving..." : "Save"}
            </Button>

            {canProceed && onNext ? (
              <Button
                type="button"
                onClick={onNext}
                className="px-8 py-3 min-w-[160px]"
              >
                Next
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={!isFormValid() || isSubmitting}
                loading={isSubmitting}
                className="px-8 py-3 min-w-[160px]"
              >
                {isSubmitting ? "Saving..." : "Continue"}
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default OnboardingStep1;
