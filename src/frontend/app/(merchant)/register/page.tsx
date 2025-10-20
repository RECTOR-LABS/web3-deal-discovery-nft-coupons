'use client';

import { useState } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/navigation';
import { Store, Loader2 } from 'lucide-react';
import { WalletButton } from '@/components/shared/WalletButton';
import { initializeMerchantDirect, isMerchantInitialized } from '@/lib/solana/merchant-direct';

export default function MerchantRegisterPage() {
  const wallet = useWallet();
  const { publicKey, connected } = wallet;
  const { connection } = useConnection();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    businessName: '',
    description: '',
    logoUrl: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!publicKey || !wallet.signTransaction) {
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
      // Step 1: Create database record
      setLoadingMessage('Creating merchant account...');
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
          // Merchant already exists, check if on-chain initialization is needed
          setLoadingMessage('Checking on-chain status...');
          const isInitialized = await isMerchantInitialized(
            connection,
            wallet as any
          );

          if (!isInitialized) {
            // Database exists but on-chain doesn't - initialize now
            setLoadingMessage('Initializing on-chain account...');
            const initResult = await initializeMerchantDirect(
              connection,
              wallet as any,
              formData.businessName
            );

            if (!initResult.success) {
              throw new Error(
                initResult.error || 'Failed to initialize merchant on-chain'
              );
            }

            console.log('✅ On-chain initialization complete:', initResult);
          }

          router.push('/dashboard');
          return;
        }
        throw new Error(data.error || 'Failed to register merchant');
      }

      // Step 2: Initialize merchant on-chain
      setLoadingMessage('Initializing on-chain account (approve in wallet)...');
      const initResult = await initializeMerchantDirect(
        connection,
        wallet as any,
        formData.businessName
      );

      if (!initResult.success) {
        // On-chain initialization failed, but database record exists
        // User can try again by visiting /register
        throw new Error(
          `Merchant account created in database, but on-chain initialization failed: ${initResult.error}. Please try registering again.`
        );
      }

      console.log('✅ Merchant registration complete:', {
        database: data.merchant,
        onChain: initResult,
      });

      // Success! Redirect to dashboard
      setLoadingMessage('Registration complete!');
      router.push('/dashboard');
    } catch (err) {
      console.error('Registration error:', err);
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
      setLoadingMessage('');
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
              Sign in to your account to register as a merchant
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
        <div className="bg-white border-2 border-monke-border rounded-lg shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-monke-primary rounded-full mx-auto flex items-center justify-center mb-4">
              <Store size={32} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-monke-primary mb-2">
              Register Your Business
            </h1>
            <p className="text-monke-primary/80 font-medium">
              Create your merchant account to start minting digital coupons
            </p>
          </div>

          {/* Account Info */}
          <div className="mb-6 p-4 bg-monke-neon/10 border-2 border-monke-neon rounded-lg">
            <p className="text-sm font-bold text-monke-primary mb-1">
              ✅ Account
            </p>
            <p className="text-xs font-mono text-monke-primary/80 font-medium break-all">
              {publicKey?.toBase58()}
            </p>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Business Name */}
            <div>
              <label
                htmlFor="businessName"
                className="block text-sm font-semibold text-monke-primary mb-2"
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
                className="w-full px-4 py-3 border-2 border-monke-border rounded-lg focus:outline-none focus:border-monke-primary focus:ring-2 focus:ring-monke-primary/20 transition-all text-monke-primary placeholder:text-monke-primary/50"
                placeholder="e.g., Artisan Coffee Roasters"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-semibold text-monke-primary mb-2"
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
                className="w-full px-4 py-3 border-2 border-monke-border rounded-lg focus:outline-none focus:border-monke-primary focus:ring-2 focus:ring-monke-primary/20 transition-all resize-none text-monke-primary placeholder:text-monke-primary/50"
                placeholder="Tell customers about your business..."
              />
            </div>

            {/* Logo URL */}
            <div>
              <label
                htmlFor="logoUrl"
                className="block text-sm font-semibold text-monke-primary mb-2"
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
                className="w-full px-4 py-3 border-2 border-monke-border rounded-lg focus:outline-none focus:border-monke-primary focus:ring-2 focus:ring-monke-primary/20 transition-all text-monke-primary placeholder:text-monke-primary/50"
                placeholder="https://example.com/logo.png"
              />
              <p className="mt-1 text-xs text-monke-primary/60 font-medium">
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
              className="w-full py-4 bg-monke-primary text-white font-bold rounded-lg hover:bg-monke-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>{loadingMessage || 'Registering...'}</span>
                </>
              ) : (
                <span>Register Merchant Account</span>
              )}
            </button>
          </form>

          {/* Footer Note */}
          <div className="mt-6 pt-6 border-t-2 border-monke-border text-center">
            <p className="text-xs text-monke-primary/70 font-medium">
              By registering, you can create and manage promotional digital coupons
              on secure digital ledger
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
