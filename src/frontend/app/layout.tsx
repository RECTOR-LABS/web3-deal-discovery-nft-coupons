import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SolanaWalletProvider } from "@/components/shared/WalletProvider";
import PrivyAuthProvider from "@/components/shared/PrivyAuthProvider";

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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <PrivyAuthProvider>
          <SolanaWalletProvider>
            {children}
          </SolanaWalletProvider>
        </PrivyAuthProvider>
      </body>
    </html>
  );
}
