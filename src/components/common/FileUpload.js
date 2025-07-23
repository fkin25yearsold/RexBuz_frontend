import React, { useState, useRef } from "react";

const FileUpload = ({
  onFileSelect,
  accept = "image/jpeg,image/jpg,image/png",
  maxSize = 5 * 1024 * 1024, // 5MB
  className = "",
  label = "Upload Profile Picture",
  required = false,
  error = null,
  previewUrl = null,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState(previewUrl);
  const fileInputRef = useRef(null);

  const handleFileValidation = (file) => {
    // Check file type
    const allowedTypes = accept.split(",").map((type) => type.trim());
    if (!allowedTypes.includes(file.type)) {
      throw new Error(
        `Invalid file type. Only ${allowedTypes.join(", ")} files are allowed.`,
      );
    }

    // Check file size
    if (file.size > maxSize) {
      const maxSizeMB = maxSize / (1024 * 1024);
      throw new Error(`File size too large. Maximum size is ${maxSizeMB}MB.`);
    }

    // Check image dimensions (minimum 200x200)
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        if (img.width < 200 || img.height < 200) {
          reject(
            new Error(
              "Image dimensions too small. Minimum size is 200x200 pixels.",
            ),
          );
        } else {
          resolve(file);
        }
      };
      img.onerror = () => reject(new Error("Invalid image file."));
      img.src = URL.createObjectURL(file);
    });
  };

  const handleFileSelect = async (file) => {
    try {
      await handleFileValidation(file);

      // Create preview
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);

      // Call parent handler
      onFileSelect(file, null);
    } catch (error) {
      setPreview(null);
      onFileSelect(null, error.message);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onFileSelect(null, null);
  };

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {/* Upload Area */}
      <div
        className={`
          relative border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200
          ${
            dragActive
              ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
              : error
                ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
          }
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleInputChange}
          className="hidden"
          id="file-upload"
        />

        {preview ? (
          /* Preview */
          <div className="space-y-4">
            <div className="relative inline-block">
              <img
                src={preview}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-lg shadow-md"
              />
              <button
                type="button"
                onClick={removeFile}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
              >
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Image selected ✓
              </p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                Choose a different image
              </button>
            </div>
          </div>
        ) : (
          /* Upload Prompt */
          <div className="space-y-4">
            <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
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
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>

            <div>
              <label
                htmlFor="file-upload"
                className="cursor-pointer text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
              >
                Click to upload
              </label>
              <span className="text-gray-500 dark:text-gray-400">
                {" "}
                or drag and drop
              </span>
            </div>

            <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
              <p>JPG, PNG up to {Math.floor(maxSize / (1024 * 1024))}MB</p>
              <p>Minimum dimensions: 200x200 pixels</p>
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      )}

      {/* Helper Text */}
      {!error && (
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          Your profile picture will be visible to brands and other creators.
        </p>
      )}
    </div>
  );
};

export default FileUpload;
