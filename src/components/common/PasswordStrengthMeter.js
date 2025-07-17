import React from "react";

const PasswordStrengthMeter = ({ password }) => {
  const calculateStrength = (password) => {
    if (!password) return { score: 0, label: "", color: "gray" };

    let score = 0;
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    };

    // Count passed checks
    score = Object.values(checks).filter(Boolean).length;

    // Determine strength level
    if (score < 2) return { score, label: "Very Weak", color: "red", checks };
    if (score < 3) return { score, label: "Weak", color: "orange", checks };
    if (score < 4) return { score, label: "Good", color: "yellow", checks };
    if (score < 5) return { score, label: "Strong", color: "green", checks };
    return { score, label: "Very Strong", color: "emerald", checks };
  };

  const strength = calculateStrength(password);

  const colorClasses = {
    gray: "bg-gray-200 dark:bg-gray-700",
    red: "bg-red-500",
    orange: "bg-orange-500",
    yellow: "bg-yellow-500",
    green: "bg-green-500",
    emerald: "bg-emerald-500",
  };

  const textColorClasses = {
    gray: "text-gray-500",
    red: "text-red-500",
    orange: "text-orange-500",
    yellow: "text-yellow-500",
    green: "text-green-500",
    emerald: "text-emerald-500",
  };

  if (!password) return null;

  return (
    <div className="mt-2 space-y-2">
      {/* Strength Bar */}
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((level) => (
          <div
            key={level}
            className={`h-2 flex-1 rounded-full transition-all duration-300 ${
              level <= strength.score
                ? colorClasses[strength.color]
                : colorClasses.gray
            }`}
          />
        ))}
      </div>

      {/* Strength Label */}
      <div className="flex justify-between items-center">
        <span
          className={`text-sm font-medium ${textColorClasses[strength.color]}`}
        >
          {strength.label}
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {strength.score}/5 requirements
        </span>
      </div>

      {/* Requirements Checklist */}
      <div className="space-y-1 text-xs">
        <div
          className={`flex items-center space-x-2 ${
            strength.checks?.length
              ? "text-green-600 dark:text-green-400"
              : "text-gray-500 dark:text-gray-400"
          }`}
        >
          <div
            className={`w-3 h-3 rounded-full border ${
              strength.checks?.length
                ? "bg-green-500 border-green-500"
                : "border-gray-300 dark:border-gray-600"
            }`}
          >
            {strength.checks?.length && (
              <svg
                className="w-2 h-2 text-white ml-0.5 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
          <span>At least 8 characters</span>
        </div>

        <div
          className={`flex items-center space-x-2 ${
            strength.checks?.uppercase
              ? "text-green-600 dark:text-green-400"
              : "text-gray-500 dark:text-gray-400"
          }`}
        >
          <div
            className={`w-3 h-3 rounded-full border ${
              strength.checks?.uppercase
                ? "bg-green-500 border-green-500"
                : "border-gray-300 dark:border-gray-600"
            }`}
          >
            {strength.checks?.uppercase && (
              <svg
                className="w-2 h-2 text-white ml-0.5 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
          <span>One uppercase letter</span>
        </div>

        <div
          className={`flex items-center space-x-2 ${
            strength.checks?.lowercase
              ? "text-green-600 dark:text-green-400"
              : "text-gray-500 dark:text-gray-400"
          }`}
        >
          <div
            className={`w-3 h-3 rounded-full border ${
              strength.checks?.lowercase
                ? "bg-green-500 border-green-500"
                : "border-gray-300 dark:border-gray-600"
            }`}
          >
            {strength.checks?.lowercase && (
              <svg
                className="w-2 h-2 text-white ml-0.5 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
          <span>One lowercase letter</span>
        </div>

        <div
          className={`flex items-center space-x-2 ${
            strength.checks?.number
              ? "text-green-600 dark:text-green-400"
              : "text-gray-500 dark:text-gray-400"
          }`}
        >
          <div
            className={`w-3 h-3 rounded-full border ${
              strength.checks?.number
                ? "bg-green-500 border-green-500"
                : "border-gray-300 dark:border-gray-600"
            }`}
          >
            {strength.checks?.number && (
              <svg
                className="w-2 h-2 text-white ml-0.5 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
          <span>One number</span>
        </div>

        <div
          className={`flex items-center space-x-2 ${
            strength.checks?.special
              ? "text-green-600 dark:text-green-400"
              : "text-gray-500 dark:text-gray-400"
          }`}
        >
          <div
            className={`w-3 h-3 rounded-full border ${
              strength.checks?.special
                ? "bg-green-500 border-green-500"
                : "border-gray-300 dark:border-gray-600"
            }`}
          >
            {strength.checks?.special && (
              <svg
                className="w-2 h-2 text-white ml-0.5 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
          <span>One special character</span>
        </div>
      </div>
    </div>
  );
};

export default PasswordStrengthMeter;
