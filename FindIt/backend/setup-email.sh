#!/bin/bash

# FindIt Email Setup Script
# This script will guide you through setting up email notifications

echo "🚀 FindIt Email Setup Guide"
echo "=========================="
echo ""

echo "📧 STEP 1: Choose Your Email Provider"
echo "We recommend Gmail for easy setup, but you can use any SMTP provider."
echo ""

echo "📧 STEP 2: For Gmail Users - Enable App Passwords"
echo "1. Go to your Google Account settings: https://myaccount.google.com/"
echo "2. Navigate to 'Security' → 'Signing in to Google' → 'App passwords'"
echo "3. Select 'Mail' and 'Other (custom name)' → Name it 'FindIt App'"
echo "4. Copy the 16-character app password (it looks like: abcd efgh ijkl mnop)"
echo ""

echo "📧 STEP 3: Update Your .env File"
echo "Edit /backend/.env and replace these values:"
echo ""
echo "EMAIL_ENABLED=true"
echo "EMAIL_USER=your-actual-email@gmail.com    # Replace with your Gmail address"
echo "EMAIL_PASS=your-16-character-app-password  # Replace with your app password"
echo ""

echo "📧 STEP 4: Test Email Functionality"
echo "After updating .env, run: npm run test-email"
echo ""

echo "🔧 OTHER EMAIL PROVIDERS:"
echo ""
echo "For Outlook/Hotmail:"
echo "EMAIL_HOST=smtp-mail.outlook.com"
echo "EMAIL_PORT=587"
echo ""
echo "For Yahoo:"
echo "EMAIL_HOST=smtp.mail.yahoo.com"
echo "EMAIL_PORT=587"
echo ""
echo "For Custom SMTP:"
echo "EMAIL_HOST=your-smtp-server.com"
echo "EMAIL_PORT=587 (or 465 for SSL)"
echo "EMAIL_SECURE=false (or true for SSL)"
echo ""

echo "⚠️  SECURITY NOTES:"
echo "- Never commit your .env file to version control"
echo "- Use app-specific passwords, not your main account password"
echo "- Keep your email credentials secure"
echo ""

echo "✅ Once configured, your app will automatically send emails when:"
echo "   → Someone responds to a lost/found item post"
echo "   → Someone claims a match for an item"
echo ""

echo "🧪 To test without real emails, set EMAIL_ENABLED=false in .env"