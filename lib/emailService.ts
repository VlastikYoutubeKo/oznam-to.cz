// lib/emailService.ts - Unified email service supporting both Resend and SMTP
import nodemailer from 'nodemailer';
import { Resend } from 'resend';

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text: string;
}

export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

// Resend client (lazy initialization)
let resendClient: Resend | null = null;

// SMTP transporter (lazy initialization)
let smtpTransporter: nodemailer.Transporter | null = null;

/**
 * Get the configured email service (reads from env at runtime)
 */
function getConfiguredEmailService(): string {
  return process.env.EMAIL_SERVICE || 'resend';
}

/**
 * Initialize Resend client
 */
function getResendClient(): Resend {
  if (!resendClient) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY is not defined in environment variables');
    }
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }
  return resendClient;
}

/**
 * Initialize SMTP transporter
 */
function getSMTPTransporter(): nodemailer.Transporter {
  if (!smtpTransporter) {
    const requiredVars = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS'];
    const missing = requiredVars.filter(v => !process.env[v]);

    if (missing.length > 0) {
      throw new Error(`Missing SMTP configuration: ${missing.join(', ')}`);
    }

    smtpTransporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT!, 10),
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      // Optional: TLS options
      ...(process.env.SMTP_TLS_REJECT_UNAUTHORIZED === 'false' && {
        tls: {
          rejectUnauthorized: false
        }
      })
    });
  }
  return smtpTransporter;
}

/**
 * Send email using Resend
 */
async function sendWithResend(options: EmailOptions): Promise<EmailResult> {
  try {
    const resend = getResendClient();
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'oznamto@oznam-to.cyn.cz';

    const result = await resend.emails.send({
      from: fromEmail,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });

    return {
      success: true,
      messageId: result.data?.id,
    };
  } catch (error) {
    console.error('Resend error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Send email using SMTP
 */
async function sendWithSMTP(options: EmailOptions): Promise<EmailResult> {
  try {
    const transporter = getSMTPTransporter();
    const fromEmail = process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER;
    const fromName = process.env.SMTP_FROM_NAME || 'Oznam to!';

    const info = await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error('SMTP error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Send email using configured service (Resend or SMTP)
 */
export async function sendEmail(options: EmailOptions): Promise<EmailResult> {
  const emailService = getConfiguredEmailService();
  console.log(`Sending email via ${emailService.toUpperCase()} to ${options.to}`);

  if (emailService === 'smtp') {
    return sendWithSMTP(options);
  } else if (emailService === 'resend') {
    return sendWithResend(options);
  } else {
    return {
      success: false,
      error: `Invalid EMAIL_SERVICE: ${emailService}. Must be 'resend' or 'smtp'`,
    };
  }
}

/**
 * Verify SMTP connection (useful for testing)
 */
export async function verifySMTPConnection(): Promise<boolean> {
  const emailService = getConfiguredEmailService();

  if (emailService !== 'smtp') {
    console.log('Skipping SMTP verification - using Resend');
    return true;
  }

  try {
    const transporter = getSMTPTransporter();
    await transporter.verify();
    console.log('SMTP connection verified successfully');
    return true;
  } catch (error) {
    console.error('SMTP verification failed:', error);
    return false;
  }
}

/**
 * Get current email service name
 */
export function getEmailServiceName(): string {
  return getConfiguredEmailService();
}
