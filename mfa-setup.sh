#!/bin/bash

# MFA Configuration Setup Script for AWS Cognito
# This script helps configure MFA for testing purposes

echo "🔐 AWS Cognito MFA Configuration Helper"
echo "======================================="
echo ""

USER_POOL_ID="us-east-1_vPj8LyrMQ"
REGION="us-east-1"

echo "📋 Current Configuration:"
echo "User Pool ID: $USER_POOL_ID"
echo "Region: $REGION"
echo ""

echo "🎯 To enable MFA for your User Pool:"
echo "1. Open AWS Console: https://console.aws.amazon.com/cognito/"
echo "2. Go to User pools → $USER_POOL_ID"
echo "3. Go to Sign-in experience → Multi-factor authentication"
echo "4. Select 'Optional' or 'Required' for MFA"
echo "5. Enable MFA methods (SMS, TOTP, Email)"
echo ""

echo "👤 To enable MFA for a specific user:"
echo "1. Go to Users tab in your User Pool"
echo "2. Select a user"
echo "3. Click 'Actions' → 'Enable MFA'"
echo "4. Choose MFA method (SMS or TOTP)"
echo ""

echo "🧪 To test MFA:"
echo "1. Use a user with MFA enabled"
echo "2. Sign in at: http://localhost:3001/auth/signin"
echo "3. Enter username/password"
echo "4. You should see an MFA code prompt"
echo "5. Enter the code from SMS/TOTP app"
echo ""

echo "⚡ Quick MFA Setup Commands (AWS CLI):"
echo ""
echo "# Enable MFA for User Pool (Optional)"
echo "aws cognito-idp update-user-pool \\"
echo "  --user-pool-id $USER_POOL_ID \\"
echo "  --region $REGION \\"
echo "  --mfa-configuration OPTIONAL \\"
echo "  --sms-configuration SnsCallerArn=arn:aws:iam::YOUR_ACCOUNT:role/service-role/YOUR_SNS_ROLE"
echo ""

echo "# Enable MFA for a specific user"
echo "aws cognito-idp admin-set-user-mfa-preference \\"
echo "  --user-pool-id $USER_POOL_ID \\"
echo "  --username 'USER_EMAIL_HERE' \\"
echo "  --sms-mfa-settings Enabled=true,PreferredMfa=true \\"
echo "  --region $REGION"
echo ""

echo "📱 TOTP Setup:"
echo "1. Install Google Authenticator or similar app"
echo "2. Enable TOTP MFA in Cognito User Pool settings"
echo "3. User will be prompted to scan QR code on first login"
echo ""

echo "💡 Tips:"
echo "- Start with 'Optional' MFA to test gradually"
echo "- SMS MFA requires SNS configuration for phone numbers"
echo "- TOTP MFA works without additional setup"
echo "- Email MFA uses SES (if configured)"
echo ""

echo "🚀 Ready to test MFA!"
echo "Your application now supports:"
echo "✅ MFA challenge detection"
echo "✅ MFA code input form"
echo "✅ Multiple MFA methods (SMS/TOTP/Email)"
echo "✅ Proper error handling"
echo ""

echo "Next steps:"
echo "1. Configure MFA in AWS Cognito Console"
echo "2. Test with a user account"
echo "3. Verify MFA flow works end-to-end"
