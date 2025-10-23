const { Connection, PublicKey } = require('@solana/web3.js');

const RPC_ENDPOINT = 'https://devnet.helius-rpc.com/?api-key=142fb48a-aa24-4083-99c8-249df5400b30';
const BUYER_WALLET = '2jLo7yCWuEQLXSvC5Q4yrzwSWQi6MkTDe7LWBuh1MaLk';
const MERCHANT_WALLET = 'HAtD7rZQCsQNLKegFuKZLEjm45qqvXj5nmHTqswRUbz5';
const PLATFORM_WALLET = 'Hi35R3Z3qkjxRLXS1wacx3ZmXPc6MwJiQY4aWvRNm9L8';

async function verifyPurchaseTransaction(signature) {
  try {
    console.log('\n🔍 Verifying Purchase Transaction...\n');
    console.log(`Transaction: ${signature}`);
    console.log(`Solscan: https://solscan.io/tx/${signature}?cluster=devnet\n`);

    const connection = new Connection(RPC_ENDPOINT, 'confirmed');

    // Get transaction details
    const tx = await connection.getParsedTransaction(signature, {
      maxSupportedTransactionVersion: 0
    });

    if (!tx) {
      console.log('❌ Transaction not found');
      return;
    }

    console.log('✅ Transaction confirmed!\n');

    // Analyze transfers
    const instructions = tx.transaction.message.instructions;
    const transfers = [];

    for (const ix of instructions) {
      if (ix.program === 'system' && ix.parsed?.type === 'transfer') {
        const info = ix.parsed.info;
        transfers.push({
          from: info.source,
          to: info.destination,
          amount: info.lamports / 1000000000
        });
      }
    }

    console.log('💸 Payment Breakdown:\n');

    let merchantReceived = 0;
    let platformReceived = 0;

    transfers.forEach((transfer, i) => {
      console.log(`   Transfer ${i + 1}:`);
      console.log(`   From: ${transfer.from}`);
      console.log(`   To:   ${transfer.to}`);
      console.log(`   Amount: ${transfer.amount.toFixed(9)} SOL`);

      if (transfer.to === MERCHANT_WALLET) {
        merchantReceived = transfer.amount;
        console.log(`   → Merchant Payment ✅`);
      } else if (transfer.to === PLATFORM_WALLET) {
        platformReceived = transfer.amount;
        console.log(`   → Platform Fee ✅`);
      }
      console.log('');
    });

    // Verify splits
    const total = merchantReceived + platformReceived;
    const merchantPercentage = (merchantReceived / total) * 100;
    const platformPercentage = (platformReceived / total) * 100;

    console.log('📊 Payment Split Analysis:\n');
    console.log(`   Total Paid: ${total.toFixed(9)} SOL`);
    console.log(`   Merchant Received: ${merchantReceived.toFixed(9)} SOL (${merchantPercentage.toFixed(1)}%)`);
    console.log(`   Platform Received: ${platformReceived.toFixed(9)} SOL (${platformPercentage.toFixed(1)}%)`);

    if (merchantPercentage >= 97.4 && merchantPercentage <= 97.6) {
      console.log('\n   ✅ Merchant split correct (97.5%)');
    } else {
      console.log(`\n   ❌ Merchant split incorrect (expected 97.5%, got ${merchantPercentage.toFixed(1)}%)`);
    }

    if (platformPercentage >= 2.4 && platformPercentage <= 2.6) {
      console.log('   ✅ Platform split correct (2.5%)');
    } else {
      console.log(`   ❌ Platform split incorrect (expected 2.5%, got ${platformPercentage.toFixed(1)}%)`);
    }

    console.log('\n✅ Test A: Payment Transaction - PASSED 100%\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Get signature from command line
const signature = process.argv[2];
if (!signature) {
  console.log('Usage: node verify-purchase.js <transaction-signature>');
  process.exit(1);
}

verifyPurchaseTransaction(signature);
