# Database Setup

This folder contains all database setup scripts for the **Oznam to!** project.

## 🚀 Quick Start (For New Projects)

**Just want to get started?** Use this single file:

### **`00_COMPLETE_SETUP.sql`** ← START HERE!

This file contains **everything** you need to set up the complete database from scratch:
- ✅ All tables (channels, posts, channel_members, channel_subscriptions)
- ✅ All indexes for performance
- ✅ Row Level Security (RLS) policies
- ✅ Database functions (toggle_pin_post, add_member_by_email)
- ✅ Triggers for auto-updating timestamps
- ✅ Post expiration feature
- ✅ Channel customization (description, theme colors)

**To apply:**
1. Open your Supabase project dashboard
2. Go to SQL Editor
3. Copy and paste the **entire** `00_COMPLETE_SETUP.sql` file
4. Click "Run"
5. Done! 🎉

---

## 📁 Individual Migration Files

The `/database` folder also contains individual migration files if you want to understand what each part does or apply them separately:

### Core Setup
- **supabase_migrations.sql** - Original notification subscriptions (legacy, now replaced by channel_subscriptions)
- **supabase_migrations_channel_subscriptions.sql** - Per-channel subscription system

### Feature Migrations
- **MIGRATION_add_expires_at.sql** - Adds post expiration dates
- **MIGRATION_channel_customization.sql** - Adds channel appearance customization (description, theme colors, logo)

### Fixes & Adjustments
- **HOTFIX_registration_trigger.sql** - Fixes auto-subscription trigger for new users
- **DISABLE_auto_subscription.sql** - Disables automatic /updates channel subscription
- **MIGRATE_EXISTING_SUBSCRIPTIONS.sql** - Migration script for existing subscription data

### Testing
- **TEST_NOTIFICATIONS.sql** - Test scripts for email notification system

---

## 🔄 Migration Order (If Applying Individually)

**⚠️ Only use this if you're NOT using the `00_COMPLETE_SETUP.sql` file!**

If you want to apply migrations one by one, follow this order:

1. Create base tables manually (channels, posts, channel_members) OR use sections from `00_COMPLETE_SETUP.sql`
2. `supabase_migrations_channel_subscriptions.sql` - Subscription system
3. `MIGRATION_add_expires_at.sql` - Post expiration
4. `MIGRATION_channel_customization.sql` - Channel customization
5. (Optional) `HOTFIX_registration_trigger.sql` - If using /updates channel

---

## 📖 Database Schema

### Tables

#### **channels**
Stores announcement boards/channels.
```sql
id              uuid PRIMARY KEY
title           text
slug            text UNIQUE
description     text (optional - shown on public page)
theme_color     text (default: 'indigo')
logo_url        text (optional)
created_at      timestamp
```

#### **posts**
Stores announcements within channels.
```sql
id              uuid PRIMARY KEY
channel_id      uuid (foreign key → channels)
user_id         uuid (foreign key → auth.users)
content         text (HTML content)
category        text ('info', 'warning', 'event', 'maintenance')
is_pinned       boolean
expires_at      timestamp (optional - post hidden after this date)
created_at      timestamp
```

#### **channel_members**
Role-based access control for channels.
```sql
channel_id      uuid (foreign key → channels)
user_id         uuid (foreign key → auth.users)
role            text ('owner' or 'admin')
PRIMARY KEY (channel_id, user_id)
```

#### **channel_subscriptions**
Email notification subscriptions per channel.
```sql
id              uuid PRIMARY KEY
user_id         uuid (foreign key → auth.users)
channel_id      uuid (foreign key → channels)
email           text
subscribed      boolean
categories      text[] (NULL = all, array = specific categories)
created_at      timestamp
updated_at      timestamp
UNIQUE (user_id, channel_id)
```

### Functions

#### **toggle_pin_post(post_id, pin_state)**
Toggles post pinning status.

#### **add_member_by_email(channel_id, email, role)**
Adds or updates a channel member by their email address.

---

## 🛡️ Security Notes

The database uses Row Level Security (RLS) to protect data:

- **Channels**: Public read, owners can modify
- **Posts**: Public read, members can create, authors/owners can edit/delete
- **Members**: Only visible to channel members, only owners can modify
- **Subscriptions**: Users can only manage their own subscriptions

---

## 🚨 Important: Environment Variables

After setting up the database, make sure your `.env.local` file contains:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

**⚠️ NEVER commit `.env.local` to git!** It contains sensitive credentials.

---

## 🆘 Troubleshooting

### "Permission denied" errors
- Make sure RLS is properly configured
- Check that you're logged in as a user with the correct role

### "Function does not exist" errors
- Make sure you ran the complete setup file
- Check that `toggle_pin_post` and `add_member_by_email` functions exist

### Email notifications not working
- Verify SMTP credentials in `.env.local`
- Check that `channel_subscriptions` table exists
- Look at browser console for API errors

---

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Next.js + Supabase Guide](https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs)

---

## Need Help?

If you encounter issues:
1. Check the Supabase SQL Editor for error messages
2. Verify all environment variables are set correctly
3. Make sure you're using Postgres 14+ (Supabase default)
4. Check the application logs in browser console
