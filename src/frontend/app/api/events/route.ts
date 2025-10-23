import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/database/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { event_type, deal_id, user_wallet, metadata } = body;

    // Validate required fields
    if (!event_type) {
      return NextResponse.json(
        { error: 'event_type is required' },
        { status: 400 }
      );
    }

    // Insert event into database
    const { data, error } = await supabase
      .from('events')
      .insert({
        event_type,
        deal_id: deal_id || null,
        user_wallet: user_wallet || null,
        metadata: metadata || null,
        timestamp: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Database error inserting event:', error);
      return NextResponse.json(
        { error: 'Failed to create event', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, event: data }, { status: 201 });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
