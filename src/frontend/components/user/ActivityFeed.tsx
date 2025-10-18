/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Activity, TrendingUp, Star, ShoppingBag, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface ActivityItem {
  id: string;
  type: 'claim' | 'review' | 'trending';
  timestamp: string;
  dealId: string;
  dealTitle: string;
  dealImage?: string;
  userWallet?: string;
  metadata?: any;
}

interface ActivityFeedProps {
  limit?: number;
  compact?: boolean;
}

export default function ActivityFeed({ limit = 10, compact = false }: ActivityFeedProps) {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
  }, [limit]);

  async function fetchActivities() {
    try {
      setLoading(true);
      const response = await fetch(`/api/activity-feed?limit=${limit}`);
      if (response.ok) {
        const data = await response.json();
        setActivities(data.activities || []);
      }
    } catch (error) {
      console.error('Error fetching activity feed:', error);
    } finally {
      setLoading(false);
    }
  }

  const formatWallet = (wallet: string) => {
    return `${wallet.slice(0, 4)}...${wallet.slice(-4)}`;
  };

  const formatTime = (timestamp: string) => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffMs = now.getTime() - activityTime.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return activityTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'claim':
        return <ShoppingBag className="w-5 h-5 text-[#00ff4d]" />;
      case 'review':
        return <Star className="w-5 h-5 text-yellow-500" />;
      case 'trending':
        return <TrendingUp className="w-5 h-5 text-blue-500" />;
      default:
        return <Activity className="w-5 h-5 text-[#174622]" />;
    }
  };

  const getActivityText = (activity: ActivityItem) => {
    switch (activity.type) {
      case 'claim':
        return (
          <span>
            <span className="font-mono text-sm">{formatWallet(activity.userWallet || '')}</span>
            {' '}claimed{' '}
            <Link
              href={`/marketplace/${activity.dealId}`}
              className="font-semibold text-[#00ff4d] hover:underline"
            >
              {activity.dealTitle}
            </Link>
          </span>
        );
      case 'review':
        return (
          <span>
            <span className="font-mono text-sm">{formatWallet(activity.userWallet || '')}</span>
            {' '}rated{' '}
            <Link
              href={`/marketplace/${activity.dealId}`}
              className="font-semibold text-[#00ff4d] hover:underline"
            >
              {activity.dealTitle}
            </Link>
            {' '}
            <span className="text-yellow-500 font-semibold">
              {activity.metadata?.rating}/5 ★
            </span>
          </span>
        );
      case 'trending':
        return (
          <span>
            <Link
              href={`/marketplace/${activity.dealId}`}
              className="font-semibold text-[#00ff4d] hover:underline"
            >
              {activity.dealTitle}
            </Link>
            {' '}is trending 🔥{' '}
            <span className="text-blue-500 font-semibold">
              +{activity.metadata?.score} votes
            </span>
          </span>
        );
      default:
        return <span>Unknown activity</span>;
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-6 h-6 text-[#0d2a13]" />
          <h3 className="text-xl font-bold text-[#0d2a13]">Live Activity</h3>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3 animate-pulse">
              <div className="w-10 h-10 bg-gray-200 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-6 h-6 text-[#0d2a13]" />
          <h3 className="text-xl font-bold text-[#0d2a13]">Live Activity</h3>
        </div>
        <div className="text-center py-8 text-[#174622]">
          <Activity className="w-12 h-12 mx-auto mb-2 opacity-30" />
          <p className="font-semibold">No recent activity</p>
          <p className="text-sm">Be the first to claim a deal!</p>
        </div>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="space-y-2">
        {activities.slice(0, 5).map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center gap-3 text-sm text-[#174622]"
          >
            {getActivityIcon(activity.type)}
            <div className="flex-1">
              {getActivityText(activity)}
            </div>
            <span className="text-xs text-[#174622]/60 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatTime(activity.timestamp)}
            </span>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Activity className="w-6 h-6 text-[#0d2a13]" />
          <h3 className="text-xl font-bold text-[#0d2a13]">Live Activity</h3>
        </div>
        <button
          onClick={fetchActivities}
          className="text-sm text-[#00ff4d] hover:underline font-semibold"
        >
          Refresh
        </button>
      </div>

      <div className="space-y-4">
        {activities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-start gap-3 pb-4 border-b border-[#174622]/10 last:border-0 last:pb-0"
          >
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#f2eecb] flex items-center justify-center">
              {getActivityIcon(activity.type)}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm text-[#0d2a13] leading-relaxed">
                {getActivityText(activity)}
              </p>
              <p className="text-xs text-[#174622]/60 mt-1 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatTime(activity.timestamp)}
              </p>
            </div>

            {activity.dealImage && (
              <Link
                href={`/marketplace/${activity.dealId}`}
                className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden hover:ring-2 hover:ring-[#00ff4d] transition-all"
              >
                <img
                  src={activity.dealImage}
                  alt={activity.dealTitle}
                  className="w-full h-full object-cover"
                />
              </Link>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
