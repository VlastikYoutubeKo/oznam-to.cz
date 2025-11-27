# CLAUDE.md

**Version:** `v0.2-beta-claude-fixes`

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Oznam to!** is a public announcement board/bulletin system built with Next.js 16 (App Router), TypeScript, React 19, Supabase (auth + database), TipTap (rich text editor), TailwindCSS 4, and DOMPurify for XSS protection.

Users can create "channels" (announcement boards) with unique slugs. Each channel has a public view (`/[slug]`) and a private admin dashboard (`/dashboard/[slug]`) for managing posts. The app supports rich text formatting, post pinning, post categories, role-based access control (owner/admin), post editing/deletion, expiration dates, and channel customization.

## Version 0.2 Changelog

### New Features
- **Post Editing** - Users can edit their posts inline with rich text editor
- **Post Deletion** - Posts can be deleted with confirmation
- **Post Expiration** - Optional expiration dates automatically hide posts from public view
- **Channel Customization** - Channels can have descriptions and theme colors
- **Mobile Navigation** - Hamburger menu for mobile devices
- **Security Hardening** - API authentication, slug validation, HTML escaping
- **Simplified Setup** - One-click database installation with `00_COMPLETE_SETUP.sql`

## Development Commands

### Running the app
```bash
npm run dev       # Start development server on http://localhost:3000
npm run build     # Build for production
npm run start     # Start production server
npm run lint      # Run ESLint
```

## Architecture

### Routing Structure (Next.js App Router)

**Public Pages:**
- `/` - Landing page with features showcase and FAQ
- `/jak-funguje` - How it works tutorial (5-step guide)
- `/about` - About the project & extended FAQ with project background
- `/privacy` - Privacy policy & GDPR compliance information
- `/donate` - Support/donation page (Ko-fi, PayPal links)
- `/[slug]` - **Public view** of a channel's announcements

**Authentication:**
- `/login` - User authentication page
- `/signup` - User registration page
- `/forgot-password` - Password reset request (sends email)
- `/reset-password` - Password reset confirmation page

**User Dashboard:**
- `/dashboard` - User's channel list + channel creation
- `/dashboard/settings` - User settings (redirects to subscriptions)
- `/dashboard/subscriptions` - Centralized subscription management
- `/dashboard/[slug]` - Admin view for managing a specific channel's posts
- `/dashboard/[slug]/settings` - Channel settings (appearance, members, danger zone)

**Admin Panel:**
- `/admin` - System admin panel - view all channels with stats (restricted to `my@email.cz`)

### Database Schema (Supabase)
The app uses four main tables:

1. **channels** - Stores channel metadata
   - `id` (uuid, primary key)
   - `title` (text)
   - `slug` (text, unique)
   - `description` (text, nullable) - **NEW in v0.2**: Channel description shown on public page
   - `theme_color` (text, default: 'indigo') - **NEW in v0.2**: Theme color (indigo/blue/green/red/purple/orange)
   - `logo_url` (text, nullable) - **NEW in v0.2**: Future feature for channel logos
   - `created_at` (timestamp)

2. **posts** - Stores announcements
   - `id` (uuid, primary key)
   - `channel_id` (uuid, foreign key → channels)
   - `user_id` (uuid, foreign key → auth.users)
   - `content` (text, stores HTML)
   - `category` (text, nullable: 'info', 'warning', 'event', 'maintenance')
   - `is_pinned` (boolean, default: false)
   - `expires_at` (timestamp, nullable) - **NEW in v0.2**: Optional expiration date
   - `created_at` (timestamp)

3. **channel_members** - Role-based access control
   - `channel_id` (uuid)
   - `user_id` (uuid)
   - `role` (text: 'owner' | 'admin')
   - Composite primary key on (channel_id, user_id)

4. **channel_subscriptions** - Per-channel email notification subscriptions
   - `id` (uuid, primary key)
   - `user_id` (uuid, foreign key → auth.users)
   - `channel_id` (uuid, foreign key → channels)
   - `email` (text)
   - `subscribed` (boolean, default: true)
   - `categories` (text[], nullable: array of enabled categories or NULL for all)
   - `created_at` (timestamp)
   - `updated_at` (timestamp)
   - Unique constraint on (user_id, channel_id)
   - Auto-subscription trigger creates entry for /updates channel when new user signs up

