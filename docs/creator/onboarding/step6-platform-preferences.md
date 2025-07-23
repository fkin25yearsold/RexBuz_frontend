# Step 6: Platform Preferences API

## Endpoint
`POST /api/v1/creator/onboarding/step6/platform-preferences`

## Purpose
Submit final platform preferences, notification settings, and complete the onboarding process.

## Authentication
- **Required**: Bearer token in Authorization header
- **Format**: `Authorization: Bearer <jwt_token>`

## Request Headers
```http
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

## Request Body (JSON)
```json
{
  "notification_preferences": {
    "email_notifications": true,
    "sms_notifications": false,
    "push_notifications": true,
    "campaign_alerts": true,
    "payment_notifications": true,
    "marketing_emails": false
  },
  "availability": {
    "status": "available",
    "weekly_hours": 20,
    "preferred_schedule": "flexible",
    "blackout_dates": ["2024-02-15", "2024-02-16"]
  },
  "pricing_preferences": {
    "hourly_rate": 500,
    "project_minimum": 5000,
    "currency": "INR",
    "payment_terms": "net_30"
  },
  "platform_features": {
    "auto_apply_campaigns": true,
    "public_profile": true,
    "portfolio_showcase": true,
    "analytics_sharing": true
  }
}
```

## Success Response (200)
```json
{
  "success": true,
  "message": "Onboarding completed successfully! Welcome to Influbazzar!",
  "data": {
    "step": 6,
    "completed": true,
    "next_step": null,
    "progress_percentage": 100,
    "onboarding_status": "completed",
    "profile_status": "active",
    "dashboard_url": "/dashboard",
    "welcome_bonus": {
      "amount": 1000,
      "currency": "INR",
      "description": "Welcome bonus for completing onboarding"
    }
  }
}
```

## Completion
After successful submission of Step 6:
- Creator profile becomes active
- Can access full dashboard
- Eligible for campaign applications
- Receives welcome bonus
- Onboarding status marked as completed
