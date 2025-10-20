'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

/**
 * GDPR-Compliant Cookie Consent Banner
 * Shows on first visit, stores consent in localStorage
 *
 * To use: Add <CookieConsentBanner /> to your root layout
 */
export function CookieConsentBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already consented
    const consent = localStorage.getItem('dealcoupon-cookie-consent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('dealcoupon-cookie-consent', 'accepted');
    localStorage.setItem('dealcoupon-cookie-consent-date', new Date().toISOString());
    setShowBanner(false);

    // Track consent in analytics (optional)
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('consent', 'update', {
        analytics_storage: 'granted',
        ad_storage: 'denied', // We don't use ads
      });
    }
  };

  const handleDecline = () => {
    localStorage.setItem('dealcoupon-cookie-consent', 'declined');
    localStorage.setItem('dealcoupon-cookie-consent-date', new Date().toISOString());
    setShowBanner(false);

    // Disable analytics if declined
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('consent', 'update', {
        analytics_storage: 'denied',
        ad_storage: 'denied',
      });
    }
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#0d2a13] border-t-2 border-[#00ff4d] shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Message */}
          <div className="flex-1 text-[#f2eecb]">
            <p className="text-sm">
              🍪 We use cookies to improve your experience and analyze site traffic.
              By continuing to use this site, you agree to our{' '}
              <Link
                href="/privacy"
                className="underline hover:text-[#00ff4d] transition-colors"
              >
                Privacy Policy
              </Link>{' '}
              and{' '}
              <Link
                href="/terms"
                className="underline hover:text-[#00ff4d] transition-colors"
              >
                Terms of Service
              </Link>.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleDecline}
              className="px-4 py-2 text-sm font-medium text-[#f2eecb] border border-[#f2eecb] rounded-lg hover:bg-[#174622] transition-colors"
            >
              Decline
            </button>
            <button
              onClick={handleAccept}
              className="px-6 py-2 text-sm font-medium bg-[#00ff4d] text-[#0d2a13] rounded-lg hover:bg-[#00ff4d]/90 transition-colors"
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Check if user has given cookie consent
 */
export function hasConsent(): boolean {
  if (typeof window === 'undefined') return false;
  const consent = localStorage.getItem('dealcoupon-cookie-consent');
  return consent === 'accepted';
}

/**
 * Get consent status
 */
export function getConsentStatus(): 'accepted' | 'declined' | 'not-set' {
  if (typeof window === 'undefined') return 'not-set';
  const consent = localStorage.getItem('dealcoupon-cookie-consent');
  if (consent === 'accepted') return 'accepted';
  if (consent === 'declined') return 'declined';
  return 'not-set';
}

export default CookieConsentBanner;
