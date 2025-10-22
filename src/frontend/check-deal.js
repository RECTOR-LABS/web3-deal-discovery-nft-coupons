const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: 'src/frontend/.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDeal() {
  const nftMint = '5SctCf9vba8ehN1ALDfpY5CFyE3LgwhNbW2hRzze8f1w';
  const wallet = 'AkXF6tAVQi7QgPh5avJoaqWk7t1ocLzLNU3ZzpvrkSbC';

  // Check merchant
  console.log('Checking merchant...');
  const { data: merchant, error: merchError } = await supabase
    .from('merchants')
    .select('*')
    .eq('wallet_address', wallet)
    .single();

  if (merchError) {
    console.error('Merchant error:', merchError);
  } else {
    console.log('✅ Merchant found:', merchant);
  }

  // Check deals for this NFT
  console.log('\nChecking deal by NFT mint...');
  const { data: dealByMint, error: mintError } = await supabase
    .from('deals')
    .select('*')
    .eq('nft_mint_address', nftMint);

  if (mintError) {
    console.error('Deal lookup error:', mintError);
  } else if (dealByMint && dealByMint.length > 0) {
    console.log('✅ Deal found:', dealByMint);
  } else {
    console.log('❌ Deal NOT found in database');
  }

  // Check all deals for merchant
  if (merchant) {
    console.log('\nChecking all deals for merchant...');
    const { data: allDeals, error: dealsError } = await supabase
      .from('deals')
      .select('*')
      .eq('merchant_id', merchant.id);

    if (dealsError) {
      console.error('Deals error:', dealsError);
    } else {
      const count = allDeals ? allDeals.length : 0;
      console.log(`Found ${count} deals for merchant`);
      if (allDeals && allDeals.length > 0) {
        console.log('Deals:', allDeals);
      }
    }
  }
}

checkDeal().catch(console.error);
