'use client';

import Link from 'next/link';
import { Database } from '@/lib/database/types';
import { Calendar, Tag, TrendingUp, ExternalLink, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import VoteButtons from './VoteButtons';
import TierBadge from './TierBadge';
import { TierLevel } from '@/lib/loyalty/types';
import { hasAccessToDeal } from '@/lib/loyalty/tiers';

type Deal = Database['public']['Tables']['deals']['Row'];

// Extended Deal type to support external deals
export type ExtendedDeal = Deal & {
  is_external?: boolean;
  source?: string;
  external_url?: string;
  merchant?: string;
  min_tier?: TierLevel | null;
  is_exclusive?: boolean | null;
};

interface DealCardProps {
  deal: ExtendedDeal;
  userTier?: TierLevel;
}

export default function DealCard({ deal, userTier = 'Bronze' }: DealCardProps) {
  const expiryDate = new Date(deal.expiry_date!);
  const now = new Date();
  const daysUntilExpiry = Math.ceil(
    (expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );
  const isExpiringSoon = daysUntilExpiry <= 3;

  // Check if user has access to this deal based on tier
  const requiredTier = (deal.min_tier || 'Bronze') as TierLevel;
  const hasAccess = hasAccessToDeal(userTier, requiredTier);

  // For external deals or locked deals, handle differently
  const shouldLink = !deal.is_external && hasAccess;
  const CardWrapper = shouldLink
    ? ({ children }: { children: React.ReactNode }) => (
        <Link href={`/marketplace/${deal.id}`}>{children}</Link>
      )
    : ({ children }: { children: React.ReactNode }) => <div>{children}</div>;

  return (
    <CardWrapper>
      <motion.div
        whileHover={{ scale: 1.02, y: -4 }}
        transition={{ duration: 0.2 }}
        className="bg-[#f2eecb] rounded-lg overflow-hidden shadow-lg hover:shadow-2xl cursor-pointer h-full flex flex-col"
      >
        {/* Image */}
        <div className="relative h-48 bg-gradient-to-br from-[#0d2a13] to-[#174622]">
          {deal.image_url ? (
            <img
              src={deal.image_url}
              alt={deal.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Tag className="w-16 h-16 text-[#f2eecb]/50" />
            </div>
          )}

          {/* Discount Badge */}
          <div className="absolute top-4 right-4 bg-[#00ff4d] text-[#0d2a13] px-4 py-2 rounded-lg font-bold text-xl shadow-lg">
            {deal.discount_percentage}% OFF
          </div>

          {/* Top Left Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {/* Partner Badge OR Expiring Soon */}
            {deal.is_external ? (
              <div className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-semibold flex items-center gap-1">
                <ExternalLink className="w-3 h-3" />
                Partner Deal
              </div>
            ) : isExpiringSoon ? (
              <div className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm font-semibold animate-pulse">
                Expiring Soon!
              </div>
            ) : null}

            {/* Tier Badge (if exclusive) */}
            {deal.is_exclusive && requiredTier !== 'Bronze' && (
              <TierBadge requiredTier={requiredTier} userTier={userTier} size="sm" />
            )}
          </div>

          {/* Locked Overlay (if user doesn't have access) */}
          {!hasAccess && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center">
              <Lock className="w-16 h-16 text-white mb-2" />
              <p className="text-white font-bold text-lg">Unlock at {requiredTier}</p>
              <p className="text-white/80 text-sm">Upgrade your tier to access</p>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 flex-1 flex flex-col">
          <h3 className="text-xl font-bold text-[#0d2a13] mb-2 line-clamp-2">
            {deal.title}
          </h3>

          <p className="text-[#174622] text-sm mb-4 line-clamp-2 flex-1">
            {deal.description || 'No description available'}
          </p>

          {/* Metadata */}
          <div className="space-y-2">
            {/* Merchant (for external deals) */}
            {deal.is_external && deal.merchant && (
              <div className="flex items-center text-[#174622] text-sm font-semibold">
                <Tag className="w-4 h-4 mr-2" />
                <span>{deal.merchant}</span>
              </div>
            )}

            {/* Category */}
            <div className="flex items-center text-[#174622] text-sm">
              <Tag className="w-4 h-4 mr-2" />
              <span>{deal.category}</span>
            </div>

            {/* Expiry */}
            <div className="flex items-center text-[#174622] text-sm">
              <Calendar className="w-4 h-4 mr-2" />
              <span>
                Expires: {expiryDate.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </div>

            {/* Days Remaining */}
            <div className="flex items-center text-[#174622] text-sm">
              <TrendingUp className="w-4 h-4 mr-2" />
              <span className={isExpiringSoon ? 'text-red-600 font-semibold' : ''}>
                {daysUntilExpiry} {daysUntilExpiry === 1 ? 'day' : 'days'} remaining
              </span>
            </div>
          </div>

          {/* Vote Buttons - Only for platform deals */}
          {!deal.is_external && (
            <div className="mt-4 pt-3 border-t border-[#174622]/10 flex justify-center" onClick={(e) => e.stopPropagation()}>
              <VoteButtons dealId={deal.id} size="sm" showScore={true} />
            </div>
          )}

          {/* Action Button */}
          {deal.is_external && deal.external_url ? (
            <a
              href={deal.external_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="w-4 h-4" />
              View on Partner Site
            </a>
          ) : deal.is_external ? (
            <button className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors">
              View Partner Deal
            </button>
          ) : (
            <button className="mt-4 w-full bg-[#0d2a13] hover:bg-[#174622] text-[#f2eecb] font-semibold py-3 rounded-lg transition-colors">
              View Deal
            </button>
          )}
        </div>
      </motion.div>
    </CardWrapper>
  );
}
