# Step 4: Portfolio API

## Endpoint
`POST /api/v1/creator/onboarding/step4/portfolio`

## Purpose
Submit creator's portfolio including past work samples, achievements, and notable collaborations.

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
  "portfolio_items": [
    {
      "type": "campaign",
      "title": "Tech Product Review - Smartphone XYZ",
      "description": "Comprehensive review of latest flagship smartphone",
      "url": "https://instagram.com/p/abc123",
      "thumbnail_url": "https://cdn.example.com/thumb.jpg",
      "metrics": {
        "views": 50000,
        "likes": 2500,
        "comments": 150,
        "shares": 75
      },
      "brand": "TechCorp",
      "date": "2024-01-15"
    }
  ],
  "achievements": [
    {
      "type": "milestone",
      "title": "Reached 10K Followers",
      "platform": "instagram",
      "date": "2024-01-01"
    }
  ],
  "notable_collaborations": [
    {
      "brand_name": "TechCorp",
      "campaign_type": "product_review",
      "duration": "1_month",
      "budget_range": "5000-10000",
      "results_summary": "Increased brand awareness by 25%"
    }
  ]
}
```

## Success Response (200)
```json
{
  "success": true,
  "message": "Portfolio submitted successfully",
  "data": {
    "step": 4,
    "completed": true,
    "next_step": 5,
    "progress_percentage": 66.67
  }
}
```
