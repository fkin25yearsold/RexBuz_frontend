# 🧪 Signup Flow Testing Guide

## ✅ Manual Testing Checklist

### 1. **Navigation Testing**

- [ ] Visit homepage (should load with Influbazzar hero section)
- [ ] Click "Sign Up" button in navbar → Should navigate to signup page
- [ ] Click "Join as Creator" button in hero section → Should navigate to signup page

### 2. **Signup Form Testing**

#### **Form Fields Validation**

- [ ] **Full Name**: Test empty, < 2 chars, > 100 chars, special characters
- [ ] **Phone Number**: Test empty, < 10 digits, invalid format, auto-formatting
- [ ] **Date of Birth**: Test empty, under 18 years, future date
- [ ] **Email**: Test empty, invalid format, valid format
- [ ] **Role**: Test empty selection, valid selections (Creator/Brand/Agency)
- [ ] **Password**: Test empty, < 8 chars, missing requirements
- [ ] **Repeat Password**: Test empty, non-matching passwords
- [ ] **Terms**: Test unchecked, checked

#### **Form Behavior**

- [ ] Submit button disabled when form invalid
- [ ] Submit button enabled when all fields valid
- [ ] Real-time validation on field blur
- [ ] Password strength meter shows correctly
- [ ] Phone number auto-formats (12345 67890 → 12345 67890)

### 3. **API Integration Testing**

#### **Valid Signup Test**

```
Full Name: Test User
Phone: 9876543210
DOB: 1990-01-01
Email: test@example.com
Role: creator
Password: StrongPass123!
Repeat Password: StrongPass123!
Terms: ✓ checked
```

**Expected**: Success modal → Redirect to OTP page

#### **Error Testing**

- [ ] Duplicate email → Should show error message
- [ ] Invalid data → Should show validation errors
- [ ] Network error → Should show connection error

### 4. **Theme Testing**

- [ ] Toggle light/dark theme works
- [ ] Theme persists across navigation
- [ ] All form elements respect theme

### 5. **Responsive Testing**

- [ ] Mobile view: Fields stack vertically
- [ ] Desktop view: Two-column layout
- [ ] Touch-friendly on mobile devices

## 🚀 Quick Test Scenario

1. **Start**: Visit homepage
2. **Navigate**: Click "Join as Creator" button
3. **Fill Form**:
   - Full Name: "John Doe"
   - Phone: "9876543210" (should format to "98765 43210")
   - DOB: Select date making user 18+
   - Email: "john@test.com"
   - Role: Select "Creator"
   - Password: "StrongPass123!"
   - Repeat Password: "StrongPass123!"
   - Check terms box
4. **Submit**: Click "Create Account"
5. **Verify**: Should show success modal and redirect to OTP

## 🔍 Things to Look For

### ✅ Good Signs

- Form fields validate in real-time
- Password strength meter updates
- Phone formats with space
- Submit button enables/disables correctly
- Success flow works smoothly
- Theme toggle works

### ❌ Issues to Watch

- Submit button not working
- Validation errors not showing
- API errors not handled
- Theme not switching
- Navigation not working
- Mobile layout issues

## 🌐 API Endpoint

The form connects to: `https://986f68cc5cd6.ngrok-free.app/api/v1/auth/signup`

## 📱 Role Selection Options

- **Creator**: Individual content creators, influencers
- **Brand**: Companies looking for marketing partnerships
- **Agency**: Marketing agencies managing campaigns

---

**Status**: ✅ Ready for Testing
**Integration**: ✅ Navbar Connected
**API**: ✅ Live Backend Connected
**Validation**: ✅ Comprehensive
**Responsive**: ✅ Mobile-First Design
