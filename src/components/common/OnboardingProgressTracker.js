import React from "react";

const OnboardingProgressTracker = ({
  currentStep = 1,
  completedSteps = [],
  totalSteps = 6,
  progressPercentage = 0,
  className = "",
}) => {
  const steps = [
    { id: 1, name: "Basic Profile", icon: "👤" },
    { id: 2, name: "Social Media", icon: "📱" },
    { id: 3, name: "Niche & Preferences", icon: "🎯" },
    { id: 4, name: "Portfolio", icon: "📂" },
    { id: 5, name: "Verification", icon: "✅" },
    { id: 6, name: "Platform Settings", icon: "⚙️" },
  ];

  const getStepStatus = (stepId) => {
    if (completedSteps.includes(stepId)) return "completed";
    if (stepId === currentStep) return "current";
    if (stepId < currentStep) return "completed";
    return "upcoming";
  };

  const getStepClasses = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 dark:bg-green-900/30 border-green-500 text-green-700 dark:text-green-300";
      case "current":
        return "bg-blue-100 dark:bg-blue-900/30 border-blue-500 text-blue-700 dark:text-blue-300 ring-2 ring-blue-200 dark:ring-blue-800";
      default:
        return "bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400";
    }
  };

  const getConnectorClasses = (stepId) => {
    const isCompleted = completedSteps.includes(stepId) || stepId < currentStep;
    return isCompleted ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600";
  };

  return (
    <div
      className={`bg-white dark:bg-dark-card rounded-2xl p-6 shadow-lg ${className}`}
    >
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Creator Onboarding Progress
          </h3>
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {Math.round(progressPercentage)}% Complete
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-1">
        {steps.map((step, index) => {
          const status = getStepStatus(step.id);
          const isLast = index === steps.length - 1;

          return (
            <div key={step.id} className="relative">
              {/* Step Item */}
              <div className="flex items-center">
                {/* Step Circle */}
                <div
                  className={`
                  flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200
                  ${getStepClasses(status)}
                `}
                >
                  {status === "completed" ? (
                    <svg
                      className="w-5 h-5"
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
                    <span className="text-lg">{step.icon}</span>
                  )}
                </div>

                {/* Step Content */}
                <div className="ml-4 flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4
                        className={`text-sm font-medium ${
                          status === "current"
                            ? "text-blue-700 dark:text-blue-300"
                            : status === "completed"
                              ? "text-green-700 dark:text-green-300"
                              : "text-gray-600 dark:text-gray-400"
                        }`}
                      >
                        Step {step.id}: {step.name}
                      </h4>
                      {status === "current" && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Currently active
                        </p>
                      )}
                      {status === "completed" && (
                        <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                          Completed ✓
                        </p>
                      )}
                    </div>

                    {/* Status Indicator */}
                    <div className="flex items-center">
                      {status === "current" && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                      )}
                      {status === "completed" && (
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Connector Line */}
              {!isLast && (
                <div className="flex ml-5">
                  <div
                    className={`w-0.5 h-6 transition-colors duration-200 ${getConnectorClasses(step.id)}`}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      {currentStep <= totalSteps && (
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              {completedSteps.length} of {totalSteps} steps completed
            </span>
            <span className="text-blue-600 dark:text-blue-400 font-medium">
              {currentStep > totalSteps
                ? "All Done! 🎉"
                : `Step ${currentStep} Active`}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default OnboardingProgressTracker;
