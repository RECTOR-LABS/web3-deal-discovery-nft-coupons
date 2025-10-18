import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/database/supabase';

// POST - Submit or update a vote
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { deal_id, user_wallet, vote_type } = body;

    // Validate required fields
    if (!deal_id || !user_wallet || !vote_type) {
      return NextResponse.json(
        { error: 'Missing required fields: deal_id, user_wallet, vote_type' },
        { status: 400 }
      );
    }

    // Validate vote_type
    if (vote_type !== 'upvote' && vote_type !== 'downvote') {
      return NextResponse.json(
        { error: 'vote_type must be "upvote" or "downvote"' },
        { status: 400 }
      );
    }

    // Check if user already voted on this deal
    const { data: existingVote } = await supabase
      .from('votes')
      .select('id, vote_type')
      .eq('deal_id', deal_id)
      .eq('user_wallet', user_wallet)
      .single();

    if (existingVote) {
      // If same vote type, remove the vote (toggle off)
      if (existingVote.vote_type === vote_type) {
        const { error } = await supabase
          .from('votes')
          .delete()
          .eq('id', existingVote.id);

        if (error) {
          console.error('Database error deleting vote:', error);
          return NextResponse.json(
            { error: 'Failed to remove vote' },
            { status: 500 }
          );
        }

        return NextResponse.json({
          success: true,
          action: 'removed',
          message: 'Vote removed',
        });
      }

      // If different vote type, update the vote
      const { data, error } = await supabase
        .from('votes')
        .update({ vote_type })
        .eq('id', existingVote.id)
        .select()
        .single();

      if (error) {
        console.error('Database error updating vote:', error);
        return NextResponse.json(
          { error: 'Failed to update vote' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        action: 'updated',
        vote: data,
        message: 'Vote updated',
      });
    }

    // Insert new vote
    const { data, error } = await supabase
      .from('votes')
      .insert({
        deal_id,
        user_wallet,
        vote_type,
      })
      .select()
      .single();

    if (error) {
      console.error('Database error creating vote:', error);
      return NextResponse.json(
        { error: 'Failed to create vote' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      action: 'created',
      vote: data,
      message: 'Vote submitted',
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET - Fetch vote stats for a deal
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const deal_id = searchParams.get('deal_id');
    const user_wallet = searchParams.get('user_wallet');

    if (!deal_id) {
      return NextResponse.json(
        { error: 'Missing required parameter: deal_id' },
        { status: 400 }
      );
    }

    // Fetch all votes for the deal
    const { data: votes, error } = await supabase
      .from('votes')
      .select('*')
      .eq('deal_id', deal_id);

    if (error) {
      console.error('Database error fetching votes:', error);
      return NextResponse.json(
        { error: 'Failed to fetch votes' },
        { status: 500 }
      );
    }

    // Calculate vote counts
    const upvotes = votes?.filter(v => v.vote_type === 'upvote').length || 0;
    const downvotes = votes?.filter(v => v.vote_type === 'downvote').length || 0;
    const score = upvotes - downvotes;

    // Check user's vote if user_wallet provided
    let userVote = null;
    if (user_wallet) {
      const userVoteData = votes?.find(v => v.user_wallet === user_wallet);
      if (userVoteData) {
        userVote = userVoteData.vote_type;
      }
    }

    return NextResponse.json({
      success: true,
      stats: {
        upvotes,
        downvotes,
        score,
        total: votes?.length || 0,
      },
      userVote,
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