### Authentication Flow
- Supabase Auth handles login/signup with email+password
- Sessions are checked via `supabase.auth.getSession()`
- Protected routes redirect to `/login` if no session exists
- Dashboard pages verify user has `owner` or `admin` role via `channel_members` table

### Key Components

**RichTextEditor** (`components/RichTextEditor.tsx`)
- TipTap-based WYSIWYG editor with toolbar
- Supports: bold, italic, underline, strikethrough, headings (H1-H3), lists, blockquotes, code blocks, links
- Returns HTML string via `onChange` callback
- Uses `immediatelyRender: false` to fix Next.js SSR hydration issues

**SafeHTML** (`components/SafeHTML.tsx`)
- Client-side component for safely rendering user-generated HTML
- Auto-detects if content is HTML or plain text
- Uses DOMPurify (via `lib/sanitize.ts`) to strip dangerous tags/attributes
- Whitelists only safe tags: p, br, strong, em, u, s, h1-h3, ul, ol, li, blockquote, a, code, pre

**Header** (`components/Header.tsx`) - **UPDATED in v0.2**
- Global navigation component included in `app/layout.tsx`
- Includes link to notification settings for logged-in users
- **NEW**: Responsive hamburger menu for mobile devices
- **NEW**: Smooth animations and mobile-friendly layout
- Desktop: Shows all links horizontally (hidden on mobile with `hidden md:flex`)
- Mobile: Hamburger button (☰) opens vertical dropdown menu
- Menu auto-closes when link is clicked or X button is pressed

### Email Notification System

**Architecture** (`app/api/notifications/send/route.ts`)
- API route for sending email notifications via Resend or SMTP
- Triggered automatically when posts are created in ANY channel
- Uses Supabase service role key for admin database access
- Fetches subscribed users for the specific channel with category filtering
- Filters recipients based on their category preferences

**Per-Channel Subscriptions** (`components/ChannelSubscription.tsx`)
- Subscription component displayed on public channel pages
- Users can subscribe to any channel independently
- Category selection: users choose which post types to receive (info, warning, event, maintenance)
- `categories = null` → receive all categories
- `categories = ['info', 'warning']` → receive only selected categories

**Subscription Management** (`app/dashboard/subscriptions/page.tsx`)
- Centralized dashboard for managing all channel subscriptions
- View all subscribed channels in one place
- Toggle notifications on/off per channel
- Manage category preferences for each subscription
- Unsubscribe from channels

**Email Templates** (`lib/emailTemplates.ts`)
- Beautiful HTML email template with Czech localization
- Includes post content, category badge, and channel link
- Sanitizes HTML content for security
- Provides plain text fallback
- Links to subscription management page

**Email Service** (`lib/emailService.ts`)
- Abstraction layer supporting both Resend and SMTP
- Configured via environment variables
- Handles email delivery with error handling

**Post Creation Hook** (`app/dashboard/[slug]/page.tsx:129-155`)
- When post is created in ANY channel, calls notification API
- Sends channel ID, post ID, and category to filter recipients
- Non-blocking: post creation succeeds even if notification fails
- Logs results to browser console

**API Endpoints**
- `GET /api/subscriptions?userId={id}` - Get all user subscriptions
- `GET /api/subscriptions/{channelId}?userId={id}` - Get subscription for specific channel
- `POST /api/subscriptions/{channelId}` - Subscribe/update subscription
- `PATCH /api/subscriptions/{channelId}` - Update subscription preferences
- `DELETE /api/subscriptions/{channelId}?userId={id}` - Unsubscribe
- `POST /api/notifications/send` - Send notifications (called from post creation)

### Security Considerations (Updated in v0.2)

