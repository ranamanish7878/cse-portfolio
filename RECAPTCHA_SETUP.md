# reCAPTCHA Implementation Guide

## What Was Added

### 1. Google reCAPTCHA v2 Integration
- Added reCAPTCHA widget to the subscription form
- Implemented both client-side and server-side validation
- Using Google's test keys for development

### 2. Current Production Keys
```
Site Key: 6LcJYvIrAAAAAOAMCG4o54I-7vCJzSf-jKFue61X
Secret Key: 6LcJYvIrAAAAAFk_i5NhqROBLEYfleVhY7eP7YnN
```

**Note:** These are your registered production keys for ranamanish7878.github.io and localhost.

### 3. Testing Locally
1. Server is running on: http://localhost:8081
2. Navigate to the Subscribe section
3. Fill in name and email
4. Complete the reCAPTCHA checkbox
5. Click "Subscribe Now"

### 4. How It Works

**Client-Side (index.html):**
- Loads Google reCAPTCHA script
- Displays dark-themed reCAPTCHA widget
- Validates that user completed reCAPTCHA before form submission
- Sends reCAPTCHA token to backend
- Resets reCAPTCHA after submission (success or error)

**Server-Side (server.js):**
- Receives reCAPTCHA token from client
- Verifies token with Google's API
- Checks for duplicate emails in CSV
- Only saves subscription if reCAPTCHA passes and email is unique

### 5. For Production Deployment

When deploying to production (GitHub Pages with Formspree):

1. **Get your own reCAPTCHA keys:**
   - Visit: https://www.google.com/recaptcha/admin/create
   - Select reCAPTCHA v2 (Checkbox)
   - Add your domains (e.g., ranamanish7878.github.io)
   - Copy Site Key and Secret Key

2. **Update keys in code:**
   ```html
   <!-- In index.html, line ~9 -->
   <div class="g-recaptcha" data-sitekey="YOUR_SITE_KEY_HERE" data-theme="dark"></div>
   ```
   
   ```javascript
   // In server.js, line ~9
   const RECAPTCHA_SECRET_KEY = 'YOUR_SECRET_KEY_HERE';
   ```

3. **For Formspree:**
   - Formspree has built-in spam protection
   - reCAPTCHA primarily protects localhost backend
   - For deployed site, consider using Formspree's captcha or your own serverless function

### 6. Features Implemented
✅ Client-side reCAPTCHA validation
✅ Server-side reCAPTCHA verification
✅ Dark theme integration matching site design
✅ Duplicate email prevention (localhost)
✅ Auto-reset reCAPTCHA after submission
✅ User-friendly error messages
✅ Works with existing Formspree integration

### 7. Error Messages
- "Please complete the reCAPTCHA verification." - User didn't check the box
- "reCAPTCHA verification failed. Please try again." - Invalid token
- "This email is already subscribed!" - Duplicate email (localhost only)

### 8. Testing Tips
- The test keys always show "I'm not a robot" checkbox
- In production, Google may show image challenges for suspicious traffic
- Test both successful submissions and error cases
- Verify reCAPTCHA resets properly after each attempt

### 9. Browser Compatibility
- Works on all modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile responsive design
- Falls back gracefully if JavaScript is disabled (form won't submit)

## Current Status
✅ Server running on http://localhost:8081
✅ reCAPTCHA widget visible on form
✅ Backend validation implemented
✅ Ready for testing!
