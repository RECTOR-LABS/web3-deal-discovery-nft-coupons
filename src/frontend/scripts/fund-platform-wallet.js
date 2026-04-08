// eslint-disable-next-line @typescript-eslint/no-require-imports
const { Connection, Keypair: _Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram: _SystemProgram, Transaction: _Transaction } = require('@solana/web3.js');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const _fs = require('fs');

const PLATFORM_WALLET = 'Hi35R3Z3qkjxRLXS1wacx3ZmXPc6MwJiQY4aWvRNm9L8';
const RPC_ENDPOINT = process.env.HELIUS_API_KEY ? `https://devnet.helius-rpc.com/?api-key=${process.env.HELIUS_API_KEY}` : 'https://api.devnet.solana.com';

async function fundPlatformWallet() {
  try {
    console.log('🔄 Initializing platform wallet...\n');

    // Connect to Solana
    const connection = new Connection(RPC_ENDPOINT, 'confirmed');

    // Load sender wallet (you'll need to provide the keypair)
    console.log('📝 Please provide the sender wallet private key (JSON array format):');
    console.log('Example: [123,45,67,...] or path to keypair file');
    console.log('\nOr we can use Phantom to send manually.\n');

    // For now, let's just verify the platform wallet status
    const platformPubkey = new PublicKey(PLATFORM_WALLET);
    const accountInfo = await connection.getAccountInfo(platformPubkey);

    if (accountInfo) {
      const balance = accountInfo.lamports / LAMPORTS_PER_SOL;
      console.log('✅ Platform wallet already initialized!');
      console.log(`   Address: ${PLATFORM_WALLET}`);
      console.log(`   Balance: ${balance.toFixed(9)} SOL\n`);
      console.log('✅ Ready to test paid coupon purchases!');
    } else {
      console.log('❌ Platform wallet NOT initialized yet');
      console.log(`   Address: ${PLATFORM_WALLET}`);
      console.log('\n📋 To initialize, send SOL using one of these methods:');
      console.log('\n1. Via Phantom wallet:');
      console.log('   - Open Phantom');
      console.log('   - Click Send');
      console.log('   - Paste: Hi35R3Z3qkjxRLXS1wacx3ZmXPc6MwJiQY4aWvRNm9L8');
      console.log('   - Amount: 0.001 SOL');
      console.log('   - Confirm\n');
      console.log('2. Via Solana CLI:');
      console.log(`   solana transfer ${PLATFORM_WALLET} 0.001 --url devnet\n`);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

fundPlatformWallet();
