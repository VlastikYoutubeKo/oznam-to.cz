# Security Guidelines

This document outlines security best practices and recommendations for the **Oznam to!** application.

## 🔒 Implemented Security Features

### ✅ XSS Protection
- **DOMPurify sanitization** on all user-generated HTML content
- Strict whitelist of allowed HTML tags (see `lib/sanitize.ts`)
- HTML escaping in email templates
- No dangerous attributes (`onclick`, `onerror`, etc.)

### ✅ SQL Injection Protection
- All database queries use Supabase client parameterization
- No raw SQL string concatenation
- Input validation on channel slugs

### ✅ Authentication & Authorization
- Supabase Auth for user management
- Session checks on all protected routes
- Role-based access control (owner/admin)
- Membership verification before sending notifications

### ✅ Row Level Security (RLS)
- Database-level access control in Supabase
- Users can only access their own data
- Channel owners have elevated permissions

### ✅ Input Validation
- Slug format validation (alphanumeric + hyphens, max 100 chars)
- Email format validation
- Category type validation

---

## ⚠️ Recommended Security Enhancements

### 1. Rate Limiting (Recommended for Production)

**Current State**: No rate limiting is implemented on API routes.

**Risk**: Email notification API could be abused to send spam or exhaust SMTP quotas.

**Recommended Solutions**:

#### Option A: Upstash Rate Limiting (Easiest for Vercel/Serverless)

```bash
npm install @upstash/ratelimit @upstash/redis
```

Create a rate limiter utility:

```typescript
// lib/rateLimit.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Create a Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// 10 requests per 10 seconds per IP
export const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '10 s'),
  analytics: true,
});
```

Apply to notification API:

```typescript
// app/api/notifications/send/route.ts
import { ratelimit } from '@/lib/rateLimit';

export async function POST(request: NextRequest) {
  // Rate limit by IP address
  const ip = request.ip ?? '127.0.0.1';
  const { success } = await ratelimit.limit(ip);

  if (!success) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 }
    );
  }

  // ... rest of handler
}
```

**Environment variables needed**:
```bash
UPSTASH_REDIS_REST_URL=your_upstash_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_token
```

Get free credentials at: https://upstash.com/

#### Option B: Next.js Middleware Rate Limiting (Simple, In-Memory)

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simple in-memory store (resets on redeploy)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/api/notifications')) {
    const ip = request.ip ?? '127.0.0.1';
    const now = Date.now();
    const windowMs = 60000; // 1 minute
    const maxRequests = 10;

    const record = rateLimitMap.get(ip);

    if (!record || now > record.resetTime) {
      rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    } else if (record.count >= maxRequests) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      );
    } else {
      record.count++;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};
```

**⚠️ Limitation**: This resets on every deployment and doesn't work across multiple serverless instances.

---

### 2. Content Security Policy (CSP) Headers

Add CSP headers to prevent XSS even if sanitization fails:

```typescript
// next.config.js
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https:",
              "font-src 'self' data:",
              "connect-src 'self' https://*.supabase.co",
              "frame-ancestors 'none'",
            ].join('; ')
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ],
      },
    ];
  },
};
```

---

### 3. Environment Variable Validation

Add runtime validation to catch configuration errors early:

```typescript
// lib/envValidation.ts
export function validateEnv() {
  const required = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
  ];

  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      'Please check your .env.local file.'
    );
  }

  // Warn about optional email variables
  if (!process.env.SMTP_HOST && !process.env.RESEND_API_KEY) {
    console.warn(
      '⚠️  No email service configured. Email notifications will not work.\n' +
      'Set either SMTP_* or RESEND_API_KEY environment variables.'
    );
  }
}
```

Call in `app/layout.tsx`:

```typescript
import { validateEnv } from '@/lib/envValidation';

// Only validate in production
if (process.env.NODE_ENV === 'production') {
  validateEnv();
}
```

---

### 4. Email Security (SPF, DKIM, DMARC)

Configure email authentication to prevent spoofing:

#### SPF (Sender Policy Framework)
Add DNS TXT record:
```
v=spf1 include:_spf.seznam.cz ~all
```

#### DKIM (DomainKeys Identified Mail)
Enable in your email provider (Seznam.cz dashboard)

#### DMARC (Domain-based Message Authentication)
Add DNS TXT record:
```
v=DMARC1; p=quarantine; rua=mailto:admin@cyn.cz; pct=100; adkim=s; aspf=s
```

**Why this matters**:
- Prevents email spoofing
- Improves deliverability
- Reduces spam complaints

---

### 5. Audit Logging (Optional)

For production systems, consider logging sensitive operations:

```typescript
// lib/auditLog.ts
export async function logAuditEvent(params: {
  userId: string;
  action: string;
  resourceType: string;
  resourceId: string;
  metadata?: Record<string, any>;
}) {
  await supabase.from('audit_logs').insert({
    user_id: params.userId,
    action: params.action,
    resource_type: params.resourceType,
    resource_id: params.resourceId,
    metadata: params.metadata,
    created_at: new Date().toISOString(),
  });
}
```

Log important events:
- Channel creation/deletion
- Member role changes
- Post deletion
- Settings modifications

---

## 🚨 Security Checklist for Production

Before deploying to production, ensure:

- [ ] `.env.local` is in `.gitignore` and NOT committed
- [ ] All secrets have been rotated if ever exposed
- [ ] RLS policies are enabled in Supabase
- [ ] HTTPS is enforced (automatic on Vercel)
- [ ] Rate limiting is implemented (at least basic)
- [ ] Security headers are configured
- [ ] Email authentication (SPF/DKIM/DMARC) is set up
- [ ] Error messages don't leak sensitive information
- [ ] Database backups are enabled in Supabase
- [ ] Monitoring/alerting is configured

---

## 📧 Responsible Disclosure

If you discover a security vulnerability, please email: **security@cyn.cz**

**Please do NOT**:
- Open a public GitHub issue
- Exploit the vulnerability
- Share it publicly before it's fixed

We will respond within 48 hours and work with you to resolve the issue.

---

## 📚 Security Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Supabase Security Best Practices](https://supabase.com/docs/guides/auth/row-level-security)
- [Next.js Security Headers](https://nextjs.org/docs/advanced-features/security-headers)
- [DOMPurify Documentation](https://github.com/cure53/DOMPurify)

---

## 🔄 Security Review Schedule

- **Monthly**: Review access logs and permissions
- **Quarterly**: Update dependencies (`npm audit fix`)
- **Annually**: Full security audit by external reviewer
- **After incidents**: Immediate review and remediation

---

**Last Updated**: 2025-11-08
**Security Version**: 1.0
