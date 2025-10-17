'use client';

import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/navigation';
import { Store, Loader2 } from 'lucide-react';
import { WalletButton } from '@/components/shared/WalletButton';

export default function MerchantRegisterPage() {
  const { publicKey, connected } = useWallet();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    businessName: '',
    description: '',
    logoUrl: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!publicKey) {
      setError('Please connect your wallet first');
      return;
    }

    if (!formData.businessName.trim()) {
      setError('Business name is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/merchant/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress: publicKey.toBase58(),
          businessName: formData.businessName,
          description: formData.description || null,
          logoUrl: formData.logoUrl || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          // Merchant already exists, redirect to dashboard
          router.push('/dashboard');
          return;
        }
        throw new Error(data.error || 'Failed to register merchant');
      }

      // Success! Redirect to dashboard
      router.push('/dashboard');
    } catch (err) {
      console.error('Registration error:', err);
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  if (!connected) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-20 h-20 bg-monke-primary rounded-full mx-auto flex items-center justify-center">
            <Store size={40} className="text-white" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-monke-primary">
              Merchant Registration
            </h1>
            <p className="text-foreground/60">
              Connect your wallet to register as a merchant
            </p>
          </div>
          <div className="flex justify-center">
            <WalletButton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white border-2 border-monke-border rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-monke-primary rounded-full mx-auto flex items-center justify-center mb-4">
              <Store size={32} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-monke-primary mb-2">
              Register Your Business
            </h1>
            <p className="text-foreground/60">
              Create your merchant account to start minting NFT coupons
            </p>
          </div>

          {/* Connected Wallet Info */}
          <div className="mb-6 p-4 bg-monke-neon/10 border border-monke-neon rounded-lg">
            <p className="text-sm font-medium text-monke-primary mb-1">
              Connected Wallet
            </p>
            <p className="text-xs font-mono text-foreground/70 break-all">
              {publicKey?.toBase58()}
            </p>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Business Name */}
            <div>
              <label
                htmlFor="businessName"
                className="block text-sm font-medium text-foreground/80 mb-2"
              >
                Business Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="businessName"
                value={formData.businessName}
                onChange={(e) =>
                  setFormData({ ...formData, businessName: e.target.value })
                }
                className="w-full px-4 py-3 border-2 border-monke-border rounded-lg focus:outline-none focus:border-monke-primary transition-colors"
                placeholder="e.g., Artisan Coffee Roasters"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-foreground/80 mb-2"
              >
                Business Description (Optional)
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
                className="w-full px-4 py-3 border-2 border-monke-border rounded-lg focus:outline-none focus:border-monke-primary transition-colors resize-none"
                placeholder="Tell customers about your business..."
              />
            </div>

            {/* Logo URL */}
            <div>
              <label
                htmlFor="logoUrl"
                className="block text-sm font-medium text-foreground/80 mb-2"
              >
                Logo URL (Optional)
              </label>
              <input
                type="url"
                id="logoUrl"
                value={formData.logoUrl}
                onChange={(e) =>
                  setFormData({ ...formData, logoUrl: e.target.value })
                }
                className="w-full px-4 py-3 border-2 border-monke-border rounded-lg focus:outline-none focus:border-monke-primary transition-colors"
                placeholder="https://example.com/logo.png"
              />
              <p className="mt-1 text-xs text-foreground/50">
                You can add your logo later in settings
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-monke-primary text-white font-bold rounded-lg hover:bg-monke-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>Registering...</span>
                </>
              ) : (
                <span>Register Merchant Account</span>
              )}
            </button>
          </form>

          {/* Footer Note */}
          <div className="mt-6 pt-6 border-t-2 border-monke-border text-center">
            <p className="text-xs text-foreground/50">
              By registering, you can create and manage promotional NFT coupons
              on Solana blockchain
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
