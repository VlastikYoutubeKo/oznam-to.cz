// app/api/subscriptions/route.ts - Get all channel subscriptions for a user
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
 * GET /api/subscriptions
 * Get all channel subscriptions for the authenticated user
 */
export async function GET(request: NextRequest) {
  try {
    // Get user ID from query params (client should send this)
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Get all subscriptions for this user with channel details
    const { data: subscriptions, error } = await supabaseAdmin
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
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching subscriptions:', error);
      return NextResponse.json(
        { error: 'Failed to fetch subscriptions' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      subscriptions: subscriptions || [],
      count: subscriptions?.length || 0
    });

  } catch (error) {
    console.error('Error in subscriptions API:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
