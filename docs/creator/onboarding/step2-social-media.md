# Step 2: Social Media Integration API

## Endpoint
`POST /api/v1/creator/onboarding/step2/social-media`

## Purpose
Submit creator's social media platform profiles and follower statistics.

## Authentication
- **Required**: Bearer token in Authorization header
- **Format**: `Authorization: Bearer <jwt_token>`

## Request Headers
```http
Authorization: Bearer <jwt_token>
Content-Type: application/json
User-Agent: Influbazzar-Frontend/1.0.0
ngrok-skip-browser-warning: true
```

## Request Body (JSON)

### Structure
```json
{
  "social_media_profiles": [
    {
      "platform": "instagram",
      "username": "john_creator",
      "followers_count": 10000,
      "profile_url": "https://instagram.com/john_creator",
      "verified": false,
      "engagement_rate": 3.2,
      "content_categories": ["tech", "lifestyle"]
    }
  ]
}
```

### Platform Object Fields
| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `platform` | string | Yes | Platform identifier | "instagram", "youtube", "tiktok" |
| `username` | string | Yes | Username/handle on platform | "john_creator" |
| `followers_count` | integer | Yes | Number of followers | 10000 |
| `profile_url` | string | Yes | Full URL to profile | "https://instagram.com/john_creator" |
| `verified` | boolean | No | Platform verification status | true/false |
| `engagement_rate` | float | No | Engagement rate percentage | 3.2 |
| `content_categories` | array | No | Content categories | ["tech", "lifestyle"] |

### Supported Platforms
```json
[
  {
    "id": "instagram",
    "name": "Instagram",
    "icon": "📷",
    "url_pattern": "https://instagram.com/{username}",
    "min_followers": 1000
  },
  {
    "id": "youtube", 
    "name": "YouTube",
    "icon": "🎥",
    "url_pattern": "https://youtube.com/@{username}",
    "min_followers": 100
  },
  {
    "id": "tiktok",
    "name": "TikTok", 
    "icon": "🎵",
    "url_pattern": "https://tiktok.com/@{username}",
    "min_followers": 500
  },
  {
    "id": "twitter",
    "name": "Twitter/X",
    "icon": "🐦", 
    "url_pattern": "https://twitter.com/{username}",
    "min_followers": 500
  },
  {
    "id": "linkedin",
    "name": "LinkedIn",
    "icon": "💼",
    "url_pattern": "https://linkedin.com/in/{username}",
    "min_followers": 200
  },
  {
    "id": "facebook",
    "name": "Facebook",
    "icon": "📘",
    "url_pattern": "https://facebook.com/{username}",
    "min_followers": 1000
  }
]
```

## Example Request
```bash
curl -X POST "https://api.influbazzar.com/api/v1/creator/onboarding/step2/social-media" \
  -H "Authorization: Bearer <jwt_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "social_media_profiles": [
      {
        "platform": "instagram",
        "username": "john_creator",
        "followers_count": 15000,
        "profile_url": "https://instagram.com/john_creator",
        "verified": false,
        "engagement_rate": 4.2,
        "content_categories": ["tech", "reviews"]
      },
      {
        "platform": "youtube",
        "username": "JohnCreator",
        "followers_count": 5000,
        "profile_url": "https://youtube.com/@JohnCreator",
        "verified": true,
        "engagement_rate": 6.8,
        "content_categories": ["tech", "tutorials"]
      }
    ]
  }'
```

## Success Response (200)
```json
{
  "success": true,
  "message": "Social media profiles submitted successfully",
  "data": {
    "step": 2,
    "completed": true,
    "next_step": 3,
    "progress_percentage": 33.33,
    "profiles": [
      {
        "platform": "instagram",
        "username": "john_creator", 
        "followers_count": 15000,
        "profile_url": "https://instagram.com/john_creator",
        "verified": false,
        "status": "verified",
        "verification_date": "2024-01-15T10:30:00Z"
      },
      {
        "platform": "youtube",
        "username": "JohnCreator",
        "followers_count": 5000,
        "profile_url": "https://youtube.com/@JohnCreator", 
        "verified": true,
        "status": "verified",
        "verification_date": "2024-01-15T10:30:00Z"
      }
    ],
    "total_reach": 20000,
    "avg_engagement_rate": 5.5
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
        "field": "social_media_profiles[0].platform",
        "message": "Unsupported platform"
      },
      {
        "field": "social_media_profiles[0].followers_count",
        "message": "Minimum 1000 followers required for Instagram"
      },
      {
        "field": "social_media_profiles[1].profile_url",
        "message": "Invalid URL format"
      }
    ]
  }
}
```

### 409 Conflict
```json
{
  "error": {
    "code": "PROFILE_ALREADY_CLAIMED",
    "message": "This social media profile is already claimed by another creator",
    "details": {
      "platform": "instagram", 
      "username": "john_creator"
    }
  }
}
```

## Validation Rules

### Platform
- **Required**: Yes
- **Values**: Must be from supported platforms list
- **Unique**: No duplicate platforms per submission

### Username
- **Required**: Yes
- **Length**: 3-50 characters
- **Pattern**: Platform-specific validation
- **Unique**: Must not be claimed by another creator

### Followers Count
- **Required**: Yes
- **Type**: Positive integer
- **Minimum**: Platform-specific minimum requirements
- **Maximum**: 100,000,000 (sanity check)

### Profile URL
- **Required**: Yes
- **Format**: Valid URL matching platform pattern
- **Validation**: URL must be accessible and match username

### Engagement Rate
- **Required**: No
- **Type**: Float
- **Range**: 0.0 - 100.0
- **Precision**: 2 decimal places

## Profile Verification Process

1. **URL Validation**: Check if profile URL is accessible
2. **Username Match**: Verify username in URL matches provided username
3. **Follower Count**: Validate follower count is within reasonable range
4. **Duplicate Check**: Ensure profile not claimed by another creator
5. **Platform Requirements**: Check minimum follower requirements
6. **Content Analysis**: Optional content category verification

## Notes
- At least one social media profile is required
- Maximum 6 platforms per creator
- Profile verification may take 24-48 hours
- Follower counts are periodically updated
- Engagement rates are calculated automatically if not provided
