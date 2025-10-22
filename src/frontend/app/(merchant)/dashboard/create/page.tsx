'use client';

import { useState, useEffect } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  PlusCircle,
  Image as ImageIcon,
  Loader2,
  AlertCircle,
  Calendar,
  Percent,
  Tag,
  FileText,
  Eye,
  ExternalLink,
  CheckCircle2,
  Package,
} from 'lucide-react';
import { mintCoupon } from '@/lib/solana/mint';

interface DealFormData {
  title: string;
  description: string;
  discountPercentage: string;
  expiryDate: string;
  quantity: string;
  category: string;
  imageFile: File | null;
  imagePreview: string;
}

const CATEGORIES = [
  'Food & Beverage',
  'Retail',
  'Services',
  'Travel',
  'Entertainment',
  'Other',
];

export default function CreateDealPage() {
  const { publicKey, signTransaction, signAllTransactions, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const router = useRouter();
  const [step, setStep] = useState<'form' | 'preview' | 'minting' | 'success'>('form');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [merchantId, setMerchantId] = useState<string>('');
  const [txSignature, setTxSignature] = useState<string>('');
  const [nftMint, setNftMint] = useState<string>('');
  const [formData, setFormData] = useState<DealFormData>({
    title: '',
    description: '',
    discountPercentage: '',
    expiryDate: '',
    quantity: '1',
    category: '',
    imageFile: null,
    imagePreview: '',
  });

  // Fetch merchant ID on mount
  useEffect(() => {
    const fetchMerchantId = async () => {
      if (!publicKey) return;

      try {
        const response = await fetch(
          `/api/merchant/profile?wallet=${publicKey.toBase58()}`
        );

        if (response.ok) {
          const data = await response.json();
          if (data.merchant) {
            setMerchantId(data.merchant.id);
          }
        }
      } catch (error) {
        console.error('Error fetching merchant ID:', error);
      }
    };

    fetchMerchantId();
  }, [publicKey]);

  // Form validation
  const validateForm = (): string | null => {
    if (!formData.title.trim()) return 'Title is required';
    if (formData.title.length > 100) return 'Title must be 100 characters or less';
    if (!formData.description.trim()) return 'Description is required';
    if (formData.description.length > 500)
      return 'Description must be 500 characters or less';

    const discount = parseInt(formData.discountPercentage);
    if (isNaN(discount) || discount < 1 || discount > 100) {
      return 'Discount must be between 1 and 100';
    }

    if (!formData.expiryDate) return 'Expiry date is required';
    const expiryDate = new Date(formData.expiryDate);
    if (expiryDate <= new Date()) return 'Expiry date must be in the future';

    if (!formData.category) return 'Category is required';

    return null;
  };

  // Handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (PNG, JPG, WebP)');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({
        ...formData,
        imageFile: file,
        imagePreview: reader.result as string,
      });
    };
    reader.readAsDataURL(file);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setStep('preview');
  };

  // Handle minting
  const handleMint = async () => {
    if (!publicKey || !signTransaction || !signAllTransactions || !sendTransaction) {
      setError('Please sign in to your account');
      return;
    }

    if (!merchantId) {
      setError('Merchant profile not found');
      return;
    }

    setStep('minting');
    setLoading(true);
    setError(null);

    try {
      // Create digital coupon
      const result = await mintCoupon(
        connection,
        { publicKey, signTransaction, signAllTransactions, sendTransaction },
        {
          title: formData.title,
          description: formData.description,
          discountPercentage: parseInt(formData.discountPercentage),
          expiryDate: formData.expiryDate,
          category: formData.category,
          quantity: parseInt(formData.quantity),
          imageFile: formData.imageFile,
        },
        merchantId
      );

      if (!result.success) {
        throw new Error(result.error || 'Failed to create coupon');
      }

      // Success!
      setTxSignature(result.signature || '');
      setNftMint(result.nftMint || '');
      setStep('success');
    } catch (err) {
      console.error('Minting error:', err);
      setError(err instanceof Error ? err.message : 'Failed to mint coupon');
      setStep('preview');
    } finally {
      setLoading(false);
    }
  };

  // Render success screen
  if (step === 'success') {
    const explorerUrl = `https://explorer.solana.com/tx/${txSignature}?cluster=devnet`;

    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white border-2 border-monke-border rounded-lg p-12 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-6">
            <CheckCircle2 size={48} className="text-green-600" />
          </div>

          <h1 className="text-3xl font-bold text-monke-primary mb-3">
            Deal Created Successfully! 🎉
          </h1>
          <p className="text-lg text-[#174622] mb-8">
            Your digital coupon has been created successfully
          </p>

          {/* Transaction Details */}
          <div className="bg-monke-cream border-2 border-monke-border rounded-lg p-6 space-y-4 mb-8">
            <div>
              <p className="text-sm text-[#174622] font-medium mb-1">Transaction Signature</p>
              <div className="flex items-center justify-center space-x-2">
                <p className="text-sm font-mono text-monke-primary">
                  {txSignature.slice(0, 8)}...{txSignature.slice(-8)}
                </p>
                <a
                  href={explorerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-monke-primary hover:text-monke-accent transition-colors"
                >
                  <ExternalLink size={16} />
                </a>
              </div>
            </div>

            <div>
              <p className="text-sm text-[#174622] font-medium mb-1">Coupon ID</p>
              <p className="text-sm font-mono text-monke-primary">
                {nftMint.slice(0, 8)}...{nftMint.slice(-8)}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
            <a
              href={explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3 border-2 border-monke-border text-monke-primary font-medium rounded-lg hover:bg-monke-cream transition-colors flex items-center justify-center space-x-2"
            >
              <ExternalLink size={20} />
              <span>View on Explorer</span>
            </a>

            <Link
              href="/dashboard/deals"
              className="w-full sm:w-auto px-6 py-3 bg-monke-primary text-white font-bold rounded-lg hover:bg-monke-accent transition-colors flex items-center justify-center space-x-2"
            >
              <Package size={20} />
              <span>View My Deals</span>
            </Link>
          </div>

          <div className="mt-8 pt-6 border-t-2 border-monke-border">
            <button
              onClick={() => {
                setStep('form');
                setFormData({
                  title: '',
                  description: '',
                  discountPercentage: '',
                  expiryDate: '',
                  quantity: '1',
                  category: '',
                  imageFile: null,
                  imagePreview: '',
                });
                setError(null);
                setTxSignature('');
                setNftMint('');
              }}
              className="text-monke-primary hover:text-monke-accent transition-colors font-medium cursor-pointer"
            >
              Create Another Deal
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render preview
  if (step === 'preview') {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-monke-primary mb-2">
            Preview Your Deal
          </h1>
          <p className="text-[#174622]">
            Review your deal before creating it
          </p>
        </div>

        {/* Deal Card Preview */}
        <div className="bg-white border-2 border-monke-border rounded-lg overflow-hidden shadow-lg">
          {/* Deal Image */}
          {formData.imagePreview && (
            <div className="aspect-video w-full overflow-hidden bg-gray-100">
              <img
                src={formData.imagePreview}
                alt={formData.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Deal Details */}
          <div className="p-6 space-y-4">
            {/* Discount Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-monke-neon text-white font-bold rounded-lg text-2xl">
              {formData.discountPercentage}% OFF
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-monke-primary">
              {formData.title}
            </h2>

            {/* Description */}
            <p className="text-[#174622]">{formData.description}</p>

            {/* Metadata Grid */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t-2 border-monke-border">
              <div>
                <p className="text-sm text-[#174622] font-medium">Category</p>
                <p className="font-medium text-monke-primary">{formData.category}</p>
              </div>
              <div>
                <p className="text-sm text-[#174622] font-medium">Expires</p>
                <p className="font-medium text-monke-primary">
                  {new Date(formData.expiryDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-[#174622] font-medium">Quantity</p>
                <p className="font-medium text-monke-primary">{formData.quantity}</p>
              </div>
              <div>
                <p className="text-sm text-[#174622] font-medium">Redemptions</p>
                <p className="font-medium text-monke-primary">Single-use</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between mt-8">
          <button
            onClick={() => setStep('form')}
            className="px-6 py-3 border-2 border-monke-border text-monke-primary font-medium rounded-lg hover:bg-monke-cream transition-colors cursor-pointer"
          >
            ← Back to Edit
          </button>
          <button
            onClick={handleMint}
            disabled={loading}
            className="px-8 py-3 bg-monke-primary text-white font-bold rounded-lg hover:bg-monke-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center space-x-2"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                <span>Minting...</span>
              </>
            ) : (
              <>
                <PlusCircle size={20} />
                <span>Confirm & Create Deal</span>
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2">
            <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
      </div>
    );
  }

  // Render form
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-monke-primary mb-2">
          Create New Deal
        </h1>
        <p className="text-[#174622]">
          Create a new digital coupon for your customers to save and redeem
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Deal Title */}
        <div className="bg-white border-2 border-monke-border rounded-lg p-6">
          <div className="flex items-center space-x-2 mb-4">
            <FileText size={20} className="text-monke-primary" />
            <h2 className="text-lg font-bold text-monke-primary">Deal Information</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-[#0d2a13] font-semibold mb-2"
              >
                Deal Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 border-2 border-monke-border rounded-lg focus:outline-none focus:border-monke-primary transition-colors text-[#0d2a13] placeholder:text-[#0d2a13]/50"
                placeholder="e.g., 50% Off All Coffee Beans"
                maxLength={100}
              />
              <p className="text-xs text-[#174622] font-medium mt-1">
                {formData.title.length}/100 characters
              </p>
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-[#0d2a13] font-semibold mb-2"
              >
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={4}
                className="w-full px-4 py-3 border-2 border-monke-border rounded-lg focus:outline-none focus:border-monke-primary transition-colors resize-none text-[#0d2a13] placeholder:text-[#0d2a13]/50"
                placeholder="Describe your deal in detail..."
                maxLength={500}
              />
              <p className="text-xs text-[#174622] font-medium mt-1">
                {formData.description.length}/500 characters
              </p>
            </div>
          </div>
        </div>

        {/* Deal Terms */}
        <div className="bg-white border-2 border-monke-border rounded-lg p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Tag size={20} className="text-monke-primary" />
            <h2 className="text-lg font-bold text-monke-primary">Deal Terms</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="discount"
                className="block text-sm font-medium text-[#0d2a13] font-semibold mb-2"
              >
                Discount Percentage <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Percent
                  size={20}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#174622]"
                />
                <input
                  type="number"
                  id="discount"
                  value={formData.discountPercentage}
                  onChange={(e) =>
                    setFormData({ ...formData, discountPercentage: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-3 border-2 border-monke-border rounded-lg focus:outline-none focus:border-monke-primary transition-colors text-[#0d2a13] placeholder:text-[#0d2a13]/50"
                  placeholder="50"
                  min="1"
                  max="100"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="expiry"
                className="block text-sm font-medium text-[#0d2a13] font-semibold mb-2"
              >
                Expiry Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar
                  size={20}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#174622]"
                />
                <input
                  type="date"
                  id="expiry"
                  value={formData.expiryDate}
                  onChange={(e) =>
                    setFormData({ ...formData, expiryDate: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-3 border-2 border-monke-border rounded-lg focus:outline-none focus:border-monke-primary transition-colors text-[#0d2a13]"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-[#0d2a13] font-semibold mb-2"
              >
                Category <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full px-4 py-3 border-2 border-monke-border rounded-lg focus:outline-none focus:border-monke-primary transition-colors bg-white text-[#0d2a13]"
              >
                <option value="">Select category...</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="quantity"
                className="block text-sm font-medium text-[#0d2a13] font-semibold mb-2"
              >
                Quantity (Optional)
              </label>
              <input
                type="number"
                id="quantity"
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({ ...formData, quantity: e.target.value })
                }
                className="w-full px-4 py-3 border-2 border-monke-border rounded-lg focus:outline-none focus:border-monke-primary transition-colors text-[#0d2a13] placeholder:text-[#0d2a13]/50"
                placeholder="Unlimited"
                min="1"
              />
            </div>
          </div>
        </div>

        {/* Image Upload */}
        <div className="bg-white border-2 border-monke-border rounded-lg p-6">
          <div className="flex items-center space-x-2 mb-4">
            <ImageIcon size={20} className="text-monke-primary" />
            <h2 className="text-lg font-bold text-monke-primary">Deal Image</h2>
          </div>

          <div className="space-y-4">
            {/* Image Preview */}
            {formData.imagePreview && (
              <div className="relative aspect-video w-full overflow-hidden bg-gray-100 rounded-lg border-2 border-monke-border">
                <img
                  src={formData.imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, imageFile: null, imagePreview: '' })
                  }
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors cursor-pointer"
                >
                  Remove
                </button>
              </div>
            )}

            {/* Upload Button */}
            {!formData.imagePreview && (
              <label className="block">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <div className="border-2 border-dashed border-monke-border rounded-lg p-12 text-center cursor-pointer hover:border-monke-primary hover:bg-monke-cream/50 transition-colors">
                  <ImageIcon size={48} className="mx-auto text-monke-primary mb-4" />
                  <p className="text-lg font-medium text-monke-primary mb-2">
                    Upload Deal Image
                  </p>
                  <p className="text-sm text-[#174622]">
                    PNG, JPG, WebP • Max 5MB • Recommended: 16:9 aspect ratio
                  </p>
                </div>
              </label>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2">
            <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.push('/dashboard')}
            className="px-6 py-3 border-2 border-monke-border text-monke-primary font-medium rounded-lg hover:bg-monke-cream transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-8 py-3 bg-monke-primary text-white font-bold rounded-lg hover:bg-monke-accent transition-colors cursor-pointer flex items-center space-x-2"
          >
            <Eye size={20} />
            <span>Preview Deal</span>
          </button>
        </div>
      </form>
    </div>
  );
}
