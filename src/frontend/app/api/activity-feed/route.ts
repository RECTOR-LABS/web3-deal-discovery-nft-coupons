import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/database/supabase';

// Database query result types
interface DealData {
  id?: string;
  title?: string;
  image_url?: string | null;
  discount_percentage?: number | null;
}

interface ClaimEvent {
  id: string;
  user_wallet: string | null;
  timestamp: string | null;
  deal_id: string | null;
  deals?: DealData | null;
}

interface ReviewEvent {
  id: string;
  user_wallet: string;
  rating: number | null;
  review_text?: string | null;
  created_at: string | null;
  deal_id: string | null;
  deals?: DealData | null;
}

interface VoteEvent {
  deal_id: string | null;
  vote_type: string | null;
  created_at: string | null;
  deals?: DealData | null;
}

interface DealScore {
  score: number;
  deal: DealData | null;
  latestVote: string;
}

// Activity metadata types
type ActivityMetadata =
  | { discount?: number }  // claim
  | { rating: number; reviewText?: string | null }  // review
  | { score: number };  // trending

interface ActivityItem {
  id: string;
  type: 'claim' | 'review' | 'trending';
  timestamp: string;
  dealId: string;
  dealTitle: string;
  dealImage?: string;
  userWallet?: string;
  metadata?: ActivityMetadata;
}

// GET - Fetch recent platform activity
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');

    const activities: ActivityItem[] = [];

    // Fetch recent claims (from events table)
    const { data: recentClaims } = await supabase
      .from('events')
      .select(`
        id,
        user_wallet,
        timestamp,
        deal_id,
        deals (
          title,
          image_url,
          discount_percentage
        )
      `)
      .eq('event_type', 'purchase')
      .order('timestamp', { ascending: false })
      .limit(10);

    if (recentClaims) {
      recentClaims.forEach((claim: ClaimEvent) => {
        // Skip if missing critical fields
        if (!claim.timestamp || !claim.deal_id || !claim.user_wallet) return;

        activities.push({
          id: claim.id,
          type: 'claim',
          timestamp: claim.timestamp,
          dealId: claim.deal_id,
          dealTitle: claim.deals?.title || 'Unknown Deal',
          dealImage: claim.deals?.image_url || undefined,
          userWallet: claim.user_wallet,
          metadata: {
            discount: claim.deals?.discount_percentage || undefined,
          },
        });
      });
    }

    // Fetch recent reviews
    const { data: recentReviews } = await supabase
      .from('reviews')
      .select(`
        id,
        user_wallet,
        rating,
        review_text,
        created_at,
        deal_id,
        deals (
          title,
          image_url
        )
      `)
      .order('created_at', { ascending: false })
      .limit(10);

    if (recentReviews) {
      recentReviews.forEach((review: ReviewEvent) => {
        // Skip if missing critical fields
        if (!review.created_at || !review.deal_id || review.rating === null) return;

        activities.push({
          id: review.id,
          type: 'review',
          timestamp: review.created_at,
          dealId: review.deal_id,
          dealTitle: review.deals?.title || 'Unknown Deal',
          dealImage: review.deals?.image_url || undefined,
          userWallet: review.user_wallet,
          metadata: {
            rating: review.rating,
            reviewText: review.review_text,
          },
        });
      });
    }

    // Fetch trending deals (most upvoted in last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { data: recentVotes } = await supabase
      .from('votes')
      .select(`
        deal_id,
        vote_type,
        created_at,
        deals (
          id,
          title,
          image_url,
          discount_percentage
        )
      `)
      .gte('created_at', sevenDaysAgo.toISOString());

    // Calculate trending deals (by net score)
    if (recentVotes) {
      const dealScores: { [key: string]: DealScore } = {};

      recentVotes.forEach((vote: VoteEvent) => {
        // Skip if missing critical fields
        if (!vote.deal_id || !vote.vote_type || !vote.created_at) return;

        const dealId = vote.deal_id;
        if (!dealScores[dealId]) {
          dealScores[dealId] = {
            score: 0,
            deal: vote.deals || null,
            latestVote: vote.created_at,
          };
        }

        if (vote.vote_type === 'upvote') {
          dealScores[dealId].score += 1;
        } else if (vote.vote_type === 'downvote') {
          dealScores[dealId].score -= 1;
        }

        // Track latest vote timestamp
        if (new Date(vote.created_at) > new Date(dealScores[dealId].latestVote)) {
          dealScores[dealId].latestVote = vote.created_at;
        }
      });

      // Sort by score and get top 5 trending deals
      const trending = Object.entries(dealScores)
        .filter(([_, data]) => data.score > 0) // Only deals with positive score
        .sort(([_, a], [__, b]) => b.score - a.score)
        .slice(0, 5);

      trending.forEach(([dealId, data]) => {
        activities.push({
          id: `trending-${dealId}`,
          type: 'trending',
          timestamp: data.latestVote,
          dealId: dealId,
          dealTitle: data.deal?.title || 'Unknown Deal',
          dealImage: data.deal?.image_url || undefined,
          metadata: {
            score: data.score,
            discount: data.deal?.discount_percentage || undefined,
          },
        });
      });
    }

    // Sort all activities by timestamp (most recent first)
    const sortedActivities = activities
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);

    return NextResponse.json({
      success: true,
      activities: sortedActivities,
      total: sortedActivities.length,
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
