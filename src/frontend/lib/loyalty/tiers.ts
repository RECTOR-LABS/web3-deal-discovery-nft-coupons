// Tier Configuration and Calculation Logic

import { TierConfig, TierLevel, UserTierInfo } from './types';

export const TIER_CONFIGS: Record<TierLevel, TierConfig> = {
  Bronze: {
    level: 'Bronze',
    minRedemptions: 0,
    bonusDiscount: 0,
    benefits: ['Standard access to all deals', 'Community support'],
    color: '#CD7F32',
    icon: '🥉',
  },
  Silver: {
    level: 'Silver',
    minRedemptions: 6,
    bonusDiscount: 5,
    benefits: [
      '+5% bonus discount on all deals',
      'Priority customer support',
      'Silver badge display',
    ],
    color: '#C0C0C0',
    icon: '🥈',
  },
  Gold: {
    level: 'Gold',
    minRedemptions: 21,
    bonusDiscount: 10,
    benefits: [
      '+10% bonus discount on all deals',
      'Access to exclusive Gold+ deals',
      'Early access to new deals',
      'Gold badge display',
    ],
    color: '#FFD700',
    icon: '🥇',
  },
  Platinum: {
    level: 'Platinum',
    minRedemptions: 51,
    bonusDiscount: 15,
    benefits: [
      '+15% bonus discount on all deals',
      'Access to VIP Platinum-only deals',
      'Maximum discount rates',
      'Special limited offers',
      'Platinum badge display',
    ],
    color: '#E5E4E2',
    icon: '👑',
  },
};

export const TIER_ORDER: TierLevel[] = ['Bronze', 'Silver', 'Gold', 'Platinum'];

/**
 * Calculate user's tier based on total redemptions
 */
export function calculateTier(totalRedemptions: number): TierLevel {
  if (totalRedemptions >= TIER_CONFIGS.Platinum.minRedemptions) return 'Platinum';
  if (totalRedemptions >= TIER_CONFIGS.Gold.minRedemptions) return 'Gold';
  if (totalRedemptions >= TIER_CONFIGS.Silver.minRedemptions) return 'Silver';
  return 'Bronze';
}

/**
 * Get next tier level
 */
export function getNextTier(currentTier: TierLevel): TierLevel | null {
  const currentIndex = TIER_ORDER.indexOf(currentTier);
  if (currentIndex === TIER_ORDER.length - 1) return null; // Already at max tier
  return TIER_ORDER[currentIndex + 1];
}

/**
 * Calculate redemptions needed to reach next tier
 */
export function getRedemptionsToNextTier(
  currentTier: TierLevel,
  totalRedemptions: number
): number {
  const nextTier = getNextTier(currentTier);
  if (!nextTier) return 0; // Already at max tier

  const nextTierConfig = TIER_CONFIGS[nextTier];
  return Math.max(0, nextTierConfig.minRedemptions - totalRedemptions);
}

/**
 * Get user's tier info with progress
 */
export function getUserTierInfo(totalRedemptions: number): UserTierInfo {
  const currentTier = calculateTier(totalRedemptions);
  const nextTier = getNextTier(currentTier);
  const redemptionsToNextTier = getRedemptionsToNextTier(currentTier, totalRedemptions);
  const tierConfig = TIER_CONFIGS[currentTier];

  return {
    currentTier,
    totalRedemptions,
    nextTier,
    redemptionsToNextTier,
    bonusDiscount: tierConfig.bonusDiscount,
    benefits: tierConfig.benefits,
  };
}

/**
 * Check if user has access to a deal based on tier requirement
 */
export function hasAccessToDeal(userTier: TierLevel, requiredTier: TierLevel): boolean {
  const userTierIndex = TIER_ORDER.indexOf(userTier);
  const requiredTierIndex = TIER_ORDER.indexOf(requiredTier);
  return userTierIndex >= requiredTierIndex;
}

/**
 * Get tier progress percentage
 */
export function getTierProgressPercentage(
  currentTier: TierLevel,
  totalRedemptions: number
): number {
  const nextTier = getNextTier(currentTier);
  if (!nextTier) return 100; // Max tier reached

  const currentTierConfig = TIER_CONFIGS[currentTier];
  const nextTierConfig = TIER_CONFIGS[nextTier];

  const redemptionsInCurrentTier = totalRedemptions - currentTierConfig.minRedemptions;
  const redemptionsNeededForNextTier =
    nextTierConfig.minRedemptions - currentTierConfig.minRedemptions;

  return Math.min(100, (redemptionsInCurrentTier / redemptionsNeededForNextTier) * 100);
}
