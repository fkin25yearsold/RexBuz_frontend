import React, { useState, useCallback } from "react";
import { useCreatorOnboarding } from "../../../hooks/useCreatorOnboarding";

const OnboardingStep6 = ({ onNext, onPrev, currentData, onUpdateData }) => {
  const { submitStep6, loading } = useCreatorOnboarding();
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    // Notification Preferences
    emailNotifications: {
      campaignInvites: currentData?.emailNotifications?.campaignInvites ?? true,
      paymentUpdates: currentData?.emailNotifications?.paymentUpdates ?? true,
      platformUpdates: currentData?.emailNotifications?.platformUpdates ?? true,
      marketingEmails:
        currentData?.emailNotifications?.marketingEmails ?? false,
      weeklyDigest: currentData?.emailNotifications?.weeklyDigest ?? true,
      performanceReports:
        currentData?.emailNotifications?.performanceReports ?? true,
    },

    pushNotifications: {
      campaignInvites: currentData?.pushNotifications?.campaignInvites ?? true,
      chatMessages: currentData?.pushNotifications?.chatMessages ?? true,
      paymentAlerts: currentData?.pushNotifications?.paymentAlerts ?? true,
      deadlineReminders:
        currentData?.pushNotifications?.deadlineReminders ?? true,
      milestoneAchievements:
        currentData?.pushNotifications?.milestoneAchievements ?? true,
      systemAlerts: currentData?.pushNotifications?.systemAlerts ?? true,
    },

    smsNotifications: {
      paymentConfirmations:
        currentData?.smsNotifications?.paymentConfirmations ?? true,
      urgentAlerts: currentData?.smsNotifications?.urgentAlerts ?? true,
      securityAlerts: currentData?.smsNotifications?.securityAlerts ?? true,
      campaignReminders:
        currentData?.smsNotifications?.campaignReminders ?? false,
    },

    // Discovery Preferences
    profileVisibility: currentData?.profileVisibility || "public",
    searchableByBrands: currentData?.searchableByBrands ?? true,
    showInRecommendations: currentData?.showInRecommendations ?? true,
    allowDirectContact: currentData?.allowDirectContact ?? true,
    showcaseMetrics: currentData?.showcaseMetrics ?? true,
    displayRates: currentData?.displayRates ?? false,

    // Communication Preferences
    preferredContactMethod:
      currentData?.preferredContactMethod || "platform_chat",
    responseTimeExpectation: currentData?.responseTimeExpectation || "24_hours",
    autoReplyEnabled: currentData?.autoReplyEnabled ?? false,
    autoReplyMessage: currentData?.autoReplyMessage || "",
    workingHours: {
      enabled: currentData?.workingHours?.enabled ?? false,
      timezone: currentData?.workingHours?.timezone || "Asia/Kolkata",
      days: currentData?.workingHours?.days || [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
      ],
      startTime: currentData?.workingHours?.startTime || "09:00",
      endTime: currentData?.workingHours?.endTime || "18:00",
    },

    // Privacy Settings
    dataAnalytics: currentData?.dataAnalytics ?? true,
    performanceTracking: currentData?.performanceTracking ?? true,
    anonymousUsageData: currentData?.anonymousUsageData ?? true,
    thirdPartyIntegrations: currentData?.thirdPartyIntegrations ?? true,
    publicProfile: currentData?.publicProfile ?? true,

    // Platform Features
    experimentalFeatures: currentData?.experimentalFeatures ?? false,
    betaTesting: currentData?.betaTesting ?? false,
    feedbackProgram: currentData?.feedbackProgram ?? true,
    communityAccess: currentData?.communityAccess ?? true,
    mentorshipProgram: currentData?.mentorshipProgram ?? false,

    // Terms Acceptance
    platformTermsAccepted: currentData?.platformTermsAccepted ?? false,
    creatorAgreementAccepted: currentData?.creatorAgreementAccepted ?? false,
    finalConsent: currentData?.finalConsent ?? false,
  });

  const timezoneOptions = [
    { value: "Asia/Kolkata", label: "Indian Standard Time (IST)" },
    { value: "Asia/Dubai", label: "Gulf Standard Time (GST)" },
    { value: "Asia/Singapore", label: "Singapore Standard Time (SGT)" },
    { value: "Europe/London", label: "Greenwich Mean Time (GMT)" },
    { value: "America/New_York", label: "Eastern Standard Time (EST)" },
    { value: "America/Los_Angeles", label: "Pacific Standard Time (PST)" },
  ];

  const daysOfWeek = [
    { value: "monday", label: "Monday" },
    { value: "tuesday", label: "Tuesday" },
    { value: "wednesday", label: "Wednesday" },
    { value: "thursday", label: "Thursday" },
    { value: "friday", label: "Friday" },
    { value: "saturday", label: "Saturday" },
    { value: "sunday", label: "Sunday" },
  ];

  const validateForm = useCallback(() => {
    const newErrors = {};

    if (formData.autoReplyEnabled && !formData.autoReplyMessage.trim()) {
      newErrors.autoReplyMessage =
        "Auto-reply message is required when auto-reply is enabled";
    }

    if (formData.workingHours.enabled) {
      if (!formData.workingHours.timezone) {
        newErrors.timezone = "Timezone is required";
      }
      if (formData.workingHours.days.length === 0) {
        newErrors.workingDays = "At least one working day must be selected";
      }
      if (!formData.workingHours.startTime) {
        newErrors.startTime = "Start time is required";
      }
      if (!formData.workingHours.endTime) {
        newErrors.endTime = "End time is required";
      }
      if (formData.workingHours.startTime && formData.workingHours.endTime) {
        if (formData.workingHours.startTime >= formData.workingHours.endTime) {
          newErrors.timeRange = "End time must be after start time";
        }
      }
    }

    if (!formData.platformTermsAccepted) {
      newErrors.platformTermsAccepted = "You must accept the platform terms";
    }

    if (!formData.creatorAgreementAccepted) {
      newErrors.creatorAgreementAccepted =
        "Creator agreement acceptance is required";
    }

    if (!formData.finalConsent) {
      newErrors.finalConsent =
        "Final consent is required to complete onboarding";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleInputChange = useCallback(
    (section, field, value) => {
      if (section) {
        setFormData((prev) => ({
          ...prev,
          [section]: {
            ...prev[section],
            [field]: value,
          },
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          [field]: value,
        }));
      }

      const errorKey = section ? `${section}.${field}` : field;
      if (errors[errorKey]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[errorKey];
          return newErrors;
        });
      }
    },
    [errors],
  );

  const handleWorkingDaysChange = useCallback((day) => {
    setFormData((prev) => ({
      ...prev,
      workingHours: {
        ...prev.workingHours,
        days: prev.workingHours.days.includes(day)
          ? prev.workingHours.days.filter((d) => d !== day)
          : [...prev.workingHours.days, day],
      },
    }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await submitStep6(formData);
      onUpdateData(formData);
      onNext();
    } catch (error) {
      setErrors({
        submit: error.message || "Failed to save platform preferences",
      });
    }
  };

  const NotificationSection = ({ title, notifications, section }) => (
    <div className="space-y-3">
      <h4 className="font-medium text-gray-900 dark:text-white">{title}</h4>
      <div className="space-y-3">
        {Object.entries(notifications).map(([key, value]) => (
          <label key={key} className="flex items-center justify-between">
            <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
              {key.replace(/([A-Z])/g, " $1").toLowerCase()}
            </span>
            <input
              type="checkbox"
              checked={value}
              onChange={(e) =>
                handleInputChange(section, key, e.target.checked)
              }
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Platform Preferences
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Customize your experience and communication preferences on RexBuz.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Notification Preferences */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Notification Preferences
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <NotificationSection
                title="Email Notifications"
                notifications={formData.emailNotifications}
                section="emailNotifications"
              />
              <NotificationSection
                title="Push Notifications"
                notifications={formData.pushNotifications}
                section="pushNotifications"
              />
              <NotificationSection
                title="SMS Notifications"
                notifications={formData.smsNotifications}
                section="smsNotifications"
              />
            </div>
          </div>

          {/* Discovery & Visibility */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Discovery & Visibility
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Profile Visibility
                </label>
                <select
                  value={formData.profileVisibility}
                  onChange={(e) =>
                    handleInputChange(null, "profileVisibility", e.target.value)
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                >
                  <option value="public">Public - Visible to everyone</option>
                  <option value="brands_only">
                    Brands Only - Visible to verified brands
                  </option>
                  <option value="private">Private - Not searchable</option>
                </select>
              </div>

              <div className="space-y-4">
                <label className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Searchable by brands
                  </span>
                  <input
                    type="checkbox"
                    checked={formData.searchableByBrands}
                    onChange={(e) =>
                      handleInputChange(
                        null,
                        "searchableByBrands",
                        e.target.checked,
                      )
                    }
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </label>

                <label className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Show in recommendations
                  </span>
                  <input
                    type="checkbox"
                    checked={formData.showInRecommendations}
                    onChange={(e) =>
                      handleInputChange(
                        null,
                        "showInRecommendations",
                        e.target.checked,
                      )
                    }
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </label>

                <label className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Allow direct contact
                  </span>
                  <input
                    type="checkbox"
                    checked={formData.allowDirectContact}
                    onChange={(e) =>
                      handleInputChange(
                        null,
                        "allowDirectContact",
                        e.target.checked,
                      )
                    }
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </label>

                <label className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Showcase performance metrics
                  </span>
                  <input
                    type="checkbox"
                    checked={formData.showcaseMetrics}
                    onChange={(e) =>
                      handleInputChange(
                        null,
                        "showcaseMetrics",
                        e.target.checked,
                      )
                    }
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </label>

                <label className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Display public rates
                  </span>
                  <input
                    type="checkbox"
                    checked={formData.displayRates}
                    onChange={(e) =>
                      handleInputChange(null, "displayRates", e.target.checked)
                    }
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Communication Preferences */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Communication Preferences
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Preferred Contact Method
                </label>
                <select
                  value={formData.preferredContactMethod}
                  onChange={(e) =>
                    handleInputChange(
                      null,
                      "preferredContactMethod",
                      e.target.value,
                    )
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                >
                  <option value="platform_chat">Platform Chat</option>
                  <option value="email">Email</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="phone">Phone Call</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Response Time Expectation
                </label>
                <select
                  value={formData.responseTimeExpectation}
                  onChange={(e) =>
                    handleInputChange(
                      null,
                      "responseTimeExpectation",
                      e.target.value,
                    )
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                >
                  <option value="immediate">Within 1 hour</option>
                  <option value="2_hours">Within 2 hours</option>
                  <option value="6_hours">Within 6 hours</option>
                  <option value="24_hours">Within 24 hours</option>
                  <option value="48_hours">Within 48 hours</option>
                  <option value="weekend">During weekdays only</option>
                </select>
              </div>
            </div>

            {/* Auto-Reply Settings */}
            <div className="mb-6">
              <label className="flex items-center mb-3">
                <input
                  type="checkbox"
                  checked={formData.autoReplyEnabled}
                  onChange={(e) =>
                    handleInputChange(
                      null,
                      "autoReplyEnabled",
                      e.target.checked,
                    )
                  }
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Enable auto-reply messages
                </span>
              </label>

              {formData.autoReplyEnabled && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Auto-Reply Message
                  </label>
                  <textarea
                    value={formData.autoReplyMessage}
                    onChange={(e) =>
                      handleInputChange(
                        null,
                        "autoReplyMessage",
                        e.target.value,
                      )
                    }
                    placeholder="Thank you for your message. I'll get back to you within 24 hours."
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                  />
                  {errors.autoReplyMessage && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.autoReplyMessage}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Working Hours */}
            <div>
              <label className="flex items-center mb-4">
                <input
                  type="checkbox"
                  checked={formData.workingHours.enabled}
                  onChange={(e) =>
                    handleInputChange(
                      "workingHours",
                      "enabled",
                      e.target.checked,
                    )
                  }
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Set working hours
                </span>
              </label>

              {formData.workingHours.enabled && (
                <div className="space-y-4 pl-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Timezone
                      </label>
                      <select
                        value={formData.workingHours.timezone}
                        onChange={(e) =>
                          handleInputChange(
                            "workingHours",
                            "timezone",
                            e.target.value,
                          )
                        }
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                      >
                        {timezoneOptions.map((timezone) => (
                          <option key={timezone.value} value={timezone.value}>
                            {timezone.label}
                          </option>
                        ))}
                      </select>
                      {errors.timezone && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.timezone}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Start Time
                      </label>
                      <input
                        type="time"
                        value={formData.workingHours.startTime}
                        onChange={(e) =>
                          handleInputChange(
                            "workingHours",
                            "startTime",
                            e.target.value,
                          )
                        }
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                      />
                      {errors.startTime && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.startTime}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        End Time
                      </label>
                      <input
                        type="time"
                        value={formData.workingHours.endTime}
                        onChange={(e) =>
                          handleInputChange(
                            "workingHours",
                            "endTime",
                            e.target.value,
                          )
                        }
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                      />
                      {errors.endTime && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.endTime}
                        </p>
                      )}
                    </div>
                  </div>

                  {errors.timeRange && (
                    <p className="text-red-500 text-xs">{errors.timeRange}</p>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Working Days
                    </label>
                    <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
                      {daysOfWeek.map((day) => (
                        <label key={day.value} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.workingHours.days.includes(
                              day.value,
                            )}
                            onChange={() => handleWorkingDaysChange(day.value)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-xs text-gray-700 dark:text-gray-300">
                            {day.label.slice(0, 3)}
                          </span>
                        </label>
                      ))}
                    </div>
                    {errors.workingDays && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.workingDays}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Privacy & Data Settings */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Privacy & Data Settings
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <label className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Performance analytics
                  </span>
                  <input
                    type="checkbox"
                    checked={formData.dataAnalytics}
                    onChange={(e) =>
                      handleInputChange(null, "dataAnalytics", e.target.checked)
                    }
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </label>

                <label className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Performance tracking
                  </span>
                  <input
                    type="checkbox"
                    checked={formData.performanceTracking}
                    onChange={(e) =>
                      handleInputChange(
                        null,
                        "performanceTracking",
                        e.target.checked,
                      )
                    }
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </label>

                <label className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Anonymous usage data
                  </span>
                  <input
                    type="checkbox"
                    checked={formData.anonymousUsageData}
                    onChange={(e) =>
                      handleInputChange(
                        null,
                        "anonymousUsageData",
                        e.target.checked,
                      )
                    }
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </label>
              </div>

              <div className="space-y-4">
                <label className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Third-party integrations
                  </span>
                  <input
                    type="checkbox"
                    checked={formData.thirdPartyIntegrations}
                    onChange={(e) =>
                      handleInputChange(
                        null,
                        "thirdPartyIntegrations",
                        e.target.checked,
                      )
                    }
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </label>

                <label className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Public profile
                  </span>
                  <input
                    type="checkbox"
                    checked={formData.publicProfile}
                    onChange={(e) =>
                      handleInputChange(null, "publicProfile", e.target.checked)
                    }
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Platform Features */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Platform Features
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <label className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Experimental features
                  </span>
                  <input
                    type="checkbox"
                    checked={formData.experimentalFeatures}
                    onChange={(e) =>
                      handleInputChange(
                        null,
                        "experimentalFeatures",
                        e.target.checked,
                      )
                    }
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </label>

                <label className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Beta testing program
                  </span>
                  <input
                    type="checkbox"
                    checked={formData.betaTesting}
                    onChange={(e) =>
                      handleInputChange(null, "betaTesting", e.target.checked)
                    }
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </label>

                <label className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Feedback program
                  </span>
                  <input
                    type="checkbox"
                    checked={formData.feedbackProgram}
                    onChange={(e) =>
                      handleInputChange(
                        null,
                        "feedbackProgram",
                        e.target.checked,
                      )
                    }
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </label>
              </div>

              <div className="space-y-4">
                <label className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Community access
                  </span>
                  <input
                    type="checkbox"
                    checked={formData.communityAccess}
                    onChange={(e) =>
                      handleInputChange(
                        null,
                        "communityAccess",
                        e.target.checked,
                      )
                    }
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </label>

                <label className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Mentorship program
                  </span>
                  <input
                    type="checkbox"
                    checked={formData.mentorshipProgram}
                    onChange={(e) =>
                      handleInputChange(
                        null,
                        "mentorshipProgram",
                        e.target.checked,
                      )
                    }
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Final Terms & Agreements */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Final Agreements
            </h3>

            <div className="space-y-4">
              <label className="flex items-start">
                <input
                  type="checkbox"
                  checked={formData.platformTermsAccepted}
                  onChange={(e) =>
                    handleInputChange(
                      null,
                      "platformTermsAccepted",
                      e.target.checked,
                    )
                  }
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-1"
                />
                <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">
                  I accept the{" "}
                  <a
                    href="/platform-terms"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    Platform Terms & Conditions
                  </a>
                </span>
              </label>
              {errors.platformTermsAccepted && (
                <p className="text-red-500 text-xs ml-6">
                  {errors.platformTermsAccepted}
                </p>
              )}

              <label className="flex items-start">
                <input
                  type="checkbox"
                  checked={formData.creatorAgreementAccepted}
                  onChange={(e) =>
                    handleInputChange(
                      null,
                      "creatorAgreementAccepted",
                      e.target.checked,
                    )
                  }
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-1"
                />
                <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">
                  I accept the{" "}
                  <a
                    href="/creator-agreement"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    Creator Partnership Agreement
                  </a>
                </span>
              </label>
              {errors.creatorAgreementAccepted && (
                <p className="text-red-500 text-xs ml-6">
                  {errors.creatorAgreementAccepted}
                </p>
              )}

              <label className="flex items-start">
                <input
                  type="checkbox"
                  checked={formData.finalConsent}
                  onChange={(e) =>
                    handleInputChange(null, "finalConsent", e.target.checked)
                  }
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-1"
                />
                <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">
                  I confirm that all information provided is accurate and I'm
                  ready to start my creator journey with RexBuz
                </span>
              </label>
              {errors.finalConsent && (
                <p className="text-red-500 text-xs ml-6">
                  {errors.finalConsent}
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
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Completing Onboarding..." : "Complete Onboarding"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OnboardingStep6;
