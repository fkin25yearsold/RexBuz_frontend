import React, { useState, useCallback, useRef } from "react";
import { useCreatorOnboarding } from "../../../hooks/useCreatorOnboarding";

const OnboardingStep5 = ({ onNext, onPrev, currentData, onUpdateData }) => {
  const { submitStep5, loading } = useCreatorOnboarding();
  const [errors, setErrors] = useState({});
  const [dragActive, setDragActive] = useState({});
  const govIdInputRef = useRef(null);
  const selfieInputRef = useRef(null);
  const optionalDocsInputRef = useRef(null);

  const [formData, setFormData] = useState({
    // Identity Verification
    governmentIdType: currentData?.governmentIdType || "aadhaar",
    governmentIdFile: currentData?.governmentIdFile || null,
    verificationSelfie: currentData?.verificationSelfie || null,
    optionalDocuments: currentData?.optionalDocuments || [],

    // UPI & Payment
    upiHandle: currentData?.upiHandle || "",
    phonepeVerified: currentData?.phonepeVerified || false,
    referralCode: currentData?.referralCode || "",

    // Bank Details (Optional)
    includesBankDetails: currentData?.includesBankDetails || false,
    accountHolderName: currentData?.accountHolderName || "",
    accountNumber: currentData?.accountNumber || "",
    ifscCode: currentData?.ifscCode || "",
    bankName: currentData?.bankName || "",
    branchName: currentData?.branchName || "",

    // Agreement
    privacyPolicyAccepted: currentData?.privacyPolicyAccepted || false,
    dataProcessingConsent: currentData?.dataProcessingConsent || false,
    verificationDisclaimer: currentData?.verificationDisclaimer || false,
  });

  const govIdOptions = [
    {
      value: "aadhaar",
      label: "Aadhaar Card",
      description: "Most widely accepted ID",
    },
    { value: "pan", label: "PAN Card", description: "For tax verification" },
    {
      value: "passport",
      label: "Passport",
      description: "Valid for international creators",
    },
    {
      value: "voter_id",
      label: "Voter ID",
      description: "Election Commission issued",
    },
    {
      value: "driving_license",
      label: "Driving License",
      description: "RTO issued license",
    },
  ];

  const validateForm = useCallback(() => {
    const newErrors = {};

    // Required fields validation
    if (!formData.governmentIdType) {
      newErrors.governmentIdType = "Government ID type is required";
    }

    if (!formData.governmentIdFile) {
      newErrors.governmentIdFile = "Government ID file is required";
    }

    if (!formData.verificationSelfie) {
      newErrors.verificationSelfie = "Verification selfie is required";
    }

    if (!formData.upiHandle.trim()) {
      newErrors.upiHandle = "UPI handle is required";
    } else if (!isValidUpiHandle(formData.upiHandle)) {
      newErrors.upiHandle =
        "Please enter a valid UPI handle (e.g., yourname@phonepe)";
    }

    // Bank details validation (if provided)
    if (formData.includesBankDetails) {
      if (!formData.accountHolderName.trim()) {
        newErrors.accountHolderName = "Account holder name is required";
      }
      if (!formData.accountNumber.trim()) {
        newErrors.accountNumber = "Account number is required";
      } else if (!/^\d{9,18}$/.test(formData.accountNumber)) {
        newErrors.accountNumber = "Account number must be 9-18 digits";
      }
      if (!formData.ifscCode.trim()) {
        newErrors.ifscCode = "IFSC code is required";
      } else if (
        !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.ifscCode.toUpperCase())
      ) {
        newErrors.ifscCode = "Please enter a valid IFSC code";
      }
      if (!formData.bankName.trim()) {
        newErrors.bankName = "Bank name is required";
      }
    }

    // Agreement validation
    if (!formData.privacyPolicyAccepted) {
      newErrors.privacyPolicyAccepted = "You must accept the privacy policy";
    }
    if (!formData.dataProcessingConsent) {
      newErrors.dataProcessingConsent = "Data processing consent is required";
    }
    if (!formData.verificationDisclaimer) {
      newErrors.verificationDisclaimer =
        "Verification disclaimer acknowledgment is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const isValidUpiHandle = (upi) => {
    const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/;
    return upiRegex.test(upi);
  };

  const handleFileUpload = useCallback((fieldName, file) => {
    if (!file) return;

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "application/pdf",
    ];
    if (!allowedTypes.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        [fieldName]: "Please upload a JPG, PNG, or PDF file",
      }));
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        [fieldName]: "File size must be less than 5MB",
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [fieldName]: file,
    }));

    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  }, []);

  const handleDrag = useCallback((e, fieldName) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive((prev) => ({ ...prev, [fieldName]: true }));
    } else if (e.type === "dragleave") {
      setDragActive((prev) => ({ ...prev, [fieldName]: false }));
    }
  }, []);

  const handleDrop = useCallback(
    (e, fieldName) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive((prev) => ({ ...prev, [fieldName]: false }));

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFileUpload(fieldName, e.dataTransfer.files[0]);
      }
    },
    [handleFileUpload],
  );

  const handleInputChange = useCallback(
    (field, value) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));

      if (errors[field]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
    },
    [errors],
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const submissionData = new FormData();

      // Add all form fields
      Object.keys(formData).forEach((key) => {
        if (key === "optionalDocuments") {
          formData[key].forEach((file, index) => {
            submissionData.append(`optionalDocuments[${index}]`, file);
          });
        } else if (formData[key] instanceof File) {
          submissionData.append(key, formData[key]);
        } else {
          submissionData.append(key, formData[key]);
        }
      });

      await submitStep5(submissionData);
      onUpdateData(formData);
      onNext();
    } catch (error) {
      setErrors({
        submit: error.message || "Failed to submit verification details",
      });
    }
  };

  const FileUploadArea = ({
    fieldName,
    title,
    description,
    file,
    required = true,
  }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {title} {required && <span className="text-red-500">*</span>}
      </label>
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive[fieldName]
            ? "border-blue-400 bg-blue-50 dark:bg-blue-900/20"
            : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
        }`}
        onDragEnter={(e) => handleDrag(e, fieldName)}
        onDragLeave={(e) => handleDrag(e, fieldName)}
        onDragOver={(e) => handleDrag(e, fieldName)}
        onDrop={(e) => handleDrop(e, fieldName)}
      >
        <input
          ref={
            fieldName === "governmentIdFile"
              ? govIdInputRef
              : fieldName === "verificationSelfie"
                ? selfieInputRef
                : optionalDocsInputRef
          }
          type="file"
          className="hidden"
          accept="image/*,application/pdf"
          onChange={(e) => handleFileUpload(fieldName, e.target.files[0])}
        />

        {file ? (
          <div className="space-y-2">
            <div className="flex items-center justify-center">
              <span className="text-green-600 dark:text-green-400">✓</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {file.name}
            </p>
            <button
              type="button"
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm underline"
              onClick={() => {
                if (fieldName === "governmentIdFile")
                  govIdInputRef.current?.click();
                else if (fieldName === "verificationSelfie")
                  selfieInputRef.current?.click();
                else optionalDocsInputRef.current?.click();
              }}
            >
              Change file
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center justify-center">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>
            <div>
              <button
                type="button"
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                onClick={() => {
                  if (fieldName === "governmentIdFile")
                    govIdInputRef.current?.click();
                  else if (fieldName === "verificationSelfie")
                    selfieInputRef.current?.click();
                  else optionalDocsInputRef.current?.click();
                }}
              >
                Click to upload
              </button>
              <span className="text-gray-500 dark:text-gray-400">
                {" "}
                or drag and drop
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {description}
            </p>
          </div>
        )}
      </div>
      {errors[fieldName] && (
        <p className="text-red-500 text-xs mt-1">{errors[fieldName]}</p>
      )}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Verification & Payment Setup
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Complete your identity verification and set up payment methods to
            start earning.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Identity Verification Section */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Identity Verification
            </h3>

            {/* Government ID Type */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Government ID Type *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {govIdOptions.map((option) => (
                  <div
                    key={option.value}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      formData.governmentIdType === option.value
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30"
                        : "border-gray-300 dark:border-gray-600 hover:border-gray-400"
                    }`}
                    onClick={() =>
                      handleInputChange("governmentIdType", option.value)
                    }
                  >
                    <div className="font-medium text-gray-900 dark:text-white">
                      {option.label}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {option.description}
                    </div>
                  </div>
                ))}
              </div>
              {errors.governmentIdType && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.governmentIdType}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Government ID Upload */}
              <FileUploadArea
                fieldName="governmentIdFile"
                title="Government ID Document"
                description="Upload clear photo/scan of your ID (JPG, PNG, PDF - Max 5MB)"
                file={formData.governmentIdFile}
                required={true}
              />

              {/* Verification Selfie */}
              <FileUploadArea
                fieldName="verificationSelfie"
                title="Verification Selfie"
                description="Take a selfie holding your ID document (JPG, PNG - Max 5MB)"
                file={formData.verificationSelfie}
                required={true}
              />
            </div>

            {/* Optional Documents */}
            <FileUploadArea
              fieldName="optionalDocuments"
              title="Additional Documents (Optional)"
              description="Any additional verification documents (JPG, PNG, PDF - Max 5MB each)"
              file={formData.optionalDocuments[0]}
              required={false}
            />
          </div>

          {/* UPI & Payment Section */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Payment Setup
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* UPI Handle */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  PhonePe UPI Handle *
                </label>
                <input
                  type="text"
                  value={formData.upiHandle}
                  onChange={(e) =>
                    handleInputChange("upiHandle", e.target.value)
                  }
                  placeholder="yourname@phonepe"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                />
                {errors.upiHandle && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.upiHandle}
                  </p>
                )}
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  We'll verify this UPI ID for payments
                </p>
              </div>

              {/* Referral Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Referral Code (Optional)
                </label>
                <input
                  type="text"
                  value={formData.referralCode}
                  onChange={(e) =>
                    handleInputChange("referralCode", e.target.value)
                  }
                  placeholder="Enter referral code if you have one"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Get bonus rewards with a valid referral code
                </p>
              </div>
            </div>
          </div>

          {/* Bank Details Section */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Bank Account Details
              </h3>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.includesBankDetails}
                  onChange={(e) =>
                    handleInputChange("includesBankDetails", e.target.checked)
                  }
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Add bank details (optional)
                </span>
              </label>
            </div>

            {formData.includesBankDetails && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Account Holder Name *
                  </label>
                  <input
                    type="text"
                    value={formData.accountHolderName}
                    onChange={(e) =>
                      handleInputChange("accountHolderName", e.target.value)
                    }
                    placeholder="As per bank records"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                  />
                  {errors.accountHolderName && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.accountHolderName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Account Number *
                  </label>
                  <input
                    type="text"
                    value={formData.accountNumber}
                    onChange={(e) =>
                      handleInputChange("accountNumber", e.target.value)
                    }
                    placeholder="Your bank account number"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                  />
                  {errors.accountNumber && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.accountNumber}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    IFSC Code *
                  </label>
                  <input
                    type="text"
                    value={formData.ifscCode}
                    onChange={(e) =>
                      handleInputChange(
                        "ifscCode",
                        e.target.value.toUpperCase(),
                      )
                    }
                    placeholder="e.g., SBIN0001234"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                  />
                  {errors.ifscCode && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.ifscCode}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Bank Name *
                  </label>
                  <input
                    type="text"
                    value={formData.bankName}
                    onChange={(e) =>
                      handleInputChange("bankName", e.target.value)
                    }
                    placeholder="e.g., State Bank of India"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                  />
                  {errors.bankName && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.bankName}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Branch Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.branchName}
                    onChange={(e) =>
                      handleInputChange("branchName", e.target.value)
                    }
                    placeholder="Bank branch name"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Agreements Section */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Terms & Agreements
            </h3>

            <div className="space-y-4">
              <label className="flex items-start">
                <input
                  type="checkbox"
                  checked={formData.privacyPolicyAccepted}
                  onChange={(e) =>
                    handleInputChange("privacyPolicyAccepted", e.target.checked)
                  }
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-1"
                />
                <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">
                  I accept the{" "}
                  <a
                    href="/privacy-policy"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    Privacy Policy
                  </a>{" "}
                  and{" "}
                  <a
                    href="/terms-of-service"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    Terms of Service
                  </a>
                </span>
              </label>
              {errors.privacyPolicyAccepted && (
                <p className="text-red-500 text-xs ml-6">
                  {errors.privacyPolicyAccepted}
                </p>
              )}

              <label className="flex items-start">
                <input
                  type="checkbox"
                  checked={formData.dataProcessingConsent}
                  onChange={(e) =>
                    handleInputChange("dataProcessingConsent", e.target.checked)
                  }
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-1"
                />
                <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">
                  I consent to the processing of my personal data for
                  verification purposes
                </span>
              </label>
              {errors.dataProcessingConsent && (
                <p className="text-red-500 text-xs ml-6">
                  {errors.dataProcessingConsent}
                </p>
              )}

              <label className="flex items-start">
                <input
                  type="checkbox"
                  checked={formData.verificationDisclaimer}
                  onChange={(e) =>
                    handleInputChange(
                      "verificationDisclaimer",
                      e.target.checked,
                    )
                  }
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-1"
                />
                <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">
                  I understand that verification may take 2-5 business days and
                  I will be notified via email about the status
                </span>
              </label>
              {errors.verificationDisclaimer && (
                <p className="text-red-500 text-xs ml-6">
                  {errors.verificationDisclaimer}
                </p>
              )}
            </div>
          </div>

          {/* Error Display */}
          {errors.submit && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-red-700 dark:text-red-400 text-sm">
                {errors.submit}
              </p>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6">
            <button
              type="button"
              onClick={onPrev}
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Previous
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Verifying..." : "Continue to Platform Preferences"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OnboardingStep5;
