// app/api/test-email/route.ts - Test email configuration
import { NextRequest, NextResponse } from 'next/server';
import { sendEmail, verifySMTPConnection, getEmailServiceName } from '@/lib/emailService';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const testEmail = searchParams.get('email') || 'test@example.com';
  const action = searchParams.get('action') || 'verify'; // 'verify' or 'send'

  const emailService = getEmailServiceName();

  // Check configuration
  const config = {
    service: emailService,
    smtp: {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      user: process.env.SMTP_USER,
      secure: process.env.SMTP_SECURE,
      fromEmail: process.env.SMTP_FROM_EMAIL,
      fromName: process.env.SMTP_FROM_NAME,
    },
    resend: {
      apiKey: process.env.RESEND_API_KEY ? '***' + process.env.RESEND_API_KEY.slice(-4) : 'NOT SET',
      fromEmail: process.env.RESEND_FROM_EMAIL,
    }
  };

  if (action === 'verify') {
    // Just verify SMTP connection
    if (emailService === 'smtp') {
      const verified = await verifySMTPConnection();
      return NextResponse.json({
        status: verified ? 'success' : 'error',
        message: verified ? '✅ SMTP connection verified' : '❌ SMTP connection failed',
        config,
      });
    } else {
      return NextResponse.json({
        status: 'info',
        message: '✅ Using Resend (no connection test needed)',
        config,
      });
    }
  }

  if (action === 'send') {
    // Send test email
    try {
      const result = await sendEmail({
        to: testEmail,
        subject: '🔔 Test Email from Oznam to!',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #667eea;">✅ Test Email Successful!</h1>
            <p>This is a test email from your Oznam to! notification system.</p>
            <p><strong>Email service:</strong> ${emailService.toUpperCase()}</p>
            <p><strong>Sent at:</strong> ${new Date().toLocaleString('cs-CZ')}</p>
            <hr style="border: 1px solid #e5e7eb; margin: 20px 0;">
            <p style="color: #6b7280; font-size: 14px;">
              If you received this email, your notification system is working correctly! 🎉
            </p>
          </div>
        `,
        text: `
✅ Test Email Successful!

This is a test email from your Oznam to! notification system.

Email service: ${emailService.toUpperCase()}
Sent at: ${new Date().toLocaleString('cs-CZ')}

If you received this email, your notification system is working correctly! 🎉
        `.trim(),
      });

      return NextResponse.json({
        status: result.success ? 'success' : 'error',
        message: result.success
          ? `✅ Test email sent to ${testEmail}`
          : `❌ Failed to send email: ${result.error}`,
        messageId: result.messageId,
        config,
        error: result.error,
      });
    } catch (error) {
      return NextResponse.json({
        status: 'error',
        message: '❌ Exception while sending email',
        error: error instanceof Error ? error.message : 'Unknown error',
        config,
      }, { status: 500 });
    }
  }

  return NextResponse.json({
    status: 'info',
    message: 'Email test API',
    usage: {
      verify: '/api/test-email?action=verify',
      send: '/api/test-email?action=send&email=your@email.com',
    },
    config,
  });
}
