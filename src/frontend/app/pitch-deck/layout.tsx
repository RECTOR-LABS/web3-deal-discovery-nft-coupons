import { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://dealcoupon.rectorspace.com'),
  title: 'DealCoupon - MonkeDAO Hackathon Pitch Deck',
  description: 'Web3 Deal Discovery Platform - Groupon Meets DeFi. MonkeDAO Cypherpunk Hackathon Submission. 10/10 Epics Complete | Production-Ready',
  openGraph: {
    title: 'DealCoupon - Hackathon Pitch Deck',
    description: '10/10 Epics Complete | Production-Ready Deal Marketplace',
    url: 'https://dealcoupon.rectorspace.com/pitch-deck',
    siteName: 'DealCoupon',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DealCoupon - MonkeDAO Hackathon',
    description: '10/10 Epics Complete | Production-Ready Deal Marketplace',
    images: ['/og-image.png'],
  },
};

export default function PitchDeckLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
