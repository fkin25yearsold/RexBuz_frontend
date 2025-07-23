# Creator Onboarding API Documentation

## Overview
The creator onboarding process consists of 6 steps that collect comprehensive information about content creators joining the Influbazzar platform.

## Onboarding Flow

### Step 1: Basic Profile
- **Endpoint**: `POST /api/v1/creator/onboarding/step1/basic-profile`
- **Purpose**: Personal information, location, languages
- **Data**: Name, gender, country, timezone, languages, bio, profile picture
- **Format**: `multipart/form-data` (for file upload)

### Step 2: Social Media Integration  
- **Endpoint**: `POST /api/v1/creator/onboarding/step2/social-media`
- **Purpose**: Social media profiles and follower statistics
- **Data**: Platform accounts, usernames, follower counts, verification status
- **Format**: `application/json`

### Step 3: Niche & Preferences
- **Endpoint**: `POST /api/v1/creator/onboarding/step3/niche-preferences`
- **Purpose**: Content niche, target audience, collaboration preferences
- **Data**: Content categories, audience demographics, brand preferences
- **Format**: `application/json`

### Step 4: Portfolio
- **Endpoint**: `POST /api/v1/creator/onboarding/step4/portfolio`
- **Purpose**: Past work, achievements, notable collaborations
- **Data**: Portfolio items, metrics, brand collaborations
- **Format**: `application/json`

### Step 5: Verification
- **Endpoint**: `POST /api/v1/creator/onboarding/step5/verification`
- **Purpose**: Identity verification and banking information
- **Data**: ID documents, address proof, bank details
- **Format**: `multipart/form-data` (for document uploads)

### Step 6: Platform Preferences
- **Endpoint**: `POST /api/v1/creator/onboarding/step6/platform-preferences`
- **Purpose**: Final settings and onboarding completion
- **Data**: Notifications, availability, pricing, platform features
- **Format**: `application/json`

## Common Headers
All onboarding endpoints require:
```http
Authorization: Bearer <jwt_token>
User-Agent: Influbazzar-Frontend/1.0.0
ngrok-skip-browser-warning: true
```

## Progress Tracking
Each step completion updates the creator's onboarding progress:
- Step 1: 16.67%
- Step 2: 33.33% 
- Step 3: 50.00%
- Step 4: 66.67%
- Step 5: 83.33%
- Step 6: 100.00% (Complete)

## Error Handling
All endpoints return consistent error format:
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": [] // Optional validation details
  }
}
```

## Status Endpoint
Check onboarding progress with:
`GET /api/v1/creator/onboarding/status`

Returns current step, completion percentage, and next required action.

## Frontend Considerations
- Countries, languages, and timezones are handled as static data in frontend
- No separate API calls needed for reference data
- Form validation happens on both frontend and backend
- Files are uploaded as part of form submission
- Display name availability is checked separately before Step 1 submission

## Security
- All endpoints require valid JWT authentication
- File uploads are scanned for security threats
- Personal information is encrypted at rest
- Bank details use additional encryption layer
- Identity documents are stored securely with restricted access
