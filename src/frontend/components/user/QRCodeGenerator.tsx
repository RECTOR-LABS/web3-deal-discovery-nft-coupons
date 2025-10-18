'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { UserCoupon } from '@/lib/solana/getUserCoupons';
import { QRCodeSVG } from 'qrcode.react';
import { X, Download } from 'lucide-react';
import { motion } from 'framer-motion';

interface QRCodeGeneratorProps {
  coupon: UserCoupon;
  onClose: () => void;
}

export default function QRCodeGenerator({ coupon, onClose }: QRCodeGeneratorProps) {
  const { publicKey, signMessage } = useWallet();
  const [qrData, setQrData] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function generateQRData() {
      if (!publicKey || !signMessage) {
        setLoading(false);
        return;
      }

      try {
        // Create message to sign
        const message = `Redeem coupon: ${coupon.mint} at ${Date.now()}`;
        const encodedMessage = new TextEncoder().encode(message);

        // Sign message with wallet
        const signature = await signMessage(encodedMessage);

        // Create QR data payload
        const qrPayload = {
          nftMint: coupon.mint,
          userWallet: publicKey.toBase58(),
          signature: Buffer.from(signature).toString('base64'),
          timestamp: Date.now(),
          title: coupon.title,
          discount: coupon.discount,
        };

        setQrData(JSON.stringify(qrPayload));
      } catch (error) {
        console.error('Error generating QR code:', error);
        alert('Failed to generate QR code. Please try again.');
        onClose();
      } finally {
        setLoading(false);
      }
    }

    generateQRData();
  }, [publicKey, signMessage, coupon, onClose]);

  const downloadQR = () => {
    const svg = document.getElementById('redemption-qr');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');

      const downloadLink = document.createElement('a');
      downloadLink.download = `coupon-${coupon.mint}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[#f2eecb] rounded-lg p-8 max-w-md w-full relative"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#174622] hover:text-[#0d2a13]"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold text-[#0d2a13] mb-4 text-center">
          Redeem Coupon
        </h2>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-[#174622]">Generating QR code...</div>
          </div>
        ) : qrData ? (
          <>
            {/* Coupon Info */}
            <div className="bg-[#0d2a13]/5 rounded-lg p-4 mb-6">
              <h3 className="font-bold text-[#0d2a13] mb-2">{coupon.title}</h3>
              <p className="text-sm text-[#174622]">
                <strong>Discount:</strong> {coupon.discount}%
              </p>
              <p className="text-sm text-[#174622]">
                <strong>Merchant:</strong> {coupon.merchant}
              </p>
              <p className="text-sm text-[#174622]">
                <strong>Expires:</strong> {coupon.expiry.toLocaleDateString()}
              </p>
            </div>

            {/* QR Code */}
            <div className="bg-white p-8 rounded-lg flex items-center justify-center mb-6">
              <QRCodeSVG
                id="redemption-qr"
                value={qrData}
                size={256}
                level="H"
                includeMargin={true}
              />
            </div>

            {/* Instructions */}
            <div className="bg-[#00ff4d]/10 border border-[#00ff4d] rounded-lg p-4 mb-6">
              <p className="text-sm text-[#0d2a13] font-medium text-center">
                Show this QR code to the merchant to redeem your coupon
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <button
                onClick={downloadQR}
                className="flex-1 bg-[#174622] hover:bg-[#174622]/90 text-[#f2eecb] font-semibold py-3 rounded-lg transition-colors flex items-center justify-center"
              >
                <Download className="w-5 h-5 mr-2" />
                Download
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-[#0d2a13] hover:bg-[#0d2a13]/90 text-[#f2eecb] font-semibold py-3 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>

            {/* Warning */}
            <p className="text-xs text-[#174622] text-center mt-4">
              This QR code is valid for this redemption session only
            </p>
          </>
        ) : (
          <div className="text-center py-8">
            <p className="text-[#174622]">
              Unable to generate QR code. Please ensure your wallet is connected.
            </p>
            <button
              onClick={onClose}
              className="mt-4 bg-[#0d2a13] hover:bg-[#0d2a13]/90 text-[#f2eecb] font-semibold px-6 py-2 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
