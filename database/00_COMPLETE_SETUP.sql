-- ===================================================================
-- Oznam to! - Complete Database Setup
-- ===================================================================
-- This file contains ALL database migrations in the correct order.
-- Run this ONCE on a fresh Supabase project to set up everything.
--
-- To apply: Copy and paste this entire file into Supabase SQL Editor
-- ===================================================================

-- ===================================================================
-- PART 1: Core Tables (Channels, Posts, Members)
-- ===================================================================

-- 1.1 Channels Table
CREATE TABLE IF NOT EXISTS channels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  theme_color text DEFAULT 'indigo',
  logo_url text,
  created_at timestamp with time zone DEFAULT now()
);

-- 1.2 Posts Table
CREATE TABLE IF NOT EXISTS posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id uuid REFERENCES channels(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  category text CHECK (category IN ('info', 'warning', 'event', 'maintenance')),
  is_pinned boolean DEFAULT false,
  expires_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now()
);

-- 1.3 Channel Members Table (Role-Based Access Control)
CREATE TABLE IF NOT EXISTS channel_members (
  channel_id uuid REFERENCES channels(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('owner', 'admin')),
  PRIMARY KEY (channel_id, user_id)
);

-- ===================================================================
-- PART 2: Email Notification System
-- ===================================================================

-- 2.1 Channel Subscriptions Table (Per-Channel Subscriptions)
CREATE TABLE IF NOT EXISTS channel_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  channel_id uuid REFERENCES channels(id) ON DELETE CASCADE NOT NULL,
  email text NOT NULL,
  subscribed boolean DEFAULT true,
  categories text[], -- NULL = all categories, empty array = none, specific values = only those
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, channel_id)
);

-- ===================================================================
-- PART 3: Indexes for Performance
-- ===================================================================

-- 3.1 Channels Indexes
CREATE INDEX IF NOT EXISTS idx_channels_slug ON channels(slug);
CREATE INDEX IF NOT EXISTS idx_channels_theme ON channels(theme_color);

-- 3.2 Posts Indexes
CREATE INDEX IF NOT EXISTS idx_posts_channel_id ON posts(channel_id);
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category);
CREATE INDEX IF NOT EXISTS idx_posts_is_pinned ON posts(is_pinned) WHERE is_pinned = true;
CREATE INDEX IF NOT EXISTS idx_posts_expires_at ON posts(expires_at) WHERE expires_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);

-- 3.3 Channel Members Indexes
CREATE INDEX IF NOT EXISTS idx_channel_members_user_id ON channel_members(user_id);
CREATE INDEX IF NOT EXISTS idx_channel_members_role ON channel_members(role);

-- 3.4 Channel Subscriptions Indexes
CREATE INDEX IF NOT EXISTS idx_channel_subscriptions_user_id ON channel_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_channel_subscriptions_channel_id ON channel_subscriptions(channel_id);
CREATE INDEX IF NOT EXISTS idx_channel_subscriptions_subscribed ON channel_subscriptions(subscribed) WHERE subscribed = true;
CREATE INDEX IF NOT EXISTS idx_channel_subscriptions_user_channel ON channel_subscriptions(user_id, channel_id);

-- ===================================================================
-- PART 4: Row Level Security (RLS) Policies
-- ===================================================================

-- 4.1 Enable RLS on all tables
ALTER TABLE channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE channel_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE channel_subscriptions ENABLE ROW LEVEL SECURITY;

-- 4.2 Channels Policies
-- Public read access for channels
CREATE POLICY "Channels are publicly readable"
  ON channels FOR SELECT
  USING (true);

-- Authenticated users can create channels
CREATE POLICY "Authenticated users can create channels"
  ON channels FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Channel owners can update their channels
CREATE POLICY "Channel owners can update channels"
  ON channels FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM channel_members
      WHERE channel_members.channel_id = channels.id
      AND channel_members.user_id = auth.uid()
      AND channel_members.role = 'owner'
    )
  );

-- Channel owners can delete their channels
CREATE POLICY "Channel owners can delete channels"
  ON channels FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM channel_members
      WHERE channel_members.channel_id = channels.id
      AND channel_members.user_id = auth.uid()
      AND channel_members.role = 'owner'
    )
  );

-- 4.3 Posts Policies
-- Public read access for posts
CREATE POLICY "Posts are publicly readable"
  ON posts FOR SELECT
  USING (true);

-- Channel members can create posts
CREATE POLICY "Channel members can create posts"
  ON posts FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM channel_members
      WHERE channel_members.channel_id = posts.channel_id
      AND channel_members.user_id = auth.uid()
    )
  );

-- Post authors and channel owners can update posts
CREATE POLICY "Post authors and owners can update posts"
  ON posts FOR UPDATE
  USING (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM channel_members
      WHERE channel_members.channel_id = posts.channel_id
      AND channel_members.user_id = auth.uid()
      AND channel_members.role = 'owner'
    )
  );

-- Post authors and channel owners can delete posts
CREATE POLICY "Post authors and owners can delete posts"
  ON posts FOR DELETE
  USING (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM channel_members
      WHERE channel_members.channel_id = posts.channel_id
      AND channel_members.user_id = auth.uid()
      AND channel_members.role = 'owner'
    )
  );

