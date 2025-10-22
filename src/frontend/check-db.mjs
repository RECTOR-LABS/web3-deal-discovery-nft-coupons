import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Get merchant by wallet
const { data: merchants, error: merchantError } = await supabase
  .from('merchants')
  .select('*')
  .eq('wallet_address', 'AkXF6tAVQi7QgPh5avJoaqWk7t1ocLzLNU3ZzpvrkSbC');

if (merchantError) {
  console.error('❌ Merchant error:', merchantError);
  process.exit(1);
}

console.log('\n=== MERCHANT ===');
console.log(`ID: ${merchants[0]?.id}`);
console.log(`Name: ${merchants[0]?.business_name}`);
console.log(`Wallet: ${merchants[0]?.wallet_address}`);

if (merchants && merchants.length > 0) {
  const merchantId = merchants[0].id;

  // Get all deals for this merchant
  const { data: deals, error: dealsError } = await supabase
    .from('deals')
    .select('*')
    .eq('merchant_id', merchantId)
    .order('created_at', { ascending: false });

  if (dealsError) {
    console.error('❌ Deals error:', dealsError);
    process.exit(1);
  }

  console.log('\n=== DEALS ===');
  if (deals && deals.length > 0) {
    deals.forEach((deal, i) => {
      console.log(`\nDeal ${i + 1}:`);
      console.log(`  Title: ${deal.title}`);
      console.log(`  NFT: ${deal.nft_mint_address}`);
      console.log(`  Discount: ${deal.discount_percentage}%`);
      console.log(`  Created: ${deal.created_at}`);
    });
  } else {
    console.log('No deals found in database');
  }
  console.log(`\nTotal deals: ${deals?.length || 0}`);

  // Check for the specific NFT from latest transaction
  console.log('\n=== CHECKING LATEST TRANSACTION NFT ===');
  const { data: specificDeal, error: specificError } = await supabase
    .from('deals')
    .select('*')
    .eq('nft_mint_address', '4kQnaBzfESb6jb8jqJwtBVyEqAg8jQuT2A88dbUkEkPXXfsbY5W64w6xVrwnGfLqtpD9nPi4gvB7htUxt88a9uMz');

  if (specificError) {
    console.error('Error checking specific NFT:', specificError);
  } else if (specificDeal && specificDeal.length > 0) {
    console.log('✅ Found deal with NFT mint from transaction 4kQna...');
    console.log(specificDeal[0]);
  } else {
    console.log('❌ No deal found with that NFT mint address');
  }
}
