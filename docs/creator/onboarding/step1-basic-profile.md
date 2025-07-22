# Step 1: Basic Profile API

## Endpoint
`POST /api/v1/creator/onboarding/step1/basic-profile`

## Purpose
Submit creator's basic profile information including personal details, location, languages, and optional profile picture.

## Authentication
- **Required**: Bearer token in Authorization header
- **Format**: `Authorization: Bearer <jwt_token>`

## Request Headers
```http
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data
User-Agent: Influbazzar-Frontend/1.0.0
ngrok-skip-browser-warning: true
```

## Request Body (FormData)

### Required Fields
| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `display_name` | string | Unique display name for creator | "john_creator" |
| `gender` | string | Creator's gender | "male", "female", "other", "prefer_not_to_say" |
| `country` | string | Country code (ISO 3166-1 alpha-2) | "IN", "US", "GB" |
| `timezone` | string | IANA timezone identifier | "Asia/Kolkata" |
| `languages_spoken` | string (JSON array) | Languages the creator speaks | ["en", "hi", "te"] |

### Optional Fields
| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `city` | string | City name | "Mumbai" |
| `bio` | string | Short bio (max 500 chars) | "Content creator specializing in tech reviews" |
| `profile_picture` | File | Profile image (JPEG/PNG/WebP, max 5MB) | File object |

### Static Data Options

#### Countries
```json
[
  {"code": "IN", "name": "India"},
  {"code": "US", "name": "United States"},
  {"code": "GB", "name": "United Kingdom"},
  {"code": "CA", "name": "Canada"},
  {"code": "AU", "name": "Australia"},
  {"code": "DE", "name": "Germany"},
  {"code": "FR", "name": "France"},
  {"code": "SG", "name": "Singapore"},
  {"code": "AE", "name": "United Arab Emirates"},
  {"code": "JP", "name": "Japan"}
]
```

#### Languages
```json
[
  {"code": "en", "name": "English"},
  {"code": "hi", "name": "Hindi"},
  {"code": "te", "name": "Telugu"},
  {"code": "ta", "name": "Tamil"},
  {"code": "bn", "name": "Bengali"},
  {"code": "mr", "name": "Marathi"},
  {"code": "gu", "name": "Gujarati"},
  {"code": "ur", "name": "Urdu"},
  {"code": "kn", "name": "Kannada"},
  {"code": "ml", "name": "Malayalam"}
]
```

#### Timezones
```json
[
  {
    "value": "Asia/Kolkata",
    "label": "(UTC+05:30) Mumbai, Kolkata, Chennai, New Delhi",
    "offset": "+05:30"
  },
  {
    "value": "America/New_York", 
    "label": "(UTC-05:00) Eastern Time (US & Canada)",
    "offset": "-05:00"
  },
  {
    "value": "Europe/London",
    "label": "(UTC+00:00) Greenwich Mean Time", 
    "offset": "+00:00"
  }
]
```

## Example Request
```bash
curl -X POST "https://api.influbazzar.com/api/v1/creator/onboarding/step1/basic-profile" \
  -H "Authorization: Bearer <jwt_token>" \
  -H "Content-Type: multipart/form-data" \
  -F "display_name=john_creator" \
  -F "gender=male" \
  -F "country=IN" \
  -F "timezone=Asia/Kolkata" \
  -F "languages_spoken=[\"en\",\"hi\"]" \
  -F "city=Mumbai" \
  -F "bio=Tech content creator" \
  -F "profile_picture=@profile.jpg"
```

## Success Response (200)
```json
{
  "success": true,
  "message": "Basic profile submitted successfully",
  "data": {
    "step": 1,
    "completed": true,
    "next_step": 2,
    "progress_percentage": 16.67,
    "profile": {
      "display_name": "john_creator",
      "gender": "male",
      "country": "IN",
      "city": "Mumbai",
      "timezone": "Asia/Kolkata",
      "languages_spoken": ["en", "hi"],
      "bio": "Tech content creator",
      "profile_picture_url": "https://cdn.influbazzar.com/profiles/user123/profile.jpg"
    }
  }
}
```

## Error Responses

### 401 Unauthorized
```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or expired token"
  }
}
```

### 422 Validation Error
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "display_name",
        "message": "Display name already exists"
      },
      {
        "field": "languages_spoken",
        "message": "At least one language must be selected"
      }
    ]
  }
}
```

### 413 Payload Too Large
```json
{
  "error": {
    "code": "FILE_TOO_LARGE",
    "message": "Profile picture must be less than 5MB"
  }
}
```

## Validation Rules

### Display Name
- **Required**: Yes
- **Length**: 3-30 characters
- **Pattern**: Alphanumeric + underscore only
- **Unique**: Must be unique across platform

### Gender
- **Required**: Yes
- **Values**: "male", "female", "other", "prefer_not_to_say"

### Country
- **Required**: Yes
- **Format**: ISO 3166-1 alpha-2 code
- **Validation**: Must exist in supported countries list

### Timezone
- **Required**: Yes
- **Format**: IANA timezone identifier
- **Validation**: Must be valid timezone

### Languages
- **Required**: Yes
- **Min**: At least 1 language
- **Max**: Up to 10 languages
- **Format**: Array of language codes

### Profile Picture
- **Required**: No
- **Formats**: JPEG, PNG, WebP
- **Size**: Max 5MB
- **Dimensions**: Recommended square, min 200x200px

## Notes
- Frontend handles static data for countries, languages, and timezones
- No separate API calls needed for reference data
- Profile picture is processed and stored on CDN
- Display name availability should be checked before submission
