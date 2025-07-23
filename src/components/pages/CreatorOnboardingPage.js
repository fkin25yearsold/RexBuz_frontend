import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import OnboardingProgressTracker from "../common/OnboardingProgressTracker";
import OnboardingStep1 from "./onboarding/OnboardingStep1";
import OnboardingStep2 from "./onboarding/OnboardingStep2";
import OnboardingStep3 from "./onboarding/OnboardingStep3";
import OnboardingStep4 from "./onboarding/OnboardingStep4";
import OnboardingStep5 from "./onboarding/OnboardingStep5";
import OnboardingStep6 from "./onboarding/OnboardingStep6";
import ThemeToggle from "../ThemeToggle";
import useCreatorOnboarding from "../../hooks/useCreatorOnboarding";

const CreatorOnboardingPage = () => {
  const {
    user,
    isAuthenticated,
    needsOnboarding,
    onboardingStatus,
    getCurrentOnboardingStep,
    getOnboardingProgress,
    updateOnboardingStatus,
  } = useAuth();
  const { isDark } = useTheme();
  const { getOnboardingStatus, loading: statusLoading } =
    useCreatorOnboarding();

  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [onboardingData, setOnboardingData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check authentication and onboarding status
  useEffect(() => {
    const checkStatus = async () => {
      if (!isAuthenticated) {
        // Redirect to login if not authenticated
        window.location.hash = "login";
        return;
      }

      if (!needsOnboarding()) {
        // Redirect to dashboard if onboarding is already complete
        window.location.hash = "dashboard";
        return;
      }

      try {
        // Use onboarding status from AuthContext if available
        if (onboardingStatus) {
          let step = getCurrentOnboardingStep();
          const progress = getOnboardingProgress();

          // Fix: If progress is high but step is 1, calculate the correct step
          if (progress > 20 && step === 1) {
            // Calculate step based on progress (6 steps total, so each step is ~16.67%)
            step = Math.min(Math.floor(progress / 16.67) + 1, 6);
            console.log(`📋 Corrected step from progress: ${progress}% -> Step ${step}`);
          }

          setCurrentStep(step);
          setProgressPercentage(progress);

          // Calculate completed steps based on current step
          // If user is on step N, they completed steps 1 to N-1
          const completed = [];
          for (let i = 1; i < step; i++) {
            completed.push(i);
          }

          // If we have explicit completed_steps from backend, use those
          if (onboardingStatus.completed_steps && onboardingStatus.completed_steps.length > 0) {
            setCompletedSteps(onboardingStatus.completed_steps);
          } else {
            setCompletedSteps(completed);
          }

          console.log(
            `📋 Onboarding Status - Step: ${step}, Progress: ${progress}%, Completed: [${completed.join(", ")}]`,
          );
        } else {
          // Fallback to API call if no stored status
          const statusData = await getOnboardingStatus();
          if (statusData.success) {
            setCurrentStep(statusData.data.current_step || 1);
            setCompletedSteps(statusData.data.completed_steps || []);
            setProgressPercentage(statusData.data.progress_percentage || 0);
          }
        }
      } catch (err) {
        // If status API fails, start from step 1
        console.warn(
          "Could not get onboarding status, starting from step 1:",
          err.message,
        );
        setCurrentStep(1);
        setCompletedSteps([]);
        setProgressPercentage(0);
      } finally {
        setIsLoading(false);
      }
    };

    checkStatus();
  }, [
    isAuthenticated,
    needsOnboarding,
    onboardingStatus,
    getCurrentOnboardingStep,
    getOnboardingProgress,
    getOnboardingStatus,
  ]);

  const handleStepComplete = (stepNumber, stepData) => {
    // Update completed steps
    const newCompletedSteps = [...completedSteps];
    if (!newCompletedSteps.includes(stepNumber)) {
      newCompletedSteps.push(stepNumber);
      setCompletedSteps(newCompletedSteps);
    }

    // Save step data
    setOnboardingData((prev) => ({
      ...prev,
      [`step${stepNumber}`]: stepData,
    }));

    // Calculate new progress
    const newProgress = (newCompletedSteps.length / 6) * 100;
    setProgressPercentage(newProgress);

    // Move to next step
    if (stepNumber < 6) {
      const nextStepNumber = stepNumber + 1;
      setCurrentStep(nextStepNumber);

      // Update AuthContext with new status
      const updatedStatus = {
        onboarding_required: true,
        is_completed: false,
        completion_percentage: newProgress,
        current_step: nextStepNumber, // Current step should be the next step user needs to complete
        completed_steps: newCompletedSteps,
        next_step: {
          step: nextStepNumber,
          name: getStepName(nextStepNumber),
          description: getStepDescription(nextStepNumber),
        },
        message: `Please complete step ${nextStepNumber}: ${getStepDescription(nextStepNumber)}`,
      };
      updateOnboardingStatus(updatedStatus);
    } else {
      // Onboarding complete
      const completeStatus = {
        onboarding_required: false,
        is_completed: true,
        completion_percentage: 100,
        current_step: 6,
        next_step: null,
        message: "Onboarding completed",
      };
      updateOnboardingStatus(completeStatus);

      // Redirect to dashboard
      window.location.hash = "dashboard";
    }
  };

  // Helper functions for step mapping
  const getStepName = (step) => {
    const stepNames = {
      1: "basic_profile",
      2: "social_media",
      3: "niche_preferences",
      4: "portfolio",
      5: "verification",
      6: "platform_preferences",
    };
    return stepNames[step] || "unknown";
  };

  const getStepDescription = (step) => {
    const stepDescriptions = {
      1: "Complete your basic profile",
      2: "Add your social media platforms",
      3: "Set your niche and preferences",
      4: "Create your portfolio",
      5: "Complete verification process",
      6: "Platform notification settings",
    };
    return stepDescriptions[step] || "Complete this step";
  };

  const handleStepBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepForward = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    }
  };

  const renderCurrentStep = () => {
    // Props for steps 1-2 (old pattern)
    const oldStepProps = {
      onComplete: (stepData) => handleStepComplete(currentStep, stepData),
      onBack: currentStep > 1 ? handleStepBack : null,
      onNext:
        currentStep < 6 && completedSteps.includes(currentStep)
          ? handleStepForward
          : null,
      existingData: onboardingData[`step${currentStep}`] || null,
      isCompleted: completedSteps.includes(currentStep),
      canProceed: completedSteps.includes(currentStep) && currentStep < 6,
    };

    // Props for steps 3-6 (new pattern)
    const newStepProps = {
      onNext: (stepData) => handleStepComplete(currentStep, stepData),
      onPrev: currentStep > 1 ? handleStepBack : null,
      currentData: onboardingData[`step${currentStep}`] || {},
      onUpdateData: (stepData) => {
        setOnboardingData((prev) => ({
          ...prev,
          [`step${currentStep}`]: stepData,
        }));
      },
    };

    switch (currentStep) {
      case 1:
        return <OnboardingStep1 {...oldStepProps} />;
      case 2:
        return <OnboardingStep2 {...oldStepProps} />;
      case 3:
        return <OnboardingStep3 {...newStepProps} />;
      case 4:
        return <OnboardingStep4 {...newStepProps} />;
      case 5:
        return <OnboardingStep5 {...newStepProps} />;
      case 6:
        return <OnboardingStep6 {...newStepProps} />;
      default:
        return null;
    }
  };

  if (isLoading || statusLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-light-bg to-gray-50 dark:from-dark-bg dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Loading your onboarding progress...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-light-bg to-gray-50 dark:from-dark-bg dark:to-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Something went wrong
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-light-bg to-gray-50 dark:from-dark-bg dark:to-gray-900">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Progress Tracker Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <OnboardingProgressTracker
                currentStep={currentStep}
                completedSteps={completedSteps}
                totalSteps={6}
                progressPercentage={progressPercentage}
              />
            </div>
          </div>

          {/* Step Content */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-dark-card rounded-2xl shadow-xl p-8">
              {renderCurrentStep()}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto py-6 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>Need help? Contact our support team at support@rexbuz.com</p>
      </footer>
    </div>
  );
};

export default CreatorOnboardingPage;
