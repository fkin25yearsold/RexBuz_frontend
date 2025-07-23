# Step 5: Verification API

## Endpoint
`POST /api/v1/creator/onboarding/step5/verification`

## Purpose
Submit identity verification documents and banking information for creator verification.

## Authentication
- **Required**: Bearer token in Authorization header
- **Format**: `Authorization: Bearer <jwt_token>`

## Request Headers
```http
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data
```

## Request Body (FormData)
```
identity_document: File (required)
identity_type: string (required) - "passport", "national_id", "driving_license"
address_proof: File (required)
address_proof_type: string (required) - "utility_bill", "bank_statement", "rental_agreement"
bank_account_number: string (required)
bank_routing_number: string (required)
bank_name: string (required)
account_holder_name: string (required)
pan_number: string (optional, for Indian creators)
gstin: string (optional, for registered businesses)
```

## File Requirements
- **Formats**: JPEG, PNG, PDF
- **Size**: Max 10MB per file
- **Quality**: Readable text, clear images
- **Documents**: Must be government-issued and valid

## Success Response (200)
```json
{
  "success": true,
  "message": "Verification documents submitted successfully",
  "data": {
    "step": 5,
    "completed": true,
    "next_step": 6,
    "progress_percentage": 83.33,
    "verification_status": "pending",
    "estimated_review_time": "2-3 business days"
  }
}
```
