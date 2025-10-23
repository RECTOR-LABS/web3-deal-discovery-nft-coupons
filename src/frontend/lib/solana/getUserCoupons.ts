import { PublicKey, Connection as _Connection } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { supabase } from '@/lib/database/supabase';
import { Database } from '@/lib/database/types';
import { getConnection } from './connection';

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

/**
 * Fetch user's coupons from blockchain (source of truth for ownership)
 * Then enrich with metadata from database
 */
export async function getUserCoupons(userPublicKey: PublicKey): Promise<UserCoupon[]> {
  try {
    const connection = getConnection();

    // 1. Get all token accounts owned by user
    const tokenAccounts = await connection.getTokenAccountsByOwner(
      userPublicKey,
      { programId: TOKEN_PROGRAM_ID }
    );

    console.log(`[getUserCoupons] Found ${tokenAccounts.value.length} token accounts for user`);

    if (tokenAccounts.value.length === 0) {
      return [];
    }

    // 2. Parse token accounts to get mint addresses (filter for NFTs: amount = 1, decimals = 0)
    const mintAddresses: string[] = [];

    for (const { account } of tokenAccounts.value) {
      // Parse token account data
      // Layout: mint (32 bytes) + owner (32 bytes) + amount (8 bytes) + ...
      const data = account.data;
      const mint = new PublicKey(data.slice(0, 32));
      const amount = data.readBigUInt64LE(64); // Amount at offset 64

      // NFTs have amount = 1
      if (amount === BigInt(1)) {
        mintAddresses.push(mint.toBase58());
      }
    }

    console.log(`[getUserCoupons] Found ${mintAddresses.length} NFTs (amount = 1)`);

    if (mintAddresses.length === 0) {
      return [];
    }

    // 3. Fetch deal details from database for these mints
    const { data: deals, error: dealsError } = await supabase
      .from('deals')
      .select(`
        *,
        merchants (
          business_name
        )
      `)
      .in('nft_mint_address', mintAddresses);

    if (dealsError) throw dealsError;

    if (!deals || deals.length === 0) {
      console.log('[getUserCoupons] No matching deals found in database for these NFT mints');
      return [];
    }

    console.log(`[getUserCoupons] Found ${deals.length} matching deals in database`);

    // 4. Check for redemptions (redeemed NFTs are burned on-chain, but check events for historical data)
    const { data: redemptions } = await supabase
      .from('events')
      .select('deal_id')
      .eq('event_type', 'redemption')
      .eq('user_wallet', userPublicKey.toBase58());

    const redeemedDealIds = new Set(redemptions?.map((r) => r.deal_id) || []);

    // 5. Transform deals into UserCoupon format
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
