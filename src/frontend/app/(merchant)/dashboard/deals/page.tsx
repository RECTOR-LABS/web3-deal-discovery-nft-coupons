'use client';

import Link from 'next/link';
import { PlusCircle, Package } from 'lucide-react';

export default function MyDealsPage() {
  // TODO: Fetch deals from database where merchant_id = current merchant

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-monke-primary mb-2">My Deals</h1>
          <p className="text-foreground/60">Manage your NFT coupon deals</p>
        </div>
        <Link
          href="/dashboard/create"
          className="px-6 py-3 bg-monke-primary text-white font-bold rounded-lg hover:bg-monke-accent transition-colors flex items-center space-x-2"
        >
          <PlusCircle size={20} />
          <span>Create Deal</span>
        </Link>
      </div>

      {/* Empty State */}
      <div className="bg-white border-2 border-monke-border rounded-lg p-12 text-center">
        <div className="max-w-md mx-auto space-y-4">
          <div className="w-20 h-20 bg-monke-cream border-2 border-monke-border rounded-full mx-auto flex items-center justify-center">
            <Package size={40} className="text-monke-primary" />
          </div>
          <h3 className="text-2xl font-bold text-monke-primary">No Deals Yet</h3>
          <p className="text-foreground/60">
            You haven't created any deals yet. Start by creating your first promotional
            NFT coupon.
          </p>
          <Link
            href="/dashboard/create"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-monke-primary text-white font-bold rounded-lg hover:bg-monke-accent transition-colors"
          >
            <PlusCircle size={20} />
            <span>Create Your First Deal</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
