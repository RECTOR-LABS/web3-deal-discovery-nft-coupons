'use client';

import { TierLevel } from '@/lib/loyalty/types';
import { TIER_CONFIGS } from '@/lib/loyalty/tiers';
import { Lock, Crown, Star } from 'lucide-react';

interface TierBadgeProps {
  requiredTier: TierLevel;
  userTier?: TierLevel;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export default function TierBadge({
  requiredTier,
  userTier,
  size = 'md',
  showLabel = true,
}: TierBadgeProps) {
  const tierConfig = TIER_CONFIGS[requiredTier];
  const hasAccess = userTier ? hasAccessToDeal(userTier, requiredTier) : false;

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  if (requiredTier === 'Bronze') {
    // Bronze deals are accessible to everyone, no badge needed
    return null;
  }

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold ${sizeClasses[size]} ${
        hasAccess
          ? 'bg-gradient-to-r from-[#00ff4d]/20 to-[#174622]/20 text-[#0d2a13] border border-[#00ff4d]/30'
          : 'bg-gray-200 text-gray-600 border border-gray-300'
      }`}
    >
      {hasAccess ? (
        <>
          {requiredTier === 'Platinum' && <Crown className={iconSizes[size]} />}
          {requiredTier === 'Gold' && <Star className={iconSizes[size]} />}
          {requiredTier === 'Silver' && <Star className={iconSizes[size]} />}
          {showLabel && (
            <span>
              {requiredTier} {requiredTier === 'Platinum' && 'VIP'}
            </span>
          )}
        </>
      ) : (
        <>
          <Lock className={iconSizes[size]} />
          {showLabel && <span>{requiredTier}+ Only</span>}
        </>
      )}
    </div>
  );
}

// Helper function (duplicated from tiers.ts to avoid circular dependency)
function hasAccessToDeal(userTier: TierLevel, requiredTier: TierLevel): boolean {
  const TIER_ORDER: TierLevel[] = ['Bronze', 'Silver', 'Gold', 'Platinum'];
  const userTierIndex = TIER_ORDER.indexOf(userTier);
  const requiredTierIndex = TIER_ORDER.indexOf(requiredTier);
  return userTierIndex >= requiredTierIndex;
}
