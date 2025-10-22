import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SolanaWalletProvider } from "@/components/shared/WalletProvider";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import FloatingPitchDeckButton from "@/components/shared/FloatingPitchDeckButton";
import Footer from "@/components/shared/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DealCoupon - Best Deals & Coupons Marketplace",
  description: "Discover and trade promotional deals and coupons from your favorite merchants",
  icons: {
    icon: '/favicon.svg',
    apple: '/dealcoupon-logo.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Leaflet CSS for Epic 10 Map View */}
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <SolanaWalletProvider>
          <div className="flex-grow">
            {children}
          </div>
          <Footer />
        </SolanaWalletProvider>
        <FloatingPitchDeckButton />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