1. **XSS Protection**: All user-generated HTML content passes through DOMPurify sanitization before rendering
2. **HTML Sanitization Config** (`lib/sanitize.ts`):
   - Allowed tags are strictly limited
   - Only `href`, `target`, `rel` attributes permitted on links
   - Data attributes disabled
   - Server-side fallback strips all tags if DOMPurify unavailable
   - **NEW in v0.2**: Email templates use HTML escaping (`escapeHtml()`) for channel titles

3. **Input Validation** - **NEW in v0.2**:
   - **Slug validation**: All channel slugs validated with regex `^[a-zA-Z0-9-]+$`
   - Maximum length: 100 characters
   - Applied in: Dashboard pages, public pages, settings pages
   - Prevents: Special characters, SQL injection attempts, error message leakage
   - Implementation: `isValidSlug()` function in all `[slug]` pages

4. **API Authentication** - **NEW in v0.2**:
   - Notification API (`/api/notifications/send`) now requires user authorization
   - Verifies user is a member of the channel before sending notifications
   - Prevents: Unauthorized email spam, API abuse
   - Returns `403 Unauthorized` if user isn't channel member
   - Location: `app/api/notifications/send/route.ts` lines 66-79

5. **Database Access**:
   - Row-Level Security (RLS) should be enabled in Supabase
   - Users can only manage posts/channels they have membership in
   - Owner role has additional privileges (pinning posts, settings access)
   - **NEW in v0.2**: Expiration dates add time-based access control

### Post Management Features (v0.2)

**Post Editing** (`app/dashboard/[slug]/page.tsx`)
- **NEW in v0.2**: Inline post editing with full rich text editor
- Click ✏️ Edit button to enter edit mode
- Shows edit form with category selector, expiration date, and rich text editor
- Save or cancel changes
- Permissions: Post authors and channel owners can edit
- Implementation: State-based (`editingPostId`, `editContent`, `editCategory`, `editExpiresAt`)
- Updates post in database and local state simultaneously

**Post Deletion** (`app/dashboard/[slug]/page.tsx`)
- **NEW in v0.2**: Delete posts with confirmation dialog
- Click 🗑️ Delete button
- Confirmation: `confirm('Opravdu smazat tento příspěvek?')`
- Permissions: Post authors and channel owners can delete
- Optimistic update: Removes from UI immediately, reverts on error
- Implementation: `handleDeletePost()` function (line 183)

**Post Expiration** (`app/dashboard/[slug]/page.tsx` + `app/[slug]/page.jsx`)
- **NEW in v0.2**: Optional expiration dates for time-sensitive posts
- Set `expires_at` field when creating or editing posts
- Uses `<input type="datetime-local">` for date/time selection
- **Public view**: Expired posts automatically filtered out (line 90-92 in public page)
- **Dashboard**: Expired posts shown with "VYPRŠELO" badge
- Database field: `expires_at timestamp with time zone`
- Filtering logic: `posts.filter(p => !p.expires_at || new Date(p.expires_at) > now)`

**Categories** - Visual organization system:
- `info` (green) - ℹ️ Informace
- `warning` (amber) - ⚠️ Upozornění
- `event` (blue) - 📅 Událost
- `maintenance` (purple) - 🔧 Údržba
- No category (gray) - 🏷️ Bez kategorie

**Pinning** - Owners can pin important posts to the top
- Uses Supabase RPC function `toggle_pin_post` to ensure atomic updates
- Pinned posts appear in separate section with badge
- Public view also respects pinning order

### Channel Customization (v0.2)

**Channel Settings Page** (`app/dashboard/[slug]/settings/page.tsx`)
- **NEW in v0.2**: Dedicated settings page for channel customization
- Access via Dashboard → Channel → ⚙️ Settings button
- **Owner-only access**: Only channel owners can access settings
- Two main sections: Appearance and Member Management

**Appearance Customization**
- **Channel Description**: Optional header text displayed on public channel page
  - Field: `channels.description` (text, nullable)
  - Shown at top of public page below channel title
  - Maximum length: No limit, but recommended ~200 characters

