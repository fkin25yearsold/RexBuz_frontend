# API Endpoints Documentation

## Base Configuration
- **Base URL**: `https://9fe0fbbfff8d.ngrok-free.app`
- **API Version**: `v1`
- **Full Base**: `https://9fe0fbbfff8d.ngrok-free.app/api/v1`

## Authentication Endpoints

### 1. POST `/api/v1/auth/signup`
**Purpose**: User registration for creators
**Request Headers**:
```
Content-Type: application/json
ngrok-skip-browser-warning: true
User-Agent: Influbazzar-Frontend/1.0.0
```
**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "full_name": "John Doe",
  "phone": "+1234567890" // optional
}
```
**Success Response (201)**:
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "full_name": "John Doe",
    "is_verified": false
  }
}
```
**Error Responses**:
- `400`: Email already registered
- `422`: Validation error (missing fields, invalid email format)

### 2. POST `/api/v1/auth/login`
**Purpose**: User authentication for creators
**Request Headers**:
```
Content-Type: application/json
ngrok-skip-browser-warning: true
X-Device-Fingerprint: base64EncodedFingerprint
X-Real-IP: userIPAddress
```
**Request Body**:
```json
{
  "email_or_phone": "user@example.com",
  "password": "securePassword123",
  "remember_me": false
}
```
**Success Response (200)**:
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "full_name": "John Doe",
    "is_verified": true
  },
  "access_token": "jwt_token_here",
  "refresh_token": "refresh_token_here",
  "onboarding": {
    "onboarding_required": true,
    "completion_percentage": 75,
    "next_step": {
      "step": 3,
      "title": "Complete your profile"
    },
    "message": "Continue your onboarding process"
  }
}
```
**Error Responses**:
- `401`: Invalid credentials
- `403`: Account verification required
- `422`: **CURRENT ISSUE** - Pydantic validation error (missing email_or_phone and password fields)
- `423`: Account locked
- `429`: Too many attempts

### 3. POST `/api/v1/auth/request-otp`
**Purpose**: Send OTP for email/phone verification
**Request Body**:
```json
{
  "email_or_phone": "user@example.com",
  "otp_type": "email" // or "phone"
}
```

### 4. POST `/api/v1/auth/verify-otp/email`
**Purpose**: Verify email OTP
**Request Body**:
```json
{
  "email": "user@example.com",
  "email_otp": "123456"
}
```

### 5. POST `/api/v1/auth/verify-otp/phone`
**Purpose**: Verify phone OTP
**Request Body**:
```json
{
  "phone_number": "+1234567890",
  "phone_otp": "123456"
}
```

## Creator Onboarding Endpoints

### 6. GET `/api/v1/creator/onboarding/status`
**Purpose**: Get current onboarding progress and next steps
**Headers**: 
```
Authorization: Bearer jwt_token
```
**Success Response (200)**:
```json
{
  "success": true,
  "data": {
    "onboarding_required": true,
    "is_completed": false,
    "completion_percentage": 75,
    "current_step": 3,
    "completed_steps": [1, 2],
    "next_step": {
      "step": 3,
      "title": "Social Media Integration"
    }
  }
}
```
**Error Responses**:
- `403`: Not authenticated
- `500`: **CURRENT ISSUE** - Pydantic validation error (backend schema mismatch)

### 7. GET `/api/v1/creator/onboarding/display-name/check/{display_name}`
**Purpose**: Check if display name is available
**Headers**: 
```
Authorization: Bearer jwt_token
```
**Success Response (200)**:
```json
{
  "available": true,
  "message": "Display name is available"
}
```
**Error Responses**:
- `400`: Invalid display name format
- `409`: Display name already taken

### 8. POST `/api/v1/creator/onboarding/step1/basic-profile`
**Purpose**: Submit basic profile information (Step 1)
**Headers**: 
```
Authorization: Bearer jwt_token
Content-Type: multipart/form-data
```
**Request Body (FormData)**:
```
display_name: "johndoe"
gender: "male"
country: "IN"
timezone: "Asia/Kolkata"
languages_spoken: ["en", "hi"]
city: "Mumbai" // optional
bio: "Content creator" // optional
profile_picture: File // optional
```
**Error Responses**:
- `403`: **CURRENT ISSUE** - Not authenticated (token expired/invalid)
- `422`: Validation error (missing required fields)

### 9. POST `/api/v1/creator/onboarding/step2/social-media`
**Purpose**: Submit social media profiles (Step 2)
**Headers**: 
```
Authorization: Bearer jwt_token
Content-Type: application/json
```
**Request Body**:
```json
{
  "social_media_profiles": [
    {
      "platform": "instagram",
      "username": "johndoe",
      "followers_count": 10000,
      "profile_url": "https://instagram.com/johndoe"
    }
  ]
}
```

### 10. POST `/api/v1/creator/onboarding/step3/niche-preferences`
**Purpose**: Submit niche and content preferences (Step 3)

### 11. POST `/api/v1/creator/onboarding/step4/portfolio`
**Purpose**: Submit portfolio and past work (Step 4)

### 12. POST `/api/v1/creator/onboarding/step5/verification`
**Purpose**: Submit verification documents (Step 5)

### 13. POST `/api/v1/creator/onboarding/step6/platform-preferences`
**Purpose**: Submit platform and collaboration preferences (Step 6)

## Reference Data Endpoints

### 14. GET `/api/v1/creator/onboarding/countries`
**Purpose**: Get list of supported countries
**Success Response (200)**:
```json
{
  "data": {
    "countries": [
      {"code": "IN", "name": "India"},
      {"code": "US", "name": "United States"}
    ]
  }
}
```
**Error Responses**:
- `404`: **CURRENT ISSUE** - Endpoint not implemented yet

### 15. GET `/api/v1/creator/onboarding/languages`
**Purpose**: Get list of supported languages
**Success Response (200)**:
```json
{
  "data": {
    "languages": [
      {"code": "en", "name": "English"},
      {"code": "hi", "name": "Hindi"}
    ]
  }
}
```
**Error Responses**:
- `404`: **CURRENT ISSUE** - Endpoint not implemented yet

### 16. GET `/api/v1/creator/onboarding/timezones`
**Purpose**: Get list of supported timezones
**Success Response (200)**:
```json
{
  "data": {
    "timezones": [
      {
        "value": "Asia/Kolkata",
        "label": "(UTC+05:30) Mumbai, Kolkata, Chennai, New Delhi",
        "offset": "+05:30"
      }
    ]
  }
}
```
**Error Responses**:
- `404`: **CURRENT ISSUE** - Endpoint not implemented yet

## Current Issues Summary

### 🔴 Critical Backend Issues
1. **Login 422 Error**: Pydantic validation failing - backend expects different field names
2. **Onboarding Status 500 Error**: Schema mismatch between frontend and backend
3. **Step1 403 Error**: Authentication token issues

### 🟡 Missing Endpoints (404s)
1. **Countries endpoint**: Not implemented, using fallback data
2. **Languages endpoint**: Not implemented, using fallback data  
3. **Timezones endpoint**: Not implemented, using fallback data

### 🟢 Frontend Fixes Applied
1. **Body stream errors**: Fixed for all 4xx/5xx responses
2. **Response parsing**: Graceful error handling for backend issues
3. **Fallback data**: Used when reference endpoints return 404

## Recommended Backend Fixes

### 1. Login Endpoint (`POST /api/v1/auth/login`)
**Issue**: Expecting different field names
**Fix**: Update Pydantic model to accept:
```python
class LoginRequest(BaseModel):
    email_or_phone: str
    password: str
    remember_me: bool = False
```

### 2. Onboarding Status (`GET /api/v1/creator/onboarding/status`)
**Issue**: Response schema mismatch
**Fix**: Ensure response matches expected format with proper nesting

### 3. Reference Data Endpoints
**Issue**: 404 Not Found
**Fix**: Implement endpoints or document that frontend should use static data

The frontend is now resilient to these backend issues and provides fallback behavior.
