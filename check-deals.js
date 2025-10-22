require('dotenv').config({ path: 'src/frontend/.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing env vars');
  console.log('URL:', supabaseUrl);
  console.log('Key:', supabaseKey ? 'exists' : 'missing');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

(async () => {
  // Get merchant by wallet
  const { data: merchants, error: merchantError } = await supabase
    .from('merchants')
    .select('*')
    .eq('wallet_address', 'AkXF6tAVQi7QgPh5avJoaqWk7t1ocLzLNU3ZzpvrkSbC');

  if (merchantError) {
    console.error('Merchant error:', merchantError);
    return;
  }

  console.log('\n=== MERCHANT ===');
  console.log(JSON.stringify(merchants, null, 2));

  if (merchants && merchants.length > 0) {
    const merchantId = merchants[0].id;

    // Get deals for this merchant
    const { data: deals, error: dealsError } = await supabase
      .from('deals')
      .select('*')
      .eq('merchant_id', merchantId);

    if (dealsError) {
      console.error('Deals error:', dealsError);
      return;
    }

    console.log('\n=== DEALS ===');
    console.log(JSON.stringify(deals, null, 2));
    console.log('\nTotal deals:', deals ? deals.length : 0);
  }
})();
