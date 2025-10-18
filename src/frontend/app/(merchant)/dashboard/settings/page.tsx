'use client';

import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { motion } from 'framer-motion';
import { Store, Loader2, Save, AlertCircle, CheckCircle2, User, Image as ImageIcon, Wallet, Sparkles } from 'lucide-react';

interface MerchantProfile {
  business_name: string;
  description: string;
  logo_url: string;
  wallet_address: string;
}

export default function SettingsPage() {
  const { publicKey } = useWallet();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [profile, setProfile] = useState<MerchantProfile>({
    business_name: '',
    description: '',
    logo_url: '',
    wallet_address: '',
  });
  // Track original profile for dirty form detection
  const [originalProfile, setOriginalProfile] = useState<MerchantProfile>({
    business_name: '',
    description: '',
    logo_url: '',
    wallet_address: '',
  });

  // Check if form has unsaved changes
  const hasChanges = () => {
    return (
      profile.business_name !== originalProfile.business_name ||
      profile.description !== originalProfile.description ||
      profile.logo_url !== originalProfile.logo_url
    );
  };

  useEffect(() => {
    const fetchProfile = async () => {
      if (!publicKey) return;

      try {
        const response = await fetch(
          `/api/merchant/profile?wallet=${publicKey.toBase58()}`
        );

        if (response.ok) {
          const data = await response.json();
          if (data.merchant) {
            const profileData = {
              business_name: data.merchant.business_name || '',
              description: data.merchant.description || '',
              logo_url: data.merchant.logo_url || '',
              wallet_address: data.merchant.wallet_address,
            };
            setProfile(profileData);
            setOriginalProfile(profileData); // Store original for comparison
          }
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [publicKey]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!publicKey) return;

    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch('/api/merchant/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress: publicKey.toBase58(),
          businessName: profile.business_name,
          description: profile.description,
          logoUrl: profile.logo_url,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update profile');
      }

      setSuccess(true);
      // Update original profile after successful save
      setOriginalProfile(profile);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Update error:', err);
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="animate-spin text-monke-primary" size={40} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="relative overflow-hidden bg-gradient-to-br from-white via-monke-cream/30 to-white border-2 border-monke-border rounded-lg p-8"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-monke-neon/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-monke-primary/5 rounded-full blur-3xl" />

        <div className="relative">
          <div className="flex items-center gap-3 mb-3">
            <Sparkles className="text-monke-neon" size={28} />
            <h1 className="text-4xl font-black text-monke-primary">Account Settings</h1>
          </div>
          <p className="text-lg text-monke-primary/70 font-medium">
            Manage your merchant profile and business information
          </p>
        </div>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Logo Preview Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="bg-white border-2 border-monke-border rounded-lg p-8 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center space-x-2 mb-6">
            <ImageIcon size={24} className="text-monke-primary" />
            <h2 className="text-xl font-bold text-monke-primary">Brand Identity</h2>
          </div>

          <div className="flex items-start space-x-6">
            {/* Logo Preview */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 border-2 border-monke-border rounded-lg overflow-hidden bg-monke-cream/20 flex items-center justify-center">
                {profile.logo_url ? (
                  <img
                    src={profile.logo_url}
                    alt="Business logo"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '';
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <Store size={48} className="text-monke-primary/30" />
                )}
              </div>
              <p className="text-xs text-monke-primary/60 font-medium mt-2 text-center">
                Logo Preview
              </p>
            </div>

            {/* Logo URL Input */}
            <div className="flex-1">
              <label
                htmlFor="logoUrl"
                className="block text-sm font-semibold text-monke-primary mb-2"
              >
                Logo URL
              </label>
              <input
                type="url"
                id="logoUrl"
                value={profile.logo_url}
                onChange={(e) =>
                  setProfile({ ...profile, logo_url: e.target.value })
                }
                className="w-full px-4 py-3 border-2 border-monke-border rounded-lg focus:outline-none focus:border-monke-primary focus:ring-2 focus:ring-monke-primary/20 transition-all text-monke-primary placeholder:text-monke-primary/40"
                placeholder="https://example.com/logo.png"
              />
              <p className="text-xs text-monke-primary/60 font-medium mt-2">
                Enter a publicly accessible image URL for your business logo
              </p>
            </div>
          </div>
        </motion.div>

        {/* Business Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="bg-white border-2 border-monke-border rounded-lg p-8 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center space-x-2 mb-6">
            <User size={24} className="text-monke-primary" />
            <h2 className="text-xl font-bold text-monke-primary">
              Business Information
            </h2>
          </div>

          <div className="space-y-6">
            <div>
              <label
                htmlFor="businessName"
                className="block text-sm font-semibold text-monke-primary mb-2 flex items-center gap-2"
              >
                <Store size={16} className="text-monke-neon" />
                Business Name
              </label>
              <input
                type="text"
                id="businessName"
                value={profile.business_name}
                onChange={(e) =>
                  setProfile({ ...profile, business_name: e.target.value })
                }
                className="w-full px-4 py-3 border-2 border-monke-border rounded-lg focus:outline-none focus:border-monke-primary focus:ring-2 focus:ring-monke-primary/20 transition-all text-monke-primary font-medium placeholder:text-monke-primary/40"
                placeholder="e.g., Artisan Coffee Roasters"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-semibold text-monke-primary mb-2"
              >
                Business Description
              </label>
              <textarea
                id="description"
                value={profile.description}
                onChange={(e) =>
                  setProfile({ ...profile, description: e.target.value })
                }
                rows={5}
                className="w-full px-4 py-3 border-2 border-monke-border rounded-lg focus:outline-none focus:border-monke-primary focus:ring-2 focus:ring-monke-primary/20 transition-all resize-none text-monke-primary placeholder:text-monke-primary/40"
                placeholder="Tell customers about your business, what makes it special, and what they can expect..."
              />
              <p className="text-xs text-monke-primary/60 font-medium mt-2">
                {profile.description.length} characters
              </p>
            </div>
          </div>
        </motion.div>

        {/* Wallet Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="bg-gradient-to-br from-monke-primary/5 to-monke-neon/5 border-2 border-monke-border rounded-lg p-8"
        >
          <div className="flex items-center space-x-2 mb-6">
            <Wallet size={24} className="text-monke-primary" />
            <h2 className="text-xl font-bold text-monke-primary">
              Blockchain Identity
            </h2>
          </div>

          <div>
              <label className="block text-sm font-semibold text-monke-primary mb-3">
                Connected Wallet Address
              </label>
              <div className="relative">
                <div className="px-4 py-4 bg-white border-2 border-monke-neon/30 rounded-lg shadow-sm">
                  <p className="text-sm font-mono text-monke-primary font-semibold break-all">
                    {profile.wallet_address}
                  </p>
                </div>
                <div className="absolute -top-1 -left-1 w-3 h-3 bg-monke-neon rounded-full animate-pulse" />
              </div>
              <div className="mt-3 p-3 bg-monke-neon/10 border border-monke-neon/30 rounded-lg">
                <p className="text-xs text-monke-primary/70 font-medium flex items-center gap-2">
                  <AlertCircle size={14} className="text-monke-neon flex-shrink-0" />
                  This is your unique blockchain identity. It cannot be changed and is used for all on-chain transactions.
                </p>
              </div>
            </div>
        </motion.div>

        {/* Messages Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="space-y-4"
        >
          {/* Success Message */}
          {success && (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-5 bg-green-50 border-2 border-green-200 rounded-lg flex items-center space-x-3 shadow-sm"
            >
              <CheckCircle2 size={24} className="text-green-600 flex-shrink-0" />
              <div>
                <p className="text-sm text-green-700 font-bold">Success!</p>
                <p className="text-xs text-green-600 font-medium">Your profile has been updated successfully</p>
              </div>
            </motion.div>
          )}

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-5 bg-red-50 border-2 border-red-200 rounded-lg flex items-start space-x-3 shadow-sm"
            >
              <AlertCircle size={24} className="text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-red-700 font-bold">Error</p>
                <p className="text-xs text-red-600 font-medium">{error}</p>
              </div>
            </motion.div>
          )}

          {/* Unsaved Changes Warning */}
          {hasChanges() && !success && (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-5 bg-amber-50 border-2 border-amber-200 rounded-lg flex items-center space-x-3 shadow-sm"
            >
              <AlertCircle size={24} className="text-amber-600 flex-shrink-0" />
              <div>
                <p className="text-sm text-amber-700 font-bold">Unsaved Changes</p>
                <p className="text-xs text-amber-600 font-medium">Don&apos;t forget to save your changes</p>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="flex justify-end gap-4 pt-4">
          <motion.button
            type="submit"
            disabled={saving || !hasChanges()}
            whileHover={hasChanges() && !saving ? { scale: 1.05 } : {}}
            whileTap={hasChanges() && !saving ? { scale: 0.95 } : {}}
            className={`
              px-10 py-4 font-bold rounded-lg transition-all flex items-center space-x-3 text-lg
              ${
                hasChanges() && !saving
                  ? 'bg-monke-primary text-white hover:bg-monke-accent cursor-pointer shadow-xl hover:shadow-2xl'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-sm'
              }
            `}
          >
            {saving ? (
              <>
                <Loader2 className="animate-spin" size={24} />
                <span>Saving Changes...</span>
              </>
            ) : (
              <>
                <Save size={24} />
                <span>{hasChanges() ? 'Save Changes' : 'No Changes'}</span>
              </>
            )}
          </motion.button>
        </motion.div>
      </form>
    </div>
  );
}
