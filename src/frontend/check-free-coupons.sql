-- Check FREE coupons and their NFT mints
SELECT 
  id,
  title,
  nft_mint_address,
  price,
  is_active,
  created_at
FROM deals
WHERE price IS NULL OR price = 0
ORDER BY created_at DESC
LIMIT 10;
