// Auto Badge Minting Helper
// Automatically checks and mints badges when users reach milestones

import { BadgeType, Badge } from './types';
import { BADGE_CONFIGS } from './badges';

/**
 * Check if user earned new badges and automatically mint them
 * Call this after any activity that could trigger a badge
 */
export async function checkAndMintBadges(
  userWallet: string,
  _stats: {
    totalRedemptions: number;
    totalReferrals: number;
    totalReviews: number;
    totalUpvotes: number;
  }
): Promise<{
  mintedBadges: Badge[];
  errors: string[];
}> {
  const mintedBadges: Badge[] = [];
  const errors: string[] = [];

  try {
    // Fetch user's current badges
    const response = await fetch(`/api/user/badges?wallet=${userWallet}`);
    if (!response.ok) {
      errors.push('Failed to fetch user badges');
      return { mintedBadges, errors };
    }

    const data = await response.json();
    const eligibleBadges = data.eligibleBadges || [];

    // Try to mint each eligible badge
    for (const badgeType of eligibleBadges) {
      try {
        const mintResponse = await fetch('/api/badges/mint', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            wallet: userWallet,
            badgeType,
          }),
        });

        if (mintResponse.ok) {
          const result = await mintResponse.json();
          if (result.success && result.badge) {
            mintedBadges.push(result.badge);
          }
        } else {
          const error = await mintResponse.json();
          errors.push(`Failed to mint ${badgeType}: ${error.error || 'Unknown error'}`);
        }
      } catch (error) {
        errors.push(`Error minting ${badgeType}: ${error instanceof Error ? error.message : 'Unknown'}`);
      }
    }
  } catch (error) {
    errors.push(`Error in checkAndMintBadges: ${error instanceof Error ? error.message : 'Unknown'}`);
  }

  return { mintedBadges, errors };
}

/**
 * Get badge name from badge type
 */
export function getBadgeName(badgeType: BadgeType): string {
  return BADGE_CONFIGS[badgeType]?.name || badgeType;
}

/**
 * Hook for redemption milestone badges
 */
export async function onRedemptionComplete(
  userWallet: string,
  newRedemptionCount: number
): Promise<Badge[]> {
  const stats = {
    totalRedemptions: newRedemptionCount,
    totalReferrals: 0, // Will be fetched by checkAndMintBadges
    totalReviews: 0,
    totalUpvotes: 0,
  };

  const { mintedBadges, errors } = await checkAndMintBadges(userWallet, stats);

  if (errors.length > 0) {
    console.error('Badge minting errors:', errors);
  }

  return mintedBadges;
}

/**
 * Hook for review milestone badges
 */
export async function onReviewSubmitted(
  userWallet: string,
  newReviewCount: number
): Promise<Badge[]> {
  const stats = {
    totalRedemptions: 0,
    totalReferrals: 0,
    totalReviews: newReviewCount,
    totalUpvotes: 0,
  };

  const { mintedBadges, errors } = await checkAndMintBadges(userWallet, stats);

  if (errors.length > 0) {
    console.error('Badge minting errors:', errors);
  }

  return mintedBadges;
}

/**
 * Hook for referral milestone badges
 */
export async function onReferralClaimed(
  userWallet: string,
  newReferralCount: number
): Promise<Badge[]> {
  const stats = {
    totalRedemptions: 0,
    totalReferrals: newReferralCount,
    totalReviews: 0,
    totalUpvotes: 0,
  };

  const { mintedBadges, errors } = await checkAndMintBadges(userWallet, stats);

  if (errors.length > 0) {
    console.error('Badge minting errors:', errors);
  }

  return mintedBadges;
}

/**
 * Hook for upvote milestone badges
 */
export async function onUpvoteReceived(
  userWallet: string,
  newUpvoteCount: number
): Promise<Badge[]> {
  const stats = {
    totalRedemptions: 0,
    totalReferrals: 0,
    totalReviews: 0,
    totalUpvotes: newUpvoteCount,
  };

  const { mintedBadges, errors } = await checkAndMintBadges(userWallet, stats);

  if (errors.length > 0) {
    console.error('Badge minting errors:', errors);
  }

  return mintedBadges;
}
