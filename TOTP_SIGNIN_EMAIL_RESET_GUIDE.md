# TOTP QR Code Setup & Email Reset Testing Guide

## 🎯 Overview

This guide covers testing the two main fixes implemented:

1. **TOTP QR Code Setup**: After entering email/password, users are prompted to scan a QR code with their authenticator app
2. **Email-based Reset**: Password reset codes are sent via email instead of SMS

---

## 🔧 Fixed Issues

### Issue 1: TOTP Setup Not Triggering

**Problem**: After signing in, users weren't seeing the QR code setup page
**Solution**: Added proper detection for `CONTINUE_SIGN_IN_WITH_TOTP_SETUP` in the sign-in flow

### Issue 2: SMS Instead of Email for Reset

**Problem**: Password reset codes were being sent via SMS
**Solution**: Configured reset password to use email delivery method

---

## 🧪 Testing Instructions

### Test 1: TOTP QR Code Setup During Sign In

1. **Navigate to Sign In**: http://localhost:3001/auth/signin

2. **Enter Credentials**: Use credentials for a user who doesn't have TOTP set up yet

3. **Expected Flow**:

    ```
    Enter email/password → Click "Sign In" → QR Code Setup Page
    ```

4. **QR Code Setup Page Should Show**:

    - Large QR code for scanning
    - Manual entry option with secret key
    - Download QR code button
    - Step-by-step instructions
    - Cancel and continue buttons

5. **Test QR Code Scanning**:

    - Open authenticator app (Google Authenticator, Microsoft Authenticator, etc.)
    - Scan the QR code
    - Enter the 6-digit code from your app
    - Should successfully complete sign-in

6. **Test Manual Entry**:
    - Click "Can't scan QR code? Enter manually"
    - Copy the secret key to your authenticator app
    - Enter the generated 6-digit code
    - Should successfully complete sign-in

### Test 2: Email-based Password Reset

1. **Navigate to Reset**: http://localhost:3001/auth/reset-password

2. **Enter Email**: Use a valid registered email address

3. **Check Email Delivery**:

    - Code should be sent to EMAIL (not SMS)
    - Check your email inbox for reset code
    - Should NOT receive SMS message

4. **Complete Reset**:
    - Enter the email code and new password
    - Should successfully reset password

---

## 🔍 Debug Information

### Browser Console Logs

Look for these messages in browser console:

```javascript
// TOTP setup required
"TOTP setup required: {signInStep: 'CONTINUE_SIGN_IN_WITH_TOTP_SETUP'}";

// Reset password using email
"Reset password result: {...}";
```

### Expected Sign-In Flow States

```
1. User enters credentials
2. AWS Cognito detects TOTP not set up
3. Returns: CONTINUE_SIGN_IN_WITH_TOTP_SETUP
4. App triggers setupTOTP()
5. QR code displayed
6. User completes setup
7. Sign-in completes
```

### Expected Reset Flow

```
1. User enters email
2. resetPassword() called with deliveryMethod: 'EMAIL'
3. Code sent to email inbox
4. User enters code and new password
5. Password reset completes
```

---

## 📱 Supported Authenticator Apps

-   **Google Authenticator** (iOS/Android)
-   **Microsoft Authenticator** (iOS/Android)
-   **Authy** (iOS/Android/Desktop)
-   **1Password** (with TOTP support)
-   **Bitwarden** (with TOTP support)
-   **LastPass Authenticator**

---

## 🚨 Troubleshooting

### TOTP Setup Not Showing

-   Check browser console for errors
-   Verify user doesn't already have TOTP set up
-   Ensure AWS Cognito User Pool has TOTP MFA enabled
-   Try with a fresh user account

### Email Not Received

-   Check spam/junk folders
-   Verify email is correctly configured in Cognito
-   Ensure Cognito has email delivery configured
-   Try with a different email provider

### QR Code Not Scanning

-   Ensure QR code is fully visible
-   Try manual entry as backup
-   Check camera permissions on mobile device
-   Verify authenticator app supports TOTP

---

## 🔧 Code Changes Made

### AuthContext.tsx

-   Added TOTP setup detection in signIn()
-   Modified resetPassword() to use email delivery
-   Added proper error handling for TOTP flows

### signin/page.tsx

-   Enhanced TOTP setup flow integration
-   Added proper state management for QR display
-   Improved error handling and user feedback

### reset-password/page.tsx

-   Changed default MFA type from SMS to EMAIL
-   Updated MFA handling for email-based delivery

---

## ✅ Success Criteria

-   ✅ After sign-in, users see QR code setup page
-   ✅ QR code can be scanned by authenticator apps
-   ✅ Manual entry works as backup
-   ✅ TOTP verification completes sign-in
-   ✅ Password reset codes sent via email
-   ✅ No SMS messages sent for reset codes
-   ✅ Proper error handling and user feedback
