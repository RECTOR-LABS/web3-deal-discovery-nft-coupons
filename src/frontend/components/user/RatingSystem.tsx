'use client';

import { useState, useEffect, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Star, Send, Loader } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Review {
  id: string;
  user_wallet: string;
  rating: number;
  review_text: string | null;
  created_at: string;
}

interface RatingStats {
  total: number;
  average: number;
}

interface RatingSystemProps {
  dealId: string;
}

export default function RatingSystem({ dealId }: RatingSystemProps) {
  const { publicKey } = useWallet();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<RatingStats>({ total: 0, average: 0 });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // User input
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);

  // Fetch reviews
  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/reviews?deal_id=${dealId}`);
      if (response.ok) {
        const data = await response.json();
        setReviews(data.reviews || []);
        setStats(data.stats || { total: 0, average: 0 });
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  }, [dealId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  async function handleSubmitReview() {
    if (!publicKey || userRating === 0) return;

    try {
      setSubmitting(true);
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deal_id: dealId,
          user_wallet: publicKey.toBase58(),
          rating: userRating,
          review_text: reviewText.trim() || null,
        }),
      });

      if (response.ok) {
        // Reset form
        setUserRating(0);
        setReviewText('');
        setShowReviewForm(false);
        // Refresh reviews
        await fetchReviews();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to submit review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  }

  const displayRating = hoverRating || userRating;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      {/* Header with Average Rating */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-2xl font-bold text-[#0d2a13]">Ratings & Reviews</h3>
          {stats.total > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${
                      star <= Math.round(stats.average)
                        ? 'fill-[#00ff4d] text-[#00ff4d]'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-[#0d2a13] font-bold text-lg">
                {stats.average.toFixed(1)}
              </span>
              <span className="text-[#174622] text-sm">({stats.total} reviews)</span>
            </div>
          )}
        </div>

        {/* Write a Review Button */}
        {publicKey && (
          <button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="text-[#00ff4d] hover:text-[#00ff4d]/80 font-semibold text-sm"
          >
            {showReviewForm ? 'Cancel' : '+ Write a Review'}
          </button>
        )}

        {!publicKey && (
          <p className="text-[#174622] text-sm">Connect your wallet to leave a review</p>
        )}
      </div>

      {/* Review Form */}
      <AnimatePresence>
        {showReviewForm && publicKey && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 bg-[#f2eecb] rounded-xl p-4"
          >
            <div className="mb-4">
              <label className="block text-[#0d2a13] font-semibold mb-2">Your Rating</label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setUserRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= displayRating
                          ? 'fill-[#00ff4d] text-[#00ff4d]'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
                {userRating > 0 && (
                  <span className="ml-2 text-[#0d2a13] font-semibold">
                    {userRating} / 5
                  </span>
                )}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-[#0d2a13] font-semibold mb-2">
                Your Review (Optional)
              </label>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Share your experience with this deal..."
                className="w-full px-4 py-3 rounded-lg border-2 border-[#174622]/20 focus:border-[#00ff4d] focus:outline-none resize-none"
                rows={4}
                maxLength={500}
              />
              <p className="text-xs text-[#174622] mt-1">{reviewText.length}/500 characters</p>
            </div>

            <button
              onClick={handleSubmitReview}
              disabled={userRating === 0 || submitting}
              className="w-full bg-[#00ff4d] hover:bg-[#00ff4d]/90 disabled:bg-gray-300 disabled:cursor-not-allowed text-[#0d2a13] font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Submit Review
                </>
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reviews List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8">
            <Loader className="w-8 h-8 animate-spin text-[#00ff4d] mx-auto" />
            <p className="text-[#174622] mt-2">Loading reviews...</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-8 bg-[#f2eecb]/50 rounded-xl">
            <Star className="w-12 h-12 text-[#174622]/30 mx-auto mb-2" />
            <p className="text-[#0d2a13] font-semibold">No reviews yet</p>
            <p className="text-[#174622] text-sm">Be the first to review this deal!</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div
              key={review.id}
              className="bg-[#f2eecb] rounded-xl p-4 border-l-4 border-[#00ff4d]"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= review.rating
                            ? 'fill-[#00ff4d] text-[#00ff4d]'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-[#174622] font-mono">
                    {review.user_wallet.slice(0, 4)}...{review.user_wallet.slice(-4)}
                  </p>
                </div>
                <p className="text-xs text-[#174622]">
                  {new Date(review.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              </div>

              {review.review_text && (
                <p className="text-[#0d2a13] text-sm leading-relaxed">{review.review_text}</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
