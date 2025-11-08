// app/api/notifications/debug/route.ts - Debug notification sending
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendEmail } from '@/lib/emailService';
import { generateNotificationEmail } from '@/lib/emailTemplates';

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

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const channelSlug = searchParams.get('channel') || 'updates';

    // Get channel info
    const { data: channel, error: channelError } = await supabaseAdmin
      .from('channels')
      .select('id, title, slug')
      .eq('slug', channelSlug)
      .single();

    if (channelError || !channel) {
      return NextResponse.json({
        error: 'Channel not found',
        slug: channelSlug
      }, { status: 404 });
    }

    // Get all subscribed users for this channel
    const { data: subscriptions, error: subsError } = await supabaseAdmin
      .from('channel_subscriptions')
      .select('user_id, email, categories')
      .eq('channel_id', channel.id)
      .eq('subscribed', true);

    if (subsError) {
      return NextResponse.json({
        error: 'Failed to fetch subscriptions',
        details: subsError
      }, { status: 500 });
    }

    if (!subscriptions || subscriptions.length === 0) {
      return NextResponse.json({
        message: 'No subscribed users found',
        channel: channel.slug
      });
    }

    // Test sending to each subscriber
    const testResults = await Promise.all(
      subscriptions.map(async (sub) => {
        const emailContent = generateNotificationEmail({
          channelTitle: channel.title,
          channelSlug: channel.slug,
          postContent: '<p>This is a <strong>test notification</strong> from the debug endpoint.</p>',
          postCategory: 'info',
          postCreatedAt: new Date().toISOString(),
          recipientEmail: sub.email,
        });

        try {
          const result = await sendEmail({
            to: sub.email,
            subject: emailContent.subject,
            html: emailContent.html,
            text: emailContent.text,
          });

          return {
            email: sub.email,
            success: result.success,
            messageId: result.messageId,
            error: result.error || null,
          };
        } catch (error) {
          return {
            email: sub.email,
            success: false,
            error: error instanceof Error ? error.message : String(error),
          };
        }
      })
    );

    const successCount = testResults.filter(r => r.success).length;
    const failedCount = testResults.filter(r => !r.success).length;

    return NextResponse.json({
      message: 'Debug notification test complete',
      channel: channel.slug,
      totalSubscribers: subscriptions.length,
      sent: successCount,
      failed: failedCount,
      results: testResults,
    });

  } catch (error) {
    console.error('Error in debug notification API:', error);
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
