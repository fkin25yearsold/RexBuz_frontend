# Step 3: Niche & Preferences API

## Endpoint
`POST /api/v1/creator/onboarding/step3/niche-preferences`

## Purpose
Submit creator's content niche, audience demographics, and collaboration preferences.

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
  "content_niches": ["technology", "lifestyle", "education"],
  "primary_niche": "technology",
  "target_audience": {
    "age_groups": ["18-24", "25-34"],
    "genders": ["male", "female"],
    "locations": ["IN", "US", "GB"],
    "interests": ["tech", "gadgets", "reviews"]
  },
  "collaboration_preferences": {
    "brand_types": ["tech_companies", "startups", "established_brands"],
    "campaign_types": ["product_review", "sponsored_post", "brand_partnership"],
    "min_budget": 5000,
    "preferred_duration": "1-3_months"
  },
  "content_formats": ["video", "image", "story", "reel"],
  "posting_frequency": "daily"
}
```

## Success Response (200)
```json
{
  "success": true,
  "message": "Niche and preferences submitted successfully",
  "data": {
    "step": 3,
    "completed": true,
    "next_step": 4,
    "progress_percentage": 50.0
  }
}
```
