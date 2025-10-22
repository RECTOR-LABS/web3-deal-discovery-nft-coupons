'use client';

import { useState } from 'react';
import { UserCoupon } from '@/lib/solana/getUserCoupons';
import { Calendar, Tag, TrendingUp, QrCode, Share2, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';
import QRCodeGenerator from './QRCodeGenerator';
import ListForResaleModal from './ListForResaleModal';

interface CouponCardProps {
  coupon: UserCoupon;
}

export default function CouponCard({ coupon }: CouponCardProps) {
  const [showQR, setShowQR] = useState(false);
  const [showListForResale, setShowListForResale] = useState(false);

  const now = new Date();
  const daysUntilExpiry = Math.ceil(
    (coupon.expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );
  const isExpiringSoon = daysUntilExpiry <= 3 && !coupon.isExpired;

  const getStatusBadge = () => {
    if (coupon.isRedeemed) {
      return <div className="absolute top-4 left-4 bg-orange-500 text-white px-3 py-1 rounded-lg text-sm font-semibold">Redeemed</div>;
    }
    if (coupon.isExpired) {
      return <div className="absolute top-4 left-4 bg-gray-500 text-white px-3 py-1 rounded-lg text-sm font-semibold">Expired</div>;
    }
    if (isExpiringSoon) {
      return <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-lg text-sm font-semibold animate-pulse">Expiring Soon!</div>;
    }
    return <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-lg text-sm font-semibold">Active</div>;
  };

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.02, y: -4 }}
        transition={{ duration: 0.2 }}
        className="bg-[#f2eecb] rounded-lg overflow-hidden shadow-lg h-full flex flex-col"
      >
        {/* Image */}
        <div className="relative h-48 bg-gradient-to-br from-[#0d2a13] to-[#174622]">
          {coupon.imageUrl ? (
            <img
              src={coupon.imageUrl}
              alt={coupon.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Tag className="w-16 h-16 text-[#f2eecb]/50" />
            </div>
          )}

          {/* Status Badge */}
          {getStatusBadge()}

          {/* Discount Badge */}
          <div className="absolute top-4 right-4 bg-[#00ff4d] text-[#0d2a13] px-4 py-2 rounded-lg font-bold text-xl shadow-lg">
            {coupon.discount}% OFF
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex-1 flex flex-col">
          <h3 className="text-xl font-bold text-[#0d2a13] mb-2 line-clamp-2">
            {coupon.title}
          </h3>

          <p className="text-[#174622] text-sm mb-4 line-clamp-2 flex-1">
            {coupon.description || 'No description available'}
          </p>

          {/* Metadata */}
          <div className="space-y-2 mb-4">
            {/* Merchant */}
            <div className="flex items-center text-[#174622] text-sm">
              <Tag className="w-4 h-4 mr-2" />
              <span>{coupon.merchant}</span>
            </div>

            {/* Category */}
            <div className="flex items-center text-[#174622] text-sm">
              <Tag className="w-4 h-4 mr-2" />
              <span>{coupon.category}</span>
            </div>

            {/* Expiry */}
            <div className="flex items-center text-[#174622] text-sm">
              <Calendar className="w-4 h-4 mr-2" />
              <span>
                Expires: {coupon.expiry.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </div>

            {/* Days Remaining */}
            {!coupon.isExpired && !coupon.isRedeemed && (
              <div className="flex items-center text-[#174622] text-sm">
                <TrendingUp className="w-4 h-4 mr-2" />
                <span className={isExpiringSoon ? 'text-red-600 font-semibold' : ''}>
                  {daysUntilExpiry} {daysUntilExpiry === 1 ? 'day' : 'days'} remaining
                </span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            {!coupon.isRedeemed && !coupon.isExpired ? (
              <>
                <button
                  onClick={() => setShowQR(true)}
                  className="w-full bg-[#00ff4d] hover:bg-[#00ff4d]/90 text-[#0d2a13] font-bold py-3 rounded-lg transition-colors flex items-center justify-center"
                >
                  <QrCode className="w-5 h-5 mr-2" />
                  Show QR to Redeem
                </button>
                <button
                  onClick={() => setShowListForResale(true)}
                  className="w-full bg-[#174622] hover:bg-[#174622]/90 text-[#f2eecb] font-semibold py-2 rounded-lg transition-colors flex items-center justify-center"
                >
                  <DollarSign className="w-4 h-4 mr-2" />
                  List for Resale
                </button>
                <button className="w-full bg-[#0d2a13] hover:bg-[#0d2a13]/90 text-[#f2eecb] font-semibold py-2 rounded-lg transition-colors flex items-center justify-center">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </button>
              </>
            ) : (
              <button
                disabled
                className="w-full bg-gray-400 text-white font-semibold py-3 rounded-lg cursor-not-allowed"
              >
                {coupon.isRedeemed ? 'Redeemed' : 'Expired'}
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* QR Code Modal */}
      {showQR && (
        <QRCodeGenerator
          coupon={coupon}
          onClose={() => setShowQR(false)}
        />
      )}

      {/* List for Resale Modal */}
      {showListForResale && (
        <ListForResaleModal
          coupon={coupon}
          onClose={() => setShowListForResale(false)}
        />
      )}
    </>
  );
}
