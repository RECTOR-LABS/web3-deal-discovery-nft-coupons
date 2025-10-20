import { PublicKey } from '@solana/web3.js';
import { supabase } from '@/lib/database/supabase';
import { Database } from '@/lib/database/types';

type Deal = Database['public']['Tables']['deals']['Row'];
type Merchant = Database['public']['Tables']['merchants']['Row'];

interface DealWithMerchant extends Deal {
  merchants: Merchant | null;
}

export interface UserCoupon {
  mint: string;
  title: string;
  description: string;
  imageUrl: string;
  discount: number;
  expiry: Date;
  category: string;
  merchant: string;
  isExpired: boolean;
  isRedeemed: boolean;
  redemptionsRemaining: number;
}

export async function getUserCoupons(userPublicKey: PublicKey): Promise<UserCoupon[]> {
  try {
    // In a production implementation, this would:
    // 1. Query all token accounts owned by the user
    // 2. Filter for NFTs from our coupon program
    // 3. Fetch metadata for each NFT
    // 4. Parse and return coupon data

    // For MVP, we'll fetch coupons from the database that the user has claimed
    // This is tracked via the events table

    const { data: purchaseEvents, error } = await supabase
      .from('events')
      .select('deal_id, metadata')
      .eq('event_type', 'purchase')
      .eq('user_wallet', userPublicKey.toBase58());

    if (error) throw error;

    if (!purchaseEvents || purchaseEvents.length === 0) {
      return [];
    }

    // Get deal IDs from purchase events (filter out null values)
    const dealIds = purchaseEvents
      .map((event) => event.deal_id)
      .filter((id): id is string => id !== null);

    if (dealIds.length === 0) {
      return [];
    }

    // Fetch deal details
    const { data: deals, error: dealsError } = await supabase
      .from('deals')
      .select(`
        *,
        merchants (
          business_name
        )
      `)
      .in('id', dealIds);

    if (dealsError) throw dealsError;

    // Check for redemptions
    const { data: redemptions } = await supabase
      .from('events')
      .select('deal_id')
      .eq('event_type', 'redemption')
      .eq('user_wallet', userPublicKey.toBase58());

    const redeemedDealIds = new Set(redemptions?.map((r) => r.deal_id) || []);

    // Transform deals into UserCoupon format
    const coupons: UserCoupon[] = ((deals || []) as DealWithMerchant[]).map((deal) => {
      const expiryDate = new Date(deal.expiry_date!);
      const now = new Date();
      const isExpired = expiryDate < now;
      const isRedeemed = redeemedDealIds.has(deal.id);

      return {
        mint: deal.nft_mint_address,
        title: deal.title,
        description: deal.description || '',
        imageUrl: deal.image_url || '',
        discount: deal.discount_percentage || 0,
        expiry: expiryDate,
        category: deal.category || 'Other',
        merchant: deal.merchants?.business_name || 'Unknown Merchant',
        isExpired,
        isRedeemed,
        redemptionsRemaining: isRedeemed ? 0 : 1,
      };
    });

    return coupons;
  } catch (error) {
    console.error('Error fetching user coupons:', error);
    return [];
  }
}

export async function getCouponByMint(mintAddress: string): Promise<UserCoupon | null> {
  try {
    const { data: deal, error } = await supabase
      .from('deals')
      .select(`
        *,
        merchants (
          business_name
        )
      `)
      .eq('nft_mint_address', mintAddress)
      .single();

    if (error || !deal) return null;

    const expiryDate = new Date(deal.expiry_date!);
    const now = new Date();
    const isExpired = expiryDate < now;

    // Check if redeemed
    const { data: redemption } = await supabase
      .from('events')
      .select('id')
      .eq('event_type', 'redemption')
      .eq('deal_id', deal.id)
      .limit(1)
      .single();

    const isRedeemed = !!redemption;

    const dealWithMerchant = deal as unknown as DealWithMerchant;

    return {
      mint: deal.nft_mint_address,
      title: deal.title,
      description: deal.description || '',
      imageUrl: deal.image_url || '',
      discount: deal.discount_percentage || 0,
      expiry: expiryDate,
      category: deal.category || 'Other',
      merchant: dealWithMerchant.merchants?.business_name || 'Unknown Merchant',
      isExpired,
      isRedeemed,
      redemptionsRemaining: isRedeemed ? 0 : 1,
    };
  } catch (error) {
    console.error('Error fetching coupon by mint:', error);
    return null;
  }
}
