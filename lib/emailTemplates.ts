// lib/emailTemplates.ts - Email notification templates
import { sanitizeHTML } from './sanitize';

export interface NotificationEmailData {
  channelTitle: string;
  channelSlug: string;
  postContent: string;
  postCategory: string | null;
  postCreatedAt: string;
  recipientEmail: string;
}

// Escape HTML special characters to prevent XSS in emails
const escapeHtml = (text: string): string => {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
};

const getCategoryEmoji = (category: string | null): string => {
  switch(category) {
    case 'info': return 'ℹ️ Informace';
    case 'warning': return '⚠️ Upozornění';
    case 'event': return '📅 Událost';
    case 'maintenance': return '🔧 Údržba';
    default: return '🏷️ Bez kategorie';
  }
};

export function generateNotificationEmail(data: NotificationEmailData): { html: string; text: string; subject: string } {
  const { channelTitle, channelSlug, postContent, postCategory, postCreatedAt } = data;
  const categoryLabel = getCategoryEmoji(postCategory);
  const viewUrl = `https://oznam-to.cyn.cz/${encodeURIComponent(channelSlug)}`;

  // Escape channel title for use in HTML (prevent XSS)
  const safeChannelTitle = escapeHtml(channelTitle);

  // Sanitize HTML content for email
  const sanitizedContent = sanitizeHTML(postContent);

  // Plain text version (strip HTML tags)
  const plainTextContent = postContent.replace(/<[^>]*>/g, '').trim();

  const subject = `🔔 Nové oznámení: ${channelTitle}`;

  const html = `
<!DOCTYPE html>
<html lang="cs">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 16px 16px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">
                📢 Oznam to!
              </h1>
              <p style="margin: 10px 0 0; color: #e0e7ff; font-size: 14px;">
                Nové oznámení na vaší nástěnce
              </p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <!-- Channel name -->
              <div style="margin-bottom: 20px;">
                <span style="display: inline-block; background-color: #eef2ff; color: #4f46e5; padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: 600;">
                  ${safeChannelTitle}
                </span>
              </div>

              <!-- Category badge -->
              <div style="margin-bottom: 20px;">
                <span style="display: inline-block; background-color: #f3f4f6; padding: 6px 12px; border-radius: 12px; font-size: 13px; color: #374151;">
                  ${categoryLabel}
                </span>
              </div>

              <!-- Post content -->
              <div style="background-color: #f9fafb; border-left: 4px solid #667eea; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
                <div style="color: #1f2937; font-size: 15px; line-height: 1.6;">
                  ${sanitizedContent}
                </div>
              </div>

              <!-- Date -->
              <p style="color: #6b7280; font-size: 13px; margin: 0 0 25px;">
                📅 ${new Date(postCreatedAt).toLocaleString('cs-CZ', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>

              <!-- CTA Button -->
              <table role="presentation" style="margin: 0 auto;">
                <tr>
                  <td style="border-radius: 8px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                    <a href="${viewUrl}" style="display: inline-block; padding: 14px 32px; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 16px;">
                      👁️ Zobrazit celou nástěnku
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 30px; background-color: #f9fafb; text-align: center; border-radius: 0 0 16px 16px; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 10px; color: #6b7280; font-size: 13px;">
                Tento e-mail jste obdrželi, protože máte zapnutá oznámení pro ${safeChannelTitle}.
              </p>
              <p style="margin: 0; font-size: 13px;">
                <a href="https://oznam-to.cyn.cz/dashboard/subscriptions" style="color: #667eea; text-decoration: none;">
                  Spravovat odběry oznámení
                </a>
              </p>
              <p style="margin: 15px 0 0; color: #9ca3af; font-size: 12px;">
                © 2025 Oznam to! - Digitální oznámková deska
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  const text = `
🔔 Nové oznámení: ${channelTitle}

${categoryLabel}

${plainTextContent}

📅 ${new Date(postCreatedAt).toLocaleString('cs-CZ')}

👁️ Zobrazit celou nástěnku: ${viewUrl}

---
Tento e-mail jste obdrželi, protože máte zapnutá oznámení pro ${channelTitle}.
Spravovat odběry: https://oznam-to.cyn.cz/dashboard/subscriptions

© 2025 Oznam to! - Digitální oznámková deska
  `.trim();

  return { html, text, subject };
}
