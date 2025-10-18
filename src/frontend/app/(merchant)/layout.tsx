'use client';

import { Sidebar } from '@/components/merchant/Sidebar';
import { Header } from '@/components/merchant/Header';

export default function MerchantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-monke-cream">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gradient-to-b from-monke-cream via-monke-cream to-monke-primary/5">
          <div className="container mx-auto px-6 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