-- 4.4 Channel Members Policies
-- Channel members can view membership of their channels
CREATE POLICY "Users can view channel members"
  ON channel_members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM channel_members cm
      WHERE cm.channel_id = channel_members.channel_id
      AND cm.user_id = auth.uid()
    )
  );

-- Channel owners can manage members
CREATE POLICY "Channel owners can manage members"
  ON channel_members FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM channel_members cm
      WHERE cm.channel_id = channel_members.channel_id
      AND cm.user_id = auth.uid()
      AND cm.role = 'owner'
    )
  );

-- 4.5 Channel Subscriptions Policies
-- Users can view their own subscriptions
CREATE POLICY "Users can view own channel subscriptions"
  ON channel_subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create their own subscriptions
CREATE POLICY "Users can create own channel subscriptions"
  ON channel_subscriptions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own subscriptions
CREATE POLICY "Users can update own channel subscriptions"
  ON channel_subscriptions FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own subscriptions
CREATE POLICY "Users can delete own channel subscriptions"
  ON channel_subscriptions FOR DELETE
  USING (auth.uid() = user_id);

-- ===================================================================
-- PART 5: Database Functions
-- ===================================================================

-- 5.1 Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 5.2 Function to toggle post pin (ensures only one pinned post per channel)
-- NOTE: This is a simple version - remove this if you want multiple pinned posts
CREATE OR REPLACE FUNCTION toggle_pin_post(post_id_to_pin uuid, pin_state boolean)
RETURNS json AS $$
DECLARE
  result json;
BEGIN
  -- Update the post's pin status
  UPDATE posts
  SET is_pinned = pin_state
  WHERE id = post_id_to_pin;

  -- Return success
  SELECT json_build_object('success', true) INTO result;
  RETURN result;
EXCEPTION WHEN OTHERS THEN
  -- Return error
  SELECT json_build_object('error', SQLERRM) INTO result;
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5.3 Function to add member by email
CREATE OR REPLACE FUNCTION add_member_by_email(
  target_channel_id uuid,
  invited_email text,
  member_role text
)
RETURNS json AS $$
DECLARE
  target_user_id uuid;
  result json;
BEGIN
  -- Validate role
  IF member_role NOT IN ('owner', 'admin') THEN
    SELECT json_build_object('error', 'Invalid role. Must be owner or admin.') INTO result;
    RETURN result;
  END IF;

  -- Find user by email
  SELECT id INTO target_user_id
  FROM auth.users
  WHERE email = invited_email
  LIMIT 1;

  IF target_user_id IS NULL THEN
    SELECT json_build_object('error', 'User with email ' || invited_email || ' not found') INTO result;
    RETURN result;
  END IF;

  -- Check if requester is owner of the channel
  IF NOT EXISTS (
    SELECT 1 FROM channel_members
    WHERE channel_id = target_channel_id
    AND user_id = auth.uid()
    AND role = 'owner'
  ) THEN
    SELECT json_build_object('error', 'Only channel owners can add members') INTO result;
    RETURN result;
  END IF;

  -- Insert or update member
  INSERT INTO channel_members (channel_id, user_id, role)
  VALUES (target_channel_id, target_user_id, member_role)
  ON CONFLICT (channel_id, user_id)
  DO UPDATE SET role = member_role;

  SELECT json_build_object('success', true) INTO result;
  RETURN result;
EXCEPTION WHEN OTHERS THEN
  SELECT json_build_object('error', SQLERRM) INTO result;
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===================================================================
-- PART 6: Triggers
-- ===================================================================

-- 6.1 Trigger to auto-update updated_at on channel_subscriptions
CREATE TRIGGER update_channel_subscriptions_updated_at
  BEFORE UPDATE ON channel_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ===================================================================
-- PART 7: Sample Data (Optional - Comment out if not needed)
-- ===================================================================

-- Uncomment below to create a sample "updates" channel
/*
DO $$
DECLARE
  updates_channel_id uuid;
  admin_user_id uuid;
BEGIN
  -- Get the first admin user (or create your own user first)
  SELECT id INTO admin_user_id FROM auth.users LIMIT 1;

  IF admin_user_id IS NOT NULL THEN
    -- Create /updates channel
    INSERT INTO channels (title, slug, description, theme_color)
    VALUES (
      'Platform Updates',
      'updates',
      'Official platform announcements and updates',
      'indigo'
    )
    RETURNING id INTO updates_channel_id;

    -- Make the admin user the owner
    INSERT INTO channel_members (channel_id, user_id, role)
    VALUES (updates_channel_id, admin_user_id, 'owner');

    RAISE NOTICE 'Created /updates channel with ID: %', updates_channel_id;
  ELSE
    RAISE NOTICE 'No users found. Create a user first, then run this again.';
  END IF;
END $$;
*/

-- ===================================================================
-- Setup Complete!
-- ===================================================================
-- Next steps:
-- 1. Create your first user via the signup page
-- 2. Create your first channel via /dashboard
-- 3. Configure .env.local with your Supabase credentials
-- 4. (Optional) Configure SMTP for email notifications
--
-- For email notifications to work, you also need to:
-- - Set up SMTP credentials in .env.local
-- - OR use Resend API (https://resend.com)
-- ===================================================================
