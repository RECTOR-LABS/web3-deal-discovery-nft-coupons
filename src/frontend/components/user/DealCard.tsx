'use client';

import Link from 'next/link';
import { Database } from '@/lib/database/types';
import { Calendar, Tag, TrendingUp, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

type Deal = Database['public']['Tables']['deals']['Row'];

// Extended Deal type to support external deals
export type ExtendedDeal = Deal & {
  is_external?: boolean;
  source?: string;
  external_url?: string;
  merchant?: string;
};

interface DealCardProps {
  deal: ExtendedDeal;
}

export default function DealCard({ deal }: DealCardProps) {
  const expiryDate = new Date(deal.expiry_date!);
  const now = new Date();
  const daysUntilExpiry = Math.ceil(
    (expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );
  const isExpiringSoon = daysUntilExpiry <= 3;

  // For external deals, use external_url or don't link
  const CardWrapper = deal.is_external
    ? ({ children }: { children: React.ReactNode }) => <div>{children}</div>
    : ({ children }: { children: React.ReactNode }) => (
        <Link href={`/marketplace/${deal.id}`}>{children}</Link>
      );

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

          {/* Expiring Soon Badge OR Partner Badge */}
          {deal.is_external ? (
            <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-semibold flex items-center gap-1">
              <ExternalLink className="w-3 h-3" />
              Partner Deal
            </div>
          ) : isExpiringSoon ? (
            <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-lg text-sm font-semibold animate-pulse">
              Expiring Soon!
            </div>
          ) : null}
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
