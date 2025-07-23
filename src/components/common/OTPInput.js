import React, { useRef, useEffect } from "react";

const OTPInput = ({
  length = 6,
  value = [],
  onChange,
  disabled = false,
  error = false,
  className = "",
}) => {
  const inputRefs = useRef([]);

  useEffect(() => {
    // Initialize refs array
    inputRefs.current = inputRefs.current.slice(0, length);
  }, [length]);

  const handleChange = (index, inputValue) => {
    // Only allow single digit
    if (inputValue.length > 1) return;

    // Only allow numbers
    if (inputValue && !/^\d$/.test(inputValue)) return;

    const newValue = [...value];
    newValue[index] = inputValue;
    onChange(newValue);

    // Auto focus next input
    if (inputValue && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      if (!value[index] && index > 0) {
        // If current input is empty and backspace is pressed, focus previous
        inputRefs.current[index - 1]?.focus();
      } else {
        // Clear current input
        const newValue = [...value];
        newValue[index] = "";
        onChange(newValue);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain");
    const digits = pastedData.replace(/\D/g, "").slice(0, length);

    if (digits.length > 0) {
      const newValue = new Array(length).fill("");
      for (let i = 0; i < digits.length; i++) {
        newValue[i] = digits[i];
      }
      onChange(newValue);

      // Focus the next empty input or the last filled input
      const nextIndex = Math.min(digits.length, length - 1);
      inputRefs.current[nextIndex]?.focus();
    }
  };

  return (
    <div className={`flex justify-center space-x-3 ${className}`}>
      {Array.from({ length }, (_, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          maxLength="1"
          value={value[index] || ""}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          disabled={disabled}
          className={`
                                    w-12 h-12 text-center text-lg font-semibold rounded-lg border-2 
            bg-white dark:bg-gray-800 text-gray-900 dark:text-white
            transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50
            ${
              error
                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                : "border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-purple-500 focus:ring-blue-500 dark:focus:ring-purple-500"
            }
            ${
              disabled
                ? "opacity-50 cursor-not-allowed"
                : "hover:border-gray-400 dark:hover:border-gray-500"
            }
          `}
          autoComplete="off"
        />
      ))}
    </div>
  );
};

export default OTPInput;