- **Theme Colors**: Choose from 6 pre-defined color schemes
  - Field: `channels.theme_color` (text, default: 'indigo')
  - Options: 'indigo', 'blue', 'green', 'red', 'purple', 'orange'
  - Affects: Gradient buttons, links, and accent colors
  - Implementation: Tailwind gradient classes (`from-{color}-600 to-{color}-600`)
  - Color picker UI: Grid of color swatches with visual previews

**Theme Color Options**:
```typescript
const THEME_COLORS = [
  { value: 'indigo', label: 'Indigo (výchozí)', gradient: 'from-indigo-600 to-purple-600' },
  { value: 'blue', label: 'Modrá', gradient: 'from-blue-600 to-cyan-600' },
  { value: 'green', label: 'Zelená', gradient: 'from-green-600 to-emerald-600' },
  { value: 'red', label: 'Červená', gradient: 'from-red-600 to-pink-600' },
  { value: 'purple', label: 'Fialová', gradient: 'from-purple-600 to-fuchsia-600' },
  { value: 'orange', label: 'Oranžová', gradient: 'from-orange-600 to-amber-600' },
];
```

**Member Management** (Settings Page)
- Add admins by email: `add_member_by_email` RPC function
- View all channel members with roles
- Remove members (except owners)
- Role badges: 👑 Owner, ⭐ Admin

**Channel Deletion** (Danger Zone)
- Owner-only: Permanently delete channel
- Confirmation modal with typed confirmation ("SMAZAT")
- Cascading delete: Removes all posts, members, and subscriptions
- Database: `ON DELETE CASCADE` foreign keys handle cleanup

### TypeScript Configuration
- Strict mode enabled
- Path alias: `@/*` maps to project root
- Target: ES2017
- JSX: react-jsx (modern JSX transform)

### Styling
- TailwindCSS 4.x with PostCSS
- Indigo/purple color scheme
- Responsive design with gradient backgrounds
- Custom category-based styling for posts

## Important Notes

- **Mixed file extensions**: The codebase uses both `.tsx` (TypeScript) and `.jsx` (JavaScript) files. When creating new components, prefer TypeScript (`.tsx`/`.ts`) for consistency.

- **Supabase Client**: The singleton client instance is initialized in `lib/supabaseClient.js`. Environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) must be set in `.env.local`.

- **Content Storage**: Post content is stored as HTML strings in the database. This enables rich formatting but requires strict sanitization on render.

- **Role Verification**: All admin operations should verify user role via the `channel_members` table. Owner-only operations (like pinning) must explicitly check `role === 'owner'`.

- **Client Components**: Most interactive pages use `'use client'` directive due to hooks (useState, useEffect) and Supabase client usage.

- **Email Notifications**: The `/updates` channel automatically sends email notifications to subscribed users when new posts are created. See `EMAIL_NOTIFICATIONS_SETUP.md` for configuration details.

## Database Setup (v0.2)

**NEW in v0.2**: Simplified one-click database setup!

### Quick Setup
1. Open Supabase SQL Editor
2. Copy entire `database/00_COMPLETE_SETUP.sql` file
3. Paste and execute
4. Done! ✅

This single file includes:
- All tables (channels, posts, channel_members, channel_subscriptions)
- All indexes for performance
- Row Level Security (RLS) policies
- Database functions (toggle_pin_post, add_member_by_email)
- Triggers for auto-updating timestamps
- Post expiration support
- Channel customization fields

### Individual Migration Files
The `database/` folder also contains individual migration files for reference:
- `supabase_migrations.sql` - Legacy notification subscriptions
- `supabase_migrations_channel_subscriptions.sql` - Per-channel subscriptions
- `MIGRATION_add_expires_at.sql` - Post expiration feature
- `MIGRATION_channel_customization.sql` - Channel appearance customization
- `HOTFIX_registration_trigger.sql` - Trigger fixes
- `DISABLE_auto_subscription.sql` - Disable auto-subscriptions
- `MIGRATE_EXISTING_SUBSCRIPTIONS.sql` - Data migration helper
- `TEST_NOTIFICATIONS.sql` - Testing scripts

See `database/README.md` for detailed documentation.

