'use client';

import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Share2, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ShareButtonsProps {
  dealId: string;
  dealTitle: string;
  variant?: 'default' | 'compact';
}

export default function ShareButtons({ dealId, dealTitle, variant = 'default' }: ShareButtonsProps) {
  const { publicKey } = useWallet();
  const [copied, setCopied] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  // Generate shareable URL with optional referral tracking
  const generateShareUrl = () => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const dealUrl = `${baseUrl}/marketplace/${dealId}`;

    // Add referral parameter if wallet connected
    if (publicKey) {
      return `${dealUrl}?ref=${publicKey.toBase58()}`;
    }

    return dealUrl;
  };

  const shareUrl = generateShareUrl();

  // Copy link to clipboard
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
      alert('Failed to copy link to clipboard');
    }
  };

  // Share to Twitter/X
  const handleShareTwitter = () => {
    const text = encodeURIComponent(`Check out this amazing deal: ${dealTitle}`);
    const url = encodeURIComponent(shareUrl);
    window.open(
      `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      '_blank',
      'width=550,height=420'
    );
  };

  // Share to Telegram
  const handleShareTelegram = () => {
    const text = encodeURIComponent(`Check out this amazing deal: ${dealTitle}`);
    const url = encodeURIComponent(shareUrl);
    window.open(
      `https://t.me/share/url?url=${url}&text=${text}`,
      '_blank',
      'width=550,height=420'
    );
  };

  // Share via Web Share API (mobile-friendly)
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: dealTitle,
          text: `Check out this amazing deal: ${dealTitle}`,
          url: shareUrl,
        });
      } catch (error) {
        // User cancelled or share failed
        console.log('Share cancelled or failed:', error);
      }
    } else {
      setShowShareMenu(!showShareMenu);
    }
  };

  if (variant === 'compact') {
    return (
      <div className="relative">
        <button
          onClick={handleNativeShare}
          className="flex items-center gap-2 text-[#174622] hover:text-[#00ff4d] transition-colors"
        >
          <Share2 className="w-5 h-5" />
          <span className="text-sm font-semibold">Share</span>
        </button>

        {/* Share Menu */}
        <AnimatePresence>
          {showShareMenu && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-xl border border-[#174622]/10 p-2 z-10 min-w-[200px]"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleShareTwitter();
                  setShowShareMenu(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2 hover:bg-[#f2eecb] rounded-lg transition-colors text-left"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                <span>Share on X</span>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleShareTelegram();
                  setShowShareMenu(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2 hover:bg-[#f2eecb] rounded-lg transition-colors text-left"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z" />
                </svg>
                <span>Share on Telegram</span>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopyLink();
                  setShowShareMenu(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2 hover:bg-[#f2eecb] rounded-lg transition-colors text-left"
              >
                {copied ? (
                  <Check className="w-5 h-5 text-[#00ff4d]" />
                ) : (
                  <Copy className="w-5 h-5" />
                )}
                <span>{copied ? 'Copied!' : 'Copy Link'}</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Default variant - Full share buttons
  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-[#0d2a13]">Share this deal</h4>

      <div className="flex gap-2">
        {/* Twitter/X Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleShareTwitter}
          className="flex-1 flex items-center justify-center gap-2 bg-black hover:bg-black/90 text-white px-4 py-2 rounded-lg transition-colors"
          title="Share on X (Twitter)"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          <span className="text-sm font-semibold">X</span>
        </motion.button>

        {/* Telegram Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleShareTelegram}
          className="flex-1 flex items-center justify-center gap-2 bg-[#0088cc] hover:bg-[#0088cc]/90 text-white px-4 py-2 rounded-lg transition-colors"
          title="Share on Telegram"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z" />
          </svg>
          <span className="text-sm font-semibold">Telegram</span>
        </motion.button>

        {/* Copy Link Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCopyLink}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all ${
            copied
              ? 'bg-[#00ff4d] text-[#0d2a13]'
              : 'bg-[#f2eecb] text-[#174622] hover:bg-[#00ff4d]/20'
          }`}
          title="Copy link to clipboard"
        >
          {copied ? (
            <>
              <Check className="w-5 h-5" />
              <span className="text-sm font-semibold">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-5 h-5" />
              <span className="text-sm font-semibold">Copy</span>
            </>
          )}
        </motion.button>
      </div>

      {/* Referral Info */}
      {publicKey && (
        <p className="text-xs text-[#174622] text-center">
          Your referral link is included. Earn rewards when friends claim this deal!
        </p>
      )}
    </div>
  );
}
