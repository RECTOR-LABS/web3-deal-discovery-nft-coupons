'use client';

import Link from 'next/link';
import { Database } from '@/lib/database/types';
import { Calendar, Tag, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

type Deal = Database['public']['Tables']['deals']['Row'];

interface DealCardProps {
  deal: Deal;
}

export default function DealCard({ deal }: DealCardProps) {
  const expiryDate = new Date(deal.expiry_date!);
  const now = new Date();
  const daysUntilExpiry = Math.ceil(
    (expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );
  const isExpiringSoon = daysUntilExpiry <= 3;

  return (
    <Link href={`/marketplace/${deal.id}`}>
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

          {/* Expiring Soon Badge */}
          {isExpiringSoon && (
            <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-lg text-sm font-semibold animate-pulse">
              Expiring Soon!
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
          <button className="mt-4 w-full bg-[#0d2a13] hover:bg-[#174622] text-[#f2eecb] font-semibold py-3 rounded-lg transition-colors">
            View Deal
          </button>
        </div>
      </motion.div>
    </Link>
  );
}
