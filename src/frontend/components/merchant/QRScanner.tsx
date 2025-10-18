'use client';

import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Camera, X, CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface QRScannerProps {
  onScanSuccess: (decodedText: string) => void;
  onClose: () => void;
}

export default function QRScanner({ onScanSuccess, onClose }: QRScannerProps) {
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string>('');
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const qrCodeRegionId = 'qr-reader';

  useEffect(() => {
    return () => {
      // Cleanup scanner on unmount
      if (scannerRef.current) {
        scannerRef.current
          .stop()
          .catch((err) => console.error('Failed to stop scanner:', err));
      }
    };
  }, []);

  const startScanner = async () => {
    try {
      setError('');
      setScanning(true);

      const html5QrCode = new Html5Qrcode(qrCodeRegionId);
      scannerRef.current = html5QrCode;

      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
      };

      await html5QrCode.start(
        { facingMode: 'environment' }, // Use back camera on mobile
        config,
        (decodedText) => {
          // QR code successfully scanned
          html5QrCode
            .stop()
            .then(() => {
              setScanning(false);
              onScanSuccess(decodedText);
            })
            .catch((err) => console.error('Failed to stop scanner:', err));
        },
        (errorMessage) => {
          // Scan error (ignore, happens frequently during scanning)
          console.debug('QR scan error:', errorMessage);
        }
      );
    } catch (err) {
      console.error('Error starting scanner:', err);
      setError('Failed to start camera. Please check permissions.');
      setScanning(false);
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        setScanning(false);
      } catch (err) {
        console.error('Failed to stop scanner:', err);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[#f2eecb] rounded-lg p-6 max-w-lg w-full relative"
      >
        {/* Close Button */}
        <button
          onClick={() => {
            stopScanner();
            onClose();
          }}
          className="absolute top-4 right-4 text-[#174622] hover:text-[#0d2a13] z-10"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold text-[#0d2a13] mb-4 text-center">
          Scan Coupon QR Code
        </h2>

        {/* Scanner Region */}
        <div className="mb-6">
          <div
            id={qrCodeRegionId}
            className="rounded-lg overflow-hidden bg-black"
            style={{ minHeight: '300px' }}
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
            <div className="flex items-center">
              <XCircle className="w-5 h-5 mr-2" />
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Instructions */}
        {!scanning && !error && (
          <div className="bg-[#00ff4d]/10 border border-[#00ff4d] rounded-lg p-4 mb-4">
            <p className="text-sm text-[#0d2a13] text-center">
              Click &ldquo;Start Camera&rdquo; and position the QR code within the frame
            </p>
          </div>
        )}

        {scanning && (
          <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded-lg mb-4">
            <div className="flex items-center justify-center">
              <div className="animate-pulse mr-2">●</div>
              <span>Scanning for QR code...</span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          {!scanning ? (
            <button
              onClick={startScanner}
              className="flex-1 bg-[#00ff4d] hover:bg-[#00ff4d]/90 text-[#0d2a13] font-bold py-3 rounded-lg transition-colors flex items-center justify-center"
            >
              <Camera className="w-5 h-5 mr-2" />
              Start Camera
            </button>
          ) : (
            <button
              onClick={stopScanner}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center"
            >
              <X className="w-5 h-5 mr-2" />
              Stop Camera
            </button>
          )}

          <button
            onClick={() => {
              stopScanner();
              onClose();
            }}
            className="flex-1 bg-[#174622] hover:bg-[#174622]/90 text-[#f2eecb] font-semibold py-3 rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </div>
  );
}
