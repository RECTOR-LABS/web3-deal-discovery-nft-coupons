// Badge Configuration and Eligibility Logic

import { BadgeConfig, BadgeType, Badge } from './types';

export const BADGE_CONFIGS: Record<BadgeType, BadgeConfig> = {
  first_steps: {
    type: 'first_steps',
    name: 'First Steps',
    description: 'Claimed your first coupon',
    rarity: 'Common',
    imageUrl: '/badges/first-steps.png',
    category: 'Milestone',
    requirement: {
      type: 'redemptions',
      count: 1,
    },
  },
  deal_hunter: {
    type: 'deal_hunter',
    name: 'Deal Hunter',
    description: 'Completed 10 redemptions',
    rarity: 'Uncommon',
    imageUrl: '/badges/deal-hunter.png',
    category: 'Milestone',
    requirement: {
      type: 'redemptions',
      count: 10,
    },
  },
  savvy_shopper: {
    type: 'savvy_shopper',
    name: 'Savvy Shopper',
    description: 'Completed 25 redemptions',
    rarity: 'Rare',
    imageUrl: '/badges/savvy-shopper.png',
    category: 'Milestone',
    requirement: {
      type: 'redemptions',
      count: 25,
    },
  },
  discount_master: {
    type: 'discount_master',
    name: 'Discount Master',
    description: 'Completed 50 redemptions',
    rarity: 'Epic',
    imageUrl: '/badges/discount-master.png',
    category: 'Milestone',
    requirement: {
      type: 'redemptions',
      count: 50,
    },
  },
  social_butterfly: {
    type: 'social_butterfly',
    name: 'Social Butterfly',
    description: '10 successful referrals',
    rarity: 'Uncommon',
    imageUrl: '/badges/social-butterfly.png',
    category: 'Social',
    requirement: {
      type: 'referrals',
      count: 10,
    },
  },
  influencer: {
    type: 'influencer',
    name: 'Influencer',
    description: '25 successful referrals',
    rarity: 'Rare',
    imageUrl: '/badges/influencer.png',
    category: 'Social',
    requirement: {
      type: 'referrals',
      count: 25,
    },
  },
  critic: {
    type: 'critic',
    name: 'Critic',
    description: 'Written 20 reviews',
    rarity: 'Uncommon',
    imageUrl: '/badges/critic.png',
    category: 'Quality',
    requirement: {
      type: 'reviews',
      count: 20,
    },
  },
  community_champion: {
    type: 'community_champion',
    name: 'Community Champion',
    description: 'Received 50 upvotes on reviews',
    rarity: 'Rare',
    imageUrl: '/badges/community-champion.png',
    category: 'Quality',
    requirement: {
      type: 'upvotes',
      count: 50,
    },
  },
};

/**
 * Get rarity color for badge display
 */
export function getBadgeRarityColor(rarity: BadgeConfig['rarity']): string {
  switch (rarity) {
    case 'Common':
      return '#9E9E9E'; // Gray
    case 'Uncommon':
      return '#4CAF50'; // Green
    case 'Rare':
      return '#2196F3'; // Blue
    case 'Epic':
      return '#9C27B0'; // Purple
    default:
      return '#9E9E9E';
  }
}

/**
 * Check which badges a user is eligible for based on their stats
 */
export function checkEligibleBadges(
  stats: {
    totalRedemptions: number;
    totalReferrals: number;
    totalReviews: number;
    totalUpvotes: number;
  },
  earnedBadges: Badge[]
): BadgeType[] {
  const earnedBadgeTypes = new Set(earnedBadges.map((b) => b.badgeType));
  const eligibleBadges: BadgeType[] = [];

  Object.entries(BADGE_CONFIGS).forEach(([badgeType, config]) => {
    // Skip if already earned
    if (earnedBadgeTypes.has(badgeType as BadgeType)) return;

    // Check eligibility based on requirement
    const { type: reqType, count: reqCount } = config.requirement;
    let statValue = 0;

    switch (reqType) {
      case 'redemptions':
        statValue = stats.totalRedemptions;
        break;
      case 'referrals':
        statValue = stats.totalReferrals;
        break;
      case 'reviews':
        statValue = stats.totalReviews;
        break;
      case 'upvotes':
        statValue = stats.totalUpvotes;
        break;
    }

    if (statValue >= reqCount) {
      eligibleBadges.push(badgeType as BadgeType);
    }
  });

  return eligibleBadges;
}

/**
 * Get next badges a user can unlock with progress
 */
export function getNextBadges(
  stats: {
    totalRedemptions: number;
    totalReferrals: number;
    totalReviews: number;
    totalUpvotes: number;
  },
  earnedBadges: Badge[]
): Array<{
  badge: BadgeConfig;
  progress: number;
  remaining: number;
}> {
  const earnedBadgeTypes = new Set(earnedBadges.map((b) => b.badgeType));
  const nextBadges: Array<{
    badge: BadgeConfig;
    progress: number;
    remaining: number;
  }> = [];

  Object.values(BADGE_CONFIGS).forEach((config) => {
    // Skip if already earned
    if (earnedBadgeTypes.has(config.type)) return;

    // Calculate progress
    const { type: reqType, count: reqCount } = config.requirement;
    let statValue = 0;

    switch (reqType) {
      case 'redemptions':
        statValue = stats.totalRedemptions;
        break;
      case 'referrals':
        statValue = stats.totalReferrals;
        break;
      case 'reviews':
        statValue = stats.totalReviews;
        break;
      case 'upvotes':
        statValue = stats.totalUpvotes;
        break;
    }

    if (statValue < reqCount) {
      nextBadges.push({
        badge: config,
        progress: Math.min(100, (statValue / reqCount) * 100),
        remaining: reqCount - statValue,
      });
    }
  });

  // Sort by progress (closest to completion first)
  return nextBadges.sort((a, b) => b.progress - a.progress);
}

/**
 * Generate badge metadata for NFT
 */
export function generateBadgeMetadata(
  badgeType: BadgeType,
  userWallet: string,
  statValue: number
): {
  name: string;
  description: string;
  image: string;
  attributes: Array<{ trait_type: string; value: string | number }>;
} {
  const config = BADGE_CONFIGS[badgeType];

  return {
    name: config.name,
    description: config.description,
    image: config.imageUrl,
    attributes: [
      {
        trait_type: 'Badge Type',
        value: config.category,
      },
      {
        trait_type: 'Rarity',
        value: config.rarity,
      },
      {
        trait_type: 'Earned Date',
        value: new Date().toISOString().split('T')[0],
      },
      {
        trait_type: config.requirement.type === 'redemptions' ? 'Redemptions' :
                    config.requirement.type === 'referrals' ? 'Referrals' :
                    config.requirement.type === 'reviews' ? 'Reviews' : 'Upvotes',
        value: statValue,
      },
      {
        trait_type: 'Soulbound',
        value: 'true',
      },
      {
        trait_type: 'Owner',
        value: userWallet,
      },
    ],
  };
}
