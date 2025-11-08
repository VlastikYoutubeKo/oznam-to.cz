// app/api/notifications/send/route.ts - API route for sending email notifications
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendEmail } from '@/lib/emailService';
import { generateNotificationEmail } from '@/lib/emailTemplates';

// Create Supabase client with service role for server-side operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { channelSlug, channelId, postId, userId, postCategory } = body;

    // Verify the user has permission to post in this channel
    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    // Get channel info (support both slug and ID)
    let channel;
    let channelError;

    if (channelId) {
      const result = await supabaseAdmin
        .from('channels')
        .select('id, title, slug')
        .eq('id', channelId)
        .single();
      channel = result.data;
      channelError = result.error;
    } else if (channelSlug) {
      const result = await supabaseAdmin
        .from('channels')
        .select('id, title, slug')
        .eq('slug', channelSlug)
        .single();
      channel = result.data;
      channelError = result.error;
    } else {
      return NextResponse.json(
        { error: 'Either channelSlug or channelId is required' },
        { status: 400 }
      );
    }

    if (channelError || !channel) {
      return NextResponse.json(
        { error: 'Channel not found' },
        { status: 404 }
      );
    }

    // Verify user is a member of this channel (authorization)
    const { data: membership } = await supabaseAdmin
      .from('channel_members')
      .select('role')
      .eq('channel_id', channel.id)
      .eq('user_id', userId)
      .single();

    if (!membership) {
      return NextResponse.json(
        { error: 'Unauthorized - user is not a member of this channel' },
        { status: 403 }
      );
    }

    // Get post details
    const { data: post, error: postError } = await supabaseAdmin
      .from('posts')
      .select('content, category, created_at')
      .eq('id', postId)
      .single();

    if (postError || !post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    // Use post category from DB if not provided in request
    const category = postCategory || post.category;

    // Get all subscribed users for this channel
    // Filter by category preference if post has a category
    const { data: subscriptions, error: subsError } = await supabaseAdmin
      .from('channel_subscriptions')
      .select('user_id, email, categories')
      .eq('channel_id', channel.id)
      .eq('subscribed', true);

    if (subsError) {
      console.error('Error fetching subscriptions:', subsError);
      return NextResponse.json(
        { error: 'Failed to fetch subscriptions' },
        { status: 500 }
      );
    }

    if (!subscriptions || subscriptions.length === 0) {
      return NextResponse.json({
        message: 'No subscribed users to notify',
        sent: 0,
        channel: channel.slug
      });
    }

    // Filter subscriptions based on category preferences
    const filteredSubscriptions = subscriptions.filter(sub => {
      // Don't send to post author
      if (sub.user_id === userId) return false;

      // If categories is null, user wants all notifications
      if (sub.categories === null) return true;

      // If post has no category, send to everyone
      if (!category) return true;

      // Check if user's category preferences include this post's category
      return sub.categories.includes(category);
    });

    if (filteredSubscriptions.length === 0) {
      return NextResponse.json({
        message: 'No users to notify (after filtering by category preferences and excluding post author)',
        sent: 0,
        channel: channel.slug,
        totalSubscribers: subscriptions.length
      });
    }

    // Don't send email to the post author (already filtered above)
    const recipientsToNotify = filteredSubscriptions;

    if (recipientsToNotify.length === 0) {
      return NextResponse.json({
        message: 'No users to notify (excluding post author)',
        sent: 0
      });
    }

    // Send emails using configured email service (Resend or SMTP)
    const emailPromises = recipientsToNotify.map(async (subscription) => {
      const emailContent = generateNotificationEmail({
        channelTitle: channel.title,
        channelSlug: channel.slug,
        postContent: post.content,
        postCategory: post.category,
        postCreatedAt: post.created_at,
        recipientEmail: subscription.email,
      });

      try {
        const result = await sendEmail({
          to: subscription.email,
          subject: emailContent.subject,
          html: emailContent.html,
          text: emailContent.text,
        });

        if (result.success) {
          return { success: true, email: subscription.email, messageId: result.messageId };
        } else {
          console.error(`Failed to send email to ${subscription.email}:`, result.error);
          return { success: false, email: subscription.email, error: result.error };
        }
      } catch (error) {
        console.error(`Failed to send email to ${subscription.email}:`, error);
        return { success: false, email: subscription.email, error };
      }
    });

    const results = await Promise.allSettled(emailPromises);

    const successCount = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
    const failureCount = results.length - successCount;

    return NextResponse.json({
      message: 'Notification emails sent',
      sent: successCount,
      failed: failureCount,
      total: results.length,
      channel: channel.slug,
      category: category || 'none'
    });

  } catch (error) {
    console.error('Error in notification API:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
