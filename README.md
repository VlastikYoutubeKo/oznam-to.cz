# 📢 Oznam to! - Digital Announcement Board

**Version:** `v0.2-beta-claude-fixes`

[🇨🇿 Česká verze](./README.cs.md) | 🇬🇧 English version

**Oznam to!** is a modern digital announcement board platform built for housing associations (SVJ), housing cooperatives, building managers, and communities. Create public announcement channels with unique URLs, manage posts with rich text formatting, and automatically notify subscribers via email.

🌐 **Live Demo**: [https://oznam-to.cyn.cz](https://oznam-to.cyn.cz)

---

## ✨ Features

### Core Features
- **📋 Public Announcement Channels** - Create channels with custom slugs (e.g., `/your-channel`)
- **✍️ Rich Text Editor** - Format posts with headings, lists, links, code blocks, and more
- **📧 Per-Channel Email Notifications** - Subscribe to specific channels with category filtering
- **🔐 Role-based Access Control** - Owner and admin roles for managing channels
- **📌 Pin Important Posts** - Highlight critical announcements at the top
- **🏷️ Post Categories** - Organize posts: Info, Warning, Event, Maintenance
- **👥 User Management** - Email/password authentication with Supabase
- **🎨 Beautiful Design** - Responsive UI with gradient backgrounds and modern styling
- **🔒 Security** - XSS protection with DOMPurify HTML sanitization

### 🆕 New in v0.2-beta-claude-fixes

#### Post Management
- **✏️ Edit Posts** - Update post content, category, and expiration after publishing
- **🗑️ Delete Posts** - Remove posts with confirmation (owners + authors)
- **⏰ Post Expiration** - Set optional expiration dates to auto-hide posts
- **📅 Expiration Tracking** - Visual indicators for expired posts in dashboard

#### Channel Customization
- **📝 Channel Descriptions** - Add header text displayed on public pages
- **🎨 Theme Colors** - Choose from 6 color schemes (Indigo, Blue, Green, Red, Purple, Orange)
- **⚙️ Advanced Settings** - Dedicated settings page for appearance customization

#### Email System Enhancements
- **📬 Per-Channel Subscriptions** - Subscribe to any channel independently
- **🔔 Category Filtering** - Choose which post types to receive (info, warning, event, maintenance)
- **📊 Subscription Management** - Centralized dashboard to manage all subscriptions
- **✉️ Beautiful Email Templates** - Responsive HTML emails with Czech localization

#### Mobile & UX Improvements
- **📱 Hamburger Menu** - Mobile-responsive navigation with smooth animations
- **🎯 Better Navigation** - Improved header with dedicated subscription management link
- **💅 Enhanced UI** - Polished forms and better visual hierarchy

#### Developer Experience
- **📦 One-Click Database Setup** - Single SQL file (`00_COMPLETE_SETUP.sql`) for instant deployment
- **📚 Comprehensive Documentation** - Updated CLAUDE.md with all new features
- **🔒 Security Hardening** - Fixed authentication, input validation, XSS prevention
- **🛡️ Security Guidelines** - Complete SECURITY.md with best practices

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/) + React 19
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL + Auth)
- **Rich Text**: [TipTap](https://tiptap.dev/) WYSIWYG editor
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Email**: [Resend](https://resend.com/) or custom SMTP (nodemailer)
- **Security**: [DOMPurify](https://github.com/cure53/DOMPurify) for XSS protection

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Supabase account (free tier works great)
- Email service: Resend account OR custom SMTP server

### 1. Clone & Install

```bash
git clone https://github.com/VlastikYoutubeKo/gemini-oznam_to.cz
cd gemini-oznam_to.cz
npm install
```

### 2. Configure Environment

Create `.env.local` file:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Email Service (choose one)
EMAIL_SERVICE=smtp  # or 'resend'

# Option A: Custom SMTP (recommended for self-hosting)
SMTP_HOST=smtp.example.com
SMTP_PORT=465
SMTP_USER=your_email@example.com
SMTP_PASS=your_password
SMTP_SECURE=false
SMTP_FROM_EMAIL=noreply@example.com
SMTP_FROM_NAME=Oznam to!

# Option B: Resend (recommended for cloud)
# RESEND_API_KEY=re_your_api_key
# RESEND_FROM_EMAIL=noreply@example.com
```

⚠️ **Important**: Never commit `.env.local` to git! It's already in `.gitignore`.

### 3. Database Setup

**New in v0.2**: One-click setup!

1. Go to your Supabase project → SQL Editor
2. Copy the entire `database/00_COMPLETE_SETUP.sql` file
3. Paste and execute
4. Done! ✅

This creates:
- All tables (channels, posts, channel_members, channel_subscriptions)
- Indexes for performance
- Row Level Security policies
- Database functions (toggle_pin_post, add_member_by_email)
- Triggers for auto-updating timestamps

📖 **See `database/README.md` for detailed schema documentation**

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 5. Test Email Configuration

```bash
npm run test:email your@email.com
```

---

## 📖 Usage

### Creating a Channel

1. Sign up and log in
2. Go to **Dashboard**
3. Click **Create New Channel**
4. Enter channel name and unique slug
5. (Optional) Go to **Settings** to customize appearance
6. Share the public URL: `https://oznam-to.cyn.cz/your-slug`

### Publishing Announcements

1. Navigate to **Dashboard** → Your channel
2. Select a category (Info, Warning, Event, Maintenance)
3. (Optional) Set an expiration date for time-sensitive posts
4. Write your announcement with rich text formatting
5. Click **Publish**
6. Subscribers receive email notifications based on their preferences

### Editing & Deleting Posts

**New in v0.2**:
- Click the **✏️ Edit** button on any post (owners + post authors)
- Update content, category, or expiration date
- Click **💾 Save** or **❌ Cancel**
- Click **🗑️ Delete** to remove posts (with confirmation)

### Channel Customization

**New in v0.2**:
1. Go to **Dashboard** → Your channel → **⚙️ Settings**
2. Under **🎨 Appearance**:
   - Add a channel description (shown on public page)
   - Choose a theme color from 6 options
3. Click **💾 Save** to apply changes

### Managing Email Subscriptions

**New in v0.2 - Per-Channel Subscriptions**:

**For Users:**
1. Click **🔔 Subscriptions** in the header
2. View all channels you're subscribed to
3. Toggle notifications ON/OFF per channel
4. Select which categories to receive (or "All")
5. Unsubscribe from channels you're not interested in

**Subscribing to a Channel:**
1. Visit any public channel page (e.g., `/your-channel`)
2. Find the subscription box on the page
3. Enter your email and select categories
4. Click **Subscribe**

### User Roles

- **Owner** - Full control, can pin posts, manage admins, edit settings
- **Admin** - Can create, edit, and delete posts

---

## 📧 Email Service Options

### Option 1: Custom SMTP (Recommended for Self-Hosting)

Use your existing email server:

```env
EMAIL_SERVICE=smtp
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_SECURE=false
SMTP_FROM_EMAIL=noreply@example.com
SMTP_FROM_NAME=Oznam to!
```

#### Popular SMTP Providers

**Gmail** (500 emails/day free, 2,000/day with Workspace)
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_16_char_app_password  # Requires 2FA + App Password
SMTP_SECURE=false
```
[How to create Gmail App Password](https://myaccount.google.com/apppasswords)

**Outlook / Office 365**
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=your_email@outlook.com
SMTP_PASS=your_password
SMTP_SECURE=false
```

**SendGrid** (100 emails/day free)
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey  # Literally "apikey"
SMTP_PASS=your_sendgrid_api_key
SMTP_SECURE=false
```

**cPanel / Shared Hosting** (Wedos, Forpsi, Hostinger)
```env
SMTP_HOST=mail.your-domain.cz
SMTP_PORT=465
SMTP_USER=oznamto@your-domain.cz
SMTP_PASS=your_email_password
SMTP_SECURE=true  # Required for port 465
```

**Port Reference:**
- Port 587 (STARTTLS) - Recommended, use `SMTP_SECURE=false`
- Port 465 (SSL) - Use `SMTP_SECURE=true`
- Port 25 - Often blocked by ISPs

### Option 2: Resend (Recommended for Cloud Hosting)

Modern email API service:

```env
EMAIL_SERVICE=resend
RESEND_API_KEY=re_your_api_key
RESEND_FROM_EMAIL=noreply@your-domain.com
```

**Benefits:**
- 3,000 free emails/month
- Easy domain verification at [resend.com](https://resend.com)
- Built-in analytics dashboard
- Excellent deliverability
- No server maintenance

**Setup Steps:**
1. Sign up at [resend.com](https://resend.com)
2. Add your domain and verify DNS records
3. Create API key (starts with `re_`)
4. Add to `.env.local`

### Email Deliverability Tips

To prevent emails from going to spam:

1. **Configure SPF Record** (add to DNS):
   ```
   Type: TXT
   Name: @
   Value: v=spf1 include:_spf.google.com ~all
   ```
   (Replace with your provider's SPF record)

2. **Enable DKIM** - Check your email provider's documentation

3. **Add DMARC Record** (add to DNS):
   ```
   Type: TXT
   Name: _dmarc
   Value: v=DMARC1; p=quarantine; rua=mailto:admin@yourdomain.com
   ```

4. **Use verified sender addresses** - Match `SMTP_FROM_EMAIL` with your authenticated domain

---

## 🏗️ Project Structure

```
oznam-to/
├── app/
│   ├── api/
│   │   ├── notifications/send/        # Email notification API (secured)
│   │   └── subscriptions/             # Subscription management APIs
│   ├── dashboard/
│   │   ├── [slug]/                    # Channel admin pages
│   │   │   └── settings/              # Channel customization
│   │   └── subscriptions/             # User subscription management
│   ├── [slug]/                        # Public channel view
│   ├── layout.tsx                     # Root layout with metadata
│   └── page.tsx                       # Landing page
├── components/
│   ├── Header.tsx                     # Navigation (with hamburger menu)
│   ├── RichTextEditor.tsx             # TipTap editor
│   ├── SafeHTML.tsx                   # Sanitized HTML renderer
│   └── ChannelSubscription.tsx        # Subscription widget
├── lib/
│   ├── supabaseClient.js              # Supabase singleton
│   ├── emailService.ts                # Unified email service
│   ├── emailTemplates.ts              # Email HTML templates (XSS-safe)
│   └── sanitize.ts                    # DOMPurify configuration
├── database/
│   ├── 00_COMPLETE_SETUP.sql          # 🆕 One-click database setup
│   └── README.md                      # Database documentation
├── SECURITY.md                        # 🆕 Security guidelines
├── CLAUDE.md                          # 🆕 Updated developer guide
└── .env.local                         # Environment variables (gitignored)
```

---

## 🔒 Security

### What's Secured in v0.2

✅ **XSS Protection**
- All user-generated HTML sanitized with DOMPurify
- HTML escaping in email templates
- Strict whitelist of allowed tags and attributes

✅ **SQL Injection Protection**
- All queries use Supabase client parameterization
- Input validation on channel slugs (alphanumeric + hyphens only)

✅ **Authentication & Authorization**
- API routes verify user membership before sending notifications
- Session checks on all protected routes
- Role-based access control enforced

✅ **Database Security**
- Row Level Security (RLS) enabled on all tables
- Users can only access channels they're members of

✅ **Email Security**
- SMTP credentials stored in environment variables
- TLS/SSL encryption for email transmission
- No sensitive data in email bodies

📖 **See `SECURITY.md` for:**
- Rate limiting implementation guide
- Content Security Policy setup
- SPF/DKIM/DMARC configuration
- Production security checklist

---

## 🚢 Deployment

### Production Checklist

1. **Database Migration**
   - Run `database/00_COMPLETE_SETUP.sql` in Supabase SQL Editor ✅

2. **Environment Variables**
   - Set all required variables on your hosting platform
   - Verify `.env.local` is in `.gitignore` ✅

3. **Build Application**
   ```bash
   npm run build
   npm run start
   ```

4. **Configure Email Service**
   - Verify domain for Resend (if using)
   - Test SMTP connection: `npm run test:email`

5. **Security Hardening** (Optional but recommended)
   - Implement rate limiting (see `SECURITY.md`)
   - Add CSP headers (see `SECURITY.md`)
   - Configure SPF/DKIM/DMARC for email domain

6. **Monitor**
   - Check email delivery logs
   - Monitor Supabase usage
   - Review error logs

### Deployment Platforms

**Vercel (Recommended)**
```bash
vercel --prod
```

**Self-Hosted**
```bash
npm run build
pm2 start npm --name oznam-to -- start
```

**Docker**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 📚 Documentation

### Getting Started
- **`README.md`** - This file, quick start guide
- **`database/README.md`** - Database schema and setup
- **`SECURITY.md`** - Security best practices

### Setup Guides
- **`EMAIL_NOTIFICATIONS_SETUP.md`** - Email configuration
- **`SMTP_SETUP_GUIDE.md`** - SMTP provider configurations

### Developer Documentation
- **`CLAUDE.md`** - Complete developer guide with all features
- **`IMPLEMENTATION_SUMMARY.md`** - Technical implementation details
- **`SMTP_IMPLEMENTATION_SUMMARY.md`** - SMTP feature overview

---

## 🧪 Testing

### Run Email Test
```bash
npm run test:email your@email.com
```

### Manual Testing Checklist (v0.2)
- [ ] User registration and login
- [ ] Create channel
- [ ] Customize channel (description + theme color)
- [ ] Publish post with rich text
- [ ] Edit existing post
- [ ] Delete post
- [ ] Set post expiration date
- [ ] Pin/unpin posts (as owner)
- [ ] Subscribe to channel from public page
- [ ] Manage subscriptions in dashboard
- [ ] Email notification received
- [ ] Mobile responsive design (hamburger menu)
- [ ] Settings page works

---

## 🤝 Contributing

This is a custom project for SVJ/housing cooperatives. If you'd like to contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test thoroughly (see Testing section)
5. Commit (`git commit -m 'Add amazing feature'`)
6. Push (`git push origin feature/amazing-feature`)
7. Submit a pull request

---

## 📄 License

This project is proprietary software. All rights reserved.

---

## 🆘 Support

For issues or questions:

1. Check the documentation files (especially `SECURITY.md` and `database/README.md`)
2. Review `SMTP_SETUP_GUIDE.md` for email issues
3. Check Supabase logs for database errors
4. Test email with `npm run test:email`
5. Look for error messages in browser console

### Common Issues

**Database migrations failing?**
→ Use `database/00_COMPLETE_SETUP.sql` for clean setup

**Email not sending?**
→ Run `npm run test:email` and check SMTP credentials

**Posts not showing?**
→ Check if they have expired (`expires_at` field)

**Can't edit posts?**
→ Verify you're the post author or channel owner

---

## 🎯 Use Cases

Perfect for:
- 🏢 Housing associations (SVJ)
- 🏘️ Housing cooperatives (bytová družstva)
- 👨‍💼 Building managers
- 🏘️ Residential communities
- 🏫 Educational institutions
- 🏛️ Local organizations
- 📢 Any group needing public announcements

---

## 🌟 Credits

### Project Team

- **💡 Concept & Idea**: Vlastimil Novotný - Inspired by the available oznam-to.cz domain
- **🚀 MVP Development**: Google Gemini - Initial application structure and core features
- **✨ Feature Expansion & Email System**: Anthropic Claude (Sonnet 3.5) - Email notifications, SMTP support, documentation
- **🔧 v0.2 Enhancements**: Anthropic Claude (Sonnet 4.5) - Post editing, expiration, channel customization, security hardening, mobile UX

### Technologies

Built with:
- [Next.js](https://nextjs.org/) by Vercel
- [Supabase](https://supabase.com/) for backend
- [TipTap](https://tiptap.dev/) for rich text editing
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Resend](https://resend.com/)/[nodemailer](https://nodemailer.com/) for emails
- [DOMPurify](https://github.com/cure53/DOMPurify) for XSS protection

### Special Thanks

This project showcases the power of AI-assisted development, combining human creativity with AI capabilities to build practical solutions for real-world community needs.

---

## 📊 Version History

### v0.2-beta-claude-fixes (2025-11-08)
- ✏️ Post editing and deletion
- ⏰ Post expiration dates
- 🎨 Channel customization (descriptions, theme colors)
- 📱 Mobile hamburger menu
- 🔒 Security hardening (API auth, input validation, XSS prevention)
- 📧 Per-channel subscription system
- 📦 One-click database setup
- 📚 Comprehensive documentation updates

### v0.1-beta (Initial Release)
- 📋 Public announcement channels
- ✍️ Rich text editor
- 📧 Email notifications (global)
- 🔐 Role-based access control
- 📌 Post pinning
- 🏷️ Post categories

---

## 📞 Contact

Website: [https://oznam-to.cyn.cz](https://oznam-to.cyn.cz)

Security issues: See `SECURITY.md` for responsible disclosure

---

Made with ❤️ for better community communication
