import React from "react";
import Button from "./Button";

const OnboardingActionButtons = ({
  onBack,
  onSave,
  onContinue,
  isFormValid,
  isSubmitting,
  loading,
  showBackButton = true,
  saveButtonText = "Save",
  continueButtonText = "Continue",
  submittingText = "Saving...",
}) => {
  return (
    <div className="flex items-center justify-between pt-6">
      {onBack && showBackButton && (
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
          onClick={onSave}
          disabled={!isFormValid || isSubmitting || loading}
          loading={isSubmitting && onSave}
          variant="outline"
          className="px-6 py-3"
        >
          {isSubmitting ? submittingText : saveButtonText}
        </Button>

        <Button
          type="submit"
          onClick={onContinue}
          disabled={!isFormValid || isSubmitting || loading}
          loading={isSubmitting}
          className="px-8 py-3 min-w-[160px]"
        >
          {isSubmitting ? submittingText : continueButtonText}
        </Button>
      </div>
    </div>
  );
};

export default OnboardingActionButtons;
