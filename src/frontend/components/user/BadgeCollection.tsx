'use client';

import { Badge } from '@/lib/loyalty/types';
import { BADGE_CONFIGS, getBadgeRarityColor } from '@/lib/loyalty/badges';
import { Award, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

interface BadgeCollectionProps {
  earnedBadges: Badge[];
  nextBadges?: Array<{
    badge: { type: string; name: string; description: string; rarity: string };
    progress: number;
    remaining: number;
  }>;
}

export default function BadgeCollection({ earnedBadges, nextBadges = [] }: BadgeCollectionProps) {
  const allBadgeTypes = Object.keys(BADGE_CONFIGS);
  const earnedBadgeTypes = new Set(earnedBadges.map((b) => b.badgeType));

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-[#0d2a13]">Badge Collection</h3>
          <p className="text-sm text-[#174622]">
            {earnedBadges.length} / {allBadgeTypes.length} badges earned
          </p>
        </div>
        <div className="flex items-center gap-2 text-[#00ff4d]">
          <Award className="w-6 h-6" />
          <span className="text-2xl font-bold">{earnedBadges.length}</span>
        </div>
      </div>

      {/* Earned Badges */}
      {earnedBadges.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-bold text-[#0d2a13] mb-3">Earned Badges:</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {earnedBadges.map((badge, index) => {
              const config = BADGE_CONFIGS[badge.badgeType];
              const rarityColor = getBadgeRarityColor(config?.rarity || 'Common');

              return (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative bg-[#f2eecb] rounded-xl p-4 text-center hover:shadow-lg transition-all cursor-pointer group"
                  title={config?.description}
                >
                  {/* Rarity Border */}
                  <div
                    className="absolute inset-0 rounded-xl opacity-20 group-hover:opacity-40 transition-opacity"
                    style={{
                      border: `2px solid ${rarityColor}`,
                    }}
                  />

                  {/* Badge Icon Placeholder */}
                  <div
                    className="w-16 h-16 mx-auto mb-2 rounded-full flex items-center justify-center text-3xl"
                    style={{
                      backgroundColor: `${rarityColor}20`,
                      color: rarityColor,
                    }}
                  >
                    🏆
                  </div>

                  {/* Badge Name */}
                  <h5 className="font-bold text-sm text-[#0d2a13] mb-1">
                    {config?.name || 'Unknown'}
                  </h5>

                  {/* Rarity */}
                  <p
                    className="text-xs font-semibold"
                    style={{ color: rarityColor }}
                  >
                    {config?.rarity}
                  </p>

                  {/* Earned Date */}
                  <p className="text-xs text-[#174622]/60 mt-1">
                    {new Date(badge.earnedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Next Badges to Unlock */}
      {nextBadges.length > 0 && (
        <div>
          <h4 className="text-sm font-bold text-[#0d2a13] mb-3">Next to Unlock:</h4>
          <div className="space-y-3">
            {nextBadges.slice(0, 3).map((item, index) => {
              const config = BADGE_CONFIGS[item.badge.type as keyof typeof BADGE_CONFIGS];
              const rarityColor = getBadgeRarityColor(config?.rarity || 'Common');

              return (
                <motion.div
                  key={item.badge.type}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-4 bg-[#f2eecb] rounded-lg p-3"
                >
                  {/* Locked Badge Icon */}
                  <div
                    className="w-12 h-12 flex-shrink-0 rounded-full flex items-center justify-center"
                    style={{
                      backgroundColor: `${rarityColor}20`,
                      color: rarityColor,
                    }}
                  >
                    <Lock className="w-6 h-6" />
                  </div>

                  {/* Badge Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h5 className="font-bold text-sm text-[#0d2a13]">
                        {config?.name || item.badge.name}
                      </h5>
                      <span
                        className="text-xs font-semibold"
                        style={{ color: rarityColor }}
                      >
                        {config?.rarity}
                      </span>
                    </div>
                    <p className="text-xs text-[#174622] mb-2">
                      {config?.description || item.badge.description}
                    </p>

                    {/* Progress Bar */}
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-white rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full transition-all duration-500"
                          style={{
                            width: `${item.progress}%`,
                            backgroundColor: rarityColor,
                          }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-[#174622] whitespace-nowrap">
                        {item.remaining} more
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty State */}
      {earnedBadges.length === 0 && nextBadges.length === 0 && (
        <div className="text-center py-12">
          <Award className="w-16 h-16 mx-auto mb-4 text-[#174622]/30" />
          <p className="text-[#174622] font-semibold mb-2">No badges yet</p>
          <p className="text-sm text-[#174622]/60">
            Complete activities to earn your first badge!
          </p>
        </div>
      )}
    </div>
  );
}
