'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { motion } from 'framer-motion';

interface VoteStats {
  upvotes: number;
  downvotes: number;
  score: number;
  total: number;
}

interface VoteButtonsProps {
  dealId: string;
  size?: 'sm' | 'md' | 'lg';
  showScore?: boolean;
}

export default function VoteButtons({ dealId, size = 'md', showScore = true }: VoteButtonsProps) {
  const { publicKey } = useWallet();
  const [stats, setStats] = useState<VoteStats>({ upvotes: 0, downvotes: 0, score: 0, total: 0 });
  const [userVote, setUserVote] = useState<'upvote' | 'downvote' | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Size configurations
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  // Fetch vote stats
  useEffect(() => {
    fetchVoteStats();
  }, [dealId, publicKey]);

  async function fetchVoteStats() {
    try {
      setLoading(true);
      const url = `/api/votes?deal_id=${dealId}${publicKey ? `&user_wallet=${publicKey.toBase58()}` : ''}`;
      const response = await fetch(url);

      if (response.ok) {
        const data = await response.json();
        setStats(data.stats || { upvotes: 0, downvotes: 0, score: 0, total: 0 });
        setUserVote(data.userVote || null);
      }
    } catch (error) {
      console.error('Error fetching vote stats:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleVote(voteType: 'upvote' | 'downvote') {
    if (!publicKey) {
      alert('Please connect your wallet to vote');
      return;
    }

    if (submitting) return;

    try {
      setSubmitting(true);

      // Optimistic update
      const prevStats = { ...stats };
      const prevUserVote = userVote;

      // Calculate optimistic stats
      let newStats = { ...stats };
      let newUserVote: 'upvote' | 'downvote' | null = voteType;

      if (userVote === voteType) {
        // Removing vote
        if (voteType === 'upvote') {
          newStats.upvotes -= 1;
        } else {
          newStats.downvotes -= 1;
        }
        newStats.total -= 1;
        newStats.score = newStats.upvotes - newStats.downvotes;
        newUserVote = null;
      } else if (userVote) {
        // Changing vote
        if (voteType === 'upvote') {
          newStats.upvotes += 1;
          newStats.downvotes -= 1;
        } else {
          newStats.downvotes += 1;
          newStats.upvotes -= 1;
        }
        newStats.score = newStats.upvotes - newStats.downvotes;
        newUserVote = voteType;
      } else {
        // New vote
        if (voteType === 'upvote') {
          newStats.upvotes += 1;
        } else {
          newStats.downvotes += 1;
        }
        newStats.total += 1;
        newStats.score = newStats.upvotes - newStats.downvotes;
        newUserVote = voteType;
      }

      setStats(newStats);
      setUserVote(newUserVote);

      // Submit vote
      const response = await fetch('/api/votes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deal_id: dealId,
          user_wallet: publicKey.toBase58(),
          vote_type: voteType,
        }),
      });

      if (!response.ok) {
        // Revert optimistic update on error
        setStats(prevStats);
        setUserVote(prevUserVote);
        const error = await response.json();
        console.error('Vote error:', error);
        alert(error.error || 'Failed to submit vote');
      } else {
        // Refresh to get accurate stats from server
        await fetchVoteStats();
      }
    } catch (error) {
      console.error('Error submitting vote:', error);
      // Refresh stats on error
      await fetchVoteStats();
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <div className={`${sizeClasses[size]} rounded-lg bg-gray-200 animate-pulse`} />
        <div className={`${sizeClasses[size]} rounded-lg bg-gray-200 animate-pulse`} />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {/* Upvote Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => handleVote('upvote')}
        disabled={submitting || !publicKey}
        className={`
          ${sizeClasses[size]}
          rounded-lg
          flex items-center justify-center
          transition-all
          ${userVote === 'upvote'
            ? 'bg-[#00ff4d] text-[#0d2a13]'
            : 'bg-[#f2eecb] text-[#174622] hover:bg-[#00ff4d]/20'
          }
          ${!publicKey ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          disabled:opacity-50
        `}
        title={!publicKey ? 'Connect wallet to vote' : 'Upvote'}
      >
        <ThumbsUp className={iconSizes[size]} />
      </motion.button>

      {/* Score Display */}
      {showScore && (
        <span className={`
          font-bold text-[#0d2a13]
          ${size === 'sm' ? 'text-sm' : size === 'md' ? 'text-base' : 'text-lg'}
          min-w-[2rem] text-center
        `}>
          {stats.score >= 0 ? '+' : ''}{stats.score}
        </span>
      )}

      {/* Downvote Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => handleVote('downvote')}
        disabled={submitting || !publicKey}
        className={`
          ${sizeClasses[size]}
          rounded-lg
          flex items-center justify-center
          transition-all
          ${userVote === 'downvote'
            ? 'bg-red-500 text-white'
            : 'bg-[#f2eecb] text-[#174622] hover:bg-red-500/20'
          }
          ${!publicKey ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          disabled:opacity-50
        `}
        title={!publicKey ? 'Connect wallet to vote' : 'Downvote'}
      >
        <ThumbsDown className={iconSizes[size]} />
      </motion.button>
    </div>
  );
}
