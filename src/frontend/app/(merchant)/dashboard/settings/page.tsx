'use client';

import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Store, Loader2, Save, AlertCircle, CheckCircle2 } from 'lucide-react';

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
            setProfile({
              business_name: data.merchant.business_name || '',
              description: data.merchant.description || '',
              logo_url: data.merchant.logo_url || '',
              wallet_address: data.merchant.wallet_address,
            });
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
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-monke-primary mb-2">Settings</h1>
        <p className="text-foreground/60">Manage your merchant profile</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Business Profile */}
        <div className="bg-white border-2 border-monke-border rounded-lg p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Store size={20} className="text-monke-primary" />
            <h2 className="text-lg font-bold text-monke-primary">
              Business Profile
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="businessName"
                className="block text-sm font-medium text-foreground/80 mb-2"
              >
                Business Name
              </label>
              <input
                type="text"
                id="businessName"
                value={profile.business_name}
                onChange={(e) =>
                  setProfile({ ...profile, business_name: e.target.value })
                }
                className="w-full px-4 py-3 border-2 border-monke-border rounded-lg focus:outline-none focus:border-monke-primary transition-colors"
                placeholder="Your business name"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-foreground/80 mb-2"
              >
                Description
              </label>
              <textarea
                id="description"
                value={profile.description}
                onChange={(e) =>
                  setProfile({ ...profile, description: e.target.value })
                }
                rows={4}
                className="w-full px-4 py-3 border-2 border-monke-border rounded-lg focus:outline-none focus:border-monke-primary transition-colors resize-none"
                placeholder="Describe your business..."
              />
            </div>

            <div>
              <label
                htmlFor="logoUrl"
                className="block text-sm font-medium text-foreground/80 mb-2"
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
                className="w-full px-4 py-3 border-2 border-monke-border rounded-lg focus:outline-none focus:border-monke-primary transition-colors"
                placeholder="https://example.com/logo.png"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground/80 mb-2">
                Wallet Address
              </label>
              <div className="px-4 py-3 bg-gray-50 border-2 border-monke-border rounded-lg">
                <p className="text-sm font-mono text-foreground/70 break-all">
                  {profile.wallet_address}
                </p>
              </div>
              <p className="text-xs text-foreground/50 mt-1">
                Your wallet address cannot be changed
              </p>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2">
            <CheckCircle2 size={20} className="text-green-600" />
            <p className="text-sm text-green-600 font-medium">
              Profile updated successfully!
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2">
            <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 bg-monke-primary text-white font-bold rounded-lg hover:bg-monke-accent transition-colors disabled:opacity-50 flex items-center space-x-2"
          >
            {saving ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save size={20} />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