## Common Development Tasks

### Adding a new post category
1. Add to `CATEGORIES` array in both `app/dashboard/[slug]/page.tsx` and `app/[slug]/page.jsx`
2. Add case to `getCategoryStyle()` function with appropriate Tailwind classes
3. Update database schema if enum validation is used

### Creating new protected routes
1. Add auth check: `const { data: { session } } = await supabase.auth.getSession()`
2. Redirect if `!session`: `router.push('/login')`
3. For channel-specific routes, verify membership in `channel_members` table

### Modifying the rich text editor
- Editor configuration: `components/RichTextEditor.tsx` lines 19-33
- Toolbar buttons: lines 59-176
- Allowed HTML tags: `lib/sanitize.ts` lines 6-12

### Database queries
- Always use typed interfaces for query results (see type definitions at top of page components)
- Use `.select()` with JOIN syntax for related data: `.select('role, channels ( id, title, slug )')`
- Order posts by `is_pinned` (desc) then `created_at` (desc) to show pinned first

## Security Best Practices (v0.2)

See `SECURITY.md` for comprehensive security guidelines including:

### Implemented in v0.2
- ✅ XSS protection (DOMPurify + HTML escaping)
- ✅ SQL injection prevention (parameterized queries + slug validation)
- ✅ Authentication & authorization (API routes, session checks, RLS)
- ✅ Input validation (slug format, email format)

### Recommended for Production
- **Rate Limiting**: Two implementation options provided in `SECURITY.md`
  - Option A: Upstash Redis (serverless-friendly)
  - Option B: Next.js middleware (simple, in-memory)
- **Content Security Policy**: CSP header configuration for Next.js
- **Environment Validation**: Runtime checks for required env vars
- **Email Security**: SPF, DKIM, DMARC configuration guide
- **Audit Logging**: Optional logging for sensitive operations

### Security Checklist
Before deploying to production:
- [ ] `.env.local` in `.gitignore` and not committed
- [ ] All secrets rotated if ever exposed
- [ ] RLS policies enabled in Supabase
- [ ] HTTPS enforced (automatic on Vercel)
- [ ] Rate limiting implemented
- [ ] Security headers configured
- [ ] Email authentication (SPF/DKIM/DMARC) set up

## SEO & Analytics

### Overview
The site is optimized for Czech search engines, targeting users searching for announcement board solutions for HOAs (SVJ - společenství vlastníků jednotek) and housing cooperatives (bytová družstva).

### Target Keywords (Czech)
Primary keywords:
- `oznámková deska` (announcement board)
- `digitální nástěnka` (digital bulletin board)
- `SVJ` / `společenství vlastníků jednotek` (homeowners association)
- `bytové družstvo` (housing cooperative)
- `správa bytového domu` (building management)
- `oznámení pro SVJ` (announcements for HOA)
- `veřejná nástěnka` (public bulletin board)
- `online oznámení` (online announcements)
- `správce bytového domu` (building manager)
- `komunikace SVJ` (HOA communication)
- `bytová komunita` (residential community)

### Meta Tags (`app/layout.tsx`)
- **Title**: "Oznam to! - Digitální oznámková deska pro SVJ a bytová družstva"
- **Description**: Optimized for Czech search with target keywords
- **Keywords**: Array of 13 Czech SEO keywords
- **Open Graph**: Configured for social media sharing (locale: cs_CZ)
- **Twitter Card**: Large image summary card
- **Canonical URL**: https://oznam-to.cyn.cz
- **Google Search Console Verification**: `sKboGFNTVOwNvpoM5SfOsT7VQX1eZ7VYTHcPsQ6i8_M`

### Schema.org Structured Data
Located in `app/layout.tsx`, includes:

1. **WebSite Schema** (`#website`)
   - Site name, description, language (cs)
   - SearchAction for channel navigation

2. **SoftwareApplication Schema** (`#software`)
   - Application category: BusinessApplication
   - Operating system: Web
   - Pricing: Free (0 CZK)
   - Feature list (6 key features)
   - Screenshot URL
   - Author information

