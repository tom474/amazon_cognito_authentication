#!/bin/bash

echo "🧪 Testing TOTP Setup During Sign In"
echo "===================================="
echo ""

echo "📋 Test Steps:"
echo "1. Navigate to http://localhost:3001/auth/signin"
echo "2. Enter email and password for a user that doesn't have TOTP set up"
echo "3. After clicking 'Sign In', you should see the QR code setup page"
echo "4. Scan QR code with authenticator app or use manual entry"
echo "5. Enter the 6-digit code from your authenticator app"
echo "6. Should successfully sign in after TOTP verification"
echo ""

echo "📋 Expected Behavior:"
echo "• QR code should be displayed immediately after entering credentials"
echo "• Manual secret key should be available as backup"
echo "• Download option should be available"
echo "• After successful TOTP setup, user should be signed in"
echo ""

echo "📋 Password Reset Email Test:"
echo "1. Go to http://localhost:3001/auth/reset-password"
echo "2. Enter your email address"
echo "3. Check your email inbox (not SMS) for reset code"
echo "4. Enter the code and new password"
echo "5. Should successfully reset password using EMAIL delivery"
echo ""

echo "🚀 Opening browser windows for testing..."
echo ""

# Open the signin page
if command -v start &> /dev/null; then
    start "http://localhost:3001/auth/signin"
elif command -v open &> /dev/null; then
    open "http://localhost:3001/auth/signin"
elif command -v xdg-open &> /dev/null; then
    xdg-open "http://localhost:3001/auth/signin"
else
    echo "Please manually open: http://localhost:3001/auth/signin"
fi

sleep 2

# Open the reset password page
if command -v start &> /dev/null; then
    start "http://localhost:3001/auth/reset-password"
elif command -v open &> /dev/null; then
    open "http://localhost:3001/auth/reset-password"
elif command -v xdg-open &> /dev/null; then
    xdg-open "http://localhost:3001/auth/reset-password"
else
    echo "Please manually open: http://localhost:3001/auth/reset-password"
fi

echo "✅ Test windows opened!"
echo ""
echo "📱 Recommended Authenticator Apps:"
echo "• Google Authenticator (iOS/Android)"
echo "• Microsoft Authenticator (iOS/Android)"
echo "• Authy (iOS/Android/Desktop)"
echo "• 1Password (with TOTP support)"
echo ""
echo "🔍 Debug Tips:"
echo "• Check browser console for error messages"
echo "• Ensure AWS Cognito is configured for TOTP"
echo "• Verify email delivery method is set properly"
echo "• Test with a fresh user account"
