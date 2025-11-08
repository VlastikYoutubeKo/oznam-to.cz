// app/api/subscriptions/[channelId]/route.ts - Manage subscription for a specific channel
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

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

/**
 * GET /api/subscriptions/[channelId]
 * Get subscription status for a specific channel
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ channelId: string }> }
) {
  try {
    const { channelId } = await params;
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Get subscription for this user and channel
    const { data: subscription, error } = await supabaseAdmin
      .from('channel_subscriptions')
      .select(`
        id,
        channel_id,
        email,
        subscribed,
        categories,
        created_at,
        updated_at,
        channels (
          id,
          title,
          slug
        )
      `)
      .eq('user_id', userId)
      .eq('channel_id', channelId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error fetching subscription:', error);
      return NextResponse.json(
        { error: 'Failed to fetch subscription' },
        { status: 500 }
      );
    }

    // If no subscription exists, return default state
    if (!subscription) {
      return NextResponse.json({
        subscribed: false,
        categories: null,
        exists: false
      });
    }

    return NextResponse.json({
      subscribed: subscription.subscribed,
      categories: subscription.categories,
      email: subscription.email,
      channel: subscription.channels,
      exists: true
    });

  } catch (error) {
    console.error('Error in subscription GET API:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/subscriptions/[channelId]
 * Subscribe to or update subscription for a channel
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ channelId: string }> }
) {
  try {
    const { channelId } = await params;
    const body = await request.json();
    const { userId, email, subscribed, categories } = body;

    if (!userId || !email) {
      return NextResponse.json(
        { error: 'User ID and email are required' },
        { status: 400 }
      );
    }

    // Verify channel exists
    const { data: channel, error: channelError } = await supabaseAdmin
      .from('channels')
      .select('id, title, slug')
      .eq('id', channelId)
      .single();

    if (channelError || !channel) {
      return NextResponse.json(
        { error: 'Channel not found' },
        { status: 404 }
      );
    }

    // Validate categories if provided
    const validCategories = ['info', 'warning', 'event', 'maintenance'];
    if (categories && Array.isArray(categories)) {
      const invalidCategories = categories.filter(cat => !validCategories.includes(cat));
      if (invalidCategories.length > 0) {
        return NextResponse.json(
          { error: `Invalid categories: ${invalidCategories.join(', ')}` },
          { status: 400 }
        );
      }
    }

    // Upsert subscription
    const { data: subscription, error: upsertError } = await supabaseAdmin
      .from('channel_subscriptions')
      .upsert({
        user_id: userId,
        channel_id: channelId,
        email,
        subscribed: subscribed !== undefined ? subscribed : true,
        categories: categories !== undefined ? categories : null // null = all categories
      }, {
        onConflict: 'user_id,channel_id'
      })
      .select()
      .single();

    if (upsertError) {
      console.error('Error upserting subscription:', upsertError);
      return NextResponse.json(
        { error: 'Failed to update subscription' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Subscription updated successfully',
      subscription: {
        subscribed: subscription.subscribed,
        categories: subscription.categories,
        email: subscription.email,
        channel: channel
      }
    });

  } catch (error) {
    console.error('Error in subscription POST API:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/subscriptions/[channelId]
 * Unsubscribe from a channel (deletes the subscription record)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ channelId: string }> }
) {
  try {
    const { channelId } = await params;
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Delete subscription
    const { error } = await supabaseAdmin
      .from('channel_subscriptions')
      .delete()
      .eq('user_id', userId)
      .eq('channel_id', channelId);

    if (error) {
      console.error('Error deleting subscription:', error);
      return NextResponse.json(
        { error: 'Failed to delete subscription' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Unsubscribed successfully'
    });

  } catch (error) {
    console.error('Error in subscription DELETE API:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/subscriptions/[channelId]
 * Update specific fields of a subscription (e.g., just categories or just subscribed status)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ channelId: string }> }
) {
  try {
    const { channelId } = await params;
    const body = await request.json();
    const { userId, subscribed, categories, email } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Validate categories if provided
    if (categories !== undefined) {
      const validCategories = ['info', 'warning', 'event', 'maintenance'];
      if (categories !== null && Array.isArray(categories)) {
        const invalidCategories = categories.filter(cat => !validCategories.includes(cat));
        if (invalidCategories.length > 0) {
          return NextResponse.json(
            { error: `Invalid categories: ${invalidCategories.join(', ')}` },
            { status: 400 }
          );
        }
      }
    }

    // Build update object with only provided fields
    const updateData: any = {};
    if (subscribed !== undefined) updateData.subscribed = subscribed;
    if (categories !== undefined) updateData.categories = categories;
    if (email !== undefined) updateData.email = email;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'No fields to update' },
        { status: 400 }
      );
    }

    // Update subscription
    const { data: subscription, error: updateError } = await supabaseAdmin
      .from('channel_subscriptions')
      .update(updateData)
      .eq('user_id', userId)
      .eq('channel_id', channelId)
      .select(`
        id,
        channel_id,
        email,
        subscribed,
        categories,
        channels (
          id,
          title,
          slug
        )
      `)
      .single();

    if (updateError) {
      console.error('Error updating subscription:', updateError);
      return NextResponse.json(
        { error: 'Failed to update subscription' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Subscription updated successfully',
      subscription: {
        subscribed: subscription.subscribed,
        categories: subscription.categories,
        email: subscription.email,
        channel: subscription.channels
      }
    });

  } catch (error) {
    console.error('Error in subscription PATCH API:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
