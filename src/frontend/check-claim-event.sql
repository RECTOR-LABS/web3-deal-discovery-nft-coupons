-- Check if the FREE coupon claim was recorded
SELECT
  e.id,
  e.event_type,
  e.user_wallet,
  e.deal_id,
  e.transaction_signature,
  e.created_at,
  d.title as deal_title,
  d.nft_mint_address
FROM events e
LEFT JOIN deals d ON e.deal_id = d.id
WHERE d.nft_mint_address = 'FgA3qfgxhRysHkR6g4Am3DuZh72iseEVtC14ShGfoNjt'
ORDER BY e.created_at DESC
LIMIT 10;
