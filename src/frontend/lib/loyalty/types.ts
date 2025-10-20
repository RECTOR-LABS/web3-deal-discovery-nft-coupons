// Loyalty System Types

export type TierLevel = 'Bronze' | 'Silver' | 'Gold' | 'Platinum';

export type BadgeType =
  | 'first_steps'
  | 'deal_hunter'
  | 'savvy_shopper'
  | 'discount_master'
  | 'social_butterfly'
  | 'influencer'
  | 'critic'
  | 'community_champion';

export type BadgeRarity = 'Common' | 'Uncommon' | 'Rare' | 'Epic';

export interface TierConfig {
  level: TierLevel;
  minRedemptions: number;
  bonusDiscount: number; // Percentage (0, 5, 10, 15)
  benefits: string[];
  color: string; // Display color
  icon: string; // Icon name or emoji
}

export interface BadgeConfig {
  type: BadgeType;
  name: string;
  description: string;
  rarity: BadgeRarity;
  imageUrl: string;
  category: 'Milestone' | 'Social' | 'Quality';
  requirement: {
    type: 'redemptions' | 'referrals' | 'reviews' | 'upvotes';
    count: number;
  };
}

export interface UserTierInfo {
  currentTier: TierLevel;
  totalRedemptions: number;
  nextTier: TierLevel | null;
  redemptionsToNextTier: number;
  bonusDiscount: number;
  benefits: string[];
}

export interface Badge {
  id: string;
  userWallet: string;
  badgeType: BadgeType;
  nftMintAddress: string;
  earnedAt: string;
  metadata: {
    name: string;
    description: string;
    image: string;
    rarity: BadgeRarity;
  };
}

export interface UserProfile {
  wallet: string;
  tierInfo: UserTierInfo;
  badges: Badge[];
  stats: {
    totalRedemptions: number;
    totalReferrals: number;
    totalReviews: number;
    totalUpvotes: number;
  };
}
