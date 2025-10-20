import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/database/supabase';

// POST - Submit a review
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { deal_id, user_wallet, rating, review_text } = body;

    // Validate required fields
    if (!deal_id || !user_wallet || !rating) {
      return NextResponse.json(
        { error: 'Missing required fields: deal_id, user_wallet, rating' },
        { status: 400 }
      );
    }

    // Validate rating range (1-5)
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Check if user already reviewed this deal
    const { data: existingReview } = await supabase
      .from('reviews')
      .select('id')
      .eq('deal_id', deal_id)
      .eq('user_wallet', user_wallet)
      .single();

    if (existingReview) {
      // Update existing review
      const { data, error } = await supabase
        .from('reviews')
        .update({
          rating,
          review_text: review_text || null,
        })
        .eq('id', existingReview.id)
        .select()
        .single();

      if (error) {
        console.error('Database error updating review:', error);
        return NextResponse.json(
          { error: 'Failed to update review' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        review: data,
        message: 'Review updated successfully',
      });
    }

    // Insert new review
    const { data, error } = await supabase
      .from('reviews')
      .insert({
        deal_id,
        user_wallet,
        rating,
        review_text: review_text || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Database error creating review:', error);
      return NextResponse.json(
        { error: 'Failed to create review' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      review: data,
      message: 'Review submitted successfully',
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET - Fetch reviews for a deal
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const deal_id = searchParams.get('deal_id');

    if (!deal_id) {
      return NextResponse.json(
        { error: 'Missing required parameter: deal_id' },
        { status: 400 }
      );
    }

    // Fetch all reviews for the deal
    const { data: reviews, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('deal_id', deal_id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Database error fetching reviews:', error);
      return NextResponse.json(
        { error: 'Failed to fetch reviews' },
        { status: 500 }
      );
    }

    // Calculate average rating
    const totalReviews = reviews?.length || 0;
    const avgRating = totalReviews > 0
      ? reviews.reduce((sum, review) => sum + (review.rating || 0), 0) / totalReviews
      : 0;

    return NextResponse.json({
      success: true,
      reviews: reviews || [],
      stats: {
        total: totalReviews,
        average: Math.round(avgRating * 10) / 10, // Round to 1 decimal
      },
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
