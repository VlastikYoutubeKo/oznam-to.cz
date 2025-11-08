// test-email.ts - Test script for verifying email configuration
// Run with: npx tsx test-email.ts

// IMPORTANT: Load environment variables FIRST, before any other imports
import { config } from 'dotenv';
const result = config({ path: '.env.local' });

if (result.error) {
  console.error('❌ Error loading .env.local:', result.error);
  process.exit(1);
}

// Now import after env vars are loaded
import { sendEmail, verifySMTPConnection, getEmailServiceName } from './lib/emailService';

async function testEmailService() {
  console.log('=================================');
  console.log('Email Service Configuration Test');
  console.log('=================================\n');

  // Debug: Show loaded environment variable
  console.log(`🔍 EMAIL_SERVICE env var: ${process.env.EMAIL_SERVICE || '(not set)'}`);

  const service = getEmailServiceName();
  console.log(`📧 Using email service: ${service.toUpperCase()}\n`);

  // Step 1: Verify SMTP connection (if using SMTP)
  if (service === 'smtp') {
    console.log('Step 1: Verifying SMTP connection...');
    const verified = await verifySMTPConnection();

    if (!verified) {
      console.error('❌ SMTP connection failed. Please check your configuration.');
      process.exit(1);
    }
    console.log('✅ SMTP connection successful!\n');
  } else {
    console.log('Step 1: Skipping SMTP verification (using Resend)\n');
  }

  // Step 2: Send test email
  console.log('Step 2: Sending test email...');

  const testEmail = process.argv[2] || process.env.SMTP_USER || process.env.SMTP_FROM_EMAIL;

  if (!testEmail) {
    console.error('❌ No email address provided.');
    console.log('Usage: npx tsx test-email.ts your_email@example.com');
    process.exit(1);
  }

  console.log(`To: ${testEmail}`);

  const result = await sendEmail({
    to: testEmail,
    subject: '🧪 Test Email from Oznam to!',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
        </head>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">📢 Oznam to!</h1>
            <p style="color: #e0e7ff; margin: 10px 0 0;">Email Configuration Test</p>
          </div>

          <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-radius: 0 0 10px 10px;">
            <h2 style="color: #1f2937; margin-top: 0;">✅ Email Configuration Successful!</h2>

            <p style="color: #4b5563; line-height: 1.6;">
              Congratulations! Your email service is configured correctly.
            </p>

            <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; color: #374151;"><strong>Service:</strong> ${service.toUpperCase()}</p>
              <p style="margin: 10px 0 0; color: #374151;"><strong>Date:</strong> ${new Date().toLocaleString('cs-CZ')}</p>
            </div>

            <p style="color: #4b5563; line-height: 1.6;">
              Your Oznam to! application can now send email notifications to users.
            </p>

            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 25px 0;">

            <p style="color: #6b7280; font-size: 14px; margin: 0;">
              This is a test email sent from your Oznam to! application.
            </p>
          </div>
        </body>
      </html>
    `,
    text: `
Oznam to! - Email Configuration Test
=====================================

✅ Email Configuration Successful!

Congratulations! Your email service is configured correctly.

Service: ${service.toUpperCase()}
Date: ${new Date().toLocaleString('cs-CZ')}

Your Oznam to! application can now send email notifications to users.

---
This is a test email sent from your Oznam to! application.
    `.trim(),
  });

  console.log('\n=================================');
  console.log('Test Results');
  console.log('=================================\n');

  if (result.success) {
    console.log('✅ Email sent successfully!');
    if (result.messageId) {
      console.log(`📬 Message ID: ${result.messageId}`);
    }
    console.log(`\nCheck your inbox at: ${testEmail}`);
    console.log('(Also check spam/junk folder)\n');
  } else {
    console.log('❌ Email sending failed!');
    console.log(`Error: ${result.error}\n`);
    process.exit(1);
  }

  console.log('=================================\n');
}

// Run the test
testEmailService().catch((error) => {
  console.error('\n❌ Unexpected error:', error);
  process.exit(1);
});
