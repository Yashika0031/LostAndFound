// Test script to demonstrate and test email notification functionality
// This tests both logging (EMAIL_ENABLED=false) and actual email sending (EMAIL_ENABLED=true)

import { sendClaimNotification } from './utils/emailService.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const testEmailNotification = async () => {
  console.log('🧪 Testing Email Notification System...\n');
  
  // Check email configuration
  const emailEnabled = process.env.EMAIL_ENABLED === 'true';
  console.log(`📧 Email Status: ${emailEnabled ? '✅ ENABLED - Will send real emails' : '📝 DISABLED - Will only log'}`);
  
  if (emailEnabled) {
    console.log(`📬 Email Configuration:`);
    console.log(`   Host: ${process.env.EMAIL_HOST}`);
    console.log(`   User: ${process.env.EMAIL_USER}`);
    console.log(`   From: ${process.env.EMAIL_FROM}`);
  }
  
  console.log('\n' + '='.repeat(50) + '\n');

  // Mock data for testing
  const itemOwner = {
    name: 'John Doe',
    email: process.env.EMAIL_USER || 'john.doe@example.com' // Use your email for testing
  };

  const claimant = {
    name: 'Jane Smith',
    email: 'jane.smith@example.com'
  };

  const lostItem = {
    name: 'iPhone 14 Pro',
    category: 'Lost',
    location: 'Central Park, NYC'
  };

  const foundItem = {
    name: 'Black Wallet',
    category: 'Found',
    location: 'Coffee Shop, Manhattan'
  };

  // Test 1: Regular response on a Lost item
  console.log('📧 Test 1: Regular response on Lost item');
  console.log('─'.repeat(40));
  const result1 = await sendClaimNotification(
    itemOwner, 
    claimant, 
    lostItem, 
    "I think I saw this phone near the playground area in Central Park yesterday around 3 PM.",
    false
  );
  console.log('Result:', result1.success ? '✅ Success' : '❌ Failed', result1.message || result1.error);

  console.log('\n');

  // Test 2: Match claim on a Found item
  console.log('📧 Test 2: Match claim on Found item');
  console.log('─'.repeat(40));
  const result2 = await sendClaimNotification(
    itemOwner, 
    claimant, 
    foundItem, 
    "This is definitely my wallet! I lost it yesterday at that exact coffee shop. It has my driver's license with name Jane Smith.",
    true
  );
  console.log('Result:', result2.success ? '✅ Success' : '❌ Failed', result2.message || result2.error);

  console.log('\n' + '='.repeat(50) + '\n');

  console.log('✅ Email notification tests completed!');
  console.log('\n📋 Summary:');
  console.log('- Item owners will receive email notifications for ALL responses/claims');
  console.log('- Different email content for regular responses vs match claims');
  console.log('- Notifications include claimant details, message, and item information');
  
  if (!emailEnabled) {
    console.log('\n🔧 To enable actual email sending:');
    console.log('1. Set EMAIL_ENABLED=true in your .env file');
    console.log('2. Configure EMAIL_USER and EMAIL_PASS with valid credentials');
    console.log('3. Run this test again to send real emails');
  } else {
    console.log('\n✉️  Real emails were sent! Check your inbox.');
  }
};

// Run the test
testEmailNotification().catch(console.error);