3. **Organization Schema** (`#organization`)
   - Organization name, URL, logo
   - Description of service

4. **FAQPage Schema** (`app/page.tsx`)
   - 6 frequently asked questions with answers
   - Helps with Google's FAQ rich snippets

### Landing Page Content (`app/page.tsx`)
Optimized sections:
- **Hero H1**: "Digitální oznámková deska pro SVJ a bytová družstva"
- **Use Cases Section**: 4 target audience categories (SVJ, bytová družstva, správci domů, komunity)
- **Features Grid**: 6 key features with icons
- **FAQ Section**: 6 common questions with structured data
- **Footer**: Links to key pages including `/jak-funguje`

### "Jak funguje" Page (`app/jak-funguje/page.tsx`)
Step-by-step guide page optimized for SEO:
- 5-step tutorial (Registration → Channel creation → Posts → Sharing → Advanced features)
- Practical use cases for SVJ/družstva
- Tips for effective usage
- Dedicated meta tags with keywords
- Internal linking back to homepage and signup
- Priority: 0.9 in sitemap

### Sitemap (`app/sitemap.ts`)
Dynamic XML sitemap generator:
- **Static pages**: /, /jak-funguje, /login, /signup, /dashboard
- **Dynamic pages**: All public channel pages (fetched from `channels` table)
- Priorities: Homepage (1.0), Jak funguje (0.9), Channel pages (0.8)
- Change frequencies: Weekly to daily depending on page type
- Error handling: Returns static pages even if database fetch fails
- Accessible at: `https://oznam-to.cyn.cz/sitemap.xml`

### Robots.txt (`app/robots.ts`)
Configuration:
- **Allow**: All pages except dashboard
- **Disallow**: `/dashboard/` (private admin area)
- **Sitemap**: Points to sitemap.xml
- Accessible at: `https://oznam-to.cyn.cz/robots.txt`

### Google Analytics (`app/layout.tsx`)
- **Measurement ID**: G-39628891CJ
- **Implementation**: Next.js Script component with `afterInteractive` strategy
- **Coverage**: All pages (loaded from root layout)
- **Performance**: Non-blocking, loads after page becomes interactive

### DNS & Deployment
- **Production URL**: https://oznam-to.cyn.cz
- **DNS**: CNAME record pointing to `mxnticek.h4ck.me`
- **IP**: 89.102.158.151
- **SSL**: Must be configured for HTTPS

