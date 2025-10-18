'use client';

import { UserTierInfo } from '@/lib/loyalty/types';
import { TIER_CONFIGS, getTierProgressPercentage } from '@/lib/loyalty/tiers';
import { Trophy, Star, Crown, Award } from 'lucide-react';
import { motion } from 'framer-motion';

interface TierProgressProps {
  tierInfo: UserTierInfo;
}

export default function TierProgress({ tierInfo }: TierProgressProps) {
  const currentTierConfig = TIER_CONFIGS[tierInfo.currentTier];
  const progress = getTierProgressPercentage(tierInfo.currentTier, tierInfo.totalRedemptions);

  const getTierIcon = (tier: UserTierInfo['currentTier']) => {
    switch (tier) {
      case 'Bronze':
        return <Award className="w-8 h-8" style={{ color: TIER_CONFIGS.Bronze.color }} />;
      case 'Silver':
        return <Star className="w-8 h-8" style={{ color: TIER_CONFIGS.Silver.color }} />;
      case 'Gold':
        return <Trophy className="w-8 h-8" style={{ color: TIER_CONFIGS.Gold.color }} />;
      case 'Platinum':
        return <Crown className="w-8 h-8" style={{ color: TIER_CONFIGS.Platinum.color }} />;
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      {/* Current Tier Display */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {getTierIcon(tierInfo.currentTier)}
          <div>
            <h3 className="text-2xl font-bold text-[#0d2a13]">
              {tierInfo.currentTier} Tier
            </h3>
            <p className="text-sm text-[#174622]">
              {tierInfo.totalRedemptions} redemptions completed
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-black text-[#00ff4d]">
            +{tierInfo.bonusDiscount}%
          </div>
          <p className="text-xs text-[#174622]">Bonus Discount</p>
        </div>
      </div>

      {/* Progress Bar */}
      {tierInfo.nextTier && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-[#174622]">
              Progress to {tierInfo.nextTier}
            </span>
            <span className="text-sm font-bold text-[#0d2a13]">
              {tierInfo.redemptionsToNextTier} more
            </span>
          </div>
          <div className="w-full bg-[#f2eecb] rounded-full h-3 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-[#00ff4d] to-[#174622] rounded-full"
            />
          </div>
          <p className="text-xs text-[#174622] mt-1">
            {Math.round(progress)}% complete
          </p>
        </div>
      )}

      {/* Max Tier Reached */}
      {!tierInfo.nextTier && (
        <div className="mb-6 bg-gradient-to-r from-[#00ff4d]/20 to-[#174622]/20 rounded-lg p-4 text-center">
          <Crown className="w-12 h-12 mx-auto mb-2 text-[#FFD700]" />
          <p className="font-bold text-[#0d2a13]">Maximum Tier Reached!</p>
          <p className="text-sm text-[#174622]">You&apos;ve unlocked all tier benefits</p>
        </div>
      )}

      {/* Tier Benefits */}
      <div>
        <h4 className="text-sm font-bold text-[#0d2a13] mb-3">Your Benefits:</h4>
        <ul className="space-y-2">
          {tierInfo.benefits.map((benefit, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-2 text-sm text-[#174622]"
            >
              <span className="text-[#00ff4d] mt-0.5">✓</span>
              <span>{benefit}</span>
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  );
}