### SEO Checklist for Deployment
- [ ] Ensure `.env.local` has `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Deploy to production server
- [ ] Verify HTTPS/SSL certificate is active
- [ ] Wait 24-48 hours for DNS propagation
- [ ] Submit sitemap to Google Search Console: https://oznam-to.cyn.cz/sitemap.xml
- [ ] Verify Google Search Console ownership (verification tag already added)
- [ ] Monitor Google Analytics for traffic (GA4: G-39628891CJ)
- [ ] Check Google Search Console for indexing status
- [ ] Test robots.txt: https://oznam-to.cyn.cz/robots.txt

### Future SEO Improvements
- Create blog content about SVJ management best practices
- Build backlinks from Czech tech forums and SVJ communities
- Add location-specific content for major Czech cities
- Create case studies of successful implementations
- Add multilingual support (Slovak, Polish) if expanding
- Monitor keyword rankings in Google Search Console
- Optimize page load speed (already good with Next.js)
- Create video tutorials for YouTube SEO

---


## Version 0.2 Summary

### What's New in v0.2-beta-claude-fixes

This version represents a major enhancement focusing on user experience, security, and developer experience.

#### 🎯 User-Facing Features
1. **Post Editing** - Edit posts after publishing (content, category, expiration)
2. **Post Deletion** - Delete posts with confirmation
3. **Post Expiration** - Set expiration dates for time-sensitive announcements
4. **Channel Descriptions** - Add custom header text to public pages
5. **Theme Colors** - Choose from 6 color schemes for channel branding
6. **Mobile Navigation** - Responsive hamburger menu for phones/tablets

#### 🔒 Security Enhancements
1. **API Authentication** - Notification API now verifies user membership
2. **Input Validation** - Slug format validation (alphanumeric + hyphens only)
3. **HTML Escaping** - Email templates properly escape channel titles
4. **Security Documentation** - Complete `SECURITY.md` with best practices

#### 🛠️ Developer Experience
1. **One-Click Setup** - `database/00_COMPLETE_SETUP.sql` for instant deployment
2. **Organized Migrations** - All SQL files in `/database` folder with README
3. **Comprehensive Docs** - Updated README.md and CLAUDE.md
4. **Security Guidelines** - Rate limiting, CSP headers, email auth guides

### Documentation Files

| File | Purpose |
|------|---------|
| `README.md` | User guide, quick start, features overview |
| `CLAUDE.md` | Developer guide for AI assistants (this file) |
| `SECURITY.md` | Security best practices and recommendations |
| `database/README.md` | Database schema and migration guide |
| `database/00_COMPLETE_SETUP.sql` | Complete database setup (one file) |
| `EMAIL_NOTIFICATIONS_SETUP.md` | Email service configuration |
| `SMTP_SETUP_GUIDE.md` | SMTP provider setup instructions |

### Migration from v0.1 to v0.2

If upgrading from v0.1:

1. **Database Migration**:
   ```sql
   -- Run these two migration files in Supabase SQL Editor:
   -- 1. database/MIGRATION_add_expires_at.sql
   -- 2. database/MIGRATION_channel_customization.sql
   ```

2. **Code Updates**:
   - No breaking changes
   - Existing channels will use default theme color (indigo)
   - Existing posts will have no expiration date (null)

3. **Security Updates**:
   - Review and implement recommendations from `SECURITY.md`
   - Consider adding rate limiting before production

### File Structure Changes

```
v0.1                               v0.2
├── *.sql (root, scattered)   →   ├── database/
                                   │   ├── 00_COMPLETE_SETUP.sql (NEW)
                                   │   ├── README.md (NEW)
                                   │   └── individual migrations/
                                   ├── SECURITY.md (NEW)
                                   └── (updated documentation)
```

### Key Implementation Details

**Post Editing Flow**:
1. Click ✏️ Edit → `setEditingPostId(post.id)`
2. Form renders in place with current values
3. User modifies → State updates (`editContent`, `editCategory`, `editExpiresAt`)
4. Save → Update database + local state → Exit edit mode

**Expiration Filtering**:
- **Public page**: `posts.filter(p => !p.expires_at || new Date(p.expires_at) > now)`
- **Dashboard**: Shows all posts, adds "VYPRŠELO" badge for expired ones
- **Database**: Indexed on `expires_at` for performance

**Theme Color Application**:
- Stored in `channels.theme_color` column
- Applied via Tailwind classes: `bg-gradient-to-r from-{color}-600 to-{color2}-600`
- Affects: Buttons, links, badges, accents
- Future: Could be used for logo/banner background colors

**Slug Validation**:
- Regex: `/^[a-zA-Z0-9-]+$/`
- Max length: 100 characters
- Validated in: All `[slug]` route components before database queries
- Prevents: SQL injection, XSS via URL, error message leakage

### Future Improvement Ideas

Ideas for v0.3+ (not implemented yet):

1. **Image Uploads** - Allow images in posts (requires storage solution)
2. **Draft Posts** - Save drafts before publishing
3. **Post Templates** - Create reusable post templates
4. **Advanced Analytics** - View counts, subscriber growth charts
5. **Logo Uploads** - Use `channels.logo_url` field for custom logos
6. **Webhooks** - Notify external services when posts are published
7. **API Keys** - Allow programmatic post creation
8. **Post Scheduling** - Schedule posts for future publication
9. **Comments** - Allow subscribers to comment on posts
10. **Multi-language** - Support for Slovak/Polish translations

---

**Version**: v0.2-beta-claude-fixes  
**Last Updated**: 2025-11-08  
**Contributors**: Vlastimil Novotný (concept), Google Gemini (v0.1), Anthropic Claude Sonnet 4.5 (v0.2)
